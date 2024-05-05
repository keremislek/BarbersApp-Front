import axios from 'axios';


let token = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjpbeyJhdXRob3JpdHkiOiJDdXN0b21lciJ9XSwic3ViIjoiZmF0aWhAbWFpbC5jb20iLCJpYXQiOjE3MTQ5MTQ2MzMsImV4cCI6MTcxNTkzNTAyNn0.RRFrY_IzNwdPjJTrHLAZqP_wjmXXVzLA6F4inti4pSw";

const API = axios.create({
  baseURL: "http://localhost:9494",
});

API.interceptors.request.use((config) => {
 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const setToken = (newToken) => {
  token = newToken;
};

export default API;