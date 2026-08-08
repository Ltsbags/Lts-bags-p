'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/AdminHeader';
import { db } from '@/lib/db';
import { Enquiry } from '@/lib/types';
import { 
  Package, 
  Layers, 
  FileText, 
  MessageSquare, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Clock3,
  Sliders
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalBlogs: 0,
    totalEnquiries: 0,
    totalSlides: 0,
    activeSlides: 0,
    newEnquiriesCount: 0,
  });

  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);

  useEffect(() => {
    fetch('/api/admin/login')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));

    fetch('/api/enquiries')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRecentEnquiries(data.slice(0, 5));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      <AdminHeader />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Welcome Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 font-serif">
                Factory Operations Dashboard
              </h1>
              <p className="text-slate-600 text-xs mt-1">
                Overview of custom bag catalog metrics, active category SEO rules, and client quote enquiries.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/admin/slides"
                className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Manage Hero Slider</span>
              </Link>
              <Link
                href="/admin/settings"
                className="bg-slate-800 hover:bg-slate-900 text-slate-200 font-bold px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>Change Company Logo</span>
              </Link>
              <Link
                href="/admin/products"
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Bag Model</span>
              </Link>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            
            {/* Hero Slides */}
            <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Hero Slides</p>
                <p className="text-3xl font-black text-slate-900 font-serif mt-1">{stats.totalSlides || 3}</p>
                <Link href="/admin/slides" className="text-[11px] text-sky-600 font-bold hover:underline mt-2 inline-block">
                  Manage Slides →
                </Link>
              </div>
              <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center shrink-0">
                <Sliders className="w-5 h-5" />
              </div>
            </div>
            
            {/* Total Products */}
            <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Total Products</p>
                <p className="text-3xl font-black text-slate-900 font-serif mt-1">{stats.totalProducts}</p>
                <Link href="/admin/products" className="text-[11px] text-amber-700 font-bold hover:underline mt-2 inline-block">
                  Manage Products →
                </Link>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                <Package className="w-6 h-6" />
              </div>
            </div>

            {/* Total Categories */}
            <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Bag Categories</p>
                <p className="text-3xl font-black text-slate-900 font-serif mt-1">{stats.totalCategories}</p>
                <Link href="/admin/categories" className="text-[11px] text-amber-700 font-bold hover:underline mt-2 inline-block">
                  Manage Categories →
                </Link>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
                <Layers className="w-6 h-6" />
              </div>
            </div>

            {/* Total Blogs */}
            <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Blog Posts</p>
                <p className="text-3xl font-black text-slate-900 font-serif mt-1">{stats.totalBlogs}</p>
                <Link href="/admin/blogs" className="text-[11px] text-amber-700 font-bold hover:underline mt-2 inline-block">
                  Manage B2B Blogs →
                </Link>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            {/* Total Enquiries */}
            <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Client Enquiries</p>
                <p className="text-3xl font-black text-slate-900 font-serif mt-1">
                  {stats.totalEnquiries}
                  {stats.newEnquiriesCount > 0 && (
                    <span className="ml-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {stats.newEnquiriesCount} New
                    </span>
                  )}
                </p>
                <Link href="/admin/enquiries" className="text-[11px] text-amber-700 font-bold hover:underline mt-2 inline-block">
                  View All Enquiries →
                </Link>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
            </div>

          </div>

          {/* Recent Enquiries Section */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-serif">Recent Wholesale Quote Requests</h2>
                <p className="text-xs text-slate-500">Inbound B2B enquiries stored in database</p>
              </div>
              <Link
                href="/admin/enquiries"
                className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
              >
                View All ({stats.totalEnquiries}) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 overflow-x-auto">
              {recentEnquiries.length === 0 ? (
                <p className="p-6 text-center text-xs text-slate-500">No client enquiries found in database.</p>
              ) : (
                recentEnquiries.map((enq) => (
                  <div key={enq.id} className="p-4 sm:px-6 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 font-bold text-sm">{enq.name}</strong>
                        <span className="text-slate-500">({enq.company})</span>
                      </div>
                      <p className="text-slate-600">
                        <strong className="text-slate-700">Req:</strong> {enq.productRequirement} ({enq.quantity} units)
                      </p>
                      <p className="text-slate-500 text-[11px]">
                        📧 {enq.email} | 📞 {enq.mobile}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                        enq.status === 'NEW'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : enq.status === 'QUOTED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {enq.status}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        {new Date(enq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
