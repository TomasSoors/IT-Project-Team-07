// mobile/components/MapView.js
import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import sharedData from '../../shared/data';

const MobileMapView = () => {
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 50.95306,
                    longitude: 5.352692,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {sharedData.map(tree => (
                    <Marker
                        key={tree.id}
                        coordinate={{
                            latitude: tree.latitude,
                            longitude: tree.longitude,
                        }}
                        title={tree.title}
                        description={tree.description}
                    />
                ))}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default MobileMapView;
