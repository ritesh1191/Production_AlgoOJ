import api from './api.config';
import { toast } from 'react-toastify';

const register = async (username, email, password, adminCode = '') => {
  try {
    console.log('Registering new user...');
    const response = await api.post('/api/auth/register', {
      username,
      email,
      password,
      adminCode
    });
    if (response.data.token) {
      const userData = {
        token: response.data.token,
        ...response.data.user
      };
      localStorage.setItem('user', JSON.stringify(userData));
      const role = response.data.user.role;
      toast.success(`Registration successful! ${role === 'admin' ? 'Welcome Administrator! 🚀' : 'Welcome aboard! 🚀'}`);
    }
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    const message = error.response?.data?.message || 'Registration failed';
    toast.error(message);
    throw error;
  }
};

const login = async (email, password) => {
  try {
    console.log('Logging in user...');
    const response = await api.post('/api/auth/login', {
      email,
      password,
    });
    if (response.data.token) {
      const userData = {
        token: response.data.token,
        ...response.data.user
      };
      localStorage.setItem('user', JSON.stringify(userData));
      const role = response.data.user.role;
      toast.success(`Welcome back${role === 'admin' ? ' Administrator' : ''}! 👋`);
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    const message = error.response?.data?.message || 'Login failed';
    toast.error(message);
    throw error;
  }
};

const logout = () => {
  console.log('Logging out user...');
  localStorage.removeItem('user');
  toast.info('Logged out successfully');
};

const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    console.log('No user found in localStorage');
    return null;
  }
  
  try {
    const user = JSON.parse(userStr);
    // Verify the user object has the required fields
    if (!user.token || !user.id || !user.role) {
      console.warn('Invalid user data in localStorage');
      localStorage.removeItem('user');
      return null;
    }
    return user;
  } catch (error) {
    console.error('Error parsing user data:', error);
    localStorage.removeItem('user');
    return null;
  }
};

const refreshUserData = async () => {
  try {
    console.log('Refreshing user data...');
    const response = await api.get('/api/auth/me');
    const currentUser = getCurrentUser();
    if (currentUser) {
      const updatedUserData = {
        ...currentUser,
        ...response.data
      };
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      return updatedUserData;
    }
    return null;
  } catch (error) {
    console.error('Error refreshing user data:', error);
    if (error.response?.status === 401) {
      logout();
    }
    return null;
  }
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  refreshUserData
};

export default authService; 