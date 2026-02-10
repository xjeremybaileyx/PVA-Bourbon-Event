
import { Attendee } from '../types';

/**
 * V4 HEADER-AWARE GOOGLE APPS SCRIPT (RESILIENT VERSION)
 * 
 * function doGet() {
 *   const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
 *   const data = sheet.getDataRange().getValues();
 *   if (data.length < 2) return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
 *   const headers = data[0].map(h => h.toString().trim()); 
 *   const rows = data.slice(1);
 *   const attendees = rows.map(row => {
 *     let obj = {};
 *     headers.forEach((header, i) => { if (header) obj[header] = row[i]; });
 *     return obj;
 *   });
 *   return ContentService.createTextOutput(JSON.stringify(attendees)).setMimeType(ContentService.MimeType.JSON);
 * }
 * 
 * function doPost(e) {
 *   try {
 *     const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
 *     const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(h => h.toString().trim());
 *     const data = JSON.parse(e.postData.contents);
 *     
 *     // This mapping ensures that no matter what the order of keys is in the JSON 
 *     // or what the order of columns is in the Sheet, the data lands correctly.
 *     const newRow = headers.map(header => {
 *       switch(header) {
 *         case 'id': return data.id || "";
 *         case 'name': return data.name || "";
 *         case 'company': return data.company || "";
 *         case 'title': return data.title || "";
 *         case 'email': return data.email || "";
 *         case 'guests': return data.guests || 1;
 *         case 'dietaryNotes': return data.dietaryNotes || "";
 *         case 'timestamp': return data.timestamp || Date.now();
 *         default: return "";
 *       }
 *     });
 *     
 *     sheet.appendRow(newRow);
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
      
      return data.map((a: any) => {
        // Robust Date Parsing
        let ts = Number(a.timestamp);
        if (isNaN(ts) || ts < 1000000) {
          const d = new Date(a.timestamp);
          ts = isNaN(d.getTime()) ? Date.now() : d.getTime();
        }

        // Defensive Guest Count (prevents timestamps from being read as guest numbers)
        let guestCount = Number(a.guests || 1);
        if (guestCount > 100) guestCount = 1;

        return {
          id: String(a.id || ''),
          name: String(a.name || ''),
          company: String(a.company || ''),
          title: String(a.title || ''),
          email: String(a.email || ''),
          guests: guestCount,
          timestamp: ts,
          dietaryNotes: String(a.dietaryNotes || a.dietarynotes || '')
        };
      })
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
