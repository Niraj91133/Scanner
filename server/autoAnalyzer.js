import os from 'os';
import { generateComprehensiveSeoPlan } from './seoEngine.js';

/**
 * Get Local Network IPv4 Address
 */
export function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

/**
 * Fetch and resolve URL (Follows redirects e.g. maps.app.goo.gl)
 */
export async function scrapeUrlMetadata(targetUrl) {
  try {
    const formattedUrl = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;
    
    // Fetch with redirect follow and standard browser headers
    const res = await fetch(formattedUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8'
      },
      redirect: 'follow'
    });

    const finalUrl = res.url;
    const htmlText = await res.text();

    // Extract Title
    const titleMatch = htmlText.match(/<title[^>]*>([^<]+)<\/title>/i);
    let title = titleMatch ? titleMatch[1].trim() : '';

    // Extract Meta Description
    const descMatch = htmlText.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                      htmlText.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
    let description = descMatch ? descMatch[1].trim() : '';

    // Extract OG Title & Description
    const ogTitleMatch = htmlText.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
    if (ogTitleMatch && !title) title = ogTitleMatch[1].trim();

    const ogDescMatch = htmlText.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
    if (ogDescMatch && !description) description = ogDescMatch[1].trim();

    return {
      finalUrl,
      title,
      description,
      rawHtmlPreview: htmlText.substring(0, 3000)
    };
  } catch (err) {
    console.warn('Scraping error (will use URL/text heuristic fallback):', err.message);
    return {
      finalUrl: targetUrl,
      title: '',
      description: '',
      rawHtmlPreview: ''
    };
  }
}

/**
 * Intelligent Business & SEO Profiler
 */
export async function analyzeAndProfileBusiness(input, apiKey = '') {
  const cleanInput = (input || '').trim();
  const isUrl = cleanInput.includes('http') || cleanInput.includes('maps.') || cleanInput.includes('.gl') || cleanInput.includes('.com') || cleanInput.includes('g.page');

  let scraped = { finalUrl: cleanInput, title: '', description: '' };
  
  if (isUrl) {
    scraped = await scrapeUrlMetadata(cleanInput);
  }

  // Determine business raw name and location clues
  let rawName = '';
  let locationClue = '';

  // 1. Try parsing from URL query parameters (e.g. ?q=Business+Name+City or ?query=...)
  if (isUrl) {
    try {
      const urlObj = new URL(scraped.finalUrl.startsWith('http') ? scraped.finalUrl : `https://${scraped.finalUrl}`);
      const qParam = urlObj.searchParams.get('q') || urlObj.searchParams.get('query') || urlObj.searchParams.get('search');
      if (qParam && !qParam.startsWith('loc:') && !qParam.startsWith('http')) {
        rawName = decodeURIComponent(qParam.replace(/\+/g, ' '));
      }
    } catch (e) {}

    // Check original input if finalUrl didn't have params
    if (!rawName && cleanInput !== scraped.finalUrl) {
      try {
        const origUrlObj = new URL(cleanInput.startsWith('http') ? cleanInput : `https://${cleanInput}`);
        const qParam = origUrlObj.searchParams.get('q') || origUrlObj.searchParams.get('query');
        if (qParam) {
          rawName = decodeURIComponent(qParam.replace(/\+/g, ' '));
        }
      } catch (e) {}
    }
  }

  // 2. Try parsing from Google Maps resolved final URL pathname (e.g. /maps/place/Business+Name/...)
  if (!rawName && scraped.finalUrl.includes('/place/')) {
    try {
      const placeSegment = scraped.finalUrl.split('/place/')[1];
      if (placeSegment) {
        const rawPlace = placeSegment.split('/')[0];
        rawName = decodeURIComponent(rawPlace.replace(/\+/g, ' '));
      }
    } catch (e) {}
  }

  // 3. Try parsing from Title tag (only if title is not generic "Google Maps" / "Consent")
  if (!rawName && scraped.title) {
    let cleanTitle = scraped.title
      .replace(/\s*-\s*Google Maps/gi, '')
      .replace(/\s*\|\s*Google Search/gi, '')
      .replace(/\s*-\s*Official Website/gi, '')
      .replace(/Before you continue to Google.*/gi, '')
      .replace(/^Google Maps$/gi, '')
      .trim();

    if (cleanTitle && cleanTitle.length > 2) {
      const commaParts = cleanTitle.split(',');
      rawName = commaParts[0].trim();
      if (commaParts.length > 1) {
        locationClue = commaParts.slice(1).join(', ').trim();
      }
    }
  }

  // 4. Fallback to user text input or clean domain name
  if (!rawName || rawName === 'Google Maps' || rawName === 'My Business Profile') {
    if (isUrl) {
      try {
        const parsed = new URL(cleanInput.startsWith('http') ? cleanInput : `https://${cleanInput}`);
        const domain = parsed.hostname.replace(/www\./i, '').split('.')[0];
        rawName = domain.charAt(0).toUpperCase() + domain.slice(1) + ' Business';
      } catch (e) {
        rawName = 'My Business Profile';
      }
    } else {
      rawName = cleanInput;
    }
  }

  // Extract known Indian / Global cities if present in text or locationClue
  const combinedText = `${rawName} ${locationClue} ${scraped.title} ${scraped.description}`.toLowerCase();
  const knownCities = [
    'delhi', 'noida', 'gurgaon', 'gurugram', 'ghaziabad', 'faridabad',
    'mumbai', 'pune', 'bangalore', 'bengaluru', 'hyderabad', 'chennai',
    'kolkata', 'ahmedabad', 'jaipur', 'lucknow', 'chandigarh', 'indore',
    'bhopal', 'patna', 'surat', 'nagpur', 'kanpur', 'varanasi', 'agra',
    'ludhiana', 'amritsar', 'vadodara', 'nashik', 'dehradun', 'rohini',
    'dwarka', 'south delhi', 'saket', 'indiranagar', 'koramangala', 'jubilee hills'
  ];

  let detectedCity = '';
  for (const city of knownCities) {
    if (combinedText.includes(city)) {
      detectedCity = city.charAt(0).toUpperCase() + city.slice(1);
      break;
    }
  }

  // Comprehensive Industry Taxonomy
  const INDUSTRY_RULES = [
    {
      keywords: ['dental', 'dentist', 'tooth', 'teeth', 'root canal', 'orthodont', 'implant', 'dant', 'braces', 'smile'],
      category: 'Dental Clinic & Oral Healthcare',
      logo: '🦷',
      color: '#0ea5e9',
      tagline: 'Advanced Painless Dental Care & Smile Makeover',
      services: ['Root Canal Treatment', 'Teeth Whitening', 'Dental Implants', 'Invisalign & Clear Braces', 'Teeth Cleaning & Scaling', 'Laser Tooth Extraction'],
      baseKeywords: ['best dentist', 'painless root canal treatment', 'affordable dental clinic', 'top dental implant specialist', 'hygienic dental clinic', 'best dental doctor'],
      usps: ['Zero Pain Laser Technology', '100% Sanitized & Clean Clinic', 'Senior Specialist Doctors', 'Pocket Friendly Pricing', 'Digital X-Ray & Diagnostics']
    },
    {
      keywords: ['salon', 'beauty', 'parlour', 'parlor', 'hair', 'spa', 'makeup', 'skin', 'facial', 'barber', 'keratin', 'botox', 'bridal', 'nails'],
      category: 'Luxury Unisex Salon & Beauty Spa',
      logo: '✂️',
      color: '#ec4899',
      tagline: 'Premium Hair Styling, Skin Glow & Bridal Studio',
      services: ['Keratin & Hair Botox Treatment', 'Hydra Facial & Skin Glow', 'Bridal & Party Makeup', 'Hair Spa & Smoothing', 'Global Hair Coloring & Highlights', 'Beard Grooming & Styling'],
      baseKeywords: ['best luxury salon', 'expert hair stylist', 'best hydra facial clinic', 'top bridal makeup artist', 'affordable unisex salon', 'top hair spa near me'],
      usps: ['Luxury Aesthetic Ambience', 'Certified Celebrity Stylists', '100% Genuine Branded Products', 'Complimentary Beverages', 'VIP Pampering Service']
    },
    {
      keywords: ['cafe', 'coffee', 'restaurant', 'food', 'pizza', 'bakery', 'bistro', 'dine', 'dhaba', 'kitchen', 'burger', 'bar', 'sweets', 'dessert'],
      category: 'Cafe, Restaurant & Culinary Dining',
      logo: '☕',
      color: '#f59e0b',
      tagline: 'Delicious Gourmet Food, Artisan Coffee & Cozy Vibe',
      services: ['Specialty Pour Over Coffee', 'Woodfired Neapolitan Pizza', 'Artisanal Pasta & Burgers', 'Freshly Baked Pastries & Cakes', 'Mocktails & Handcrafted Shakes', 'Work-Friendly Seating'],
      baseKeywords: ['best cafe', 'must visit restaurant', 'amazing specialty coffee and pizza', 'best aesthetic cafe for work', 'delicious food and quick service', 'top rated cafe near me'],
      usps: ['Cozy Aesthetic Ambience', 'High-Speed Free WiFi & Power Plugs', '100% Fresh Daily Ingredients', 'Courteous & Fast Service', 'Pocket Friendly Combos']
    },
    {
      keywords: ['gym', 'fitness', 'workout', 'crossfit', 'bodybuilding', 'trainer', 'yoga', 'pilates', 'muscle'],
      category: 'Gym, Fitness & Performance Studio',
      logo: '💪',
      color: '#10b981',
      tagline: 'State-of-the-Art Fitness, Strength & Transformation Club',
      services: ['Certified Personal Training', 'Crossfit & Functional HIIT', 'Weight Loss & Fat Burn Program', 'Strength & Muscle Building', 'Diet & Customized Nutrition Plans', 'Steam & Shower Facility'],
      baseKeywords: ['best gym', 'top personal gym trainer', 'modern imported gym equipment', 'best fitness center', 'weight loss gym near me', 'affordable gym membership'],
      usps: ['Certified Master Trainers', 'Imported Biomechanical Machines', 'Hygienic Showers & Lockers', 'High Energy Workout Vibe', 'Personalized Diet Coaching']
    },
    {
      keywords: ['car', 'auto', 'garage', 'mechanic', 'repair', 'detailing', 'tyre', 'tire', 'ceramic', 'coating', 'service center', 'vehicle', 'motor'],
      category: 'Automobile Service & Car Detailing Garage',
      logo: '🚗',
      color: '#ef4444',
      tagline: 'Expert Periodic Car Maintenance & Ceramic Detailing Studio',
      services: ['Complete Periodic Car Service', '9H Ceramic Coating & Paint Protection', 'Car AC Repair & Gas Refill', 'Laser Wheel Alignment & Balancing', 'Computerized Engine Diagnostics', 'Full Interior Foam Spa & Washing'],
      baseKeywords: ['best car service center', 'honest and trusted car mechanic', 'best car detailing and ceramic coating', 'affordable car repair garage', 'genuine spare parts car service'],
      usps: ['100% Genuine OEM Spare Parts', 'Transparent Live Video Updates', 'Free Doorstep Pickup & Drop', 'Quick Same-Day Turnaround', 'Warranty on All Repairs']
    },
    {
      keywords: ['hospital', 'clinic', 'doctor', 'physician', 'ortho', 'cardio', 'eye', 'pediatric', 'derma', 'skin clinic', 'health', 'pathology', 'lab'],
      category: 'Medical Clinic & Multispecialty Healthcare',
      logo: '🏥',
      color: '#3b82f6',
      tagline: 'Trusted Medical Diagnosis & Compassionate Patient Care',
      services: ['Senior Specialist Doctor Consultation', 'Computerized Pathology & Blood Tests', 'Complete Health Checkup Packages', 'Minor Surgical Procedures', 'Emergency & Pharmacy Care'],
      baseKeywords: ['best specialist doctor', 'trusted healthcare clinic', 'accurate computerized diagnosis', 'caring and polite medical staff', 'best multispecialty clinic near me'],
      usps: ['Highly Experienced Senior Doctors', 'Accurate Digital Lab Reports', 'Zero Waiting Time with Appointments', 'Transparent & Affordable Pricing']
    },
    {
      keywords: ['hotel', 'resort', 'stay', 'lodge', 'guest house', 'homestay', 'inn', 'rooms'],
      category: 'Luxury Hotel, Resort & Hospitality',
      logo: '🏨',
      color: '#8b5cf6',
      tagline: 'Comfortable Premium Stay, Dining & Event Venue',
      services: ['Deluxe Luxury Rooms & Suites', '24/7 In-Room Dining & Kitchen', 'Banquet & Conference Halls', 'Swimming Pool & Wellness Spa', 'Complimentary High-Speed WiFi'],
      baseKeywords: ['best luxury hotel', 'comfortable and clean hotel rooms', 'delicious multi-cuisine dining', 'polite and helpful hotel staff', 'best stay experience near me'],
      usps: ['Super Clean & Sanitized Rooms', '24/7 Room Service & Security', 'Prime Central Location', 'Complimentary Buffet Breakfast']
    },
    {
      keywords: ['store', 'shop', 'jeweller', 'jeweler', 'cloth', 'boutique', 'furniture', 'electronics', 'optician', 'retail', 'mart', 'supermarket'],
      category: 'Premium Retail Store & Shopping Showroom',
      logo: '🛍️',
      color: '#14b8a6',
      tagline: 'Curated Quality Products & Guaranteed Honest Pricing',
      services: ['Exclusive Designer Collection', 'Personalized Shopping Assistance', 'Same-Day Home Delivery', 'Custom Orders & Tailoring', 'Hassle-Free Warranty & Returns'],
      baseKeywords: ['best retail showroom', 'huge collection at wholesale price', 'honest and polite staff', 'genuine branded products', 'best shopping store near me'],
      usps: ['100% Guaranteed Genuine Products', 'Best Competitive Price in Market', 'Fast Home Delivery & Easy Exchange', 'Friendly Customer Support']
    }
  ];

  // Match best industry rule
  let matchedRule = null;
  for (const rule of INDUSTRY_RULES) {
    if (rule.keywords.some(k => combinedText.includes(k))) {
      matchedRule = rule;
      break;
    }
  }

  if (!matchedRule) {
    matchedRule = {
      category: 'Professional Services & Business',
      logo: '⭐',
      color: '#6366f1',
      tagline: 'Excellence in Customer Satisfaction & Premium Service',
      services: ['High Quality Service Delivery', 'Expert Consultation & Advice', 'Fast & Reliable Support', 'Customized Client Solutions', 'Hassle-Free Experience'],
      baseKeywords: ['best professional service', 'top rated company', 'honest and dependable staff', 'affordable pricing', 'highly recommended service near me'],
      usps: ['Experienced Industry Experts', 'Prompt & On-Time Execution', 'Transparent Pricing', '100% Customer Satisfaction Guaranteed']
    };
  }

  // --- High-Impact Local SEO Keywords Generator ---
  // Formula 1: [Base Keyword] in [City/Area] (e.g. "best dentist in Noida")
  // Formula 2: [Service] in [City/Area] (e.g. "painless root canal in Noida")
  // Formula 3: [Business Name] [City]
  // Formula 4: [Base Keyword] near me
  const locationTag = detectedCity || 'town';
  
  const generatedLocalSeoKeywords = [
    `${matchedRule.baseKeywords[0]} in ${locationTag}`,
    `${matchedRule.services[0]} in ${locationTag}`,
    `${matchedRule.services[1]} in ${locationTag}`,
    `best ${rawName} ${detectedCity}`.trim(),
    `${matchedRule.baseKeywords[1]} in ${locationTag}`,
    `${matchedRule.baseKeywords[2]}`
  ];

  // Clean business name
  const cleanName = rawName
    .replace(/^https?:\/\//i, '')
    .replace(/www\./i, '')
    .replace(/(\.com|\.in|\.org|\.net)/gi, '')
    .trim();

  // Create Slug
  const baseSlug = cleanName
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'biz';

  const slug = `${baseSlug}-${Math.floor(100 + Math.random() * 900)}`;

  // Formulate review link
  let googleReviewLink = scraped.finalUrl;
  if (!isUrl || !googleReviewLink.startsWith('http')) {
    googleReviewLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanName + ' ' + (detectedCity || ''))}`;
  }

  // Generate Comprehensive SEO Strategy Plan
  const seoPlan = generateComprehensiveSeoPlan({
    businessName: cleanName,
    category: matchedRule.category,
    city: detectedCity,
    services: matchedRule.services,
    scrapedContent: scraped.rawHtmlPreview
  });

  return {
    id: `biz-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    slug,
    name: cleanName,
    tagline: matchedRule.tagline,
    category: matchedRule.category,
    logo: matchedRule.logo,
    phone: '+91 98765 43210',
    address: detectedCity ? `Main Market, ${detectedCity}` : 'City Center, Main Road',
    city: detectedCity,
    googleReviewLink,
    placeId: '',
    services: matchedRule.services,
    targetKeywords: seoPlan.recommendedSelection,
    seoPlan,
    usps: matchedRule.usps,
    brandTone: 'Friendly & Professional',
    colorTheme: matchedRule.color,
    qrStyle: 'dots',
    createdAt: new Date().toISOString(),
    scanCount: 0,
    reviewClickCount: 0,
    autoDetected: true,
    scrapedUrl: isUrl ? cleanInput : null
  };
}
