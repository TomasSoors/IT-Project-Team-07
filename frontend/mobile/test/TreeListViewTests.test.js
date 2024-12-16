import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import TreeListView from '../components/TreeListView';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import data from '../../shared/data';
import { useNavigation } from '@react-navigation/native';

// Mock the Location module and Alert
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));

// Mock useNavigation and useFocusEffect from @react-navigation/native
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useFocusEffect: jest.fn((callback) => callback()),  // Directly invoke the callback for tests
}));

jest.mock('../../shared/data', () => ({
  getTrees: jest.fn(),
}));

const mockTrees = [
  { id: 1, name: 'Tree 1', latitude: 50.8503, longitude: 4.3518 },
  { id: 2, name: 'Tree 2', latitude: 50.8600, longitude: 4.3620 },
];

const mockLocation = {
  coords: {
    latitude: 50.8503,
    longitude: 4.3517,
  },
};

const mockNavigate = jest.fn();
useNavigation.mockReturnValue({
  navigate: mockNavigate,
});

describe('TreeListView', () => {
  let alertSpy;

  const setupMocks = (locationPermission = 'granted', locationData = mockLocation, treesData = mockTrees) => {
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: locationPermission });
    Location.getCurrentPositionAsync.mockResolvedValue(locationData);
    data.getTrees.mockResolvedValue(treesData);
  };

  beforeEach(() => {
    setupMocks();
    alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the tree list correctly', async () => {
    const { getByTestId } = render(<TreeListView />);
    
    await act(async () => {
      await waitFor(() => {
        expect(getByTestId('tree-list')).toBeTruthy();
      });
    });
  });

  it('requests location permission on mount', async () => {
    render(<TreeListView />);
    expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
  });

  it('shows an alert if location permission is denied', async () => {
    setupMocks('denied');

    render(<TreeListView />);

    await act(async () => {
      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          'Permission Denied',
          'We need access to your location to filter the trees.'
        );
      });
    });
  });

  it('handles empty tree data gracefully', async () => {
    setupMocks('granted', mockLocation, []);

    const { queryAllByTestId } = render(<TreeListView />);

    await act(async () => {
      await waitFor(() => {
        const treeElements = queryAllByTestId('1-text'); // Adjusted to check for the tree with id 1
        expect(treeElements.length).toBe(0);
      });
    });
  });
});
