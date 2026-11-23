import api from './api';

const reportService = {
    /**
     * Daftar laporan publik.
     * Param: search, status, category_id, district, sort (terbaru|priority|oldest), page, per_page
     * Jika page/per_page dikirim, respons menyertakan `meta` (paginasi).
     */
    async getPublicReports(params = {}) {
        const response = await api.get('/api/reports', { params });
        return response.data;
    },

    // Jumlah laporan per kecamatan (strip statistik di halaman Semua Proyek)
    async getDistrictStats() {
        const response = await api.get('/api/reports/stats/districts');
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

    // Komentar — memakai guard Sanctum (sesi SPA), bukan JWT
    async addComment(reportId, comment) {
        const response = await api.post(`/api/spa/reports/${reportId}/comments`, { comment });
        return response.data;
    },

    async deleteComment(commentId) {
        const response = await api.delete(`/api/spa/comments/${commentId}`);
        return response.data;
    },
};

export default reportService;
