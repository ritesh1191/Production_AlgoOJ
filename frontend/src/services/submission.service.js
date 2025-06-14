import api from './api.config';

const getAllSubmissions = async () => {
  try {
    const response = await api.get('/api/submissions');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getSubmissionById = async (id) => {
  try {
    const response = await api.get(`/api/submissions/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createSubmission = async (submissionData) => {
  try {
    const response = await api.post('/api/submissions', submissionData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getUserSubmissions = async () => {
  try {
    const response = await api.get('/api/submissions/my-submissions');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getProblemSubmissions = async (problemId) => {
  try {
    const response = await api.get(`/api/submissions/problem/${problemId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const submissionService = {
  getAllSubmissions,
  getSubmissionById,
  createSubmission,
  getUserSubmissions,
  getProblemSubmissions
};

export default submissionService; 