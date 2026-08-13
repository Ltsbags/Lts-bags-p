'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Award, 
  Clock, 
  ArrowRight,
  Globe
} from 'lucide-react';
import Logo from './Logo';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from './LanguageProvider';
import { CompanyContactInfo, FooterContent } from '@/lib/types';

export default function Footer() {
  const { t } = useLanguage();
  const [contact, setContact] = useState<Partial<CompanyContactInfo>>({
    companyName: 'LTS BAGS PRIVATE LIMITED',
    phone1: '+91 98335 98338',
    phone2: '+91 96199 61971',
    email1: 'info@ltsbags.com',
    factoryAddress: 'Plot No. 42, Sector 8, MIDC, Navi Mumbai, Maharashtra 400708',
    googleMapsUrl: 'https://www.google.com/search?kgmid=%2Fg%2F11qpsqysys&hl=en-IN&q=LTS%20BAGS%20PRIVATE%20LIMITED',
    workingHours: 'Mon - Sat: 9:00 AM - 7:00 PM IST',
    isoCertificate: 'ISO 9001:2015 Certified Factory',
  });

  const [footerContent, setFooterContent] = useState<Partial<FooterContent>>({
    aboutBrief: 'LTS BAGS PRIVATE LIMITED is a premier custom bag manufacturer and global bulk exporter. We specialize in corporate backpacks, executive laptop briefcases, travel duffels, and eco canvas totes with custom logo branding.',
    copyrightText: 'LTS BAGS PRIVATE LIMITED ®. All Rights Reserved.',
    quickLinksTitle: 'Quick Navigation',
    categoriesTitle: 'Bag Categories',
    contactTitle: 'Manufacturing Unit',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.contactInfo) {
          setContact(data.contactInfo);
        }
        if (data?.footer) {
          setFooterContent(data.footer);
        }
      })
      .catch((err) => console.error('Error fetching settings in Footer:', err));
  }, []);

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-sky-500/20 relative overflow-hidden">
      {/* Background Subtle Sky Blue Gradient Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <Logo size="lg" theme="dark" />
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {footerContent.aboutBrief}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-sky-500/30 text-sky-300 font-semibold shadow-xs">
                <Award className="w-3.5 h-3.5 text-sky-400" /> {contact.isoCertificate || 'ISO Certified Factory'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 font-semibold shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Quality QC Guaranteed
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sky-400 font-bold text-sm uppercase tracking-wider font-mono border-b border-sky-500/20 pb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
              {footerContent.quickLinksTitle || 'Quick Navigation'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-sky-400 transition-colors flex items-center gap-2 text-slate-300 hover:translate-x-1 transform duration-200">
                  <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0" /> Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-sky-400 transition-colors flex items-center gap-2 text-slate-300 hover:translate-x-1 transform duration-200">
                  <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0" /> About Company
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-sky-400 transition-colors flex items-center gap-2 text-slate-300 hover:translate-x-1 transform duration-200">
                  <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0" /> Products
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-sky-400 transition-colors flex items-center gap-2 text-slate-300 hover:translate-x-1 transform duration-200">
                  <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0" /> Contact & Enquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Bag Categories */}
          <div className="space-y-4">
            <h3 className="text-sky-400 font-bold text-sm uppercase tracking-wider font-mono border-b border-sky-500/20 pb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
              {footerContent.categoriesTitle || 'Bag Categories'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/category/executive-laptop-bags" className="hover:text-sky-400 text-slate-300 transition-colors flex items-center gap-1.5">
                  <span className="text-sky-400 font-bold">•</span> Executive Laptop Bags
                </Link>
              </li>
              <li>
                <Link href="/category/corporate-backpacks" className="hover:text-sky-400 text-slate-300 transition-colors flex items-center gap-1.5">
                  <span className="text-sky-400 font-bold">•</span> Corporate Tech Backpacks
                </Link>
              </li>
              <li>
                <Link href="/category/duffel-travel-bags" className="hover:text-sky-400 text-slate-300 transition-colors flex items-center gap-1.5">
                  <span className="text-sky-400 font-bold">•</span> Travel & Duffel Bags
                </Link>
              </li>
              <li>
                <Link href="/category/eco-canvas-tote-bags" className="hover:text-sky-400 text-slate-300 transition-colors flex items-center gap-1.5">
                  <span className="text-sky-400 font-bold">•</span> Eco Canvas & Jute Totes
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Factory Location */}
          <div className="space-y-4">
            <h3 className="text-sky-400 font-bold text-sm uppercase tracking-wider font-mono border-b border-sky-500/20 pb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
              {footerContent.contactTitle || 'Manufacturing Unit'}
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">{contact.companyName || 'LTS BAGS PRIVATE LIMITED'}</span>
                  <p className="text-xs text-slate-400 mt-0.5">{contact.factoryAddress}</p>
                  {contact.googleMapsUrl && (
                    <a 
                      href={contact.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-sky-400 hover:text-sky-300 underline flex items-center gap-1 mt-1 font-semibold"
                    >
                      <Globe className="w-3.5 h-3.5" /> View on Google Maps
                    </a>
                  )}
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  {contact.phone1 && (
                    <a href={`tel:${contact.phone1.replace(/\s+/g, '')}`} className="hover:text-sky-300 transition-colors font-medium">
                      {contact.phone1}
                    </a>
                  )}
                  {contact.phone2 && (
                    <a href={`tel:${contact.phone2.replace(/\s+/g, '')}`} className="hover:text-sky-300 transition-colors font-medium">
                      {contact.phone2}
                    </a>
                  )}
                </div>
              </li>
              {contact.email1 && (
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                  <a href={`mailto:${contact.email1}`} className="hover:text-sky-300 transition-colors font-medium">
                    {contact.email1}
                  </a>
                </li>
              )}
              {contact.workingHours && (
                <li className="flex items-center gap-2.5 text-xs text-slate-400">
                  <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{contact.workingHours}</span>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} <strong className="text-slate-200">{contact.companyName || 'LTS BAGS PRIVATE LIMITED'}</strong>. {t('footer.copyright', 'All Rights Reserved.')}</p>
          <div className="flex flex-wrap items-center gap-6">
            <LanguageSelector variant="footer" />
            <Link href="/privacy-policy" className="hover:text-sky-400 transition-colors">
              {t('footer.privacyPolicy', 'Privacy Policy')}
            </Link>
            <Link href="/terms" className="hover:text-sky-400 transition-colors">
              {t('footer.termsConditions', 'Terms & Conditions')}
            </Link>
            <Link href="/sitemap.xml" target="_blank" className="hover:text-sky-400 transition-colors">
              XML Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
