// Home Page - Today's Schedule with Enhanced Animations (Updated to use DataManager)

const HomePage = {
    render() {
        const jadwalHariIni = DataManager.getJadwalHariIni();
        const tanggal = DateUtils.getTanggalLengkap();
        const jumlahKelas = jadwalHariIni.length;

        // Find ongoing class
        const ongoingClass = jadwalHariIni.find(j =>
            DateUtils.isOngoing(j.jamMulai, j.jamSelesai)
        );

        // Get upcoming classes (not started yet)
        const upcomingClasses = jadwalHariIni.filter(j =>
            DateUtils.isUpcoming(j.jamMulai)
        );

        // Build ongoing section
        let ongoingSection = '';
        if (ongoingClass) {
            ongoingSection = `
                <section class="flex flex-col gap-4 animate-slide-up" style="animation-delay: 0.2s;">
                    <div class="flex items-center gap-2">
                        <h3 class="text-xl font-bold text-text-main dark:text-gray-100">Sedang Berlangsung</h3>
                        <span class="bg-red-500 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full tracking-wider flex items-center gap-1.5 live-pulse">
                            <span class="size-1.5 bg-white rounded-full live-ring"></span>
                            Live
                        </span>
                    </div>
                    ${ScheduleCard.renderOngoing(ongoingClass)}
                </section>
            `;
        }

        // Build upcoming section
        let upcomingSection = '';
        if (upcomingClasses.length > 0) {
            const upcomingCards = upcomingClasses.map((j, i) => ScheduleCard.renderUpcoming(j, i)).join('');
            upcomingSection = `
                <section class="flex flex-col gap-4 pb-12">
                    <h3 class="text-xl font-bold text-text-main dark:text-gray-100 mt-6 animate-slide-up" style="animation-delay: 0.3s;">Selanjutnya</h3>
                    <div class="flex flex-col gap-4">
                        ${upcomingCards}
                    </div>
                </section>
            `;
        }

        // If no classes today
        let emptySection = '';
        if (jadwalHariIni.length === 0) {
            emptySection = `
                <section class="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
                    <span class="material-symbols-outlined text-8xl text-gray-300 dark:text-gray-600 mb-4 float-gentle">celebration</span>
                    <h3 class="text-2xl font-bold text-text-main dark:text-white mb-2">Tidak Ada Kuliah Hari Ini! 🎉</h3>
                    <p class="text-lg text-text-muted dark:text-gray-400">Nikmati waktu istirahat kamu</p>
                </section>
            `;
        } else if (!ongoingClass && upcomingClasses.length === 0) {
            emptySection = `
                <section class="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
                    <span class="material-symbols-outlined text-8xl text-gray-300 dark:text-gray-600 mb-4 float-gentle">task_alt</span>
                    <h3 class="text-2xl font-bold text-text-main dark:text-white mb-2 bounce-success">Semua Kuliah Hari Ini Selesai! ✅</h3>
                    <p class="text-lg text-text-muted dark:text-gray-400">Kerja bagus, sampai jumpa besok!</p>
                </section>
            `;
        }

        // Quick links section
        const quickLinksHtml = CONFIG.quickLinks.map((link, i) => `
            <a href="${link.url}" target="_blank" class="flex items-center gap-2 px-4 py-2.5 bg-surface-light dark:bg-surface-dark border border-[#e5e5e0] dark:border-[#333333] rounded-full text-sm font-medium text-text-main dark:text-gray-200 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20" style="animation: staggerFadeIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${0.5 + i * 0.1}s backwards;">
                <span class="material-symbols-outlined text-[18px]">${link.icon}</span>
                ${link.name}
            </a>
        `).join('');

        return `
            ${Header.render()}
            
            <main class="flex-1 w-full max-w-5xl mx-auto px-4 md:px-10 pt-8 flex flex-col gap-8 pb-24">
                <section class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 animate-slide-up">
                    <div class="flex flex-col gap-1">
                        <p class="text-text-muted dark:text-gray-400 text-lg font-medium">Selamat datang, Mahasiswa</p>
                        <h2 class="text-text-main dark:text-white text-4xl md:text-5xl font-black tracking-tighter leading-tight">
                            ${tanggal.split(', ')[0]}, <br class="hidden md:block"/> <span class="text-gradient-animate">${tanggal.split(', ')[1]}</span>
                        </h2>
                    </div>
                    ${jumlahKelas > 0 ? `
                        <div class="bg-surface-light dark:bg-surface-dark px-6 py-3 rounded-2xl border border-[#e5e5e0] dark:border-[#333333] shadow-lg animate-fade-in" style="animation-delay: 0.15s;">
                            <p class="text-text-main dark:text-white font-bold text-lg flex items-center gap-2">
                                <span class="bg-primary size-2.5 rounded-full ${ongoingClass ? 'live-pulse live-ring' : ''}"></span>
                                Kamu punya <span class="text-primary">${jumlahKelas}</span> kelas hari ini
                            </p>
                        </div>
                    ` : ''}
                </section>
                
                ${ongoingSection}
                ${upcomingSection}
                ${emptySection}
                
                ${jadwalHariIni.length > 0 ? `
                    <section class="pb-8 animate-slide-up" style="animation-delay: 0.4s;">
                        <h3 class="text-lg font-bold text-text-main dark:text-gray-100 mb-4">🔗 Tautan Cepat</h3>
                        <div class="flex flex-wrap gap-3">
                            ${quickLinksHtml}
                        </div>
                    </section>
                ` : ''}
            </main>
            
            ${Navbar.render('home')}
        `;
    }
};
