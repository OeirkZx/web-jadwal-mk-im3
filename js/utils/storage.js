// Local Storage Utility Functions

const StorageUtils = {
    // Key untuk session admin
    ADMIN_SESSION_KEY: 'jadwal_admin_session',
    THEME_KEY: 'jadwal_theme',

    // Simpan session admin
    setAdminSession(isLoggedIn) {
        localStorage.setItem(this.ADMIN_SESSION_KEY, isLoggedIn ? 'true' : 'false');
    },

    // Cek apakah admin sudah login
    isAdminLoggedIn() {
        return localStorage.getItem(this.ADMIN_SESSION_KEY) === 'true';
    },

    // Logout admin
    logoutAdmin() {
        localStorage.removeItem(this.ADMIN_SESSION_KEY);
    },

    // Validasi login admin
    validateAdmin(username, password) {
        return username === CONFIG.admin.username && password === CONFIG.admin.password;
    },

    // Theme management
    getTheme() {
        return localStorage.getItem(this.THEME_KEY) || 'dark';
    },

    setTheme(theme) {
        localStorage.setItem(this.THEME_KEY, theme);
    },

    // Toggle theme
    toggleTheme() {
        const html = document.documentElement;
        const isDark = html.classList.contains('dark');

        if (isDark) {
            html.classList.remove('dark');
            this.setTheme('light');
        } else {
            html.classList.add('dark');
            this.setTheme('dark');
        }

        return !isDark;
    },

    // Initialize theme dari storage
    initTheme() {
        const savedTheme = this.getTheme();
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
};
