import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import sharedData from '../../shared/data';
import treeIcon from '../assets/tree-icon.png';

const MobileMapView = () => {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 50.95306,
    longitude: 5.352692,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need access to your location to show it on the map.');
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      if (userLocation) {
        setLocation(userLocation.coords);
        setRegion({
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        testID="map-view"
      >
        {sharedData.map(tree => (
          <Marker
            key={tree.id}
            testID={`marker-${tree.id}`}
            coordinate={{
              latitude: tree.latitude,
              longitude: tree.longitude,
            }}
            title={tree.title}
            description={tree.description}>
            <Image
              source={treeIcon}
              style={styles.marker}
            />
          </Marker>
        ))}
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Your Location"
            description="This is where you are!"
            pinColor="blue"
            testID='your-location'
          />
        )}
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
  marker: {
    width: 30,
    height: 30,
  }
});

export default MobileMapView;
