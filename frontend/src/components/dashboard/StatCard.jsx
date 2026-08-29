import {
  BadgeCheck,
  Briefcase,
  Building2,
  Clock,
  GraduationCap,
  UserPlus,
  Users,
  UserCheck,
} from 'lucide-react';

const IKON = {
  ppdb: GraduationCap,
  baru: UserPlus,
  verifikasi: BadgeCheck,
  tunggu: Clock,
  lowongan: Briefcase,
  mitra: Building2,
  terserap: UserCheck,
  alumni: Users,
};

const NADA = {
  merah: 'bg-primary',
  biru: 'bg-blue-600',
  hijau: 'bg-green-600',
  oranye: 'bg-orange-500',
  ungu: 'bg-purple-600',
};

// Kartu ringkasan angka di atas tabel. Dipakai ulang di halaman PPDB, BKK, dan
// Dashboard supaya bentuk dan jaraknya tidak berbeda-beda antar halaman.
const StatCard = ({ label, value, nada = 'merah', icon }) => {
  const Ikon = IKON[icon];

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-dark-100 bg-white px-5 py-5 shadow-card transition-shadow hover:shadow-lg">
      <span
        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-white ${
          NADA[nada] ?? NADA.merah
        }`}
      >
        {Ikon && <Ikon className="h-5 w-5" />}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] text-dark-500">{label}</p>
        <p className="mt-0.5 font-heading text-2xl font-extrabold leading-none text-dark-900">
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
