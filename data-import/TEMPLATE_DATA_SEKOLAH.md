# TEMPLATE DATA SEKOLAH

Copas data ini ke Excel dengan format yang sama.

## SHEET 1: SEKOLAH
| nama_sekolah | npsn | provinsi | kota | alamat | telepon | email | token_balance |
|---|---|---|---|---|---|---|---|
| SMA Harapan Bangsa | 99887766 | Jawa Barat | Bandung | Jl. Merdeka No. 10 | 022-1234567 | info@harapan.sch.id | 1000 |

## SHEET 2: TAHUN_AJARAN
| tahun | tanggal_mulai | tanggal_selesai |
|---|---|---|
| 2024/2025 | 2024-07-15 | 2025-06-30 |

## SHEET 3: KELAS
| nama_kelas | tingkat | kapasitas |
|---|---|---|
| 10 IPA 1 | 10 | 36 |
| 10 IPA 2 | 10 | 36 |
| 11 IPA 1 | 11 | 34 |

## SHEET 4: MATA_PELAJARAN
| nama_mapel | kode | wajib |
|---|---|---|
| Matematika | MAT | Y |
| Bahasa Indonesia | BIND | Y |
| Fisika | FIS | Y |

## SHEET 5: GURU
| nama_lengkap | nip | hp | username | jabatan |
|---|---|---|---|---|
| Budi Santoso, S.Pd | 197001011998031001 | 082111111111 | guru1 | guru_mapel |
| Ahmad Fauzi, M.Pd | | 082333333333 | guru2 | wali_kelas |

**CATATAN NIP:** Kosongkan jika guru belum punya NIP (non-PNS/honorer)

## SHEET 6: GURU_MENGAJAR
| username_guru | kode_mapel | nama_kelas | jam_per_minggu |
|---|---|---|---|
| guru1 | MAT | 10 IPA 1 | 4 |
| guru1 | MAT | 11 IPA 1 | 4 |

## SHEET 7: SISWA
| nama_lengkap | nisn | nis | jk | nama_kelas | username | nama_ortu | hp_ortu |
|---|---|---|---|---|---|---|---|
| Andi Pratama | 0051234501 | 10001 | L | 10 IPA 1 | siswa1 | Bapak Andi Suryanto | 081555111111 |
| Bella Anastasia | 0051234502 | 10002 | P | 10 IPA 1 | siswa2 | Ibu Bella Permata | 081555222222 |

**JK:** L = Laki-laki, P = Perempuan

---

## CARA PAKAI:

1. Buat file Excel baru
2. Buat 7 sheet dengan nama: SEKOLAH, TAHUN_AJARAN, KELAS, MATA_PELAJARAN, GURU, GURU_MENGAJAR, SISWA
3. Copas header (baris pertama) dari template di atas
4. Isi data sesuai format
5. Save as: `data-import/data-sekolah.xlsx`
6. Jalankan: `npm run db:import`
