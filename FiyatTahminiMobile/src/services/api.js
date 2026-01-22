import axios from 'axios';

// ngrok HTTPS URL - Backend API base URL
const API_BASE_URL = 'https://glandular-nonopprobrious-kairi.ngrok-free.dev';

// Axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    },
});

// API functions
export const authAPI = {
    // Kullanıcı kaydı
    register: async (username, email, password) => {
        const response = await api.post('/api/auth/register', {
            kullaniciAdi: username,
            email: email,
            sifre: password,
        });
        return response.data;
    },

    // Kullanıcı girişi
    login: async (username, password) => {
        const response = await api.post('/api/auth/login', {
            kullaniciAdi: username,
            sifre: password,
        });
        return response.data;
    },
};

export const predictionAPI = {
    // Fiyat tahmini
    predict: async (data) => {
        const response = await api.post('/api/analiz/tahmin', data);
        return response.data;
    },
};

export const phoneAPI = {
    // Telefon değerleme (Gemini API)
    evaluate: async (phoneData) => {
        const response = await api.post('/api/telefon-degerleme', phoneData);
        return response.data;
    },
};

export const mailAPI = {
    // Mail gönderme
    send: async (to, subject, message) => {
        const response = await api.post('/api/mail/gonder', {
            to,
            subject,
            message,
        });
        return response.data;
    },
};

export default api;
