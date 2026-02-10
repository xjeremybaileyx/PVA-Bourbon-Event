
import React from 'react';
import { TOUR_DETAILS } from '../constants';
import { GlassWater, Bus, Calendar } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="relative text-white py-16 px-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-600 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-800 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-900/50 border border-amber-500/30 text-amber-200 text-sm font-medium mb-6">
          <Bus size={14} />
          <span>Exclusive 22-Passenger Shuttle Tour</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-400 to-amber-200 mb-4 leading-tight">
          PVA BOURBON TOUR 2026
        </h1>
        <p className="text-xl md:text-2xl text-amber-100/80 font-serif italic mb-8">
          The Ultimate Kentucky Triple Threat
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-amber-100 max-w-3xl mx-auto">
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <Calendar className="text-amber-500" />
            <span className="font-semibold">{TOUR_DETAILS.date}</span>
            <span className="text-xs uppercase tracking-widest opacity-60">Save the Date</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <GlassWater className="text-amber-500" />
            <span className="font-semibold">3 Iconic Distilleries</span>
            <span className="text-xs uppercase tracking-widest opacity-60">Full Day Tour</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <Bus className="text-amber-500" />
            <span className="font-semibold">Transport Included</span>
            <span className="text-xs uppercase tracking-widest opacity-60">Luxury Shuttle</span>
          </div>
        </div>
      </div>
    </header>
  );
};
