// Date/Time Utility Functions

const DateUtils = {
    // Nama hari dalam Bahasa Indonesia
    hariList: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],

    // Nama bulan dalam Bahasa Indonesia
    bulanList: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],

    // Mendapatkan nama hari saat ini
    getHariIni() {
        return this.hariList[new Date().getDay()];
    },

    // Mendapatkan tanggal dalam format "Kamis, 19 Desember"
    getTanggalLengkap(date = new Date()) {
        const hari = this.hariList[date.getDay()];
        const tanggal = date.getDate();
        const bulan = this.bulanList[date.getMonth()];
        return `${hari}, ${tanggal} ${bulan}`;
    },

    // Mendapatkan tanggal dalam format "19 Desember 2024"
    getTanggalPendek(date = new Date()) {
        const tanggal = date.getDate();
        const bulan = this.bulanList[date.getMonth()];
        const tahun = date.getFullYear();
        return `${tanggal} ${bulan} ${tahun}`;
    },

    // Parse time string "08:00" menjadi objek Date hari ini
    parseTime(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    },

    // Cek apakah waktu saat ini berada di antara jam mulai dan selesai
    isOngoing(jamMulai, jamSelesai) {
        const now = new Date();
        const start = this.parseTime(jamMulai);
        const end = this.parseTime(jamSelesai);
        return now >= start && now <= end;
    },

    // Cek apakah waktu sudah lewat
    isPast(jamSelesai) {
        const now = new Date();
        const end = this.parseTime(jamSelesai);
        return now > end;
    },

    // Cek apakah waktu belum dimulai
    isUpcoming(jamMulai) {
        const now = new Date();
        const start = this.parseTime(jamMulai);
        return now < start;
    },

    // Menghitung selisih waktu dalam menit
    getTimeDiff(targetTime) {
        const now = new Date();
        const target = this.parseTime(targetTime);
        const diffMs = target - now;
        return Math.floor(diffMs / 60000); // Convert to minutes
    },

    // Format selisih waktu menjadi string yang readable
    formatTimeDiff(minutes) {
        if (minutes < 0) {
            const absMinutes = Math.abs(minutes);
            if (absMinutes >= 60) {
                const hours = Math.floor(absMinutes / 60);
                const mins = absMinutes % 60;
                return mins > 0 ? `${hours} jam ${mins} menit yang lalu` : `${hours} jam yang lalu`;
            }
            return `${absMinutes} menit yang lalu`;
        }

        if (minutes >= 60) {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return mins > 0 ? `${hours} jam ${mins} menit lagi` : `${hours} jam lagi`;
        }
        return `${minutes} menit lagi`;
    },

    // Mendapatkan countdown text untuk jadwal
    getCountdownText(jamMulai, jamSelesai) {
        if (this.isOngoing(jamMulai, jamSelesai)) {
            const minsRemaining = this.getTimeDiff(jamSelesai);
            return `Berakhir ${this.formatTimeDiff(minsRemaining)}`;
        }

        if (this.isUpcoming(jamMulai)) {
            const minsUntil = this.getTimeDiff(jamMulai);
            return `Mulai ${this.formatTimeDiff(minsUntil)}`;
        }

        return 'Selesai';
    }
};
