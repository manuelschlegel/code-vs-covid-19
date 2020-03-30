import React, { Component } from 'react';
import {
  NativeEventEmitter,
  NativeModules,
  Platform,
  PermissionsAndroid,
  AppState,
  Dimensions,
} from 'react-native';

// npm library import
import BleManager from 'react-native-ble-manager';
import DeviceInfo from 'react-native-device-info';

// local file import
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './screens/MainScreen';

//get window dimensions
const window = Dimensions.get('window');

//set up bluetooth tracker
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

//create navigator
const Stack = createStackNavigator();

export default class App extends Component {
  constructor(){
    super()

    this.state = {
      scanning:false,
      peripherals: new Map(),
      appState: '',
      latestPeripheral: {name: "ar", id:"as", rssi:"d"}
    }

    this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
    this.handleStopScan = this.handleStopScan.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);

    this.state.userID = DeviceInfo.getUniqueId();
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    BleManager.start({showAlert: false});

    this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral );
    this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan );

    this.handlerSearch = setInterval(() => this.startScan(), 30000);

    if (Platform.OS === 'android' && Platform.Version >= 23) {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
            if (result) {
              console.log("Permission is OK");
              this.startScan()
            } else {
              PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                  console.log("User accept");
                  this.startScan()
                } else {
                  console.log("User refuse");
                }
              });
            }
      });
    }

  }

  handleAppStateChange(nextAppState) {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
      BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
        console.log('Connected peripherals: ' + peripheralsArray.length);
      });
    }
    this.setState({appState: nextAppState});
  }

  componentWillUnmount() {
    this.handlerDiscover.remove();
    this.handlerStop.remove();
    clearInterval(this.handlerSearch);
  }


  handleStopScan() {
    console.log('Scan is stopped');
    this.setState({ scanning: false });
  }

  startScan() {
    if (!this.state.scanning) {
      //this.setState({peripherals: new Map()});
      BleManager.scan([], 5, true).then((results) => {
        console.log('Scanning...');
        this.setState({scanning:true});
      });
    }
  }

  handleDiscoverPeripheral(peripheral){
    var peripherals = this.state.peripherals;
    console.log('Got ble peripheral', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'none';
    }
    if (peripheral.rssi > -65) {
      let time = new Date().toISOString()
      let body = JSON.stringify({
        userId: this.state.userID,
        userMacAddress: 'none',
        detectedDeviceMacAddress: peripheral.id,
        detectedDeviceName: peripheral.name,
        detectedDeviceRssi: peripheral.rssi,
        timeStamp: time
      })
      this.sendMessageToAPI(body);
  
      peripherals.set(peripheral.id, peripheral);
      this.setState({ peripherals });
      this.setState({
        latestPeripheral: peripheral
      })
    }
  }
  async sendMessageToAPI(body) {
    fetch('https://qpadpzm2je.execute-api.us-east-1.amazonaws.com/production/report', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body
    });
  }
  
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="KeepDistance">
          <Stack.Screen name="KeepDistance" component={MainScreen} />
          <Stack.Screen name="Details" component={MainScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}