import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import WhyChooseUs from '@/components/WhyChooseUs';
import ManufacturingProcess from '@/components/ManufacturingProcess';
import SchemaScript from '@/components/SchemaScript';
import { db } from '@/lib/db';
import { generatePageMetadata, generateOrganizationSchema } from '@/lib/seo';
import { 
  Briefcase, 
  Send, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Package, 
  Layers, 
  Building2, 
  Users, 
  Award, 
  PhoneCall,
  Clock,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = generatePageMetadata({
  title: 'LTS BAGS PRIVATE LIMITED - Custom B2B Bag Manufacturer & Wholesale Supplier',
  description: 'Leading OEM & ODM manufacturer of corporate backpacks, executive laptop briefcases, travel duffels, and eco canvas totes with custom logo branding and direct factory pricing.',
  path: '/',
});

export default function HomePage() {
  const categories = db.getCategories();
  const featuredProducts = db.getProducts().filter((p) => p.isFeatured || p.moq <= 100).slice(0, 6);
  const latestBlogs = db.getBlogs().slice(0, 3);
  const orgSchema = generateOrganizationSchema();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <SchemaScript schema={orgSchema} />
      <Navbar />

      <main className="flex-1">
        
        {/* HERO SECTION */}
        <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
          
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column Text & CTAs */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono text-xs uppercase tracking-widest font-bold">
                  <Award className="w-4 h-4 text-sky-400" />
                  <span>ISO 9001:2015 Certified OEM / ODM Plant</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-serif leading-[1.15]">
                  Premium Custom <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-blue-500">Bag Manufacturing</span> For Corporate Brands
                </h1>

                {/* Subheading */}
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Direct factory supply of executive laptop bags, corporate tech backpacks, heavy travel duffels, and eco canvas totes. Engineered with precision stitching, custom 3D embroidery, and guaranteed on-time delivery.
                </p>

                {/* Key USPs list */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-semibold text-slate-300 max-w-lg mx-auto lg:mx-0">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Low MOQ (from 50 units)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Custom Logo Printing</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>10,000+ Daily Capacity</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    href="/contact"
                    className="w-full sm:w-auto bg-sky-600 hover:bg-sky-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-sky-600/25 hover:shadow-sky-500/40 transition-all flex items-center justify-center gap-2 text-base"
                  >
                    <Send className="w-5 h-5" />
                    <span>Request Bulk Wholesale Quote</span>
                  </Link>

                  <Link
                    href="/products"
                    className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-4 rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 text-base"
                  >
                    <span>Explore Products</span>
                    <ArrowRight className="w-4 h-4 text-sky-400" />
                  </Link>
                </div>

              </div>

              {/* Right Column Visual Showcase */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-900 group">
                  <img
                    src="https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=1000"
                    alt="LTS BAGS Custom Bag Manufacturing Facility & Executive Laptop Bags"
                    referrerPolicy="no-referrer"
                    className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                  
                  {/* Floating Overlay Card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-md p-4 rounded-xl border border-slate-800 shadow-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sky-400 text-xs font-bold uppercase tracking-wider font-mono">
                        Direct Factory Production
                      </span>
                      <span className="text-emerald-400 text-xs font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">
                        Active Bulk Batch
                      </span>
                    </div>
                    <p className="text-white text-sm font-bold font-serif">
                      1680D Executive Ballistic Nylon Laptop Backpack
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <span>Daily Output: 10,000+ Bags</span>
                      <span className="text-sky-300 font-semibold">100% Quality Inspected</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* STATS STRIP */}
        <section className="bg-sky-600 dark:bg-sky-700 text-white py-8 border-y border-sky-700 dark:border-sky-800 shadow-inner transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl sm:text-4xl font-black font-serif">15+ Years</p>
                <p className="text-sky-100 text-xs font-medium uppercase tracking-wider mt-1">Manufacturing Experience</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-black font-serif">5,000,000+</p>
                <p className="text-sky-100 text-xs font-medium uppercase tracking-wider mt-1">Bags Shipped Globally</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-black font-serif">1,200+</p>
                <p className="text-sky-100 text-xs font-medium uppercase tracking-wider mt-1">Corporate Clients</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-black font-serif">99.4%</p>
                <p className="text-sky-100 text-xs font-medium uppercase tracking-wider mt-1">On-Time Dispatch Rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED CATEGORIES SECTION */}
        <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-sky-700 dark:text-sky-300 font-bold text-xs uppercase tracking-widest font-mono bg-sky-50 dark:bg-sky-950/80 px-3 py-1 rounded-full border border-sky-200 dark:border-sky-800">
                  Product Categories
                </span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-serif mt-2">
                  Specialized Bag Manufacturing Categories
                </h2>
              </div>
              <Link
                href="/products"
                className="text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 font-bold text-sm flex items-center gap-1 hover:underline"
              >
                View Full Catalog <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group bg-slate-50 dark:bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700/80 hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="aspect-16/10 overflow-hidden relative bg-slate-200 dark:bg-slate-800">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold font-serif group-hover:text-sky-300 transition-colors">
                        {cat.name}
                      </h3>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                    <div className="flex items-center justify-between text-xs font-bold text-sky-700 dark:text-sky-400 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                      <span>Explore Collection</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </section>

        {/* FEATURED PRODUCTS CATALOG PREVIEW */}
        <section className="py-20 bg-slate-100/70 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-sky-700 dark:text-sky-300 font-bold text-xs uppercase tracking-widest font-mono bg-sky-100/80 dark:bg-sky-950/80 px-3 py-1 rounded-full border border-sky-300 dark:border-sky-800">
                Top B2B Sellers
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-serif">
                Featured Custom Bag Models
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Tested and trusted by leading MNCs, IT corporations, sports leagues, and educational institutions. Custom logo printing and sample prototyping available.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-colors shadow-sm"
              >
                <span>Browse All Custom Bags & Specs</span>
                <ArrowRight className="w-4 h-4 text-sky-400 dark:text-sky-200" />
              </Link>
            </div>

          </div>
        </section>

        {/* WHY CHOOSE US */}
        <WhyChooseUs />

        {/* MANUFACTURING PROCESS */}
        <ManufacturingProcess />

        {/* CLIENT TRUST LOGOS */}
        <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
              Trusted Wholesale Supplier For Top Corporate Brands & Organizations
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-black text-lg tracking-wider font-mono">
                <Building2 className="w-6 h-6 text-sky-600 dark:text-sky-400" /> TECHCORP GLOBAL
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-black text-lg tracking-wider font-mono">
                <ShieldCheck className="w-6 h-6 text-sky-600 dark:text-sky-400" /> INFOSERVE INC
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-black text-lg tracking-wider font-mono">
                <Award className="w-6 h-6 text-sky-600 dark:text-sky-400" /> METRO LOGISTICS
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-black text-lg tracking-wider font-mono">
                <Briefcase className="w-6 h-6 text-sky-600 dark:text-sky-400" /> GLOBAL SPORTING
              </div>
            </div>
          </div>
        </section>

        {/* LATEST BLOGS */}
        <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-sky-700 dark:text-sky-300 font-bold text-xs uppercase tracking-widest font-mono bg-sky-100/80 dark:bg-sky-950/80 px-3 py-1 rounded-full border border-sky-300 dark:border-sky-800">
                  Manufacturing Insights
                </span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-serif mt-2">
                  B2B Bag Buying Guides & Industry News
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 font-bold text-sm flex items-center gap-1 hover:underline"
              >
                Read All Articles <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestBlogs.map((blog) => (
                <article
                  key={blog.id}
                  className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg transition-all flex flex-col"
                >
                  <Link href={`/blog/${blog.slug}`} className="aspect-16/9 overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800">
                        {blog.category}
                      </span>
                      <Link href={`/blog/${blog.slug}`}>
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg hover:text-sky-600 dark:hover:text-sky-400 transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                      </Link>
                      <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed line-clamp-2">
                        {blog.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                      <Link href={`/blog/${blog.slug}`} className="text-sky-700 dark:text-sky-400 font-bold hover:underline">
                        Read Guide →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

          </div>
        </section>

        {/* CONTACT / QUOTE CTA */}
        <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono text-xs uppercase tracking-widest font-bold">
              <PhoneCall className="w-4 h-4 text-sky-400" />
              Instant Factory Consultation
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-serif">
              Ready to Order Custom Bags for Your Brand?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Send us your bag design drawings, sample requests, or target budget. Our sales team will deliver custom samples and transparent factory unit pricing within 24 hours.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="w-full sm:w-auto bg-sky-600 hover:bg-sky-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-base"
              >
                <Send className="w-5 h-5" />
                <span>Submit Wholesale Quote Form</span>
              </Link>
              <a
                href="tel:+919833598338"
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-4 rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 text-base"
              >
                <PhoneCall className="w-4 h-4 text-sky-400" />
                <span>Call Sales: +91 98335 98338</span>
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
