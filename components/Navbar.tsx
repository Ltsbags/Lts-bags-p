'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Phone, 
  Mail, 
  Menu, 
  X, 
  Send, 
  CheckCircle2
} from 'lucide-react';
import QuoteModal from './QuoteModal';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedProductForQuote, setSelectedProductForQuote] = useState<string>('');

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Products Catalog', href: '/products' },
    { name: 'B2B Blog', href: '/blog' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <>
      {/* Top Corporate Info Bar */}
      <div className="bg-slate-900 dark:bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800 dark:border-slate-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a href="tel:+919833598338" className="flex items-center gap-1.5 hover:text-sky-400 transition-colors">
              <Phone className="w-3.5 h-3.5 text-sky-400" />
              <span>+91 98335 98338</span>
            </a>
            <a href="tel:+919619961971" className="flex items-center gap-1.5 hover:text-sky-400 transition-colors">
              <Phone className="w-3.5 h-3.5 text-sky-400" />
              <span>+91 96199 61971</span>
            </a>
            <a href="mailto:info@ltsbags.com" className="hidden md:flex items-center gap-1.5 hover:text-sky-400 transition-colors">
              <Mail className="w-3.5 h-3.5 text-sky-400" />
              <span>info@ltsbags.com</span>
            </a>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Direct Factory Bulk Rates & Low MOQ
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/">
              <Logo size="md" theme="auto" showIcon={true} />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-semibold transition-colors duration-200 py-2 relative ${
                      isActive
                        ? 'text-sky-600 dark:text-sky-400 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 dark:bg-sky-400 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* CTA Button & Theme Toggle */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => {
                  setSelectedProductForQuote('');
                  setQuoteModalOpen(true);
                }}
                className="bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Request Bulk Quote</span>
              </button>
            </div>

            {/* Mobile Controls */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3 shadow-lg">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-lg text-base font-semibold transition-colors ${
                      isActive
                        ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSelectedProductForQuote('');
                  setQuoteModalOpen(true);
                }}
                className="w-full bg-sky-600 dark:bg-sky-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Get Instant Wholesale Quote</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Global Quote Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        preselectedProduct={selectedProductForQuote}
      />
    </>
  );
}
