import React, { createContext, useContext, useState } from 'react';
import API from '../api/axios';


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
  });

  const login = async (email, password) => {
    try {
        const response = await API.post('api/v1/auth/authenticate', {
          email,
          password,
        });
        const { token } = response.data;
        if (token) {
          localStorage.setItem('token', token);
          setAuthState({
            token,
            isAuthenticated: true,
          });
          return true;
        }
      } catch (error) {
        console.error('Login failed:', error.response ? error.response.data : error.message);
        return false;
      }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      token: null,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};