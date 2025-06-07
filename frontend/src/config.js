const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://oj-backend.onrender.com/api'
    : 'http://localhost:5001/api'
};

export default config; 