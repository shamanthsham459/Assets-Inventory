// src/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/auth';
// import '../CSS/common.css';
import '../CSS/login.css';

const Login = () => {
  const { login } = useAuth();
  // const { login } = useContext(useAuth);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // const history = useHistory();
  
  const navigate = useNavigate();
    

    

  const handleLogin = (e) => {
    e.preventDefault();

    const hardcodedUsername = 'shamanth.s';
    const hardcodedPassword = 'shamanth.s';

    if (username === hardcodedUsername && password === hardcodedPassword) {
      login('shamanth.s');
      // login();
      navigate('/dashboard', { replace: true });
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="errorMessage">{error}</p>}
        <center><button type="submit">Login</button></center>
      </form>
    </div>
  );
};

export default Login;
