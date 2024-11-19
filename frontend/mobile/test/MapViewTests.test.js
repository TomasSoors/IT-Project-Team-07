import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import MobileMapView from '../components/MobileMapView';
import * as Location from 'expo-location';
import sharedData from '../../shared/data';

// Mock the Location module
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));

// Mock data for user location
const mockLocation = {
  coords: {
    latitude: 50.8503,
    longitude: 4.3517,
  },
};

describe('MobileMapView', () => {
  beforeEach(() => {
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue(mockLocation);
  });

  it('renders the map correctly', () => {
    const { getByTestId } = render(<MobileMapView />);
    expect(getByTestId('map-view')).toBeTruthy();
  });

  it('requests location permission', async () => {
    render(<MobileMapView />);
    expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
  });

  it('sets user location marker on map', async () => {
    const { getByTestId } = render(<MobileMapView />);
    await waitFor(() => {
      expect(getByTestId('your-location')).toBeTruthy();
    });
  });

  it('renders shared data markers', () => { 
    const { getByTestId } = render(<MobileMapView />);
    sharedData.forEach(tree => { 
        expect(getByTestId(`marker-${tree.id}`)).toBeTruthy();
        });
    });
});
