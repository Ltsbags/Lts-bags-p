'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, useRef } from 'react';
import AdminHeader from '@/components/AdminHeader';
import Logo from '@/components/Logo';
import { 
  Upload, 
  Image as ImageIcon, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Link as LinkIcon,
  Building,
  Eye,
  Type
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [logoText, setLogoText] = useState<string>('LTS BAGS');
  const [logoSubtitle, setLogoSubtitle] = useState<string>('PRIVATE LIMITED');
  
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch current settings on load
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          if (data.logoUrl) setLogoUrl(data.logoUrl);
          if (data.logoText) setLogoText(data.logoText);
          if (data.logoSubtitle) setLogoSubtitle(data.logoSubtitle);
        }
      })
      .catch((err) => {
        console.error('Error fetching settings:', err);
      });
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setNotification({ type: 'error', message: 'Please select a valid image file (PNG, JPG, SVG, WEBP).' });
      return;
    }

    setIsUploading(true);
    setNotification(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setLogoUrl(data.url);
        // Automatically save to settings DB
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            logoUrl: data.url,
            logoText,
            logoSubtitle,
          }),
        });
        setNotification({ type: 'success', message: 'Logo image uploaded and saved successfully! The logo is now live across the website.' });
      } else {
        setNotification({ type: 'error', message: data.error || 'Failed to upload logo image.' });
      }
    } catch (err) {
      console.error('Upload error:', err);
      setNotification({ type: 'error', message: 'An unexpected error occurred during image upload.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setNotification(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logoUrl,
          logoText,
          logoSubtitle,
        }),
      });

      if (res.ok) {
        setNotification({ type: 'success', message: 'Company logo & brand settings saved successfully across the website!' });
      } else {
        const errorData = await res.json();
        setNotification({ type: 'error', message: errorData.error || 'Failed to save settings.' });
      }
    } catch (err) {
      console.error('Save error:', err);
      setNotification({ type: 'error', message: 'An error occurred while saving brand settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefault = () => {
    setLogoUrl('');
    setLogoText('LTS BAGS');
    setLogoSubtitle('PRIVATE LIMITED');
    setNotification({ type: 'success', message: 'Reset to default SVG emblem logo. Remember to click "Save Changes".' });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      <AdminHeader />

      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-100 text-amber-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-amber-200 uppercase tracking-wider">
                  Brand Identity
                </span>
                <h1 className="text-2xl font-black text-slate-900 font-serif">
                  Company Logo & Branding Settings
                </h1>
              </div>
              <p className="text-slate-600 text-xs mt-1">
                Upload your custom company logo image or customize the header emblem displayed on the website and admin portal.
              </p>
            </div>
          </div>

          {/* Toast Notification */}
          {notification && (
            <div className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between gap-3 shadow-xs transition-all ${
              notification.type === 'success' 
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
                : 'bg-red-50 text-red-900 border border-red-200'
            }`}>
              <div className="flex items-center gap-2">
                {notification.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{notification.message}</span>
              </div>
              <button 
                onClick={() => setNotification(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-8">
            
            {/* Live Logo Preview Section */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-600" />
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                    Live Logo Preview
                  </h2>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">Real-time Header & Footer Display</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                
                {/* Light Mode Preview */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center min-h-[140px] text-center space-y-3 relative overflow-hidden group">
                  <span className="absolute top-2 left-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                    Light Theme Navbar
                  </span>
                  <div className="pt-3">
                    <Logo 
                      size="md" 
                      theme="light" 
                      overrideLogoUrl={logoUrl} 
                      overrideLogoText={logoText} 
                      overrideLogoSubtitle={logoSubtitle}
                    />
                  </div>
                </div>

                {/* Dark Mode Preview */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center min-h-[140px] text-center space-y-3 relative overflow-hidden group">
                  <span className="absolute top-2 left-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded">
                    Dark Theme / Footer
                  </span>
                  <div className="pt-3">
                    <Logo 
                      size="md" 
                      theme="dark" 
                      overrideLogoUrl={logoUrl} 
                      overrideLogoText={logoText} 
                      overrideLogoSubtitle={logoSubtitle}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Logo Image Upload & URL Section */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-amber-600" />
                  Upload Custom Company Logo
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Upload your brand logo file (PNG with transparent background, SVG, WEBP, or JPG) or enter an image URL.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                
                {/* File Upload Box */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700">
                    Option 1: Upload Logo File from Computer
                  </label>

                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all hover:bg-slate-50 ${
                      isUploading ? 'border-amber-400 bg-amber-50/50' : 'border-slate-300 hover:border-amber-500'
                    }`}
                  >
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          {isUploading ? 'Uploading Image...' : 'Click to Upload Logo File'}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Supports PNG, SVG, JPG, WEBP (Max 5MB)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct URL Input */}
                <div className="space-y-3">
                  <label htmlFor="logoUrlInput" className="block text-xs font-bold text-slate-700">
                    Option 2: Enter Direct Logo Image URL
                  </label>

                  <div className="space-y-2">
                    <div className="relative">
                      <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        id="logoUrlInput"
                        type="url" 
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 font-mono"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      If you host your logo image on an external URL or CDN, paste it directly here.
                    </p>
                  </div>

                  {logoUrl && (
                    <div className="pt-2 flex items-center gap-2">
                      <span className="text-xs text-slate-600">Current Logo URL set:</span>
                      <button
                        type="button"
                        onClick={() => setLogoUrl('')}
                        className="text-[11px] text-red-600 hover:underline font-bold"
                      >
                        Remove Logo Image
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Brand Name & Text Customization */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Type className="w-4 h-4 text-amber-600" />
                  Brand Name & Subtitle Customization
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Customize the company title and legal suffix used for fallbacks and alt attributes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Brand Name */}
                <div className="space-y-1.5">
                  <label htmlFor="logoTextInput" className="block text-xs font-bold text-slate-700">
                    Brand / Company Title
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      id="logoTextInput"
                      type="text" 
                      value={logoText}
                      onChange={(e) => setLogoText(e.target.value)}
                      placeholder="LTS BAGS"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 font-bold"
                    />
                  </div>
                </div>

                {/* Subtitle */}
                <div className="space-y-1.5">
                  <label htmlFor="logoSubtitleInput" className="block text-xs font-bold text-slate-700">
                    Subtitle / Legal Tagline
                  </label>
                  <input 
                    id="logoSubtitleInput"
                    type="text" 
                    value={logoSubtitle}
                    onChange={(e) => setLogoSubtitle(e.target.value)}
                    placeholder="PRIVATE LIMITED"
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 uppercase font-mono tracking-wider"
                  />
                </div>

              </div>
            </div>

            {/* Submit & Reset Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={handleResetDefault}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default Logo</span>
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs px-8 py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving Settings...' : 'Save Logo & Brand Changes'}</span>
              </button>
            </div>

          </form>

        </div>
      </main>
    </div>
  );
}
