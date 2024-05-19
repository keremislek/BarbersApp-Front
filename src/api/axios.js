import axios from 'axios';


const API = axios.create({
  baseURL: "http://localhost:9494",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});



export default API;