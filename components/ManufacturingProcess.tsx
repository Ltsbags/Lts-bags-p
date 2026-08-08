'use client';

import React, { useEffect, useState } from 'react';
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
import { HomepageProcessStep } from '@/lib/types';

interface ManufacturingProcessProps {
  initialSteps?: HomepageProcessStep[];
  title?: string;
  subtitle?: string;
}

export default function ManufacturingProcess({ initialSteps, title: customTitle, subtitle: customSubtitle }: ManufacturingProcessProps) {
  const [steps, setSteps] = useState<HomepageProcessStep[]>(initialSteps || [
    {
      stepNumber: '01',
      title: 'Specification & CAD Design',
      description: 'Client submits target bag dimensions, fabric density (1680D/600D/Canvas), pocket arrangements, and branding specs.',
    },
    {
      stepNumber: '02',
      title: 'Golden Sample Prototyping',
      description: 'Our sample master craftsmen construct a physical pre-production prototype for touch, feel, load test, and client approval.',
    },
    {
      stepNumber: '03',
      title: 'Precision Automated Cutting & Stitching',
      description: 'Heavy fabric rolls undergo computer-guided pattern cutting and reinforced bar-tack joints on shoulder straps and handle anchors.',
    },
    {
      stepNumber: '04',
      title: '100% Quality Inspection & Dispatch',
      description: 'Strict AQL 2.5 quality control checks for zipper durability, seam strength, custom logo alignment, and global freight delivery.',
    },
  ]);

  const [title, setTitle] = useState(customTitle || '6-Step Precision OEM/ODM Production Workflow');
  const [subtitle, setSubtitle] = useState(customSubtitle || 'From initial CAD design rendering to final container loading, every step in our bag factory is monitored for zero-defect compliance.');

  useEffect(() => {
    if (!initialSteps) {
      fetch('/api/settings')
        .then((res) => res.json())
        .then((data) => {
          if (data?.homepage?.processSteps && data.homepage.processSteps.length > 0) {
            setSteps(data.homepage.processSteps);
          }
          if (data?.homepage?.processTitle) {
            setTitle(data.homepage.processTitle);
          }
          if (data?.homepage?.processSubtitle) {
            setSubtitle(data.homepage.processSubtitle);
          }
        })
        .catch((err) => console.error('Error fetching process steps:', err));
    }
  }, [initialSteps]);

  const getStepIcon = (index: number) => {
    const icons = [FileText, Ruler, Scissors, Layers, ShieldCheck, Truck];
    return icons[index % icons.length];
  };

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-sky-950/40 via-slate-900 to-slate-950 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-amber-400 font-bold text-xs uppercase tracking-widest font-mono bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Manufacturing Standard Operating Procedure
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-serif">
            {title}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Process Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => {
            const Icon = getStepIcon(i);
            return (
              <div
                key={i}
                className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 hover:border-amber-500/50 transition-all duration-300 space-y-4 relative group"
              >
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                  <span className="text-2xl font-black font-mono text-amber-400">
                    {s.stepNumber || `0${i + 1}`}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-amber-400 border border-slate-700 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white font-serif group-hover:text-amber-300 transition-colors">
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
