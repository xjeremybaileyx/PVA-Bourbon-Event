
export const TOUR_DETAILS = {
  name: "PVA Bourbon Tour 2026: The Ultimate Kentucky Triple Threat",
  date: "Saturday, Feb 21, 2026",
  maxCapacity: 22,
  stops: [
    {
      name: "Embassy Suites @ Rivercenter",
      highlight: "8:30am Departure",
      description: "Meet at the main entrance for a prompt 8:30am departure. Our luxury 22-passenger shuttle will be ready for boarding."
    },
    {
      name: "Four Roses Distillery",
      highlight: "10:00am - 11:00am",
      description: "Enjoy an exclusive private tasting session at the historic Four Roses distillery, featuring their unique 10-recipe bourbon process."
    },
    {
      name: "Lunch at Ricardo's",
      highlight: "11:30am - 12:30pm",
      description: "A scheduled break for a premium lunch at Ricardo's, allowing the group to relax and prepare for the afternoon tastings."
    },
    {
      name: "Woodford Reserve",
      highlight: "1:00pm - 2:30pm",
      description: "A private tour and tasting at the picturesque Woodford Reserve, the crown jewel of Kentucky's bourbon trail."
    },
    {
      name: "Castle & Key",
      highlight: "2:45pm - 3:30pm",
      description: "Curated cocktails followed by a self-guided walk of the historic distillery's breathtaking castle grounds and gardens."
    },
    {
      name: "Embassy Suites @ Rivercenter",
      highlight: "5:00pm Return",
      description: "The shuttle concludes the day back at the hotel, allowing guests to enjoy their evening in the Rivercenter area."
    }
  ],
  logistics: "Luxury 22-passenger transportation departs from Embassy Suites @ Rivercenter at 8:30am and returns at 5:00pm. All tastings, tours, and lunch are included.",
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
Detailed Schedule:
- 8:30am: Depart Embassy Suites @ Rivercenter.
- 10:00am - 11:00am: Four Roses Private Tasting.
- 11:30am - 12:30pm: Lunch at Ricardo's.
- 1:00pm - 2:30pm: Woodford Private Tour/Tasting.
- 2:45pm - 3:30pm: Castle & Key Cocktails with self-guided walk of the grounds.
- 5:00pm: Return to Embassy Suites @ Rivercenter.

Pickup/Drop-off Location: Embassy Suites @ Rivercenter.
Transportation: Dedicated 22-passenger shuttle.
RSVP Fields: Name, Email, Company, Title, Party Size, and Dietary Notes.
Be polite, sophisticated, and helpful. Mention J. Bailey as the contact if guests have complex questions.
`;
