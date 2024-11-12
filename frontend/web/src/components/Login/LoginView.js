import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./LoginView.css";

/*
Wat er nog moet gebeuren:
- testen schrijven
*/

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);  // State voor foutmeldingen
  const navigate = useNavigate();

  const handleLogin = async () => {  
    // Controleer of beide velden zijn ingevuld
    if (!username || !password) {
      setError('Vul zowel gebruikersnaam als wachtwoord in.');
      return;
    }

    const formDetails = new URLSearchParams();
    formDetails.append('username', username);
    formDetails.append('password', password);

    try {
      const baseUrl = process.env.REACT_APP_EXTERNAL_IP || 'localhost';
      const response = await fetch('http://${baseUrl}:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDetails,
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        navigate('/map');
      } else if (response.status === 401) {
        setError('Ongeldige gebruikersnaam of wachtwoord.');
      } else {
        setError('Er is iets misgegaan. Probeer het opnieuw.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Er is een probleem met de server. Probeer het later opnieuw.');
    }
  };

  const handleGuest = () => {
    navigate('/map');
  };

  return (
    <div className="body-container">
    <div className="login-container">
      <img src='logopxlboom.png' alt="logo"></img>
      <h2>Login</h2>
      <label htmlFor='username'>Username</label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          display: 'block',
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '10px',
          border: '1px solid #ccc',
        }}
      />
      <label htmlFor='password'>Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          display: 'block',
          width: '100%',
          padding: '10px',
          marginBottom: '40px',
          borderRadius: '10px',
          border: '1px solid #ccc',
        }}
      />
      {error && <p style={{ color: 'red', marginBottom: '40px' }}>{error}</p>}
      <button onClick={handleLogin} style={{fontWeight: 'bold', width: '50%', padding: '10px', marginBottom: '10px', backgroundColor: '#A9907E', color: '#F3DEBA', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Login
      </button>
      <button onClick={handleGuest} style={{fontWeight: 'bold', width: '50%', padding: '10px', backgroundColor: '#F3DEBA', border: '2px solid #A9907E', color: '#A9907E', borderRadius: '4px', cursor: 'pointer' }}>
        Ga verder als gast
      </button>
    </div>
    </div>
  );
};

export default Login;
