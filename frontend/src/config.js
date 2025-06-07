const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export const API_URLS = {
    AUTH: `${API_BASE_URL}/api/auth`,
    PROBLEMS: `${API_BASE_URL}/api/problems`,
    SUBMISSIONS: `${API_BASE_URL}/api/submissions`,
    CODE_EXECUTION: `${API_BASE_URL}/api/code`
};

export default API_URLS; 