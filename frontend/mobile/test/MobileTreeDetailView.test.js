import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import MobileTreeDetailView from '../components/MobileTreeDetailView';
import * as SecureStore from 'expo-secure-store';
import data from '../../shared/data';

// Mocking necessary modules
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
}));

jest.mock('../../shared/data', () => ({
  updateTree: jest.fn(),
  deleteTree: jest.fn(),
}));

// Mocking navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('MobileTreeDetailView Component', () => {
  const tree = {
    id: 1,
    height: 5,
    diameter: 10,
    latitude: 50.9561,
    longitude: 5.35569,
    name: 'Palm Tree',
    description: 'Beautiful palm tree',
    added_at: '2024-12-09T07:54:53',
  };

  beforeEach(() => {
    SecureStore.getItemAsync.mockResolvedValue(null);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', async () => {
    // Mock route props
    const route = {
      params: {
        tree,
      },
    };

    const { getByText } = render(
      <MobileTreeDetailView route={route} />
    );

    // Checking if the tree details are rendered correctly
    expect(getByText(`Boom #${tree.id}`)).toBeTruthy();
    expect(getByText(`Height: ${tree.height} m`)).toBeTruthy();
    expect(getByText(`Diameter: ${tree.diameter} cm`)).toBeTruthy();
    expect(getByText(`Coordinates: ${tree.latitude}, ${tree.longitude}`)).toBeTruthy();
  });
});
