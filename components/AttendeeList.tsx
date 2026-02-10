
import React from 'react';
import { Attendee } from '../types';
import { Users, Clock } from 'lucide-react';

interface AttendeeListProps {
  attendees: Attendee[];
}

export const AttendeeList: React.FC<AttendeeListProps> = ({ attendees }) => {
  return (
    <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-amber-200">
          <Users size={20} />
          <h2 className="text-xl font-serif font-semibold">Confirmed Attendees</h2>
        </div>
        <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-1 rounded-full border border-amber-500/30">
          {attendees.reduce((acc, curr) => acc + curr.guests, 0)} Total Guests
        </span>
      </div>

      {attendees.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-amber-100/40 py-10">
          <Users size={48} className="mb-2 opacity-20" />
          <p>Be the first to RSVP!</p>
        </div>
      ) : (
        <div className="flex-1 space-y-4 overflow-y-auto pr-2 max-h-[500px] scrollbar-thin scrollbar-thumb-amber-900 scrollbar-track-transparent">
          {attendees.map((attendee) => (
            <div 
              key={attendee.id}
              className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start justify-between group hover:bg-white/10 transition-colors animate-in slide-in-from-bottom-2 duration-300"
            >
              <div>
                <h4 className="font-semibold text-amber-100 group-hover:text-amber-400 transition-colors">
                  {attendee.name}
                </h4>
                <div className="flex items-center gap-3 text-xs text-amber-100/60 mt-1">
                  <span className="flex items-center gap-1">
                    <Users size={12} /> Party of {attendee.guests}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {new Date(attendee.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <CheckIcon />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
