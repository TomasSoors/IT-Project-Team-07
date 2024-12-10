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
    const { getByText } = render(
      <MobileTreeDetailView route={{ params: { tree } }} />
    );

    expect(getByText(`Boom #${tree.id}`)).toBeTruthy();
    expect(getByText(`Height: ${tree.height} m`)).toBeTruthy();
    expect(getByText(`Diameter: ${tree.diameter} cm`)).toBeTruthy();
    expect(getByText(`Coordinates: ${tree.latitude}, ${tree.longitude}`)).toBeTruthy();
  });
});
