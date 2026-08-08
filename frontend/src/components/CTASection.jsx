import { ArrowRight, GraduationCap } from 'lucide-react';
import { ctaBanner } from '../data/dummyData';

const CTASection = () => (
  <section id="ppdb" className="bg-white pb-8 lg:pb-12">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-5 rounded-2xl bg-primary px-6 py-6 text-center sm:flex-row sm:justify-between sm:px-10 sm:text-left">
        <div className="flex items-center gap-4">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
            <GraduationCap className="h-5 w-5 text-white" />
          </span>
          <div>
            <h2 className="font-heading text-lg sm:text-xl font-extrabold text-white">
              {ctaBanner.title}
            </h2>
            <p className="mt-1 max-w-md text-[11px] leading-relaxed text-white/85">
              {ctaBanner.description}
            </p>
          </div>
        </div>

        <a
          href={ctaBanner.href}
          className="inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold text-primary transition-colors hover:bg-primary-50"
        >
          {ctaBanner.ctaText}
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  </section>
);

export default CTASection;
