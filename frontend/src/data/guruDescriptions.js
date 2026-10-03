// Penjelasan umum bidang pembelajaran, bukan klaim riwayat atau metode pribadi guru.
const descriptions = {
  'Guru Mapel Kejuruan 2': [
    ['Mapel Kejuruan 2 merupakan bagian pembelajaran kompetensi keahlian yang menghubungkan pemahaman konsep dengan penerapannya dalam pekerjaan bidang kejuruan.', 'Vocational Subject 2 connects an understanding of concepts with their application in vocational work.'],
    ['Pembelajaran kejuruan berkaitan dengan pemahaman prosedur kerja, penggunaan alat dan sumber belajar, serta penyelesaian tugas sesuai kebutuhan bidang keahlian.', 'Vocational learning covers work procedures, the use of tools and learning resources, and completing tasks relevant to the chosen field.'],
    ['Keterampilan yang mendukung bidang ini meliputi ketelitian, pemecahan masalah, kerja sama, dan tanggung jawab terhadap kualitas hasil pekerjaan.', 'Relevant skills include attention to detail, problem solving, teamwork and responsibility for the quality of work.'],
  ],
  'Guru Mapel Kejuruan 3': [
    ['Mapel Kejuruan 3 merupakan bagian pembelajaran kompetensi keahlian yang membantu siswa memahami hubungan antara pengetahuan, keterampilan, dan kebutuhan pekerjaan.', 'Vocational Subject 3 helps students understand the connection between knowledge, skills and workplace needs.'],
    ['Bidang kejuruan berkaitan dengan penerapan prosedur, pengelolaan tugas, dan pemeriksaan hasil kerja agar sesuai dengan tujuan serta kriteria yang ditetapkan.', 'Vocational work involves applying procedures, managing tasks and checking results against established goals and criteria.'],
    ['Keterampilan yang mendukungnya mencakup berpikir sistematis, komunikasi, dokumentasi pekerjaan, dan kemampuan mengevaluasi solusi.', 'Supporting skills include systematic thinking, communication, documenting work and evaluating solutions.'],
  ],
  'Matematika': [
    ['Matematika mempelajari pola, hubungan antarbesaran, dan cara menyelesaikan masalah melalui penalaran serta perhitungan yang terstruktur.', 'Mathematics studies patterns, relationships between quantities and ways to solve problems through structured reasoning and calculation.'],
    ['Bidang ini berkaitan dengan bilangan, aljabar, geometri, pengukuran, serta pengolahan data yang dapat digunakan untuk memahami persoalan sehari-hari dan kejuruan.', 'This field covers numbers, algebra, geometry, measurement and data analysis for understanding everyday and vocational problems.'],
    ['Keterampilan yang mendukungnya meliputi berpikir logis, membaca informasi kuantitatif, memilih strategi penyelesaian, dan memeriksa ketepatan hasil.', 'Supporting skills include logical thinking, interpreting quantitative information, choosing solution strategies and checking results.'],
  ],
  'Pembelajaran Agama Islam': [
    ['Pembelajaran Agama Islam membahas nilai keimanan, akhlak, dan tanggung jawab dalam kehidupan pribadi maupun bermasyarakat.', 'Islamic Religious Education explores faith, moral values and responsibility in personal and community life.'],
    ['Bidang ini berkaitan dengan pemahaman ajaran Islam, ibadah, sejarah, serta penerapan sikap jujur, peduli, dan saling menghormati.', 'This field covers Islamic teachings, worship, history and the application of honesty, care and mutual respect.'],
    ['Pembinaan kerohanian mendukung pemahaman nilai dan pembentukan karakter melalui refleksi serta kegiatan keagamaan di lingkungan sekolah.', 'Spiritual guidance supports an understanding of values and character development through reflection and religious activities at school.'],
  ],
  'Karakter': [
    ['Bidang Karakter berkaitan dengan pembentukan sikap dan kebiasaan yang mendukung kehidupan belajar serta hubungan dengan orang lain.', 'Character Development concerns attitudes and habits that support learning and relationships with others.'],
    ['Aspek yang berkaitan meliputi integritas, kedisiplinan, tanggung jawab, kepedulian, kerja sama, dan penghargaan terhadap aturan.', 'Relevant aspects include integrity, discipline, responsibility, care, teamwork and respect for rules.'],
    ['Informasi yang tersedia mencatat peran pada bidang Karakter. Mata pelajaran yang diampu masih [perlu konfirmasi].', 'Available information records a role in Character Development. The teaching subject remains [confirmation needed].'],
  ],
  'Informatika': [
    ['Informatika mempelajari cara mengolah informasi dan menyelesaikan masalah menggunakan pendekatan komputasi serta teknologi digital.', 'Informatics studies information processing and problem solving through computational approaches and digital technology.'],
    ['Bidang ini berkaitan dengan berpikir komputasional, algoritma, sistem komputer, data, serta penggunaan teknologi secara aman dan bertanggung jawab.', 'This field covers computational thinking, algorithms, computer systems, data and the safe, responsible use of technology.'],
    ['Keterampilan yang mendukungnya meliputi penalaran logis, pemecahan masalah, analisis informasi, dan komunikasi hasil kerja digital.', 'Supporting skills include logical reasoning, problem solving, information analysis and communicating digital work.'],
  ],
  'Bahasa Jawa': [
    ['Bahasa Jawa mempelajari penggunaan bahasa serta pemahaman sastra dan budaya Jawa dalam kehidupan sehari-hari.', 'Javanese Language explores language use and an understanding of Javanese literature and culture in everyday life.'],
    ['Bidang ini berkaitan dengan keterampilan menyimak, berbicara, membaca, dan menulis, termasuk pemilihan ragam bahasa sesuai konteks komunikasi.', 'This field covers listening, speaking, reading and writing, including choosing a language register appropriate to the communication context.'],
    ['Keterampilan yang mendukungnya meliputi komunikasi santun, pemahaman teks, dan apresiasi terhadap nilai budaya serta karya sastra daerah.', 'Supporting skills include respectful communication, text comprehension and appreciation of cultural values and regional literature.'],
  ],
  'Seni Budaya': [
    ['Seni Budaya mempelajari ekspresi kreatif dan pemahaman karya seni sebagai bagian dari kehidupan serta identitas budaya.', 'Arts and Culture explores creative expression and artistic works as part of life and cultural identity.'],
    ['Bidang ini berkaitan dengan apresiasi dan penciptaan karya, unsur seni, serta pengenalan beragam bentuk kesenian dan tradisi.', 'This field covers appreciating and creating works, artistic elements and different forms of art and tradition.'],
    ['Keterampilan yang mendukungnya meliputi kreativitas, kepekaan estetis, kerja sama, dan kemampuan menyampaikan gagasan melalui karya seni.', 'Supporting skills include creativity, aesthetic awareness, teamwork and expressing ideas through artistic works.'],
  ],
  'PJOK': [
    ['Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK) membahas aktivitas gerak, kebugaran, serta kebiasaan hidup sehat.', 'Physical Education, Sports and Health covers movement, fitness and healthy lifestyle habits.'],
    ['Bidang ini berkaitan dengan keterampilan gerak, aktivitas olahraga, pemahaman aturan permainan, serta keselamatan dalam beraktivitas.', 'This field covers movement skills, sports activities, understanding game rules and participating safely.'],
    ['Keterampilan yang mendukungnya meliputi koordinasi gerak, kedisiplinan, kerja sama, dan sportivitas dalam kegiatan individu maupun kelompok.', 'Supporting skills include movement coordination, discipline, teamwork and sportsmanship in individual and group activities.'],
  ],
  'Dasar Pengembangan Koding B': [
    ['Dasar Pengembangan Koding B membahas landasan berpikir dan penyusunan instruksi untuk menyelesaikan masalah melalui program komputer.', 'Coding Development Fundamentals B covers the foundations of reasoning and writing instructions to solve problems through computer programs.'],
    ['Bidang ini berkaitan dengan logika, algoritma, struktur program, dan pemeriksaan kesalahan agar instruksi dapat berjalan sesuai tujuan.', 'This field covers logic, algorithms, program structure and checking errors so that instructions work as intended.'],
    ['Keterampilan yang mendukungnya meliputi berpikir terstruktur, ketelitian, pemecahan masalah, dan kemampuan menjelaskan langkah penyelesaian.', 'Supporting skills include structured thinking, attention to detail, problem solving and explaining solution steps.'],
  ],
  'PIPAS': [
    ['Projek Ilmu Pengetahuan Alam dan Sosial (PIPAS) menghubungkan pemahaman gejala alam dengan kehidupan sosial melalui kajian masalah di sekitar siswa.', 'The Natural and Social Sciences Project connects an understanding of natural phenomena with social life by studying problems in students’ surroundings.'],
    ['Bidang ini berkaitan dengan pengamatan, pengumpulan informasi, analisis hubungan sebab-akibat, dan penyusunan gagasan berdasarkan bukti.', 'This field covers observation, information gathering, analysing cause and effect, and developing ideas based on evidence.'],
    ['Keterampilan yang mendukungnya meliputi rasa ingin tahu, berpikir kritis, kerja sama, dan penyampaian hasil kajian secara jelas.', 'Supporting skills include curiosity, critical thinking, teamwork and presenting findings clearly.'],
  ],
  'Bahasa Inggris': [
    ['Bahasa Inggris mempelajari keterampilan berkomunikasi untuk memahami dan menyampaikan informasi dalam beragam konteks.', 'English develops communication skills for understanding and conveying information in different contexts.'],
    ['Bidang ini berkaitan dengan menyimak, berbicara, membaca, dan menulis, disertai pemahaman kosakata serta struktur bahasa.', 'This field covers listening, speaking, reading and writing, alongside vocabulary and language structure.'],
    ['Keterampilan yang mendukungnya meliputi pemahaman teks, penyampaian gagasan, dan penggunaan bahasa sesuai tujuan komunikasi sehari-hari maupun kejuruan.', 'Supporting skills include text comprehension, expressing ideas and using language appropriately in everyday and vocational communication.'],
  ],
  'Kreativitas, Inovasi, dan Kewirausahaan': [
    ['Kreativitas, Inovasi, dan Kewirausahaan membahas pengembangan gagasan menjadi solusi atau peluang usaha yang memiliki nilai bagi pengguna.', 'Creativity, Innovation and Entrepreneurship explores turning ideas into solutions or business opportunities that offer value to users.'],
    ['Bidang ini berkaitan dengan pengenalan kebutuhan, perencanaan produk atau layanan, pemanfaatan sumber daya, dan penilaian kelayakan gagasan.', 'This field covers identifying needs, planning products or services, using resources and assessing the feasibility of ideas.'],
    ['Keterampilan yang mendukungnya meliputi kreativitas, pemecahan masalah, komunikasi, kerja sama, dan pengambilan keputusan yang bertanggung jawab.', 'Supporting skills include creativity, problem solving, communication, teamwork and responsible decision making.'],
  ],
};

export const guruDescriptions = Object.fromEntries(
  Object.entries(descriptions).map(([subject, paragraphs]) => [subject, paragraphs.map(([id]) => id)]),
);
export const guruDescriptionTranslations = Object.fromEntries(
  Object.values(descriptions).flat(),
);
