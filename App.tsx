
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { RSVPForm } from './components/RSVPForm';
import { AttendeeList } from './components/AttendeeList';
import { TourAssistant } from './components/TourAssistant';
import { SyncSettings } from './components/SyncSettings';
import { Attendee } from './types';
import { TOUR_DETAILS } from './constants';
import { MapPin, Table, RefreshCw, AlertCircle } from 'lucide-react';
import { dbService, DbConfig } from './services/dbService';

const App: React.FC = () => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dbConfig, setDbConfig] = useState<DbConfig>(() => {
    const saved = localStorage.getItem('pva-bourbon-db-config');
    // Default to the original structure but adapted for Sheets
    return saved ? JSON.parse(saved) : { url: '', enabled: false };
  });

  const loadData = useCallback(async (config: DbConfig) => {
    setIsSyncing(true);
    setError(null);
    try {
      if (config.enabled && config.url) {
        const cloudData = await dbService.fetchAttendees(config);
        setAttendees(cloudData);
      } else {
        const saved = localStorage.getItem('pva-bourbon-tour-rsvps');
        if (saved) setAttendees(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Load failed", e);
      setError("Sync failed. Check your Script URL.");
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    loadData(dbConfig);
  }, [loadData, dbConfig]);

  const handleRSVP = async (newAttendee: Attendee) => {
    if (dbConfig.enabled && dbConfig.url) {
      setIsSyncing(true);
      try {
        await dbService.saveAttendee(dbConfig, newAttendee);
        await loadData(dbConfig); // Refresh from sheet
      } catch (e) {
        console.error("Cloud save failed", e);
        // Fallback: Save locally if cloud fails
        const updated = [newAttendee, ...attendees];
        setAttendees(updated);
        localStorage.setItem('pva-bourbon-tour-rsvps', JSON.stringify(updated));
      } finally {
        setIsSyncing(false);
      }
    } else {
      const updated = [newAttendee, ...attendees];
      setAttendees(updated);
      localStorage.setItem('pva-bourbon-tour-rsvps', JSON.stringify(updated));
    }
  };

  const handleClear = () => {
    if (confirm("This will clear the list on THIS device. It won't delete rows from your Google Sheet.")) {
      setAttendees([]);
      localStorage.removeItem('pva-bourbon-tour-rsvps');
    }
  };

  const updateConfig = (newConfig: DbConfig) => {
    setDbConfig(newConfig);
    localStorage.setItem('pva-bourbon-db-config', JSON.stringify(newConfig));
  };

  const totalGuests = attendees.reduce((acc, curr) => acc + curr.guests, 0);
  const remainingSeats = TOUR_DETAILS.maxCapacity - totalGuests;

  return (
    <div className="min-h-screen text-amber-50 pb-20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-end items-center gap-4 relative z-50">
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-[10px] font-bold uppercase bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/30 animate-pulse">
            <AlertCircle size={12} />
            {error}
          </div>
        )}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${
          dbConfig.enabled ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
        }`}>
          {isSyncing ? <RefreshCw size={12} className="animate-spin" /> : <Table size={12} />}
          {dbConfig.enabled ? 'Google Sheets Sync' : 'Local Mode'}
        </div>
        <SyncSettings config={dbConfig} onSave={updateConfig} />
      </div>

      <Header />

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 -mt-10 pb-10">
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
          </section>
        </div>

        <div className="lg:col-span-4 h-full">
          <AttendeeList 
            attendees={attendees} 
            onClear={handleClear} 
            isCloud={dbConfig.enabled}
            onRefresh={() => loadData(dbConfig)}
          />
        </div>
      </main>

      <TourAssistant />
    </div>
  );
};

export default App;
