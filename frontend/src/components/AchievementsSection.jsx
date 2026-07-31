import SectionHeading from './SectionHeading';
import AchievementCard from './AchievementCard';

const achievements = [
  {
    title: 'Juara 1 Lomba Kompetensi Siswa (LKS) Tingkat Provinsi',
    category: 'Akademik',
    description: 'Siswa jurusan RPL berhasil meraih juara 1 dalam ajang LKS tingkat Provinsi Jawa Tengah.',
  },
  {
    title: 'Medali Emas Olimpiade Sains Nasional',
    category: 'Sains',
    description: 'Tim olimpiade sains SMK Telkom Purwokerto meraih medali emas di bidang Matematika.',
  },
  {
    title: 'Juara Umum Lomba Cipta Media Pembelajaran',
    category: 'Teknologi',
    description: 'Inovasi media pembelajaran berbasis AI karya siswa meraih juara umum tingkat nasional.',
  },
  {
    title: 'Peringkat 1 Sekolah Adiwiyata Tingkat Kota',
    category: 'Lingkungan',
    description: 'SMK Telkom Purwokerto meraih penghargaan sebagai sekolah peduli lingkungan terbaik.',
  },
];

export default function AchievementsSection() {
  return (
    <section id="prestasi" className="relative py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Prestasi"
          title="Prestasi Terkini"
          description="Berbagai prestasi membanggakan yang telah diraih oleh siswa-siswi SMK Telkom Purwokerto."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {achievements.map((achievement, i) => (
            <AchievementCard
              key={achievement.title}
              title={achievement.title}
              category={achievement.category}
              description={achievement.description}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}