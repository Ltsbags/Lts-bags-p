import React from 'react';
import { 
  FileText, 
  Ruler, 
  Scissors, 
  CheckCircle2, 
  Truck, 
  Layers, 
  ShieldCheck,
  Award
} from 'lucide-react';

export default function ManufacturingProcess() {
  const steps = [
    {
      step: '01',
      title: 'Specification & Cad Design',
      desc: 'Client submits target bag dimensions, fabric density (1680D/600D/Canvas), pocket arrangements, and branding specs.',
      icon: FileText,
    },
    {
      step: '02',
      title: 'Golden Sample Approval',
      desc: 'Our sample master craftsmen construct a physical pre-production prototype for touch, feel, load test, and client approval.',
      icon: Ruler,
    },
    {
      step: '03',
      title: 'Precision Automated Cutting',
      desc: 'Heavy fabric rolls undergo computer-guided CNC laser pattern cutting for 100% geometric accuracy across bulk quantities.',
      icon: Scissors,
    },
    {
      step: '04',
      title: 'Bar-Tack Stitching & Assembly',
      desc: 'Precision stitching with high-tensile nylon thread. Reinforced bar-tack joints on shoulder straps and handle anchors.',
      icon: Layers,
    },
    {
      step: '05',
      title: '100% Quality Inspection',
      desc: 'Strict AQL 2.5 quality control checks for zipper durability, seam strength, custom logo alignment, and clean thread trimming.',
      icon: ShieldCheck,
    },
    {
      step: '06',
      title: 'Custom Packaging & Shipping',
      desc: 'Individual poly-bagged items, moisture-absorbent silica packs, heavy 5-ply corrugated carton boxing, and global freight delivery.',
      icon: Truck,
    },
  ];

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-amber-900/20 via-slate-900 to-slate-950 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-xs uppercase tracking-widest font-bold">
            <Award className="w-3.5 h-3.5" /> ISO Certified Standard
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-serif text-white">
            6-Stage Precision Manufacturing Process
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            From initial technical blueprinting to global containerized delivery, our streamlined OEM/ODM production line guarantees consistent batch quality and on-time execution.
          </p>
        </div>

        {/* Process Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.step}
                className="bg-slate-800/80 rounded-xl p-6 border border-slate-700/80 hover:border-amber-500/50 transition-all duration-300 relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black text-slate-700 font-mono group-hover:text-amber-400/30 transition-colors">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 font-serif group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-slate-400 text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>QC Checkpoint Passed</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
