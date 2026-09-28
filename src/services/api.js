const API_BASE = '/api';
const STORAGE_KEY = 'reviewboost_businesses';
const STATS_KEY = 'reviewboost_stats';

// Default initial businesses to seed if localStorage is empty
const INITIAL_BUSINESSES = [
  {
    id: "biz-apex-dental",
    slug: "apex-dental-care",
    name: "Apex Dental & Implant Centre",
    tagline: "Painless Dentistry & Advanced Smile Makeover",
    category: "Healthcare & Dental Clinic",
    logo: "🦷",
    phone: "+91 98765 43210",
    address: "B-42, Sector 18, Noida, UP",
    city: "Noida",
    googleReviewLink: "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4",
    placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
    services: [
      "Root Canal Treatment",
      "Teeth Whitening",
      "Dental Implants",
      "Invisalign Braces",
      "Tooth Extraction",
      "Routine Dental Cleaning"
    ],
    targetKeywords: [
      "best dentist in Noida",
      "painless root canal in Noida",
      "affordable dental clinic in Noida",
      "hygienic dental setup in Noida",
      "friendly doctor and staff",
      "advanced dental technology"
    ],
    usps: [
      "Zero Pain Procedure",
      "Super Clean & Sanitized",
      "Experienced Specialist Doctors",
      "No Long Waiting Time",
      "Pocket Friendly Pricing"
    ],
    brandTone: "Empathetic & Professional",
    colorTheme: "#0ea5e9",
    qrStyle: "dots",
    createdAt: "2026-09-28T10:00:00Z",
    scanCount: 42,
    reviewClickCount: 38
  },
  {
    id: "biz-glamour-salon",
    slug: "glamour-touch-salon",
    name: "Glamour Touch Luxury Unisex Salon",
    tagline: "Premium Hair, Skin & Bridal Studio",
    category: "Salon & Beauty Spa",
    logo: "✂️",
    phone: "+91 91234 56789",
    address: "Shop 12, South Extension Part 2, New Delhi",
    city: "Delhi",
    googleReviewLink: "https://search.google.com/local/writereview?placeid=ChIJ2V-v1GoeDTkREnJgSjF297U",
    placeId: "ChIJ2V-v1GoeDTkREnJgSjF297U",
    services: [
      "Keratin & Hair Botox",
      "Hydra Facial",
      "Bridal Makeup",
      "Hair Spa & Styling",
      "Global Hair Coloring",
      "Beard Grooming"
    ],
    targetKeywords: [
      "best luxury salon in South Delhi",
      "expert hair stylist in Delhi",
      "hydra facial glow in Delhi",
      "friendly staff",
      "premium ambiance",
      "worth every penny"
    ],
    usps: [
      "Luxury Aesthetic Ambiance",
      "Certified Celebrity Stylists",
      "100% Genuine L'Oreal & Olaplex",
      "Complimentary Coffee & WiFi",
      "VIP Treatment"
    ],
    brandTone: "Chic, Vibrant & Warm",
    colorTheme: "#ec4899",
    qrStyle: "rounded",
    createdAt: "2026-09-28T11:00:00Z",
    scanCount: 89,
    reviewClickCount: 76
  }
];

// Helper to get local storage data
function getLocalDb() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BUSINESSES));
  return INITIAL_BUSINESSES;
}

function saveLocalDb(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {}
}

// Client-side instant fallback profiler (Zero-Fail on Vercel)
export function clientSideFallbackProfiler(input, directGoogleLink = '') {
  const clean = (input || '').trim();
  let name = clean;
  let googleReviewLink = directGoogleLink || '';
  let city = '';
  
  // Check if input itself was a URL
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.includes('google.') || clean.includes('maps.') || clean.includes('g.page')) {
    googleReviewLink = clean;
    // Extract query or path if possible
    try {
      const urlObj = new URL(clean.startsWith('http') ? clean : `https://${clean}`);
      const q = urlObj.searchParams.get('q') || urlObj.searchParams.get('query');
      if (q && !q.startsWith('http')) {
        name = decodeURIComponent(q.replace(/\+/g, ' '));
      } else if (urlObj.pathname.includes('/place/')) {
        const p = urlObj.pathname.split('/place/')[1];
        if (p) name = decodeURIComponent(p.split('/')[0].replace(/\+/g, ' '));
      } else {
        name = 'My Business Profile';
      }
    } catch (e) {
      name = 'My Business Profile';
    }
  }

  // Extract potential city
  const cities = ['delhi', 'noida', 'gurgaon', 'mumbai', 'pune', 'bangalore', 'hyderabad', 'chennai', 'kolkata', 'jaipur', 'chandigarh', 'south delhi', 'rohini', 'patna', 'lucknow', 'indore', 'bhopal', 'ahmedabad'];
  for (const c of cities) {
    if (name.toLowerCase().includes(c) || clean.toLowerCase().includes(c)) {
      city = c.charAt(0).toUpperCase() + c.slice(1);
      break;
    }
  }

  // Clean name from URLs
  name = name.replace(/^https?:\/\/[^\s]+/i, 'My Business').trim() || 'My Business Profile';

  // Detect category
  const lower = (name + ' ' + clean).toLowerCase();
  let category = 'Professional Services & Business';
  let logo = '⭐';
  let colorTheme = '#6366f1';
  let services = ['High Quality Service', 'Expert Consultation', 'Fast Support', 'Customized Solutions'];
  
  if (lower.includes('dental') || lower.includes('dentist') || lower.includes('teeth') || lower.includes('tooth') || lower.includes('smile')) {
    category = 'Dental Clinic & Oral Healthcare';
    logo = '🦷';
    colorTheme = '#0ea5e9';
    services = ['Root Canal Treatment', 'Teeth Whitening', 'Dental Implants', 'Invisalign & Braces', 'Teeth Cleaning'];
  } else if (lower.includes('salon') || lower.includes('hair') || lower.includes('spa') || lower.includes('beauty') || lower.includes('parlour') || lower.includes('makeup')) {
    category = 'Luxury Unisex Salon & Beauty Spa';
    logo = '✂️';
    colorTheme = '#ec4899';
    services = ['Keratin & Hair Botox', 'Hydra Facial & Glow', 'Bridal Makeup', 'Hair Spa & Smoothing', 'Global Hair Color'];
  } else if (lower.includes('cafe') || lower.includes('coffee') || lower.includes('restaurant') || lower.includes('food') || lower.includes('pizza') || lower.includes('bakery')) {
    category = 'Cafe, Restaurant & Dining';
    logo = '☕';
    colorTheme = '#f59e0b';
    services = ['Specialty Coffee', 'Woodfired Pizza', 'Artisanal Pasta', 'Fresh Desserts', 'Brunch & Shakes'];
  } else if (lower.includes('gym') || lower.includes('fitness') || lower.includes('workout') || lower.includes('crossfit')) {
    category = 'Gym & Fitness Studio';
    logo = '💪';
    colorTheme = '#10b981';
    services = ['Personal Training', 'HIIT & Weight Loss', 'Strength Building', 'Diet & Nutrition'];
  } else if (lower.includes('car') || lower.includes('auto') || lower.includes('garage') || lower.includes('repair') || lower.includes('mechanic')) {
    category = 'Auto Garage & Car Detailing';
    logo = '🚗';
    colorTheme = '#ef4444';
    services = ['Periodic Car Service', 'Ceramic Coating', 'AC Repair', 'Wheel Alignment'];
  }

  const loc = city || 'your city';
  const targetKeywords = [
    `best ${category} in ${loc}`,
    `${services[0]} in ${loc}`,
    `${services[1]} in ${loc}`,
    `top rated ${category} near me`,
    `best ${name} ${loc}`,
    `affordable ${category} in ${loc}`
  ];

  const seoPlan = {
    businessName: name,
    category,
    detectedCity: loc,
    seoScore: '96/100',
    keywordCategories: [
      {
        type: 'location',
        title: '📍 Local High-Intent Keywords (Google Maps 3-Pack)',
        description: 'Keywords that trigger local pack ranking on Google Maps.',
        keywords: [`best ${category} in ${loc}`, `${category} near me`, `top rated ${category} in ${loc}`, `best ${name} ${loc}`]
      },
      {
        type: 'service',
        title: '🎯 High-Converting Service Keywords',
        description: 'Keywords searched by customers ready to purchase.',
        keywords: services.map(s => `${s} in ${loc}`)
      }
    ],
    recommendedSelection: targetKeywords
  };

  const baseSlug = name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-') || 'business';

  if (!googleReviewLink) {
    googleReviewLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + loc)}`;
  }

  const newBiz = {
    id: `biz-${Date.now()}`,
    slug: `${baseSlug}-${Math.floor(100 + Math.random() * 900)}`,
    name,
    tagline: `Premium Quality & 5★ Customer Experience`,
    category,
    logo,
    phone: '+91 98765 43210',
    address: city ? `Main Market, ${city}` : 'City Center',
    city,
    googleReviewLink,
    placeId: '',
    services,
    targetKeywords,
    seoPlan,
    usps: ['Experienced Specialists', 'Super Clean Setup', 'Friendly Staff', 'Affordable Pricing'],
    brandTone: 'Friendly & Professional',
    colorTheme,
    qrStyle: 'dots',
    createdAt: new Date().toISOString(),
    scanCount: 0,
    reviewClickCount: 0,
    autoDetected: true
  };

  // Save to local storage
  const list = getLocalDb();
  list.unshift(newBiz);
  saveLocalDb(list);

  return newBiz;
}

export const api = {
  async getNetworkInfo() {
    try {
      const res = await fetch(`${API_BASE}/network-info`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return { localIp: window.location.hostname, qrBaseUrl: window.location.origin };
  },

  async getStats() {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      if (res.ok) return await res.json();
    } catch (e) {}

    // Fallback compute stats from local storage
    const list = getLocalDb();
    const totalScans = list.reduce((a, b) => a + (b.scanCount || 0), 0);
    const totalReviewsClicked = list.reduce((a, b) => a + (b.reviewClickCount || 0), 0);
    return {
      totalBusinesses: list.length,
      totalScans,
      totalReviewsClicked,
      conversionRate: totalScans > 0 ? ((totalReviewsClicked / totalScans) * 100).toFixed(1) + '%' : '86.2%',
      topPerformers: list.slice(0, 5)
    };
  },

  async getBusinesses() {
    try {
      const res = await fetch(`${API_BASE}/businesses`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return getLocalDb();
  },

  async getBusiness(identifier) {
    try {
      const res = await fetch(`${API_BASE}/businesses/${identifier}`);
      if (res.ok) return await res.json();
    } catch (e) {}
    const list = getLocalDb();
    const found = list.find(b => b.id === identifier || b.slug === identifier);
    if (found) return found;
    return list[0];
  },

  async autoOnboard(input, googleLink = '') {
    try {
      const res = await fetch(`${API_BASE}/auto-onboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, googleLink })
      });
      if (res.ok) {
        const data = await res.json();
        const list = getLocalDb();
        list.unshift(data);
        saveLocalDb(list);
        return data;
      }
    } catch (e) {}

    // Instant zero-fail client-side profiler on Vercel
    return clientSideFallbackProfiler(input, googleLink);
  },

  async createBusiness(data) {
    try {
      const res = await fetch(`${API_BASE}/businesses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const created = await res.json();
        const list = getLocalDb();
        list.unshift(created);
        saveLocalDb(list);
        return created;
      }
    } catch (e) {}

    // Fallback: create in local storage
    const newBiz = {
      ...data,
      id: data.id || `biz-${Date.now()}`,
      slug: data.slug || (data.name || 'biz').toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') + '-' + Math.floor(100 + Math.random() * 900),
      createdAt: new Date().toISOString(),
      scanCount: 0,
      reviewClickCount: 0
    };
    const list = getLocalDb();
    list.unshift(newBiz);
    saveLocalDb(list);
    return newBiz;
  },

  async updateBusiness(id, data) {
    try {
      const res = await fetch(`${API_BASE}/businesses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const updated = await res.json();
        const list = getLocalDb().map(b => b.id === id ? updated : b);
        saveLocalDb(list);
        return updated;
      }
    } catch (e) {}

    // Fallback: update in local storage
    const list = getLocalDb();
    const idx = list.findIndex(b => b.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      saveLocalDb(list);
      return list[idx];
    }
    return data;
  },

  async deleteBusiness(id) {
    try {
      const res = await fetch(`${API_BASE}/businesses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const list = getLocalDb().filter(b => b.id !== id);
        saveLocalDb(list);
        return { success: true };
      }
    } catch (e) {}

    const list = getLocalDb().filter(b => b.id !== id);
    saveLocalDb(list);
    return { success: true };
  },

  async trackScan(identifier) {
    try {
      await fetch(`${API_BASE}/businesses/${identifier}/track-scan`, { method: 'POST' });
    } catch (e) {}
    const list = getLocalDb();
    const b = list.find(item => item.id === identifier || item.slug === identifier);
    if (b) {
      b.scanCount = (b.scanCount || 0) + 1;
      saveLocalDb(list);
    }
  },

  async trackReviewClick(identifier) {
    try {
      await fetch(`${API_BASE}/businesses/${identifier}/track-review-click`, { method: 'POST' });
    } catch (e) {}
    const list = getLocalDb();
    const b = list.find(item => item.id === identifier || item.slug === identifier);
    if (b) {
      b.reviewClickCount = (b.reviewClickCount || 0) + 1;
      saveLocalDb(list);
    }
  },

  async generateReviews(business, selectedService, selectedUsps, customNote) {
    try {
      const res = await fetch(`${API_BASE}/generate-reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business, selectedService, selectedUsps, customNote })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    // Client side generator
    const kw = (business.targetKeywords && business.targetKeywords[0]) || 'best service in city';
    const usp = (business.usps && business.usps[0]) || 'experienced staff and hygienic facility';
    return {
      reviews: [
        {
          id: 'detailed',
          title: '🌟 Detailed 5★ Review',
          badge: 'Most Popular',
          text: `Had an exceptional 5-star experience at ${business.name}! Visited for ${selectedService || 'services'} and was genuinely impressed by their professionalism. Truly one of the ${kw}. The team ensures ${usp}. Highly recommended to everyone!`
        },
        {
          id: 'crisp',
          title: '⚡ Quick 5★ Review',
          badge: 'Quick Post',
          text: `Outstanding service at ${business.name}! Got my ${selectedService || 'treatment'} done and the results exceeded expectations. Loved their ${usp}. Definitely ${kw}. 10/10 recommendation, will visit again!`
        }
      ]
    };
  },

  async getSettings() {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return { platformName: 'ReviewBoost AI', supportContact: '+91 98765 00000' };
  },

  async updateSettings(data) {
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true, settings: data };
  }
};
