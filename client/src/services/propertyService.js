import axios from 'axios';

const API_URL = 'http://localhost:5000/api/properties';

const getProperties = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getProperty = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const createProperty = async (propertyData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, propertyData, config);
  return response.data;
};

const updateProperty = async (id, propertyData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(`${API_URL}/${id}`, propertyData, config);
  return response.data;
};

const deleteProperty = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(`${API_URL}/${id}`, config);
  return response.data;
};

const propertyService = {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
};

export default propertyService;
