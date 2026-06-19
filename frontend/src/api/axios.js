import axios from 'axios';
 const api = axios.create({
     baseURL: 'https://appointment-backend-epp5.onrender.com/api',
      headers: {
         'Content-Type': 'application/json',
        },
});
export default api;