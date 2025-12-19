// Manage Dosen Page with Full CRUD

const ManageDosenPage = {
    render() {
        if (!StorageUtils.isAdminLoggedIn()) {
            window.location.hash = '#/login';
            return '';
        }

        const dosenData = DataManager.getDosen();

        const dosenRows = dosenData.map((dosen, index) => {
            const courses = DataManager.getJadwal()
                .filter(j => j.dosenId === dosen.id)
                .map(j => DataManager.getMataKuliahById(j.mkId))
                .filter(m => m)
                .filter((m, i, arr) => arr.findIndex(x => x.id === m.id) === i);

            return `
                <tr class="hover:bg-[#1e293b]/50 transition-colors" style="animation: staggerFadeIn 0.4s ease ${index * 0.05}s backwards;">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center gap-3">
                            <div class="size-10 rounded-full bg-cover bg-center ring-2 ring-[#334155]" style="background-image: url('${dosen.foto}');"></div>
                            <div>
                                <div class="text-white font-bold">${dosen.nama}</div>
                                <div class="text-gray-400 text-sm">${dosen.bidang}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-gray-300">${dosen.nidn}</td>
                    <td class="px-6 py-4 text-gray-300 hidden md:table-cell">${dosen.email}</td>
                    <td class="px-6 py-4">
                        <div class="flex gap-2">
                            <button onclick="ManageDosenPage.edit(${dosen.id})" class="size-9 flex items-center justify-center rounded-lg bg-primary/20 text-primary hover:bg-primary hover:text-white transition-colors" title="Edit">
                                <span class="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button onclick="ManageDosenPage.delete(${dosen.id}, '${dosen.nama}')" class="size-9 flex items-center justify-center rounded-lg bg-red-500/20 text-red-400 hover:bg-red-600 hover:text-white transition-colors" title="Hapus">
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
                                <span class="text-white">Kelola Dosen</span>
                            </div>
                            <h1 class="text-white text-2xl md:text-3xl font-bold">Kelola Dosen</h1>
                            <p class="text-gray-400 text-sm mt-1">${dosenData.length} dosen terdaftar</p>
                        </div>
                        <button onclick="ManageDosenPage.add()" class="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold transition-all btn-hover-lift btn-ripple">
                            <span class="material-symbols-outlined">add</span>
                            Tambah Dosen
                        </button>
                    </div>
                    
                    <div class="overflow-x-auto rounded-xl border border-[#334155] bg-[#1e293b] animate-fade-in">
                        <table class="w-full min-w-[600px]">
                            <thead>
                                <tr class="border-b border-[#334155] bg-[#0f172a]">
                                    <th class="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">Dosen</th>
                                    <th class="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">NIDN</th>
                                    <th class="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider hidden md:table-cell">Email</th>
                                    <th class="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider w-32">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-[#334155]">
                                ${dosenRows || '<tr><td colspan="4" class="px-6 py-12 text-center text-gray-500">Belum ada data dosen</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        `;
    },

    // Form HTML for add/edit
    getForm(dosen = null) {
        const isEdit = dosen !== null;
        return `
            <form id="dosen-form" class="flex flex-col gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Nama Lengkap (dengan gelar)</label>
                    <input type="text" name="nama" value="${isEdit ? dosen.nama : ''}" required
                        class="w-full px-4 py-3 rounded-lg bg-[#1e293b] border border-[#334155] text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        placeholder="Dr. Nama Dosen, M.Kom"/>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">NIDN</label>
                        <input type="text" name="nidn" value="${isEdit ? dosen.nidn : ''}" required
                            class="w-full px-4 py-3 rounded-lg bg-[#1e293b] border border-[#334155] text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            placeholder="12345678"/>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">No. HP (WhatsApp)</label>
                        <input type="text" name="noHp" value="${isEdit ? dosen.noHp : ''}" required
                            class="w-full px-4 py-3 rounded-lg bg-[#1e293b] border border-[#334155] text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            placeholder="6281234567890"/>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input type="email" name="email" value="${isEdit ? dosen.email : ''}" required
                        class="w-full px-4 py-3 rounded-lg bg-[#1e293b] border border-[#334155] text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        placeholder="dosen@universitas.ac.id"/>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Bidang Keahlian</label>
                    <input type="text" name="bidang" value="${isEdit ? dosen.bidang : ''}" required
                        class="w-full px-4 py-3 rounded-lg bg-[#1e293b] border border-[#334155] text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        placeholder="Informatika Medis"/>
                </div>
                <input type="hidden" name="id" value="${isEdit ? dosen.id : ''}"/>
            </form>
        `;
    },

    add() {
        AdminModal.show('Tambah Dosen Baru', this.getForm(), () => {
            const form = document.getElementById('dosen-form');
            const formData = new FormData(form);

            const dosen = {
                nama: formData.get('nama'),
                nidn: formData.get('nidn'),
                noHp: formData.get('noHp'),
                email: formData.get('email'),
                bidang: formData.get('bidang')
            };

            DataManager.addDosen(dosen);
            AdminModal.hide();
            AdminModal.toast('Dosen berhasil ditambahkan!');
            App.refresh();
        });
    },

    edit(id) {
        const dosen = DataManager.getDosenById(id);
        if (!dosen) return;

        AdminModal.show('Edit Data Dosen', this.getForm(dosen), () => {
            const form = document.getElementById('dosen-form');
            const formData = new FormData(form);

            const updates = {
                nama: formData.get('nama'),
                nidn: formData.get('nidn'),
                noHp: formData.get('noHp'),
                email: formData.get('email'),
                bidang: formData.get('bidang')
            };

            DataManager.updateDosen(id, updates);
            AdminModal.hide();
            AdminModal.toast('Data dosen berhasil diperbarui!');
            App.refresh();
        });
    },

    delete(id, nama) {
        AdminModal.confirmDelete(
            `Apakah Anda yakin ingin menghapus <strong class="text-white">${nama}</strong>? Jadwal yang terkait juga akan dihapus.`,
            () => {
                DataManager.deleteDosen(id);
                AdminModal.toast('Dosen berhasil dihapus!');
                App.refresh();
            }
        );
    }
};
