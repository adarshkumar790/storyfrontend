import axios from 'axios';

// Create an instance of Axios with default settings
const api = axios.create({
    baseURL: `https://storybackend-3pn7.onrender.com/api`, // your backend URL
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
