'use client';

import React, { useState, useEffect, useRef } from 'react';

/**
 * HeroSection - Optimized for Core Web Vitals
 * 
 * Performance optimizations:
 * - Video lazy load with Intersection Observer
 * - preload="none" to defer loading
 * - Fallback gradient (instant LCP)
 * - Mobile: No video (better performance)
 * - Proper aspect ratio to prevent CLS
 * 
 * Metrics target:
 * - LCP: <2.5s (hero content paints fast)
 * - CLS: <0.1 (reserved space for video)
 * - FID: <100ms (minimal JS)
 */

interface TrustBadge {
  icon: string;
  value: string;
  label: string;
}

interface HeroSectionProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

export default function HeroSection({ onLoginClick, onRegisterClick }: HeroSectionProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Hydration safety
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Detect viewport size (video only on desktop)
  useEffect(() => {
    if (!isMounted) return;
    
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    setShowVideo(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setShowVideo(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [isMounted]);

  // Intersection Observer for lazy video load
  useEffect(() => {
    if (!showVideo || !videoRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current && !isVideoLoaded) {
            // Delay load slightly to prioritize text content
            setTimeout(() => {
              videoRef.current?.load();
              setIsVideoLoaded(true);
            }, 500);
          }
        });
      },
      { threshold: 0.25, rootMargin: '0px' }
    );

    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [showVideo, isVideoLoaded]);

  const trustBadges: TrustBadge[] = [
    { icon: '👥', value: '100+', label: 'Guru Aktif' },
    { icon: '📄', value: '5.000+', label: 'RPP Generated' },
    { icon: '⭐', value: '4.9', label: 'Rating' },
    { icon: '✅', value: '7 Hari', label: 'Garansi' },
  ];

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700">
      
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {isMounted && showVideo ? (
          <>
            {/* Video Background - Desktop Only */}
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-1000"
              style={{ 
                objectPosition: 'center 40%',
                opacity: isVideoLoaded ? 1 : 0,
              }}
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              aria-hidden="true"
            >
              <source src="/videos/demo.mp4" type="video/mp4" />
            </video>
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 z-10" />
          </>
        ) : null}
      </div>

      {/* Content Layer */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center space-y-6 sm:space-y-8">
          
          {/* Headline - Optimized for LCP */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
              Bikin RPP Dalam
              <span className="block mt-2 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-sm">
                5 Menit
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-50 max-w-3xl mx-auto leading-relaxed px-4">
              Berhenti habiskan 10 jam/minggu untuk administrasi. 
              Platform digital untuk guru Indonesia yang ingin fokus mengajar, 
              bukan ngurusin paperwork.
            </p>
          </div>

          {/* CTA Buttons - Touch optimized */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 pt-2">
            <button
              onClick={onLoginClick}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-200 min-w-[280px] sm:min-w-[320px]"
            >
              <span className="whitespace-nowrap">Login</span>
            </button>
            
            <button
              onClick={onRegisterClick}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg font-semibold text-gray-900 bg-white hover:bg-gray-50 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-200 min-w-[280px] sm:min-w-0"
            >
              <span className="whitespace-nowrap">Daftar Beta - Rp 30.000/bulan</span>
            </button>

            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg font-semibold text-white border-2 border-white hover:bg-white/10 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-200 min-w-[280px] sm:min-w-0"
            >
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span className="whitespace-nowrap">Chat WhatsApp</span>
            </a>
          </div>

          {/* Trust Line */}
          <div className="space-y-4 sm:space-y-5 pt-4 sm:pt-6">
            <p className="text-sm sm:text-base text-gray-100 font-medium">
              Dipercaya oleh guru profesional di seluruh Indonesia
            </p>

            {/* Trust Badges Grid - Optimized layout */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto px-4">
              {trustBadges.map((badge, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-colors duration-200"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl sm:text-2xl bg-white/20 rounded-full">
                    {badge.icon}
                  </div>
                  <div className="text-center">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">
                      {badge.value}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-100 leading-tight">
                      {badge.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Scroll Indicator - Desktop only */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden sm:block">
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="text-white/90 text-sm font-medium">Scroll</span>
          <svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}