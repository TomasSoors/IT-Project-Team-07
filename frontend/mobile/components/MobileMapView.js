import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Alert, Image, Text } from 'react-native';
import MapView, { Marker, Callout, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import data from '../../shared/data';
import treeIcon from '../assets/tree-icon.png';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import infoIcon from '../assets/info.png';
import PropTypes from 'prop-types';

const MobileMapView = ({ radius }) => {
  const [location, setLocation] = useState(null);
  const [trees, setTrees] = useState([]);
  const [region, setRegion] = useState({
    latitude: 50.95306,
    longitude: 5.352692,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  });
  const navigation = useNavigation();

  const fetchTrees = async () => {
    const fetchedTrees = await data.getTrees();
    setTrees(fetchedTrees);
  };

  useFocusEffect(
    useCallback(() => {
      fetchTrees();
    }, [])
  );

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
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        });
      }
    })();

    fetchTrees();
  }, []);

  useEffect(() => {
    if (location) {
      setRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    }
  }, [location]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        testID="map-view"
      >
        {trees.map(tree => (
          <Marker
            key={tree.id}
            testID={`marker-${tree.id}`}
            coordinate={{
              latitude: tree.latitude,
              longitude: tree.longitude,
            }}>
            <Image
              source={treeIcon}
              style={styles.marker}
            />
            <Callout testID={`callout-${tree.id}`} onPress={() => navigation.navigate('TreeDetails', { tree })}>
              <View style={styles.callout}>
                <Text style={styles.infoText}>
                  <Image source={infoIcon} style={styles.infoImage}/>
                </Text>
              </View>
            </Callout>
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
        {location && (
          <Circle
            center={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            radius={radius}
            strokeWidth={1}
            strokeColor="#7FB241"
            fillColor="rgba(127, 178, 65, 0.3)"
            testID="location-circle"
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
  },
  infoImage: {
    width: 40,
    height: 40,
  },
  callout: {
    width: 40,
    height: 70,
  },
  infoText: {
    width: 40,
    height: 70,
    alignItems: 'center',
  }
});

MobileMapView.propTypes = { radius: PropTypes.number };

export default MobileMapView;
