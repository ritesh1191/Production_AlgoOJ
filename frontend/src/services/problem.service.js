import api from './api.config';

const getAllProblems = async () => {
  try {
    const response = await api.get('/api/problems');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getProblemById = async (id) => {
  try {
    const response = await api.get(`/api/problems/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createProblem = async (problemData) => {
  try {
    const response = await api.post('/api/problems', problemData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateProblem = async (id, problemData) => {
  try {
    const response = await api.put(`/api/problems/${id}`, problemData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteProblem = async (id) => {
  try {
    const response = await api.delete(`/api/problems/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const problemService = {
  getAllProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem
};

export default problemService; 