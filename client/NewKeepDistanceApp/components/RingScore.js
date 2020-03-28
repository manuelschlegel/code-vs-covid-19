import * as React from 'react';
import { View, StyleSheet } from 'react-native';

function RingScore(props) {
  return (
    <View style={styles.circle} />
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    height: 300,
    borderRadius: 200/2,
    backgroundColor: 'transparent',
    borderColor: 'red',
    borderWidth: 24
}
});

export default RingScore;
