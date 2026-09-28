import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import BusinessForm from './components/BusinessForm';
import QrStandeeGenerator from './components/QrStandeeGenerator';
import CustomerReviewView from './components/CustomerReviewView';
import SettingsModal from './components/SettingsModal';
import { api } from './services/api';

export default function App() {
  const [businesses, setBusinesses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Navigation: 'admin', 'onboard', 'standee', 'scanner', 'settings'
  const [activeTab, setActiveTab] = useState('admin');
  
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Check URL parameters for direct mobile scanner routing or onboarding
  const [isDirectScanMode, setIsDirectScanMode] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [bizData, statsData] = await Promise.all([
        api.getBusinesses(),
        api.getStats()
      ]);
      setBusinesses(bizData);
      setStats(statsData);
      
      if (!selectedBusiness && bizData.length > 0) {
        setSelectedBusiness(bizData[0]);
      }

      // Check if URL specifies a business slug
      const urlParams = new URLSearchParams(window.location.search);
      const bizParam = urlParams.get('business') || urlParams.get('review') || urlParams.get('r') || urlParams.get('preview');
      
      if (bizParam) {
        const found = bizData.find(b => b.slug === bizParam || b.id === bizParam);
        if (found) {
          setSelectedBusiness(found);
          setIsDirectScanMode(true);
          setActiveTab('scanner');
        }
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveBusiness = async (formData) => {
    try {
      if (editingBusiness || businesses.some(b => b.id === formData.id)) {
        const targetId = editingBusiness?.id || formData.id;
        const updated = await api.updateBusiness(targetId, formData);
        setBusinesses(prev => prev.map(b => b.id === updated.id ? updated : b));
        setSelectedBusiness(updated);
        showToast(`Business "${updated.name}" configured successfully!`);
      } else {
        const created = await api.createBusiness(formData);
        setBusinesses(prev => [created, ...prev]);
        setSelectedBusiness(created);
        showToast(`Business "${created.name}" onboarded successfully!`);
      }
      setEditingBusiness(null);
      setActiveTab('standee'); // Take directly to printable standee
      // Refresh stats
      api.getStats().then(setStats);
    } catch (err) {
      alert('Error saving business: ' + err.message);
    }
  };

  const handleDeleteBusiness = async (id) => {
    if (!window.confirm('Are you sure you want to delete this business profile?')) return;
    try {
      await api.deleteBusiness(id);
      setBusinesses(prev => prev.filter(b => b.id !== id));
      if (selectedBusiness?.id === id) {
        setSelectedBusiness(businesses.find(b => b.id !== id) || null);
      }
      showToast('Business deleted successfully.');
      api.getStats().then(setStats);
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const handleAddNew = () => {
    setEditingBusiness(null);
    setActiveTab('onboard');
  };

  const handleEdit = (biz) => {
    setEditingBusiness(biz);
    setActiveTab('onboard');
  };

  const handleOpenStandee = (biz) => {
    setSelectedBusiness(biz);
    setActiveTab('standee');
  };

  const handleOpenScanner = (biz) => {
    setSelectedBusiness(biz);
    setActiveTab('scanner');
  };

  // If directly scanned via mobile QR parameter
  if (isDirectScanMode && selectedBusiness) {
    return (
      <div className="app-container">
        <div className="ambient-bg" />
        <CustomerReviewView
          business={selectedBusiness}
          onBackToAdmin={() => {
            setIsDirectScanMode(false);
            window.history.replaceState({}, '', '/');
            setActiveTab('admin');
          }}
        />
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="ambient-bg" />

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'settings') {
            setIsSettingsOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        selectedBusiness={selectedBusiness}
        businesses={businesses}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: 60 }}>
        {loading ? (
          <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>⚡</div>
            <h3>Loading ReviewBoost Suite...</h3>
          </div>
        ) : (
          <>
            {activeTab === 'admin' && (
              <AdminDashboard
                businesses={businesses}
                stats={stats}
                onSelectBusiness={setSelectedBusiness}
                onEditBusiness={handleEdit}
                onDeleteBusiness={handleDeleteBusiness}
                onAddNew={handleAddNew}
                onOpenStandee={handleOpenStandee}
                onOpenScanner={handleOpenScanner}
              />
            )}

            {activeTab === 'onboard' && (
              <BusinessForm
                initialData={editingBusiness}
                onSave={handleSaveBusiness}
                onCancel={() => {
                  setEditingBusiness(null);
                  setActiveTab('admin');
                }}
              />
            )}

            {activeTab === 'standee' && (
              <QrStandeeGenerator
                businesses={businesses}
                selectedBusiness={selectedBusiness}
                onSelectBusiness={setSelectedBusiness}
              />
            )}

            {activeTab === 'scanner' && (
              <div style={{ paddingTop: 20 }}>
                {/* Simulator Business Switcher Bar */}
                <div style={{
                  maxWidth: 520,
                  margin: '0 auto 16px',
                  padding: '10px 16px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8
                }}>
                  <span style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 600 }}>
                    📱 SIMULATOR CLIENT:
                  </span>
                  <select
                    className="form-select"
                    style={{ width: 'auto', padding: '4px 10px', fontSize: '0.8rem', background: '#0f172a' }}
                    value={selectedBusiness?.id || ''}
                    onChange={(e) => {
                      const b = businesses.find(item => item.id === e.target.value);
                      if (b) setSelectedBusiness(b);
                    }}
                  >
                    {businesses.map(b => (
                      <option key={b.id} value={b.id}>{b.logo} {b.name}</option>
                    ))}
                  </select>
                </div>

                <CustomerReviewView
                  business={selectedBusiness}
                  onBackToAdmin={() => setActiveTab('admin')}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast">
            <span>✨</span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
