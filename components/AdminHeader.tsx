'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Package, 
  Layers, 
  FileText, 
  MessageSquare, 
  LogOut, 
  LayoutDashboard,
  ExternalLink,
  ShieldCheck,
  Settings,
  Sliders
} from 'lucide-react';
import Logo from './Logo';

export default function AdminHeader({ activeTab }: { activeTab?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    const loggedIn = localStorage.getItem('apex_admin_logged_in');
    if (!loggedIn) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('apex_admin_logged_in');
    localStorage.removeItem('apex_admin_email');
    router.push('/admin/login');
  };

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { id: 'slides', name: 'Hero Slider', href: '/admin/slides', icon: Sliders },
    { id: 'products', name: 'Products', href: '/admin/products', icon: Package },
    { id: 'categories', name: 'Categories', href: '/admin/categories', icon: Layers },
    { id: 'blogs', name: 'Blog Posts', href: '/admin/blogs', icon: FileText },
    { id: 'enquiries', name: 'Quote Enquiries', href: '/admin/enquiries', icon: MessageSquare },
    { id: 'settings', name: 'Logo & Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/admin/dashboard" className="flex items-center gap-2 py-1">
              <Logo size="sm" theme="dark" showSubtitle={false} />
              <span className="bg-sky-500/20 text-sky-400 border border-sky-500/30 font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ml-1">
                ADMIN
              </span>
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || activeTab === item.id;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                      isActive
                        ? 'bg-sky-500 text-slate-950 font-black shadow-md shadow-sky-500/20'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <div className="h-4 w-px bg-slate-800 hidden sm:block" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-red-600/80 hover:text-white px-3 py-1.5 rounded-lg text-slate-300 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>

        {/* Mobile Sub-Nav */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/80 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || activeTab === item.id;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 ${
                  isActive ? 'bg-sky-500 text-slate-950 font-black' : 'text-slate-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

      </div>
    </header>
  );
}
