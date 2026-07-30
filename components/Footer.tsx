import React from 'react';
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

export default function Footer() {
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
              LTS BAGS PRIVATE LIMITED is a premier custom bag manufacturer and global bulk exporter. We specialize in corporate backpacks, executive laptop briefcases, travel duffels, and eco canvas totes with custom logo branding.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-sky-500/30 text-sky-300 font-semibold shadow-xs">
                <Award className="w-3.5 h-3.5 text-sky-400" /> ISO Certified Factory
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
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-sky-400 transition-colors flex items-center gap-2 text-slate-300 hover:translate-x-1 transform duration-200">
                  <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0" /> Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-sky-400 transition-colors flex items-center gap-2 text-slate-300 hover:translate-x-1 transform duration-200">
                  <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0" /> About LTS BAGS
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-sky-400 transition-colors flex items-center gap-2 text-slate-300 hover:translate-x-1 transform duration-200">
                  <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0" /> Products Catalog
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-sky-400 transition-colors flex items-center gap-2 text-slate-300 hover:translate-x-1 transform duration-200">
                  <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0" /> Manufacturing Blog
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
              Bag Categories
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
              Manufacturing Unit
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">LTS BAGS PRIVATE LIMITED</span>
                  <a 
                    href="https://www.google.com/search?kgmid=%2Fg%2F11qpsqysys&hl=en-IN&q=LTS%20BAGS%20PRIVATE%20LIMITED&shem=epsd1%2Cltae%2Crimspwouoe&shndl=30&source=sh%2Fx%2Floc%2Fosrp%2Fm1%2F4&kgs=20657782bd1aa7a9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-sky-400 hover:text-sky-300 underline flex items-center gap-1 mt-1 font-semibold"
                  >
                    <Globe className="w-3.5 h-3.5" /> View on Google Maps
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <a href="tel:+919833598338" className="hover:text-sky-300 transition-colors font-medium">
                    +91 98335 98338
                  </a>
                  <a href="tel:+919619961971" className="hover:text-sky-300 transition-colors font-medium">
                    +91 96199 61971
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a href="mailto:info@ltsbags.com" className="hover:text-sky-300 transition-colors font-medium">
                  info@ltsbags.com
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-slate-400">
                <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Mon - Sat: 9:00 AM - 7:00 PM IST</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} <strong className="text-slate-200">LTS BAGS PRIVATE LIMITED ®</strong>. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-sky-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-sky-400 transition-colors">
              Terms & Conditions
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
