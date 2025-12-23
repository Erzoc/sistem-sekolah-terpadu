'use client';

import React, { useState } from 'react';

/**
 * FAQSection - Accordion-style FAQ
 * 
 * Features:
 * - Client component for interactivity
 * - Smooth expand/collapse animations
 * - Only one item open at a time
 */

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'Apakah data saya aman di GuruPintar?',
      answer: 'Ya, sangat aman. Kami menggunakan Supabase cloud infrastructure dengan enkripsi end-to-end. Data Anda di-backup otomatis setiap hari dan dapat Anda export kapan saja ke format Word/PDF/Excel. Kami tidak pernah membagikan data Anda kepada pihak ketiga.',
    },
    {
      question: 'Bagaimana cara generate RPP?',
      answer: 'Sangat mudah! Cukup pilih "Buat RPP Baru", isi wizard step-by-step (mata pelajaran, kelas, topik, tujuan pembelajaran), lalu sistem akan generate RPP lengkap sesuai Kurikulum Merdeka dalam 5 menit. Anda bisa edit dan customize sebelum menyimpan.',
    },
    {
      question: 'Berapa lama proses pembuatan RPP?',
      answer: 'Rata-rata hanya 5 menit! Berbeda dengan cara manual yang bisa memakan waktu 2 jam atau lebih. Sistem kami menggunakan template terstruktur yang sudah sesuai standar Kemendikbud, jadi Anda hanya perlu mengisi konten spesifik untuk kelas Anda.',
    },
    {
      question: 'Apakah bisa export ke Word/PDF?',
      answer: 'Tentu! Semua RPP, modul ajar, dan dokumen lainnya bisa di-export ke format Word (.docx) dan PDF. Anda juga bisa export data nilai siswa ke Excel (.xlsx) untuk keperluan analisis lebih lanjut.',
    },
    {
      question: 'Bagaimana sistem pembayaran?',
      answer: 'Kami menerima pembayaran via transfer bank, e-wallet (GoPay, OVO, Dana), dan QRIS. Untuk paket Beta Launch (Rp 30.000/bulan), Anda akan mendapatkan harga tersebut SELAMANYA (lifetime discount). Pembayaran bisa bulanan atau tahunan.',
    },
    {
      question: 'Apa yang terjadi setelah trial 7 hari?',
      answer: 'Setelah 7 hari trial, Anda bisa memilih untuk upgrade ke paket berbayar atau tetap menggunakan paket gratis (5 RPP/bulan). Semua data Anda tetap aman dan tidak akan hilang. Jika tidak puas, kami akan kembalikan uang 100% tanpa pertanyaan.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Pertanyaan Umum
          </h2>
          <p className="text-lg text-gray-600">
            Punya pertanyaan? Kami punya jawabannya
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-100 transition-colors"
              >
                <span className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <svg
                  className={`w-6 h-6 text-emerald-600 flex-shrink-0 transform transition-transform duration-200 ${
                    openIndex === idx ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12 p-6 bg-emerald-50 border border-emerald-200 rounded-xl">
          <p className="text-gray-900 font-medium mb-3">
            Masih ada pertanyaan?
          </p>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Chat via WhatsApp
          </a>
        </div>

      </div>
    </section>
  );
}
