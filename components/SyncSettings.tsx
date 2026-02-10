
import React, { useState } from 'react';
import { Settings, X, Table, ExternalLink, HelpCircle } from 'lucide-react';
import { DbConfig } from '../services/dbService';

interface SyncSettingsProps {
  config: DbConfig;
  onSave: (config: DbConfig) => void;
}

export const SyncSettings: React.FC<SyncSettingsProps> = ({ config, onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localConfig, setLocalConfig] = useState<DbConfig>(config);

  const handleSave = () => {
    onSave(localConfig);
    setIsOpen(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-amber-200/60 hover:text-amber-200"
        title="Sync Settings"
      >
        <Settings size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-parchment w-full max-w-md rounded-2xl shadow-2xl border-2 border-amber-900/20 overflow-hidden">
            <div className="bg-amber-900 p-6 text-amber-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Table size={20} className="text-amber-400" />
                <h2 className="text-xl font-serif font-bold">Google Sheets Sync</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:text-amber-400">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="bg-amber-900/5 p-4 rounded-xl border border-amber-900/10 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <HelpCircle size={16} />
                  How to sync across devices:
                </div>
                <ol className="text-xs text-amber-800/70 space-y-1 list-decimal ml-4">
                  <li>Create a Google Sheet and Apps Script.</li>
                  <li>Deploy your script as a <b>Web App</b>.</li>
                  <li>Set access to <b>"Anyone"</b>.</li>
                  <li>Paste the <b>Web App URL</b> below.</li>
                </ol>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-amber-900/10">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${localConfig.enabled ? 'bg-amber-700 text-white' : 'bg-amber-200 text-amber-900'}`}>
                    <Table size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-amber-900">Sync Enabled</div>
                    <div className="text-[10px] text-amber-800/60 uppercase tracking-tighter">Save data to Google Sheets</div>
                  </div>
                </div>
                <button 
                  onClick={() => setLocalConfig({...localConfig, enabled: !localConfig.enabled})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${localConfig.enabled ? 'bg-amber-900' : 'bg-amber-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${localConfig.enabled ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              {localConfig.enabled && (
                <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-amber-900/60 uppercase tracking-widest flex justify-between">
                      <span>Google Script URL</span>
                      <ExternalLink size={12} className="opacity-40" />
                    </label>
                    <input 
                      type="text"
                      value={localConfig.url}
                      onChange={e => setLocalConfig({...localConfig, url: e.target.value})}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="w-full bg-white border-2 border-amber-900/10 rounded-lg p-3 text-amber-900 text-sm focus:outline-none focus:border-amber-700"
                    />
                  </div>
                </div>
              )}

              <button 
                onClick={handleSave}
                className="w-full py-4 bg-amber-900 text-white rounded-xl font-bold hover:bg-amber-800 transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                SAVE & SYNC NOW
              </button>
              
              <p className="text-[10px] text-center text-amber-900/40 uppercase tracking-widest leading-relaxed">
                Configure this on both your phone and browser<br/>to keep your guest list in sync.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
