// WhatsApp Utility Functions

const WhatsAppUtils = {
    // Generate WhatsApp link dengan template pesan
    generateLink(dosen, mataKuliah = null) {
        // Format nomor HP (hapus karakter non-digit)
        const phoneNumber = dosen.noHp.replace(/\D/g, '');

        // Buat pesan dari template
        let message = CONFIG.whatsappTemplate
            .replace('{sapaan}', getSapaan(dosen.nama))
            .replace('{nama_dosen}', dosen.nama.split(',')[0]) // Ambil nama tanpa gelar belakang
            .replace('{nama_mk}', mataKuliah ? mataKuliah.nama : '...');

        // Encode message untuk URL
        const encodedMessage = encodeURIComponent(message);

        return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    },

    // Buka WhatsApp
    openChat(dosen, mataKuliah = null) {
        const link = this.generateLink(dosen, mataKuliah);
        window.open(link, '_blank');
    }
};
