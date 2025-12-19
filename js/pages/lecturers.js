// Lecturers Directory Page (Updated to use DataManager)

const LecturersPage = {
    render() {
        const dosenData = DataManager.getDosen();

        const lecturerCards = dosenData.map((dosen, index) => {
            // Get courses for this lecturer
            const courses = DataManager.getJadwal()
                .filter(j => j.dosenId === dosen.id)
                .map(j => DataManager.getMataKuliahById(j.mkId))
                .filter(m => m)
                .filter((m, i, arr) => arr.findIndex(x => x.id === m.id) === i);

            const courseNames = courses.map(c => c.nama).join(', ');
            const delay = index * 0.1;

            return `
                <div class="group flex flex-col bg-surface-light dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-[#e5e5e0] dark:border-[#333333] hover:shadow-2xl hover:border-primary/50 card-hover-tilt card-shine cursor-pointer" onclick="LecturerModal.show(${dosen.id})" style="animation: staggerFadeIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s backwards;">
                    <div class="flex items-start gap-4 mb-4">
                        <div class="size-16 rounded-full bg-gray-200 bg-cover bg-center shrink-0 ring-2 ring-white dark:ring-surface-dark shadow-md group-hover:ring-primary group-hover:ring-4 transition-all duration-300 group-hover:scale-110" style="background-image: url('${dosen.foto}');"></div>
                        <div class="flex-1 min-w-0">
                            <h3 class="text-lg font-bold text-text-main dark:text-white leading-tight mb-1 group-hover:text-primary transition-colors">${dosen.nama}</h3>
                            <p class="text-sm text-primary font-medium">${dosen.bidang}</p>
                        </div>
                    </div>
                    
                    <div class="flex flex-col gap-2 text-sm text-text-muted dark:text-gray-400 mb-4">
                        <div class="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                            <span class="material-symbols-outlined text-[18px]">badge</span>
                            <span>NIDN: ${dosen.nidn}</span>
                        </div>
                        <div class="flex items-center gap-2 group-hover:translate-x-1 transition-transform" style="transition-delay: 0.05s;">
                            <span class="material-symbols-outlined text-[18px]">book</span>
                            <span class="truncate">${courseNames || 'Tidak ada mata kuliah'}</span>
                        </div>
                    </div>
                    
                    <div class="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex gap-2">
                        <button onclick="event.stopPropagation(); WhatsAppUtils.openChat(DataManager.getDosenById(${dosen.id}))" class="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white rounded-full text-sm font-bold btn-hover-lift btn-ripple shadow-md shadow-primary/20">
                            <span class="material-symbols-outlined text-[18px]">chat</span>
                            WhatsApp
                        </button>
                        <button onclick="event.stopPropagation(); LecturerModal.show(${dosen.id})" class="size-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-text-main dark:text-white hover:bg-primary hover:text-white transition-all duration-300 hover:rotate-12">
                            <span class="material-symbols-outlined text-[20px]">info</span>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        return `
            ${Header.render()}
            
            <main class="flex-grow w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
                <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 animate-slide-up">
                    <div>
                        <h2 class="text-3xl font-bold leading-tight tracking-tight mb-2 dark:text-white">Direktori <span class="text-gradient-animate">Dosen</span></h2>
                        <p class="text-sm text-gray-500 dark:text-gray-400">${dosenData.length} dosen mengajar di kelas ${CONFIG.className}</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${lecturerCards || '<div class="col-span-full text-center py-12 text-gray-400">Belum ada data dosen</div>'}
                </div>
            </main>
            
            ${Navbar.render('lecturers')}
        `;
    }
};
