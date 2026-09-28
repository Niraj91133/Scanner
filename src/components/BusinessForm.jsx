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
  Plus, 
  X,
  Building,
  Tag,
  ShieldCheck,
  Zap,
  Target,
  Check
} from 'lucide-react';
import { api } from '../services/api';

export default function BusinessForm({ initialData = null, onSave, onCancel }) {
  const [isManualEditMode, setIsManualEditMode] = useState(!!initialData);
  
  // Clean, dedicated onboarding inputs
  const [businessNameInput, setBusinessNameInput] = useState('');
  const [googleLinkInput, setGoogleLinkInput] = useState('');
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

  // Quick preset sample buttons
  const sampleInputs = [
    { 
      name: 'Apex Dental & Implant Centre', 
      city: 'Noida Sector 18', 
      link: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4' 
    },
    { 
      name: 'Glamour Touch Luxury Unisex Salon', 
      city: 'South Delhi', 
      link: 'https://search.google.com/local/writereview?placeid=ChIJ2V-v1GoeDTkREnJgSjF297U' 
    },
    { 
      name: 'The Daily Roast Artisan Cafe', 
      city: 'Jubilee Hills Hyderabad', 
      link: 'https://search.google.com/local/writereview?placeid=ChIJc86Yg3SbyzsRk84xT6Vj1lA' 
    }
  ];

  const handleApplySample = (sample) => {
    setBusinessNameInput(`${sample.name} ${sample.city}`);
    setGoogleLinkInput(sample.link);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!businessNameInput.trim()) {
      alert('Please enter your Business Name (e.g. Apex Dental Clinic)');
      return;
    }

    setIsProcessing(true);
    setGeneratedResult(null);

    try {
      setProcessingStep('🔍 Analyzing Business Category & Services...');
      await new Promise(r => setTimeout(r, 400));
      
      setProcessingStep('🎯 Synthesizing 20+ High-Ranking Local SEO Keywords...');
      await new Promise(r => setTimeout(r, 400));

      setProcessingStep('✨ Generating 5★ Dynamic Review QR Standee...');
      
      const result = await api.autoOnboard(businessNameInput.trim(), googleLinkInput.trim());
      
      // If user provided a specific google link, make sure it is attached
      if (googleLinkInput.trim()) {
        result.googleReviewLink = googleLinkInput.trim();
      }

      setFormData(result);
      setGeneratedResult(result);
      setIsProcessing(false);
    } catch (err) {
      alert('Error: ' + err.message);
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
          GOOGLE MY BUSINESS AUTOMATION
        </div>
        
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 10 }}>
          Create Your <span className="gradient-text">5★ Google Review Scanner</span>
        </h1>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 680, margin: '0 auto', lineHeight: 1.6 }}>
          Apna <strong>Business Name</strong> aur <strong>Google Review Link</strong> daalein — Hamara AI automatically <strong>Local SEO Keywords</strong> aur <strong>QR Standee</strong> ready kar dega!
        </p>
      </div>

      {/* Main Onboarding Form */}
      {!isManualEditMode && !generatedResult && (
        <div className="glass-card" style={{
          padding: '36px',
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.85), rgba(15, 23, 42, 0.95))',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          borderRadius: 24,
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          marginBottom: 32
        }}>
          <form onSubmit={handleGenerate}>
            
            {/* Field 1: Business Name */}
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                🏢 1. Business Name & City:
              </label>
              <input
                type="text"
                className="form-input"
                style={{
                  fontSize: '1.1rem',
                  padding: '14px 18px',
                  borderRadius: 14,
                  border: '2px solid rgba(99, 102, 241, 0.4)',
                  background: 'rgba(15, 23, 42, 0.9)'
                }}
                placeholder="e.g. Apex Dental Clinic Sector 18 Noida"
                value={businessNameInput}
                onChange={(e) => setBusinessNameInput(e.target.value)}
                disabled={isProcessing}
                required
                autoFocus
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                💡 Tip: Naam me City/Area daalne se AI accurate Local SEO Keywords banata hai.
              </span>
            </div>

            {/* Field 2: Google Review / Maps Link */}
            <div className="form-group" style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                🔗 2. Google My Business Review Link (Where customer should post):
              </label>
              <input
                type="url"
                className="form-input"
                style={{
                  fontSize: '1rem',
                  padding: '14px 18px',
                  borderRadius: 14,
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'rgba(15, 23, 42, 0.8)'
                }}
                placeholder="e.g. https://search.google.com/local/writereview?placeid=... OR https://g.page/r/..."
                value={googleLinkInput}
                onChange={(e) => setGoogleLinkInput(e.target.value)}
                disabled={isProcessing}
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                Scan karne ke baad customer ka review direct isi Google page par open hoga. (Khali chhodne par auto-search link banega).
              </span>
            </div>

            {/* Quick Sample Demo Fill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Try quick sample:</span>
              {sampleInputs.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplySample(sample)}
                  className="chip"
                  style={{ fontSize: '0.8rem', padding: '5px 12px' }}
                >
                  {sample.name}
                </button>
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing || !businessNameInput.trim()}
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
                  Generate 5★ Review QR Standee & SEO
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Generated Result & SEO Strategy View */}
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
                  width: 54,
                  height: 54,
                  borderRadius: 14,
                  background: 'rgba(16, 185, 129, 0.2)',
                  fontSize: '2rem',
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
                    {generatedResult.category} • 📍 {generatedResult.city || 'City Set'}
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

          {/* Interactive SEO Keywords Board */}
          <div className="glass-card" style={{ padding: '28px', borderRadius: 24, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Target size={20} color="#fbbf24" /> Active Local SEO Keywords ({formData.targetKeywords?.length || 0})
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Customer ke review text me ye keywords automatically blend honge taaki Google Maps par aapki ranking boost ho.
                </p>
              </div>
            </div>

            {/* Keyword Chips */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {formData.targetKeywords?.map((kw, idx) => (
                <span 
                  key={idx} 
                  className="badge badge-success" 
                  style={{ padding: '8px 14px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  🎯 {kw}
                  <X size={14} style={{ cursor: 'pointer' }} onClick={() => toggleKeyword(kw)} />
                </span>
              ))}
            </div>

            {/* Add Custom Keyword */}
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                className="form-input"
                placeholder="Add custom SEO keyword..."
                value={newKeywordInput}
                onChange={(e) => setNewKeywordInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomKeyword(); } }}
              />
              <button
                type="button"
                onClick={addCustomKeyword}
                className="btn btn-secondary"
              >
                <Plus size={16} /> Add
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleSaveAndGo}
              className="btn btn-success btn-lg"
              style={{ flex: 1, minWidth: 240, fontSize: '1.15rem', padding: '18px' }}
            >
              <QrCode size={20} /> Launch & View QR Standee
            </button>

            <button
              type="button"
              onClick={() => setShowAdvancedEditor(!showAdvancedEditor)}
              className="btn btn-secondary btn-lg"
            >
              <Edit3 size={18} />
              {showAdvancedEditor ? 'Hide Details' : 'Edit Google Link / Details'}
            </button>
          </div>

        </div>
      )}

      {/* Advanced Full Editor */}
      {(isManualEditMode || showAdvancedEditor) && (
        <div className="glass-card" style={{ padding: '32px', borderRadius: 24, marginTop: 24 }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Edit3 size={20} color="var(--primary)" /> Profile & Google Review Link
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
              <label className="form-label">Google Review Direct Link</label>
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
