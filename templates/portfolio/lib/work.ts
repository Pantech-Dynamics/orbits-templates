// The case studies. Each is a few sections of plain paragraphs; add one by adding an object.

export type Project = {
  slug: string;
  title: string;
  client: string;
  year: number;
  summary: string;
  role: string;
  outcome: string;
  /** Two colours for the cover, so the page needs no image files to start with. */
  colors: [string, string];
  sections: { heading: string; body: string[] }[];
};

export const WORK: Project[] = [
  {
    slug: "kudi-savings",
    title: "Saving made a habit",
    client: "Kudi",
    year: 2026,
    summary: "A savings app that grew weekly deposits by 38% by asking for less.",
    role: "Lead designer, with two engineers and a researcher",
    outcome: "+38% weekly deposits",
    colors: ["#0f766e", "#99f6e4"],
    sections: [
      {
        heading: "The problem",
        body: [
          "People opened Kudi to save, then stopped at a form with seven fields. Most never came back to finish it.",
          "Interviews showed the form wasn't the problem on its own: people didn't know how much to save, so every field felt like a test.",
        ],
      },
      {
        heading: "What we did",
        body: [
          "We cut the first step to a single question, how much a week, with three suggestions drawn from what people like them saved.",
          "Everything else moved to after the first deposit, when people had a reason to care about it.",
        ],
      },
      {
        heading: "What happened",
        body: ["Weekly deposits rose 38% in the first month, and the share of people who finished setting up doubled."],
      },
    ],
  },
  {
    slug: "clinic-booking",
    title: "Booking a doctor in one minute",
    client: "Sana Health",
    year: 2025,
    summary: "Appointment booking for a network of clinics, from twelve screens to three.",
    role: "Product designer",
    outcome: "Booking time from 6 minutes to 55 seconds",
    colors: ["#7c3aed", "#ddd6fe"],
    sections: [
      {
        heading: "The problem",
        body: ["Booking asked patients to choose a clinic, then a department, then a doctor, before they could see a single free time."],
      },
      {
        heading: "What we did",
        body: [
          "We turned it around: pick a time that suits you, and see who's free then, nearest first.",
          "Clinics, departments and doctors became filters you can reach for, not steps you have to climb.",
        ],
      },
      {
        heading: "What happened",
        body: ["The median booking dropped from six minutes to under one, and calls to the front desk fell by a third."],
      },
    ],
  },
  {
    slug: "fleet-dashboard",
    title: "A dashboard dispatchers trust",
    client: "Northwind Logistics",
    year: 2024,
    summary: "Live tracking for 400 delivery vans, designed for a twelve-hour shift.",
    role: "Design lead",
    outcome: "Late deliveries down 21%",
    colors: ["#c2410c", "#fed7aa"],
    sections: [
      {
        heading: "The problem",
        body: ["Dispatchers watched four screens of maps and spreadsheets, and late deliveries were spotted after customers called."],
      },
      {
        heading: "What we did",
        body: [
          "One screen, sorted by what needs a person now: vans running late, vans stopped too long, drivers who've asked for help.",
          "Everything on time stays quiet, so the exceptions stand out across the room.",
        ],
      },
      {
        heading: "What happened",
        body: ["Late deliveries fell 21% in a quarter, mostly because problems were seen while they could still be fixed."],
      },
    ],
  },
];

export const projectBySlug = (slug: string) => WORK.find((p) => p.slug === slug);
