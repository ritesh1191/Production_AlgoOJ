import api from './api.config';

const getAllProblems = async () => {
  try {
    console.log('Fetching all problems...');
    const response = await api.get('/api/problems');
    console.log('Problems fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching problems:', error);
    throw error;
  }
};

const getProblemById = async (id) => {
  try {
    console.log('Fetching problem by ID:', id);
    const response = await api.get(`/api/problems/${id}`);
    console.log('Problem fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching problem:', error);
    throw error;
  }
};

const createProblem = async (problemData) => {
  try {
    console.log('Creating new problem:', problemData);
    const response = await api.post('/api/problems', problemData);
    console.log('Problem created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating problem:', error);
    throw error;
  }
};

const updateProblem = async (id, problemData) => {
  try {
    console.log('Updating problem:', id, problemData);
    const response = await api.put(`/api/problems/${id}`, problemData);
    console.log('Problem updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating problem:', error);
    throw error;
  }
};

const deleteProblem = async (id) => {
  try {
    console.log('Deleting problem:', id);
    const response = await api.delete(`/api/problems/${id}`);
    console.log('Problem deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting problem:', error);
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