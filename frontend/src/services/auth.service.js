import api from './api.config';
import { toast } from 'react-toastify';

const register = async (username, email, password, adminCode = '') => {
  try {
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
    const message = error.response?.data?.message || 'Registration failed';
    toast.error(message);
    throw error;
  }
};

const login = async (email, password) => {
  try {
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
    const message = error.response?.data?.message || 'Login failed';
    toast.error(message);
    throw error;
  }
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
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

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default authService; 