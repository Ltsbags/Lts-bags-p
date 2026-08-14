'use client';

import React from 'react';
import { 
  PencilRuler, 
  Layers, 
  Scissors, 
  Printer, 
  ShieldCheck, 
  Package, 
  Truck,
  Factory
} from 'lucide-react';

export default function ManufacturingProcess() {
  const steps = [
    {
      stepNumber: '01',
      title: 'Design',
      description: 'Tech-pack preparation, CAD pattern drafting, and pre-production golden sample approval.',
      icon: PencilRuler,
    },
    {
      stepNumber: '02',
      title: 'Material Selection',
      description: 'Sourcing 1680D nylon, organic canvas, PU leatherette, YKK zippers, and alloy buckles.',
      icon: Layers,
    },
    {
      stepNumber: '03',
      title: 'Cutting',
      description: 'Precision automated CNC fabric laser cutting ensuring exact dimensional consistency across batch runs.',
      icon: Scissors,
    },
    {
      stepNumber: '04',
      title: 'Stitching',
      description: 'Heavy-duty bar-tack sewing, reinforced strap anchors, and high seam-density stitching.',
      icon: Factory,
    },
    {
      stepNumber: '05',
      title: 'Printing',
      description: '3D puff embroidery, water-based screen printing, debossed logos, and metallic badge riveting.',
      icon: Printer,
    },
    {
      stepNumber: '06',
      title: 'Quality Control',
      description: '100% inspection for seam strength, zipper action, stress load drops, and alignment accuracy.',
      icon: ShieldCheck,
    },
    {
      stepNumber: '07',
      title: 'Packaging',
      description: 'Dust-proof poly wrap, custom hangtag attachment, silica desiccants, and heavy corrugated master boxes.',
      icon: Package,
    },
    {
      stepNumber: '08',
      title: 'Dispatch',
      description: 'Fast domestic logistics and worldwide sea/air export freight with live consignment tracking.',
      icon: Truck,
    },
  ];

  return (
    <section className="py-20 bg-[#333333] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#67B0DF]/20 text-[#67B0DF] font-mono text-xs uppercase tracking-widest font-bold border border-[#67B0DF]/40">
            <Factory className="w-4 h-4 text-[#67B0DF]" />
            OUR MANUFACTURING PROCESS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-sans">
            END-TO-END FACTORY PRODUCTION WORKFLOW
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Every LTS BAGS product passes through our 8-step quality-controlled manufacturing process in Mumbai, India.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 hover:border-[#67B0DF] transition-all duration-300 space-y-4 relative group hover:shadow-lg"
              >
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                  <span className="text-2xl font-black font-mono text-[#67B0DF]">
                    {s.stepNumber}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-[#67B0DF] border border-slate-700 group-hover:bg-[#67B0DF] group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white font-sans group-hover:text-[#67B0DF] transition-colors">
                  {s.title}
                </h3>

                <p className="text-slate-300 text-xs leading-relaxed">
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
