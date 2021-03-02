export const modelSosek = {
  id: '',
  enumerator: '',
  tanggal: '',
  dusun: '',
  desa: '',
  kecamatan: '',
  nama: '',
  gender: '',
  umur: '',
  hubungan: '',
  marital: '',
  pendidikan: '',
  pekerjaan: '',
  agama: '',
  suku: '',
  bahasa: '',
  mukim: '',
  kerentanan: '',
  anggota: [],
  //
  pekerjaanLain: [],
  pendapatanPerBulan: 0,
  sumberPendapatan: [],
  pengeluaranPerBulan: 0,
  sumberPengeluaran: [],
  sumberMakanan: {
    nasi: '',
    lauk: '',
    bumbu: '',
    gulaKopi: '',
  },
  //
  rumah: {
    struktur: '',
    kerusakan: '',
    ruang: 0,
    kepemilikan: '',
    buktiKepemilikan: '',
  },
  //
  tanah: {
    rumah: 0,
    kebun: 0,
    sawah: 0,
    ladang: 0,
    nonProduktif: 0,
    lainnya: 0,
  },
  //
  hasilPertanian: [],
  hasilTernak: [],
  hasilIkan: [],
  hasilHutan: [],
  hasilSatwa: [],


  // KESEHATAN

  tempatBerobat: [],
  frekuensiBerobat: '',
  kondisiFaskes: '',
  kondisiFaskesInfo: '',
  kartuKIS: '',
  kartuKISInfo: '',
  kejadianPenyakit: [],
  // penyakitPermanen: [],
  // sumberAir: {
  sumberAirMandi: [],
  sumberAirMinum: [],
  sumberAirMasak: [],
  sumberAirProblem: [],
  //
  sumberListrik: [],
  kelolaSampah: [],
  bab: [],
  tinja: [],
  limbahCair: [],


  // PHBS

  persalinan: '',
  asi: '',
  rawatBayi: '',
  rawatBayiInfo: '',
  airBersih: '',
  cuciTangan: '',
  nyamuk3m: '',
  bersayur: '',
  olahraga: '',
  merokok: '',

  // OBSERVASI

  observasiLangit: '',
  observasiDinding: '',
  observasiLantai: '',
  observasiJendelaKamar: '',
  observasiJendelaRuang: '',
  observasiVentilasi: '',
  observasiPencahayaan: '',
  observasiAsap: '',
  observasiKepadatan: '',


  // PERSEPSI

  psKonsen: '',
  psKonsenInfo: '',
  psEkonomiLokal: '',
  psEkonomiLokalInfo: '',
  psLapanganKerja: '',
  psLapanganKerjaInfo: '',
  psLingkungan: '',
  psLingkunganInfo: '',
  psKesmas: '',
  psKesmasInfo: '',
  psKepekaan: '',
  psKepekaanInfo: '',
  psInfrastruktur: '',
  psInfrastrukturInfo: '',
  psAdat: '',
  psAdatInfo: '',
  psGotongRoyong: '',
  psGotongRoyongInfo: '',
  psSikap: '',
  psSikapInfo: '',
}

export const modelAnggota = {
  nama: '',
  gender: '',
  umur: 0,
  hubungan: '',
  marital: '',
  kerentanan: '',
  pendidikan: '',
  pekerjaan: '',
}

export const hasilTani = {
  jenis: '', untuk: '',
  luas: 0,
  dikonsumsi: 0,
  dijual: 0,
  nilai: 0
}

export const hasilAlam = {
  jenis: '', luas: 0, untuk: '',
  satuan: '',
  dikonsumsi: 0,
  dijual: 0,
  nilai: 0,
}

export const dfSumberMakan = [
  ['Membeli', 'Membeli'],
  ['Kebun sendiri', 'Kebun sendiri'],
  ['Bantuan pemerintah', 'Bantuan pemerintah'],
  ['Bantuan kerabat', 'Bantuan kerabat'],
  ['Hutan', 'Hutan'],
  ['Lainnya', 'Lainnya'],
]
export const dfAgama = [
  ['Aliran kepercayaan', 'Aliran kepercayaan'],
  ['Budha', 'Budha'],
  ['Hindu', 'Hindu'],
  ['Islam', 'Islam'],
  ['Katolik', 'Katolik'],
  ['Kristen', 'Kristen'],
  ['Lainnya', 'Lainnya'],
]
export const dfMukim = [
  ['Sejak lahir', 'Sejak lahir'],
  ['3', '3 tahun'],
  ['5', '5 tahun'],
  ['10', '10 tahun'],
  ['15', '15 tahun'],
  ['20', '20 tahun'],
  ['25', '25 tahun'],
  ['30', '30 tahun'],
  ['30+', 'Lebi dari 30 tahun']
]
export const dfPendidikan = [
  ['Tidak pernah sekolah', 'Tidak pernah sekolah'],
  ['Tidak lulus SD', 'Tidak lulus SD'],
  ['SD', 'SD'],
  ['SMP', 'SMP'],
  ['SMA', 'SMA'],
  ['D1/D2/D3', 'D1/D2/D3'],
  ['S1/D4', 'S1/D4'],
  ['S2/S3', 'S2/S3'],
]
export const dfHubungan = [
  ['Kepala keluarga', 'Kepala keluarga'],
  ['Istri', 'Istri'],
  ['Anak', 'Anak'],
  ['Adik', 'Adik'],
  ['Orang tua', 'Orang tua'],
  ['Lainnya', 'Lainnya'],
]
export const dfStatus = [
  ['Menikah', 'Menikah'],
  ['Tidak menikah', 'Tidak menikah'],
  ['Cerai hidup', 'Cerai hidup'],
  ['Cerai mati', 'Cerai mati'],
]
export const dfGender = [
  ['Laki-laki', 'Laki-laki'],
  ['Perempuan', 'Perempuan'],
]
export const dfPekerjaan = [
  ['Anggota DPR/DPRD', 'Anggota DPR/DPRD'],
  ['Buruh', 'Buruh'],
  ['Buruh tani', 'Buruh tani'],
  ['Ibu rumahtangga', 'Ibu rumahtangga'],
  ['Karyawan swasta', 'Karyawan swasta'],
  ['PNS', 'PNS'],
  ['Nelayan', 'Nelayan'],
  ['Petani', 'Petani'],
  ['Tentara/Polisi', 'Tentara/Polisi'],
  ['Tukang', 'Tukang'],
  ['Wiraswasta', 'Wiraswasta'],
  ['Peternak', 'Peternak'],
  ['Masih sekolah', 'Masih sekolah'],
  ['Mencari kerja', 'Mencari kerja'],
  ['Menganggur', 'Menganggur'],
  ['Lainnya', 'Lainnya'],
]
export const dfRentan = [
  ['Disabilitas', 'Disabilitas'],
  ['KK Perempuan', 'KK Perempuan'],
  ['Lansia > 70th', 'Lansia > 70th'],
]
export const dfPendapatan = [
  ['Gaji', 'Gaji'],
  ['Upah', 'Upah'],
  ['Pertanian', 'Pertanian'],
  ['Perkebunan', 'Perkebunan'],
  ['Peternakan', 'Peternakan'],
  ['Perikanan', 'Perikanan'],
  ['Hasil Hutan', 'Hasil Hutan'],
]
export const dfBelanja = [
  ['Makan-minum', 'Makan-minum'],
  ['Pendidikan', 'Pendidikan'],
  ['Kesehatan', 'Kesehatan'],
  ['Transportasi', 'Transportasi'],
  ['Listrik', 'Listrik'],
  ['Komunikasi', 'Komunikasi'],
  ['Tempat tinggal', 'Tempat tinggal'],
  ['Hiburan', 'Hiburan'],
  ['Angsuran', 'Angsuran'],
  ['Bayar Pinjaman', 'Bayar Pinjaman'],
  ['Lainnya', 'Lainnya'],
]
export const dfKategoriRumah = [
  ['Permanen', 'Permanen'],
  ['Semi permanen', 'Semi permanen'],
  ['Tidak permanen', 'Tidak permanen']
]
export const dfKondisiRumah = [
  ['Tidak rusak', 'Tidak rusak'],
  ['Rusak sebagian', 'Rusak sebagian'],
  ['Rusak sepenuhnya', 'Rusak sepenuhnya']
]
export const dfKepemilikan = [
  ['Milik sendiri', 'Milik sendiri'],
  ['Menyewa', 'Menyewa'],
  ['Milik orang lain', 'Milik orang lain']
]

export const dfBulan = [
  ['01', 'Januari'],
  ['02', 'Februari'],
  ['03', 'Maret'],
  ['04', 'April'],
  ['05', 'Mei'],
  ['06', 'Juni'],
  ['07', 'Juli'],
  ['08', 'Agustus'],
  ['09', 'September'],
  ['10', 'Oktober'],
  ['11', 'November'],
  ['12', 'Desember'],
]

export const dfTanggal = ('01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31').split(' ')

export const dfBerobat = [
  'Dokter',
  'Rumahsakit',
  'Puskesmas',
  'Klinik',
  'Dukun',
  'Paranormal',
  'Beli obat sendiri',
  'Lainnya',
]

export const dfFrekuensiBerobat = [
  ['Rutin / sangat sering', 'Rutin / sangat sering'],
  ['Sering', 'Sering'],
  ['Jarang', 'Jarang'],
  ['Sangat jarang', 'Sangat jarang'],
  ['Tidak pernah', 'Tidak pernah'],
]

export const dfKejadian = [
  'nama',
  'usia',
  'penyakit',
  'info',
]

export const dfFaskes = [
  ['Sangat memadahi', 'Sangat memadahi'],
  ['Cukup memadahi', 'Cukup memadahi'],
  ['Kurang memadahi', 'Kurang memadahi'],
]

export const dfSumberair = [
  'PDAM',
  'Perpipaan Non-PDAM',
  'Air sumur',
  'Air sungai',
  'Mata air',
  'Kolam / danau',
  'Lainnya',
]

export const dfMasalahAir = [
  'Sumber terbatas',
  'Sumber jauh',
  'Sumber tercemar',
  'Tidak ada',
]

export const dfListrik = [
  'PLN',
  'Non-PLN',
  'Genset',
  'Lainnya',
  'Tidak ada',
]

export const dfSampah = [
  'Buang di kebun',
  'Dibakar',
  'Ditimbun',
  'Dibuang di TPS',
  'Diambil petugas',
  'Lainnya'
]

export const dfBAB = [
  'WC sendiri',
  'WC umum',
  'WC tetangga',
  'Kolam',
  'Sungai',
  'Kebun',
  'Lainnya',
]

export const dfTinja = [
  'Septic tank',
  'Kebun',
  'Lubang tanah',
  'Lainnya',
]

export const dfLimbahCair = [
  'Saluran Limbah',
  'Kebun/halaman',
  'Kolam',
  'Lainnya',
]

export const dfSayur = [
  'Maks 3 kali seminggu',
  'Lebih dari 3 kali dalam seminggu',
  'Kadang-kadang',
  'Sangat jarang',
  'Tidak pernah',
]



export const dfPenyakit = [
  'ISPA ',
  'Malaria ',
  'Diare ',
  'TBC',
  'Tifus',
  'Demam ',
  'Diabetes ',
  'Asma',
  'DBD',
  'Pentakit kulit ',
  'Hipertensi',
  'Lainnya',
]

export const kejadianPenyakit = {
  nama: '',
  umur: '',
  penyakit: '',
  kategori: '',
  keterangan: '',
}

export const dfKategoriPenyakit = [
  'Menular',
  'Tidak menular',
  'Permanen',
  'Menahun',
]


export const YYY = [
  'nama',
  'usia',
  'penyakit',
  'info',
]



export const BBB = [
  'nama',
  'usia',
  'penyakit',
  'info',
]



export const AAA = [
  'nama',
  'usia',
  'penyakit',
  'info',
]



export const CCC = [
  'nama',
  'usia',
  'penyakit',
  'info',
]

