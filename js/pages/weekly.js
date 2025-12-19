// Weekly Schedule Page (Updated to use DataManager)

const WeeklyPage = {
    selectedDay: null,

    init() {
        // Set default to today's day or Monday if weekend
        const today = new Date().getDay();
        if (today === 0 || today === 6) {
            this.selectedDay = 'Senin';
        } else {
            this.selectedDay = DateUtils.hariList[today];
        }
    },

    render() {
        if (!this.selectedDay) this.init();

        const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
        const jadwal = DataManager.getJadwalByHari(this.selectedDay);

        // Day selector buttons
        const dayButtons = days.map(day => {
            const isActive = day === this.selectedDay;
            const activeClass = isActive
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-white dark:bg-neutral-dark border border-neutral-light dark:border-neutral-dark/50 text-gray-500 dark:text-gray-300 hover:bg-neutral-light dark:hover:bg-neutral-dark/80';

            return `
                <button onclick="WeeklyPage.selectDay('${day}')" class="flex flex-col items-center justify-center min-w-[4rem] px-4 py-2 rounded-full ${activeClass} font-bold text-sm transition-all duration-300 hover:scale-105 active:scale-95">
                    ${day}
                </button>
            `;
        }).join('');

        // Schedule table rows
        let tableRows = '';
        let lastEndTime = null;

        jadwal.forEach((j, index) => {
            // Check if there's a break between classes
            if (lastEndTime && j.jamMulai > lastEndTime) {
                tableRows += `
                    <tr class="bg-primary/10 dark:bg-primary/5">
                        <td class="px-6 py-3 text-center" colspan="5">
                            <span class="text-xs font-bold text-neutral-dark dark:text-primary uppercase tracking-widest opacity-70">Istirahat</span>
                        </td>
                    </tr>
                `;
            }

            tableRows += `
                <tr class="group hover:bg-neutral-light/20 dark:hover:bg-neutral-dark/20 transition-colors table-row-hover" style="animation: staggerFadeIn 0.4s ease ${index * 0.05}s backwards;">
                    <td class="px-6 py-6 whitespace-nowrap align-middle">
                        <div class="flex flex-col">
                            <span class="text-sm font-bold text-text-main dark:text-white">${j.jamMulai}</span>
                            <span class="text-xs text-gray-500 dark:text-gray-400">${j.jamSelesai}</span>
                        </div>
                    </td>
                    <td class="px-6 py-6 align-middle">
                        <div class="flex flex-col gap-1">
                            <span class="text-base font-bold text-text-main dark:text-white group-hover:text-primary transition-colors">${j.mataKuliah?.nama || 'N/A'}</span>
                            <span class="text-xs text-gray-500 dark:text-gray-400">${j.mataKuliah?.sks || 0} SKS • ${j.mataKuliah?.jenis || 'N/A'}</span>
                        </div>
                    </td>
                    <td class="px-6 py-6 align-middle">
                        <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-light/50 dark:bg-neutral-dark text-xs font-bold text-text-main dark:text-[#e9e8ce]">
                            <span class="material-symbols-outlined text-[16px]">${j.ruangan.toLowerCase().includes('lab') ? 'computer' : 'location_on'}</span>
                            ${j.ruangan}
                        </div>
                    </td>
                    <td class="px-6 py-6 align-middle">
                        ${j.dosen ? `
                            <div class="flex items-center gap-3 cursor-pointer hover:translate-x-1 transition-transform" onclick="LecturerModal.show(${j.dosen.id}, ${j.mataKuliah?.id})">
                                <div class="size-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0 ring-2 ring-white dark:ring-[#1a190b]">
                                    <img alt="Dosen" class="w-full h-full object-cover" src="${j.dosen.foto}"/>
                                </div>
                                <span class="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors">${j.dosen.nama.split(',')[0]}</span>
                            </div>
                        ` : '<span class="text-gray-400">-</span>'}
                    </td>
                    <td class="px-6 py-6 align-middle text-right">
                        ${j.dosen ? `
                            <button onclick="LecturerModal.show(${j.dosen.id}, ${j.mataKuliah?.id})" class="size-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-neutral-light dark:hover:bg-neutral-dark hover:text-black dark:hover:text-white transition-all hover:rotate-90">
                                <span class="material-symbols-outlined text-[20px]">more_vert</span>
                            </button>
                        ` : ''}
                    </td>
                </tr>
            `;

            lastEndTime = j.jamSelesai;
        });

        // Empty state
        if (jadwal.length === 0) {
            tableRows = `
                <tr>
                    <td class="px-6 py-16 text-center" colspan="5">
                        <div class="flex flex-col items-center animate-fade-in">
                            <span class="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4 float-gentle">event_busy</span>
                            <p class="text-lg font-medium text-text-muted dark:text-gray-400">Tidak ada jadwal di hari ${this.selectedDay}</p>
                        </div>
                    </td>
                </tr>
            `;
        }

        return `
            ${Header.render()}
            
            <main class="flex-grow w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
                <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 animate-slide-up">
                    <div>
                        <h2 class="text-3xl font-bold leading-tight tracking-tight mb-2 dark:text-white">Jadwal <span class="text-gradient-animate">Minggu Ini</span></h2>
                        <p class="text-sm text-gray-500 dark:text-gray-400">${CONFIG.semester} ${CONFIG.academicYear} • ${CONFIG.className}</p>
                    </div>
                    <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                        ${dayButtons}
                    </div>
                </div>
                
                <div class="w-full animate-fade-in">
                    <div class="overflow-x-auto rounded-[2rem] border border-neutral-light dark:border-neutral-dark bg-white dark:bg-[#1a190b] shadow-sm">
                        <table class="w-full min-w-[640px]">
                            <thead>
                                <tr class="bg-neutral-light/30 dark:bg-neutral-dark/30 border-b border-neutral-light dark:border-neutral-dark">
                                    <th class="px-6 py-5 text-left w-32 text-sm font-bold text-text-main dark:text-white uppercase tracking-wider">Jam</th>
                                    <th class="px-6 py-5 text-left text-sm font-bold text-text-main dark:text-white uppercase tracking-wider">Mata Kuliah</th>
                                    <th class="px-6 py-5 text-left w-48 text-sm font-bold text-text-main dark:text-white uppercase tracking-wider">Ruang</th>
                                    <th class="px-6 py-5 text-left w-64 text-sm font-bold text-text-main dark:text-white uppercase tracking-wider">Dosen</th>
                                    <th class="px-6 py-5 w-16 text-center"></th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-neutral-light dark:divide-neutral-dark">
                                ${tableRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            
            ${Navbar.render('weekly')}
        `;
    },

    selectDay(day) {
        this.selectedDay = day;
        App.refresh();
    }
};
