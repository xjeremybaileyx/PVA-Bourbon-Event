
import React from 'react';
import { Attendee } from '../types';
import { Users, Clock, Download, Info, RefreshCw, Building2 } from 'lucide-react';

interface AttendeeListProps {
  attendees: Attendee[];
  onClear?: () => void;
  isCloud?: boolean;
  onRefresh?: () => void;
}

export const AttendeeList: React.FC<AttendeeListProps> = ({ attendees, onClear, isCloud, onRefresh }) => {
  const downloadCSV = () => {
    if (attendees.length === 0) return;
    
    const headers = ["Name", "Email", "Company", "Title", "Guests", "Dietary Notes", "Date"];
    const rows = attendees.map(a => [
      `"${a.name}"`,
      `"${a.email}"`,
      `"${a.company}"`,
      `"${a.title}"`,
      a.guests,
      `"${a.dietaryNotes || ''}"`,
      new Date(a.timestamp).toLocaleDateString()
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `bourbon_tour_rsvps_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 h-full flex flex-col">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-200">
            <Users size={20} />
            <h2 className="text-xl font-serif font-semibold">Confirmed</h2>
          </div>
          <div className="flex items-center gap-2">
            {isCloud && (
              <button 
                onClick={onRefresh}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-200/50 hover:text-amber-200 transition-all"
                title="Refresh Cloud Data"
              >
                <RefreshCw size={14} />
              </button>
            )}
            <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-1 rounded-full border border-amber-500/30">
              {attendees.reduce((acc, curr) => acc + curr.guests, 0)} Guests
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[10px] text-amber-100/40 uppercase tracking-widest">
            <Info size={12} />
            <span>{isCloud ? 'Synced to Cloud' : 'Local Storage Only'}</span>
          </div>
          
          {attendees.length > 0 && (
            <button 
              onClick={downloadCSV}
              className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 hover:text-amber-300 transition-colors bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20"
            >
              <Download size={12} />
              CSV
            </button>
          )}
        </div>
      </div>

      {attendees.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-amber-100/40 py-10 text-center">
          <Users size={48} className="mb-2 opacity-20" />
          <p>Be the first to RSVP!</p>
        </div>
      ) : (
        <div className="flex-1 space-y-3 overflow-y-auto pr-2 max-h-[500px] scrollbar-thin scrollbar-thumb-amber-900 scrollbar-track-transparent">
          {attendees.map((attendee) => (
            <div 
              key={attendee.id}
              className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2 group hover:bg-white/10 transition-colors animate-in slide-in-from-bottom-2 duration-300"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-amber-100 group-hover:text-amber-400 transition-colors">
                    {attendee.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-amber-200/60 font-medium">
                    <Building2 size={10} />
                    <span>{attendee.title}</span>
                    <span className="opacity-40">@</span>
                    <span>{attendee.company}</span>
                  </div>
                </div>
                <div className="text-[10px] font-bold bg-amber-900/40 text-amber-200 px-2 py-0.5 rounded border border-amber-500/20">
                  +{attendee.guests - 1} Guests
                </div>
              </div>

              <div className="flex items-center justify-between text-[9px] text-amber-100/30 uppercase tracking-widest mt-1 border-t border-white/5 pt-2">
                <span className="flex items-center gap-1">
                  <Clock size={8} /> {new Date(attendee.timestamp).toLocaleDateString()}
                </span>
                {attendee.dietaryNotes && (
                  <span className="italic text-amber-400/50 truncate max-w-[120px]">
                    Note: {attendee.dietaryNotes}
                  </span>
                )}
              </div>
            </div>
          ))}
          
          {onClear && !isCloud && (
            <button 
              onClick={() => {
                if(confirm("Clear local list?")) onClear();
              }}
              className="w-full mt-4 py-2 text-[10px] text-red-400/50 hover:text-red-400 transition-colors uppercase tracking-widest border border-dashed border-red-900/20 rounded-lg"
            >
              Clear Local List
            </button>
          )}
        </div>
      )}
    </div>
  );
};
