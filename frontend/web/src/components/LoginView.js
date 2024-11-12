import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/*
Wat er nog moet gebeuren:
- mooi maken van login pagina en uploadzone
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
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDetails,
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('token', data.access_token);
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
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="Gebruikersnaam"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          display: 'block',
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />
      <input
        type="password"
        placeholder="Wachtwoord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          display: 'block',
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />
      <button onClick={handleLogin} style={{ width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Login
      </button>
      <button onClick={handleGuest} style={{ width: '100%', padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Ga verder als Gast
      </button>
    </div>
  );
};

export default Login;
