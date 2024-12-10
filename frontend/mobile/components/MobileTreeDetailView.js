import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import treeIcon from '../assets/tree-icon.png';
import infoIcon from '../assets/info.png';
import * as SecureStore from 'expo-secure-store';
import data from '../../shared/data';

const MobileTreeDetailView = ({ route }) => {
  const { tree } = route.params;
  const [token, setToken] = useState(null);
  const [height, setHeight] = useState(tree.height ? `${tree.height}` : '0');
  const [diameter, setDiameter] = useState(tree.diameter ? `${tree.diameter}` : '0');

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await SecureStore.getItemAsync('token');
      setToken(storedToken);
    };

    fetchToken();
  }, []);

  const handleUpdate = async () => {
    const updatedTree = { ...tree, height: parseFloat(height), diameter: parseFloat(diameter) };
    data.updateTree(updatedTree, token);
  };

  const handleDelete = async () => {
    data.deleteTree(tree.id, token);
  };

  return (
    <View style={styles.container}>
      <Image source={infoIcon} style={styles.info} />
      <Image source={treeIcon} style={styles.image} />
      <Text style={styles.treeId}>Boom #{tree.id}</Text>
      <View style={styles.dataContainer}>
        <Text style={styles.dataTitle}>Data:</Text>
        {!token && (
          <View>
            <Text style={styles.dataItem}>Height: {height} m</Text>
            <Text style={styles.dataItem}>Diameter: {diameter} cm</Text>
          </View>
        )}
        {token && (
          <View>
            <View style={styles.dataItemContainer}>
              <Text style={styles.dataLabel}>Height:</Text>
              <TextInput
                testID="heightInput"
                style={styles.dataInput}
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
                placeholder="Height"
              />
              <Text style={styles.dataUnit}>m</Text>
            </View>
            <View style={styles.dataItemContainer}>
              <Text style={styles.dataLabel}>Diameter:</Text>
              <TextInput
                testID="diameterInput"
                style={styles.dataInput}
                keyboardType="numeric"
                value={diameter}
                onChangeText={setDiameter}
                placeholder="Diameter"
              />
              <Text style={styles.dataUnit}>cm</Text>
            </View>
          </View>
        )}
        <Text style={styles.dataItem}>Coordinates: {tree.latitude}, {tree.longitude}</Text>
        {token &&
          <View>
            <TouchableOpacity testID="updateOpacity" style={styles.buttons} onPress={handleUpdate}>
              <Text style={styles.buttonsText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity testID="verwijderOpacity" style={styles.buttons} onPress={handleDelete}>
              <Text style={styles.buttonsText}>Verwijder</Text>
            </TouchableOpacity>
          </View>
        }
      </View>
    </View>
  );
};

MobileTreeDetailView.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      tree: PropTypes.shape({
        id: PropTypes.number.isRequired,
        height: PropTypes.number,
        diameter: PropTypes.number,
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 16,
    alignSelf: 'center',
  },
  treeId: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  dataContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  dataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dataItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dataLabel: {
    fontSize: 16,
  },
  dataInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginHorizontal: 4,
    textAlign: 'center',
    width: 50,
  },
  dataUnit: {
    fontSize: 16,
  },
  dataItem: {
    fontSize: 16,
    marginBottom: 4,
  },
  info: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  buttons: {
    backgroundColor: '#AE9A64',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonsText: {
      color: 'white',
      fontWeight: 'bold',
  },
});

export default MobileTreeDetailView;
