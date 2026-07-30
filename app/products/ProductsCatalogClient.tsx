'use client';

import React, { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductCard from '@/components/ProductCard';
import QuoteModal from '@/components/QuoteModal';
import { Product, Category } from '@/lib/types';
import { Search, Filter, Package, RefreshCw } from 'lucide-react';

interface ProductsCatalogClientProps {
  allProducts: Product[];
  categories: Category[];
}

export default function ProductsCatalogClient({ allProducts, categories }: ProductsCatalogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [moqFilter, setMoqFilter] = useState<string>('ALL');

  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState('');

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesCategory = selectedCategory === 'ALL' || product.categoryId === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.materials.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesMoq = true;
      if (moqFilter === 'LOW') {
        matchesMoq = product.moq <= 100;
      } else if (moqFilter === 'MID') {
        matchesMoq = product.moq > 100 && product.moq <= 300;
      } else if (moqFilter === 'HIGH') {
        matchesMoq = product.moq > 300;
      }

      return matchesCategory && matchesSearch && matchesMoq;
    });
  }, [allProducts, selectedCategory, searchQuery, moqFilter]);

  const handleEnquire = (productName: string) => {
    setSelectedProductName(productName);
    setQuoteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        
        {/* Banner */}
        <section className="bg-slate-900 text-white py-12 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={[{ name: 'Products Catalog', url: '/products' }]} />
            <div className="mt-3 max-w-3xl space-y-2">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-widest font-mono bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Direct Factory Catalog
              </span>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-serif text-white">
                B2B Custom Bag Manufacturing Models
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Filter through our range of corporate backpacks, executive briefcases, travel duffels, and eco totes. Custom branding, 3D embroidery, and custom material specs available for all items.
              </p>
            </div>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="py-8 bg-white border-b border-slate-200 sticky top-20 z-30 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              {/* Search Field */}
              <div className="md:col-span-5 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search bags by model, fabric (e.g. 1680D, canvas), specs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>

              {/* Category Select Mobile / Desktop tabs */}
              <div className="md:col-span-5 flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                <button
                  onClick={() => setSelectedCategory('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                    selectedCategory === 'ALL'
                      ? 'bg-slate-900 text-amber-400'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All Categories ({allProducts.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                      selectedCategory === cat.id
                        ? 'bg-slate-900 text-amber-400'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* MOQ Filter */}
              <div className="md:col-span-2 flex items-center justify-end gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={moqFilter}
                  onChange={(e) => setMoqFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold py-2 px-2.5 outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="ALL">All MOQ</option>
                  <option value="LOW">Low MOQ (≤100)</option>
                  <option value="MID">Mid MOQ (101-300)</option>
                  <option value="HIGH">High Volume (&gt;300)</option>
                </select>
              </div>

            </div>

          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 space-y-4 max-w-lg mx-auto">
                <Package className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-xl font-bold text-slate-900 font-serif">No Bag Models Match Your Filters</h3>
                <p className="text-slate-600 text-xs leading-relaxed px-6">
                  We offer 100% custom bag manufacturing from your technical drawings or reference photos even if not listed in this preview.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSearchQuery('');
                    setMoqFilter('ALL');
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-5 rounded-lg text-xs transition-colors inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEnquire={handleEnquire}
                  />
                ))}
              </div>
            )}

          </div>
        </section>

      </main>

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        preselectedProduct={selectedProductName}
      />

      <Footer />
    </div>
  );
}
