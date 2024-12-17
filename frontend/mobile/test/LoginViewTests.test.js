import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import LoginView from '../components/LoginView';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import login from '../../shared/index';
import { Alert } from 'react-native';

// Mocking necessary modules
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('../../shared/index', () => ({
  login: jest.fn(),
}));

describe('LoginView Component', () => {
  const mockNavigate = jest.fn();
  useNavigation.mockReturnValue({ navigate: mockNavigate });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByPlaceholderText, getByTestId } = render(<LoginView />);

    expect(getByPlaceholderText('Username')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByTestId('loginOpacity')).toBeTruthy();
    expect(getByTestId('logoutOpacity')).toBeTruthy();
  });

  it('handles login successfully', async () => {
    login.login.mockResolvedValue('mockToken');

    const { getByPlaceholderText, getByTestId } = render(<LoginView />);

    fireEvent.changeText(getByPlaceholderText('Username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Password'), 'testpassword');

    await act(async () => {
      fireEvent.press(getByTestId('loginOpacity'));
    });

    await waitFor(() => {
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('token', 'mockToken');
      expect(mockNavigate).toHaveBeenCalledWith('Map');
    });
  });

  it('handles login failure', async () => {
    login.login.mockRejectedValue(new Error('Login Failed'));
    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByPlaceholderText, getByTestId } = render(<LoginView />);

    fireEvent.changeText(getByPlaceholderText('Username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpassword');

    await act(async () => {
      fireEvent.press(getByTestId('loginOpacity'));
    });

    await waitFor(() => {
      expect(SecureStore.setItemAsync).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith('Login Failed', 'Login Failed');
    });

    alertSpy.mockRestore();
  });

  it('handles logout successfully', async () => {
    const { getByTestId } = render(<LoginView />);

    await act(async () => {
      fireEvent.press(getByTestId('logoutOpacity'));
    });

    await waitFor(() => {
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('token');
      expect(mockNavigate).toHaveBeenCalledWith('Map');
    });
  });
});
