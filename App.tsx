
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RSVPForm } from './components/RSVPForm';
import { AttendeeList } from './components/AttendeeList';
import { TourAssistant } from './components/TourAssistant';
import { Attendee } from './types';
import { TOUR_DETAILS } from './constants';
import { Info, MapPin } from 'lucide-react';

const App: React.FC = () => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pva-bourbon-tour-rsvps');
    if (saved) {
      try {
        setAttendees(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load RSVPs", e);
      }
    }
  }, []);

  // Save to local storage whenever attendees change
  useEffect(() => {
    localStorage.setItem('pva-bourbon-tour-rsvps', JSON.stringify(attendees));
  }, [attendees]);

  const handleRSVP = (newAttendee: Attendee) => {
    setAttendees(prev => [newAttendee, ...prev]);
  };

  const totalGuests = attendees.reduce((acc, curr) => acc + curr.guests, 0);
  const remainingSeats = TOUR_DETAILS.maxCapacity - totalGuests;

  return (
    <div className="min-h-screen text-amber-50 pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 -mt-10 pb-10">
        
        {/* Left Column: RSVP Form & Info */}
        <div className="lg:col-span-8 space-y-12">
          
          <RSVPForm 
            onRSVP={handleRSVP} 
            remainingSeats={remainingSeats} 
          />

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-serif font-bold text-amber-200 mb-6 flex items-center gap-2">
              <MapPin size={24} className="text-amber-500" />
              The Itinerary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TOUR_DETAILS.stops.map((stop, idx) => (
                <div key={idx} className="relative group">
                  <div className="text-amber-500 font-bold text-xs uppercase mb-2">Stop 0{idx + 1}</div>
                  <h3 className="text-lg font-bold text-amber-100 mb-1">{stop.name}</h3>
                  <div className="text-amber-300/80 text-sm font-serif italic mb-3">{stop.highlight}</div>
                  <p className="text-sm text-amber-100/60 leading-relaxed">
                    {stop.description}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-10 p-4 rounded-xl bg-amber-900/30 border border-amber-500/20 flex items-start gap-4">
              <Info className="text-amber-400 mt-1 shrink-0" size={20} />
              <div className="text-sm text-amber-200">
                <p className="font-bold mb-1">Travel Tips & Expectations</p>
                <p className="opacity-80">
                  Final tour times and the lunch schedule are currently being finalized. 
                  A local lunch stop is included. Contact {TOUR_DETAILS.contact} with urgent inquiries.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Guest List */}
        <div className="lg:col-span-4 h-full">
          <AttendeeList attendees={attendees} />
        </div>
      </main>

      {/* Decorative footer elements */}
      <footer className="max-w-7xl mx-auto px-6 pt-10 border-t border-white/10 text-center opacity-40 text-xs tracking-widest flex flex-col items-center gap-4">
        <div className="flex gap-8">
          <span>KENTUCKY BOURBON TRAIL</span>
          <span>EST. 2026</span>
          <span>SPOCGRID EVENTS</span>
        </div>
        <p>© 2026 PVA Bourbon Tour. All Rights Reserved.</p>
      </footer>

      {/* Floating AI Assistant */}
      <TourAssistant />
    </div>
  );
};

export default App;
