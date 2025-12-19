// Data Dosen
// Edit file ini untuk menambah/mengubah data dosen

const DOSEN_DATA = [
    {
        id: 1,
        nama: "Dr. Budi Santoso, M.Kom",
        nidn: "12345678",
        email: "budi.santoso@univ.ac.id",
        noHp: "6281234567890",
        foto: "https://ui-avatars.com/api/?name=Budi+Santoso&background=4287f5&color=fff&size=128",
        bidang: "Informatika Medis"
    },
    {
        id: 2,
        nama: "Prof. Siti Aminah, S.Si., M.Sc.",
        nidn: "23456789",
        email: "siti.aminah@univ.ac.id",
        noHp: "6281234567891",
        foto: "https://ui-avatars.com/api/?name=Siti+Aminah&background=4287f5&color=fff&size=128",
        bidang: "Sistem Basis Data"
    },
    {
        id: 3,
        nama: "Dr. Andi Wijaya, M.T.",
        nidn: "34567890",
        email: "andi.wijaya@univ.ac.id",
        noHp: "6281234567892",
        foto: "https://ui-avatars.com/api/?name=Andi+Wijaya&background=4287f5&color=fff&size=128",
        bidang: "Kecerdasan Buatan"
    },
    {
        id: 4,
        nama: "Dr. Rina Fitriani, M.Kom",
        nidn: "45678901",
        email: "rina.fitriani@univ.ac.id",
        noHp: "6281234567893",
        foto: "https://ui-avatars.com/api/?name=Rina+Fitriani&background=4287f5&color=fff&size=128",
        bidang: "Pemrograman Web"
    },
    {
        id: 5,
        nama: "Dr. Hendra Kusuma, M.Sc.",
        nidn: "56789012",
        email: "hendra.kusuma@univ.ac.id",
        noHp: "6281234567894",
        foto: "https://ui-avatars.com/api/?name=Hendra+Kusuma&background=4287f5&color=fff&size=128",
        bidang: "Jaringan Komputer"
    }
];

// Helper function untuk mendapatkan sapaan
function getSapaan(namaDosen) {
    const namaLower = namaDosen.toLowerCase();
    if (namaLower.includes('siti') || namaLower.includes('rina') || namaLower.includes('dewi') || namaLower.includes('sri')) {
        return 'Bu';
    }
    return 'Pak';
}
