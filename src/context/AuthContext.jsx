import React, { createContext, useContext, useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    id: localStorage.getItem('id'),
  });

  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const response = await API.post('api/v1/auth/authenticate', {
        email,
        password,
      });
      const { token } = response.data;
      const { id } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('id', id);
        setAuthState({
          token,
          isAuthenticated: true,
          id,
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
    localStorage.removeItem('id');
    setAuthState({
      token: null,
      isAuthenticated: false,
      id: null,
    });
    navigate("/");
    return true;
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
