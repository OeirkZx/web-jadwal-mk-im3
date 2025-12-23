// Manage Jadwal Page with Supabase CRUD

const ManageJadwalPage = {
    render() {
        if (!StorageUtils.isAdminLoggedIn()) {
            window.location.hash = '#/login';
            return '';
        }

        const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
        const jadwalData = DataManager.getJadwal();

        const jadwalByDay = days.map(day => {
            const jadwal = DataManager.getJadwalByHari(day);

            const jadwalRows = jadwal.length > 0
                ? jadwal.map((j, index) => `
                    <tr class="hover:bg-[#1e293b]/50 transition-colors" style="animation: staggerFadeIn 0.3s ease ${index * 0.05}s backwards;">
                        <td class="px-4 py-3 text-white font-medium">${j.jamMulai} - ${j.jamSelesai}</td>
                        <td class="px-4 py-3">
                            <div class="text-white font-bold">${j.mataKuliah?.nama || 'N/A'}</div>
                        </td>
                        <td class="px-4 py-3 text-gray-300">${j.ruangan}</td>
                        <td class="px-4 py-3 text-gray-300 hidden md:table-cell">${j.dosen?.nama?.split(',')[0] || 'N/A'}</td>
                        <td class="px-4 py-3 text-gray-300 hidden lg:table-cell">${j.pjNama || '-'}</td>
                        <td class="px-4 py-3">
                            <div class="flex gap-2">
                                <button onclick="ManageJadwalPage.edit(${j.id})" class="size-8 flex items-center justify-center rounded-lg bg-primary/20 text-primary hover:bg-primary hover:text-white transition-colors" title="Edit">
                                    <span class="material-symbols-outlined text-[16px]">edit</span>
                                </button>
                                <button onclick="ManageJadwalPage.delete(${j.id})" class="size-8 flex items-center justify-center rounded-lg bg-red-500/20 text-red-400 hover:bg-red-600 hover:text-white transition-colors" title="Hapus">
                                    <span class="material-symbols-outlined text-[16px]">delete</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('')
                : `<tr><td colspan="6" class="px-4 py-6 text-center text-gray-500">Tidak ada jadwal</td></tr>`;

            return `
                <div class="mb-6 animate-fade-in" style="animation-delay: ${days.indexOf(day) * 0.1}s;">
                    <h3 class="text-white font-bold text-lg mb-3 flex items-center gap-2">
                        <span class="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">${day.charAt(0)}</span>
                        ${day}
                        <span class="text-gray-400 text-sm font-normal">(${jadwal.length} kelas)</span>
                    </h3>
                    <div class="overflow-x-auto rounded-lg border border-[#334155] bg-[#1e293b]">
                        <table class="w-full min-w-[500px]">
                            <thead>
                                <tr class="border-b border-[#334155] bg-[#0f172a]">
                                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Jam</th>
                                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Mata Kuliah</th>
                                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Ruang</th>
                                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase hidden md:table-cell">Dosen</th>
                                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase hidden lg:table-cell">PJ</th>
                                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase w-24">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-[#334155]">
                                ${jadwalRows}
                            </tbody>
                        </table>
                    </div>
                </div>
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
                                <span class="text-white">Kelola Jadwal</span>
                            </div>
                            <h1 class="text-white text-2xl md:text-3xl font-bold">Kelola Jadwal</h1>
                            <p class="text-gray-400 text-sm mt-1">${jadwalData.length} jadwal terdaftar</p>
                        </div>
                        <button onclick="ManageJadwalPage.add()" class="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold transition-all btn-hover-lift btn-ripple">
                            <span class="material-symbols-outlined">add</span>
                            Tambah Jadwal
                        </button>
                    </div>
                    
                    ${jadwalByDay}
                </div>
            </main>
        `;
    },

    getForm(jadwal = null) {
        const isEdit = jadwal !== null;
        const dosenOptions = DataManager.getDosen().map(d =>
            `<option value="${d.id}" ${isEdit && (jadwal.dosenId === d.id || jadwal.dosen_id === d.id) ? 'selected' : ''}>${d.nama}</option>`
        ).join('');

        const mkOptions = DataManager.getMataKuliah().map(m =>
            `<option value="${m.id}" ${isEdit && (jadwal.mkId === m.id || jadwal.mk_id === m.id) ? 'selected' : ''}>${m.nama} (${m.kode})</option>`
        ).join('');

        const hariOptions = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map(h =>
            `<option value="${h}" ${isEdit && jadwal.hari === h ? 'selected' : ''}>${h}</option>`
        ).join('');

        const jamMulai = isEdit ? (jadwal.jamMulai || jadwal.jam_mulai || '') : '';
        const jamSelesai = isEdit ? (jadwal.jamSelesai || jadwal.jam_selesai || '') : '';
        const pjNama = isEdit ? (jadwal.pjNama || jadwal.pj_nama || '') : '';

        return `
            <form id="jadwal-form" class="flex flex-col gap-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Hari</label>
                        <select name="hari" required class="w-full px-4 py-3 rounded-lg bg-[#1e293b] border border-[#334155] text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                            ${hariOptions}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Ruangan</label>
                        <input type="text" name="ruangan" value="${isEdit ? jadwal.ruangan : ''}" required
                            class="w-full px-4 py-3 rounded-lg bg-[#1e293b] border border-[#334155] text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            placeholder="R. 301 / Lab Komputer"/>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Jam Mulai</label>
                        <input type="time" name="jamMulai" value="${jamMulai}" required
                            class="w-full px-4 py-3 rounded-lg bg-[#1e293b] border border-[#334155] text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"/>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Jam Selesai</label>
                        <input type="time" name="jamSelesai" value="${jamSelesai}" required
                            class="w-full px-4 py-3 rounded-lg bg-[#1e293b] border border-[#334155] text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"/>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Mata Kuliah</label>
                    <select name="mkId" required class="w-full px-4 py-3 rounded-lg bg-[#1e293b] border border-[#334155] text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                        <option value="">-- Pilih Mata Kuliah --</option>
                        ${mkOptions}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Dosen</label>
                    <select name="dosenId" required class="w-full px-4 py-3 rounded-lg bg-[#1e293b] border border-[#334155] text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                        <option value="">-- Pilih Dosen --</option>
                        ${dosenOptions}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Nama PJ Kelas</label>
                    <input type="text" name="pjNama" value="${pjNama}" required
                        class="w-full px-4 py-3 rounded-lg bg-[#1e293b] border border-[#334155] text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        placeholder="Nama mahasiswa PJ"/>
                </div>
                <input type="hidden" name="id" value="${isEdit ? jadwal.id : ''}"/>
            </form>
        `;
    },

    add() {
        AdminModal.show('Tambah Jadwal Baru', this.getForm(), async () => {
            const form = document.getElementById('jadwal-form');
            const formData = new FormData(form);

            const jadwal = {
                hari: formData.get('hari'),
                mkId: parseInt(formData.get('mkId')),
                dosenId: parseInt(formData.get('dosenId')),
                jamMulai: formData.get('jamMulai'),
                jamSelesai: formData.get('jamSelesai'),
                ruangan: formData.get('ruangan'),
                pjNama: formData.get('pjNama')
            };

            AdminModal.hide();
            AdminModal.toast('Menyimpan...', 'info');

            const result = await DataManager.addJadwal(jadwal);
            if (result) {
                AdminModal.toast('Jadwal berhasil ditambahkan!');
            } else {
                AdminModal.toast('Gagal menambahkan jadwal', 'error');
            }
            App.refresh();
        });
    },

    edit(id) {
        const jadwal = DataManager.getJadwalById(id);
        if (!jadwal) return;

        AdminModal.show('Edit Jadwal', this.getForm(jadwal), async () => {
            const form = document.getElementById('jadwal-form');
            const formData = new FormData(form);

            const updates = {
                hari: formData.get('hari'),
                mkId: parseInt(formData.get('mkId')),
                dosenId: parseInt(formData.get('dosenId')),
                jamMulai: formData.get('jamMulai'),
                jamSelesai: formData.get('jamSelesai'),
                ruangan: formData.get('ruangan'),
                pjNama: formData.get('pjNama')
            };

            AdminModal.hide();
            AdminModal.toast('Menyimpan...', 'info');

            const result = await DataManager.updateJadwal(id, updates);
            if (result) {
                AdminModal.toast('Jadwal berhasil diperbarui!');
            } else {
                AdminModal.toast('Gagal memperbarui jadwal', 'error');
            }
            App.refresh();
        });
    },

    delete(id) {
        const jadwal = DataManager.getJadwalById(id);
        const mk = jadwal ? DataManager.getMataKuliahById(jadwal.mk_id || jadwal.mkId) : null;

        AdminModal.confirmDelete(
            `Hapus jadwal <strong class="text-white">${mk?.nama || 'ini'}</strong>?`,
            async () => {
                AdminModal.toast('Menghapus...', 'info');
                const result = await DataManager.deleteJadwal(id);
                if (result) {
                    AdminModal.toast('Jadwal berhasil dihapus!');
                } else {
                    AdminModal.toast('Gagal menghapus jadwal', 'error');
                }
                App.refresh();
            }
        );
    }
};
