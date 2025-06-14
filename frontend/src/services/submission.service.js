import api from './api.config';
import { toast } from 'react-toastify';

const getAllSubmissions = async () => {
  try {
    console.log('Fetching all submissions...');
    const response = await api.get('/api/submissions');
    console.log('Submissions fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching submissions:', error);
    const message = error.response?.data?.message || 'Failed to fetch submissions';
    toast.error(message);
    throw error;
  }
};

const getSubmissionById = async (id) => {
  try {
    console.log('Fetching submission by ID:', id);
    const response = await api.get(`/api/submissions/${id}`);
    console.log('Submission fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching submission:', error);
    const message = error.response?.data?.message || 'Failed to fetch submission';
    toast.error(message);
    throw error;
  }
};

const createSubmission = async (submissionData) => {
  try {
    console.log('Creating new submission:', submissionData);
    const response = await api.post('/api/submissions', submissionData);
    console.log('Submission created successfully:', response.data);
    toast.success('Submission created successfully!');
    return response.data;
  } catch (error) {
    console.error('Error creating submission:', error);
    const message = error.response?.data?.message || 'Failed to create submission';
    toast.error(message);
    throw error;
  }
};

const getUserSubmissions = async () => {
  try {
    console.log('Fetching user submissions...');
    const response = await api.get('/api/submissions/my-submissions');
    console.log('User submissions fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    const message = error.response?.data?.message || 'Failed to fetch your submissions';
    toast.error(message);
    throw error;
  }
};

const getProblemSubmissions = async (problemId) => {
  try {
    console.log('Fetching submissions for problem:', problemId);
    const response = await api.get(`/api/submissions/problem/${problemId}`);
    console.log('Problem submissions fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching problem submissions:', error);
    const message = error.response?.data?.message || 'Failed to fetch problem submissions';
    toast.error(message);
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