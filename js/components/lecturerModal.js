// Lecturer Modal Component (Updated to use DataManager)

const LecturerModal = {
    isOpen: false,

    show(dosenId, mkId = null) {
        const dosen = DataManager.getDosenById(dosenId);
        const mk = mkId ? DataManager.getMataKuliahById(mkId) : null;

        if (!dosen) return;

        // Get all courses taught by this lecturer
        const coursesTaught = DataManager.getJadwal()
            .filter(j => j.dosenId === dosenId)
            .map(j => DataManager.getMataKuliahById(j.mkId))
            .filter(m => m)
            .filter((m, i, arr) => arr.findIndex(x => x.id === m.id) === i);

        const coursesHtml = coursesTaught.map((course, index) => `
            <div class="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer group" style="animation: staggerFadeIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${0.3 + index * 0.05}s backwards;">
                <div class="flex items-center gap-3">
                    <div class="w-2 h-2 rounded-full bg-primary group-hover:scale-150 transition-transform"></div>
                    <span class="text-slate-900 dark:text-white font-medium text-sm">${course.nama}</span>
                </div>
                <span class="text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded group-hover:bg-primary group-hover:text-white transition-colors">${course.kode}</span>
            </div>
        `).join('');

        const modalHtml = `
            <div id="lecturer-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" onclick="LecturerModal.handleBackdropClick(event)">
                <div class="relative w-full max-w-[640px] flex flex-col bg-[#f5f8fc] dark:bg-[#0f172a] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] modal-enter">
                    <header class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md z-10 sticky top-0">
                        <h2 class="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Detail Dosen</h2>
                        <button onclick="LecturerModal.hide()" class="flex items-center justify-center rounded-full w-10 h-10 bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 text-slate-900 dark:text-white transition-all duration-300 hover:rotate-90 cursor-pointer">
                            <span class="material-symbols-outlined text-[20px]">close</span>
                        </button>
                    </header>
                    
                    <div class="overflow-y-auto flex-1">
                        <div class="flex flex-col items-center pt-8 pb-4 px-6">
                            <div class="bg-center bg-no-repeat bg-cover rounded-full h-32 w-32 border-4 border-white dark:border-slate-800 shadow-xl mb-4 animate-fade-in ring-4 ring-primary/20 hover:ring-primary/50 transition-all duration-500" style="background-image: url('${dosen.foto}'); animation-delay: 0.1s;"></div>
                            <div class="flex flex-col items-center justify-center text-center" style="animation: staggerFadeIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.15s backwards;">
                                <h3 class="text-slate-900 dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">${dosen.nama}</h3>
                                <p class="text-blue-600 dark:text-blue-400 text-base font-medium mt-1">${dosen.bidang}</p>
                            </div>
                        </div>
                        
                        <div class="flex px-6 justify-center pb-6" style="animation: staggerFadeIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.2s backwards;">
                            <button onclick="WhatsAppUtils.openChat(DataManager.getDosenById(${dosen.id}), ${mk ? `DataManager.getMataKuliahById(${mk.id})` : 'null'})" class="flex w-full max-w-[320px] cursor-pointer items-center justify-center rounded-full h-14 px-6 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] btn-hover-lift btn-ripple shadow-lg shadow-primary/30">
                                <span class="material-symbols-outlined text-[24px]">chat</span>
                                <span class="truncate">Chat via WhatsApp</span>
                            </button>
                        </div>
                        
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 px-6 pb-6 stagger-children">
                            <div class="flex flex-col items-center text-center sm:items-start sm:text-left gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm card-hover-tilt">
                                <div class="p-2 bg-primary/10 rounded-full text-primary dark:text-blue-400 mb-1">
                                    <span class="material-symbols-outlined text-[20px]">badge</span>
                                </div>
                                <div class="flex flex-col">
                                    <h4 class="text-slate-900 dark:text-white text-sm font-bold leading-tight">NIDN</h4>
                                    <p class="text-slate-600 dark:text-slate-400 text-sm font-normal break-all">${dosen.nidn}</p>
                                </div>
                            </div>
                            <div class="flex flex-col items-center text-center sm:items-start sm:text-left gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm card-hover-tilt">
                                <div class="p-2 bg-primary/10 rounded-full text-primary dark:text-blue-400 mb-1">
                                    <span class="material-symbols-outlined text-[20px]">mail</span>
                                </div>
                                <div class="flex flex-col">
                                    <h4 class="text-slate-900 dark:text-white text-sm font-bold leading-tight">Email</h4>
                                    <p class="text-slate-600 dark:text-slate-400 text-sm font-normal break-all">${dosen.email}</p>
                                </div>
                            </div>
                            <div class="flex flex-col items-center text-center sm:items-start sm:text-left gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm card-hover-tilt">
                                <div class="p-2 bg-primary/10 rounded-full text-primary dark:text-blue-400 mb-1">
                                    <span class="material-symbols-outlined text-[20px]">call</span>
                                </div>
                                <div class="flex flex-col">
                                    <h4 class="text-slate-900 dark:text-white text-sm font-bold leading-tight">Telepon</h4>
                                    <p class="text-slate-600 dark:text-slate-400 text-sm font-normal">+${dosen.noHp}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="px-6 pb-8">
                            <h4 class="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">Mata Kuliah yang Diampu</h4>
                            <div class="flex flex-col gap-2">
                                ${coursesHtml || '<p class="text-gray-400 text-sm">Tidak ada mata kuliah terdaftar</p>'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
    },

    hide() {
        const modal = document.getElementById('lecturer-modal');
        if (modal) {
            // Add exit animation
            modal.querySelector('.modal-enter').style.animation = 'modalBounceIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) reverse';
            modal.style.animation = 'backdropFadeIn 0.2s ease-out reverse';

            setTimeout(() => {
                modal.remove();
                this.isOpen = false;
                document.body.style.overflow = '';
            }, 200);
        }
    },

    handleBackdropClick(event) {
        if (event.target.id === 'lecturer-modal') {
            this.hide();
        }
    }
};

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && LecturerModal.isOpen) {
        LecturerModal.hide();
    }
});
