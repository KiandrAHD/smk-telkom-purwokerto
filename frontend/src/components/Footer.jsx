import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, ChevronRight } from 'lucide-react';

const footerLinks = [
  {
    title: 'Navigasi',
    links: [
      { name: 'Tentang', href: '#tentang' },
      { name: 'Jurusan', href: '#jurusan' },
      { name: 'Prestasi', href: '#prestasi' },
      { name: 'BKK', href: '#bkk' },
      { name: 'Berita', href: '#berita' },
      { name: 'PPDB', href: '#ppdb' },
    ],
  },
  {
    title: 'Program',
    links: [
      { name: 'RPL', href: '#' },
      { name: 'TKJ', href: '#' },
      { name: 'Multimedia', href: '#' },
      { name: 'Sistem Informasi', href: '#' },
    ],
  },
  {
    title: 'Layanan',
    links: [
      { name: 'STELA AI', href: '#stela' },
      { name: 'BKK', href: '#bkk' },
      { name: 'Perpustakaan', href: '#' },
      { name: 'E-Learning', href: '#' },
    ],
  },
];

const socialLinks = [
  { name: 'Instagram', href: '#', icon: '📸' },
  { name: 'YouTube', href: '#', icon: '▶️' },
  { name: 'Facebook', href: '#', icon: '📘' },
  { name: 'TikTok', href: '#', icon: '🎵' },
];

export default function Footer() {
  return (
    <footer className="relative bg-dark-950 border-t border-dark-800">
      {/* Top decorative gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-500 to-primary" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-heading font-bold text-lg">SMK</span>
                </div>
                <div>
                  <p className="font-heading font-bold text-lg text-white">SMK Telkom</p>
                  <p className="text-gray-400 text-sm">Purwokerto</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-sm">
                SMK Telkom Purwokerto adalah sekolah menengah kejuruan berbasis
                Teknologi Informasi dan Komunikasi yang telah berdiri sejak tahun 2000.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-dark-800 hover:bg-primary rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 group"
                    aria-label={social.name}
                  >
                    <span className="text-sm group-hover:scale-110 transition-transform">
                      {social.icon}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            {footerLinks.map((column) => (
              <div key={column.title} className="lg:col-span-2">
                <h3 className="font-heading font-bold text-white text-sm mb-4 uppercase tracking-wider">
                  {column.title}
                </h3>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-primary transition-colors duration-200 text-sm flex items-center gap-1 group"
                      >
                        <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact & Map Column */}
            <div className="lg:col-span-4">
              <h3 className="font-heading font-bold text-white text-sm mb-4 uppercase tracking-wider">
                Kontak & Lokasi
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Alamat</p>
                    <p className="text-gray-400 text-sm">
                      Jl. DI Panjaitan No. 127, Purwokerto, Jawa Tengah
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Telepon</p>
                    <p className="text-gray-400 text-sm">(0281) 123456</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Email</p>
                    <p className="text-gray-400 text-sm">info@smktelkom-pwt.sch.id</p>
                  </div>
                </div>
              </div>

              {/* Google Maps Placeholder */}
              <div className="rounded-xl overflow-hidden border border-dark-800">
                <div className="aspect-[16/9] bg-dark-800 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-gray-400 text-xs">Google Maps</p>
                    <p className="text-gray-500 text-xs mt-1">SMK Telkom Purwokerto</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-dark-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center sm:text-left">
              &copy; {new Date().getFullYear()} SMK Telkom Purwokerto. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                Kebijakan Privasi
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                Syarat & Ketentuan
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}