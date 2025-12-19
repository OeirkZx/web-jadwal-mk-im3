// Schedule Card Components with Enhanced Animations

const ScheduleCard = {
    // Card untuk jadwal yang sedang berlangsung (featured/highlighted)
    renderOngoing(jadwal) {
        const countdown = DateUtils.getCountdownText(jadwal.jamMulai, jadwal.jamSelesai);

        return `
            <div class="w-full relative group animate-fade-in">
                <div class="absolute -inset-1 bg-gradient-to-r from-primary via-blue-400 to-primary rounded-2xl opacity-60 blur-lg card-glow"></div>
                <div class="relative flex flex-col md:flex-row bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden shadow-2xl border border-primary/50 card-shine">
                    <div class="flex-1 p-6 md:p-8 flex flex-col justify-between gap-6">
                        <div>
                            <div class="flex items-center gap-2 mb-2 flex-wrap">
                                <span class="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                                    <span class="size-2 bg-white rounded-full live-pulse"></span>
                                    ${jadwal.jamMulai} - ${jadwal.jamSelesai}
                                </span>
                                <span class="text-text-muted dark:text-gray-400 text-sm font-medium flex items-center gap-1">
                                    <span class="material-symbols-outlined text-[16px]">location_on</span>
                                    ${jadwal.ruangan}
                                </span>
                            </div>
                            <h3 class="text-2xl md:text-3xl font-bold text-text-main dark:text-white leading-tight mb-4 text-gradient-animate">${jadwal.mataKuliah.nama}</h3>
                            <div class="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-all duration-300 hover:translate-x-1" onclick="LecturerModal.show(${jadwal.dosen.id}, ${jadwal.mataKuliah.id})">
                                <div class="size-12 rounded-full bg-gray-200 bg-cover bg-center ring-2 ring-primary/50 transition-all group-hover:ring-primary" style="background-image: url('${jadwal.dosen.foto}');"></div>
                                <div>
                                    <p class="text-sm font-bold text-text-main dark:text-white">${jadwal.dosen.nama}</p>
                                    <p class="text-xs text-text-muted dark:text-gray-400">Dosen Pengampu</p>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4 mt-2 flex-wrap gap-4">
                            <div class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-text-muted dark:text-gray-400">person</span>
                                <div class="flex flex-col">
                                    <span class="text-xs text-text-muted dark:text-gray-400">PJ Kelas</span>
                                    <span class="text-sm font-bold text-text-main dark:text-white">${jadwal.pjNama}</span>
                                </div>
                            </div>
                            <button onclick="LecturerModal.show(${jadwal.dosen.id}, ${jadwal.mataKuliah.id})" class="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-full font-bold text-sm btn-hover-lift btn-ripple">
                                <span class="material-symbols-outlined text-[18px]">chat</span>
                                Hubungi Dosen
                            </button>
                        </div>
                    </div>
                    <div class="w-full md:w-1/3 min-h-[180px] md:min-h-full bg-gradient-to-br from-primary/20 via-blue-500/10 to-primary/20 flex items-center justify-center">
                        <div class="text-center p-6 float-gentle">
                            <div class="text-5xl mb-3">⏱️</div>
                            <p class="text-lg font-bold text-text-main dark:text-white countdown-tick">${countdown}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Card untuk jadwal berikutnya (compact)
    renderUpcoming(jadwal, index = 0) {
        const countdown = DateUtils.getCountdownText(jadwal.jamMulai, jadwal.jamSelesai);
        const isPast = DateUtils.isPast(jadwal.jamSelesai);
        const opacityClass = isPast ? 'opacity-50' : '';
        const delay = index * 0.1;

        return `
            <div class="flex flex-col sm:flex-row bg-surface-light dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-[#e5e5e0] dark:border-[#333333] gap-5 items-stretch card-hover-tilt card-shine ${opacityClass}" style="animation: staggerFadeIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s backwards;">
                <div class="flex flex-col justify-center items-center sm:items-start min-w-[120px] border-b sm:border-b-0 sm:border-r border-dashed border-gray-300 dark:border-gray-700 pb-4 sm:pb-0 sm:pr-6">
                    <span class="text-2xl font-black text-text-main dark:text-white">${jadwal.jamMulai}</span>
                    <span class="text-sm font-medium text-text-muted dark:text-gray-500">sampai ${jadwal.jamSelesai}</span>
                </div>
                <div class="flex-1 flex flex-col justify-center gap-1">
                    <h4 class="text-xl font-bold text-text-main dark:text-white group-hover:text-primary transition-colors">${jadwal.mataKuliah.nama}</h4>
                    <div class="flex flex-wrap gap-4 text-sm mt-1">
                        <span class="flex items-center gap-1 text-text-muted dark:text-gray-400">
                            <span class="material-symbols-outlined text-[18px]">location_on</span> ${jadwal.ruangan}
                        </span>
                        <span class="flex items-center gap-1 text-text-muted dark:text-gray-400 cursor-pointer hover:text-primary transition-colors" onclick="LecturerModal.show(${jadwal.dosen.id}, ${jadwal.mataKuliah.id})">
                            <span class="material-symbols-outlined text-[18px]">school</span> ${jadwal.dosen.nama.split(',')[0]}
                        </span>
                    </div>
                </div>
                <div class="flex items-center justify-end sm:border-l border-gray-100 dark:border-gray-800 sm:pl-4">
                    <button onclick="LecturerModal.show(${jadwal.dosen.id}, ${jadwal.mataKuliah.id})" class="size-12 flex items-center justify-center rounded-full bg-background-light dark:bg-background-dark text-text-main dark:text-white hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110 active:scale-95" title="Detail Kelas">
                        <span class="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </div>
        `;
    },

    // Render empty state
    renderEmpty(message = 'Tidak ada jadwal untuk ditampilkan') {
        return `
            <div class="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
                <span class="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4 float-gentle">event_busy</span>
                <p class="text-lg font-medium text-text-muted dark:text-gray-400">${message}</p>
            </div>
        `;
    }
};
