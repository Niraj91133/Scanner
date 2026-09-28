import React from 'react';
import { 
  Sparkles, 
  LayoutDashboard, 
  PlusCircle, 
  QrCode, 
  Smartphone, 
  Settings, 
  ExternalLink 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, selectedBusiness, businesses }) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      backgroundColor: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '12px 24px'
    }}>
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('admin')} 
          style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
        >
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
          }}>
            <Sparkles size={22} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
                Review<span style={{ color: '#818cf8' }}>Boost</span> AI
              </span>
              <span className="badge badge-primary">Pro Suite</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Smart 5★ Google Review & QR Automation
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('admin')}
            className={`btn btn-sm ${activeTab === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <LayoutDashboard size={16} />
            Admin Dashboard
          </button>

          <button
            onClick={() => setActiveTab('onboard')}
            className={`btn btn-sm ${activeTab === 'onboard' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <PlusCircle size={16} />
            Onboard Business
          </button>

          <button
            onClick={() => setActiveTab('standee')}
            className={`btn btn-sm ${activeTab === 'standee' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <QrCode size={16} />
            QR Standee Studio
          </button>

          <button
            onClick={() => setActiveTab('scanner')}
            className={`btn btn-sm ${activeTab === 'scanner' ? 'btn-gold' : 'btn-secondary'}`}
          >
            <Smartphone size={16} />
            Live Customer Scanner
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`btn btn-sm ${activeTab === 'settings' ? 'btn-primary' : 'btn-secondary'}`}
            title="Settings & API Config"
          >
            <Settings size={16} />
          </button>
        </nav>
      </div>
    </header>
  );
}
