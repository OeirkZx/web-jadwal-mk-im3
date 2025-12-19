// Konfigurasi Aplikasi
// Edit file ini untuk mengubah pengaturan admin

const CONFIG = {
    // Nama Aplikasi
    appName: "Jadwal Informatika Medis III",
    
    // Informasi Kelas
    className: "Informatika Medis",
    semester: "Semester 5",
    academicYear: "2024/2025",
    
    // Akun Admin
    // Ubah username dan password sesuai kebutuhan
    admin: {
        username: "admin",
        password: "admin123"
    },
    
    // Template Pesan WhatsApp
    whatsappTemplate: "Halo {sapaan} {nama_dosen}, saya mahasiswa dari kelas Informatika Medis III. Saya ingin bertanya terkait mata kuliah {nama_mk}.",
    
    // Quick Links
    quickLinks: [
        {
            name: "Google Classroom",
            url: "https://classroom.google.com",
            icon: "school"
        },
        {
            name: "Google Drive",
            url: "https://drive.google.com",
            icon: "folder"
        },
        {
            name: "Portal Kampus",
            url: "https://portal.universitasmu.ac.id",
            icon: "language"
        }
    ]
};
