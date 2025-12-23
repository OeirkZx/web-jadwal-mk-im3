// Data Manager - Handles CRUD operations with Supabase Backend
// Data disimpan di cloud database, bisa diakses semua user

const DataManager = {
    // Cache data lokal untuk performa
    cache: {
        dosen: null,
        matakuliah: null,
        jadwal: null,
        lastFetch: null
    },

    // Waktu cache valid (5 menit)
    CACHE_DURATION: 5 * 60 * 1000,

    // Flag apakah sudah terinisialisasi
    initialized: false,

    // ============================================
    // INITIALIZATION
    // ============================================

    async init() {
        console.log('[DataManager] Initializing with Supabase backend...');

        // Load initial data
        await this.refreshAllData();

        this.initialized = true;
        console.log('[DataManager] Initialization complete');
    },

    async refreshAllData() {
        try {
            // Fetch all data from Supabase
            const [dosen, matakuliah, jadwal] = await Promise.all([
                SupabaseClient.get('dosen', 'order=id'),
                SupabaseClient.get('matakuliah', 'order=id'),
                SupabaseClient.get('jadwal', 'order=hari,jam_mulai')
            ]);

            // Update cache
            this.cache.dosen = dosen || [];
            this.cache.matakuliah = matakuliah || [];
            this.cache.jadwal = jadwal || [];
            this.cache.lastFetch = Date.now();

            console.log('[DataManager] Data refreshed from Supabase');

            // Fallback to default data if database is empty
            if (this.cache.dosen.length === 0) {
                console.log('[DataManager] Database empty, using default data');
                this.cache.dosen = DOSEN_DATA || [];
                this.cache.matakuliah = MATAKULIAH_DATA || [];
                this.cache.jadwal = JADWAL_DATA || [];
            }

        } catch (error) {
            console.error('[DataManager] Failed to fetch from Supabase:', error);
            // Fallback to default data from JS files
            this.cache.dosen = DOSEN_DATA || [];
            this.cache.matakuliah = MATAKULIAH_DATA || [];
            this.cache.jadwal = JADWAL_DATA || [];
        }
    },

    isCacheValid() {
        if (!this.cache.lastFetch) return false;
        return (Date.now() - this.cache.lastFetch) < this.CACHE_DURATION;
    },

    // ============================================
    // DOSEN CRUD
    // ============================================

    getDosen() {
        return this.cache.dosen || [];
    },

    async fetchDosen() {
        const data = await SupabaseClient.get('dosen', 'order=id');
        if (data) {
            this.cache.dosen = data;
        }
        return this.cache.dosen;
    },

    getDosenById(id) {
        return this.getDosen().find(d => d.id === id);
    },

    async addDosen(dosen) {
        // Generate avatar if no foto provided
        if (!dosen.foto) {
            dosen.foto = `https://ui-avatars.com/api/?name=${encodeURIComponent(dosen.nama)}&background=4287f5&color=fff&size=128`;
        }

        // Map to database column names
        const dbData = {
            nama: dosen.nama,
            nidn: dosen.nidn,
            no_hp: dosen.noHp,
            email: dosen.email,
            bidang: dosen.bidang,
            foto: dosen.foto
        };

        const result = await SupabaseClient.insert('dosen', dbData);
        if (result && result.length > 0) {
            await this.fetchDosen();
            return this.mapDosenFromDb(result[0]);
        }
        return null;
    },

    async updateDosen(id, updates) {
        const dbData = {};
        if (updates.nama) dbData.nama = updates.nama;
        if (updates.nidn) dbData.nidn = updates.nidn;
        if (updates.noHp) dbData.no_hp = updates.noHp;
        if (updates.email) dbData.email = updates.email;
        if (updates.bidang) dbData.bidang = updates.bidang;
        if (updates.foto) dbData.foto = updates.foto;

        // Regenerate avatar if name changed and no custom foto
        if (updates.nama && !updates.foto) {
            dbData.foto = `https://ui-avatars.com/api/?name=${encodeURIComponent(updates.nama)}&background=4287f5&color=fff&size=128`;
        }

        dbData.updated_at = new Date().toISOString();

        const result = await SupabaseClient.update('dosen', id, dbData);
        if (result) {
            await this.fetchDosen();
            return true;
        }
        return false;
    },

    async deleteDosen(id) {
        const result = await SupabaseClient.delete('dosen', id);
        if (result) {
            await this.fetchDosen();
            await this.fetchJadwal(); // Jadwal related to this dosen will be deleted by CASCADE
        }
        return result;
    },

    // Map database columns to JS object
    mapDosenFromDb(dbRow) {
        return {
            id: dbRow.id,
            nama: dbRow.nama,
            nidn: dbRow.nidn,
            noHp: dbRow.no_hp,
            email: dbRow.email,
            bidang: dbRow.bidang,
            foto: dbRow.foto
        };
    },

    // ============================================
    // MATA KULIAH CRUD
    // ============================================

    getMataKuliah() {
        return this.cache.matakuliah || [];
    },

    async fetchMataKuliah() {
        const data = await SupabaseClient.get('matakuliah', 'order=id');
        if (data) {
            this.cache.matakuliah = data;
        }
        return this.cache.matakuliah;
    },

    getMataKuliahById(id) {
        return this.getMataKuliah().find(m => m.id === id);
    },

    async addMataKuliah(mk) {
        const result = await SupabaseClient.insert('matakuliah', mk);
        if (result && result.length > 0) {
            await this.fetchMataKuliah();
            return result[0];
        }
        return null;
    },

    async updateMataKuliah(id, updates) {
        updates.updated_at = new Date().toISOString();
        const result = await SupabaseClient.update('matakuliah', id, updates);
        if (result) {
            await this.fetchMataKuliah();
            return true;
        }
        return false;
    },

    async deleteMataKuliah(id) {
        const result = await SupabaseClient.delete('matakuliah', id);
        if (result) {
            await this.fetchMataKuliah();
            await this.fetchJadwal(); // Related jadwal deleted by CASCADE
        }
        return result;
    },

    // ============================================
    // JADWAL CRUD
    // ============================================

    getJadwal() {
        return this.cache.jadwal || [];
    },

    async fetchJadwal() {
        const data = await SupabaseClient.get('jadwal', 'order=hari,jam_mulai');
        if (data) {
            this.cache.jadwal = data;
        }
        return this.cache.jadwal;
    },

    getJadwalById(id) {
        return this.getJadwal().find(j => j.id === id);
    },

    async addJadwal(jadwal) {
        // Map to database column names
        const dbData = {
            hari: jadwal.hari,
            jam_mulai: jadwal.jamMulai,
            jam_selesai: jadwal.jamSelesai,
            ruangan: jadwal.ruangan,
            mk_id: jadwal.mkId,
            dosen_id: jadwal.dosenId,
            pj_nama: jadwal.pjNama
        };

        const result = await SupabaseClient.insert('jadwal', dbData);
        if (result && result.length > 0) {
            await this.fetchJadwal();
            return this.mapJadwalFromDb(result[0]);
        }
        return null;
    },

    async updateJadwal(id, updates) {
        const dbData = {};
        if (updates.hari) dbData.hari = updates.hari;
        if (updates.jamMulai) dbData.jam_mulai = updates.jamMulai;
        if (updates.jamSelesai) dbData.jam_selesai = updates.jamSelesai;
        if (updates.ruangan) dbData.ruangan = updates.ruangan;
        if (updates.mkId) dbData.mk_id = updates.mkId;
        if (updates.dosenId) dbData.dosen_id = updates.dosenId;
        if (updates.pjNama) dbData.pj_nama = updates.pjNama;

        dbData.updated_at = new Date().toISOString();

        const result = await SupabaseClient.update('jadwal', id, dbData);
        if (result) {
            await this.fetchJadwal();
            return true;
        }
        return false;
    },

    async deleteJadwal(id) {
        const result = await SupabaseClient.delete('jadwal', id);
        if (result) {
            await this.fetchJadwal();
        }
        return result;
    },

    // Map database columns to JS object
    mapJadwalFromDb(dbRow) {
        return {
            id: dbRow.id,
            hari: dbRow.hari,
            jamMulai: dbRow.jam_mulai,
            jamSelesai: dbRow.jam_selesai,
            ruangan: dbRow.ruangan,
            mkId: dbRow.mk_id,
            dosenId: dbRow.dosen_id,
            pjNama: dbRow.pj_nama
        };
    },

    // ============================================
    // HELPER FUNCTIONS
    // ============================================

    getJadwalWithDetails(jadwal) {
        // Handle both DB format and JS format
        const mkId = jadwal.mk_id || jadwal.mkId;
        const dosenId = jadwal.dosen_id || jadwal.dosenId;

        const mk = this.getMataKuliahById(mkId);
        const dosen = this.getDosenById(dosenId);

        return {
            id: jadwal.id,
            hari: jadwal.hari,
            jamMulai: jadwal.jam_mulai || jadwal.jamMulai,
            jamSelesai: jadwal.jam_selesai || jadwal.jamSelesai,
            ruangan: jadwal.ruangan,
            mkId: mkId,
            dosenId: dosenId,
            pjNama: jadwal.pj_nama || jadwal.pjNama,
            mataKuliah: mk,
            dosen: dosen ? this.mapDosenFromDb(dosen) : null
        };
    },

    getJadwalHariIni() {
        const hariList = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const today = new Date();
        const hariIni = hariList[today.getDay()];

        return this.getJadwal()
            .filter(j => j.hari === hariIni)
            .map(j => this.getJadwalWithDetails(j))
            .filter(j => j.mataKuliah && j.dosen)
            .sort((a, b) => a.jamMulai.localeCompare(b.jamMulai));
    },

    getJadwalByHari(hari) {
        return this.getJadwal()
            .filter(j => j.hari === hari)
            .map(j => this.getJadwalWithDetails(j))
            .filter(j => j.mataKuliah && j.dosen)
            .sort((a, b) => (a.jamMulai || a.jam_mulai).localeCompare(b.jamMulai || b.jam_mulai));
    },

    // Reset to initial state (re-fetch from database)
    async resetToDefault() {
        await this.refreshAllData();
    }
};

// Initialize when loaded
(async () => {
    await DataManager.init();
})();
