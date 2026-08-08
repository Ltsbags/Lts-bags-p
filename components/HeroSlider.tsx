'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Send, ArrowRight, Award, Pause, Play } from 'lucide-react';
import { HeroSlide } from '@/lib/types';

interface HeroSliderProps {
  initialSlides?: HeroSlide[];
  autoplayInterval?: number;
}

export default function HeroSlider({
  initialSlides = [],
  autoplayInterval = 5000,
}: HeroSliderProps) {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(initialSlides.length === 0);

  // Fetch active slides if none provided
  useEffect(() => {
    if (initialSlides.length > 0) {
      setSlides(initialSlides.filter((s) => s.isActive));
      setIsLoading(false);
      return;
    }

    async function fetchSlides() {
      try {
        const res = await fetch('/api/slides?active=true');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setSlides(data);
          }
        }
      } catch (err) {
        console.error('Failed to load slides:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSlides();
  }, [initialSlides]);

  const activeSlides = slides.filter((s) => s.isActive);

  // Navigation handlers
  const goToNext = useCallback(() => {
    if (activeSlides.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const goToPrev = useCallback(() => {
    if (activeSlides.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay timer
  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused || isHovered) return;

    const timer = setInterval(() => {
      goToNext();
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [activeSlides.length, isPaused, isHovered, autoplayInterval, goToNext]);

  // Touch Swipe Handlers for mobile
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }
  };

  // Skeleton fallback or empty state
  if (isLoading) {
    return (
      <div className="w-full h-[520px] sm:h-[600px] lg:h-[650px] bg-slate-900 animate-pulse flex items-center justify-center text-slate-500">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium">Loading hero slides...</p>
        </div>
      </div>
    );
  }

  if (activeSlides.length === 0) {
    return null;
  }

  const currentSlide = activeSlides[currentIndex] || activeSlides[0];

  return (
    <section
      className="relative w-full h-[540px] sm:h-[600px] lg:h-[650px] bg-slate-950 overflow-hidden text-white select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-label="Homepage Featured Highlights"
    >
      {/* Slide Images Container */}
      <div className="relative w-full h-full">
        {activeSlides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
              aria-hidden={!isActive}
            >
              {/* Background Image with optimized rendering */}
              <img
                src={slide.imageUrl}
                alt={slide.title || 'LTS BAGS Slide'}
                loading={index === 0 ? 'eager' : 'lazy'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center filter brightness-[0.65] transform scale-100 transition-transform duration-1000"
              />

              {/* Dark Gradient Overlay for optimal legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />

              {/* Grid line subtle accent pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415510_1px,transparent_1px),linear-gradient(to_bottom,#33415510_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

              {/* Slide Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-2xl space-y-4 sm:space-y-6">
                    {/* Badge */}
                    {slide.badgeText && (
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 font-mono text-xs uppercase tracking-widest font-semibold shadow-sm backdrop-blur-sm">
                        <Award className="w-4 h-4 text-sky-400 shrink-0" />
                        <span>{slide.badgeText}</span>
                      </div>
                    )}

                    {/* Main Slide Title */}
                    <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-serif leading-[1.12] drop-shadow-md">
                      {slide.title}
                    </h2>

                    {/* Description */}
                    {slide.description && (
                      <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed line-clamp-3 max-w-xl">
                        {slide.description}
                      </p>
                    )}

                    {/* CTAs */}
                    <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3 sm:gap-4">
                      {slide.buttonText && slide.buttonUrl && (
                        <Link
                          href={slide.buttonUrl}
                          className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl shadow-lg shadow-sky-500/25 hover:shadow-sky-400/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 text-sm sm:text-base"
                        >
                          <Send className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
                          <span>{slide.buttonText}</span>
                        </Link>
                      )}

                      <Link
                        href="/products"
                        className="bg-slate-900/80 hover:bg-slate-800/90 text-white font-semibold px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl border border-slate-700/80 backdrop-blur-md transition-all flex items-center gap-2 text-sm sm:text-base"
                      >
                        <span>Explore Catalog</span>
                        <ArrowRight className="w-4 h-4 text-sky-400" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows (Desktop & Tablet) */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            type="button"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-950/70 hover:bg-sky-500 text-white hover:text-slate-950 border border-slate-700/60 transition-all shadow-xl backdrop-blur-md group focus:outline-none focus:ring-2 focus:ring-sky-400"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 transform group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={goToNext}
            type="button"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-950/70 hover:bg-sky-500 text-white hover:text-slate-950 border border-slate-700/60 transition-all shadow-xl backdrop-blur-md group focus:outline-none focus:ring-2 focus:ring-sky-400"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 transform group-hover:translate-x-0.5 transition-transform" />
          </button>
        </>
      )}

      {/* Bottom Controls: Dot Indicators & Play/Pause */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto pointer-events-none">
        
        {/* Play/Pause Autoplay Control */}
        <div className="pointer-events-auto">
          <button
            onClick={() => setIsPaused(!isPaused)}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 transition-colors backdrop-blur-md shadow"
            title={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
          >
            {isPaused ? (
              <>
                <Play className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
                <span className="hidden sm:inline">Autoplay Paused</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Playing</span>
              </>
            )}
          </button>
        </div>

        {/* Dot Indicators */}
        {activeSlides.length > 1 && (
          <div className="flex items-center gap-2 pointer-events-auto bg-slate-950/60 backdrop-blur-md px-3.5 py-2 rounded-full border border-slate-800 shadow-lg">
            {activeSlides.map((slide, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(idx)}
                  type="button"
                  className={`transition-all duration-300 rounded-full focus:outline-none ${
                    isActive
                      ? 'w-8 h-2.5 bg-sky-400 shadow-sm shadow-sky-400/50'
                      : 'w-2.5 h-2.5 bg-slate-600 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                  aria-current={isActive ? 'true' : 'false'}
                />
              );
            })}
          </div>
        )}

        {/* Slide Counter */}
        <div className="pointer-events-auto hidden sm:block">
          <div className="text-xs font-mono text-slate-400 bg-slate-900/80 border border-slate-700/60 px-3 py-1.5 rounded-full backdrop-blur-md">
            <span className="text-sky-400 font-bold">{currentIndex + 1}</span> / {activeSlides.length}
          </div>
        </div>

      </div>
    </section>
  );
}
