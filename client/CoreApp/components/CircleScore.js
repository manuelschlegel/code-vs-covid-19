import * as React from 'react';
import { Button, Text, View, StyleSheet, Dimensions } from 'react-native';

export function ScoringCircle(props) {
  return (
    <View style={circStyle.container}>
      <View style={circStyle.circle}><Text style={circStyle.text}>{props.children}<Text style={circStyle.textpts}>pts</Text></Text></View>
    </View>
  );
}

const circStyle = StyleSheet.create({
  container: {
    height: Dimensions.get('window').width*0.8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
    backgroundColor: 'transparent',
    padding: 0,
    marginTop: 5,
    marginBottom: 20
  },
  circle: {
    fontSize: 105,
    fontWeight: 'bold',
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width*0.75,
    height: Dimensions.get('window').width*0.75,
    borderRadius: Dimensions.get('window').width*0.9/2,
    borderWidth: Dimensions.get('window').width*0.08,
    borderColor: '#FFD700'
  },
  text: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#fff'
  },
  textpts: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff'
  }
});

export default ScoringCircle