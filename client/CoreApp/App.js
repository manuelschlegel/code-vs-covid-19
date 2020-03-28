import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  NativeEventEmitter,
  NativeModules,
  Platform,
  PermissionsAndroid,
  ScrollView,
  AppState,
  FlatList,
  Dimensions,
  Button,
  SafeAreaView,
  AsyncStorage
} from 'react-native';
import BleManager from 'react-native-ble-manager';;

const window = Dimensions.get('window');

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);


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

    this.state.userID = this._retrieveUserID();
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

  _storeUserID = async () => {
    userID = Math.floor(Math.random() * 100000000000000) + 1;
    try {
        await AsyncStorage.setItem('UserID', userID);
    } catch (error) {
        // Error saving data
    }
    return userID
  }

      // fetch the data back asyncronously
  _retrieveUserID = async () => {
    try {
        let userID = await AsyncStorage.getItem('UserID');
        if (value !== null) {
            // Our data is fetched successfully
            return userID
        } else {
          return this._storeUserID()
        }
    } catch (error) {
        // Error retrieving data
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

    let body = JSON.stringify({
      userId: this.state.userID,
      userMacAdress: 'none',
      detectedDeviceMacAdress: peripheral.id,
      detectedDeviceName: peripheral.name,
      detectedDeviceRssi: peripheral.rssi
    })
    this.sendMessageToAPI(body);

    peripherals.set(peripheral.id, peripheral);
    this.setState({ peripherals });
    this.setState({
      latestPeripheral: peripheral
    })
  }

  async sendMessageToAPI(body) {
    fetch('https://nq8suf5nj7.execute-api.us-east-1.amazonaws.com/dev/registerpheripheral', {
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
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <View style={{margin: 10}}>
            <Text>{this.state.latestPeripheral.id}</Text>      
          </View>             
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    width: window.width,
    height: window.height
  },
  scroll: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    margin: 10,
  },
  row: {
    margin: 10
  },
});