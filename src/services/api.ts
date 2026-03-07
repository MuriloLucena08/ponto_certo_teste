import axios from 'axios';

export const api = axios.create({
    baseURL: "/api-semob",
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
    },
});

// Add interceptor to include token if we implement token-based auth later,
// though Flutter code used basic login returning ID.
