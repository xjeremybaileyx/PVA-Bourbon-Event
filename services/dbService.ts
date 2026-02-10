
import { Attendee } from '../types';

export interface DbConfig {
  url: string;
  enabled: boolean;
}

export const dbService = {
  async fetchAttendees(config: DbConfig): Promise<Attendee[]> {
    if (!config.enabled || !config.url) return [];
    
    try {
      const response = await fetch(config.url, {
        method: 'GET',
        cache: 'no-store'
      });
      
      if (!response.ok) throw new Error('Failed to fetch from Google Sheets');
      
      const data = await response.json();
      return data.map((a: any) => ({
        ...a,
        guests: Number(a.guests),
        timestamp: Number(a.timestamp)
      })).sort((a: any, b: any) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Sheets Sync Error:', error);
      throw error;
    }
  },

  async saveAttendee(config: DbConfig, attendee: Attendee): Promise<void> {
    if (!config.enabled || !config.url) return;

    try {
      // Use text/plain for POST to avoid CORS preflight issues with Apps Script
      await fetch(config.url, {
        method: 'POST',
        mode: 'no-cors', 
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(attendee),
      });
      // no-cors means we can't read the response, so we proceed assuming success
    } catch (error) {
      console.error('Sheets Save Error:', error);
      throw error;
    }
  }
};
