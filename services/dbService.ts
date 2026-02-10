
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
      // Use text/plain to avoid CORS preflight (OPTIONS request) 
      // which Google Apps Script doesn't natively handle well.
      await fetch(config.url, {
        method: 'POST',
        mode: 'no-cors', // Important for Google Apps Script redirection
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(attendee),
      });
      
      // Since no-cors doesn't allow reading response, we assume success 
      // if no network error occurred.
    } catch (error) {
      console.error('Sheets Save Error:', error);
      throw error;
    }
  }
};
