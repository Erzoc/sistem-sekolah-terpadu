import React from 'react';

/**
 * PricingSection - 3-tier pricing table
 */

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  ctaLink: string;
  highlighted: boolean;
  badge?: string;
}

export default function PricingSection() {
  const tiers: PricingTier[] = [
    {
      name: 'Gratis',
      price: 'Rp 0',
      period: '/bulan',
      description: 'Coba fitur dasar untuk mulai menggunakan GuruPintar',
      features: [
        '5 RPP per bulan',
        'Akses bank soal terbatas',
        'Template dasar',
        'Export PDF',
        'Support email',
      ],
      cta: 'Mulai Gratis',
      ctaLink: '#signup',
      highlighted: false,
    },
    {
      name: 'Beta Launch',
      price: 'Rp 30.000',
      period: '/bulan',
      description: 'Dapatkan harga spesial LIFETIME untuk early adopters',
      features: [
        'RPP UNLIMITED',
        'Akses penuh bank soal',
        'Semua template premium',
        'Input nilai & analisis',
        'Modul organizer',
        'Export Word & PDF',
        'Priority support',
        'Update fitur gratis selamanya',
      ],
      cta: 'Daftar Beta Sekarang',
      ctaLink: '#signup',
      highlighted: true,
      badge: '🔥 LIFETIME DISCOUNT',
    },
    {
      name: 'Sekolah',
      price: 'Custom',
      period: '',
      description: 'Solusi untuk institusi dengan kebutuhan khusus',
      features: [
        'Multi-user license',
        'Admin dashboard sekolah',
        'White-label option',
        'Custom integrations',
        'Dedicated account manager',
        'Training & onboarding',
        'SLA guarantee',
      ],
      cta: 'Hubungi Sales',
      ctaLink: 'https://wa.me/6281234567890',
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="w-full bg-gray-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Paket Berlangganan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pilih paket yang sesuai kebutuhan Anda
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`relative bg-white rounded-2xl p-8 border-2 transition-all duration-200 ${
                tier.highlighted
                  ? 'border-emerald-500 shadow-2xl scale-105'
                  : 'border-gray-200 hover:shadow-lg'
              }`}
            >
              {/* Badge */}
              {tier.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                    {tier.badge}
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {tier.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl md:text-5xl font-bold text-gray-900">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-gray-600">{tier.period}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  {tier.description}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, featureIdx) => (
                  <li key={featureIdx} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <a
                href={tier.ctaLink}
                className={`block w-full text-center py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                  tier.highlighted
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Guarantee */}
        <div className="text-center mt-12 p-6 bg-emerald-50 border border-emerald-200 rounded-xl max-w-2xl mx-auto">
          <p className="text-emerald-900 font-medium mb-2">
            ✅ 7 Hari Jaminan Uang Kembali
          </p>
          <p className="text-sm text-emerald-700">
            Tidak puas? Kami kembalikan uang Anda 100%, no questions asked.
          </p>
        </div>

      </div>
    </section>
  );
}
