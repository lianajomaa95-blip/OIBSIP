import axios from 'axios';// Create an axios instance with the backend URL pre-configured
const api = axios.create({
baseURL: 'http://localhost:5000/api',
headers: {
'Content-Type': 'application/json',
},
});// Automatically attach the JWT token from localStorage to every request
api.interceptors.request.use((config) => {
const user = localStorage.getItem('user');
if (user) {
const { token } = JSON.parse(user);
if (token) {config.headers['Authorization'] = `Bearer ${token}`;
}
}
return config;
});export default api;