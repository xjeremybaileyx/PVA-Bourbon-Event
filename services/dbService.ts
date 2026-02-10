
import { Attendee } from '../types';

export interface DbConfig {
  url: string;
  enabled: boolean;
}

export const dbService = {
  /**
   * Fetches data from Google Sheets via the Apps Script Web App.
   * Note: Apps Script GET requests usually return JSON directly.
   */
  async fetchAttendees(config: DbConfig): Promise<Attendee[]> {
    if (!config.enabled || !config.url) return [];
    
    try {
      const response = await fetch(config.url);
      if (!response.ok) throw new Error('Failed to fetch from Google Sheets');
      
      const data = await response.json();
      // Ensure guests is a number as Sheets might return it as a string
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

  /**
   * Saves data to Google Sheets via the Apps Script Web App.
   * Apps Script handles POST via the doPost(e) function.
   */
  async saveAttendee(config: DbConfig, attendee: Attendee): Promise<void> {
    if (!config.enabled || !config.url) return;

    try {
      // Google Apps Script requires text/plain or no content-type for CORS sometimes, 
      // but standard JSON POST usually works if the script is deployed correctly.
      const response = await fetch(config.url, {
        method: 'POST',
        body: JSON.stringify(attendee),
      });

      // Apps Script might return a 302 redirect which fetch follows.
      // Success is usually indicated by a 200 after redirect.
      if (!response.ok && response.status !== 0) {
        throw new Error('Failed to save to Google Sheets');
      }
    } catch (error) {
      console.error('Sheets Save Error:', error);
      // We don't throw here so the app can fallback to local storage
      throw error;
    }
  }
};
