import React, { useState } from 'react';
import { 
  Building2, 
  QrCode, 
  Share2, 
  ExternalLink, 
  TrendingUp, 
  Users, 
  Star, 
  Plus, 
  Trash2, 
  Edit3, 
  Copy, 
  Check, 
  Search,
  Eye,
  Sparkles,
  Award
} from 'lucide-react';

export default function AdminDashboard({ 
  businesses, 
  stats, 
  onSelectBusiness, 
  onEditBusiness, 
  onDeleteBusiness, 
  onAddNew, 
  onOpenStandee,
  onOpenScanner 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [copiedLink, setCopiedLink] = useState(null);

  const categories = ['ALL', ...new Set(businesses.map(b => b.category))];

  const filteredBusinesses = businesses.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.tagline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || b.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCopyClientLink = (business) => {
    const onboardUrl = `${window.location.origin}/?business=${business.slug || business.id}`;
    const message = `Namaste! Setup your 5-Star Google Review QR Standee for "${business.name}" here: ${onboardUrl}`;
    navigator.clipboard.writeText(message);
    setCopiedLink(business.id);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>
      
      {/* Hero Welcome Banner */}
      <div className="glass-card" style={{
        padding: '32px',
        marginBottom: '32px',
        background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.8), rgba(15, 23, 42, 0.9))',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 24
      }}>
        <div style={{ maxWidth: 700 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 999, background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)', marginBottom: 12 }}>
            <Sparkles size={16} color="#a5b4fc" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#c7d2fe' }}>ADMIN CONTROL CENTER</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>
            Multi-Business <span className="gradient-text">Review Automation</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
            Manage client profiles, generate custom QR Standees, configure local SEO keywords, and automate high-converting 5★ Google Reviews effortlessly.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={onAddNew} className="btn btn-primary btn-lg">
            <Plus size={20} />
            Onboard New Client
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 32 }}>
        
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Active Businesses</span>
            <div style={{ padding: 8, borderRadius: 8, background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
              <Building2 size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>{businesses.length}</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', marginTop: 4 }}>● Live & Generating Reviews</p>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Total QR Scans</span>
            <div style={{ padding: 8, borderRadius: 8, background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}>
              <QrCode size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>{stats?.totalScans || 0}</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>Across all client standees</p>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>5★ Review Clicks</span>
            <div style={{ padding: 8, borderRadius: 8, background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
              <Star size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24' }}>{stats?.totalReviewsClicked || 0}</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', marginTop: 4 }}>Reviews copied & opened in Google</p>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Conversion Rate</span>
            <div style={{ padding: 8, borderRadius: 8, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399' }}>{stats?.conversionRate || '85%'}</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>Scan-to-Review Submission</p>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        
        {/* Search */}
        <div style={{ position: 'relative', minWidth: 300, flex: 1, maxWidth: 450 }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: 42 }}
            placeholder="Search by business name, city, service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`chip ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Business Cards Grid */}
      <div className="grid-responsive">
        {filteredBusinesses.map(business => (
          <div 
            key={business.id} 
            className="glass-card" 
            style={{ 
              padding: '24px', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              borderTop: `4px solid ${business.colorTheme || 'var(--primary)'}` 
            }}
          >
            <div>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    {business.logo || '🏢'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: '#fff', lineHeight: 1.2 }}>{business.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>{business.category}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 4 }}>
                  <button 
                    onClick={() => onEditBusiness(business)} 
                    className="btn btn-secondary btn-sm" 
                    title="Edit Business"
                    style={{ padding: 6 }}
                  >
                    <Edit3 size={14} />
                  </button>
                  <button 
                    onClick={() => onDeleteBusiness(business.id)} 
                    className="btn btn-secondary btn-sm" 
                    title="Delete Business"
                    style={{ padding: 6, color: 'var(--accent-rose)' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Tagline & Address */}
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12, fontStyle: 'italic' }}>
                "{business.tagline || 'Excellence in customer service'}"
              </p>

              {business.address && (
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                  📍 {business.address}
                </p>
              )}

              {/* Keyword & Service Badges */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>SERVICES CONFIGURED ({business.services?.length || 0}):</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {(business.services || []).slice(0, 3).map((s, idx) => (
                      <span key={idx} className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{s}</span>
                    ))}
                    {(business.services?.length || 0) > 3 && (
                      <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>+{business.services.length - 3} more</span>
                    )}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>SEO KEYWORDS ({business.targetKeywords?.length || 0}):</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {(business.targetKeywords || []).slice(0, 2).map((k, idx) => (
                      <span key={idx} className="badge badge-success" style={{ fontSize: '0.7rem' }}>{k}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
                fontSize: '0.825rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <QrCode size={16} color="var(--accent-cyan)" />
                  <span style={{ color: 'var(--text-secondary)' }}>Scans:</span>
                  <strong style={{ color: '#fff' }}>{business.scanCount || 0}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Star size={16} color="#fbbf24" fill="#fbbf24" />
                  <span style={{ color: 'var(--text-secondary)' }}>5★ Reviews:</span>
                  <strong style={{ color: '#fbbf24' }}>{business.reviewClickCount || 0}</strong>
                </div>
              </div>
            </div>

            {/* Actions Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button 
                onClick={() => onOpenStandee(business)} 
                className="btn btn-secondary btn-sm"
                style={{ width: '100%' }}
              >
                <QrCode size={14} />
                QR Standee
              </button>

              <button 
                onClick={() => onOpenScanner(business)} 
                className="btn btn-gold btn-sm"
                style={{ width: '100%' }}
              >
                <Eye size={14} />
                Live Scan UI
              </button>

              <button 
                onClick={() => handleCopyClientLink(business)} 
                className="btn btn-secondary btn-sm"
                style={{ gridColumn: 'span 2', width: '100%', fontSize: '0.78rem' }}
              >
                {copiedLink === business.id ? (
                  <>
                    <Check size={14} color="var(--accent-emerald)" />
                    <span style={{ color: 'var(--accent-emerald)' }}>Link Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Share2 size={14} />
                    Copy Client Invite / Setup Link
                  </>
                )}
              </button>
            </div>

          </div>
        ))}

        {filteredBusinesses.length === 0 && (
          <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '48px', textAlign: 'center' }}>
            <Building2 size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: 8 }}>No Businesses Found</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>No businesses matched your search query.</p>
            <button onClick={onAddNew} className="btn btn-primary">
              <Plus size={16} /> Add First Business
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
