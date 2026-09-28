import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Printer, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Palette, 
  Sparkles, 
  Layout, 
  Star,
  ShieldCheck,
  Smartphone,
  Wifi,
  Globe
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { api } from '../services/api';

export default function QrStandeeGenerator({ businesses, selectedBusiness, onSelectBusiness }) {
  const currentBiz = selectedBusiness || businesses[0];
  const standeeRef = useRef(null);

  const [standeeTheme, setStandeeTheme] = useState('acrylic-modern'); // 'acrylic-modern', 'dark-luxury', 'gold-vip', 'minimal-clean'
  const [customHeading, setCustomHeading] = useState('Scan to Review Us on Google');
  const [customSubheading, setCustomSubheading] = useState('Help us grow by sharing your 5★ experience!');
  const [customOffer, setCustomOffer] = useState('⚡ Takes only 5 seconds!');
  const [qrSize, setQrSize] = useState(200);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Network IP configuration for mobile QR scanning
  const [networkBaseUrl, setNetworkBaseUrl] = useState(window.location.origin);
  const [localIp, setLocalIp] = useState('');

  useEffect(() => {
    api.getNetworkInfo().then(info => {
      if (info && info.qrBaseUrl) {
        setNetworkBaseUrl(info.qrBaseUrl);
        setLocalIp(info.localIp);
      }
    }).catch(err => console.warn('Could not fetch network IP:', err));
  }, []);

  if (!currentBiz) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#fff' }}>
        <h3>Please select or add a business first.</h3>
      </div>
    );
  }

  // The actual URL embedded in the QR code (Points to Wi-Fi IP so phone can open it!)
  const scanUrl = `${networkBaseUrl}/?business=${currentBiz.slug || currentBiz.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(scanUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPng = async () => {
    if (!standeeRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(standeeRef.current, {
        scale: 3, // High-DPI print quality
        useCORS: true,
        backgroundColor: null
      });
      const link = document.createElement('a');
      link.download = `${currentBiz.name.replace(/\s+/g, '_')}_QR_Standee.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to export PNG:', err);
      alert('Failed to download image. Try printing instead.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ maxWidth: 1300, margin: '0 auto', padding: '32px 24px' }}>
      
      {/* Studio Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            PRINTABLE QR STANDEE STUDIO
          </span>
          <h2 style={{ fontSize: '2rem', marginTop: 4 }}>
            Generate & Print <span className="gradient-text">Physical Counter Standees</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Ready-to-print acrylic table stands and counter posters for your shop, clinic, salon, or restaurant.
          </p>
        </div>

        {/* Business Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Select Business:</label>
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: 220 }}
            value={currentBiz.id}
            onChange={(e) => {
              const b = businesses.find(item => item.id === e.target.value);
              if (b) onSelectBusiness(b);
            }}
          >
            {businesses.map(b => (
              <option key={b.id} value={b.id}>
                {b.logo} {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Network Alert Banner (Explains Mobile QR Connectivity) */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(99, 102, 241, 0.15))',
        border: '1px solid rgba(14, 165, 233, 0.35)',
        borderRadius: 16,
        padding: '14px 20px',
        marginBottom: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ padding: 8, borderRadius: 10, background: 'rgba(14, 165, 233, 0.2)', color: '#38bdf8' }}>
            <Wifi size={20} />
          </div>
          <div>
            <strong style={{ color: '#fff', fontSize: '0.92rem' }}>
              📱 Mobile Scanning Ready via Wi-Fi Network IP: <span style={{ color: '#38bdf8' }}>{localIp || '192.168.1.9'}</span>
            </strong>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              When you scan this QR from any mobile phone connected to the same Wi-Fi, it opens directly without localhost errors!
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Base URL:</span>
          <input
            type="text"
            className="form-input"
            style={{ width: 230, padding: '6px 10px', fontSize: '0.82rem', background: '#0f172a' }}
            value={networkBaseUrl}
            onChange={(e) => setNetworkBaseUrl(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(400px, 1.2fr)', gap: 32 }}>
        
        {/* Controls Column */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Palette size={18} color="var(--primary)" /> Standee Customization
          </h3>

          {/* Standee Layout Theme */}
          <div className="form-group">
            <label className="form-label">Visual Template</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { id: 'acrylic-modern', name: '✨ Acrylic Modern' },
                { id: 'dark-luxury', name: '🖤 Luxury Dark' },
                { id: 'gold-vip', name: '👑 Gold VIP' },
                { id: 'minimal-clean', name: '📄 Clean Minimal' }
              ].map(theme => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setStandeeTheme(theme.id)}
                  className={`chip ${standeeTheme === theme.id ? 'active' : ''}`}
                  style={{ justifyContent: 'center', padding: '10px' }}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Top Heading</label>
            <input
              type="text"
              className="form-input"
              value={customHeading}
              onChange={(e) => setCustomHeading(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Subheading</label>
            <input
              type="text"
              className="form-input"
              value={customSubheading}
              onChange={(e) => setCustomSubheading(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Special Offer / Footer Note</label>
            <input
              type="text"
              className="form-input"
              value={customOffer}
              onChange={(e) => setCustomOffer(e.target.value)}
            />
          </div>

          {/* Direct Mobile Link */}
          <div style={{ marginTop: 24, padding: 16, background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-md)' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 8, fontWeight: 600 }}>
              Direct Mobile Scan URL (Embedded in QR):
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                readOnly
                value={scanUrl}
                className="form-input"
                style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.4)' }}
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="btn btn-secondary btn-sm"
              >
                {copiedLink ? <Check size={16} color="var(--accent-emerald)" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {/* Export Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 24 }}>
            <button
              type="button"
              onClick={handleDownloadPng}
              disabled={isExporting}
              className="btn btn-primary"
            >
              <Download size={16} />
              {isExporting ? 'Generating...' : 'Download PNG'}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-secondary"
            >
              <Printer size={16} />
              Print Standee
            </button>
          </div>

        </div>

        {/* Live Standee Preview Area */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          
          {/* Printable Container */}
          <div 
            ref={standeeRef}
            style={{
              width: 380,
              minHeight: 520,
              borderRadius: 24,
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'center',
              boxShadow: '0 30px 70px rgba(0,0,0,0.6)',
              position: 'relative',
              overflow: 'hidden',
              fontFamily: 'var(--font-heading)',
              ...(standeeTheme === 'acrylic-modern' && {
                background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
                color: '#0f172a',
                border: '8px solid #ffffff',
                borderTop: `12px solid ${currentBiz.colorTheme || '#6366f1'}`
              }),
              ...(standeeTheme === 'dark-luxury' && {
                background: 'linear-gradient(180deg, #18181b 0%, #09090b 100%)',
                color: '#fafafa',
                border: '2px solid rgba(255,255,255,0.15)',
                borderTop: `10px solid ${currentBiz.colorTheme || '#6366f1'}`
              }),
              ...(standeeTheme === 'gold-vip' && {
                background: 'linear-gradient(180deg, #1c1917 0%, #0c0a09 100%)',
                color: '#fef3c7',
                border: '4px solid #f59e0b',
                boxShadow: '0 0 40px rgba(245, 158, 11, 0.25)'
              }),
              ...(standeeTheme === 'minimal-clean' && {
                background: '#ffffff',
                color: '#1e293b',
                border: '2px solid #e2e8f0'
              })
            }}
          >

            {/* Business Logo & Name */}
            <div>
              <div style={{
                fontSize: '2.8rem',
                marginBottom: 6,
                filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.15))'
              }}>
                {currentBiz.logo || '🏢'}
              </div>
              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: 900,
                color: standeeTheme === 'acrylic-modern' || standeeTheme === 'minimal-clean' ? '#0f172a' : (standeeTheme === 'gold-vip' ? '#fbbf24' : '#ffffff'),
                lineHeight: 1.2,
                marginBottom: 4
              }}>
                {currentBiz.name}
              </h3>
              <p style={{
                fontSize: '0.8rem',
                color: standeeTheme === 'acrylic-modern' || standeeTheme === 'minimal-clean' ? '#64748b' : '#a1a1aa',
                fontWeight: 500
              }}>
                {currentBiz.tagline || currentBiz.category}
              </p>
            </div>

            {/* Google 5-Star Banner */}
            <div style={{
              margin: '16px 0',
              padding: '6px 16px',
              borderRadius: 999,
              background: standeeTheme === 'acrylic-modern' || standeeTheme === 'minimal-clean' ? '#f8fafc' : 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(0,0,0,0.08)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8
            }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>GOOGLE REVIEW</span>
              <div style={{ color: '#f59e0b', fontSize: '1rem', letterSpacing: '2px' }}>
                ★★★★★
              </div>
            </div>

            {/* Heading */}
            <div>
              <h4 style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                marginBottom: 4,
                color: standeeTheme === 'gold-vip' ? '#fde68a' : 'inherit'
              }}>
                {customHeading}
              </h4>
              <p style={{
                fontSize: '0.78rem',
                opacity: 0.8,
                maxWidth: 280,
                margin: '0 auto 16px',
                fontFamily: 'var(--font-body)'
              }}>
                {customSubheading}
              </p>
            </div>

            {/* QR Code Container */}
            <div style={{
              padding: 16,
              background: '#ffffff',
              borderRadius: 18,
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              border: '1px solid rgba(0,0,0,0.06)'
            }}>
              <QRCodeSVG
                value={scanUrl}
                size={qrSize}
                fgColor="#0f172a"
                bgColor="#ffffff"
                level="H"
                includeMargin={false}
              />
            </div>

            {/* Standee Footer */}
            <div style={{ marginTop: 20 }}>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: currentBiz.colorTheme || '#6366f1',
                marginBottom: 4
              }}>
                {customOffer}
              </div>
              <p style={{
                fontSize: '0.68rem',
                opacity: 0.6,
                fontFamily: 'var(--font-body)'
              }}>
                📱 Open Camera & Point at QR to Review
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
