import React, { createContext, useReducer, useEffect } from 'react';
import * as authAPI from '../api/auth';

export const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
      };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'LOGOUT':
    case 'SIGNUP_FAIL':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: action.payload,
      };
    case 'LOGIN_SUCCESS':
    case 'SIGNUP_SUCCESS':
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: true,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load User
  const loadUser = async () => {
    try {
      const res = await authAPI.getMe();
      dispatch({
        type: 'USER_LOADED',
        payload: res.user,
      });
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  // Login User
  const login = async (formData) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const res = await authAPI.login(formData);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: res.user },
      });
      return true;
    } catch (err) {
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Login failed',
      });
      return false;
    }
  };

  // Signup User
  const signup = async (formData) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const res = await authAPI.signup(formData);
      dispatch({
        type: 'SIGNUP_SUCCESS',
        payload: { user: res.user },
      });
      return true;
    } catch (err) {
      dispatch({
        type: 'SIGNUP_FAIL',
        payload: err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Signup failed',
      });
      return false;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await authAPI.logout();
      dispatch({ type: 'LOGOUT' });
    } catch (err) {
      console.error('Logout error', err);
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Clear Errors
  const clearErrors = () => dispatch({ type: 'CLEAR_ERRORS' });

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        clearErrors,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
