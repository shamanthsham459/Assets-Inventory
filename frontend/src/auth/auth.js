// src/context/AuthContext.js

import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate

  ////////
  React.useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    navigate('/')
  };

  ///////


  // const login = () => {
  //   setIsAuthenticated(true);
  // };

  // const logout = () => {
  //   setIsAuthenticated(false);
  //   navigate('/')
  // };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

export const useAuth = () => useContext(AuthContext);
