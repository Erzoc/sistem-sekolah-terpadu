import React from 'react';

/**
 * Landing page specific layout
 * Add meta tags, structured data, analytics here
 */

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'GuruPintar',
            applicationCategory: 'EducationApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '30000',
              priceCurrency: 'IDR',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              ratingCount: '100',
            },
            description: 'Platform digital untuk guru Indonesia. Bikin RPP dalam 5 menit.',
          }),
        }}
      />

      {children}
    </>
  );
}
