import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import MobileMapView from './MobileMapView';
import data from '../../shared/data';
import treeIcon from '../assets/tree-icon.png';
import info from '../assets/info.png';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';

const TreeListView = () => {
  const [sliderValue, setSliderValue] = useState(100);
  const [location, setLocation] = useState(null);
  const [filteredTrees, setFilteredTrees] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    async function fetchLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need access to your location to filter the trees.');
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      if (userLocation) {
        setLocation(userLocation.coords);
      }
    }

    fetchLocation();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (location) {
        const fetchedTrees = await data.getTrees();
        const newFilteredTrees = fetchedTrees.map(tree => {
          const distance = getDistance(
            location.latitude,
            location.longitude,
            tree.latitude,
            tree.longitude
          );
          return { ...tree, distance };
        }).filter(tree => tree.distance !== undefined && tree.distance <= sliderValue);
        setFilteredTrees(newFilteredTrees);
      }
    }

    fetchData();
  }, [location, sliderValue]);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000; // Distance in meters
    return distance;
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MobileMapView style={styles.map} radius={sliderValue} />
      </View>
      <View style={styles.sliderContainer}>
        <Slider
          testID='slider'
          style={styles.slider}
          minimumValue={0}
          maximumValue={500}
          step={1}
          minimumTrackTintColor="#7FB241"
          maximumTrackTintColor="#000000"
          thumbTintColor="#7FB241"
          value={sliderValue}
          onValueChange={(value) => setSliderValue(value)}
        />
        <Text style={styles.sliderText}>{sliderValue}m</Text>
      </View>
      <View style={styles.listContainerWrapper}>
      <ScrollView testID='tree-list' style={styles.listContainer}>
        {filteredTrees.map((tree) => (
          <View key={tree.id} style={styles.listItem}>
            <Image source={treeIcon} style={styles.treeIcon} />
            <View style={styles.listTextContainer}>
              <Text testID={`${tree.id}-text`} style={styles.listText}>
                Boom #{tree.id} - {tree.distance !== undefined ? `${tree.distance.toFixed(2)} meter verwijderd` : 'Distance unknown'}
                <TouchableOpacity testID={`${tree.id}-info`} onPress={() => navigation.navigate('TreeDetails', { tree })}>
                  <Image source={info} style={styles.info} />
                </TouchableOpacity>
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
        <LinearGradient
          colors={['#ae9a64', '#f0f0f0']}
          style={styles.scrollIndicator}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    height: '50%',
  },
  map: {
    flex: 1,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderText: {
    width: 50,
    textAlign: 'center',
    fontSize: 16,
    color: '#7FB241',
  },
  listContainerWrapper: {
    flex: 1,
    position: 'relative',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollIndicator: { 
    position: 'absolute',
    right: 0,
    width: 10,
    height: '100%',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  treeIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 16,
  },
  listTextContainer: {
    flex: 1,
  },
  listText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginLeft: 8,
  }
});

export default TreeListView;
