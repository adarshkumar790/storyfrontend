import axios from 'axios';

const backendURL = 'https://storybackend-3pn7.onrender.com'
// Create an instance of Axios with default settings
const api = axios.create({
    baseURL: `${backendURL}/api`, 
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
