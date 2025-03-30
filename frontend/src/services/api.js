import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Ensure this matches your backend
});

export default api; // ✅ Ensure this line is present!
