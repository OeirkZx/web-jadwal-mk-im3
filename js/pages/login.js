// Login Page with Enhanced Animations

const LoginPage = {
    render() {
        return `
            <div class="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4">
                <div class="w-full max-w-md animate-fade-in">
                    <div class="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl border border-[#e5e5e0] dark:border-[#333333] p-8 card-shine">
                        <div class="text-center mb-8">
                            <div class="size-20 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-primary/30 float-gentle">
                                <span class="material-symbols-outlined text-4xl">admin_panel_settings</span>
                            </div>
                            <h1 class="text-2xl font-bold text-text-main dark:text-white mb-2">Login Admin</h1>
                            <p class="text-text-muted dark:text-gray-400">Masuk untuk mengelola jadwal</p>
                        </div>
                        
                        <form id="login-form" onsubmit="LoginPage.handleSubmit(event)" class="flex flex-col gap-5">
                            <div class="animate-slide-up" style="animation-delay: 0.1s;">
                                <label class="block text-sm font-medium text-text-main dark:text-gray-200 mb-2" for="username">Username</label>
                                <div class="relative">
                                    <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">person</span>
                                    <input 
                                        type="text" 
                                        id="username" 
                                        name="username" 
                                        required
                                        class="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[#e5e5e0] dark:border-[#404040] bg-background-light dark:bg-background-dark text-text-main dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-300"
                                        placeholder="Masukkan username"
                                    />
                                </div>
                            </div>
                            
                            <div class="animate-slide-up" style="animation-delay: 0.15s;">
                                <label class="block text-sm font-medium text-text-main dark:text-gray-200 mb-2" for="password">Password</label>
                                <div class="relative">
                                    <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">lock</span>
                                    <input 
                                        type="password" 
                                        id="password" 
                                        name="password" 
                                        required
                                        class="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[#e5e5e0] dark:border-[#404040] bg-background-light dark:bg-background-dark text-text-main dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-300"
                                        placeholder="Masukkan password"
                                    />
                                </div>
                            </div>
                            
                            <div id="login-error" class="hidden text-red-500 text-sm font-medium text-center py-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 shake-error">
                                <span class="material-symbols-outlined text-[16px] align-middle mr-1">error</span>
                                Username atau password salah
                            </div>
                            
                            <button 
                                type="submit" 
                                class="w-full py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white rounded-xl font-bold text-base btn-hover-lift btn-ripple shadow-lg shadow-primary/30 mt-2 animate-slide-up"
                                style="animation-delay: 0.2s;"
                            >
                                <span class="flex items-center justify-center gap-2">
                                    <span class="material-symbols-outlined">login</span>
                                    Masuk
                                </span>
                            </button>
                        </form>
                        
                        <div class="mt-6 text-center animate-fade-in" style="animation-delay: 0.3s;">
                            <a href="#/" class="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
                                <span class="material-symbols-outlined text-[18px]">arrow_back</span>
                                Kembali ke Jadwal
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    handleSubmit(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('login-error');
        const form = document.getElementById('login-form');

        if (StorageUtils.validateAdmin(username, password)) {
            // Success animation
            form.classList.add('bounce-success');
            StorageUtils.setAdminSession(true);
            setTimeout(() => {
                window.location.hash = '#/admin';
            }, 300);
        } else {
            // Error animation
            errorDiv.classList.remove('hidden');
            errorDiv.classList.remove('shake-error');
            void errorDiv.offsetWidth; // Trigger reflow
            errorDiv.classList.add('shake-error');

            setTimeout(() => {
                errorDiv.classList.add('hidden');
            }, 3000);
        }
    }
};
