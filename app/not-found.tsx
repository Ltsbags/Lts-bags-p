import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Briefcase, ArrowLeft, Package } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-lg max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-amber-700 font-bold text-xs uppercase tracking-widest font-mono">
              Error 404
            </span>
            <h1 className="text-2xl font-black text-slate-900 font-serif">
              Requested Page Not Found
            </h1>
            <p className="text-slate-600 text-xs leading-relaxed">
              The bag catalog specification, category, or article you are looking for does not exist or has been relocated.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Return to Factory Home</span>
            </Link>
            <Link
              href="/products"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 px-6 rounded-xl text-xs transition-colors"
            >
              Explore Products Catalog
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
