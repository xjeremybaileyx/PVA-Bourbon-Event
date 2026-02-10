
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
 * GOOGLE SHEETS SYNC CONFIGURATION
 * 1. Create a Google Sheet with headers: id, name, email, guests, dietaryNotes, timestamp
 * 2. Deploy Apps Script as Web App (Access: Anyone)
 * 3. Paste the URL below to sync all devices automatically.
 */
export const SYNC_CONFIG = {
  url: '', // PASTE YOUR SCRIPT URL HERE (e.g., https://script.google.com/macros/s/.../exec)
  enabled: true,
  pollingInterval: 30000 // Refresh list every 30 seconds
};

export const SYSTEM_INSTRUCTION = `
You are the PVA Bourbon Tour 2026 Assistant. Your goal is to help guests understand the details of the upcoming tour.
Details:
- Event: PVA Bourbon Tour 2026: The Ultimate Kentucky Triple Threat.
- Date: Saturday, February 21, 2026.
- Stops: Buffalo Trace (Heritage/Rare bottles), Woodford Reserve (Scenic/Copper stills), and Castle & Key (Castle/Limestone water).
- Transportation: Dedicated 22-passenger shuttle through horse country.
- Inclusions: Transportation, tours, and lunch at a local spot are included.
- Times: To Be Determined (TBD).
- Organizer Contact: JBailey@Spocgrid.com.

Be polite, sophisticated, and helpful. Use a warm, welcoming tone suitable for a luxury bourbon tour.
If asked about RSVPs, tell them they can use the form on this page.
`;
