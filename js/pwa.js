// PWA Handler - Service Worker Registration & Install Prompt

const PWA = {
    deferredPrompt: null,
    isInstalled: false,

    // Initialize PWA
    init() {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.isInstalled = true;
            console.log('[PWA] App is running in standalone mode');
        }

        // Register service worker
        this.registerServiceWorker();

        // Handle install prompt
        this.handleInstallPrompt();

        // Handle app installed event
        window.addEventListener('appinstalled', () => {
            console.log('[PWA] App installed successfully!');
            this.isInstalled = true;
            this.hidePrompt();
            AdminModal.toast('Aplikasi berhasil diinstall!', 'success');
        });
    },

    // Register Service Worker
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('./sw.js', {
                    scope: './'
                });

                console.log('[PWA] Service Worker registered:', registration.scope);

                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New content available
                            console.log('[PWA] New content available, please refresh.');
                            this.showUpdatePrompt();
                        }
                    });
                });

            } catch (error) {
                console.error('[PWA] Service Worker registration failed:', error);
            }
        } else {
            console.log('[PWA] Service Workers not supported');
        }
    },

    // Handle beforeinstallprompt event
    handleInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();

            // Stash the event so it can be triggered later
            this.deferredPrompt = e;

            // Only show if not already installed and not dismissed recently
            const dismissed = localStorage.getItem('pwa_prompt_dismissed');
            const dismissedTime = dismissed ? parseInt(dismissed) : 0;
            const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

            if (!this.isInstalled && daysSinceDismissed > 7) {
                // Show prompt after a delay
                setTimeout(() => {
                    this.showPrompt();
                }, 3000);
            }

            console.log('[PWA] Install prompt available');
        });
    },

    // Show install prompt
    showPrompt() {
        const prompt = document.getElementById('pwa-install-prompt');
        if (prompt) {
            prompt.classList.remove('hidden');
        }
    },

    // Hide install prompt
    hidePrompt() {
        const prompt = document.getElementById('pwa-install-prompt');
        if (prompt) {
            prompt.classList.add('hidden');
        }
    },

    // Dismiss prompt (don't show again for 7 days)
    dismissPrompt() {
        this.hidePrompt();
        localStorage.setItem('pwa_prompt_dismissed', Date.now().toString());
    },

    // Trigger install
    async install() {
        if (!this.deferredPrompt) {
            console.log('[PWA] No install prompt available');
            return;
        }

        // Show the prompt
        this.deferredPrompt.prompt();

        // Wait for the user to respond
        const { outcome } = await this.deferredPrompt.userChoice;
        console.log('[PWA] User response:', outcome);

        // Clear the deferred prompt
        this.deferredPrompt = null;
        this.hidePrompt();
    },

    // Show update available prompt
    showUpdatePrompt() {
        const content = `
            <div class="flex flex-col items-center text-center py-4">
                <div class="size-16 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                    <span class="material-symbols-outlined text-3xl">system_update</span>
                </div>
                <h3 class="text-white text-xl font-bold mb-2">Update Tersedia!</h3>
                <p class="text-gray-400 mb-6">Versi baru aplikasi tersedia. Refresh untuk mengupdate.</p>
                <div class="flex gap-3 w-full max-w-xs">
                    <button onclick="AdminModal.hide()" class="flex-1 px-4 py-2.5 rounded-lg bg-slate-700 text-white font-bold hover:bg-slate-600 transition-colors">
                        Nanti
                    </button>
                    <button onclick="location.reload()" class="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-blue-600 transition-colors">
                        Refresh
                    </button>
                </div>
            </div>
        `;

        AdminModal.show('', content);
    },

    // Check online status
    isOnline() {
        return navigator.onLine;
    }
};

// Initialize PWA when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    PWA.init();
});

// Handle online/offline events
window.addEventListener('online', () => {
    console.log('[PWA] Back online');
    AdminModal.toast('Kembali online', 'success');
});

window.addEventListener('offline', () => {
    console.log('[PWA] Gone offline');
    AdminModal.toast('Mode offline - Data dari cache', 'info');
});
