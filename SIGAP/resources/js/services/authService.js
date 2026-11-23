import api, { initializeCsrf } from './api';

const authService = {
    async me() {
        const response = await api.get('/api/spa/auth/me');
        return response.data.user;
    },

    async login(credentials) {
        await initializeCsrf();

        const response = await api.post('/api/spa/auth/login', credentials);
        return response.data;
    },

    async register(data) {
        await initializeCsrf();

        const response = await api.post('/api/spa/auth/register', data);
        return response.data;
    },

    async logout() {
        await api.post('/api/spa/auth/logout');
    },
};

export default authService;