/**
 * Smart Review Synthesis Engine
 * Generates natural, SEO-keyword-optimized 5-star reviews
 * based on the business profile, chosen service, and selected USPs.
 */

export function generateSmartReviews({ business, selectedService, selectedUsps = [], customNote = '' }) {
  const service = selectedService || (business.services && business.services[0]) || 'services';
  const name = business.name || 'this place';
  const keywords = business.targetKeywords || [];
  const usps = selectedUsps.length > 0 ? selectedUsps : (business.usps || []);

  // Pick random keywords and USPs to ensure unique reviews
  const pickKeyword = (index = 0) => keywords[index % keywords.length] || 'excellent service';
  const pickUsp = (index = 0) => usps[index % usps.length] || 'great experience';

  const kw1 = pickKeyword(0);
  const kw2 = pickKeyword(1);
  const kw3 = pickKeyword(2);
  const usp1 = pickUsp(0);
  const usp2 = pickUsp(1);

  // Template variations
  const templates = [
    {
      id: 'detailed',
      title: '🌟 Detailed & Highly Recommended',
      badge: 'Most Popular',
      text: `Had a wonderful 5-star experience at ${name}! I visited for ${service} and was genuinely impressed by their professionalism. Truly one of the ${kw1}. The entire team is courteous and ensures ${usp1}. The setup is top-notch with ${usp2}. Highly recommended to anyone looking for ${kw2}!`
    },
    {
      id: 'crisp',
      title: '⚡ Quick & High Impact',
      badge: 'Quick Post',
      text: `Outstanding service! Got my ${service} done here and the results exceeded expectations. Definitely the ${kw1} in town. Loved their ${usp1} and ${kw2}. 10/10 recommendation, will definitely visit again!`
    },
    {
      id: 'professional',
      title: '💼 Professional & Trustworthy',
      badge: 'Authentic',
      text: `Very satisfied with ${name}. Opted for ${service} and they handled everything with extreme care and expertise. What stands out is their ${usp1} and honest approach. If you are searching for ${kw1} or ${kw3}, this is the best place to go.`
    }
  ];

  // If custom user note was provided, append nicely
  if (customNote.trim()) {
    templates.forEach(t => {
      t.text += ` Special mention: ${customNote.trim()}`;
    });
  }

  return templates;
}

export async function generateGeminiReviews(apiKey, { business, selectedService, selectedUsps, customNote }) {
  if (!apiKey) {
    return generateSmartReviews({ business, selectedService, selectedUsps, customNote });
  }

  try {
    const prompt = `You are an expert review writer. Write 3 distinct, realistic, authentic 5-star Google reviews for "${business.name}" (${business.category}).
Service used: ${selectedService || 'general services'}
Target SEO keywords to blend naturally: ${business.targetKeywords ? business.targetKeywords.join(', ') : 'best service'}
Key highlights/USPs: ${selectedUsps ? selectedUsps.join(', ') : 'friendly staff, great quality'}
Customer note: ${customNote || 'none'}
Tone: ${business.brandTone || 'friendly & professional'}

Rules:
1. Make them sound 100% human, natural and genuine (not robotic or overly ad-like).
2. Format as a JSON array of 3 objects with keys: "id" (detailed/crisp/professional), "title" (short title), "badge" (tag), "text" (the review text).
3. Do not include markdown codeblocks, just raw JSON.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    });

    if (!response.ok) {
      console.warn('Gemini API returned error, falling back to smart engine');
      return generateSmartReviews({ business, selectedService, selectedUsps, customNote });
    }

    const data = await response.json();
    const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (rawJson) {
      const parsed = JSON.parse(rawJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Gemini call error:', err);
  }

  return generateSmartReviews({ business, selectedService, selectedUsps, customNote });
}
