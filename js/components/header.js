// Header Component with Animations

const Header = {
    render(isAdmin = false) {
        const isDark = document.documentElement.classList.contains('dark');
        const themeIcon = isDark ? 'light_mode' : 'dark_mode';

        if (isAdmin) {
            return `
                <header class="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#334155] bg-[#1e293b]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 md:px-10 header-slide-down">
                    <div class="flex items-center gap-4 text-white">
                        <div class="size-8 flex items-center justify-center rounded-full bg-primary text-white float-gentle">
                            <span class="material-symbols-outlined text-xl">admin_panel_settings</span>
                        </div>
                        <h2 class="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Panel Admin</h2>
                    </div>
                    <div class="flex items-center gap-4">
                        <a href="#/" class="hidden md:flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-white transition-colors btn-hover-lift">
                            <span class="material-symbols-outlined text-lg">arrow_back</span>
                            Kembali ke Jadwal
                        </a>
                        <div class="h-8 w-[1px] bg-[#334155] hidden md:block"></div>
                        <div class="flex items-center gap-3">
                            <div class="bg-primary size-8 rounded-full overflow-hidden flex items-center justify-center border border-white/10 text-white">
                                <span class="font-bold text-xs">AD</span>
                            </div>
                            <button onclick="App.logout()" class="flex cursor-pointer items-center justify-center rounded-full h-9 px-4 bg-slate-700 text-white hover:bg-slate-600 transition-colors text-sm font-bold btn-ripple">
                                <span class="truncate">Keluar</span>
                            </button>
                        </div>
                    </div>
                </header>
            `;
        }

        return `
            <header class="sticky top-0 z-50 w-full border-b border-[#e5e5e0] dark:border-[#333333] bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md header-slide-down">
                <div class="px-4 md:px-10 py-4 flex items-center justify-between mx-auto max-w-5xl">
                    <div class="flex items-center gap-3">
                        <div class="flex items-center justify-center size-10 rounded-full bg-primary text-white float-gentle">
                            <span class="material-symbols-outlined text-2xl">school</span>
                        </div>
                        <h1 class="text-text-main dark:text-white text-xl font-bold tracking-tight">${CONFIG.appName}</h1>
                    </div>
                    <div class="flex gap-3 items-center">
                        <a href="#/login" class="hidden sm:flex items-center justify-center h-10 px-5 rounded-full bg-surface-light dark:bg-surface-dark border border-[#e5e5e0] dark:border-[#404040] text-sm font-bold text-text-main dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#333333] transition-all hover:scale-105 active:scale-95">
                            Admin Login
                        </a>
                        <button onclick="StorageUtils.toggleTheme(); Header.updateThemeIcon();" class="size-10 flex items-center justify-center rounded-full bg-surface-light dark:bg-surface-dark border border-[#e5e5e0] dark:border-[#404040] text-text-main dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#333333] transition-colors theme-toggle-spin" id="theme-toggle">
                            <span class="material-symbols-outlined text-[20px]" id="theme-icon">${themeIcon}</span>
                        </button>
                    </div>
                </div>
            </header>
        `;
    },

    updateThemeIcon() {
        const icon = document.getElementById('theme-icon');
        if (icon) {
            const isDark = document.documentElement.classList.contains('dark');
            icon.textContent = isDark ? 'light_mode' : 'dark_mode';
        }
    }
};
