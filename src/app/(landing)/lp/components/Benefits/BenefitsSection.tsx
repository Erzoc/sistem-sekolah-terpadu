import React from 'react';

/**
 * BenefitsSection - Showcase 4 key benefits
 * 
 * Design pattern: Icon + Headline + Description cards
 * Layout: 1 col mobile, 2 cols tablet, 4 cols desktop
 */

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

export default function BenefitsSection() {
  const benefits: Benefit[] = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Hemat 10 Jam/Minggu',
      description: 'RPP selesai dalam 5 menit, bukan 2 jam. Lebih banyak waktu untuk mempersiapkan pembelajaran berkualitas.',
      color: 'emerald',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Kurikulum Merdeka Resmi',
      description: 'Template sesuai standar Kemendikbud terbaru. Tidak perlu khawatir soal compliance dan format.',
      color: 'teal',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      title: 'RPP Unlimited',
      description: 'Tidak ada batasan quota atau biaya per RPP. Generate sebanyak yang Anda butuhkan tanpa khawatir.',
      color: 'blue',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Anti Stress Admin',
      description: 'Fokus mengajar, bukan paperwork. Sistem yang intuitif dan mudah digunakan untuk semua tingkat keahlian.',
      color: 'purple',
    },
  ];

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Kenapa Guru Memilih GuruPintar?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Bukan sekedar tools, tapi solusi lengkap untuk administrasi mengajar modern
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="flex flex-col p-6 bg-white border-2 border-gray-200 rounded-xl hover:shadow-lg transition-shadow duration-200"
            >
              {/* Icon */}
              <div className="w-16 h-16 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-xl mb-4">
                {benefit.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
