import api from './api';

const reportService = {
    /**
     * Daftar laporan publik.
     * Param: search, status, category_id, district, sort (newest|oldest|priority), page, per_page.
     */
    async getPublicReports(params = {}) {
        const response = await api.get('/api/reports', { params });
        return response.data;
    },

    // Jumlah laporan per kecamatan (strip statistik di halaman Semua Proyek).
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

    // Daftar laporan admin. Endpoint ini memakai autentikasi Sanctum SPA.
    async getAdminReports(params = {}) {
        const response = await api.get('/api/spa/admin/reports', { params });
        return response.data;
    },

    // Statistik dashboard admin dari agregasi database.
    async getAdminStatistics() {
        const response = await api.get('/api/spa/admin/statistics');
        return response.data;
    },

    // Mengambil seluruh halaman laporan admin, misalnya untuk monitoring SLA.
    async getAllAdminReports(perPage = 50) {
        const firstPage = await this.getAdminReports({ page: 1, per_page: perPage, sort: 'newest' });
        const allReports = Array.isArray(firstPage?.data) ? [...firstPage.data] : [];
        const lastPage = Math.max(1, Number(firstPage?.meta?.last_page) || 1);

        for (let page = 2; page <= lastPage; page += 1) {
            const response = await this.getAdminReports({ page, per_page: perPage, sort: 'newest' });
            if (Array.isArray(response?.data)) allReports.push(...response.data);
        }

        return allReports;
    },

    // Detail laporan admin (Sanctum SPA), termasuk laporan yang ditolak.
    async getAdminReport(id) {
        const response = await api.get(`/api/spa/admin/reports/${id}`);
        return response.data;
    },

    // Perubahan status laporan admin.
    async updateAdminReportStatus(id, status, note = '') {
        const response = await api.patch(`/api/spa/admin/reports/${id}/status`, {
            status,
            ...(note ? { note } : {}),
        });
        return response.data;
    },

    // Riwayat progres laporan (terlama ke terbaru).
    async getProjectUpdates(reportId) {
        const response = await api.get(`/api/spa/admin/reports/${reportId}/updates`);
        return response.data;
    },

    // Tambah progres beserta maksimal lima foto dokumentasi.
    async addProjectUpdate(reportId, { title, description, images = [] }) {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        images.forEach((image) => formData.append('images[]', image));

        const response = await api.post(
            `/api/spa/admin/reports/${reportId}/updates`,
            formData,
        );
        return response.data;
    },

    // Komentar — memakai guard Sanctum (sesi SPA), bukan JWT.
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
