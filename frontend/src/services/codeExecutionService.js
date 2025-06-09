import api from './api.service';
import authHeader from './auth-header';

const API_URL = 'http://localhost:5001/api/code';

// Language IDs for Judge0 API
export const LANGUAGE_IDS = {
    python: 71,  // Python (3.8.1)
    cpp: 54,     // C++ (GCC 9.2.0)
    java: 62,    // Java (OpenJDK 13.0.1)
};

// Run code with single input
export const runCode = async (code, language, input) => {
    try {
        const response = await api.post('/api/code/execute', {
            code,
            language,
            input
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Submit code and check against all test cases
export const submitAndEvaluate = async (code, language, testCases) => {
    try {
        const response = await api.post('/api/code/evaluate', {
            code,
            language,
            testCases
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default {
    runCode,
    submitAndEvaluate
}; 