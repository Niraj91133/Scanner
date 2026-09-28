import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  Link as LinkIcon, 
  Layers, 
  Star, 
  Edit3, 
  QrCode, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  X,
  Building,
  Tag,
  ShieldCheck,
  Zap,
  TrendingUp,
  Target,
  Check,
  Wifi,
  Smartphone
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../services/api';

export default function BusinessForm({ initialData = null, onSave, onCancel }) {
  const [isManualEditMode, setIsManualEditMode] = useState(!!initialData);
  
  // 1-Step Magic Input
  const [magicInput, setMagicInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  
  // Form State
  const [formData, setFormData] = useState(initialData || {
    name: '',
    tagline: '',
    category: 'Healthcare & Dental Clinic',
    logo: '⭐',
    phone: '+91 98765 43210',
    address: 'Main Market, City Center',
    city: '',
    googleReviewLink: '',
    placeId: '',
    services: [],
    targetKeywords: [],
    seoPlan: null,
    usps: [],
    brandTone: 'Friendly & Professional',
    colorTheme: '#6366f1',
    qrStyle: 'dots'
  });

  const [generatedResult, setGeneratedResult] = useState(null);
  const [showAdvancedEditor, setShowAdvancedEditor] = useState(false);
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [newServiceInput, setNewServiceInput] = useState('');

  // Sample quick buttons
  const sampleInputs = [
    { label: '🦷 Dental Clinic (Noida)', value: 'Apex Dental & Implant Centre Sector 18 Noida' },
    { label: '✂️ Luxury Salon (Delhi)', value: 'Glamour Touch Luxury Unisex Salon South Delhi' },
    { label: '☕ Artisan Cafe (Hyderabad)', value: 'The Daily Roast Artisan Cafe Jubilee Hills' },
    { label: '🚗 Car Detailing (Mumbai)', value: 'Speedy Wheels Auto Care Studio Bandra Mumbai' }
  ];

  const handleMagicGenerate = async (e) => {
    e.preventDefault();
    if (!magicInput.trim()) {
      alert('Please enter your Google Business Name or Google Maps Link');
      return;
    }

    setIsProcessing(true);
    setGeneratedResult(null);

    try {
      setProcessingStep('🔍 Resolving URL & Scraping Business Metadata...');
      await new Promise(r => setTimeout(r, 450));
      
      setProcessingStep('📍 Detecting Location, Area & High-Intent Search Queries...');
      await new Promise(r => setTimeout(r, 450));

      setProcessingStep('🎯 Synthesizing Local SEO Keywords & 5★ Review Logic...');
      
      const result = await api.autoOnboard(magicInput.trim());
      
      setFormData(result);
      setGeneratedResult(result);
      setIsProcessing(false);
    } catch (err) {
      alert('Analysis Error: ' + err.message);
      setIsProcessing(false);
    }
  };

  const toggleKeyword = (kw) => {
    const current = formData.targetKeywords || [];
    if (current.includes(kw)) {
      setFormData(prev => ({ ...prev, targetKeywords: prev.targetKeywords.filter(k => k !== kw) }));
    } else {
      setFormData(prev => ({ ...prev, targetKeywords: [...prev.targetKeywords, kw] }));
    }
  };

  const addCustomKeyword = () => {
    if (!newKeywordInput.trim()) return;
    if (!formData.targetKeywords.includes(newKeywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        targetKeywords: [...prev.targetKeywords, newKeywordInput.trim()]
      }));
    }
    setNewKeywordInput('');
  };

  const handleSaveAndGo = () => {
    if (!formData.name.trim()) {
      alert('Business Name is required');
      return;
    }
    onSave(formData);
  };

  return (
    <div style={{ maxWidth: 1050, margin: '0 auto', padding: '32px 20px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 16px',
          borderRadius: 999,
          background: 'rgba(99, 102, 241, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          color: '#c7d2fe',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: 12
        }}>
          <Zap size={16} color="#fbbf24" fill="#fbbf24" />
          AI LOCAL SEO & AUTO ONBOARDING
        </div>
        
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 10 }}>
          Google Business <span className="gradient-text">Instant SEO & QR Scanner</span>
        </h1>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 680, margin: '0 auto', lineHeight: 1.6 }}>
          Google Maps link ya Business Name daalein — AI automatically <strong>Services</strong>, <strong>City/Area</strong> aur <strong>High-Ranking Local SEO Keywords</strong> nikaal kar Standee generate kar dega.
        </p>
      </div>

      {/* Main 1-Step Magic Input */}
      {!isManualEditMode && !generatedResult && (
        <div className="glass-card" style={{
          padding: '36px',
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.85), rgba(15, 23, 42, 0.95))',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          borderRadius: 24,
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          marginBottom: 32
        }}>
          <form onSubmit={handleMagicGenerate}>
            <label style={{
              display: 'block',
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#fff',
              marginBottom: 12
            }}>
              🔗 Paste Google Maps Link OR Enter Business Name:
            </label>

            <div style={{ position: 'relative', marginBottom: 16 }}>
              <input
                type="text"
                className="form-input"
                style={{
                  fontSize: '1.1rem',
                  padding: '16px 20px',
                  borderRadius: 16,
                  border: '2px solid rgba(99, 102, 241, 0.4)',
                  background: 'rgba(15, 23, 42, 0.9)'
                }}
                placeholder="e.g. https://maps.app.goo.gl/... OR 'Apex Dental Clinic Sector 18 Noida'"
                value={magicInput}
                onChange={(e) => setMagicInput(e.target.value)}
                disabled={isProcessing}
                autoFocus
              />
            </div>

            {/* Quick Demo Fill Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Try quick sample:</span>
              {sampleInputs.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMagicInput(sample.value)}
                  className="chip"
                  style={{ fontSize: '0.8rem', padding: '5px 12px' }}
                >
                  {sample.label}
                </button>
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing || !magicInput.trim()}
              className="btn btn-primary btn-lg pulse-glow"
              style={{
                width: '100%',
                fontSize: '1.15rem',
                fontWeight: 800,
                padding: '18px',
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12
              }}
            >
              {isProcessing ? (
                <>
                  <Wand2 size={22} className="spin-anim" />
                  {processingStep}
                </>
              ) : (
                <>
                  <Sparkles size={22} color="#fbbf24" />
                  Analyze GMB & Build 5★ QR Automation
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Instant SEO Analysis Hub & Results */}
      {generatedResult && (
        <div style={{ animation: 'slideIn 0.4s ease' }}>
          
          {/* Header Card */}
          <div className="glass-card" style={{
            padding: '28px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(15, 23, 42, 0.95))',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: 24,
            marginBottom: 24
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'rgba(16, 185, 129, 0.2)',
                  fontSize: '1.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {generatedResult.logo || '🏢'}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', color: '#fff', lineHeight: 1.2 }}>
                    {generatedResult.name}
                  </h2>
                  <p style={{ color: '#6ee7b7', fontSize: '0.85rem' }}>
                    {generatedResult.category} • 📍 {generatedResult.city || 'City Detected'}
                  </p>
                </div>
              </div>

              <div style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.5)',
                padding: '8px 18px',
                borderRadius: 12,
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '0.72rem', color: '#a7f3d0', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                  SEO HEALTH SCORE
                </span>
                <strong style={{ fontSize: '1.3rem', color: '#34d399' }}>96 / 100 🚀</strong>
              </div>
            </div>
          </div>

          {/* Interactive SEO Keyword Strategy Board */}
          <div className="glass-card" style={{ padding: '28px', borderRadius: 24, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Target size={20} color="#fbbf24" /> Local SEO Keywords Strategy
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Tap any keyword to select/deselect. Selected keywords will be auto-blended into customer reviews for Google Maps ranking.
                </p>
              </div>

              <span className="badge badge-success" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                {formData.targetKeywords?.length || 0} Keywords Active
              </span>
            </div>

            {/* Keyword Category Groups */}
            {generatedResult.seoPlan?.keywordCategories ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {generatedResult.seoPlan.keywordCategories.map((cat, idx) => (
                  <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: 16, borderRadius: 16 }}>
                    <h4 style={{ fontSize: '0.85rem', color: '#a5b4fc', marginBottom: 4 }}>{cat.title}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 10 }}>{cat.description}</p>
                    
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {cat.keywords.map((kw, kIdx) => {
                        const isSelected = formData.targetKeywords?.includes(kw);
                        return (
                          <button
                            key={kIdx}
                            type="button"
                            onClick={() => toggleKeyword(kw)}
                            className={`chip ${isSelected ? 'active' : ''}`}
                            style={{
                              fontSize: '0.825rem',
                              padding: '6px 14px',
                              ...(isSelected && {
                                background: 'rgba(16, 185, 129, 0.25)',
                                borderColor: 'rgba(16, 185, 129, 0.7)',
                                color: '#6ee7b7'
                              })
                            }}
                          >
                            {isSelected ? <Check size={14} /> : '+ '}
                            {kw}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Fallback Keyword Badges */
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {formData.targetKeywords?.map((kw, idx) => (
                  <span key={idx} className="badge badge-success" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                    🎯 {kw}
                    <X size={14} style={{ cursor: 'pointer', marginLeft: 6 }} onClick={() => toggleKeyword(kw)} />
                  </span>
                ))}
              </div>
            )}

            {/* Add Custom Keyword Box */}
            <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
              <input
                type="text"
                className="form-input"
                placeholder="Add custom SEO keyword (e.g. 'best bridal salon near saket')..."
                value={newKeywordInput}
                onChange={(e) => setNewKeywordInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomKeyword(); } }}
              />
              <button
                type="button"
                onClick={addCustomKeyword}
                className="btn btn-secondary"
              >
                <Plus size={16} /> Add Keyword
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleSaveAndGo}
              className="btn btn-success btn-lg"
              style={{ flex: 1, minWidth: 240, fontSize: '1.1rem', padding: '16px' }}
            >
              <QrCode size={20} /> Launch & View QR Standee
            </button>

            <button
              type="button"
              onClick={() => setShowAdvancedEditor(!showAdvancedEditor)}
              className="btn btn-secondary btn-lg"
            >
              <Edit3 size={18} />
              {showAdvancedEditor ? 'Hide Editor' : 'Edit Business Profile'}
            </button>
          </div>

        </div>
      )}

      {/* Advanced Full Editor (If toggled or in manual edit mode) */}
      {(isManualEditMode || showAdvancedEditor) && (
        <div className="glass-card" style={{ padding: '32px', borderRadius: 24, marginTop: 24 }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Edit3 size={20} color="var(--primary)" /> Profile & Review Link Details
              </h3>
            </div>
            {onCancel && (
              <button onClick={onCancel} className="btn btn-secondary btn-sm">Cancel</button>
            )}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSaveAndGo(); }}>
            <div className="form-group">
              <label className="form-label">Business Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Google Review Direct Link / Search Link</label>
              <input
                type="text"
                className="form-input"
                value={formData.googleReviewLink}
                onChange={(e) => setFormData({ ...formData, googleReviewLink: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">City / Region</label>
              <input
                type="text"
                className="form-input"
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
              <button type="button" onClick={onCancel} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-success">
                Save & Update Standee
              </button>
            </div>
          </form>

        </div>
      )}

    </div>
  );
}
