'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { Enquiry } from '@/lib/types';
import { 
  MessageSquare, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Search, 
  Building2, 
  Mail, 
  Phone, 
  Package,
  Check,
  Bot,
  FileText,
  Sparkles
} from 'lucide-react';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState<'ALL' | 'DIRECT' | 'AI_CHATBOT'>('ALL');

  useEffect(() => {
    let active = true;
    fetch('/api/enquiries')
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setEnquiries(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const loadEnquiries = async () => {
    try {
      const res = await fetch('/api/enquiries');
      const data = await res.json();
      setEnquiries(data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id: string, newStatus: Enquiry['status']) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setEnquiries(
          enquiries.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quote record?')) return;
    try {
      const res = await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEnquiries(enquiries.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const chatbotCount = enquiries.filter((e) => e.source === 'AI_CHATBOT').length;
  const directCount = enquiries.filter((e) => e.source !== 'AI_CHATBOT').length;

  const filtered = enquiries.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.company.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.productRequirement.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    
    let matchesSource = true;
    if (sourceFilter === 'AI_CHATBOT') {
      matchesSource = e.source === 'AI_CHATBOT';
    } else if (sourceFilter === 'DIRECT') {
      matchesSource = e.source !== 'AI_CHATBOT';
    }

    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      <AdminHeader activeTab="enquiries" />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 font-serif">Inbound Wholesale Quote Enquiries</h1>
              <p className="text-slate-600 text-xs mt-1">
                View B2B client contact details, custom quantity requirements, and AI chatbot leads.
              </p>
            </div>
          </div>

          {/* Source Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
            <button
              onClick={() => setSourceFilter('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                sourceFilter === 'ALL'
                  ? 'bg-slate-900 text-amber-400 shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>All Enquiries ({enquiries.length})</span>
            </button>

            <button
              onClick={() => setSourceFilter('AI_CHATBOT')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                sourceFilter === 'AI_CHATBOT'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-700 border border-slate-200'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-sky-300" />
              <span>AI Chatbot Leads</span>
              <span className="bg-sky-100 text-sky-900 text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold">
                {chatbotCount}
              </span>
            </button>

            <button
              onClick={() => setSourceFilter('DIRECT')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                sourceFilter === 'DIRECT'
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Web Form Quotes ({directCount})</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by client name, company, email, or required bag..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs outline-none bg-transparent"
              />
            </div>

            <div className="md:col-span-4 flex items-center justify-end gap-2">
              <span className="text-xs font-bold text-slate-500">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold py-1.5 px-2.5 outline-none"
              >
                <option value="ALL">All Statuses ({enquiries.length})</option>
                <option value="NEW">New Enquiries</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="QUOTED">Quoted</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>

          {/* Enquiries List */}
          <div className="space-y-4">
            {loading ? (
              <p className="text-xs text-slate-500">Loading enquiries from database...</p>
            ) : filtered.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
                No matching quote enquiries found.
              </div>
            ) : (
              filtered.map((e) => (
                <div
                  key={e.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:border-amber-300 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-400 font-bold flex items-center justify-center font-serif">
                        {e.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base">{e.name}</h3>
                          {e.source === 'AI_CHATBOT' ? (
                            <span className="bg-sky-100 text-sky-800 border border-sky-300 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1">
                              <Bot className="w-3 h-3 text-sky-600" />
                              <span>AI Chatbot Lead</span>
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                              <FileText className="w-3 h-3 text-slate-500" />
                              <span>Web Form</span>
                            </span>
                          )}
                        </div>
                        <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{e.company}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        e.status === 'NEW'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : e.status === 'QUOTED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : e.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {e.status}
                      </span>
                      <span className="text-slate-400 text-xs font-mono">
                        {new Date(e.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-slate-500 font-semibold block text-[11px] uppercase">Client Contacts</span>
                      <p className="flex items-center gap-1.5 font-medium text-slate-800">
                        <Mail className="w-3.5 h-3.5 text-amber-600" /> {e.email}
                      </p>
                      <p className="flex items-center gap-1.5 font-medium text-slate-800">
                        <Phone className="w-3.5 h-3.5 text-amber-600" /> {e.mobile}
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-slate-500 font-semibold block text-[11px] uppercase">Bag Specification</span>
                      <p className="flex items-center gap-1.5 font-bold text-slate-900">
                        <Package className="w-3.5 h-3.5 text-amber-600" /> {e.productRequirement}
                      </p>
                      <p className="text-amber-800 font-bold text-[11px]">
                        Target Volume: {e.quantity} Units
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-slate-500 font-semibold block text-[11px] uppercase">Client Message & Requirements</span>
                      <p className="text-slate-700 italic text-[11px] leading-relaxed line-clamp-3">
                        &quot;{e.message}&quot;
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-bold text-[11px]">Update Status:</span>
                      <button
                        onClick={() => updateStatus(e.id, 'IN_PROGRESS')}
                        className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold border border-blue-200"
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => updateStatus(e.id, 'QUOTED')}
                        className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold border border-emerald-200"
                      >
                        Mark Quoted
                      </button>
                      <button
                        onClick={() => updateStatus(e.id, 'CLOSED')}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                      >
                        Close
                      </button>
                    </div>

                    <button
                      onClick={() => handleDelete(e.id)}
                      className="text-red-600 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 font-semibold"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

