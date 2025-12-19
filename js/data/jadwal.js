// Data Jadwal Kuliah
// Edit file ini untuk menambah/mengubah jadwal

const JADWAL_DATA = [
    // Senin
    {
        id: 1,
        hari: "Senin",
        mkId: 1,
        dosenId: 1,
        jamMulai: "08:00",
        jamSelesai: "10:30",
        ruangan: "R. 304",
        pjNama: "Ahmad Rizky"
    },
    {
        id: 2,
        hari: "Senin",
        mkId: 2,
        dosenId: 2,
        jamMulai: "10:30",
        jamSelesai: "12:30",
        ruangan: "Lab Komputer 1",
        pjNama: "Dewi Lestari"
    },
    {
        id: 3,
        hari: "Senin",
        mkId: 6,
        dosenId: 3,
        jamMulai: "13:00",
        jamSelesai: "15:00",
        ruangan: "R. 202",
        pjNama: "Budi Prasetyo"
    },

    // Selasa
    {
        id: 4,
        hari: "Selasa",
        mkId: 3,
        dosenId: 4,
        jamMulai: "08:00",
        jamSelesai: "10:30",
        ruangan: "Lab Komputer 2",
        pjNama: "Sari Indah"
    },
    {
        id: 5,
        hari: "Selasa",
        mkId: 4,
        dosenId: 3,
        jamMulai: "13:00",
        jamSelesai: "15:30",
        ruangan: "R. 401",
        pjNama: "Rudi Hartono"
    },

    // Rabu
    {
        id: 6,
        hari: "Rabu",
        mkId: 5,
        dosenId: 5,
        jamMulai: "10:00",
        jamSelesai: "12:00",
        ruangan: "Lab Jaringan",
        pjNama: "Eka Putri"
    },

    // Kamis
    {
        id: 7,
        hari: "Kamis",
        mkId: 1,
        dosenId: 1,
        jamMulai: "08:00",
        jamSelesai: "10:30",
        ruangan: "R. 304",
        pjNama: "Ahmad Rizky"
    },
    {
        id: 8,
        hari: "Kamis",
        mkId: 6,
        dosenId: 3,
        jamMulai: "10:30",
        jamSelesai: "12:30",
        ruangan: "R. 202",
        pjNama: "Budi Prasetyo"
    },

    // Jumat
    {
        id: 9,
        hari: "Jumat",
        mkId: 4,
        dosenId: 3,
        jamMulai: "08:00",
        jamSelesai: "10:30",
        ruangan: "R. 401",
        pjNama: "Rudi Hartono"
    },
    {
        id: 10,
        hari: "Jumat",
        mkId: 2,
        dosenId: 2,
        jamMulai: "13:00",
        jamSelesai: "15:00",
        ruangan: "Lab Komputer 1",
        pjNama: "Dewi Lestari"
    }
];

// Helper function untuk mendapatkan jadwal dengan detail lengkap
function getJadwalWithDetails(jadwal) {
    const mk = MATAKULIAH_DATA.find(m => m.id === jadwal.mkId);
    const dosen = DOSEN_DATA.find(d => d.id === jadwal.dosenId);
    return {
        ...jadwal,
        mataKuliah: mk,
        dosen: dosen
    };
}

// Helper function untuk mendapatkan jadwal hari ini
function getJadwalHariIni() {
    const hariList = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const today = new Date();
    const hariIni = hariList[today.getDay()];

    return JADWAL_DATA
        .filter(j => j.hari === hariIni)
        .map(j => getJadwalWithDetails(j))
        .sort((a, b) => a.jamMulai.localeCompare(b.jamMulai));
}

// Helper function untuk mendapatkan jadwal berdasarkan hari
function getJadwalByHari(hari) {
    return JADWAL_DATA
        .filter(j => j.hari === hari)
        .map(j => getJadwalWithDetails(j))
        .sort((a, b) => a.jamMulai.localeCompare(b.jamMulai));
}
