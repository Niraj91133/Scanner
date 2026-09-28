import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Sparkles, 
  Check, 
  Copy, 
  ExternalLink, 
  RotateCw, 
  ShieldCheck, 
  MapPin, 
  Zap,
  CheckCircle2,
  ThumbsUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

export default function CustomerReviewView({ business, onBackToAdmin }) {
  if (!business) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: '#fff' }}>
        <h2>No Business Selected</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Please select a business from the admin dashboard to preview.</p>
        {onBackToAdmin && (
          <button onClick={onBackToAdmin} className="btn btn-primary" style={{ marginTop: 20 }}>
            Back to Admin
          </button>
        )}
      </div>
    );
  }

  const [rating, setRating] = useState(5);
  const [selectedService, setSelectedService] = useState(business.services?.[0] || 'Services');
  const [reviewText, setReviewText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Track scan on load
  useEffect(() => {
    if (business?.slug || business?.id) {
      api.trackScan(business.slug || business.id);
    }
  }, [business?.id]);

  // Generate / Load review text automatically
  const loadReview = async (serviceName) => {
    setIsGenerating(true);
    const chosenService = serviceName || selectedService;
    
    try {
      const res = await api.generateReviews(business, chosenService, business.usps || [], '');
      if (res.reviews && res.reviews.length > 0) {
        setReviewText(res.reviews[0].text);
      }
    } catch (err) {
      // Fallback
      const kw = (business.targetKeywords && business.targetKeywords[0]) || 'best service';
      const usp = (business.usps && business.usps[0]) || 'great experience';
      setReviewText(`Had a wonderful 5-star experience at ${business.name}! Took their ${chosenService} and was genuinely impressed. Truly one of the ${kw}. The team ensures ${usp}. Highly recommended!`);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    loadReview(selectedService);
  }, [business]);

  const handleServiceChange = (service) => {
    setSelectedService(service);
    loadReview(service);
  };

  const handle1TapPost = async () => {
    // 1. Copy text to clipboard
    try {
      await navigator.clipboard.writeText(reviewText);
    } catch (err) {
      console.warn('Clipboard copy error:', err);
    }

    // 2. Track click
    api.trackReviewClick(business.slug || business.id);

    // 3. Show confetti
    setCopiedSuccess(true);
    confetti({
      particleCount: 140,
      spread: 80,
      origin: { y: 0.6 }
    });

    // 4. Open direct Google review writing box
    const targetUrl = business.googleReviewLink || `https://search.google.com/local/writereview?placeid=${business.placeId || 'ChIJN1t_tDeuEmsRUsoyG83frY4'}`;

    setTimeout(() => {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }, 600);
  };

  return (
    <div style={{
      maxWidth: 480,
      margin: '16px auto 60px',
      padding: '0 16px',
      fontFamily: 'var(--font-body)'
    }}>
      
      {/* Mobile Card Container */}
      <div className="glass-card" style={{
        padding: '28px 24px',
        borderRadius: 28,
        border: '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: '0 30px 70px rgba(0, 0, 0, 0.7)',
        background: 'linear-gradient(180deg, rgba(23, 23, 37, 0.98), rgba(11, 15, 25, 0.99))'
      }}>

        {/* Business Header */}
        <div style={{ textAlign: 'center', paddingBottom: 18, borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{
            width: 68,
            height: 68,
            borderRadius: 20,
            margin: '0 auto 12px',
            background: `linear-gradient(135deg, ${business.colorTheme || '#6366f1'}, #4338ca)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.4rem',
            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)'
          }}>
            {business.logo || '⭐'}
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              {business.name}
            </h1>
            <ShieldCheck size={18} color="#38bdf8" />
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
            {business.tagline || business.category}
          </p>

          {/* 5-Star Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            padding: '4px 14px',
            borderRadius: 999
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fbbf24' }}>5.0 Rating</span>
            <div style={{ display: 'flex', color: '#fbbf24', fontSize: '1rem', letterSpacing: '1px' }}>
              ★★★★★
            </div>
          </div>
        </div>

        {/* Optional Service Switcher Chips */}
        {business.services && business.services.length > 0 && (
          <div style={{ marginTop: 18 }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              SELECT SERVICE (OPTIONAL):
            </label>
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
              {business.services.map((service, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleServiceChange(service)}
                  className={`chip ${selectedService === service ? 'active' : ''}`}
                  style={{ fontSize: '0.78rem', whiteSpace: 'nowrap', padding: '5px 12px' }}
                >
                  {selectedService === service && <Check size={12} />}
                  {service}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ready-to-Post Review Box */}
        <div style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={15} color="#fbbf24" /> Auto-Generated 5★ Review
            </label>
            <button
              type="button"
              onClick={() => loadReview(selectedService)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.72rem', padding: '3px 8px' }}
              disabled={isGenerating}
            >
              <RotateCw size={11} className={isGenerating ? 'spin-anim' : ''} />
              {isGenerating ? 'Generating...' : 'Shuffle'}
            </button>
          </div>

          <div style={{ position: 'relative' }}>
            <textarea
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="form-textarea"
              style={{
                fontSize: '0.88rem',
                lineHeight: 1.5,
                padding: '12px 14px',
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                borderRadius: 14,
                color: '#f8fafc',
                resize: 'none'
              }}
            />
            <span style={{
              position: 'absolute',
              bottom: 8,
              right: 12,
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              pointerEvents: 'none'
            }}>
              ✏️ Tap to edit if needed
            </span>
          </div>
        </div>

        {/* Big 1-Tap CTA Button */}
        <div style={{ marginTop: 22 }}>
          <button
            type="button"
            onClick={handle1TapPost}
            className="btn btn-gold btn-lg pulse-glow"
            style={{
              width: '100%',
              fontSize: '1.12rem',
              fontWeight: 900,
              padding: '16px 20px',
              borderRadius: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              boxShadow: '0 8px 30px rgba(245, 158, 11, 0.5)'
            }}
          >
            <Star size={22} fill="#111827" />
            Post 5★ Review on Google
            <ExternalLink size={18} />
          </button>
        </div>

        {/* Instant Guide on Tap */}
        {copiedSuccess && (
          <div style={{
            marginTop: 16,
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(6, 95, 70, 0.35))',
            border: '1px solid rgba(16, 185, 129, 0.6)',
            borderRadius: 14,
            padding: '14px',
            animation: 'slideIn 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <CheckCircle2 size={18} color="#34d399" />
              <strong style={{ color: '#6ee7b7', fontSize: '0.9rem' }}>Review Copied!</strong>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#d1fae5', lineHeight: 1.4 }}>
              Google box is opening. Just <strong>tap 5 Stars</strong> and <strong>Paste (Ctrl+V / Long-Press)</strong> to post!
            </p>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 20, textAlign: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            ⚡ 1-Tap Google Review Automation • Takes 2 seconds
          </p>
        </div>

      </div>

      {onBackToAdmin && (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button onClick={onBackToAdmin} className="btn btn-secondary btn-sm">
            ← Exit Simulator to Admin Dashboard
          </button>
        </div>
      )}

    </div>
  );
}
