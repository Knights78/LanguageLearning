import axios from 'axios'
const BASE_URL=import.meta.env.MODE==="development" ? "http://localhost:5000/api" : "/api"; // Adjust the production URL as needed
export const axiosInstance = axios.create({
  baseURL: BASE_URL,//in deployment we dont have the localhost we have the domain name
  withCredentials: true,
});