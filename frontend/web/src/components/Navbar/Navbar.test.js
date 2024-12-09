import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

// Mock de useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Setup voor de fetch mock
let mockFetchResponse = { ok: false };

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    mockFetchResponse = { ok: false };

    // Mock de fetch functie
    jest.spyOn(global, 'fetch').mockImplementation((url) => {
      if (url.includes('/verify-token/') && sessionStorage.getItem('token')) {
        mockFetchResponse = { ok: true };
      } else {
        mockFetchResponse = { ok: false };
      }
      return Promise.resolve({
        ok: mockFetchResponse.ok,
        json: () => Promise.resolve({}),
      });
    });
  });

  afterEach(() => {
    global.fetch.mockRestore();
  });

  test('renders logo and MAP button', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    expect(screen.getByAltText('logo')).toBeInTheDocument();
    expect(screen.getByText('MAP')).toBeInTheDocument();
  });

  test('shows LOGIN button when not authenticated', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    expect(screen.getByText('LOGIN')).toBeInTheDocument();
    expect(screen.queryByText('LOGOUT')).not.toBeInTheDocument();
    expect(screen.queryByText('UPLOAD')).not.toBeInTheDocument();
  });

  test('shows LOGOUT and UPLOAD buttons when authenticated', async () => {
    sessionStorage.setItem('token', 'fake-token');
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('LOGOUT')).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(screen.getByText('UPLOAD')).toBeInTheDocument();
    });
  });

  test('navigates to map page when MAP button is clicked', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText('MAP'));
    expect(mockNavigate).toHaveBeenCalledWith('/map');
  });

  test('logs out when LOGOUT button is clicked', async () => {
    sessionStorage.setItem('token', 'fake-token');
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('LOGOUT')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('LOGOUT'));
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(sessionStorage.getItem('token')).toBeNull();
    });
  });

  test('navigates to login page when LOGIN button is clicked', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText('LOGIN'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('navigates to upload page when UPLOAD button is clicked', async () => {
    sessionStorage.setItem('token', 'fake-token');
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('UPLOAD')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('UPLOAD'));
    expect(mockNavigate).toHaveBeenCalledWith('/upload');
  });
});