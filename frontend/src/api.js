import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const signup = async (userData, role) => {
  try {
    const response = await axios.post(`${API_URL}/user/${role}/signup`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};

export const login = async (userData, role) => {
  try {
    const response = await axios.post(`${API_URL}/user/${role}/login`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};
