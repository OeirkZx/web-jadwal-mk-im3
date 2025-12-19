// Bottom Navigation Component with Animations

const Navbar = {
    render(activePage = 'home') {
        const items = [
            { id: 'home', href: '#/', icon: 'calendar_today', label: 'Hari Ini' },
            { id: 'weekly', href: '#/mingguan', icon: 'date_range', label: 'Mingguan' },
            { id: 'lecturers', href: '#/dosen', icon: 'group', label: 'Dosen' }
        ];

        const navItems = items.map(item => {
            const isActive = item.id === activePage;
            const activeClass = isActive
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'text-text-muted dark:text-gray-400 hover:text-text-main dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10';

            return `
                <a href="${item.href}" class="flex items-center gap-2 px-5 py-2.5 ${activeClass} rounded-full font-${isActive ? 'bold' : 'medium'} text-sm transition-all duration-300 hover:scale-105 active:scale-95 btn-ripple">
                    <span class="material-symbols-outlined text-[20px] ${isActive ? 'bounce-success' : ''}">${item.icon}</span>
                    ${item.label}
                </a>
            `;
        }).join('');

        return `
            <nav class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 navbar-float">
                <div class="flex items-center gap-1 bg-surface-light/95 dark:bg-surface-dark/95 border border-[#e5e5e0] dark:border-[#333333] shadow-2xl dark:shadow-black/50 p-1.5 rounded-full backdrop-blur-xl">
                    ${navItems}
                </div>
            </nav>
        `;
    }
};
