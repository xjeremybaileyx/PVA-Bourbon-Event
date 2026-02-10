
import React, { useState } from 'react';
import { RSVPStatus, Attendee } from '../types';
import { User, Mail, Users, Utensils, Send, CheckCircle } from 'lucide-react';

interface RSVPFormProps {
  onRSVP: (attendee: Attendee) => void;
  remainingSeats: number;
}

export const RSVPForm: React.FC<RSVPFormProps> = ({ onRSVP, remainingSeats }) => {
  const [status, setStatus] = useState<RSVPStatus>(RSVPStatus.IDLE);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    guests: 1,
    dietary: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (remainingSeats < formData.guests) {
      alert("Not enough seats available for this group size.");
      return;
    }

    setStatus(RSVPStatus.SUBMITTING);
    
    // Simulate API call
    setTimeout(() => {
      const newAttendee: Attendee = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
        guests: formData.guests,
        dietaryNotes: formData.dietary,
        timestamp: Date.now()
      };
      
      onRSVP(newAttendee);
      setStatus(RSVPStatus.SUCCESS);
      setFormData({ name: '', email: '', guests: 1, dietary: '' });
    }, 1500);
  };

  if (status === RSVPStatus.SUCCESS) {
    return (
      <div className="bg-parchment p-10 rounded-2xl shadow-2xl border-2 border-amber-900/20 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        <h3 className="text-3xl font-serif font-bold text-amber-900 mb-2">Registration Confirmed!</h3>
        <p className="text-amber-800 mb-8">We've saved a spot for you on the shuttle. See you in Kentucky!</p>
        <button 
          onClick={() => setStatus(RSVPStatus.IDLE)}
          className="px-8 py-3 bg-amber-900 text-amber-50 rounded-lg hover:bg-amber-800 transition-colors font-semibold"
        >
          Add Another Guest
        </button>
      </div>
    );
  }

  const isSoldOut = remainingSeats <= 0;

  return (
    <div className="bg-parchment p-8 md:p-10 rounded-2xl shadow-2xl border-2 border-amber-900/20 copper-glow">
      <div className="flex justify-between items-start mb-8 border-b-2 border-amber-900/10 pb-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-amber-900">Secure Your Spot</h2>
          <p className="text-amber-700 italic">Join us for the 2026 Kentucky Triple Threat</p>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-tighter text-amber-900/60 font-bold">Remaining Seats</div>
          <div className={`text-3xl font-bold ${remainingSeats < 5 ? 'text-red-600' : 'text-amber-900'}`}>
            {isSoldOut ? 'SOLD OUT' : remainingSeats}
          </div>
        </div>
      </div>

      {isSoldOut ? (
        <div className="text-center py-10 bg-amber-900/5 rounded-xl border border-dashed border-amber-900/20">
          <p className="text-amber-900 font-semibold">We are currently at capacity.</p>
          <p className="text-amber-700 text-sm">Contact J. Bailey to be added to the waitlist.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-bold text-amber-900 flex items-center gap-2">
              <User size={16} /> Full Name
            </label>
            <input 
              required
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-white/50 border-2 border-amber-900/10 rounded-lg p-3 focus:outline-none focus:border-amber-600 transition-colors text-amber-900 placeholder-amber-900/40"
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-bold text-amber-900 flex items-center gap-2">
                <Mail size={16} /> Email Address
              </label>
              <input 
                required
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white/50 border-2 border-amber-900/10 rounded-lg p-3 focus:outline-none focus:border-amber-600 transition-colors text-amber-900 placeholder-amber-900/40"
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-amber-900 flex items-center gap-2">
                <Users size={16} /> Total in Party
              </label>
              <select 
                value={formData.guests}
                onChange={e => setFormData({...formData, guests: parseInt(e.target.value)})}
                className="w-full bg-white/50 border-2 border-amber-900/10 rounded-lg p-3 focus:outline-none focus:border-amber-600 transition-colors text-amber-900"
              >
                {[1, 2, 3, 4].map(num => (
                  <option key={num} value={num} disabled={num > remainingSeats}>
                    {num} {num === 1 ? 'Person' : 'People'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-amber-900 flex items-center gap-2">
              <Utensils size={16} /> Dietary Restrictions (Optional)
            </label>
            <textarea 
              value={formData.dietary}
              onChange={e => setFormData({...formData, dietary: e.target.value})}
              rows={2}
              className="w-full bg-white/50 border-2 border-amber-900/10 rounded-lg p-3 focus:outline-none focus:border-amber-600 transition-colors resize-none text-amber-900 placeholder-amber-900/40"
              placeholder="e.g. Gluten-free, Vegetarian, Nut allergies"
            />
          </div>

          <button 
            type="submit"
            disabled={status === RSVPStatus.SUBMITTING}
            className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${
              status === RSVPStatus.SUBMITTING 
                ? 'bg-amber-800/50 cursor-not-allowed' 
                : 'bg-gradient-to-br from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800'
            }`}
          >
            {status === RSVPStatus.SUBMITTING ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
            ) : (
              <>
                <Send size={18} />
                CONFIRM ATTENDANCE
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
