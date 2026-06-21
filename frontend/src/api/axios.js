import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'https://appointment-booking-app-b4j5.onrender.com',
});

export default api;git