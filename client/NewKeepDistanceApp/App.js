import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import Screen Components
import DevScreen from './screens/DevScreen';
import HomeScreen from './screens/HomeScreen';
import p2pDev from './screens/p2pDev';
import ScoreScreen from './screens/ScoreScreen';
import StatsScreen from './screens/StatsScreen';
import ReportScreen from './screens/ReportScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DevScreen">
        <Stack.Screen name="Development" component={DevScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="p2p Dev" component={p2pDev} />
        <Stack.Screen name="Scores" component={ScoreScreen} />
        <Stack.Screen name="History" component={StatsScreen} />
        <Stack.Screen name="Report" component={ReportScreen} />        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

/*
        <Stack.Screen name="Scores" component={ScoreScreen} />
        <Stack.Screen name="History" component={StatsScreen} />
        <Stack.Screen name="Report" component={ReportScreen} />
import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import DevScreen from './screens/DevScreen';
import HomeScreen from './screens/HomeScreen';
import ScoreScreen from './screens/ScoreScreen';
import StatsScreen from './screens/StatsScreen';
//import ReportScreen from './screens/ReportScreen';

const Stack = createStackNavigator();

function ReportScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.getStartedContainer}>
          <Text style={styles.getStartedText}>Most Basic components</Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <NavigationContainer>
          <Stack.Navigator initialRouteName="DevScreen">
            <Stack.Screen name="Development" component={DevScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Scores" component={ScoreScreen} />
            <Stack.Screen name="History" component={StatsScreen} />
            <Stack.Screen name="Report" component={ReportScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
*/