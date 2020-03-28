import * as React from 'react';
import { View, StyleSheet } from 'react-native';

function RingScore(props) {
  return (
    <View style={styles.circle} />
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 100,
    height: 100,
    borderRadius: 100/2,
    backgroundColor: 'red'
}
});

export default RingScore;
