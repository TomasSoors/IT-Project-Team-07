import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import MobileMapView from './components/MobileMapView';
import TreeList from './components/TreeList';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Map') {
              iconName = focused ? 'map' : 'map-outline';
            } else if (route.name === 'List') {
              iconName = focused ? 'list' : 'list-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#030203',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#7FB241',
            paddingBottom: 5,
          },
        })}
      >
        <Tab.Screen
          name="Map"
          component={MobileMapView}
        />
        <Tab.Screen
          name="List"
          component={TreeList}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
