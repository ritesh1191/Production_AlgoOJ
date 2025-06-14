import api from './api.config';

const executeCode = async (code, language, input) => {
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

const submitSolution = async (problemId, code, language) => {
    try {
        const response = await api.post('/api/code/submit', {
            problemId,
            code,
            language
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const codeExecutionService = {
    executeCode,
    submitSolution
};

export default codeExecutionService; 