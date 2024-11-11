import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TreeList = () => (
  <View style={styles.container}>
    <Text>Page 2</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TreeList;
