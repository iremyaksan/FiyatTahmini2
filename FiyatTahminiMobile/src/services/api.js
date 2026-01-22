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
    register: async (username, email, password) => {
        const response = await api.post('/api/auth/register', {
            kullaniciAdi: username,
            email: email,
            sifre: password,
        });
        return response.data;
    },
    login: async (username, password) => {
        const response = await api.post('/api/auth/login', {
            kullaniciAdi: username,
            sifre: password,
        });
        return response.data;
    },
};

export const adminAPI = {
    getStats: async () => {
        const response = await api.get('/api/admin/istatistikler');
        return response.data;
    },
    getUsers: async () => {
        const response = await api.get('/api/admin/kullanicilar');
        return response.data;
    },
    deleteUser: async (id) => {
        const response = await api.delete(`/api/admin/kullanici-sil/${id}`);
        return response.data;
    },
    getAds: async () => {
        const response = await api.get('/api/admin/ilanlar');
        return response.data;
    },
    deleteAd: async (id) => {
        const response = await api.delete(`/api/admin/ilan-sil/${id}`);
        return response.data;
    },
};

export const ilanAPI = {
    getAll: async (kategori) => {
        const response = await api.get('/api/ilanlar/hepsi', { params: { kategori } });
        return response.data;
    },
    getDetail: async (id) => {
        const response = await api.get(`/api/ilanlar/${id}`);
        return response.data;
    },
    getMyAds: async (userId) => {
        const response = await api.get(`/api/ilanlar/benim/${userId}`);
        return response.data;
    },
    create: async (formData) => {
        const response = await api.post('/api/ilanlar/ekle', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/api/ilanlar/sil/${id}`);
        return response.data;
    },
};

export const messageAPI = {
    getInbox: async (userId) => {
        const response = await api.get(`/api/mesajlar/gelen-kutusu/${userId}`);
        return response.data;
    },
    send: async (data) => {
        const response = await api.post('/api/mesajlar/gonder-mobil', data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/api/mesajlar/sil/${id}`);
        return response.data;
    },
};

export const predictionAPI = {
    predict: async (data) => {
        const response = await api.post('/api/analiz/tahmin', data);
        return response.data;
    },
};

export const phoneAPI = {
    evaluate: async (phoneData) => {
        const response = await api.post('/api/telefon-degerleme', phoneData);
        return response.data;
    },
};
