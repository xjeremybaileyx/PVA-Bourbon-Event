
export const TOUR_DETAILS = {
  name: "PVA Bourbon Tour 2026: The Ultimate Kentucky Triple Threat",
  date: "Saturday, Feb 21, 2026",
  maxCapacity: 22,
  stops: [
    {
      name: "Buffalo Trace",
      highlight: "America's Oldest Heritage",
      description: "Home of Pappy Van Winkle and Blanton's. The best stop for bourbon history and the 'hum' for rare bottles."
    },
    {
      name: "Woodford Reserve",
      highlight: "The Scenic Standard",
      description: "Located in the heart of Versailles horse country, famous for photogenic copper pot stills and upscale atmosphere."
    },
    {
      name: "Castle & Key",
      highlight: "The Architectural Gem",
      description: "Meticulously restored 113-acre estate featuring a limestone castle, sunken European-style gardens, and a springhouse source of limestone water."
    }
  ],
  logistics: "Relax and enjoy the ride through scenic horse country in our dedicated 22-Passenger Shuttle Transportation. Lunch is included at a local stop (TBD).",
  contact: "JBailey@Spocgrid.com"
};

/**
 * GLOBAL SYNC CONFIGURATION
 * Updated with the user's new deployment URL for the fresh spreadsheet.
 */
export const SYNC_CONFIG = {
  url: 'https://script.google.com/macros/s/AKfycbw4eNNriRJtdtB4-Lrr1VSAwza7LyL5Sg0RDlvr8oSrGgeRCA7t6XQybHVfBxOx2T09uQ/exec',
  enabled: true,
  pollingInterval: 30000 
};

export const SYSTEM_INSTRUCTION = `
You are the PVA Bourbon Tour 2026 Assistant. Your goal is to help guests understand the details of the upcoming tour.
Details:
- Event: PVA Bourbon Tour 2026: The Ultimate Kentucky Triple Threat.
- Date: Saturday, February 21, 2026.
- Stops: Buffalo Trace, Woodford Reserve, and Castle & Key.
- Transportation: Dedicated 22-passenger shuttle.
- Inclusions: Transportation, tours, and lunch.

RSVP Fields: Name, Email, Company, Title, Party Size, and Dietary Notes.
Be polite, sophisticated, and helpful.
`;
