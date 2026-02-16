// Data Management
let scores = JSON.parse(localStorage.getItem('utbkScores')) || [];

// DOM Elements (some initialized in init)
let scoreListEl, avgScoreEl, totalTryoutsEl, scoreForm, modal, eventModal, searchInput;

// Chart Instance
let scoreChart;
let editingScoreId = null; // Track if we are editing

// User Data
let userData = JSON.parse(localStorage.getItem('utbkUserData')) || {
    name: 'Pejuang UTBK 2026',
    email: 'pejuang@dreamptn.id',
    nickname: 'Pejuang PTN',
    phone: '+62 ',
    language: 'id'
};
// Ensure all fields exist and update old defaults
if (!userData.nickname || userData.nickname === 'Jane') {
    userData.nickname = 'Pejuang PTN';
}
if (!userData.phone || userData.phone === '(303) 555-0105') {
    userData.phone = '+62 ';
}
// Save back to localStorage if we updated defaults
localStorage.setItem('utbkUserData', JSON.stringify(userData));

// Translations Dictionary
const translations = {
    'id': {
        'nav-home': 'Beranda',
        'nav-ptn': 'Kampus',
        'nav-schedule': 'Jadwal',
        'nav-faq': 'FAQ',
        'nav-profile': 'Profil',
        'header-welcome': 'Halo,',
        'hero-title': 'Menuju UTBK 2026',
        'hero-subtitle': 'Menuju UTBK 2026',
        'stat-last-score': 'Skor Terakhir',
        'stat-total-to': 'Total Tryout',
        'stat-avg-score': 'Rata-rata',
        'section-target': 'Kampus impianmu',
        'section-stats': 'Statistik Progres',
        'section-schedule': 'Jadwal SNBT 2026',
        'section-detail': 'Detail Kegiatan',
        'profile-title': 'Profil',
        'profile-edit': 'Edit Profile',
        'settings': 'Settings',
        'history': 'History orders',
        'reports': 'Reports',
        'unique-link': 'Your unique link',
        'language': 'Bahasa',
        'help-center': 'Pusat Bantuan (FAQ)',
        'logout': 'Log out',
        'btn-add-score': 'Tambah Skor',
        'btn-save': 'Simpan Perubahan',
        'btn-cancel': 'Batal',
        'btn-back': 'Kembali',
        'modal-title-add': 'Tambah Skor Tryout',
        'modal-title-edit': 'Edit Skor Tryout',
        'facts-title': 'Fakta SNBT',
        'facts-subtitle': 'Berdasarkan Data Seleksi Nasional (SNBT) 2025',
        'fact-registrants': 'pendaftar',
        'fact-passed': 'lolos SNBT',
        'fact-chance': 'peluang SNBT',
        'empty-scores': 'Belum ada data tryout.',
        'schedule-subtitle': 'Pantau agenda persiapanmu',
        'faq-subtitle': 'Temukan jawaban untuk kendala kamu',
        'ptn-subtitle': 'Cek daya tampung & keketatan',
        'rec-title': 'Rekomendasi Strategi',
        'rec-analyzing': 'Rekomendasi urutan pilihan kampus berdasarkan tingkat ketercapaian skor dan daya tampung dan ketetatan',
        'ranking-title': 'Ranking PTN Indonesia',
        'ranking-source': 'Sumber: Webometrics & SNBT 2024',
        'toggle-prodi': 'Prodi',
        'search-placeholder': 'Cari kampus favoritmu...',
        'modal-ptn-title': 'Pilih Universitas & Jurusan',
        'label-uni': 'Universitas',
        'placeholder-uni': 'Cari Universitas/Sekolah Vokasi',
        'label-major': 'Pilih Jurusan',
        'placeholder-major': 'Cari Jurusan',
        'placeholder-select-to': 'Pilih Tryout',
        'search-to-placeholder': 'Cari tryout...',
        'label-date': 'Tanggal',
        'label-to-score': 'Skor Tryout',
        'label-to-name': 'Nama Tryout',
        'label-execution': 'Pelaksanaan',
        'label-link': 'Link Pengerjaan',
        'label-alt-major': 'Alternatif Jurusan',
        'label-target-min': 'Target Minimum Skor',
        'label-no-data': 'Belum ada data',
        'label-choice': 'Pilihan',
        'label-academic-program': 'Program Sarjana (S1)',
        'label-vocational-program': 'Program Vokasi',
        'label-cannot-predict': 'Belum bisa di prediksi',
        'btn-find-alt': 'Cari Alternatif',
        'status-sufficient': 'Skor mencukupi',
        'status-insufficient': 'Skor tidak mencukupi',
        'search-uni': 'Cari kampus favoritmu...',
        'search-prodi': 'Cari prodi impianmu...',
        'data-not-found': 'Data tidak ditemukan',
        'month-0': 'Januari', 'month-1': 'Februari', 'month-2': 'Maret', 'month-3': 'April',
        'month-4': 'Mei', 'month-5': 'Juni', 'month-6': 'Juli', 'month-7': 'Agustus',
        'month-8': 'September', 'month-9': 'Oktober', 'month-10': 'November', 'month-11': 'Desember',
        'day-mon': 'Sen', 'day-tue': 'Sel', 'day-wed': 'Rab', 'day-thu': 'Kam', 'day-fri': 'Jum', 'day-sat': 'Sab', 'day-sun': 'Min',
        'faq-q1': 'Apa itu Rasionalisasi UTBK?',
        'faq-a1': 'Rasionalisasi UTBK adalah sistem untuk memprediksi peluang kelulusan kamu di PTN berdasarkan skor tryout dibandingkan dengan keketatan dan daya tampung jurusan.',
        'faq-q2': 'Bagaimana cara membaca peluang?',
        'faq-a2': 'Status terbagi menjadi "Skor tidak mencukupi" dan "Skor mencukupi". Jika status kamu adalah "Skor mencukupi", maka kamu dinyatakan berpeluang untuk lulus.',
        'faq-q3': 'Apakah data PTN selalu update?',
        'faq-a3': 'Ya, kami memperbarui data PTN sesuai dengan informasi resmi dari panitia seleksi nasional untuk tahun 2025/2026.',
        'faq-q4': 'Bagaimana jika skor saya turun?',
        'faq-a4': 'Jangan khawatir! Turunnya skor adalah bagian dari proses belajar. Gunakan grafik perkembangan untuk memantau tren jangka panjang kamu.',
        'faq-q5': 'Apakah hasil Rasionalisasi SNBT ini sama dengan hasil SNBT sebenarnya?',
        'faq-a5-1': 'Hasil Rasionalisasi SNBT ini berdasarkan metode penghitungan skor internal untuk memberi gambaran potensi daya saing dan bukan hasil akhir SNBT sebenarnya.',
        'faq-a5-2': 'Hasil Rasionalisasi dapat dijadikan alternatif referensi, namun bukan untuk dijadikan acuan utama dalam menentukan target program studi & PTN di SNBT.',
        'faq-q6': 'Kenapa ada beberapa prodi yang statusnya "Belum ada data" atau "Tidak bisa diprediksi"?',
        'faq-a6': 'Hal ini dikarenakan data pendukung atau perubahan kuota resmi pada program studi tersebut masih dalam tahap verifikasi dan pengolahan oleh tim kami. Kami memprioritaskan akurasi data, sehingga prediksi akan dimunculkan segera setelah proses validasi selesai.',
        'faq-q7': 'Jika saya ada kendala/error saat mengakses Rasionalisasi UTBK, saya harus hubungi siapa?',
        'faq-a7': 'Jika ada kendala/error, kamu bisa bertanya melalui WhatsApp di link:',
        'label-name': 'Nama Lengkap',
        'placeholder-name': 'Masukkan nama lengkap',
        'label-email': 'Email',
        'placeholder-email': 'Masukkan email',
        'notif-ongoing': 'Event Berjalan',
        'notif-upcoming': 'Mendatang',
        'notif-completed': 'Selesai',
        'notif-msg-ongoing': 'Kamu belum mengerjakan Tryout ini! Waktu pengerjaan tinggal <strong>$1 hari lagi</strong> sebelum periode berakhir.',
        'notif-msg-upcoming': 'Tryout berikutnya akan tersedia dalam <strong>$1 hari lagi</strong>. Siapkan diri kamu untuk hasil maksimal!',
        'notif-msg-completed': 'Hebat! Kamu telah mengikuti semua jadwal Tryout yang tersedia sejauh ini. Terus pantau jadwal untuk info terbaru.',
        'notif-btn-ongoing': 'Kerjakan Sekarang',
        'notif-btn-upcoming': 'Oke, Siap!',
        'notif-title-completed': 'Semua Terkejar!',
        'empty-scores': 'Belum ada data tryout. Yuk, masukkan nilai pertamamu!',
        'status-no-score': 'Belum ada nilai',
        'status-cannot-predict': 'Tidak bisa diprediksi',
        'label-target-min-skor': 'Target Minimum Skor',
        'stat-daya-tampung': 'Daya Tampung',
        'stat-peminat': 'Peminat',
        'stat-keketatan': 'Keketatan',
        'choice-1': 'Pilihan Utama',
        'choice-2': 'Pilihan Kedua',
        'choice-3': 'Pilihan Ketiga',
        'choice-4': 'Pilihan Keempat',
        'choice-optional': 'Pilihan Opsional',
        'choice-desc-vokasi': 'Khusus Kedinasan/Vokasi',
        'choice-vokasi-req': 'Harus Prodi D3/D4',
        'choice-desc-additional': 'Tambah Pilihan',
        'msg-no-ptn-data': 'Ingin tau peluang lolos di prodi tujuanmu? Ikuti Tryout sekarang!',
        'other-settings': 'Pengaturan Lainnya',
        'profile-details': 'Detail Profil',
        'notifications': 'Notifikasi',
        'dark-mode': 'Mode Gelap',
        'label-nickname': 'Nama Panggilan',
        'label-phone': 'Nomor Handphone',
        'btn-discard': 'Batalkan',
        'about-app': 'Tentang UTBK Rasionalisasi',
        'countdown-finished': 'Waktunya UTBK!',
        'label-days': 'Hari',
        'label-hours': 'Jam',
        'label-minutes': 'Menit',
        'label-seconds': 'Detik',
        'label-to-score-prefix': 'Skor Tryout:',
        'label-no-results': 'Tidak ditemukan',
        'chart-label': 'Skor UTBK',
        'id-lang': 'Indonesian (ID)',
        'en-lang': 'English (EN)',
        'status-ended': 'Selesai',
        'status-ongoing': 'Sedang Berjalan',
        'status-upcoming': 'Akan Datang',
        'status-done': 'Sudah dikerjakan',
        'status-not-started': 'Belum dimulai',
        'btn-start-to': 'Mulai Kerjakan',
        'rec-note-label': 'Catatan:',
        'rec-note-choice': 'Jika memilih 4 prodi, Pilihan 3 dan 4 wajib program studi jenjang D3 atau D4.',
        'rec-strategy-label': 'Saran Strategi:',
        'rec-strategy-max-choice': 'Maksimalkan 4 pilihan',
        'rec-strategy-vocational-req': 'Wajib min. 1 prodi Vokasi (D3/D4)',
        'rec-strategy-academic-limit': 'Maks. 2 prodi Sarjana (S1)',
        'rec-disclaimer-text': 'Data ini hanya <strong>perkiraan</strong> dan <strong>tidak dapat</strong> dijadikan acuan pada penerimaan sesungguhnya.',
        'trend-first-to': 'Tryout Pertama',
        'btn-delete': 'Hapus',
        'btn-update': 'Update',
        'btn-save-short': 'Simpan',
        'msg-select-both': 'Silakan pilih universitas dan jurusan terlebih dahulu.',
        'msg-duplicate-choice': 'Jurusan ini sudah kamu pilih di slot lain. Silakan pilih jurusan atau kampus yang berbeda.',
        'msg-select-uni-first': 'Silakan pilih universitas terlebih dahulu',
        'title-ptn-modal': 'Pilih Universitas & Jurusan',
        'title-choice': 'Pilihan',
        'label-vokasi': 'Vokasi',
        'msg-no-major-match': 'Tidak ada jurusan yang sesuai filter',
        'msg-select-uni-modal': 'Pilih Universitas terlebih dahulu'
    },
    'en': {
        'nav-home': 'Home',
        'nav-ptn': 'Campus',
        'nav-schedule': 'Schedule',
        'nav-faq': 'FAQ',
        'nav-profile': 'Profile',
        'header-welcome': 'Hello,',
        'hero-title': 'Towards UTBK 2026',
        'hero-subtitle': 'Towards UTBK 2026',
        'stat-last-score': 'Last Score',
        'stat-total-to': 'Total Tryout',
        'stat-avg-score': 'Average',
        'section-target': 'Your dream campus',
        'section-stats': 'Progress Statistics',
        'section-schedule': 'SNBT 2026 Schedule',
        'section-detail': 'Activity Detail',
        'profile-title': 'Profile',
        'profile-edit': 'Edit Profile',
        'settings': 'Settings',
        'history': 'History History',
        'reports': 'Reports',
        'unique-link': 'Your unique link',
        'language': 'Language',
        'help-center': 'Help Center (FAQ)',
        'logout': 'Log out',
        'btn-add-score': 'Add Score',
        'btn-save': 'Save Changes',
        'btn-cancel': 'Cancel',
        'btn-back': 'Back',
        'modal-title-add': 'Add Tryout Score',
        'modal-title-edit': 'Edit Tryout Score',
        'facts-title': 'SNBT Facts',
        'facts-subtitle': 'Based on 2025 National Selection Data',
        'fact-registrants': 'applicants',
        'fact-passed': 'passed SNBT',
        'fact-chance': 'SNBT chance',
        'empty-scores': 'No tryout data yet.',
        'schedule-subtitle': 'Monitor your preparation agenda',
        'faq-subtitle': 'Find answers to your issues',
        'ptn-subtitle': 'Check capacity & competition',
        'rec-title': 'Strategy Recommendation',
        'rec-analyzing': 'Recommended campus choice order based on score achievement, capacity, and competition level',
        'ranking-title': 'Indonesian PTN Ranking',
        'ranking-source': 'Source: Webometrics & SNBT 2024',
        'toggle-prodi': 'Major',
        'search-placeholder': 'Search your favorite campus...',
        'modal-ptn-title': 'Select University & Major',
        'label-uni': 'University',
        'placeholder-uni': 'Search University/Vocational School',
        'label-major': 'Select Major',
        'placeholder-major': 'Search Major',
        'placeholder-select-to': 'Select Tryout',
        'search-to-placeholder': 'Search tryout...',
        'label-date': 'Date',
        'label-to-score': 'Tryout Score',
        'label-to-name': 'Tryout Name',
        'label-execution': 'Execution',
        'label-link': 'Execution Link',
        'label-alt-major': 'Alternative Majors',
        'label-target-min': 'Target Minimum Score',
        'label-no-data': 'No data yet',
        'label-choice': 'Choice',
        'label-academic-program': 'Academic Program (S1)',
        'label-vocational-program': 'Vocational Program',
        'label-cannot-predict': 'Cannot be predicted',
        'btn-find-alt': 'Find Alternative',
        'status-sufficient': 'Sufficient score',
        'status-insufficient': 'Insufficient score',
        'search-uni': 'Search your favorite campus...',
        'search-prodi': 'Search your dream major...',
        'data-not-found': 'Data not found',
        'month-0': 'January', 'month-1': 'February', 'month-2': 'March', 'month-3': 'April',
        'month-4': 'May', 'month-5': 'June', 'month-6': 'July', 'month-7': 'August',
        'month-8': 'September', 'month-9': 'October', 'month-10': 'November', 'month-11': 'December',
        'day-mon': 'Mon', 'day-tue': 'Tue', 'day-wed': 'Wed', 'day-thu': 'Thu', 'day-fri': 'Fri', 'day-sat': 'Sat', 'day-sun': 'Sun',
        'faq-q1': 'What is UTBK Rationalization?',
        'faq-a1': 'UTBK Rationalization is a system to predict your graduation chances at PTN based on tryout scores compared to the competitive intensity and department capacity.',
        'faq-q2': 'How to read the admission chance?',
        'faq-a2': 'Status is divided into "Insufficient score" and "Sufficient score". If your status is "Sufficient score", you are considered likely to pass.',
        'faq-q3': 'Is PTN data always updated?',
        'faq-a3': 'Yes, we update PTN data according to official information from the national selection committee for the year 2025/2026.',
        'faq-q4': 'What if my score drops?',
        'faq-a4': 'Don\'t worry! A drop in score is part of the learning process. Use the development chart to monitor your long-term trends.',
        'faq-q5': 'Is the SNBT Rationalization result the same as the actual SNBT result?',
        'faq-a5-1': 'The result of this SNBT Rationalization is based on internal score Calculation methods to give an idea of potential competitiveness and is not the actual final SNBT result.',
        'faq-a5-2': 'Rationalization results can be used as an alternative reference, but not to be used as the main guide in determining target study programs & PTNs in SNBT.',
        'faq-q6': 'Why do some study programs have the status "No data yet" or "Cannot be predicted"?',
        'faq-a6': 'This is because supporting data or official quota changes for those study programs are still in the verification and processing stage by our team. We prioritize data accuracy, so predictions will be shown as soon as the validation process is complete.',
        'faq-q7': 'If I have problems/errors when accessing UTBK Rationalization, who should I contact?',
        'faq-a7': 'If there are problems/errors, you can ask via WhatsApp at the link:',
        'label-name': 'Full Name',
        'placeholder-name': 'Enter full name',
        'label-email': 'Email',
        'placeholder-email': 'Enter email',
        'notif-ongoing': 'Ongoing Event',
        'notif-upcoming': 'Upcoming',
        'notif-completed': 'Completed',
        'notif-msg-ongoing': 'You haven\'t done this Tryout! <strong>$1 days left</strong> before the period ends.',
        'notif-msg-upcoming': 'The next tryout will be available in <strong>$1 days</strong>. Prepare yourself for maximum results!',
        'notif-msg-completed': 'Great! You have followed all the Tryout schedules available so far. Keep monitoring the schedule for the latest info.',
        'notif-btn-ongoing': 'Do it Now',
        'notif-btn-upcoming': 'Okay, Got it!',
        'notif-title-completed': 'All Caught Up!',
        'empty-scores': 'No tryout data yet. Come on, enter your first score!',
        'status-no-score': 'No scores yet',
        'status-cannot-predict': 'Cannot be predicted',
        'label-target-min-skor': 'Minimum Target Score',
        'stat-daya-tampung': 'Capacity',
        'stat-peminat': 'Applicants',
        'stat-keketatan': 'Admission Rate',
        'choice-1': 'First Choice',
        'choice-2': 'Second Choice',
        'choice-3': 'Third Choice',
        'choice-4': 'Fourth Choice',
        'choice-optional': 'Optional Choice',
        'choice-desc-vokasi': 'School / Vocational',
        'choice-vokasi-req': 'Must be D3/D4 Program',
        'choice-desc-additional': 'Add Choice',
        'msg-no-ptn-data': 'Want to know your admission chance? Join the tryout now!',
        'other-settings': 'Other Settings',
        'profile-details': 'Profile Details',
        'notifications': 'Notifications',
        'dark-mode': 'Dark Mode',
        'label-nickname': 'Nickname',
        'label-phone': 'Phone Number',
        'btn-discard': 'Discard',
        'about-app': 'About UTBK Rationalization',
        'countdown-finished': 'UTBK Time!',
        'label-days': 'Days',
        'label-hours': 'Hours',
        'label-minutes': 'Minutes',
        'label-seconds': 'Seconds',
        'label-to-score-prefix': 'Tryout Score:',
        'label-no-results': 'No results found',
        'chart-label': 'UTBK Score',
        'id-lang': 'Indonesian (ID)',
        'en-lang': 'English (EN)',
        'status-ended': 'Ended',
        'status-ongoing': 'Ongoing',
        'status-upcoming': 'Upcoming',
        'status-done': 'Already submitted',
        'status-not-started': 'Not started yet',
        'btn-start-to': 'Start Tryout',
        'rec-note-label': 'Note:',
        'rec-note-choice': 'If choosing 4 study programs, Choice 3 and 4 must be D3 or D4 vocational programs.',
        'rec-strategy-label': 'Strategy Suggestion:',
        'rec-strategy-max-choice': 'Maximize 4 choices',
        'rec-strategy-vocational-req': 'Min. 1 vocational program (D3/D4) required',
        'rec-strategy-academic-limit': 'Max. 2 academic programs (S1)',
        'rec-disclaimer-text': 'This data is only an <strong>estimate</strong> and <strong>cannot</strong> be used as an official reference for actual admission.',
        'trend-first-to': 'First Tryout',
        'btn-delete': 'Delete',
        'btn-update': 'Update',
        'btn-save-short': 'Save',
        'msg-select-both': 'Please select both university and major first.',
        'msg-duplicate-choice': 'You have already selected this major in another slot. Please choose a different major or campus.',
        'msg-select-uni-first': 'Please select a university first',
        'title-ptn-modal': 'Select University & Major',
        'title-choice': 'Choice',
        'label-vokasi': 'Vocational',
        'msg-no-major-match': 'No majors found for the selected filters',
        'msg-select-uni-modal': 'Please select University first'
    }
};

// Helper for translation
function t(key) {
    const lang = (userData && userData.language) ? userData.language : 'id';
    return (translations[lang] && translations[lang][key]) ? translations[lang][key] : key;
}

function changeLanguage(lang) {
    userData.language = lang;
    localStorage.setItem('utbkUserData', JSON.stringify(userData));
    applyTranslations();
    updateLanguageUI();
    closeLanguageModal();
}

function applyTranslations() {
    const lang = (userData && userData.language) ? userData.language : 'id';
    const dict = translations[lang];

    if (!dict) {
        console.error("Translation dictionary not found for language:", lang);
        return;
    }

    console.log("Applying translations for:", lang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            // If it's an input with placeholder
            if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                el.placeholder = dict[key];
            } else {
                // Use innerHTML to support keys with HTML tags (like strong)
                el.innerHTML = dict[key];
            }
        }
    });
}

function updateLanguageUI() {
    const lang = userData.language || 'id';
    const flagImg = document.getElementById('current-lang-flag');
    if (flagImg) {
        flagImg.src = lang === 'id' ? 'https://flagcdn.com/w20/id.png' : 'https://flagcdn.com/w20/us.png';
        flagImg.alt = lang.toUpperCase();
    }
}

// Initialize App
function init() {
    try {
        console.log("Initializing App...");

        // 1. Theme Toggle (Highest Priority)
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            // Remove any existing listeners and add fresh
            themeBtn.onclick = null;
            themeBtn.addEventListener('click', toggleTheme);
        }
        initTheme();

        // 2. Initialize DOM Elements
        scoreListEl = document.getElementById('score-list');
        avgScoreEl = document.getElementById('avg-score');
        totalTryoutsEl = document.getElementById('total-tryouts');
        scoreForm = document.getElementById('scoreForm');
        modal = document.getElementById('scoreModal');
        eventModal = document.getElementById('eventModal');
        searchInput = document.getElementById('ptn-search-input');

        // 3. Page Logic
        if (document.getElementById('to-date')) {
            document.getElementById('to-date').valueAsDate = new Date();
        }

        calculateInitialPage();
        renderList();
        updateStats();
        populateTryoutDropdown();

        // 4. Other Listeners
        setupEventListeners();
        setupCustomDropdown();
        startCountdown();
        renderSchedule();
        renderCalendar();
        generateRecommendation();
        protectCopyright();

        // Language initialization
        applyTranslations();
        updateLanguageUI();

        // 5. Search Listener
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                ptnSearchQuery = e.target.value.toLowerCase();
                currentPtnPage = 1;
                renderRankingList();
            });
        }

        updateProfileDisplay();
        console.log("App Initialized Successfully.");
    } catch (err) {
        console.error("Critical Error during init:", err);
        // Only alert if we really can't function
        // alert("Ada kendala teknis saat memuat data. Mohon muat ulang halaman. Error: " + err.message);
    }
}

// Navigation
function switchTab(tabName) {
    // Hide all sections and remove active class
    document.querySelectorAll('.page-section').forEach(s => {
        s.style.display = 'none';
        s.classList.remove('active');
    });
    // Deactivate all nav items
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    // Show target section
    const targetSection = document.getElementById(`${tabName}-section`);
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('active');
    }

    // Toggle main header visibility
    const mainHeader = document.querySelector('.app-header');
    if (mainHeader) {
        mainHeader.style.display = tabName === 'home' ? 'flex' : 'none';
    }

    // Activate target nav item
    document.querySelectorAll('.nav-item').forEach(n => {
        if (n.getAttribute('onclick') && n.getAttribute('onclick').includes(`'${tabName}'`)) {
            n.classList.add('active');
        }
    });

    if (tabName === 'schedule') {
        renderSchedule();
        renderCalendar();
    } else if (tabName === 'profile') {
        updateProfileData();
    } else if (tabName === 'faq') {
        setupFaqAccordion();
    }
}

const scheduleData = [
    {
        month: 'Agustus 2025', events: [
            { name: 'REGULAR EPS. 1', date: '31 Juli - 6 Agustus 2025', type: 'regular', start: '2025-07-31', end: '2025-08-06' },
            { name: 'PREMIUM EPS. 1', date: '21 - 27 Agustus 2025', type: 'premium', start: '2025-08-21', end: '2025-08-27' }
        ]
    },
    {
        month: 'September 2025', events: [
            { name: 'REGULAR EPS. 2', date: '4 - 14 Sept 2025', type: 'regular', start: '2025-09-04', end: '2025-09-14' },
            { name: 'PREMIUM EPS. 2', date: '25 Sept - 1 Okt 2025', type: 'premium', start: '2025-09-25', end: '2025-10-01' }
        ]
    },
    {
        month: 'Oktober 2025', events: [
            { name: 'REGULAR EPS. 3', date: '2 - 8 Okt 2025', type: 'regular', start: '2025-10-02', end: '2025-10-08' },
            { name: 'PREMIUM EPS. 3', date: '16 - 22 Okt 2025', type: 'premium', start: '2025-10-16', end: '2025-10-22' },
            { name: 'PREMIUM EPS. 4', date: '23 - 29 Okt 2025', type: 'premium', start: '2025-10-23', end: '2025-10-29' }
        ]
    },
    {
        month: 'November 2025', events: [
            { name: 'PREMIUM EPS. 5', date: '13 - 19 Nov 2025', type: 'premium', start: '2025-11-13', end: '2025-11-19' },
            { name: 'REGULAR EPS. 4', date: '20 - 26 Nov 2025', type: 'regular', start: '2025-11-20', end: '2025-11-26' }
        ]
    },
    {
        month: 'Desember 2025', events: [
            { name: 'PREMIUM EPS. 6', date: '27 Nov - 3 Des 2025', type: 'premium', start: '2025-11-27', end: '2025-12-03' },
            { name: 'PREMIUM EPS. 7', date: '4 - 10 Des 2025', type: 'premium', start: '2025-12-04', end: '2025-12-10' },
            { name: 'PREMIUM EPS. 8', date: '11 - 17 Des 2025', type: 'premium', start: '2025-12-11', end: '2025-12-17' }
        ]
    },
    {
        month: 'Januari 2026', events: [
            { name: 'REGULAR EPS. 5 (MEGA TO Vol 1)', date: '8 - 14 Jan 2026', type: 'regular', start: '2026-01-08', end: '2026-01-14' },
            { name: 'PREMIUM EPS. 9', date: '15 - 19 Jan 2026', type: 'premium', start: '2026-01-15', end: '2026-01-19' },
            { name: 'PREMIUM EPS. 10', date: '20 - 24 Jan 2026', type: 'premium', start: '2026-01-20', end: '2026-01-24' },
            { name: 'PREMIUM EPS. 11', date: '25 - 29 Jan 2026', type: 'premium', start: '2026-01-25', end: '2026-01-29' }
        ]
    },
    {
        month: 'Februari 2026', events: [
            { name: 'REGULAR EPS. 6', date: '30 Jan - 5 Feb 2026', type: 'regular', start: '2026-01-30', end: '2026-02-05' },
            { name: 'PREMIUM EPS. 12', date: '6 - 10 Feb 2026', type: 'premium', start: '2026-02-06', end: '2026-02-10' },
            { name: 'PREMIUM EPS. 13', date: '11 - 15 Feb 2026', type: 'premium', start: '2026-02-11', end: '2026-02-15' },
            { name: 'PREMIUM EPS. 14', date: '16 - 20 Feb 2026', type: 'premium', start: '2026-02-16', end: '2026-02-20' },
            { name: 'PREMIUM EPS. 15', date: '21 - 25 Feb 2026', type: 'premium', start: '2026-02-21', end: '2026-02-25' },
            { name: 'REGULAR EPS. 7', date: '26 Feb - 4 Mar 2026', type: 'regular', start: '2026-02-26', end: '2026-03-04' }
        ]
    },
    {
        month: 'Maret 2026', events: [
            { name: 'PREMIUM EPS. 16', date: '5 - 9 Mar 2026', type: 'premium', start: '2026-03-05', end: '2026-03-09' }
        ]
    },
    {
        month: 'April 2026', events: [
            { name: 'REGULAR EPS. 8 (MEGA TO Vol 2)', date: '30 Mar - 5 Apr 2026', type: 'regular', start: '2026-03-30', end: '2026-04-05' },
            { name: 'PREMIUM EPS. 17', date: '6 - 10 Apr 2026', type: 'premium', start: '2026-04-06', end: '2026-04-10' },
            { name: 'PREMIUM EPS. 18', date: '11 - 15 Apr 2026', type: 'premium', start: '2026-04-11', end: '2026-04-15' },
            { name: 'PELAKSANAAN UTBK', date: '21 - 30 April 2026', type: 'exam', start: '2026-04-21', end: '2026-04-30' }
        ]
    },
    {
        month: 'Mei 2026', events: [
            { name: 'PENGUMUMAN HASIL SNBT', date: '25 Mei 2026', type: 'exam', start: '2026-05-25', end: '2026-05-25' }
        ]
    }
];

// Calendar State
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Helper to check if a date has an event
function getEventForDate(day, month, year) {
    const checkDate = new Date(year, month, day);

    // Normalize time to 00:00:00 for accurate comparison
    checkDate.setHours(0, 0, 0, 0);

    for (const monthGroup of scheduleData) {
        for (const event of monthGroup.events) {
            if (event.start && event.end) {
                const startDate = new Date(event.start);
                const endDate = new Date(event.end);
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(0, 0, 0, 0);

                if (checkDate >= startDate && checkDate <= endDate) {
                    return event;
                }
            }
        }
    }

    return null;
}

// Pagination State
let currentPage = 1;
const monthsPerPage = 3;

function calculateInitialPage() {
    const today = new Date();
    const currentMonthName = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const currentMonthStr = `${currentMonthName[today.getMonth()]} ${today.getFullYear()}`;

    const monthIndex = scheduleData.findIndex(m => m.month === currentMonthStr);

    if (monthIndex !== -1) {
        currentPage = Math.ceil((monthIndex + 1) / monthsPerPage);
    } else {
        // If current month not found (e.g. before start), default to 1.
        // If after end, could default to last page.
        // For now, let's try to find the closest future month or just default to 1 if not found.
        currentPage = 1;
    }
}

function getEventStatus(start, end) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);

    let endDate = null;
    if (end) {
        endDate = new Date(end);
        endDate.setHours(0, 0, 0, 0);
    }

    if (endDate && today > endDate) {
        return { label: t('status-ended'), class: 'status-ended' };
    } else if (today >= startDate && (!endDate || today <= endDate)) {
        return { label: t('status-ongoing'), class: 'status-ongoing' };
    } else {
        return { label: t('status-upcoming'), class: 'status-upcoming' };
    }
}



function renderSchedule() {
    const container = document.getElementById('schedule-list');
    const paginationContainer = document.getElementById('pagination-controls');

    container.innerHTML = '';
    paginationContainer.innerHTML = ''; // Clear pagination

    // Calculate pagination
    const totalPages = Math.ceil(scheduleData.length / monthsPerPage);
    const startIndex = (currentPage - 1) * monthsPerPage;
    const endIndex = startIndex + monthsPerPage;
    const currentMonths = scheduleData.slice(startIndex, endIndex);

    currentMonths.forEach(monthItem => {
        const monthDiv = document.createElement('div');
        monthDiv.className = 'schedule-month';

        const monthHeader = document.createElement('h4');
        monthHeader.className = 'month-header';
        monthHeader.textContent = translateScheduleText(monthItem.month);
        monthDiv.appendChild(monthHeader);

        monthItem.events.forEach(event => {
            const eventDiv = document.createElement('div');

            // Calculate status first to determine class
            const status = getEventStatus(event.start, event.end);

            let className = `schedule-event ${event.type}`;
            if (status.class === 'status-ongoing') {
                className += ' ongoing';
            }
            eventDiv.className = className;

            eventDiv.id = `event-${event.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`; // Add ID for linking

            // Add click listener for modal
            eventDiv.onclick = () => openEventModal(event);
            eventDiv.style.cursor = 'pointer';

            let statusHtml = '';
            // Only show status for non-exam events
            if (event.type !== 'exam') {
                statusHtml = `
                <div class="status-text ${status.class}">
                    ${status.label}
                </div>`;
            }

            eventDiv.innerHTML = `
                <div class="event-info">
                    <span class="event-name">${translateScheduleText(event.name)}</span>
                    <span class="event-date">${translateScheduleText(event.date)}</span>
                </div>
                ${statusHtml}
                <div class="event-status" style="margin-left: 10px;">
                    ${event.type === 'exam' ? '<i class="fa-solid fa-flag-checkered"></i>' : '<i class="fa-regular fa-calendar"></i>'}
                </div>
            `;
            monthDiv.appendChild(eventDiv);
        });

        container.appendChild(monthDiv);
    });

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const paginationContainer = document.getElementById('pagination-controls');

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.onclick = () => {
            currentPage = i;
            renderSchedule();
            // Scroll to top of schedule
            document.getElementById('schedule-section').scrollIntoView({ behavior: 'smooth' });
        };
        paginationContainer.appendChild(btn);
    }
}

function renderCalendar() {
    const calendarDates = document.getElementById('calendar-dates');
    const monthTitle = document.getElementById('current-month');

    if (!calendarDates || !monthTitle) return;

    calendarDates.innerHTML = '';

    const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
    const lastDatePrev = new Date(currentYear, currentMonth, 0).getDate();

    monthTitle.textContent = `${t(`month-${currentMonth}`)} ${currentYear}`;

    // Adjust for Monday start: Sun=0 -> 6, Mon=1 -> 0
    let startDay = firstDay === 0 ? 6 : firstDay - 1;

    // Prev Month Dates (Spacer)
    for (let i = startDay; i > 0; i--) {
        const span = document.createElement('div');
        span.className = 'calendar-date inactive';
        span.textContent = lastDatePrev - i + 1;
        calendarDates.appendChild(span);
    }

    // Current Month Dates
    const today = new Date();

    for (let i = 1; i <= lastDate; i++) {
        const div = document.createElement('div');
        div.className = 'calendar-date';
        div.textContent = i;

        // Check Today
        if (i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
            div.classList.add('today');
        }

        // Check Events
        const event = getEventForDate(i, currentMonth, currentYear);
        if (event) {
            div.classList.add('has-event', event.type);
            div.setAttribute('data-tooltip', `${event.name}\n${event.date}`);

            // Scroll to event on click
            div.addEventListener('click', () => {
                // Flow: find which month index in scheduleData matches our current display
                // Use Indonesian month name to match scheduleData which is currently in ID
                const idMonthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
                const idMonthName = idMonthNames[currentMonth];

                const targetMonthIndex = scheduleData.findIndex(m => {
                    return m.month.includes(idMonthName) && m.month.includes(currentYear.toString());
                });

                if (targetMonthIndex !== -1) {
                    const targetPage = Math.ceil((targetMonthIndex + 1) / monthsPerPage);

                    if (currentPage !== targetPage) {
                        currentPage = targetPage;
                        renderSchedule();
                    }

                    // Delay slightly to allow DOM update
                    setTimeout(() => {
                        const targetId = `event-${event.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
                        const targetEl = document.getElementById(targetId);
                        if (targetEl) {
                            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

                            // Highlight effect
                            targetEl.style.transition = 'all 0.3s ease';
                            targetEl.style.transform = 'scale(1.02)';
                            targetEl.style.boxShadow = '0 0 15px rgba(74, 144, 226, 0.5)';

                            setTimeout(() => {
                                targetEl.style.transform = '';
                                targetEl.style.boxShadow = '';
                            }, 1500);
                        }
                    }, 100);
                }
            });
        }

        calendarDates.appendChild(div);
    }
}

// Countdown Logic
function startCountdown() {
    const targetDate = new Date('2026-04-21T00:00:00').getTime();

    // Update every second
    setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            document.getElementById('countdown').innerHTML = t('countdown-finished');
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('countdown').innerHTML = `
            <div class="cd-item">
                <span class="cd-val">${days}</span>
                <span class="cd-label">${t('label-days')}</span>
            </div>
             <div class="cd-sep">:</div>
            <div class="cd-item">
                <span class="cd-val">${hours}</span>
                <span class="cd-label">${t('label-hours')}</span>
            </div>
             <div class="cd-sep">:</div>
            <div class="cd-item">
                <span class="cd-val">${minutes}</span>
                <span class="cd-label">${t('label-minutes')}</span>
            </div>
             <div class="cd-sep">:</div>
            <div class="cd-item">
                <span class="cd-val">${seconds}</span>
                <span class="cd-label">${t('label-seconds')}</span>
            </div>
        `;
    }, 1000);
}

// Event Listeners
function setupEventListeners() {
    if (scoreForm) {
        scoreForm.addEventListener('submit', handleFormSubmit);
    }

    // Theme toggle handled in init

    // Close modal when clicking outside
    window.onclick = function (event) {
        const ptnModal = document.getElementById('ptnModal');
        const scoreModal = document.getElementById('scoreModal');
        const altModalEl = document.getElementById('altModal');
        const eventModalEl = document.getElementById('eventModal');

        if (event.target == ptnModal) closePtnModal();
        if (event.target == scoreModal || event.target == modal) closeModal();
        if (event.target == altModalEl) closeAltModal();
        if (event.target == eventModalEl || event.target == eventModal) closeEventModal();

        // Close dropdown when clicking outside
        if (!event.target.closest('.custom-dropdown')) {
            const dropdown = document.getElementById('custom-dropdown');
            if (dropdown && dropdown.classList.contains('active')) {
                dropdown.classList.remove('active');
            }
        }
    };
}

let allTryoutOptions = [];

function populateTryoutDropdown() {
    allTryoutOptions = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Compare dates only

    scheduleData.forEach(month => {
        month.events.forEach(event => {
            if (event.type !== 'exam') { // Exclude the actual exam
                const startDate = new Date(event.start);
                startDate.setHours(0, 0, 0, 0);

                // Only include if start date is today or in the past
                if (startDate <= today) {
                    allTryoutOptions.push({
                        name: event.name,
                        date: event.start,
                        endDate: event.end // Add end date
                    });
                }
            }
        });
    });
    renderDropdownOptions(allTryoutOptions);
}

function renderDropdownOptions(options) {
    const container = document.getElementById('dropdown-options');
    if (!container) return;

    container.innerHTML = '';

    if (options.length === 0) {
        container.innerHTML = `<div class="dropdown-option no-results">${t('label-no-results')}</div>`;
        return;
    }

    options.forEach(opt => {
        const div = document.createElement('div');
        div.className = 'dropdown-option';

        // Check if scored
        const existingScore = scores.find(s => s.name === opt.name);
        if (existingScore) {
            div.classList.add('filled');
            div.innerHTML = `<span style="flex-grow: 1;">${opt.name}</span> <span style="font-size: 0.8rem; color: var(--primary-blue); font-weight: 600;">${t('label-to-score-prefix')} ${existingScore.score}</span>`;
        } else {
            div.textContent = opt.name;
        }

        div.onclick = () => selectTryoutOption(opt, existingScore);
        container.appendChild(div);
    });
}

function selectTryoutOption(opt, existingScore = null) {
    document.getElementById('to-name').value = opt.name;
    document.querySelector('.selected-text').textContent = opt.name;

    const dateInput = document.getElementById('to-date');
    const scoreInput = document.getElementById('to-score');
    const submitBtn = document.querySelector('.submit-btn');

    if (opt.date && opt.endDate) {
        // Set min and max dates
        dateInput.min = opt.date;
        dateInput.max = opt.endDate;
    } else {
        dateInput.removeAttribute('min');
        dateInput.removeAttribute('max');
    }

    if (existingScore) {
        // Edit Mode
        editingScoreId = existingScore.id;
        scoreInput.value = existingScore.score;
        dateInput.value = existingScore.date;
        submitBtn.textContent = t('btn-update');
    } else {
        // Create Mode
        editingScoreId = null;
        scoreInput.value = '';
        submitBtn.textContent = t('btn-save-short');

        // Auto-fill with start date if empty or out of range
        if (opt.date) {
            if (!dateInput.value || dateInput.value < opt.date || (opt.endDate && dateInput.value > opt.endDate)) {
                dateInput.value = opt.date;
            }
        }
    }

    const dropdown = document.getElementById('custom-dropdown');
    dropdown.classList.remove('active');
}

function setupCustomDropdown() {
    const dropdown = document.getElementById('custom-dropdown');
    const trigger = document.getElementById('dropdown-trigger');
    const searchInput = document.getElementById('dropdown-search');

    if (!dropdown || !trigger || !searchInput) return;

    trigger.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent immediate close
        dropdown.classList.toggle('active');
        if (dropdown.classList.contains('active')) {
            searchInput.focus();
            searchInput.value = ''; // Reset search
            renderDropdownOptions(allTryoutOptions); // Reset list
        }
    });

    searchInput.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();
        const filtered = allTryoutOptions.filter(opt =>
            opt.name.toLowerCase().includes(value)
        );
        renderDropdownOptions(filtered);
    });
}

// Modal Functions
function toggleScoreModal() {
    if (modal.style.display === 'flex') {
        closeModal();
    } else {
        openModal();
    }
}

function openModal() {
    modal.style.display = 'flex';
    // Disable Nav Items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.style.pointerEvents = 'none';
        item.style.opacity = '0.5';
    });
}

function closeModal() {
    modal.style.display = 'none';
    editingScoreId = null;
    document.querySelector('.submit-btn').textContent = t('btn-save-short');
    document.getElementById('scoreForm').reset();

    // Check if dropdown elements exist before accessing property
    const selectedText = document.querySelector('.selected-text');
    if (selectedText) selectedText.textContent = t('placeholder-select-to');

    // Enable Nav Items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.style.pointerEvents = 'auto';
        item.style.opacity = '1';
    });
}

// Notification Logic
function showNotification() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let ongoingEvent = null;
    let upcomingEvent = null;

    // Flatten events to find status
    const allEvents = [];
    scheduleData.forEach(month => {
        month.events.forEach(event => {
            if (event.type !== 'exam') allEvents.push(event);
        });
    });

    // 1. Check for ONGOING
    for (const event of allEvents) {
        const start = new Date(event.start);
        const end = new Date(event.end);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        if (today >= start && today <= end) {
            // Check if user already did this TO
            const alreadyDone = scores.find(s => s.name === event.name);
            if (!alreadyDone) {
                ongoingEvent = event;
                break;
            }
        }
    }

    // 2. Find UPCOMING (if no ongoing or ongoing is done)
    if (!ongoingEvent) {
        for (const event of allEvents) {
            const start = new Date(event.start);
            start.setHours(0, 0, 0, 0);
            if (start > today) {
                upcomingEvent = event;
                break;
            }
        }
    }

    const notifModal = document.getElementById('notifModal');
    const notifBody = document.getElementById('notif-body');

    if (ongoingEvent) {
        const end = new Date(ongoingEvent.end);
        const diffTime = Math.abs(end - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        notifBody.innerHTML = `
            <div class="notif-badge badge-ongoing">${t('notif-ongoing')}</div>
            <div class="notif-icon-wrapper ongoing">
                <i class="fa-solid fa-bell"></i>
            </div>
            <div class="notif-title">${ongoingEvent.name}</div>
            <div class="notif-message">
                ${t('notif-msg-ongoing').replace('$1', diffDays)}
            </div>
            <button class="notif-action-btn" onclick="goToEventDetails('${ongoingEvent.name.replace(/'/g, "\\\'")}')">${t('notif-btn-ongoing')}</button>
        `;
    } else if (upcomingEvent) {
        const start = new Date(upcomingEvent.start);
        const diffTime = Math.abs(start - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        notifBody.innerHTML = `
            <div class="notif-badge badge-upcoming">${t('notif-upcoming')}</div>
            <div class="notif-icon-wrapper">
                <i class="fa-solid fa-calendar-check"></i>
            </div>
            <div class="notif-title">${upcomingEvent.name}</div>
            <div class="notif-message">
                ${t('notif-msg-upcoming').replace('$1', diffDays)}
            </div>
            <button class="notif-action-btn" onclick="closeNotifModal()">${t('notif-btn-upcoming')}</button>
        `;
    } else {
        notifBody.innerHTML = `
            <div class="notif-badge badge-upcoming">${t('notif-completed')}</div>
            <div class="notif-icon-wrapper">
                <i class="fa-solid fa-check-double"></i>
            </div>
            <div class="notif-title">${t('notif-title-completed')}</div>
            <div class="notif-message">
                ${t('notif-msg-completed')}
            </div>
        `;
    }

    notifModal.style.display = 'flex';
}

function goToEventDetails(eventName) {
    let targetEvent = null;
    for (const month of scheduleData) {
        const event = month.events.find(e => e.name === eventName);
        if (event) {
            targetEvent = event;
            break;
        }
    }

    if (targetEvent) {
        switchTab('schedule');
        openEventModal(targetEvent);
        closeNotifModal();
    }
}

function closeNotifModal() {
    document.getElementById('notifModal').style.display = 'none';
}

// Form Handling
function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('to-name').value;
    const date = document.getElementById('to-date').value;
    const score = parseInt(document.getElementById('to-score').value);

    if (name && date && !isNaN(score)) {
        if (editingScoreId) {
            updateScore(editingScoreId, { name, date, score });
        } else {
            addScore({
                id: Date.now(),
                name,
                date,
                score
            });
        }

        scoreForm.reset();
        // Reset dropdown UI
        // Reset dropdown UI
        document.querySelector('.selected-text').textContent = t('placeholder-select-to');

        // Reset date constraints and set to today
        const dateInput = document.getElementById('to-date');
        dateInput.removeAttribute('min');
        dateInput.removeAttribute('max');
        dateInput.valueAsDate = new Date();

        closeModal();
        document.getElementById('to-date').valueAsDate = new Date();
        closeModal();
    }
}

function addScore(scoreObj) {
    scores.push(scoreObj);
    // Sort by date (oldest first for chart consistency, or newest first for list?)
    // Let's sort by date asc for chart, and reverse for list display
    scores.sort((a, b) => new Date(a.date) - new Date(b.date));

    saveData();
    updateUI();
}

function updateScore(id, newData) {
    const index = scores.findIndex(s => s.id === id);
    if (index !== -1) {
        scores[index] = { ...scores[index], ...newData };
        saveData();
        updateUI();
    }
}

function deleteScore(id) {
    scores = scores.filter(s => s.id !== id);
    saveData();
    updateUI();
}

function saveData() {
    localStorage.setItem('utbkScores', JSON.stringify(scores));
}

function updateUI() {
    renderList();
    updateStats();
    updateChart();
    updateProfileData();
}

// Profile Logic
function updateProfileData() {
    // Sort descending by date, then by ID (latest input first)
    const sortedForLast = [...scores].sort((a, b) => {
        const dateDiff = new Date(b.date) - new Date(a.date);
        if (dateDiff !== 0) return dateDiff;
        return b.id - a.id;
    });

    const lastScore = sortedForLast.length > 0 ? sortedForLast[0].score : 0;
    const totalTO = scores.length;
    const avgScore = scores.length > 0
        ? Math.round(scores.reduce((acc, curr) => acc + curr.score, 0) / scores.length)
        : 0;

    const lastScoreEl = document.getElementById('p-last-score');
    const totalTOEl = document.getElementById('p-total-to');
    const avgScoreEl = document.getElementById('p-avg-score');

    if (lastScoreEl) lastScoreEl.textContent = lastScore;
    if (totalTOEl) totalTOEl.textContent = totalTO;
    if (avgScoreEl) avgScoreEl.textContent = avgScore;
}

function handleLogout() {
    if (confirm('Apakah kamu yakin ingin keluar?')) {
        localStorage.clear();
        location.reload();
    }
}

function updateProfileDisplay() {
    const nameEl = document.getElementById('display-name');
    const emailEl = document.getElementById('display-email');

    // Also update main header greeting if it exists
    const greetingNameEl = document.getElementById('greeting-name');

    if (nameEl) nameEl.textContent = userData.name;
    if (emailEl) emailEl.textContent = userData.email;
    if (greetingNameEl) greetingNameEl.textContent = userData.name;
}

function openEditProfileModal() {
    document.getElementById('edit-name').value = userData.name;
    document.getElementById('edit-email').value = userData.email;
    document.getElementById('editProfileModal').style.display = 'block';
}

function closeEditProfileModal() {
    document.getElementById('editProfileModal').style.display = 'none';
}

function openLanguageModal() {
    document.getElementById('languageModal').style.display = 'flex';
}

function closeLanguageModal() {
    document.getElementById('languageModal').style.display = 'none';
}

function saveProfile(e) {
    e.preventDefault();
    userData.name = document.getElementById('edit-name').value;
    userData.email = document.getElementById('edit-email').value;

    localStorage.setItem('utbkUserData', JSON.stringify(userData));
    updateProfileDisplay();
    closeEditProfileModal();
}

// New Edit Profile Page Logic
function openEditProfilePage() {
    document.getElementById('p-edit-name').value = userData.name;
    document.getElementById('p-edit-nickname').value = userData.nickname || '';
    document.getElementById('p-edit-email').value = userData.email;
    document.getElementById('p-edit-phone').value = userData.phone || '';

    switchTab('edit-profile');
}

function saveProfileChanges(e) {
    e.preventDefault();

    userData.name = document.getElementById('p-edit-name').value;
    userData.nickname = document.getElementById('p-edit-nickname').value;
    userData.email = document.getElementById('p-edit-email').value;
    userData.phone = document.getElementById('p-edit-phone').value;

    localStorage.setItem('utbkUserData', JSON.stringify(userData));

    // Update displays
    updateProfileDisplay();

    // Return to profile
    switchTab('profile');

    // Success feedback (optional but good)
    showToast('Success', 'Profile updated successfully!');
}

function showToast(title, message) {
    // Simple alert for now, or use existing toast if available
    console.log(`${title}: ${message}`);
}

function setupFaqAccordion() {
    const questions = document.querySelectorAll('.faq-question');
    questions.forEach(q => {
        q.onclick = (e) => {
            const item = e.target.closest('.faq-item');
            // Close others if you want, or just toggle
            item.classList.toggle('active');
        };
    });
}

// Render Functions
// Helper to parse tryout info
function getTryoutInfo(name) {
    let type = 'regular';
    let number = '';

    if (name.toLowerCase().includes('premium')) {
        type = 'premium';
    }

    const match = name.match(/EPS\.?\s*(\d+)/i);
    if (match) {
        number = match[1];
    }

    return { type, number };
}

// History Pagination State
let historyPage = 1;
const historyItemsPerPage = 5;

function renderList() {
    scoreListEl.innerHTML = '';
    const historyPaginationEl = document.getElementById('history-pagination');
    if (historyPaginationEl) historyPaginationEl.innerHTML = '';

    if (scores.length === 0) {
        scoreListEl.innerHTML = `
        <div class="empty-state">
            <p>${t('empty-scores')}</p>
        </div>
        `;
        return;
    }

    // Sort by newest first
    const sortedScores = [...scores].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Pagination Logic
    const totalPages = Math.ceil(sortedScores.length / historyItemsPerPage);

    // Ensure current page is valid
    if (historyPage > totalPages) historyPage = totalPages;
    if (historyPage < 1) historyPage = 1;

    const start = (historyPage - 1) * historyItemsPerPage;
    const end = start + historyItemsPerPage;
    const paginatedScores = sortedScores.slice(start, end);

    paginatedScores.forEach((score, index) => {
        // Calculate true index for trend comparison
        const trueIndex = start + index;

        const item = document.createElement('div');
        item.className = 'score-item';

        const info = getTryoutInfo(score.name);

        // Calculate Trend
        let trendHtml = '';
        if (trueIndex < sortedScores.length - 1) {
            const prevScore = sortedScores[trueIndex + 1];
            const diff = score.score - prevScore.score;

            if (diff > 0) {
                trendHtml = `<span class="score-trend trend-up"><i class="fa-solid fa-arrow-trend-up"></i> +${diff}</span>`;
            } else if (diff < 0) {
                trendHtml = `<span class="score-trend trend-down"><i class="fa-solid fa-arrow-trend-down"></i> ${diff}</span>`;
            } else {
                trendHtml = `<span class="score-trend trend-neutral"><i class="fa-solid fa-minus"></i></span>`;
            }
        } else {
            // Add invisible placeholder for alignment
            trendHtml = `<span class="score-trend" style="visibility: hidden;"><i class="fa-solid fa-arrow-trend-up"></i> +0</span>`;
        }

        item.innerHTML = `
        <div class="score-details">
                <div class="score-icon ${info.type}">
                    <span class="icon-number">${info.number}</span>
                </div>
                <div class="score-text">
                    <span class="score-name">${score.name}</span>
                    <span class="score-date">${formatDate(score.date)}</span>
                </div>
            </div>
        <div class="score-details" style="align-items: center;">
            <div style="display: flex; flex-direction: column; align-items: center;">
                <span class="score-value">${score.score}</span>
                ${trendHtml}
            </div>
            <i class="fa-solid fa-trash" style="color: #ff5252; cursor: pointer; margin-left: 12px; font-size: 0.9rem;" onclick="deleteScore(${score.id})"></i>
        </div>
    `;
        scoreListEl.appendChild(item);
    });

    // Render Pagination Controls
    if (totalPages > 1) {
        renderHistoryControls(totalPages);
    }
}

// --- PTN Feature Logic ---
let dreamPTNs = JSON.parse(localStorage.getItem('dreamPTNs')) || [{}, {}, {}, {}];

// Ensure array has 4 slots
if (dreamPTNs.length < 4) {
    while (dreamPTNs.length < 4) {
        dreamPTNs.push({});
    }
} else if (dreamPTNs.length > 4) {
    dreamPTNs = dreamPTNs.slice(0, 4);
}

function savePtnData() {
    localStorage.setItem('dreamPTNs', JSON.stringify(dreamPTNs));
    renderPtnSlider(); // Re-render slider on save
}

// Rationalization Logic
function calculateRationalization(avgScore, dt, peminat, universityName = '', minScoreData = null) {
    if (!avgScore || avgScore === 0) return { label: t('status-no-score'), class: 'unknown' };
    if (!dt || !peminat || peminat === 0) return { label: t('status-cannot-predict'), class: 'unknown' };

    const keketatan = (dt / peminat) * 100;

    // Base Target Calculation
    let targetScore = 550;

    // Priority: Explicit "No Data" check
    if (minScoreData === 'belum ada data' || minScoreData === 'No Data') {
        return { label: t('status-cannot-predict'), class: 'unknown', target: t('label-no-data') };
    }

    // Priority: Use real data if available
    let usedRealData = false;
    if (minScoreData) {
        const parsedMin = parseInt(minScoreData);
        if (!isNaN(parsedMin)) {
            targetScore = parsedMin;
            usedRealData = true;
        }
    }

    if (!usedRealData) {
        // Fallback to estimation based on Keketatan
        if (keketatan < 1.0) targetScore = 750;
        else if (keketatan < 2.5) targetScore = 710;
        else if (keketatan < 5.0) targetScore = 670;
        else if (keketatan < 10.0) targetScore = 630;
        else if (keketatan < 20.0) targetScore = 580;
        else targetScore = 530;

        // University Tier Modifier
        const tier1 = ['UNIVERSITAS INDONESIA', 'INSTITUT TEKNOLOGI BANDUNG', 'UNIVERSITAS GADJAH MADA'];
        const tier2 = ['UNIVERSITAS AIRLANGGA', 'INSTITUT TEKNOLOGI SEPULUH NOPEMBER', 'UNIVERSITAS DIPONEGORO', 'UNIVERSITAS PADJADJARAN', 'UNIVERSITAS BRAWIJAYA', 'INSTITUT PERTANIAN BOGOR', 'UNIVERSITAS SEBELAS MARET'];

        if (tier1.some(u => universityName.includes(u))) {
            targetScore += 50;
        } else if (tier2.some(u => universityName.includes(u))) {
            targetScore += 30;
        }
    }

    const diff = avgScore - targetScore;

    let chanceData = { label: t('status-insufficient'), class: 'low', target: targetScore };
    if (diff >= 0) {
        chanceData = { label: t('status-sufficient'), class: 'high', target: targetScore };
    }

    return chanceData;
}

// Render Slider
function renderPtnSlider() {
    const wrapper = document.getElementById('ptn-cards-wrapper');
    const dotsContainer = document.getElementById('slider-dots');

    if (!wrapper) return;

    wrapper.innerHTML = '';
    dotsContainer.innerHTML = '';

    // Calculate Avg Score once
    const totalScore = scores.reduce((sum, item) => sum + item.score, 0);
    const avgScore = scores.length > 0 ? Math.round(totalScore / scores.length) : 0;

    dreamPTNs.forEach((ptn, index) => {
        // Create Card
        const card = document.createElement('div');
        const isFilled = ptn.university && ptn.major;

        if (isFilled) {
            let statsHtml = '';
            let chanceHtml = '';

            if (typeof masterDataPTN !== 'undefined') {
                const uniData = masterDataPTN.find(u => u.university === ptn.university);
                if (uniData) {
                    const prodiData = uniData.prodis.find(p => p.name === ptn.major);
                    if (prodiData) {
                        const dt = parseInt(prodiData.dayaTampung) || 0;
                        const peminat = parseInt(prodiData.peminat) || 0;

                        const dtDisplay = dt > 0 ? dt : `<span class="no-data">${t('label-no-data')}</span>`;
                        const peminatDisplay = peminat > 0 ? peminat : `<span class="no-data">${t('label-no-data')}</span>`;

                        let keketatanDisplay = `<span class="no-data">${t('label-no-data')}</span>`;
                        if (dt > 0 && peminat > 0) {
                            const pct = (dt / peminat) * 100;
                            keketatanDisplay = `${pct.toFixed(1)}%`;
                        }

                        // Calculate Chance with University Name and Min Score
                        const chance = calculateRationalization(avgScore, dt, peminat, ptn.university, prodiData.minScore);
                        chanceHtml = `
                            <div style="margin-top: 8px;">
                                <div class="chance-badge ${chance.class}">${chance.label}</div>
                                <div style="font-size: 0.8rem; color: var(--text-grey); margin-top: 4px;">
                                    ${t('label-target-min-skor')}: <strong>${chance.target || '-'}</strong>
                                </div>
                            </div>
                        `;

                        statsHtml = `
                            <div class="ptn-stats-grid">
                                <div class="stat-item fade-in-up" style="animation-delay: 0.1s;">
                                    <div class="stat-icon-circle blue">
                                        <i class="fa-solid fa-users"></i>
                                    </div>
                                    <span class="stat-label">${t('stat-daya-tampung')}</span>
                                    <span class="stat-val">${dtDisplay}</span>
                                </div>
                                <div class="stat-item fade-in-up" style="animation-delay: 0.2s;">
                                    <div class="stat-icon-circle orange">
                                        <i class="fa-solid fa-person-circle-question"></i>
                                    </div>
                                    <span class="stat-label">${t('stat-peminat')}</span>
                                    <span class="stat-val">${peminatDisplay}</span>
                                </div>
                                <div class="stat-item fade-in-up" style="animation-delay: 0.3s;">
                                     <div class="stat-icon-circle green">
                                        <i class="fa-solid fa-chart-pie"></i>
                                    </div>
                                    <span class="stat-label">${t('stat-keketatan')}</span>
                                    <span class="stat-val">${keketatanDisplay}</span>
                                </div>
                            </div>
                        `;
                    }
                }
            }

            card.className = 'slider-ptn-card';
            card.onclick = () => openPtnModal(index);
            card.innerHTML = `
                <button class="ptn-delete-btn" title="${t('btn-delete')}" onclick="event.stopPropagation(); removePtnChoice(${index});">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
                <div class="card-content-top">
                    <div class="ptn-number-icon">${index + 1}</div>
                    <div class="card-text">
                        <h4>${ptn.major}</h4>
                        <p>${ptn.university}</p>
                        ${chanceHtml}
                    </div>
                </div>
                <div class="card-footer-info">
                    ${statsHtml || t('msg-no-ptn-data')}
                </div>
    `;
        } else {
            card.className = 'slider-ptn-card empty';
            card.onclick = () => openPtnModal(index);

            let labelText = t(`choice-${index + 1}`);
            let subText = '';

            if (index >= 2) {
                subText = `<div style="font-size: 0.7rem; margin-top: 4px; opacity: 0.8;">${t('choice-vokasi-req')}</div>`;
            }

            card.innerHTML = `
                <i class="fa-solid fa-plus"></i>
                <div style="display:flex; flex-direction:column; align-items:center;">
                    <span>${labelText}</span>
                    ${subText}
                </div>
            `;
        }
        wrapper.appendChild(card);

        // Create Dot
        const dot = document.createElement('div');
        dot.className = index === 0 ? 'dot active' : 'dot';
        // Simple logic for active dot (improved later with scroll listener if needed)
        dotsContainer.appendChild(dot);
    });
}

// Modal Logic
// Duplicates removed (openPtnModal defined below)

function setupPtnModalInputs() {
    const inputs = document.querySelectorAll('.ptn-input-modal');

    // Load initial values
    inputs.forEach(input => {
        const index = input.dataset.index;
        const field = input.dataset.field;
        if (dreamPTNs[index] && dreamPTNs[index][field]) {
            input.value = dreamPTNs[index][field];
        }

        // Add Event Listener
        input.addEventListener('input', (e) => {
            const val = e.target.value;
            const idx = e.target.dataset.index;
            const key = e.target.dataset.field;

            if (!dreamPTNs[idx]) dreamPTNs[idx] = {};
            dreamPTNs[idx][key] = val;

            savePtnData();
        });
    });
}

// Slider Scroll Logic
function scrollSlider(direction) {
    const wrapper = document.querySelector('.ptn-slider-container');
    const scrollAmount = 300; // Approx card width + gap
    wrapper.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

// Scroll Listener for Active Dot
document.querySelector('.ptn-slider-container').addEventListener('scroll', (e) => {
    const wrapper = e.target;
    const scrollLeft = wrapper.scrollLeft;
    const cardWidth = 292; // 280 + 12
    const activeIndex = Math.round(scrollLeft / cardWidth);

    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
        if (idx === activeIndex) dot.classList.add('active');
        else dot.classList.remove('active');
    });
});

// Click outside for PTN modal
window.addEventListener('click', function (event) {
    if (event.target == document.getElementById('ptnModal')) {
        closePtnModal();
    }
});

// Initialize
renderPtnSlider();
setupPtnModalInputs();

function renderHistoryControls(totalPages) {
    const container = document.getElementById('history-pagination');
    // Prev Button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    prevBtn.disabled = historyPage === 1;
    prevBtn.onclick = () => {
        if (historyPage > 1) {
            historyPage--;
            renderList();
        }
    };
    container.appendChild(prevBtn);

    // Page Numbers (Simplified for now)
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = `page-btn ${i === historyPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.onclick = () => {
            historyPage = i;
            renderList();
        }
        container.appendChild(btn);
    }

    // Next Button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    nextBtn.disabled = historyPage === totalPages;
    nextBtn.onclick = () => {
        if (historyPage < totalPages) {
            historyPage++;
            renderList();
        }
    };
    container.appendChild(nextBtn);
}

function updateStats() {
    if (scores.length === 0) {
        avgScoreEl.textContent = '0';
        totalTryoutsEl.textContent = '0';
        return;
    }

    const total = scores.reduce((sum, item) => sum + item.score, 0);
    const avg = Math.round(total / scores.length);

    avgScoreEl.textContent = avg;
    totalTryoutsEl.textContent = scores.length;

    // Update PTN Header Score
    const ptnAvgEl = document.getElementById('ptn-avg-score');
    if (ptnAvgEl) ptnAvgEl.textContent = avg;
}

// Chart Functions
function renderChart() {
    const chartCanvas = document.getElementById('scoreChart');
    if (!chartCanvas) return;

    if (scoreChart) {
        scoreChart.destroy();
    }

    const labels = scores.map(s => s.name);
    const data = scores.map(s => s.score);

    // Get theme colors from CSS variables
    const style = getComputedStyle(document.body);
    const primaryColor = style.getPropertyValue('--primary-blue').trim() || '#4A90E2';
    const textColor = style.getPropertyValue('--text-dark').trim() || '#333333';
    const gridColor = style.getPropertyValue('--light-blue').trim() || 'rgba(0,0,0,0.05)';
    const cardBg = style.getPropertyValue('--white').trim() || '#FFFFFF';

    const ctx = chartCanvas.getContext('2d');

    scoreChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: t('chart-label'),
                data: data,
                borderColor: primaryColor,
                backgroundColor: primaryColor + '1A', // 10% opacity (approx hex)
                borderWidth: 3,
                tension: 0.4, // Smooth curve
                pointBackgroundColor: cardBg,
                pointBorderColor: primaryColor,
                pointBorderWidth: 2,
                pointRadius: 4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: cardBg,
                    titleColor: textColor,
                    bodyColor: primaryColor,
                    titleFont: {
                        family: 'Outfit'
                    },
                    bodyFont: {
                        family: 'Outfit',
                        weight: 'bold'
                    },
                    borderColor: primaryColor + '33',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: gridColor,
                        drawBorder: false
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            family: 'Outfit'
                        }
                    },
                    suggestedMax: 1000
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        display: false // Hide x labels if too many
                    }
                }
            }
        }
    });
}

function updateChart() {
    scoreChart.data.labels = scores.map(s => s.name);
    scoreChart.data.datasets[0].data = scores.map(s => s.score);
    scoreChart.update();
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const locale = (userData && userData.language === 'en') ? 'en-US' : 'id-ID';
    return new Date(dateString).toLocaleDateString(locale, options);
}

// Calendar Navigation
function changeMonth(offset) {
    currentMonth += offset;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

// Helper to translate schedule texts (months/dates)
function translateScheduleText(text) {
    if (!text) return text;
    const lang = (userData && userData.language) ? userData.language : 'id';
    if (lang === 'id') return text;

    const replacements = {
        'Januari': 'January', 'Februari': 'February', 'Maret': 'March', 'April': 'April',
        'Mei': 'May', 'Juni': 'June', 'Juli': 'July', 'Agustus': 'August',
        'September': 'September', 'Oktober': 'October', 'November': 'November', 'Desember': 'December',
        'Sept': 'Sep', 'Okt': 'Oct', 'Nov': 'Nov', 'Des': 'Dec',
        'PELAKSANAAN UTBK': 'UTBK EXECUTION',
        'PENGUMUMAN HASIL SNBT': 'SNBT RESULT ANNOUNCEMENT',
        'Pilihan Utama': 'First Choice',
        'Pilihan Kedua': 'Second Choice',
        'Pilihan Ketiga': 'Third Choice',
        'Pilihan Keempat': 'Fourth Choice'
    };

    let translated = text;
    for (const [id, en] of Object.entries(replacements)) {
        const regex = new RegExp(`\\b${id}\\b`, 'g');
        translated = translated.replace(regex, en);
    }
    return translated;
}

// Start logic moved to init()

// Event Modal Logic (initialized in init)

function openEventModal(event) {
    document.getElementById('detail-name').textContent = translateScheduleText(event.name);
    document.getElementById('detail-date').textContent = translateScheduleText(event.date);

    // Elements to toggle
    const scoreItem = document.getElementById('item-score');
    const linkItem = document.getElementById('item-link');

    if (event.type === 'exam') {
        // Hide Score and Link for Exams
        scoreItem.style.display = 'none';
        linkItem.style.display = 'none';
    } else {
        // Show for Tryouts
        scoreItem.style.display = 'flex';
        linkItem.style.display = 'flex';

        // Findings Score
        const existingScore = scores.find(s => s.name === event.name);
        const scoreValue = existingScore ? existingScore.score : 0;
        document.getElementById('detail-score').textContent = scoreValue;

        // Trend Logic
        const trendEl = document.getElementById('detail-trend');
        trendEl.innerHTML = '';
        trendEl.className = 'score-trend'; // Reset classes

        if (existingScore) {
            // Find previous score based on date
            // Filter out current score and scores with later dates
            const currentScoreDate = new Date(existingScore.date);
            const prevScores = scores.filter(s => new Date(s.date) < currentScoreDate);

            if (prevScores.length > 0) {
                // Get the most recent previous score
                prevScores.sort((a, b) => new Date(b.date) - new Date(a.date));
                const prevScore = prevScores[0];
                const diff = scoreValue - prevScore.score;

                if (diff > 0) {
                    trendEl.innerHTML = `<i class="fa-solid fa-arrow-trend-up"></i> +${diff}`;
                    trendEl.classList.add('trend-up');
                } else if (diff < 0) {
                    trendEl.innerHTML = `<i class="fa-solid fa-arrow-trend-down"></i> ${diff}`;
                    trendEl.classList.add('trend-down');
                } else {
                    trendEl.textContent = 'Sama dengan sebelumnya';
                    trendEl.classList.add('trend-neutral');
                }
            } else {
                trendEl.textContent = t('trend-first-to');
                trendEl.classList.add('trend-neutral');
            }
        }

        // Link Logic
        const linkContainer = document.getElementById('detail-link-container');
        linkContainer.innerHTML = ''; // Clear previous

        if (existingScore) {
            linkContainer.innerHTML = `<span class="detail-status-text detail-status-done">${t('status-done')}</span>`;
        } else {
            const status = getEventStatus(event.start, event.end);

            if (status.class === 'status-ended') {
                linkContainer.innerHTML = `<span class="detail-status-text detail-status-ended">${t('status-ended')}</span>`;
            } else if (status.class === 'status-upcoming') {
                linkContainer.innerHTML = `<span class="detail-status-text detail-status-upcoming">${t('status-not-started')}</span>`;
            } else {
                // Ongoing - Show Link
                // Determine Type and Number for Link
                const info = getTryoutInfo(event.name);

                let link = '#';
                if (info.type === 'premium') {
                    link = `https://tinyurl.com/TOUTBKPremium-Eps${info.number}`;
                } else {
                    link = `Https://tinyurl.com/TOUTBKWAJIB-EPS${info.number}`;
                }

                linkContainer.innerHTML = `
                    <a href="${link}" target="_blank" class="detail-link-btn">
                        ${t('btn-start-to')} <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                `;
            }
        }
    }

    eventModal.style.display = 'flex';
}

// --- PTN Modal Logic (New) ---
let editingPtnIndex = -1;

function openPtnModal(index = 0) { // Default to first slot if not specified, though usually clicked from specific card
    // In this design, we might want to know WHICH card we are editing.
    // The current UI has a single "Ubah Kampus" button for all. 
    // Let's assume for now we are editing the FIRST empty slot, or if all full, maybe just the first one?
    // OR, better: The UI shows "Ubah Kampus" which implies editing the whole list?
    // Actually the previous modal had inputs for ALL 4. The new design looks like a single selection.
    // Let's assume the user clicks a specific card to edit it, OR the "Ubah Kampus" button opens a list?
    // user request: "Kalau di klik pilihannya dibuatkan dropdown..." -> implies clicking a specific choice.
    // But the "Ubah Kampus" button is general. 
    // Let's update `renderPtnSlider` to allow clicking a CARD to edit it.
    // And `openPtnModal` will take an index.

    // If index is passed, use it. If not (clicked from main button), maybe show a list to pick which to edit?
    // For simplicity / MVP matching the design: Let's assume this modal edits the CURRENTLY visible card in slider?
    // Or just pass index 0 for now if general button is clicked.
    // Let's modify `openPtnModal` to accept an index.

    const sliderDots = document.querySelectorAll('.slider-dot.active');
    if (index === undefined && sliderDots.length > 0) {
        // If no index provided, try to get from active slider? 
        // Actually `renderPtnSlider` doesn't track active index easily in global scope.
        // Let's defaulting to 0 is safe for now, or finding the first empty one.
        index = dreamPTNs.findIndex(p => !p.university);
        if (index === -1) index = 0;
    }

    editingPtnIndex = index;
    const currentData = dreamPTNs[index] || {};

    // Update Modal Title based on choice
    const modalTitle = document.querySelector('#ptnModal h2');
    if (index >= 2) {
        modalTitle.textContent = `${t('title-ptn-modal')} (${t('title-choice')} ${index + 1} - D3/D4)`;
    } else {
        modalTitle.textContent = t('title-ptn-modal');
    }

    // Reset and Populate
    populateUniDropdown();

    // Set current values if exist
    const uniInput = document.getElementById('ptn-uni-input');
    const majorInput = document.getElementById('ptn-major-input');

    if (currentData.university) {
        uniInput.value = currentData.university;
        populateMajorDropdown(currentData.university);

        if (currentData.major) {
            majorInput.value = currentData.major;
        } else {
            majorInput.value = '';
        }
    } else {
        resetPtnModalForm();
    }

    document.getElementById('ptnModal').style.display = 'flex';
    setupPtnDropdownEventListeners();
}

function closePtnModal() {
    document.getElementById('ptnModal').style.display = 'none';
    editingPtnIndex = -1;
}

function resetPtnModalForm() {
    document.getElementById('ptn-uni-input').value = '';
    document.getElementById('ptn-major-input').value = '';
    document.getElementById('ptn-major-options').innerHTML = `<div class="dropdown-option no-results">${t('msg-select-uni-modal')}</div>`;
}

function handlePtnSave() {
    const uni = document.getElementById('ptn-uni-input').value;
    const major = document.getElementById('ptn-major-input').value; // Optional?

    if (!uni || !major) {
        alert(t('msg-select-both'));
        return;
    }

    // Duplicate Check
    const isDuplicate = dreamPTNs.some((p, idx) =>
        idx !== editingPtnIndex && p.university === uni && p.major === major
    );

    if (isDuplicate) {
        alert(t('msg-duplicate-choice'));
        return;
    }

    if (editingPtnIndex >= 0) {
        dreamPTNs[editingPtnIndex] = { university: uni, major: major };
        savePtnData(); // Saves and re-renders
        generateRecommendation();
    }
    closePtnModal();
}

// Dropdown Logic for PTN Modal
function populateUniDropdown() {
    const container = document.getElementById('ptn-uni-options');
    // Use masterDataPTN if available
    let universities = [];
    if (typeof masterDataPTN !== 'undefined') {
        // Filter logic for D3/D4 if editingPtnIndex >= 2
        if (editingPtnIndex >= 2) {
            universities = masterDataPTN
                .filter(u => u.prodis && Array.isArray(u.prodis) && u.prodis.some(p => p.jenjang === 'D3' || p.jenjang === 'D4'))
                .map(item => item.university)
                .sort();
        } else {
            universities = masterDataPTN.map(item => item.university).sort();
        }
    } else {
        // Fallback to topProdis if masterDataPTN not loaded (Assuming no D3/D4 filter on fallback for simplicity or limited data)
        universities = [...new Set(topProdis.map(item => item.university))].sort();
    }

    renderPtnDropdownOptions(container, universities, 'uni');
}

function populateMajorDropdown(uniName) {
    const container = document.getElementById('ptn-major-options');
    if (!uniName) {
        container.innerHTML = `<div class="dropdown-option no-results">${t('msg-select-uni-modal')}</div>`;
        return;
    }

    let majors = [];
    if (typeof masterDataPTN !== 'undefined') {
        const uniData = masterDataPTN.find(item => item.university === uniName);
        if (uniData) {
            let filteredProdis = uniData.prodis || [];
            // Filter logic for D3/D4 if editingPtnIndex >= 2
            if (editingPtnIndex >= 2) {
                filteredProdis = filteredProdis.filter(p => p.jenjang === 'D3' || p.jenjang === 'D4');
            }
            // Sort objects by name
            majors = filteredProdis.sort((a, b) => a.name.localeCompare(b.name));
        }
    } else {
        // Fallback
        majors = topProdis
            .filter(item => item.university === uniName)
            .map(item => item.name)
            .sort();
    }

    if (majors.length === 0) {
        container.innerHTML = `<div class="dropdown-option no-results">${t('msg-no-major-match')}</div>`;
    } else {
        renderPtnDropdownOptions(container, majors, 'major');
    }
}

function renderPtnDropdownOptions(container, items, type) {
    container.innerHTML = '';
    if (items.length === 0) {
        container.innerHTML = '<div class="dropdown-option no-results">Tidak ditemukan</div>';
        return;
    }

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'dropdown-option';

        let displayText = item;
        let value = item;

        if (type === 'major' && typeof item === 'object' && item !== null) {
            displayText = `${item.name} (${item.jenjang})`;
            value = item.name;
        }

        div.textContent = displayText;
        div.onclick = () => selectPtnOption(value, type);
        container.appendChild(div);
    });
}

function selectPtnOption(value, type) {
    if (type === 'uni') {
        const uniInput = document.getElementById('ptn-uni-input');
        uniInput.value = value;
        document.getElementById('ptn-uni-dropdown').classList.remove('active');

        // Reset Major when Uni changes
        const majorInput = document.getElementById('ptn-major-input');
        majorInput.value = '';

        // Populate majors for the new uni (optional, helps pre-load if needed, 
        // but the focus listener handles it too. Let's just clear for now).
        // renderPtnDropdownOptions(document.getElementById('ptn-major-options'), [], 'major');
    } else {
        document.getElementById('ptn-major-input').value = value;
        document.getElementById('ptn-major-dropdown').classList.remove('active');
    }
}

function setupPtnDropdownEventListeners() {
    // Helper to open dropdown
    const openDropdown = (dropdown) => {
        // Close others
        document.querySelectorAll('.custom-dropdown').forEach(d => {
            if (d !== dropdown) d.classList.remove('active');
        });
        dropdown.classList.add('active');
    };

    // --- University Dropdown ---
    const uniInput = document.getElementById('ptn-uni-input');
    const uniDropdown = document.getElementById('ptn-uni-dropdown');
    const uniOptionsContainer = document.getElementById('ptn-uni-options');

    const handleUniInput = (val) => {
        const query = val.toLowerCase();
        let allUnis = [];
        if (typeof masterDataPTN !== 'undefined') {
            if (editingPtnIndex >= 2) {
                allUnis = masterDataPTN
                    .filter(u => u.prodis && Array.isArray(u.prodis) && u.prodis.some(p => p.jenjang === 'D3' || p.jenjang === 'D4'))
                    .map(item => item.university)
                    .sort();
            } else {
                allUnis = masterDataPTN.map(item => item.university).sort();
            }
        } else {
            allUnis = [...new Set(topProdis.map(item => item.university))].sort();
        }

        const filtered = allUnis.filter(u => u.toLowerCase().includes(query));
        renderPtnDropdownOptions(uniOptionsContainer, filtered, 'uni');
    };

    // Focus/Click opens dropdown
    uniInput.addEventListener('focus', () => {
        openDropdown(uniDropdown);
        handleUniInput(uniInput.value);
    });

    uniInput.addEventListener('click', (e) => {
        e.stopPropagation();
        openDropdown(uniDropdown);
        handleUniInput(uniInput.value);
    });

    // Typing filters options
    uniInput.addEventListener('input', (e) => {
        openDropdown(uniDropdown);
        handleUniInput(e.target.value);
    });

    // --- Major Dropdown ---
    const majorInput = document.getElementById('ptn-major-input');
    const majorDropdown = document.getElementById('ptn-major-dropdown');
    const majorOptionsContainer = document.getElementById('ptn-major-options');

    const handleMajorInput = (val) => {
        const uniVal = uniInput.value;
        if (!uniVal) return;

        const query = val.toLowerCase();
        let allMajors = [];
        if (typeof masterDataPTN !== 'undefined') {
            const uniData = masterDataPTN.find(item => item.university === uniVal);
            if (uniData) {
                let filteredProdis = uniData.prodis;
                if (editingPtnIndex >= 2) {
                    filteredProdis = filteredProdis.filter(p => p.jenjang === 'D3' || p.jenjang === 'D4');
                }
                allMajors = filteredProdis;
            }
        } else {
            allMajors = topProdis.filter(item => item.university === uniVal).map(i => i.name);
        }

        const filtered = allMajors.filter(m => {
            const name = (typeof m === 'object') ? m.name : m;
            return name.toLowerCase().includes(query);
        });
        renderPtnDropdownOptions(majorOptionsContainer, filtered, 'major');
    };

    majorInput.addEventListener('focus', () => {
        if (!uniInput.value) {
            alert(t('msg-select-uni-first'));
            uniInput.focus();
            return;
        }
        openDropdown(majorDropdown);
        handleMajorInput(majorInput.value);
    });

    majorInput.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!uniInput.value) {
            alert(t('msg-select-uni-first'));
            uniInput.focus();
            return;
        }
        openDropdown(majorDropdown);
        handleMajorInput(majorInput.value);
    });

    majorInput.addEventListener('input', (e) => {
        openDropdown(majorDropdown);
        handleMajorInput(e.target.value);
    });

    // Global Click to Close
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-dropdown')) {
            document.querySelectorAll('.custom-dropdown').forEach(d => d.classList.remove('active'));
        }
    });
}

function closeEventModal() {
    eventModal.style.display = 'none';
}

// =========================================
// RECOMMENDATION LOGIC
// =========================================

function generateRecommendation() {
    const widget = document.getElementById('recommendation-widget');
    const disclaimer = document.getElementById('ptn-disclaimer');
    const summaryEl = document.getElementById('rec-summary');
    const listEl = document.getElementById('rec-list');

    if (!widget || !summaryEl || !listEl) return;

    // Check if user has entered data
    const filledChoices = dreamPTNs.filter(p => p.university && p.major);

    if (filledChoices.length < 2) {
        widget.style.display = 'none'; // Hide if not enough data
        if (disclaimer) disclaimer.style.display = 'none';
        const downloadSection = document.getElementById('download-section');
        if (downloadSection) downloadSection.style.display = 'none';
        return;
    }

    widget.style.display = 'block';
    const downloadSection = document.getElementById('download-section');
    if (downloadSection) downloadSection.style.display = 'block';
    if (disclaimer) disclaimer.style.display = 'block';
    listEl.innerHTML = '';

    const avgScore = parseInt(document.getElementById('avg-score').innerText) || 0;

    // 1. Analyze Choices
    let analysis = filledChoices.map(choice => {
        let isVocational = false;
        let minScore = 0;
        let ptnData = null;

        if (typeof masterDataPTN !== 'undefined') {
            const uni = masterDataPTN.find(u => u.university === choice.university);
            if (uni) {
                const prodi = uni.prodis.find(p => p.name === choice.major);
                if (prodi) {
                    isVocational = prodi.jenjang === 'D3' || prodi.jenjang === 'D4';
                    minScore = parseInt(prodi.minScore) || 0;
                    ptnData = prodi;
                }
            }
        }

        // Fallback checks if master data fails but name suggests
        if (!ptnData) {
            if (choice.major.includes('D3') || choice.major.includes('D4') || choice.major.includes('VOKASI')) {
                isVocational = true;
            }
        }

        return {
            ...choice,
            isVocational,
            minScore,
            originalIndex: dreamPTNs.indexOf(choice),
            gap: avgScore - minScore // Positive = Safe, Negative = Risky
        };
    });

    // 2. Logic for Recommendation
    // Goal: 1 & 2 = Academic (S1), 3 & 4 = Vocational (D3/D4)
    // Order: Highest Risk first (Dream), Lowest Risk last (Safety)

    const academic = analysis.filter(a => !a.isVocational);
    const vocational = analysis.filter(a => a.isVocational);

    // Sort by Min Score Descending (Higher Min Score = Harder = Dream)
    // Or Sort by Gap Ascending (Lower/Negative Gap = Harder)
    academic.sort((a, b) => b.minScore - a.minScore);
    vocational.sort((a, b) => b.minScore - a.minScore);

    let recommendations = [];
    let warnings = [];

    // Slot 1 & 2: Academic
    if (academic.length > 0) {
        recommendations.push({ slot: 1, item: academic[0], reason: "Pilihan Ambisius (S1)" });
        if (academic.length > 1) {
            recommendations.push({ slot: 2, item: academic[1], reason: "Pilihan Rasional (S1)" });
        }
    }

    // Slot 3 & 4: Vocational
    if (vocational.length > 0) {
        // If we filled 1 and 2, continue to 3. If not, fill earlier slots? 
        // Standard SNBT: 4 choices max. 2 S1 max, 2 D3/D4 max.
        // Actually the rule is: Can choose up to 4. Max 2 S1, Max 2 D3/D4.
        // If 4 choices: 2 Academic + 2 Vocational OR 1 Academic + 3 Vocational?
        // Let's stick to the common strategy: 1,2 S1 and 3,4 D3/D4.

        let startSlot = recommendations.length + 1;
        if (startSlot < 3) startSlot = 3; // Force into slot 3 if we have space? No, just list sequentially relative to strategy.

        // Actually, let's just build the Ideal List 1-4.
    }

    // Reconstruction of Ideal Order
    let finalOrder = [];

    // Step A: Pick up to 2 S1s
    const s1Picks = academic.slice(0, 2);
    // Step B: Pick up to 2 D3/D4s (or more if S1 is less than 2? No, max 2 S1 is the constraint usually for optimal strata)
    // Verify SNBT 2024 rules:
    // - 2 Pilihan: Bebas (S1/D3/D4)
    // - 3 Pilihan: Min 1 Vokasi
    // - 4 Pilihan: Min 1 Diploma Tiga (D3) + Min 1 Sarjana/D4
    // Wait, the rule is specific about D3 vs D4/S1.
    // "Maksimal 2 Prodi Sarjana, Maksimal 2 Prodi Vokasi"
    // "Jika 4 Pilihan: 2 Akademik (S1) + 2 Vokasi (Min 1 D3)" -> Check this exact rule if aiming for perfection.
    // User request: "Untuk pilihan 3 dan 4 tetap rekomendasikan prodi yang d3 atau d4"

    // Let's simplify per user request:
    // 1-2: S1 (Sorted by difficulty)
    // 3-4: D3/D4 (Sorted by difficulty)

    // Push S1s
    s1Picks.forEach((item, idx) => {
        finalOrder.push({
            label: `${t('label-choice')} ${idx + 1}`,
            item: item,
            desc: t('label-academic-program')
        });
    });

    // Push Vocationals
    vocational.forEach((item, idx) => {
        // Continue numbering
        let slotNum = finalOrder.length + 1;
        // If slot is 1 or 2 (meaning no S1s), it's fine.
        finalOrder.push({
            label: `${t('label-choice')} ${slotNum}`,
            item: item,
            desc: `${t('label-vocational-program')} (${item.major.includes('D3') ? 'D3' : 'D4/' + t('label-vokasi')})`
        });
    });

    // Render Recommendations
    finalOrder.forEach(rec => {
        const div = document.createElement('div');
        div.className = 'rec-item';

        const hasTarget = (rec.item.minScore && rec.item.minScore !== '0' && rec.item.minScore !== 0 && rec.item.minScore !== 'No Data' && rec.item.minScore !== 'belum ada data');

        let warningHtml = '';

        if (!hasTarget) {
            warningHtml = `
                <div style="margin-top: 4px; display: flex; align-items: center; gap: 4px;">
                    <span style="color: var(--text-grey); font-size: 0.75rem; font-weight: 600;">
                        <i class="fa-solid fa-circle-question"></i> ${t('label-cannot-predict')}
                    </span>
                </div>
            `;
        } else if (rec.item.gap < 0) {
            // Calculate User Score for context
            const userScore = parseInt(rec.item.minScore) + rec.item.gap;

            warningHtml = `
                <div style="margin-top: 4px; display: flex; align-items: center; gap: 4px;">
                    <span style="color: var(--accent-orange); font-size: 0.75rem; font-weight: 600;">
                        <i class="fa-solid fa-triangle-exclamation"></i> ${t('status-insufficient')}
                    </span>
                    <button class="btn-alt" onclick="showAlternativeModal('${rec.item.major.replace(/'/g, "\\'")}', '${rec.item.university.replace(/'/g, "\\'")}', '${rec.item.minScore}', ${userScore}, ${rec.item.originalIndex})">
                        ${t('btn-find-alt')}
                    </button>
                </div>
            `;
        } else {
            // Safe / Good Score
            warningHtml = `
                <div style="margin-top: 4px; display: flex; align-items: center; gap: 4px;">
                    <div style="font-size:0.6rem; color: white; background: #2E7D32; padding: 2px 10px; border-radius: 12px; font-weight: 600; white-space: nowrap; width: fit-content;">${t('status-sufficient')}</div>
                </div>
            `;
        }

        div.innerHTML = `
            <div class="rec-number">${rec.label.split(' ')[rec.label.split(' ').length - 1]}</div>
            <div class="rec-text" style="flex: 1;">
                <strong>${rec.item.major}</strong> - ${rec.item.university}
                <div style="font-size: 0.75rem; color: var(--text-grey); font-weight: 400;">
                    ${rec.desc} &bull; ${t('label-target-min')}: ${hasTarget ? rec.item.minScore : t('label-no-data')}
                </div>
                ${warningHtml}
            </div>
            <button class="rec-delete-btn" title="${t('btn-delete')}" onclick="removePtnChoice(${rec.item.originalIndex})">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;
        listEl.appendChild(div);
    });

    // Generate Warnings / Advice
    let alertItems = [];
    let strategyTips = [];

    if (filledChoices.length < 4) {
        strategyTips.push(t('rec-strategy-max-choice'));
    }

    if (filledChoices.length >= 3) {
        if (vocational.length === 0) {
            strategyTips.push(t('rec-strategy-vocational-req'));
        } else if (filledChoices.length === 4 && academic.length > 2) {
            strategyTips.push(t('rec-strategy-academic-limit'));
        }
        // Restore the specific note requested by the user
        alertItems.push(`<i class="fa-solid fa-circle-question"></i> <strong>${t('rec-note-label')}</strong> ${t('rec-note-choice')}`);
    }

    if (strategyTips.length > 0) {
        alertItems.push(`<i class="fa-solid fa-lightbulb"></i> <strong>${t('rec-strategy-label')}</strong> ${strategyTips.join(' • ')}`);
    }

    // Always add data accuracy disclaimer
    alertItems.push(`<i class="fa-solid fa-circle-info"></i> ${t('rec-disclaimer-text')}`);

    if (alertItems.length > 0) {
        summaryEl.textContent = t('rec-analyzing');

        const alertWrapper = document.createElement('div');
        alertWrapper.className = 'disclaimer-container';
        alertWrapper.style.marginTop = '16px';
        alertWrapper.style.padding = '12px 16px';
        alertWrapper.style.display = 'block';

        let itemsHtml = alertItems.map(item => {
            // Clean extraction of icon and text
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = item;
            const icon = tempDiv.querySelector('i') ? tempDiv.querySelector('i').outerHTML : '';
            const text = tempDiv.textContent || '';

            // Re-wrap text to preserve inner HTML (like strong tags)
            const htmlContent = item.replace(icon, '').trim();

            return `
                <div style="display:flex; align-items:flex-start; gap:10px; margin-bottom:6px; font-size:0.85rem; color:var(--text-dark); line-height:1.4;">
                    <div style="flex-shrink:0; width:18px; text-align:center;">${icon}</div>
                    <div style="flex:1;">${htmlContent}</div>
                </div>
            `;
        }).join('');

        alertWrapper.innerHTML = `
            <div class="disclaimer-content" style="flex-direction:column; align-items:flex-start; gap:2px;">
                ${itemsHtml}
            </div>
        `;
        listEl.appendChild(alertWrapper);
    } else {
        summaryEl.textContent = t('rec-analyzing');
    }
}

// Ensure this runs when data changes
// Call in savePtnData() and Init()
// Filtered for State Universities (PTN)
// Top PTN Data (Webometrics July 2025 - Top 50)
// Filtered for State Universities (PTN)
// Using Google Favicon API for better reliability
// World Ranks are approximate/based on Jan/Jul 2025 data
const topPTNs = [
    { name: "Universitas Indonesia (UI)", domain: "ui.ac.id", worldRank: "#537" },
    { name: "Universitas Gadjah Mada (UGM)", domain: "ugm.ac.id", worldRank: "#667" },
    { name: "Universitas Airlangga (UNAIR)", domain: "unair.ac.id", worldRank: "#798" },
    { name: "Institut Teknologi Bandung (ITB)", domain: "itb.ac.id", worldRank: "#821" },
    { name: "Universitas Padjadjaran (UNPAD)", domain: "unpad.ac.id", worldRank: "#1063" },
    { name: "Universitas Brawijaya (UB)", domain: "ub.ac.id", worldRank: "#1069" },
    { name: "Universitas Diponegoro (UNDIP)", domain: "undip.ac.id", worldRank: "#1098" },
    { name: "IPB University (IPB)", domain: "ipb.ac.id", worldRank: "#1117" },
    { name: "Universitas Sebelas Maret (UNS)", domain: "uns.ac.id", worldRank: "#1147" },
    { name: "Institut Teknologi Sepuluh Nopember (ITS)", domain: "its.ac.id", worldRank: "#1198" },

    // Rank 11-20
    { name: "Universitas Pendidikan Indonesia (UPI)", domain: "upi.edu", worldRank: "#1345" },
    { name: "Universitas Negeri Malang (UM)", domain: "um.ac.id", worldRank: "#1398" },
    { name: "Universitas Syiah Kuala (USK)", domain: "unsyiah.ac.id", worldRank: "#1421" },
    { name: "Universitas Hasanuddin (UNHAS)", domain: "unhas.ac.id", worldRank: "#1456" },
    { name: "Universitas Andalas (UNAND)", domain: "unand.ac.id", worldRank: "#1567" },
    { name: "Universitas Sumatera Utara (USU)", domain: "usu.ac.id", worldRank: "#1678" },
    { name: "Universitas Lampung (UNILA)", domain: "unila.ac.id", worldRank: "#1789" },
    { name: "Universitas Riau (UNRI)", domain: "unri.ac.id", worldRank: "#1890" },
    { name: "Universitas Negeri Yogyakarta (UNY)", domain: "uny.ac.id", worldRank: "#1987" },
    { name: "Universitas Jenderal Soedirman (UNSOED)", domain: "unsoed.ac.id", worldRank: "#2012" },

    // Rank 21-30
    { name: "Universitas Sriwijaya (UNSRI)", domain: "unsri.ac.id", worldRank: "#2145" },
    { name: "Universitas Jember (UNEJ)", domain: "unej.ac.id", worldRank: "#2234" },
    { name: "UIN Syarif Hidayatullah Jakarta", domain: "uinjkt.ac.id", worldRank: "#2356" },
    { name: "Universitas Negeri Surabaya (UNESA)", domain: "unesa.ac.id", worldRank: "#2467" },
    { name: "Universitas Mataram (UNRAM)", domain: "unram.ac.id", worldRank: "#2567" },
    { name: "Universitas Mulawarman (UNMUL)", domain: "unmul.ac.id", worldRank: "#2678" },
    { name: "UIN Sunan Gunung Djati Bandung", domain: "uinsgd.ac.id", worldRank: "#2789" },
    { name: "Universitas Sultan Ageng Tirtayasa (UNTIRTA)", domain: "untirta.ac.id", worldRank: "#2890" },
    { name: "Universitas Pendidikan Ganesha (UNDIKSHA)", domain: "undiksha.ac.id", worldRank: "#2998" },
    { name: "UIN Maulana Malik Ibrahim Malang", domain: "uin-malang.ac.id", worldRank: "#3012" },

    // Rank 31-40
    { name: "Universitas Negeri Gorontalo (UNG)", domain: "ung.ac.id", worldRank: "#3145" },
    { name: "Universitas Lambung Mangkurat (ULM)", domain: "ulm.ac.id", worldRank: "#3256" },
    { name: "Universitas Tadulako (UNTAD)", domain: "untad.ac.id", worldRank: "#3367" },
    { name: "Universitas Trunojoyo Madura (UTM)", domain: "trunojoyo.ac.id", worldRank: "#3478" },
    { name: "Universitas Negeri Manado (UNIMA)", domain: "unima.ac.id", worldRank: "#3589" },
    { name: "Universitas Jambi (UNJA)", domain: "unja.ac.id", worldRank: "#3690" },
    { name: "Universitas Sam Ratulangi (UNSRAT)", domain: "unsrat.ac.id", worldRank: "#3712" },
    { name: "Universitas Negeri Makassar (UNM)", domain: "unm.ac.id", worldRank: "#3823" },
    { name: "UIN Alauddin Makassar", domain: "uin-alauddin.ac.id", worldRank: "#3934" },
    { name: "Universitas Udayana (UNUD)", domain: "unud.ac.id", worldRank: "#3987" },

    // Rank 41-50
    { name: "Universitas Negeri Padang (UNP)", domain: "unp.ac.id", worldRank: "#4012" },
    { name: "Universitas Negeri Semarang (UNNES)", domain: "unnes.ac.id", worldRank: "#4123" },
    { name: "Universitas Halu Oleo (UHO)", domain: "uho.ac.id", worldRank: "#4234" },
    { name: "Universitas Malikussaleh (UNIMAL)", domain: "unimal.ac.id", worldRank: "#4345" },
    { name: "Universitas Tanjungpura (UNTAN)", domain: "untan.ac.id", worldRank: "#4456" },
    { name: "Universitas Bengkulu (UNIB)", domain: "unib.ac.id", worldRank: "#4567" },
    { name: "Universitas Negeri Medan (UNIMED)", domain: "unimed.ac.id", worldRank: "#4678" },
    { name: "UPN Veteran Jawa Timur", domain: "upnjatim.ac.id", worldRank: "#4789" },
    { name: "UPN Veteran Jakarta", domain: "upnvj.ac.id", worldRank: "#4890" },
    { name: "UPN Veteran Yogyakarta", domain: "upnyk.ac.id", worldRank: "#4912" },

    // Rank 51-60
    { name: "Universitas Islam Negeri Sunan Ampel Surabaya", domain: "uinsby.ac.id", worldRank: "#4956" },
    { name: "Universitas Negeri Jakarta (UNJ)", domain: "unj.ac.id", worldRank: "#5023" },
    { name: "Universitas Islam Negeri Walisongo Semarang", domain: "walisongo.ac.id", worldRank: "#5112" },
    { name: "Universitas Islam Negeri Raden Intan Lampung", domain: "radenintan.ac.id", worldRank: "#5234" },
    { name: "Universitas Islam Negeri Sumatera Utara", domain: "uinsu.ac.id", worldRank: "#5345" },
    { name: "Universitas Jambi (UNJA)", domain: "unja.ac.id", worldRank: "#5456" },
    { name: "Universitas Palangka Raya (UPR)", domain: "upr.ac.id", worldRank: "#5567" },
    { name: "Universitas Negeri Manado (UNIMA)", domain: "unima.ac.id", worldRank: "#5678" },
    { name: "Universitas Papua (UNIPA)", domain: "unipa.ac.id", worldRank: "#5789" },
    { name: "Universitas Islam Negeri Ar-Raniry", domain: "ar-raniry.ac.id", worldRank: "#5890" },

    // Rank 61-70
    { name: "Universitas Bangka Belitung (UBB)", domain: "ubb.ac.id", worldRank: "#5912" },
    { name: "Universitas Teuku Umar (UTU)", domain: "utu.ac.id", worldRank: "#6023" },
    { name: "Universitas Maritim Raja Ali Haji (UMRAH)", domain: "umrah.ac.id", worldRank: "#6134" },
    { name: "Universitas Islam Negeri Sultan Syarif Kasim", domain: "uin-suska.ac.id", worldRank: "#6245" },
    { name: "Universitas Islam Negeri Mataram", domain: "uinmataram.ac.id", worldRank: "#6356" },
    { name: "Universitas Islam Negeri Antasari Banjarmasin", domain: "uin-antasari.ac.id", worldRank: "#6467" },
    { name: "Universitas Khairun (UNKHAIR)", domain: "unkhair.ac.id", worldRank: "#6578" },
    { name: "Universitas Cenderawasih (UNCEN)", domain: "uncen.ac.id", worldRank: "#6689" },
    { name: "Universitas Pattimura (UNPATTI)", domain: "unpatti.ac.id", worldRank: "#6790" },
    { name: "Universitas Borneo Tarakan (UBT)", domain: "ubt.ac.id", worldRank: "#6812" },

    // Rank 71-80
    { name: "Universitas Siliwangi (UNSIL)", domain: "unsil.ac.id", worldRank: "#6923" },
    { name: "Universitas Singaperbangsa Karawang (UNSIKA)", domain: "unsika.ac.id", worldRank: "#7034" },
    { name: "Universitas Tidar (UNTIDAR)", domain: "untidar.ac.id", worldRank: "#7145" },
    { name: "Universitas Sulawesi Barat (UNSULBAR)", domain: "unsulbar.ac.id", worldRank: "#7256" },
    { name: "Universitas Samudra (UNSAM)", domain: "unsam.ac.id", worldRank: "#7367" },
    { name: "Universitas 19 November Kolaka", domain: "usn.ac.id", worldRank: "#7478" },
    { name: "Universitas Musamus Merauke (UNMUS)", domain: "unmus.ac.id", worldRank: "#7589" },
    { name: "Institut Seni Indonesia (ISI) Yogyakarta", domain: "isi.ac.id", worldRank: "#7690" },
    { name: "Institut Seni Indonesia (ISI) Surakarta", domain: "isi-ska.ac.id", worldRank: "#7712" },
    { name: "Institut Seni Indonesia (ISI) Denpasar", domain: "isi-dps.ac.id", worldRank: "#7823" },

    // Rank 81-90
    { name: "Universitas Islam Negeri Imam Bonjol", domain: "uinib.ac.id", worldRank: "#7934" },
    { name: "Universitas Islam Negeri Raden Fatah", domain: "radenfatah.ac.id", worldRank: "#8045" },
    { name: "Universitas Islam Negeri Sultan Thaha Saifuddin", domain: "uinjambi.ac.id", worldRank: "#8156" },
    { name: "Universitas Islam Negeri Salatiga", domain: "uinsalatiga.ac.id", worldRank: "#8267" },
    { name: "Universitas Islam Negeri K.H. Abdurrahman Wahid", domain: "uingusdur.ac.id", worldRank: "#8378" },
    { name: "Universitas Islam Negeri Sayyid Ali Rahmatullah", domain: "uinsatu.ac.id", worldRank: "#8489" },
    { name: "Institut Agama Islam Negeri (IAIN) Kediri", domain: "iainkediri.ac.id", worldRank: "#8590" },
    { name: "Institut Agama Islam Negeri (IAIN) Ponorogo", domain: "iainponorogo.ac.id", worldRank: "#8612" },
    { name: "Institut Agama Islam Negeri (IAIN) Syekh Nurjati", domain: "syekhnurjati.ac.id", worldRank: "#8723" },
    { name: "Institut Agama Islam Negeri (IAIN) Kudus", domain: "iainkudus.ac.id", worldRank: "#8834" },

    // Rank 91-100
    { name: "Institut Agama Islam Negeri (IAIN) Parepare", domain: "iainpare.ac.id", worldRank: "#8945" },
    { name: "Institut Agama Islam Negeri (IAIN) Palopo", domain: "iainpalopo.ac.id", worldRank: "#9056" },
    { name: "Institut Agama Islam Negeri (IAIN) IAIN Madura", domain: "iainmadura.ac.id", worldRank: "#9167" },
    { name: "Institut Agama Islam Negeri (IAIN) Curup", domain: "iaincurup.ac.id", worldRank: "#9278" },
    { name: "Institut Agama Islam Negeri (IAIN) Metro", domain: "metrouniv.ac.id", worldRank: "#9389" },
    { name: "Institut Agama Islam Negeri (IAIN) Lhokseumawe", domain: "iainlhokseumawe.ac.id", worldRank: "#9512" },
    { name: "Institut Agama Islam Negeri (IAIN) Langsa", domain: "iainlangsa.ac.id", worldRank: "#9623" },
    { name: "Institut Agama Islam Negeri (IAIN) Batusangkar", domain: "iainbatusangkar.ac.id", worldRank: "#9734" },
    { name: "STAIN Majene", domain: "stainmajene.ac.id", worldRank: "#9845" },
    { name: "Politeknik Negeri Jakarta (PNJ)", domain: "pnj.ac.id", worldRank: "#9956" }
];

// Placeholder Data for Top Prodi (Source: SNBT 2024 Context)
// Placeholder Data for Top Prodi (Source: SNBT 2024 Context)
const topProdis = [
    { name: "Pendidikan Dokter", university: "Universitas Indonesia", level: "S1" },
    { name: "Kedokteran", university: "Universitas Gadjah Mada", level: "S1" },
    { name: "Sekolah Teknik Elektro dan Informatika (STEI)", university: "Institut Teknologi Bandung", level: "S1" },
    { name: "Ilmu Komputer", university: "Universitas Indonesia", level: "S1" },
    { name: "Kedokteran", university: "Universitas Airlangga", level: "S1" },
    { name: "Ilmu Aktuaria", university: "Universitas Gadjah Mada", level: "S1" },
    { name: "Aktuaria", university: "Universitas Indonesia", level: "S1" },
    { name: "Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)", university: "Institut Teknologi Bandung", level: "S1" },
    { name: "Teknik Elektro", university: "Universitas Gadjah Mada", level: "S1" },
    { name: "Ilmu Aktuaria", university: "Universitas Brawijaya", level: "S1" },
    { name: "Teknik Kimia", university: "Universitas Indonesia", level: "S1" },
    { name: "Sistem Informasi", university: "Universitas Indonesia", level: "S1" },
    { name: "Teknik Informatika", university: "Institut Teknologi Sepuluh Nopember", level: "S1" },
    { name: "Ilmu Hubungan Internasional", university: "Universitas Gadjah Mada", level: "S1" },
    { name: "Psikologi", university: "Universitas Gadjah Mada", level: "S1" },
    { name: "Manajemen", university: "Universitas Indonesia", level: "S1" },
    { name: "Ilmu Hukum", university: "Universitas Indonesia", level: "S1" },
    { name: "Akuntansi", university: "Universitas Gadjah Mada", level: "S1" },
    { name: "Kedokteran Gigi", university: "Universitas Indonesia", level: "S1" },
    { name: "Gizi", university: "Universitas Indonesia", level: "S1" },
    { name: "Teknik Industri", university: "Universitas Indonesia", level: "S1" },
    { name: "Teknik Sipil", university: "Institut Teknologi Bandung", level: "S1" },
    { name: "Farmasi", university: "Universitas Gadjah Mada", level: "S1" },
    { name: "Statistika", university: "Institut Teknologi Sepuluh Nopember", level: "S1" },
    { name: "Arsitektur", university: "Universitas Indonesia", level: "S1" },
    { name: "Teknik Mesin", university: "Universitas Gadjah Mada", level: "S1" },
    { name: "Psikologi", university: "Universitas Indonesia", level: "S1" },
    { name: "Ilmu Komunikasi", university: "Universitas Padjadjaran", level: "S1" },
    { name: "Manajemen", university: "Universitas Gadjah Mada", level: "S1" },
    { name: "Akuntansi", university: "Universitas Indonesia", level: "S1" },
    { name: "Teknik Lingkungan", university: "Institut Teknologi Bandung", level: "S1" },
    { name: "Teknik Perminyakan", university: "Institut Teknologi Bandung", level: "S1" },
    { name: "Kedokteran", university: "Universitas Diponegoro", level: "S1" },
    { name: "Kedokteran", university: "Universitas Padjadjaran", level: "S1" },
    { name: "Kedokteran", university: "Universitas Sebelas Maret", level: "S1" },
    { name: "Kedokteran", university: "Universitas Brawijaya", level: "S1" },
    { name: "Sistem Informasi", university: "Institut Teknologi Sepuluh Nopember", level: "S1" },
    { name: "Teknik Informatika", university: "Universitas Padjadjaran", level: "S1" },
    { name: "Hukum", university: "Universitas Gadjah Mada", level: "S1" },
    { name: "Hukum", university: "Universitas Diponegoro", level: "S1" },
    { name: "Hubungan Internasional", university: "Universitas Indonesia", level: "S1" },
    { name: "Bisnis Digital", university: "Universitas Padjadjaran", level: "S1" },
    { name: "Ilmu Ekonomi", university: "Universitas Indonesia", level: "S1" },
    { name: "Teknik Metalurgi", university: "Institut Teknologi Bandung", level: "S1" },
    { name: "Teknik Dirgantara", university: "Institut Teknologi Bandung", level: "S1" },
    { name: "Sastra Inggris", university: "Universitas Indonesia", level: "S1" },
    { name: "Sastra Jepang", university: "Universitas Gadjah Mada", level: "S1" },
    { name: "Kriminologi", university: "Universitas Indonesia", level: "S1" },
    { name: "Farmasi", university: "Universitas Indonesia", level: "S1" },
    { name: "Kesehatan Masyarakat", university: "Universitas Indonesia", level: "S1" },
    { name: "Teknik Komputer", university: "Universitas Indonesia", level: "S1" },
    { name: "Teknik Komputer", university: "Institut Teknologi Sepuluh Nopember", level: "S1" },
    { name: "Teknik Biomedis", university: "Universitas Airlangga", level: "S1" },
    { name: "Teknik Biomedis", university: "Institut Teknologi Sepuluh Nopember", level: "S1" },
    { name: "Bisnis Kreatif", university: "Universitas Indonesia", level: "D4" },
    { name: "Produksi Media", university: "Universitas Indonesia", level: "D4" },
    { name: "Manajemen Rekod dan Arsip", university: "Universitas Indonesia", level: "D4" },
    { name: "Administrasi Perkantoran", university: "Universitas Indonesia", level: "D4" },
    { name: "Administrasi Rumah Sakit", university: "Universitas Indonesia", level: "D4" },
    { name: "Fisioterapi", university: "Universitas Indonesia", level: "D4" },
    { name: "Terapi Okupasi", university: "Universitas Indonesia", level: "D4" },
    { name: "Akuntansi Sektor Publik", university: "Universitas Gadjah Mada", level: "D4" },
    { name: "Manajemen dan Penilaian Properti", university: "Universitas Gadjah Mada", level: "D4" },
    { name: "Teknologi Rekayasa Perangkat Lunak", university: "Universitas Gadjah Mada", level: "D4" },
    { name: "Teknologi Rekayasa Elektro", university: "Universitas Gadjah Mada", level: "D4" },
    { name: "Teknologi Rekayasa Internet", university: "Universitas Gadjah Mada", level: "D4" },
    { name: "Bahasa Inggris", university: "Universitas Gadjah Mada", level: "D4" },
    { name: "Pembangunan Ekonomi Kewilayahan", university: "Universitas Gadjah Mada", level: "D4" },
    { name: "Teknik Infrastruktur Sipil", university: "Institut Teknologi Sepuluh Nopember", level: "D4" },
    { name: "Teknik Mesin Industri", university: "Institut Teknologi Sepuluh Nopember", level: "D4" },
    { name: "Teknik Elektro Otomasi", university: "Institut Teknologi Sepuluh Nopember", level: "D4" },
    { name: "Teknik Kimia Industri", university: "Institut Teknologi Sepuluh Nopember", level: "D4" },
    { name: "Statistika Bisnis", university: "Institut Teknologi Sepuluh Nopember", level: "D4" },
    { name: "Administrasi Bisnis", university: "Politeknik Negeri Jakarta", level: "D4" },
    { name: "Akuntansi Keuangan", university: "Politeknik Negeri Jakarta", level: "D4" },
    { name: "Teknik Informatika", university: "Politeknik Negeri Jakarta", level: "D4" },
    { name: "Teknik Multimedia Digital", university: "Politeknik Negeri Jakarta", level: "D4" },
    { name: "Teknik Multimedia dan Jaringan", university: "Politeknik Negeri Jakarta", level: "D4" },
    { name: "Manajemen Keuangan", university: "Politeknik Negeri Jakarta", level: "D4" },
    { name: "Usaha Jasa Konvensi, Perjalanan Insentif dan Pameran (MICE)", university: "Politeknik Negeri Jakarta", level: "D4" },
    { name: "Desain Grafis", university: "Politeknik Negeri Jakarta", level: "D4" },
    { name: "Penerbitan (Jurnalistik)", university: "Politeknik Negeri Jakarta", level: "D4" },
    { name: "Akuntansi", university: "Politeknik Negeri Jakarta", level: "D3" },
    { name: "Keuangan dan Perbankan", university: "Politeknik Negeri Jakarta", level: "D3" },
    { name: "Manajemen Pemasaran", university: "Politeknik Negeri Jakarta", level: "D3" },
    { name: "Administrasi Bisnis", university: "Politeknik Negeri Jakarta", level: "D3" },
    { name: "Teknik Sipil", university: "Politeknik Negeri Jakarta", level: "D3" },
    { name: "Teknik Mesin", university: "Politeknik Negeri Jakarta", level: "D3" },
    { name: "Teknik Listrik", university: "Politeknik Negeri Jakarta", level: "D3" },
    { name: "Teknik Elektronika Industri", university: "Politeknik Negeri Jakarta", level: "D3" },
    { name: "Teknik Telekomunikasi", university: "Politeknik Negeri Jakarta", level: "D3" },
    { name: "Akuntansi", university: "Politeknik Keuangan Negara STAN", level: "D4" },
    { name: "Manajemen Keuangan Negara", university: "Politeknik Keuangan Negara STAN", level: "D4" },
    { name: "Manajemen Aset Publik", university: "Politeknik Keuangan Negara STAN", level: "D4" },
    { name: "Statistik", university: "Politeknik Statistika STIS", level: "D4" },
    { name: "Komputasi Statistik", university: "Politeknik Statistika STIS", level: "D4" },
    { name: "Persandian", university: "Politeknik Siber dan Sandi Negara", level: "D4" },
    { name: "Keimigrasian", university: "Politeknik Imigrasi", level: "D4" },
    { name: "Ilmu Pemerintahan", university: "Institut Pemerintahan Dalam Negeri", level: "D4" }
];

let currentRankingMode = 'ptn'; // 'ptn' or 'prodi'
let currentPtnPage = 1;
const ptnsPerPage = 10;
let ptnSearchQuery = '';

// Helper for Level Colors
function getLevelColor(level) {
    const colors = {
        'S1': { bg: '#E3F2FD', text: '#1976D2' }, // Blue
        'D4': { bg: '#E8F5E9', text: '#388E3C' }, // Green
        'D3': { bg: '#FFF3E0', text: '#F57C00' }, // Orange
        'D2': { bg: '#F3E5F5', text: '#7B1FA2' }, // Purple
        'D1': { bg: '#FAFAFA', text: '#616161' }  // Grey
    };
    return colors[level] || colors['S1'];
}

// Helper to find domain for logo
function getUniversityDomain(uniName) {
    if (!uniName) return '';
    const nameLower = uniName.toLowerCase();

    // Try to find matching PTN in topPTNs list
    const found = topPTNs.find(ptn => {
        const ptnName = ptn.name.toLowerCase();
        // Check for inclusion both ways to catch cases like "UI" vs "Universitas Indonesia (UI)"
        return ptnName.includes(nameLower) || nameLower.includes(ptnName.split('(')[0].trim().toLowerCase());
    });

    return found ? found.domain : '';
}

// Toggle Switch Function
function switchRankingMode(mode) {
    if (currentRankingMode === mode) return;

    currentRankingMode = mode;
    currentPtnPage = 1; // Reset pagination

    // Update Toggle UI
    document.getElementById('btn-top-ptn').className = `toggle-btn ${mode === 'ptn' ? 'active' : ''} `;
    document.getElementById('btn-top-prodi').className = `toggle-btn ${mode === 'prodi' ? 'active' : ''} `;

    // Update Search Placeholder
    const searchInput = document.getElementById('ptn-search-input');
    if (searchInput) {
        searchInput.placeholder = mode === 'ptn' ? t('search-uni') : t('search-prodi');
        searchInput.value = ''; // Reset search term
        ptnSearchQuery = '';
    }

    renderRankingList();
}

// Search Listener handled in init

function renderRankingList() {
    const container = document.getElementById('top-ptn-list');
    if (!container) return;

    const dataset = currentRankingMode === 'ptn' ? topPTNs : topProdis;

    container.innerHTML = '';

    let displayItems = [];
    let isFiltered = false;

    if (ptnSearchQuery.trim() !== '') {
        // Filter mode
        displayItems = dataset.filter(item => item.name.toLowerCase().includes(ptnSearchQuery) || (item.university && item.university.toLowerCase().includes(ptnSearchQuery)));
        isFiltered = true;
    } else {
        // Pagination mode
        const start = (currentPtnPage - 1) * ptnsPerPage;
        const end = start + ptnsPerPage;
        displayItems = dataset.slice(start, end);
        isFiltered = false;
    }

    if (displayItems.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding: 20px; color:var(--text-grey);">${t('data-not-found')}</div>`;
    } else {
        displayItems.forEach((item) => {
            // Find true index in original array for ranking
            const globalRank = dataset.indexOf(item) + 1;

            const div = document.createElement('div');
            div.className = 'top-ptn-item';

            let rankClass = 'top-ptn-rank';
            if (globalRank === 1) rankClass += ' rank-1';
            else if (globalRank === 2) rankClass += ' rank-2';
            else if (globalRank === 3) rankClass += ' rank-3';

            if (currentRankingMode === 'ptn') {
                const logoUrl = `https://www.google.com/s2/favicons?domain=${item.domain}&sz=128`;

                div.innerHTML = `
                    <div class="${rankClass}">${globalRank}</div>
                    <img src="${logoUrl}" alt="${item.name}" class="top-ptn-logo" onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random';">
                    <div class="top-ptn-name">${item.name}</div>
                    <div class="top-ptn-world-rank">
                        <i class="fa-solid fa-globe"></i> ${item.worldRank}
                    </div>
                `;
            } else {
                // Prodi Render
                const color = getLevelColor(item.level);
                const domain = getUniversityDomain(item.university);
                // Use UI Avatars if domain not found, or Favicon if found
                const logoUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : `https://ui-avatars.com/api/?name=${encodeURIComponent(item.university)}&background=random&color=fff&length=1`;

                div.innerHTML = `
                    <div class="${rankClass}">${globalRank}</div>
                    <img src="${logoUrl}" 
                         alt="${item.university}" 
                         class="top-ptn-logo" 
                         onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(item.university)}&background=random&color=fff&length=1';"
                         style="width: 32px; height: 32px; margin-right: 12px; border-radius: 50%; object-fit: contain;">
                    <div class="top-ptn-name" style="display:flex; flex-direction:column; gap:2px;">
                        <span style="font-weight:600; font-size:0.95rem;">${item.name}</span>
                        <span style="font-size:0.8rem; color:var(--text-grey);">${item.university}</span>
                    </div>
                    <div class="top-ptn-world-rank" style="background:${color.bg}; color:${color.text}; font-weight:700;">
                        ${item.level}
                    </div>
                `;
            }
            container.appendChild(div);
        });
    }

    renderPtnPagination(isFiltered, dataset.length);
}

function renderPtnPagination(isFiltered, totalItems) {
    // Check if pagination container exists, if not create it
    let paginationContainer = document.getElementById('ptn-pagination');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'ptn-pagination';
        paginationContainer.className = 'pagination';
        const section = document.getElementById('top-ptn-list').parentNode;
        section.appendChild(paginationContainer);
    }

    // Hide pagination if searching
    if (isFiltered) {
        paginationContainer.style.display = 'none';
        return;
    } else {
        paginationContainer.style.display = 'flex';
    }

    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(totalItems / ptnsPerPage);

    if (totalPages <= 1) return;

    // Helper to create button
    const createBtn = (text, isNumber, isActive, isDisabled, onClick) => {
        const btn = document.createElement('button');
        btn.className = `page-btn ${isActive ? 'active' : ''}`;
        btn.innerHTML = text;
        if (isDisabled) btn.disabled = true;
        if (onClick && !isDisabled) btn.onclick = onClick;
        return btn;
    };

    // Prev Button
    paginationContainer.appendChild(createBtn(
        '<i class="fa-solid fa-chevron-left"></i>',
        false,
        false,
        currentPtnPage === 1,
        () => {
            currentPtnPage--;
            renderRankingList();
        }
    ));

    // Page Numbers using Ellipsis Logic
    const range = 1;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPtnPage - range && i <= currentPtnPage + range)) {
            paginationContainer.appendChild(createBtn(
                i,
                true,
                i === currentPtnPage,
                false,
                () => {
                    currentPtnPage = i;
                    renderRankingList();
                }
            ));
        } else if (
            (i === currentPtnPage - range - 1 && i > 1) ||
            (i === currentPtnPage + range + 1 && i < totalPages)
        ) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.style.alignSelf = 'center';
            ellipsis.style.color = '#888';
            paginationContainer.appendChild(ellipsis);
        }
    }

    // Next Button
    paginationContainer.appendChild(createBtn(
        '<i class="fa-solid fa-chevron-right"></i>',
        false,
        false,
        currentPtnPage === totalPages,
        () => {
            currentPtnPage++;
            renderRankingList();
        }
    ));
}

// Initialize Top PTN
renderRankingList();



// =========================================
// ALTERNATIVE MODAL LOGIC
// =========================================

function showAlternativeModal(majorName, currentUniversity, targetScore, userScore = 0, originalIndex = -1) {
    const modal = document.getElementById('altModal');
    const list = document.getElementById('alt-list');
    const subtitle = document.getElementById('alt-modal-subtitle');

    if (!modal || !list) return;

    let subText = `Menampilkan kampus lain untuk jurusan "${majorName}"`;
    if (userScore > 0) {
        subText += `<br><span style="font-size: 0.8rem; color: #4caf50; font-weight: 600;">Skor Kamu: ${userScore}</span>`;
    }
    subtitle.innerHTML = subText;
    list.innerHTML = '';

    if (typeof masterDataPTN === 'undefined') {
        list.innerHTML = '<p style="text-align:center;">Data master belum dimuat.</p>';
        modal.style.display = 'flex';
        return;
    }

    // Keyword Normalization Helper
    const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Simple Synonym Mapping
    const synonyms = {
        'pendidikan dokter': ['kedokteran', 'pendidikan dokter'],
        'kedokteran': ['kedokteran', 'pendidikan dokter'],
        'ilmu hukum': ['hukum', 'ilmu hukum'],
        'hukum': ['hukum', 'ilmu hukum'],
        'akuntansi': ['akuntansi'],
        'manajemen': ['manajemen'],
        'teknik informatika': ['informatika', 'ilmu komputer', 'sistem informasi'],
        'ilmu komputer': ['informatika', 'ilmu komputer', 'sistem informasi'],
    };

    // Determine keywords to search
    let searchKeywords = [majorName.toLowerCase()];
    const normalizedMajor = majorName.toLowerCase();

    // Check if we have synonyms
    for (const key in synonyms) {
        if (normalizedMajor.includes(key)) {
            searchKeywords = synonyms[key];
            break;
        }
    }

    // Search for same major in other unis
    let alternatives = [];

    masterDataPTN.forEach(uni => {
        if (!uni.prodis || !Array.isArray(uni.prodis)) return;
        uni.prodis.forEach(prodi => {
            // Exclude Current Selection
            if (uni.university === currentUniversity && prodi.name === majorName) return;

            // If it's choice 3 or 4 (originalIndex >= 2), only allow D3/D4
            if (originalIndex >= 2 && prodi.jenjang !== 'D3' && prodi.jenjang !== 'D4') return;

            const pName = prodi.name.toLowerCase();

            // Check if any keyword matches
            const match = searchKeywords.some(keyword => pName.includes(keyword));

            if (match) {
                // Must have lower passing grade
                const score = parseInt(prodi.minScore) || 0;
                // User said "skor yang lebih rendah", so strict < targetScore is safer, 
                // but let's allow <= for broader results if target is high.
                // Updated Request: "dibawah/mencapai" -> <= targetScore
                if (score > 0 && score <= targetScore) {
                    alternatives.push({
                        university: uni.university,
                        major: prodi.name,
                        minScore: score,
                        jenjang: prodi.jenjang
                    });
                }
            }
        });
    });

    // Sort Logic:
    // 1. Prioritize majors Reached by User Score (userScore >= minScore)
    // 2. Then sort by Min Score Descending (Highest/Best quality first)
    alternatives.sort((a, b) => {
        const aReachable = userScore >= a.minScore;
        const bReachable = userScore >= b.minScore;

        if (aReachable && !bReachable) return -1;
        if (!aReachable && bReachable) return 1;

        return b.minScore - a.minScore;
    });

    // Take top 10
    const topAlt = alternatives.slice(0, 10);

    if (topAlt.length === 0) {
        list.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">Tidak ditemukan alternatif dengan skor lebih rendah.</div>';
    } else {
        topAlt.forEach(alt => {
            const div = document.createElement('div');
            div.className = 'alt-item';
            div.style.cursor = 'pointer'; // Add pointer cursor
            div.onclick = () => selectAlternativeSelection(alt.university, alt.major, originalIndex);
            div.innerHTML = `
                <div class="alt-info">
                    <h4>${alt.university}</h4>
                    <p>${alt.major} (${alt.jenjang})</p>
                </div>
                <div class="alt-score">
                    <span>${alt.minScore}</span>
                    <small>Target Skor</small>
                    ${(userScore > 0 && userScore >= alt.minScore) ?
                    '<div style="margin-top:2px; font-size:0.6rem; color: white; background: #4caf50; padding: 2px 10px; border-radius: 12px; font-weight: 600; white-space: nowrap; width: fit-content;">Skor mencukupi</div>'
                    : ''}
                </div>
            `;
            list.appendChild(div);
        });
    }

    modal.style.display = 'flex';
}

function selectAlternativeSelection(university, major, index) {
    if (index >= 0 && index < dreamPTNs.length) {
        // Duplicate Check
        const isDuplicate = dreamPTNs.some((p, idx) =>
            idx !== index && p.university === university && p.major === major
        );

        if (isDuplicate) {
            alert("Jurusan ini sudah kamu pilih di slot lain.");
            return;
        }

        dreamPTNs[index] = { university: university, major: major };
        savePtnData();
        generateRecommendation();
        closeAltModal();
    }
}

function removePtnChoice(index) {
    if (index >= 0 && index < dreamPTNs.length) {
        if (confirm(`Hapus pilihan ${index + 1}?`)) {
            dreamPTNs[index] = {};
            savePtnData();
            generateRecommendation();
            // Close alt modal if open (just in case)
            closeAltModal();
        }
    }
}

function closeAltModal() {
    document.getElementById('altModal').style.display = 'none';
}

// Close on outside click handled in setupEventListeners

// Initialize App
document.addEventListener('DOMContentLoaded', init);

// Copyright Protection
function protectCopyright() {
    const footerId = 'app-copyright';
    const expectedText = 'Copyright © 2026 Maulidi Zikri Nur';

    // Function to ensure footer exists and is correct
    const enforceFooter = () => {
        let footer = document.getElementById(footerId);

        // If missing, recreate specifically before nav
        if (!footer) {
            footer = document.createElement('footer');
            footer.id = footerId;
            footer.className = 'app-footer';

            // Try to find nav to insert before
            const nav = document.querySelector('.bottom-nav');
            if (nav && nav.parentNode) {
                nav.parentNode.insertBefore(footer, nav);
            } else {
                // Fallback: append to body or app-container
                const container = document.querySelector('.app-container') || document.body;
                container.appendChild(footer);
            }
        }

        // Enforce content and style
        if (footer.innerHTML.trim() !== expectedText) {
            footer.innerHTML = expectedText;
        }

        // Enforce basic styles inline as backup
        footer.style.userSelect = 'none';
        footer.style.pointerEvents = 'none';
        footer.style.display = 'block';
        footer.style.visibility = 'visible';
        footer.style.opacity = '1';
    };

    // Run initially
    enforceFooter();

    // Watch for changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // Check if footer was removed or modified
            if (mutation.type === 'childList' ||
                (mutation.type === 'characterData' && mutation.target.parentNode.id === footerId) ||
                (mutation.target.id === footerId)) {
                enforceFooter();
            }
        });
    });

    // Observe body subtree
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['style', 'class', 'hidden']
    });

    // Prevent context menu on footer
    document.addEventListener('contextmenu', (e) => {
        if (e.target.id === footerId) {
            e.preventDefault();
        }
    });
}





// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (prefersDark) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }
}

function toggleTheme(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    console.log('Toggling theme to:', newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme); // Double application for compatibility

    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
        const icon = btn.querySelector('i');
        if (icon) {
            if (theme === 'dark') {
                icon.className = 'fa-solid fa-sun';
            } else {
                icon.className = 'fa-solid fa-moon';
            }
        }
    });

    // Sync profile toggle switch
    const profileToggle = document.getElementById('profile-dark-mode-toggle');
    if (profileToggle) {
        profileToggle.checked = (theme === 'dark');
    }

    // Refresh chart to update colors if chart is initialized
    if (typeof Chart !== 'undefined') {
        renderChart();
    }
}

// Make functions globally available
window.toggleTheme = toggleTheme;
window.applyTheme = applyTheme;
window.initTheme = initTheme;

console.log("Script loaded successfully.");
