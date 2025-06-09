import api from './api.service';

const getAllSubmissions = async () => {
  const response = await api.get('/api/submissions/all');
  return response.data;
};

const getMySubmissions = async () => {
  const response = await api.get('/api/submissions/my-submissions');
  return response.data;
};

const getProblemSubmissions = async (problemId) => {
  const response = await api.get(`/api/submissions/problem/${problemId}`);
  return response.data;
};

const createSubmission = async (submissionData) => {
  const response = await api.post('/api/submissions', submissionData);
  return response.data;
};

const getSubmissionById = async (id) => {
  const response = await api.get(`/api/submissions/${id}`);
  return response.data;
};

const submissionService = {
  getAllSubmissions,
  getMySubmissions,
  getProblemSubmissions,
  createSubmission,
  getSubmissionById
};

export default submissionService; 