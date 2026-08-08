'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Phone, MessageCircle, X, ChevronUp, MapPin } from 'lucide-react';
import { CompanyContactInfo } from '@/lib/types';

export default function FloatingContactButtons() {
  const pathname = usePathname();
  const [showPhoneMenu, setShowPhoneMenu] = useState(false);
  const [contact, setContact] = useState<Partial<CompanyContactInfo>>({
    phone1: '+91 98335 98338',
    phone2: '+91 96199 61971',
    socialWhatsapp: '+919833598338',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.contactInfo) {
          setContact(data.contactInfo);
        }
      })
      .catch((err) => console.error('Error fetching settings in floating buttons:', err));
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const primaryPhoneDisplay = contact.phone1 || '+91 98335 98338';
  const secondaryPhoneDisplay = contact.phone2 || '+91 96199 61971';
  const primaryPhoneClean = primaryPhoneDisplay.replace(/[^\d+]/g, '');
  const secondaryPhoneClean = secondaryPhoneDisplay.replace(/[^\d+]/g, '');

  const whatsappNumberClean = (contact.socialWhatsapp || primaryPhoneClean).replace(/[^\d]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappNumberClean}?text=${encodeURIComponent(
    'Hello LTS BAGS PRIVATE LIMITED, I am interested in custom bag manufacturing and bulk orders.'
  )}`;

  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto print:hidden">
      
      {/* Expanded Phone Numbers Popover */}
      {showPhoneMenu && (
        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 w-64 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
              Call Direct Sales
            </span>
            <button
              onClick={() => setShowPhoneMenu(false)}
              className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2 text-xs">
            <a
              href={`tel:${primaryPhoneClean}`}
              className="flex items-center gap-2 p-2.5 bg-slate-800 hover:bg-amber-600 rounded-xl transition-colors font-bold text-slate-100"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>{primaryPhoneDisplay}</span>
            </a>
            <a
              href={`tel:${secondaryPhoneClean}`}
              className="flex items-center gap-2 p-2.5 bg-slate-800 hover:bg-amber-600 rounded-xl transition-colors font-bold text-slate-100"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>{secondaryPhoneDisplay}</span>
            </a>
          </div>
          <p className="text-[10px] text-slate-400 text-center">
            LTS BAGS PRIVATE LIMITED Factory Helpline
          </p>
        </div>
      )}

      {/* Action Buttons Row */}
      <div className="flex items-center gap-3">
        {/* Call Button */}
        <button
          onClick={() => setShowPhoneMenu(!showPhoneMenu)}
          aria-label="Call LTS BAGS PRIVATE LIMITED"
          className="group relative flex items-center justify-center w-13 h-13 rounded-full bg-slate-900 hover:bg-amber-600 text-white shadow-xl hover:scale-105 transition-all duration-300 border-2 border-white/20"
        >
          <Phone className="w-6 h-6 text-amber-400 group-hover:text-white transition-colors" />
          <span className="absolute right-full mr-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Call Us: +91 98335 98338
          </span>
        </button>

        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp with LTS BAGS PRIVATE LIMITED"
          className="group relative flex items-center justify-center w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl hover:scale-105 transition-all duration-300 border-2 border-white/20"
        >
          <MessageCircle className="w-7 h-7 text-white fill-current" />
          <span className="absolute right-full mr-3 px-3 py-1.5 bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            WhatsApp Quote
          </span>
        </a>
      </div>

    </div>
  );
}
