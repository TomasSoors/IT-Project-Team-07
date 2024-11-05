// mobile/App.js
import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import MobileMapView from './components/MapView';

const App = () => {
    return (
        <SafeAreaView style={styles.container}>
            <MobileMapView />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default App;
