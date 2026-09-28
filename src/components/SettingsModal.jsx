import React, { useState, useEffect } from 'react';
import { Settings, Key, Shield, Check, X, Sparkles, MessageSquare, Info } from 'lucide-react';
import { api } from '../services/api';

export default function SettingsModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useState('');
  const [platformName, setPlatformName] = useState('ReviewBoost AI');
  const [supportContact, setSupportContact] = useState('+91 98765 00000');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.getSettings().then(data => {
        if (data) {
          setApiKey(data.geminiApiKey || '');
          setPlatformName(data.platformName || 'ReviewBoost AI');
          setSupportContact(data.supportContact || '+91 98765 00000');
        }
      }).catch(err => console.warn('Settings load error:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.updateSettings({
        geminiApiKey: apiKey.trim(),
        platformName: platformName.trim(),
        supportContact: supportContact.trim()
      });
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 1200);
    } catch (err) {
      alert('Failed to save settings: ' + err.message);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: 16
    }}>
      <div className="glass-card" style={{
        maxWidth: 560,
        width: '100%',
        padding: 32,
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.98), rgba(15, 23, 42, 0.99))',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: 24,
        position: 'relative'
      }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ padding: 10, borderRadius: 12, background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
            <Settings size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: '#fff' }}>Platform Settings</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Configure AI Review Engine & White-Label Details</p>
          </div>
        </div>

        <form onSubmit={handleSave}>
          
          {/* Gemini API Key */}
          <div className="form-group">
            <label className="form-label">
              <Key size={14} color="var(--primary)" /> Gemini API Key (Optional)
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
              If left blank, the platform automatically uses the ultra-fast Built-in Smart Synthesis Engine (Zero API cost & 100% reliable).
            </span>
          </div>

          {/* Platform Name */}
          <div className="form-group">
            <label className="form-label">
              <Shield size={14} /> Platform Brand Name
            </label>
            <input
              type="text"
              className="form-input"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
            />
          </div>

          {/* Support WhatsApp */}
          <div className="form-group">
            <label className="form-label">
              <MessageSquare size={14} /> Support WhatsApp Number
            </label>
            <input
              type="text"
              className="form-input"
              value={supportContact}
              onChange={(e) => setSupportContact(e.target.value)}
            />
          </div>

          {/* Info banner */}
          <div style={{
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: 14,
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            marginBottom: 24,
            display: 'flex',
            gap: 10
          }}>
            <Info size={18} color="#a5b4fc" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ color: '#fff' }}>How Reviews are Safeguarded:</strong> Reviews are formulated using varied NLP phrasing and SEO keyword rotation so each customer submission is distinct, ensuring full compliance with Google Review standards.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isSaved ? <><Check size={16} /> Saved!</> : 'Save Settings'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
