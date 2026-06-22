/**
 * Static marketing content sourced from the Legacy Studio company profile.
 * Editable here; gallery images are managed via the admin dashboard + Cloudinary.
 */

export const COMPANY = {
  name: "Legacy Studio",
  tagline: "Where moments become heirlooms.",
  location: "KG 3 AVE Kacyiru, Kigali, Rwanda",
  email: "info@mylegacystudio.com",
  phone: "(250) 788 202 813",
  website: "mylegacystudio.com",
};

export const ABOUT = {
  intro:
    "Legacy Studio is a photography and film studio in Kigali, built on a simple belief: the moments that shape a life deserve to be kept beautifully. We photograph weddings, milestones and brands with an eye for the quiet, in-between feeling that makes an image worth returning to.",
  body: "From the first conversation to the final gallery, we direct gently, light with intention, and edit with restraint — so the people in the frame, and the feeling of the day, are exactly what you remember. Made in Rwanda, made to last.",
  mission: [
    "Photograph the moments that matter with honesty, artistry and care.",
    "Give every client images that feel like them — never a template.",
    "Make pictures worth keeping for a generation, not just a scroll.",
  ],
  values: [
    {
      title: "Craft First",
      text: "We chase the frame no one else noticed — then finish it to an exacting standard.",
    },
    {
      title: "People, Not Poses",
      text: "Calm direction and real attention, so you feel at ease the moment the lens is up.",
    },
    {
      title: "Honest Frames",
      text: "Genuine emotion over stiff formality. We keep what's true to the day.",
    },
    {
      title: "Quietly Reliable",
      text: "On time, prepared and dependable — work you can hand down and show off.",
    },
  ],
};

export interface Service {
  slug: string;
  title: string;
  description: string;
}

export const SERVICES: Service[] = [
  {
    slug: "portrait",
    title: "Portraiture",
    description: "Portraits that look like you on your most honest, most confident day.",
  },
  {
    slug: "wedding",
    title: "Weddings",
    description: "From the first look to the last dance — your day, told in full.",
  },
  {
    slug: "event",
    title: "Events",
    description: "Birthdays, corporate and celebrations, covered with a documentary eye.",
  },
  {
    slug: "artistic",
    title: "Artistic Sessions",
    description: "Concept-led, styled shoots for when you want something made with intent.",
  },
  {
    slug: "commercial",
    title: "Commercial & Brand",
    description: "Photo and video that make a brand look as good as it actually is.",
  },
  {
    slug: "maternity",
    title: "Maternity",
    description: "The glow before the arrival — tender, unhurried, and yours to keep.",
  },
  {
    slug: "kids",
    title: "Children & Family",
    description: "Unscripted, joyful coverage that keeps up with the little ones.",
  },
  {
    slug: "product",
    title: "Product",
    description: "Clean, considered product imagery that earns the click.",
  },
];

export interface PackageTier {
  name: string;
  price?: string;
  lines: string[];
  bonus?: string;
}

export interface PackageGroup {
  category: string;
  description?: string;
  tiers: PackageTier[];
}

export const INDOOR_PACKAGES: PackageGroup[] = [
  {
    category: "Gold",
    tiers: [
      {
        name: "Gold",
        lines: [
          "5 Photos — 35k",
          "10 Photos — 60k",
          "15 Photos — 90k",
          "20 Photos — 115k",
          "25 Photos — 170k",
        ],
        bonus: "Bonus from 20 photos: 1 A3 Frame",
      },
    ],
  },
  {
    category: "Platinum",
    tiers: [
      {
        name: "Platinum",
        lines: [
          "10 Photos — 100k",
          "15 Photos — 140k",
          "20 Photos — 185k",
          "25 Photos — 220k",
        ],
        bonus: "Bonus from 20 photos: 1 A3 Frame",
      },
    ],
  },
  {
    category: "Arts Photoshoot",
    tiers: [
      {
        name: "Arts Photoshoot",
        lines: ["5 Photos — 60k", "10 Photos — 110k", "25 Photos — 260k"],
        bonus: "Includes makeup for 1 person & a small decoration. Bonus from 25 photos: 1 A2 Frame",
      },
    ],
  },
  {
    category: "Creative Photos",
    tiers: [
      {
        name: "Creative Photos",
        price: "from 300k",
        lines: [
          "Private session between 1 & 3 hours",
          "New construction, materials, makeup, decor & reels",
        ],
      },
    ],
  },
];

export const OUTDOOR_PACKAGES: PackageGroup[] = [
  {
    category: "Birthdays",
    tiers: [
      {
        name: "Birthdays",
        lines: [
          "Photoshoot — 100k / 12 Photos",
          "Birthday Party — 200k",
          "Birthday Photo & Video highlights — 300k",
        ],
      },
    ],
  },
  {
    category: "Baptism",
    tiers: [
      {
        name: "Baptism",
        lines: [
          "Baptism only photos — 100k",
          "Baptism Photos + Album — 200k",
          "Baptism Photos + Video Highlights — 350k",
        ],
      },
    ],
  },
  {
    category: "Bridal Shower",
    tiers: [
      {
        name: "Bridal Shower",
        lines: [
          "Bridal Shower Photos — 100k / per hour",
          "Bridal Shower Photos & Video highlights — 350k",
        ],
      },
    ],
  },
  {
    category: "Baby Shower",
    tiers: [
      {
        name: "Baby Shower",
        lines: [
          "Baby Shower photos — 100k / per hour",
          "Baby Shower Photos & Video Highlights — 200k",
        ],
      },
    ],
  },
  {
    category: "Proposal",
    tiers: [
      {
        name: "Proposal",
        lines: [
          "Proposal Photos & Video highlights (couple) — 300k",
          "Proposal Party Photos & Video highlights — 400k",
        ],
      },
    ],
  },
  {
    category: "Funeral",
    tiers: [
      {
        name: "Funeral",
        lines: [
          "Funeral Photos — 100k",
          "Funeral Photos & Videos — 200k",
          "Funeral Videos + Photos + Album — 350k",
        ],
      },
    ],
  },
  {
    category: "Graduation",
    tiers: [
      {
        name: "Graduation",
        lines: [
          "Graduation Photos — 100k / per hour",
          "Graduation Photos & Videos highlights — 300k",
        ],
      },
    ],
  },
];

export const WEDDING_PACKAGES: PackageTier[] = [
  {
    name: "Civil Wedding",
    price: "700k",
    lines: [
      "Photobook",
      "1 × A2 Frame",
      "Soft photos on flash disk",
      "Video highlight",
      "1 videographer & 1 photographer",
    ],
  },
  {
    name: "Traditional Wedding",
    price: "1.5M",
    lines: [
      "Photobook",
      "Traditional photoshoot",
      "Wedding video shoot & highlights",
      "1 × A1 Frame",
      "Full video & photos (soft) on flash disk",
      "Live streaming",
      "2 photographers & 2 videographers",
    ],
  },
  {
    name: "Church & Reception",
    price: "2M",
    lines: [
      "Photobook & Album",
      "Pre-wedding photoshoot",
      "Video shoot & highlights",
      "2 × A1 Frames",
      "Full video & photos (soft) on flash disk",
      "Live streaming",
      "3 photographers & 3 videographers",
    ],
  },
  {
    name: "Basic",
    price: "2.5M",
    lines: [
      "Photobook — Civil wedding & Video Highlights",
      "Full video & highlights — Traditional wedding",
      "Church & Reception wedding",
      "2 × A2 Frames",
      "All soft photos & video on flash disk",
      "2 photographers & 2 videographers",
    ],
  },
  {
    name: "Premium",
    price: "3.5M",
    lines: [
      "Photobook + Album — Civil wedding & Video Highlights",
      "Pre-wedding & video highlight",
      "Full video & highlights — Traditional wedding",
      "Church & Reception wedding",
      "2 × A1 Frames",
      "All soft photos & video on flash disk",
      "3 photographers & 3 videographers",
      "Live streaming · Fog (smoke machine)",
    ],
  },
  {
    name: "Ultimate",
    price: "4.5M",
    lines: [
      "2 Photobooks · 1 Album for parents",
      "Civil wedding & Video Highlights",
      "Pre-wedding & video highlight",
      "Full video & highlights + reels",
      "Traditional, Church & Reception wedding",
      "2 × A0 Frames · Drone · Fog (smoke machine)",
      "Full HD photos & video on flash disk",
      "Team of 10 (photographers & videographers)",
      "Live streaming",
    ],
  },
];

export const PROCESS = [
  { title: "Conversation", text: "We start with you — the day, the people, the feeling you want to keep." },
  { title: "The Plan", text: "Concept, locations and a loose shot list, so nothing that matters is missed." },
  { title: "The Shoot", text: "Calm, confident direction and intentional light. You relax; we work." },
  { title: "The Edit", text: "Careful colour and retouching that flatters without ever feeling false." },
  { title: "The Gallery", text: "Your finished images, delivered ready to print, share and treasure." },
];

export const WHY_US = [
  { title: "A Practised Eye", text: "Years behind the lens at weddings, brands and milestones across Rwanda." },
  { title: "Candid by Nature", text: "We work for the real, unguarded moments — the ones you'll actually frame." },
  { title: "You, at Ease", text: "Gentle guidance throughout, so being photographed never feels like work." },
  { title: "Trusted Hands", text: "Thousands of frames delivered, and clients who come back for the next chapter." },
];

export const EXPRESS_NOTICE =
  "Any work expected within 2 days is considered express work and may incur additional charges (2.5k per photo). We recommend scheduling your sessions a few days before your expected date (birthday, graduation, baby shower, etc.) so our editors have enough time for a seamless process.";

/** Gallery categories used for filtering portfolio images. */
export const GALLERY_CATEGORIES = [
  "All",
  "Portrait",
  "Wedding",
  "Event",
  "Maternity",
  "Kids",
  "Product",
  "Artistic",
] as const;

export const BOOKING_SERVICES = SERVICES.map((s) => s.title);
