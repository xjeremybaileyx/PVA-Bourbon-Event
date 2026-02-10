
import { Attendee } from '../types';

/**
 * GOOGLE APPS SCRIPT CODE FOR YOUR GOOGLE SHEET EXTENSION
 * Copy and paste the following into your Google Apps Script editor:
 * 
 * function doGet() {
 *   const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
 *   const data = sheet.getDataRange().getValues();
 *   const headers = data[0];
 *   const rows = data.slice(1);
 *   
 *   const attendees = rows.map(row => {
 *     let obj = {};
 *     headers.forEach((header, i) => {
 *       obj[header.toLowerCase().replace(/ /g, "")] = row[i];
 *     });
 *     return obj;
 *   });
 *   
 *   return ContentService.createTextOutput(JSON.stringify(attendees))
 *     .setMimeType(ContentService.MimeType.JSON);
 * }
 * 
 * function doPost(e) {
 *   const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
 *   const data = JSON.parse(e.postData.contents);
 *   
 *   // Ensure your sheet headers match these keys:
 *   // id, name, email, company, title, guests, dietarynotes, timestamp
 *   sheet.appendRow([
 *     data.id,
 *     data.name,
 *     data.email,
 *     data.company,
 *     data.title,
 *     data.guests,
 *     data.dietaryNotes || '',
 *     data.timestamp
 *   ]);
 *   
 *   return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
 * }
 */

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
        timestamp: Number(a.timestamp),
        // Ensure dietarynotes (lowercased by GAS example) maps back correctly
        dietaryNotes: a.dietarynotes || a.dietaryNotes || ''
      })).sort((a: any, b: any) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Sheets Sync Error:', error);
      throw error;
    }
  },

  async saveAttendee(config: DbConfig, attendee: Attendee): Promise<void> {
    if (!config.enabled || !config.url) return;

    try {
      await fetch(config.url, {
        method: 'POST',
        mode: 'no-cors', 
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(attendee),
      });
    } catch (error) {
      console.error('Sheets Save Error:', error);
      throw error;
    }
  }
};
