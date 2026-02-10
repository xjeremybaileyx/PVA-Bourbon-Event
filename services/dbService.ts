
import { Attendee } from '../types';

/**
 * UPDATED GOOGLE APPS SCRIPT CODE - COPY AND PASTE THIS
 * 
 * function doGet() {
 *   const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
 *   const data = sheet.getDataRange().getValues();
 *   if (data.length < 2) return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
 *   const headers = data[0]; 
 *   const rows = data.slice(1);
 *   const attendees = rows.map(row => {
 *     let obj = {};
 *     headers.forEach((header, i) => { if (header) obj[header.toString().trim()] = row[i]; });
 *     return obj;
 *   });
 *   return ContentService.createTextOutput(JSON.stringify(attendees)).setMimeType(ContentService.MimeType.JSON);
 * }
 * 
 * function doPost(e) {
 *   try {
 *     const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
 *     const data = JSON.parse(e.postData.contents);
 *     // Order: A:id, B:name, C:company, D:title, E:email, F:guests, G:dietaryNotes, H:timestamp
 *     sheet.appendRow([
 *       data.id || "",
 *       data.name || "",
 *       data.company || "",
 *       data.title || "",
 *       data.email || "",
 *       data.guests || 1,
 *       data.dietaryNotes || "",
 *       data.timestamp || Date.now()
 *     ]);
 *     return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
 *   } catch (err) {
 *     return ContentService.createTextOutput("Error: " + err.message).setMimeType(ContentService.MimeType.TEXT);
 *   }
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
        id: String(a.id || ''),
        name: String(a.name || ''),
        company: String(a.company || ''),
        title: String(a.title || ''),
        email: String(a.email || ''),
        guests: Number(a.guests || 0),
        timestamp: Number(a.timestamp || 0),
        // Handle variations in header naming gracefully
        dietaryNotes: a.dietaryNotes || a.dietarynotes || ''
      }))
      .filter((a: any) => a.id && a.name)
      .sort((a: any, b: any) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Sheets Sync Error:', error);
      throw error;
    }
  },

  async saveAttendee(config: DbConfig, attendee: Attendee): Promise<void> {
    if (!config.enabled || !config.url) return;

    try {
      // Use text/plain to avoid preflight issues with Google Apps Script
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
