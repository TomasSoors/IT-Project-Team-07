import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './LoginView';

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
 useNavigate: () => mockedUsedNavigate,
}));

describe('Login Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch.mockRestore();
  });

  test('renders the login form with inputs and buttons', () => {
    renderWithRouter(<Login />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ga verder als gast/i })).toBeInTheDocument();
  });

  test('displays error message if fields are empty and login button is clicked', async () => {
    renderWithRouter(<Login />);

    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    expect(await screen.findByText(/vul zowel gebruikersnaam als wachtwoord in/i)).toBeInTheDocument();
  });

  test('calls the login API and handles success', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: { access_token: 'test-token' } }),
    });

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testpassword' } });

    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8000/login',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
    );
  });

  test('displays error message on invalid credentials (401 response)', async () => {
    global.fetch.mockResolvedValueOnce({ status: 401 });

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });

    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    expect(await screen.findByText(/ongeldige gebruikersnaam of wachtwoord/i)).toBeInTheDocument();
  });

  test('displays error message on server/network failure', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testpassword' } });

    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    expect(await screen.findByText(/er is een probleem met de server/i)).toBeInTheDocument();
  });

  test('navigates to the map page when guest button is clicked', () => {
    renderWithRouter(<Login />);
  
    const guestButton = screen.getByRole('button', { name: /ga verder als gast/i });
    fireEvent.click(guestButton);
  
    // Check if navigate was called with the correct path
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/map');
  });
});
