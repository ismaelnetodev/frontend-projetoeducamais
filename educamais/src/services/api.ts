import axios from "axios";

const API_URL = "https://projeto-educa-mais-production.up.railway.app";

const api = axios.create({
    baseURL: API_URL
});

export const setAuthToken = (token: string | null) => {
    if (token){
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export default api;