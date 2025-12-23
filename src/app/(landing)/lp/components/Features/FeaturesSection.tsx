import React from 'react';

/**
 * FeaturesSection - Showcase 4 core features
 * 
 * Design: Large cards with icon, title, description, bullet points
 * Layout: Responsive grid
 */

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  points: string[];
}

export default function FeaturesSection() {
  const features: Feature[] = [
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'RPP Generator',
      description: 'Template terstruktur sesuai Kurikulum Merdeka dengan wizard step-by-step yang mudah diikuti.',
      points: [
        'Generate dalam 5 menit',
        'Template Kemendikbud verified',
        'Export ke Word & PDF',
        'Customizable sesuai kebutuhan',
      ],
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      ),
      title: 'Bank Soal',
      description: 'Ribuan soal terverifikasi untuk semua mata pelajaran dari SD hingga SMA dengan pembahasan lengkap.',
      points: [
        'Soal terverifikasi Tim Akademik',
        'Filter per tingkat & mata pelajaran',
        'Include pembahasan detail',
        'Update rutin setiap semester',
      ],
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Input Nilai',
      description: 'Sistem penilaian otomatis dengan visualisasi data dan analisis performa siswa yang komprehensif.',
      points: [
        'Input nilai mudah & cepat',
        'Visualisasi grafik otomatis',
        'Analisis performa siswa',
        'Export ke Excel & PDF',
      ],
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      title: 'Modul Organizer',
      description: 'Template modul ajar lengkap dan customizable untuk mengorganisir materi pembelajaran dengan efisien.',
      points: [
        'Template modul ajar lengkap',
        'Organize per bab/topik',
        'Attach file & multimedia',
        'Share dengan rekan guru',
      ],
    },
  ];

  return (
    <section className="w-full bg-gray-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Fitur Lengkap untuk Guru Profesional
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dari perencanaan hingga evaluasi, semua dalam satu platform
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-200"
            >
              {/* Icon */}
              <div className="w-16 h-16 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-xl mb-6">
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {feature.description}
              </p>

              {/* Points */}
              <ul className="space-y-3">
                {feature.points.map((point, pointIdx) => (
                  <li key={pointIdx} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
