import api from './api';

const reportService = {
    async getPublicReports(params = {}) {
        const response = await api.get('/api/reports', { params });
        return response.data;
    },

    async getReport(id) {
        const response = await api.get(`/api/reports/${id}`);
        return response.data;
    },

    async getCategories() {
        const response = await api.get('/api/categories');
        return response.data;
    },
};

export default reportService;