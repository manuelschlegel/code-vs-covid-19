import * as React from 'react';
import { Button, View, Text, StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function DevScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Here you can access the different pages:</Text>
      <Button
        title="Home Screen"
        onPress={() => navigation.navigate('Home')}
      />
      <Button
        title="p2pKit Screen"
        onPress={() => navigation.navigate('p2p Dev')}
      />
      <Button
        title="Score Screen"
        onPress={() => navigation.navigate('Scores')}
      />
      <Button
        title="StatsScreen"
        onPress={() => navigation.navigate('History')}
      />
      <Button
        title="Report Screen"
        onPress={() => navigation.navigate('Report')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center' }
});

export default DevScreen;