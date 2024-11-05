// mobile/App.js
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SharedCode from '../shared/index'; // Gebruik het juiste pad

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{SharedCode}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
