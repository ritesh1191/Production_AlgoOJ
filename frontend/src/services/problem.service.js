import api from './api.service';

const getAll = async () => {
  const response = await api.get('/api/problems');
  return response.data;
};

const getById = async (id) => {
  const response = await api.get(`/api/problems/${id}`);
  return response.data;
};

const create = async (problemData) => {
  const response = await api.post('/api/problems', problemData);
  return response.data;
};

const update = async (id, problemData) => {
  const response = await api.put(`/api/problems/${id}`, problemData);
  return response.data;
};

const remove = async (id) => {
  const response = await api.delete(`/api/problems/${id}`);
  return response.data;
};

const problemService = {
  getAll,
  getById,
  create,
  update,
  remove
};

export default problemService; 