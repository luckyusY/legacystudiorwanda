/**
 * Static marketing content sourced from the Legacy Studio company profile.
 * Editable here; gallery images are managed via the admin dashboard + Cloudinary.
 */

export const COMPANY = {
  name: "Legacy Studio",
  tagline: "Capturing moments, creating timeless visual art.",
  location: "KG 3 AVE Kacyiru, Kigali, Rwanda",
  email: "info@mylegacystudio.com",
  phone: "(250) 788 202 813",
  website: "mylegacystudio.com",
};

export const ABOUT = {
  intro:
    "Legacy Studio is a creative photography and media production company committed to capturing meaningful moments and transforming them into timeless visual art. Based in Rwanda, the studio blends creativity, storytelling, and technical expertise to produce high-quality photo and video content that reflects authenticity, emotion, and purpose.",
  body: "At the core of Legacy Studio's work is a deep understanding that every moment has a story worth preserving. By combining modern equipment, creative direction, and post-production expertise, we deliver polished, impactful imagery that enhances personal memories and strengthens brand presence.",
  mission: [
    "To capture life's most important moments with passion, creativity, and technical excellence.",
    "To provide clients with stunning photo and video experiences that reflect their personalities, emotions, and stories.",
    "To contribute to visual culture by producing authentic art that resonates far beyond the shutter click.",
  ],
  values: [
    {
      title: "Creativity & Quality",
      text: "Pushing artistic boundaries while maintaining professional standards.",
    },
    {
      title: "Client-Focused Service",
      text: "Treating every individual and project with care, respect, and responsiveness.",
    },
    {
      title: "Authenticity",
      text: "Capturing genuine moments that reflect real emotions and personal narratives.",
    },
    {
      title: "Professional Integrity",
      text: "Delivering work that clients can trust and proudly share.",
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
    title: "Portrait Photography",
    description: "Artistic captures that showcase individual beauty and personality.",
  },
  {
    slug: "wedding",
    title: "Wedding & Marriage Shoots",
    description: "Complete documentation of wedding days, from vows to celebrations.",
  },
  {
    slug: "event",
    title: "Event Photography",
    description: "Coverage of birthdays, corporate events, gatherings, and celebrations.",
  },
  {
    slug: "artistic",
    title: "Artistic Photography",
    description: "Creative sessions for themed or styled art projects.",
  },
  {
    slug: "commercial",
    title: "Commercial Photo & Video",
    description: "High-quality visuals for business branding and promotion.",
  },
  {
    slug: "maternity",
    title: "Maternity Shoots",
    description:
      "Documentation of your maternity journey, from glowing anticipation to welcoming your little one.",
  },
  {
    slug: "kids",
    title: "Kid's Photography",
    description: "Fun, full-day coverage for kids — from sweet little moments to all the laughter.",
  },
  {
    slug: "product",
    title: "Product Photography",
    description: "Full visual documentation of products, from key details to final presentation.",
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
  { title: "Consultation", text: "Understanding your vision, style preferences, and project needs." },
  { title: "Planning & Preparation", text: "Outlining the photo/video concept, locations, and shot list." },
  { title: "Creative Capture", text: "Using professional equipment and artistic direction for high-quality images." },
  { title: "Post-Production", text: "Expert editing and enhancement to bring out the best in every shot." },
  { title: "Delivery", text: "Sharing finished photos and videos in formats suited to your needs." },
];

export const WHY_US = [
  { title: "Experienced Team", text: "A creative group passionate about visual storytelling and capturing real, heartfelt moments." },
  { title: "Genuine Moments", text: "We focus on natural, candid photography that feels personal and timeless." },
  { title: "Client-Centric Guidance", text: "Professional support throughout the shoot, helping you feel comfortable and confident." },
  { title: "Proven Track Record", text: "Trusted by thousands of clients for quality work and memorable visual outcomes." },
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
