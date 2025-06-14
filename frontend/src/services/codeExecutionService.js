import api from './api.config';

// Language IDs for supported languages
export const LANGUAGE_IDS = {
    python: 'python',
    cpp: 'cpp',
    java: 'java'
};

// Execute code with single input
export const executeCode = async (code, language, input) => {
    try {
        const response = await api.post('/api/code/execute', {
            code,
            language,
            input
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Submit solution for a problem
export const submitSolution = async (problemId, code, language, testCases) => {
    try {
        const response = await api.post('/api/code/evaluate', {
            problemId,
            code,
            language,
            testCases
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

const codeExecutionService = {
    executeCode,
    submitSolution,
    LANGUAGE_IDS
};

export default codeExecutionService; 