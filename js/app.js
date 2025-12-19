// Main Application - Router and App Logic

const App = {
    // Initialize the app
    init() {
        // Initialize theme
        StorageUtils.initTheme();

        // Initialize data manager
        DataManager.init();

        // Handle route changes
        window.addEventListener('hashchange', () => this.router());

        // Initial render
        this.router();

        // Update countdown every minute
        setInterval(() => {
            const currentHash = window.location.hash;
            if (currentHash === '' || currentHash === '#/' || currentHash === '#/admin') {
                this.refresh();
            }
        }, 60000);
    },

    // Simple hash-based router
    router() {
        const hash = window.location.hash || '#/';
        const app = document.getElementById('app');

        let content = '';

        switch (hash) {
            case '#/':
            case '':
                content = HomePage.render();
                break;
            case '#/mingguan':
                content = WeeklyPage.render();
                break;
            case '#/dosen':
                content = LecturersPage.render();
                break;
            case '#/login':
                content = LoginPage.render();
                break;
            case '#/admin':
                content = AdminDashboard.render();
                break;
            case '#/admin/dosen':
                content = ManageDosenPage.render();
                break;
            case '#/admin/jadwal':
                content = ManageJadwalPage.render();
                break;
            case '#/admin/matakuliah':
                content = ManageMataKuliahPage.render();
                break;
            default:
                content = HomePage.render();
        }

        app.innerHTML = content;
        app.className = 'relative flex min-h-screen w-full flex-col overflow-x-hidden page-transition';

        // Scroll to top on page change
        window.scrollTo(0, 0);
    },

    // Refresh current page
    refresh() {
        this.router();
    },

    // Logout function
    logout() {
        StorageUtils.logoutAdmin();
        window.location.hash = '#/';
    }
};

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
