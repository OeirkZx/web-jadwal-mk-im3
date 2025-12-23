// Manage Mata Kuliah Page with Supabase CRUD

const ManageMataKuliahPage = {
    render() {
        if (!StorageUtils.isAdminLoggedIn()) {
            window.location.hash = '#/login';
            return '';
        }

        const mkData = DataManager.getMataKuliah();

        const mkRows = mkData.map((mk, index) => {
            const jadwalCount = DataManager.getJadwal().filter(j => (j.mkId || j.mk_id) === mk.id).length;

            return `
                <tr class="hover:bg-[#1e293b]/50 transition-colors" style="animation: staggerFadeIn 0.4s ease ${index * 0.05}s backwards;">
                    <td class="px-6 py-4">
                        <span class="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full font-bold">${mk.kode}</span>
                    </td>
                    <td class="px-6 py-4">
                        <div class="text-white font-bold">${mk.nama}</div>
                    </td>
                    <td class="px-6 py-4 text-gray-300 text-center">${mk.sks}</td>
                    <td class="px-6 py-4">
                        <span class="text-xs ${mk.jenis === 'Wajib' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'} px-3 py-1 rounded-full font-medium">${mk.jenis}</span>
                    </td>
                    <td class="px-6 py-4 text-gray-300 text-center hidden md:table-cell">${jadwalCount}</td>
                    <td class="px-6 py-4">
                        <div class="flex gap-2">
                            <button onclick="ManageMataKuliahPage.edit(${mk.id})" class="size-9 flex items-center justify-center rounded-lg bg-primary/20 text-primary hover:bg-primary hover:text-white transition-colors" title="Edit">
                                <span class="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button onclick="ManageMataKuliahPage.delete(${mk.id}, '${mk.nama.replace(/'/g, "\\'")}')" class="size-9 flex items-center justify-center rounded-lg bg-red-500/20 text-red-400 hover:bg-red-600 hover:text-white transition-colors" title="Hapus">
                                <span class="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        return `
            ${Header.render(true)}
            
            <main class="flex-1 py-6 md:py-10 px-4 md:px-6 bg-[#0f172a] min-h-screen">
                <div class="max-w-[1200px] mx-auto">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-slide-up">
                        <div>
                            <div class="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                <a href="#/admin" class="hover:text-white transition-colors">Dashboard</a>
                                <span class="material-symbols-outlined text-[16px]">chevron_right</span>
                                <span class="text-white">Kelola Mata Kuliah</span>
                            </div>
                            <h1 class="text-white text-2xl md:text-3xl font-bold">Kelola Mata Kuliah</h1>
                            <p class="text-gray-400 text-sm mt-1">${mkData.length} mata kuliah terdaftar</p>
                        </div>
                        <button onclick="ManageMataKuliahPage.add()" class="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold transition-all btn-hover-lift btn-ripple">
                            <span class="material-symbols-outlined">add</span>
                            Tambah Mata Kuliah
                        </button>
                    </div>
                    
                    <div class="overflow-x-auto rounded-xl border border-[#334155] bg-[#1e293b] animate-fade-in">
                        <table class="w-full min-w-[600px]">
                            <thead>
                                <tr class="border-b border-[#334155] bg-[#0f172a]">
                                    <th class="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">Kode</th>
                                    <th class="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">Nama</th>
                                    <th class="px-6 py-4 text-center text-sm font-bold text-gray-300 uppercase tracking-wider">SKS</th>
                                    <th class="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">Jenis</th>
                                    <th class="px-6 py-4 text-center text-sm font-bold text-gray-300 uppercase tracking-wider hidden md:table-cell">Jadwal</th>
                                    <th class="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider w-32">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-[#334155]">
                                ${mkRows || '<tr><td colspan="6" class="px-6 py-12 text-center text-gray-500">Belum ada data mata kuliah</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        `;
    },

    getForm(mk = null) {
        const isEdit = mk !== null;

        return `
            <form id="mk-form" class="flex flex-col gap-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Kode Mata Kuliah</label>
                        <input type="text" name="kode" value="${isEdit ? mk.kode : ''}" required
                            class="w-full px-4 py-3 rounded-lg bg-[#1e293b] border border-[#334155] text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none uppercase"
                            placeholder="IM301"/>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">SKS</label>
                        <input type="number" name="sks" value="${isEdit ? mk.sks : ''}" min="1" max="6" required
                            class="w-full px-4 py-3 rounded-lg bg-[#1e293b] border border-[#334155] text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            placeholder="3"/>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Nama Mata Kuliah</label>
                    <input type="text" name="nama" value="${isEdit ? mk.nama : ''}" required
                        class="w-full px-4 py-3 rounded-lg bg-[#1e293b] border border-[#334155] text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        placeholder="Sistem Informasi Kesehatan"/>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Jenis</label>
                    <select name="jenis" required class="w-full px-4 py-3 rounded-lg bg-[#1e293b] border border-[#334155] text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                        <option value="Wajib" ${isEdit && mk.jenis === 'Wajib' ? 'selected' : ''}>Wajib</option>
                        <option value="Pilihan" ${isEdit && mk.jenis === 'Pilihan' ? 'selected' : ''}>Pilihan</option>
                    </select>
                </div>
                <input type="hidden" name="id" value="${isEdit ? mk.id : ''}"/>
            </form>
        `;
    },

    add() {
        AdminModal.show('Tambah Mata Kuliah Baru', this.getForm(), async () => {
            const form = document.getElementById('mk-form');
            const formData = new FormData(form);

            const mk = {
                kode: formData.get('kode').toUpperCase(),
                nama: formData.get('nama'),
                sks: parseInt(formData.get('sks')),
                jenis: formData.get('jenis')
            };

            AdminModal.hide();
            AdminModal.toast('Menyimpan...', 'info');

            const result = await DataManager.addMataKuliah(mk);
            if (result) {
                AdminModal.toast('Mata kuliah berhasil ditambahkan!');
            } else {
                AdminModal.toast('Gagal menambahkan mata kuliah', 'error');
            }
            App.refresh();
        });
    },

    edit(id) {
        const mk = DataManager.getMataKuliahById(id);
        if (!mk) return;

        AdminModal.show('Edit Mata Kuliah', this.getForm(mk), async () => {
            const form = document.getElementById('mk-form');
            const formData = new FormData(form);

            const updates = {
                kode: formData.get('kode').toUpperCase(),
                nama: formData.get('nama'),
                sks: parseInt(formData.get('sks')),
                jenis: formData.get('jenis')
            };

            AdminModal.hide();
            AdminModal.toast('Menyimpan...', 'info');

            const result = await DataManager.updateMataKuliah(id, updates);
            if (result) {
                AdminModal.toast('Mata kuliah berhasil diperbarui!');
            } else {
                AdminModal.toast('Gagal memperbarui mata kuliah', 'error');
            }
            App.refresh();
        });
    },

    delete(id, nama) {
        AdminModal.confirmDelete(
            `Apakah Anda yakin ingin menghapus <strong class="text-white">${nama}</strong>? Jadwal yang terkait juga akan dihapus.`,
            async () => {
                AdminModal.toast('Menghapus...', 'info');
                const result = await DataManager.deleteMataKuliah(id);
                if (result) {
                    AdminModal.toast('Mata kuliah berhasil dihapus!');
                } else {
                    AdminModal.toast('Gagal menghapus mata kuliah', 'error');
                }
                App.refresh();
            }
        );
    }
};
