import { aboutDescription } from '../../data/dummyData';

const TentangAboutSection = () => (
  <section id="profil" className="bg-white py-6 lg:py-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Dua kartu bertumpuk seperti di Figma: kartu belakang lebih lebar & naik sedikit */}
      <div className="relative">
        <div className="absolute inset-x-4 -top-3 bottom-8 rounded-3xl border border-dark-100 bg-white" />
        <div className="relative rounded-3xl border border-dark-100 bg-white p-6 shadow-card sm:p-8 lg:p-10">
          <h2 className="whitespace-pre-line font-heading text-2xl sm:text-3xl font-extrabold leading-tight text-primary">
            {aboutDescription.title}
          </h2>
          <p className="mt-5 max-w-3xl text-xs sm:text-sm leading-relaxed text-dark-600">
            {aboutDescription.text}
          </p>
          <a
            href="#perjalanan"
            className="mt-6 inline-flex items-center rounded-full border border-dark-200 bg-white px-6 py-2.5 text-xs font-semibold text-dark-700 transition-colors hover:border-primary hover:text-primary"
          >
            {aboutDescription.ctaText}
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default TentangAboutSection;
