-- ===============================================
-- Supabase Database Schema for Jadwal IM
-- Jalankan SQL ini di Supabase SQL Editor
-- ===============================================

-- 1. Tabel Dosen
CREATE TABLE IF NOT EXISTS dosen (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    nidn VARCHAR(50) NOT NULL,
    no_hp VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    bidang VARCHAR(255) NOT NULL,
    foto TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabel Mata Kuliah
CREATE TABLE IF NOT EXISTS matakuliah (
    id SERIAL PRIMARY KEY,
    kode VARCHAR(20) NOT NULL,
    nama VARCHAR(255) NOT NULL,
    sks INTEGER NOT NULL DEFAULT 3,
    jenis VARCHAR(50) NOT NULL DEFAULT 'Wajib',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabel Jadwal
CREATE TABLE IF NOT EXISTS jadwal (
    id SERIAL PRIMARY KEY,
    hari VARCHAR(20) NOT NULL,
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    ruangan VARCHAR(100) NOT NULL,
    mk_id INTEGER REFERENCES matakuliah(id) ON DELETE CASCADE,
    dosen_id INTEGER REFERENCES dosen(id) ON DELETE CASCADE,
    pj_nama VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabel Admin Users (opsional, untuk multiple admin)
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nama VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- Row Level Security (RLS) - Biar bisa diakses publik
-- ===============================================

-- Enable RLS
ALTER TABLE dosen ENABLE ROW LEVEL SECURITY;
ALTER TABLE matakuliah ENABLE ROW LEVEL SECURITY;
ALTER TABLE jadwal ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations for anon users (public access)
CREATE POLICY "Allow public read access on dosen" ON dosen FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on dosen" ON dosen FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on dosen" ON dosen FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on dosen" ON dosen FOR DELETE USING (true);

CREATE POLICY "Allow public read access on matakuliah" ON matakuliah FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on matakuliah" ON matakuliah FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on matakuliah" ON matakuliah FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on matakuliah" ON matakuliah FOR DELETE USING (true);

CREATE POLICY "Allow public read access on jadwal" ON jadwal FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on jadwal" ON jadwal FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on jadwal" ON jadwal FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on jadwal" ON jadwal FOR DELETE USING (true);

-- ===============================================
-- Insert Data Awal (Seed Data)
-- ===============================================

-- Insert Dosen
INSERT INTO dosen (nama, nidn, no_hp, email, bidang, foto) VALUES
('Dr. Ahmad Fauzi, M.Kom', '0123456789', '6281234567890', 'ahmad.fauzi@univ.ac.id', 'Informatika Medis', 'https://ui-avatars.com/api/?name=Ahmad+Fauzi&background=4287f5&color=fff&size=128'),
('Prof. Dr. Siti Aminah, M.Sc', '0987654321', '6281234567891', 'siti.aminah@univ.ac.id', 'Sistem Informasi Kesehatan', 'https://ui-avatars.com/api/?name=Siti+Aminah&background=4287f5&color=fff&size=128'),
('Dr. Budi Santoso, M.T', '1122334455', '6281234567892', 'budi.santoso@univ.ac.id', 'Rekayasa Perangkat Lunak', 'https://ui-avatars.com/api/?name=Budi+Santoso&background=4287f5&color=fff&size=128'),
('Dr. Rina Fitriana, M.Kom', '5544332211', '6281234567893', 'rina.fitriana@univ.ac.id', 'Data Science Kesehatan', 'https://ui-avatars.com/api/?name=Rina+Fitriana&background=4287f5&color=fff&size=128');

-- Insert Mata Kuliah
INSERT INTO matakuliah (kode, nama, sks, jenis) VALUES
('IM301', 'Sistem Informasi Kesehatan', 3, 'Wajib'),
('IM302', 'Basis Data Medis', 3, 'Wajib'),
('IM303', 'Rekam Medis Elektronik', 3, 'Wajib'),
('IM304', 'Analisis Data Kesehatan', 3, 'Wajib'),
('IM305', 'Keamanan Informasi Kesehatan', 2, 'Wajib'),
('IM306', 'Telemedicine', 2, 'Pilihan');

-- Insert Jadwal
INSERT INTO jadwal (hari, jam_mulai, jam_selesai, ruangan, mk_id, dosen_id, pj_nama) VALUES
('Senin', '08:00', '10:30', 'Lab Komputer 1', 1, 1, 'Ahmad Rizky'),
('Senin', '13:00', '15:30', 'R. 301', 2, 2, 'Dewi Lestari'),
('Selasa', '08:00', '10:30', 'R. 302', 3, 3, 'Budi Pratama'),
('Selasa', '13:00', '15:30', 'Lab Komputer 2', 4, 4, 'Siti Rahayu'),
('Rabu', '10:00', '12:30', 'R. 301', 5, 1, 'Ahmad Rizky'),
('Kamis', '08:00', '10:30', 'Lab Komputer 1', 6, 2, 'Dewi Lestari'),
('Kamis', '13:00', '15:30', 'R. 303', 1, 3, 'Budi Pratama'),
('Jumat', '08:00', '10:30', 'R. 302', 2, 4, 'Siti Rahayu');
