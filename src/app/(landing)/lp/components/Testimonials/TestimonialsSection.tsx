import React from 'react';

/**
 * TestimonialsSection - Social proof with testimonials + stats
 */

interface Testimonial {
  name: string;
  role: string;
  school: string;
  quote: string;
  rating: number;
  initials: string;
  color: string;
}

export default function TestimonialsSection() {
  const testimonials: Testimonial[] = [
    {
      name: 'Ibu Siti Nurhaliza',
      role: 'Guru Matematika',
      school: 'SMP Negeri 5 Jakarta',
      quote: 'GuruPintar menghemat waktu saya lebih dari 8 jam setiap minggu. Sekarang saya punya lebih banyak waktu untuk mempersiapkan pembelajaran yang menarik untuk murid-murid.',
      rating: 5,
      initials: 'SN',
      color: 'emerald',
    },
    {
      name: 'Pak Ahmad Hidayat',
      role: 'Guru Bahasa Indonesia',
      school: 'SMA Negeri 3 Bandung',
      quote: 'Template RPP-nya sangat membantu dan sesuai dengan Kurikulum Merdeka. Bank soal yang tersedia juga berkualitas tinggi dan relevan dengan materi pembelajaran.',
      rating: 5,
      initials: 'AH',
      color: 'teal',
    },
    {
      name: 'Ibu Dewi Kartika',
      role: 'Guru IPA',
      school: 'SD Negeri 12 Surabaya',
      quote: 'Fitur input nilai sangat memudahkan saya dalam mengolah data siswa. Visualisasi grafiknya juga membantu saya memahami perkembangan setiap siswa dengan lebih baik.',
      rating: 5,
      initials: 'DK',
      color: 'blue',
    },
  ];

  const stats = [
    { value: '4.9/5', label: 'Rating Rata-rata' },
    { value: '100+', label: 'Guru Aktif' },
    { value: '50+', label: 'Sekolah Mitra' },
    { value: '0', label: 'Refund Requests' },
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string }> = {
      emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
      teal: { bg: 'bg-teal-100', text: 'text-teal-700' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-700' },
    };
    return colorMap[color] || colorMap.emerald;
  };

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Dipercaya Guru Profesional
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dengarkan pengalaman guru yang sudah merasakan manfaat
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, idx) => {
            const colors = getColorClasses(testimonial.color);
            return (
              <div
                key={idx}
                className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-700 leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <div className={`w-12 h-12 flex items-center justify-center ${colors.bg} ${colors.text} rounded-full font-bold text-lg`}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-gray-500">{testimonial.school}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Bar */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </p>
                <p className="text-sm md:text-base text-emerald-100">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
