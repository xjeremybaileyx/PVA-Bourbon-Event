
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { RSVPForm } from './components/RSVPForm';
import { AttendeeList } from './components/AttendeeList';
import { TourAssistant } from './components/TourAssistant';
import { SyncSettings } from './components/SyncSettings';
import { Attendee } from './types';
import { TOUR_DETAILS, SYNC_CONFIG } from './constants';
import { MapPin, RefreshCw, AlertCircle, ShieldCheck, Globe } from 'lucide-react';
import { dbService, DbConfig } from './services/dbService';

const App: React.FC = () => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Manage database configuration state
  const [dbConfig, setDbConfig] = useState<DbConfig>(() => {
    // CRITICAL: If a global URL is hardcoded in constants, it MUST take precedence
    // This ensures your phone/mobile gets the config automatically from the code.
    if (SYNC_CONFIG.url) {
      return { 
        url: SYNC_CONFIG.url, 
        enabled: SYNC_CONFIG.enabled 
      };
    }
    
    // Fallback to local storage only if no global URL is provided
    const saved = localStorage.getItem('pva-bourbon-db-config');
    if (saved) return JSON.parse(saved);
    
    return { 
      url: '', 
      enabled: false 
    };
  });

  const isCloudEnabled = !!dbConfig.url && dbConfig.enabled;

  const loadData = useCallback(async () => {
    if (!isCloudEnabled) {
      const saved = localStorage.getItem('pva-bourbon-tour-rsvps');
      if (saved) setAttendees(JSON.parse(saved));
      setIsSyncing(false);
      return;
    }

    setIsSyncing(true);
    try {
      const cloudData = await dbService.fetchAttendees(dbConfig);
      setAttendees(cloudData);
      setError(null);
    } catch (e) {
      console.error("Load failed", e);
      setError("Sync connectivity issue.");
      // Fallback to local if cloud fails
      const saved = localStorage.getItem('pva-bourbon-tour-rsvps');
      if (saved) setAttendees(JSON.parse(saved));
    } finally {
      setIsSyncing(false);
    }
  }, [isCloudEnabled, dbConfig]);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Automatic Polling to keep the list updated for all users
  useEffect(() => {
    if (!isCloudEnabled) return;
    
    const interval = setInterval(() => {
      loadData();
    }, SYNC_CONFIG.pollingInterval);

    return () => clearInterval(interval);
  }, [isCloudEnabled, loadData]);

  const handleRSVP = async (newAttendee: Attendee) => {
    if (isCloudEnabled) {
      setIsSyncing(true);
      try {
        await dbService.saveAttendee(dbConfig, newAttendee);
        // Add locally for instant UI feedback
        setAttendees(prev => [newAttendee, ...prev]);
        // Refresh from sheet after a short delay to confirm
        setTimeout(loadData, 2000);
      } catch (e) {
        console.error("Cloud save failed", e);
        setError("Error saving to master list.");
        // Fallback save locally
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

  const updateConfig = (newConfig: DbConfig) => {
    setDbConfig(newConfig);
    localStorage.setItem('pva-bourbon-db-config', JSON.stringify(newConfig));
  };

  const totalGuests = attendees.reduce((acc, curr) => acc + curr.guests, 0);
  const remainingSeats = TOUR_DETAILS.maxCapacity - totalGuests;

  return (
    <div className="min-h-screen text-amber-50 pb-20">
      {/* Global Status & Settings Bar */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-end items-center gap-4 relative z-50">
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-[10px] font-bold uppercase bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/30">
            <AlertCircle size={12} />
            {error}
          </div>
        )}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${
          isCloudEnabled ? 'bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.1)]' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
        }`}>
          {isSyncing ? <RefreshCw size={12} className="animate-spin" /> : (isCloudEnabled ? <ShieldCheck size={12} /> : <Globe size={12} />)}
          {isCloudEnabled ? 'Live Master List' : 'Local Offline Mode'}
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
              {TOUR_DETAILS.stops.map((stop, idx) => {
                // Check if this is a stop (middle items) or departure/return (ends)
                const isFirst = idx === 0;
                const isLast = idx === TOUR_DETAILS.stops.length - 1;
                const isNumberedStop = !isFirst && !isLast;

                return (
                  <div key={idx} className="relative group">
                    <div className="text-amber-500 font-bold text-xs uppercase mb-2">
                      {isNumberedStop ? `Stop 0${idx}` : (isFirst ? 'Departure' : 'Arrival')}
                    </div>
                    <h3 className="text-lg font-bold text-amber-100 mb-1">{stop.name}</h3>
                    <div className="text-amber-300/80 text-sm font-serif italic mb-3">{stop.highlight}</div>
                    <p className="text-sm text-amber-100/60 leading-relaxed">
                      {stop.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 h-full">
          <AttendeeList 
            attendees={attendees} 
            isCloud={isCloudEnabled}
            onRefresh={loadData}
          />
        </div>
      </main>

      <TourAssistant />
    </div>
  );
};

export default App;
