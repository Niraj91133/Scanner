import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateSmartReviews, generateGeminiReviews } from './reviewEngine.js';
import { analyzeAndProfileBusiness, getLocalIpAddress } from './autoAnalyzer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'data', 'db.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper to read DB
async function readDb() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return { businesses: [], stats: { totalScans: 0, totalReviewsClicked: 0 }, settings: {} };
  }
}

// Helper to write DB
async function writeDb(data) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to db.json:', err);
  }
}

// Helper to generate unique slug
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);
}

// --- ROUTES ---

// 0. Get Network Info (Local IP & Live Public HTTPS URL for mobile QR codes)
app.get('/api/network-info', (req, res) => {
  const localIp = getLocalIpAddress();
  const publicUrl = process.env.PUBLIC_URL || 'https://auto-review-boost-pro.loca.lt';
  res.json({
    localIp,
    frontendPort: 5173,
    backendPort: PORT,
    publicUrl,
    qrBaseUrl: publicUrl
  });
});

// 1. Get stats & summary
app.get('/api/stats', async (req, res) => {
  const db = await readDb();
  const totalBusinesses = db.businesses.length;
  const totalScans = db.businesses.reduce((acc, b) => acc + (b.scanCount || 0), 0);
  const totalReviewsClicked = db.businesses.reduce((acc, b) => acc + (b.reviewClickCount || 0), 0);
  const conversionRate = totalScans > 0 ? ((totalReviewsClicked / totalScans) * 100).toFixed(1) + '%' : '0%';

  res.json({
    totalBusinesses,
    totalScans,
    totalReviewsClicked,
    conversionRate,
    topPerformers: [...db.businesses].sort((a, b) => (b.scanCount || 0) - (a.scanCount || 0)).slice(0, 5)
  });
});

// 2. Get all businesses
app.get('/api/businesses', async (req, res) => {
  const db = await readDb();
  res.json(db.businesses);
});

// 3. Get single business by ID or Slug (Used by Scanner page)
app.get('/api/businesses/:identifier', async (req, res) => {
  const { identifier } = req.params;
  const db = await readDb();
  const business = db.businesses.find(b => b.id === identifier || b.slug === identifier);
  
  if (!business) {
    return res.status(404).json({ error: 'Business not found' });
  }
  res.json(business);
});

// 3.5 Auto-Onboard Magic Endpoint (Resolves Google Maps link or Name -> Auto-generates full profile)
app.post('/api/auto-onboard', async (req, res) => {
  try {
    const { input } = req.body;
    if (!input || !input.trim()) {
      return res.status(400).json({ error: 'Please enter a Google Business link or Business Name' });
    }

    const db = await readDb();
    const apiKey = db.settings?.geminiApiKey || process.env.GEMINI_API_KEY || '';
    
    // Perform deep URL scrape & AI profiling
    const generatedProfile = await analyzeAndProfileBusiness(input, apiKey);

    db.businesses.unshift(generatedProfile);
    await writeDb(db);

    res.status(201).json(generatedProfile);
  } catch (err) {
    console.error('Error auto-onboarding business:', err);
    res.status(500).json({ error: 'Auto-onboarding failed' });
  }
});

// 4. Create new business (Onboarding form or Admin creation)
app.post('/api/businesses', async (req, res) => {
  try {
    const db = await readDb();
    const payload = req.body;

    if (!payload.name || !payload.name.trim()) {
      return res.status(400).json({ error: 'Business Name is required' });
    }

    const baseSlug = payload.slug || payload.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Ensure slug is unique
    let slug = baseSlug;
    let counter = 1;
    while (db.businesses.some(b => b.slug === slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const newBusiness = {
      id: `biz-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      slug,
      name: payload.name.trim(),
      tagline: payload.tagline || '',
      category: payload.category || 'General Services',
      logo: payload.logo || '⭐',
      phone: payload.phone || '',
      address: payload.address || '',
      googleReviewLink: payload.googleReviewLink || '',
      placeId: payload.placeId || '',
      services: Array.isArray(payload.services) ? payload.services : (payload.services ? payload.services.split(',').map(s => s.trim()).filter(Boolean) : []),
      targetKeywords: Array.isArray(payload.targetKeywords) ? payload.targetKeywords : (payload.targetKeywords ? payload.targetKeywords.split(',').map(k => k.trim()).filter(Boolean) : []),
      usps: Array.isArray(payload.usps) ? payload.usps : (payload.usps ? payload.usps.split(',').map(u => u.trim()).filter(Boolean) : []),
      brandTone: payload.brandTone || 'Friendly & Professional',
      colorTheme: payload.colorTheme || '#0ea5e9',
      qrStyle: payload.qrStyle || 'dots',
      createdAt: new Date().toISOString(),
      scanCount: 0,
      reviewClickCount: 0
    };

    db.businesses.unshift(newBusiness);
    await writeDb(db);

    res.status(201).json(newBusiness);
  } catch (err) {
    console.error('Error creating business:', err);
    res.status(500).json({ error: 'Failed to create business' });
  }
});

// 5. Update existing business
app.put('/api/businesses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await readDb();
    const index = db.businesses.findIndex(b => b.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Business not found' });
    }

    const updated = {
      ...db.businesses[index],
      ...req.body,
      services: Array.isArray(req.body.services) ? req.body.services : (req.body.services ? req.body.services.split(',').map(s => s.trim()).filter(Boolean) : db.businesses[index].services),
      targetKeywords: Array.isArray(req.body.targetKeywords) ? req.body.targetKeywords : (req.body.targetKeywords ? req.body.targetKeywords.split(',').map(k => k.trim()).filter(Boolean) : db.businesses[index].targetKeywords),
      usps: Array.isArray(req.body.usps) ? req.body.usps : (req.body.usps ? req.body.usps.split(',').map(u => u.trim()).filter(Boolean) : db.businesses[index].usps),
      id: db.businesses[index].id // keep immutable ID
    };

    db.businesses[index] = updated;
    await writeDb(db);

    res.json(updated);
  } catch (err) {
    console.error('Error updating business:', err);
    res.status(500).json({ error: 'Failed to update business' });
  }
});

// 6. Delete business
app.delete('/api/businesses/:id', async (req, res) => {
  const { id } = req.params;
  const db = await readDb();
  const initialLength = db.businesses.length;
  db.businesses = db.businesses.filter(b => b.id !== id);

  if (db.businesses.length === initialLength) {
    return res.status(404).json({ error: 'Business not found' });
  }

  await writeDb(db);
  res.json({ success: true, message: 'Business deleted successfully' });
});

// 7. Track Scan Event
app.post('/api/businesses/:identifier/track-scan', async (req, res) => {
  const { identifier } = req.params;
  const db = await readDb();
  const business = db.businesses.find(b => b.id === identifier || b.slug === identifier);

  if (business) {
    business.scanCount = (business.scanCount || 0) + 1;
    await writeDb(db);
    return res.json({ success: true, scanCount: business.scanCount });
  }
  res.status(404).json({ error: 'Business not found' });
});

// 8. Track Review Click Event
app.post('/api/businesses/:identifier/track-review-click', async (req, res) => {
  const { identifier } = req.params;
  const db = await readDb();
  const business = db.businesses.find(b => b.id === identifier || b.slug === identifier);

  if (business) {
    business.reviewClickCount = (business.reviewClickCount || 0) + 1;
    await writeDb(db);
    return res.json({ success: true, reviewClickCount: business.reviewClickCount });
  }
  res.status(404).json({ error: 'Business not found' });
});

// 9. Generate AI Reviews
app.post('/api/generate-reviews', async (req, res) => {
  try {
    const { business, selectedService, selectedUsps, customNote } = req.body;
    const db = await readDb();
    const apiKey = db.settings?.geminiApiKey || process.env.GEMINI_API_KEY || '';

    const reviews = await generateGeminiReviews(apiKey, {
      business,
      selectedService,
      selectedUsps,
      customNote
    });

    res.json({ reviews });
  } catch (err) {
    console.error('Error generating reviews:', err);
    res.status(500).json({ error: 'Review generation failed' });
  }
});

// 10. Settings endpoint
app.get('/api/settings', async (req, res) => {
  const db = await readDb();
  res.json(db.settings || {});
});

app.post('/api/settings', async (req, res) => {
  const db = await readDb();
  db.settings = { ...db.settings, ...req.body };
  await writeDb(db);
  res.json({ success: true, settings: db.settings });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ReviewBoost Server running on http://0.0.0.0:${PORT}`);
});
