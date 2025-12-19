// Admin Dashboard Page - Updated with CRUD links

const AdminDashboard = {
    render() {
        if (!StorageUtils.isAdminLoggedIn()) {
            window.location.hash = '#/login';
            return '';
        }

        const jadwalHariIni = DataManager.getJadwalHariIni();
        const tanggal = DateUtils.getTanggalPendek();

        // Stats from DataManager
        const totalDosen = DataManager.getDosen().length;
        const totalJadwal = DataManager.getJadwal().length;
        const totalMataKuliah = DataManager.getMataKuliah().length;

        // Today's activity
        const activityHtml = jadwalHariIni.length > 0
            ? jadwalHariIni.map((j, index) => {
                const isOngoing = DateUtils.isOngoing(j.jamMulai, j.jamSelesai);
                const isPast = DateUtils.isPast(j.jamSelesai);

                let statusBadge = '';
                let opacityClass = '';

                if (isOngoing) {
                    statusBadge = `<div class="shrink-0 flex items-center gap-2 bg-green-900/30 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-800/30">
                        <div class="size-2 rounded-full bg-green-500 live-pulse"></div>
                        Berlangsung
                    </div>`;
                } else if (isPast) {
                    statusBadge = `<div class="shrink-0 text-xs font-bold text-gray-500 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">Selesai</div>`;
                    opacityClass = 'opacity-60';
                } else {
                    statusBadge = `<div class="shrink-0 text-xs font-bold text-gray-300 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">Akan Datang</div>`;
                }

                return `
                    <div class="flex items-center gap-4 bg-[#1e293b] border border-[#334155] p-4 rounded-xl shadow-sm hover:border-primary/50 transition-colors ${opacityClass}" style="animation: staggerFadeIn 0.4s ease ${index * 0.1}s backwards;">
                        <div class="text-white flex items-center justify-center rounded-lg ${isOngoing ? 'bg-primary/30' : 'bg-[#0f172a]'} shrink-0 size-12">
                            <span class="material-symbols-outlined text-2xl">schedule</span>
                        </div>
                        <div class="flex flex-col flex-1 min-w-0">
                            <h3 class="text-white text-base font-bold leading-tight truncate">${j.mataKuliah?.nama || 'N/A'}</h3>
                            <p class="text-gray-400 text-sm truncate">${j.jamMulai} - ${j.jamSelesai} • ${j.ruangan}</p>
                        </div>
                        ${statusBadge}
                    </div>
                `;
            }).join('')
            : `<div class="text-center py-8 text-gray-400 animate-fade-in">Tidak ada jadwal hari ini</div>`;

        return `
            ${Header.render(true)}
            
            <main class="flex-1 flex justify-center py-6 md:py-10 px-4 md:px-6 bg-[#0f172a] min-h-screen">
                <div class="flex flex-col max-w-[1024px] flex-1 w-full gap-8">
                    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 animate-slide-up">
                        <div class="flex flex-col gap-2">
                            <h1 class="text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Dashboard Admin</h1>
                            <p class="text-gray-400 text-base font-normal">Selamat datang, Administrator Kelas.</p>
                        </div>
                        <div class="flex items-center gap-2 text-gray-400 bg-[#1e293b] px-4 py-2 rounded-full border border-[#334155] shadow-sm">
                            <span class="material-symbols-outlined text-lg">calendar_today</span>
                            <span class="text-sm font-medium">${tanggal}</span>
                        </div>
                    </div>
                    
                    <!-- Stats Cards -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 stagger-children">
                        <a href="#/admin/dosen" class="group flex flex-col gap-4 rounded-xl p-6 bg-[#1e293b] border border-[#334155] shadow-sm hover:shadow-md hover:border-primary/50 transition-all card-hover-tilt">
                            <div class="flex justify-between items-start">
                                <div class="flex flex-col gap-1">
                                    <p class="text-gray-400 text-sm font-medium uppercase tracking-wide">Dosen</p>
                                    <p class="text-white text-4xl font-black leading-tight">${totalDosen}</p>
                                </div>
                                <div class="size-12 rounded-full bg-primary/20 text-white flex items-center justify-center group-hover:bg-primary transition-colors">
                                    <span class="material-symbols-outlined text-2xl">school</span>
                                </div>
                            </div>
                            <div class="pt-2">
                                <div class="w-full flex items-center justify-between px-4 py-3 bg-[#0f172a] group-hover:bg-primary text-white rounded-lg transition-colors">
                                    <span class="font-bold text-sm">Kelola Dosen</span>
                                    <span class="material-symbols-outlined text-lg transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </div>
                            </div>
                        </a>
                        
                        <a href="#/admin/jadwal" class="group flex flex-col gap-4 rounded-xl p-6 bg-[#1e293b] border border-[#334155] shadow-sm hover:shadow-md hover:border-primary/50 transition-all card-hover-tilt">
                            <div class="flex justify-between items-start">
                                <div class="flex flex-col gap-1">
                                    <p class="text-gray-400 text-sm font-medium uppercase tracking-wide">Jadwal</p>
                                    <p class="text-white text-4xl font-black leading-tight">${totalJadwal}</p>
                                </div>
                                <div class="size-12 rounded-full bg-primary/20 text-white flex items-center justify-center group-hover:bg-primary transition-colors">
                                    <span class="material-symbols-outlined text-2xl">calendar_month</span>
                                </div>
                            </div>
                            <div class="pt-2">
                                <div class="w-full flex items-center justify-between px-4 py-3 bg-[#0f172a] group-hover:bg-primary text-white rounded-lg transition-colors">
                                    <span class="font-bold text-sm">Kelola Jadwal</span>
                                    <span class="material-symbols-outlined text-lg transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </div>
                            </div>
                        </a>
                        
                        <a href="#/admin/matakuliah" class="group flex flex-col gap-4 rounded-xl p-6 bg-[#1e293b] border border-[#334155] shadow-sm hover:shadow-md hover:border-primary/50 transition-all card-hover-tilt">
                            <div class="flex justify-between items-start">
                                <div class="flex flex-col gap-1">
                                    <p class="text-gray-400 text-sm font-medium uppercase tracking-wide">Mata Kuliah</p>
                                    <p class="text-white text-4xl font-black leading-tight">${totalMataKuliah}</p>
                                </div>
                                <div class="size-12 rounded-full bg-primary/20 text-white flex items-center justify-center group-hover:bg-primary transition-colors">
                                    <span class="material-symbols-outlined text-2xl">menu_book</span>
                                </div>
                            </div>
                            <div class="pt-2">
                                <div class="w-full flex items-center justify-between px-4 py-3 bg-[#0f172a] group-hover:bg-primary text-white rounded-lg transition-colors">
                                    <span class="font-bold text-sm">Kelola Mata Kuliah</span>
                                    <span class="material-symbols-outlined text-lg transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </div>
                            </div>
                        </a>
                    </div>
                    
                    <!-- Today's Activity -->
                    <div class="flex flex-col gap-4 animate-slide-up" style="animation-delay: 0.2s;">
                        <div class="flex items-center justify-between">
                            <h2 class="text-white text-xl font-bold leading-tight tracking-[-0.015em]">Aktivitas Hari Ini</h2>
                            <a href="#/" class="text-sm font-medium text-gray-400 hover:text-white underline decoration-primary decoration-2 underline-offset-4 transition-colors">Lihat Jadwal</a>
                        </div>
                        <div class="flex flex-col gap-3">
                            ${activityHtml}
                        </div>
                    </div>
                    
                    <!-- Quick Actions -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up" style="animation-delay: 0.3s;">
                        <button onclick="DataManager.resetToDefault(); AdminModal.toast('Data berhasil direset!'); App.refresh();" class="flex items-center gap-4 p-4 bg-[#1e293b] border border-[#334155] rounded-xl hover:border-yellow-500/50 transition-all group">
                            <div class="size-12 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                                <span class="material-symbols-outlined text-2xl">restart_alt</span>
                            </div>
                            <div class="text-left">
                                <h3 class="text-white font-bold">Reset ke Data Default</h3>
                                <p class="text-gray-400 text-sm">Kembalikan semua data ke pengaturan awal</p>
                            </div>
                        </button>
                        
                        <a href="#/" class="flex items-center gap-4 p-4 bg-[#1e293b] border border-[#334155] rounded-xl hover:border-green-500/50 transition-all group">
                            <div class="size-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                                <span class="material-symbols-outlined text-2xl">visibility</span>
                            </div>
                            <div class="text-left">
                                <h3 class="text-white font-bold">Lihat Tampilan Mahasiswa</h3>
                                <p class="text-gray-400 text-sm">Preview tampilan untuk mahasiswa</p>
                            </div>
                        </a>
                    </div>
                </div>
            </main>
        `;
    }
};
