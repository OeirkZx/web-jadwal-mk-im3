// Data Manager - Handles CRUD operations with LocalStorage
// Data awal dari file tetap ada sebagai default, tapi editan disimpan di localStorage

const DataManager = {
    STORAGE_KEYS: {
        DOSEN: 'jadwal_data_dosen',
        MATAKULIAH: 'jadwal_data_matakuliah',
        JADWAL: 'jadwal_data_jadwal',
        QUICK_LINKS: 'jadwal_data_links'
    },

    // ============================================
    // INITIALIZATION
    // ============================================

    init() {
        // Load data from localStorage or use defaults
        this.loadAllData();
    },

    loadAllData() {
        // Load or initialize each data type
        if (!localStorage.getItem(this.STORAGE_KEYS.DOSEN)) {
            this.saveDosen(DOSEN_DATA);
        }
        if (!localStorage.getItem(this.STORAGE_KEYS.MATAKULIAH)) {
            this.saveMataKuliah(MATAKULIAH_DATA);
        }
        if (!localStorage.getItem(this.STORAGE_KEYS.JADWAL)) {
            this.saveJadwal(JADWAL_DATA);
        }
    },

    // Reset ke data default
    resetToDefault() {
        localStorage.removeItem(this.STORAGE_KEYS.DOSEN);
        localStorage.removeItem(this.STORAGE_KEYS.MATAKULIAH);
        localStorage.removeItem(this.STORAGE_KEYS.JADWAL);
        this.loadAllData();
    },

    // ============================================
    // DOSEN CRUD
    // ============================================

    getDosen() {
        const data = localStorage.getItem(this.STORAGE_KEYS.DOSEN);
        return data ? JSON.parse(data) : DOSEN_DATA;
    },

    saveDosen(data) {
        localStorage.setItem(this.STORAGE_KEYS.DOSEN, JSON.stringify(data));
    },

    getDosenById(id) {
        return this.getDosen().find(d => d.id === id);
    },

    addDosen(dosen) {
        const data = this.getDosen();
        const newId = data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1;
        dosen.id = newId;

        // Generate avatar if no foto provided
        if (!dosen.foto) {
            dosen.foto = `https://ui-avatars.com/api/?name=${encodeURIComponent(dosen.nama)}&background=4287f5&color=fff&size=128`;
        }

        data.push(dosen);
        this.saveDosen(data);
        return dosen;
    },

    updateDosen(id, updates) {
        const data = this.getDosen();
        const index = data.findIndex(d => d.id === id);
        if (index !== -1) {
            data[index] = { ...data[index], ...updates };

            // Regenerate avatar if name changed and no custom foto
            if (updates.nama && !updates.foto) {
                data[index].foto = `https://ui-avatars.com/api/?name=${encodeURIComponent(updates.nama)}&background=4287f5&color=fff&size=128`;
            }

            this.saveDosen(data);
            return data[index];
        }
        return null;
    },

    deleteDosen(id) {
        const data = this.getDosen();
        const filtered = data.filter(d => d.id !== id);
        this.saveDosen(filtered);

        // Also remove related jadwal
        const jadwal = this.getJadwal();
        const filteredJadwal = jadwal.filter(j => j.dosenId !== id);
        this.saveJadwal(filteredJadwal);
    },

    // ============================================
    // MATA KULIAH CRUD
    // ============================================

    getMataKuliah() {
        const data = localStorage.getItem(this.STORAGE_KEYS.MATAKULIAH);
        return data ? JSON.parse(data) : MATAKULIAH_DATA;
    },

    saveMataKuliah(data) {
        localStorage.setItem(this.STORAGE_KEYS.MATAKULIAH, JSON.stringify(data));
    },

    getMataKuliahById(id) {
        return this.getMataKuliah().find(m => m.id === id);
    },

    addMataKuliah(mk) {
        const data = this.getMataKuliah();
        const newId = data.length > 0 ? Math.max(...data.map(m => m.id)) + 1 : 1;
        mk.id = newId;
        data.push(mk);
        this.saveMataKuliah(data);
        return mk;
    },

    updateMataKuliah(id, updates) {
        const data = this.getMataKuliah();
        const index = data.findIndex(m => m.id === id);
        if (index !== -1) {
            data[index] = { ...data[index], ...updates };
            this.saveMataKuliah(data);
            return data[index];
        }
        return null;
    },

    deleteMataKuliah(id) {
        const data = this.getMataKuliah();
        const filtered = data.filter(m => m.id !== id);
        this.saveMataKuliah(filtered);

        // Also remove related jadwal
        const jadwal = this.getJadwal();
        const filteredJadwal = jadwal.filter(j => j.mkId !== id);
        this.saveJadwal(filteredJadwal);
    },

    // ============================================
    // JADWAL CRUD
    // ============================================

    getJadwal() {
        const data = localStorage.getItem(this.STORAGE_KEYS.JADWAL);
        return data ? JSON.parse(data) : JADWAL_DATA;
    },

    saveJadwal(data) {
        localStorage.setItem(this.STORAGE_KEYS.JADWAL, JSON.stringify(data));
    },

    getJadwalById(id) {
        return this.getJadwal().find(j => j.id === id);
    },

    addJadwal(jadwal) {
        const data = this.getJadwal();
        const newId = data.length > 0 ? Math.max(...data.map(j => j.id)) + 1 : 1;
        jadwal.id = newId;
        data.push(jadwal);
        this.saveJadwal(data);
        return jadwal;
    },

    updateJadwal(id, updates) {
        const data = this.getJadwal();
        const index = data.findIndex(j => j.id === id);
        if (index !== -1) {
            data[index] = { ...data[index], ...updates };
            this.saveJadwal(data);
            return data[index];
        }
        return null;
    },

    deleteJadwal(id) {
        const data = this.getJadwal();
        const filtered = data.filter(j => j.id !== id);
        this.saveJadwal(filtered);
    },

    // ============================================
    // HELPER FUNCTIONS (Updated to use localStorage)
    // ============================================

    getJadwalWithDetails(jadwal) {
        const mk = this.getMataKuliahById(jadwal.mkId);
        const dosen = this.getDosenById(jadwal.dosenId);
        return {
            ...jadwal,
            mataKuliah: mk,
            dosen: dosen
        };
    },

    getJadwalHariIni() {
        const hariList = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const today = new Date();
        const hariIni = hariList[today.getDay()];

        return this.getJadwal()
            .filter(j => j.hari === hariIni)
            .map(j => this.getJadwalWithDetails(j))
            .filter(j => j.mataKuliah && j.dosen) // Filter out orphaned jadwal
            .sort((a, b) => a.jamMulai.localeCompare(b.jamMulai));
    },

    getJadwalByHari(hari) {
        return this.getJadwal()
            .filter(j => j.hari === hari)
            .map(j => this.getJadwalWithDetails(j))
            .filter(j => j.mataKuliah && j.dosen)
            .sort((a, b) => a.jamMulai.localeCompare(b.jamMulai));
    }
};

// Initialize on load
DataManager.init();
