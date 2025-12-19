// Admin Modal Component - For CRUD forms

const AdminModal = {
    isOpen: false,

    // Show modal with custom content
    show(title, content, onSave = null) {
        const modalHtml = `
            <div id="admin-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" onclick="AdminModal.handleBackdropClick(event)">
                <div class="relative w-full max-w-[600px] flex flex-col bg-[#0f172a] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] modal-enter border border-[#334155]">
                    <header class="flex items-center justify-between border-b border-[#334155] px-6 py-4 bg-[#1e293b] sticky top-0 z-10">
                        <h2 class="text-white text-lg font-bold leading-tight">${title}</h2>
                        <button onclick="AdminModal.hide()" class="flex items-center justify-center rounded-full w-10 h-10 bg-slate-700 hover:bg-red-600 text-white transition-all duration-300 hover:rotate-90 cursor-pointer">
                            <span class="material-symbols-outlined text-[20px]">close</span>
                        </button>
                    </header>
                    
                    <div class="overflow-y-auto flex-1 p-6">
                        ${content}
                    </div>
                    
                    ${onSave ? `
                        <footer class="flex items-center justify-end gap-3 border-t border-[#334155] px-6 py-4 bg-[#1e293b]">
                            <button onclick="AdminModal.hide()" class="px-6 py-2.5 rounded-lg bg-slate-700 text-white font-bold hover:bg-slate-600 transition-colors">
                                Batal
                            </button>
                            <button onclick="AdminModal.save()" class="px-6 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-blue-600 transition-colors btn-ripple">
                                <span class="flex items-center gap-2">
                                    <span class="material-symbols-outlined text-[18px]">save</span>
                                    Simpan
                                </span>
                            </button>
                        </footer>
                    ` : ''}
                </div>
            </div>
        `;

        this.onSaveCallback = onSave;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
    },

    hide() {
        const modal = document.getElementById('admin-modal');
        if (modal) {
            modal.querySelector('.modal-enter').style.animation = 'modalBounceIn 0.2s ease reverse';
            modal.style.animation = 'backdropFadeIn 0.2s ease-out reverse';

            setTimeout(() => {
                modal.remove();
                this.isOpen = false;
                document.body.style.overflow = '';
            }, 150);
        }
    },

    save() {
        if (this.onSaveCallback) {
            this.onSaveCallback();
        }
    },

    handleBackdropClick(event) {
        if (event.target.id === 'admin-modal') {
            this.hide();
        }
    },

    // Confirm delete dialog
    confirmDelete(message, onConfirm) {
        const content = `
            <div class="flex flex-col items-center text-center py-4">
                <div class="size-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mb-4">
                    <span class="material-symbols-outlined text-3xl">warning</span>
                </div>
                <h3 class="text-white text-xl font-bold mb-2">Konfirmasi Hapus</h3>
                <p class="text-gray-400 mb-6">${message}</p>
                <div class="flex gap-3 w-full max-w-xs">
                    <button onclick="AdminModal.hide()" class="flex-1 px-4 py-2.5 rounded-lg bg-slate-700 text-white font-bold hover:bg-slate-600 transition-colors">
                        Batal
                    </button>
                    <button onclick="AdminModal.executeDelete()" class="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition-colors">
                        Hapus
                    </button>
                </div>
            </div>
        `;

        this.onDeleteCallback = onConfirm;
        this.show('', content);
    },

    executeDelete() {
        if (this.onDeleteCallback) {
            this.onDeleteCallback();
        }
        this.hide();
    },

    // Toast notification
    toast(message, type = 'success') {
        const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
        const icon = type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info';

        const toastHtml = `
            <div id="toast-notification" class="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 ${bgColor} text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-bold animate-slide-up">
                <span class="material-symbols-outlined">${icon}</span>
                ${message}
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', toastHtml);

        setTimeout(() => {
            const toast = document.getElementById('toast-notification');
            if (toast) {
                toast.style.animation = 'slideUp 0.3s ease reverse';
                setTimeout(() => toast.remove(), 300);
            }
        }, 2500);
    }
};

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && AdminModal.isOpen) {
        AdminModal.hide();
    }
});
