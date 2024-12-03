import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import TreeList from '../components/TreeList';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import data from '../../shared/data';

// Mock the Location module
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));

// Mock the navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

// Mock the shared data
jest.mock('../../shared/data', () => ({
  getTrees: jest.fn(),
}));

const mockTrees = [
  { id: 1, latitude: 50.95306, longitude: 5.352692, title: 'Tree 1', description: 'Description 1' },
  { id: 2, latitude: 50.95316, longitude: 5.352792, title: 'Tree 2', description: 'Description 2' },
];

const mockLocation = {
  coords: { latitude: 50.95306, longitude: 5.352692 },
};

// Mock navigation.navigate
const mockNavigate = jest.fn();
useNavigation.mockReturnValue({
  navigate: mockNavigate,
});

describe('TreeList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue(mockLocation);
    data.getTrees.mockResolvedValue(mockTrees);
  });

  it('renders correctly', async () => {
    const { getByText } = render(<TreeList />);
    await act(async () => {
      await waitFor(() => {
        expect(getByText('100m')).toBeTruthy();
      });
    });
  });

  it('requests location permissions', async () => {
    render(<TreeList />);
    await act(async () => {
      await waitFor(() => {
        expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
        expect(Location.getCurrentPositionAsync).toHaveBeenCalled();
      });
    });
  });

  it('updates the slider value and filters trees', async () => {
    const { getByText, getByTestId } = render(<TreeList />);
    const slider = getByTestId('slider');

    act(() => {
      fireEvent(slider, 'onValueChange', 150);
    });

    await waitFor(() => {
      expect(getByText('150m')).toBeTruthy();
    });
  });

  it('renders tree markers from data', async () => {
    const { getByTestId } = render(<TreeList />);
    await act(async () => {
      await waitFor(() => {
        mockTrees.forEach(tree => {
          expect(getByTestId(`marker-${tree.id}`)).toBeTruthy();
        });
      });
    });
  });
});
