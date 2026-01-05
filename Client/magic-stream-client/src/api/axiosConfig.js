import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

if (!import.meta.env.VITE_API_BASE_URL) {
    console.warn('VITE_API_BASE_URL is not set — defaulting axios baseURL to http://localhost:8080');
}

export default axios.create({
    baseURL: apiUrl,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
})