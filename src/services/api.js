const API_BASE = '/api';

export const api = {
  async getNetworkInfo() {
    try {
      const res = await fetch(`${API_BASE}/network-info`);
      if (res.ok) return res.json();
    } catch (e) {
      console.warn('Network info failed:', e);
    }
    return { localIp: window.location.hostname, qrBaseUrl: window.location.origin };
  },

  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  async getBusinesses() {
    const res = await fetch(`${API_BASE}/businesses`);
    if (!res.ok) throw new Error('Failed to fetch businesses');
    return res.json();
  },

  async getBusiness(identifier) {
    const res = await fetch(`${API_BASE}/businesses/${identifier}`);
    if (!res.ok) throw new Error('Business not found');
    return res.json();
  },

  async autoOnboard(input) {
    const res = await fetch(`${API_BASE}/auto-onboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Auto-onboarding failed');
    }
    return res.json();
  },

  async createBusiness(data) {
    const res = await fetch(`${API_BASE}/businesses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create business');
    }
    return res.json();
  },

  async updateBusiness(id, data) {
    const res = await fetch(`${API_BASE}/businesses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update business');
    return res.json();
  },

  async deleteBusiness(id) {
    const res = await fetch(`${API_BASE}/businesses/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete business');
    return res.json();
  },

  async trackScan(identifier) {
    try {
      await fetch(`${API_BASE}/businesses/${identifier}/track-scan`, { method: 'POST' });
    } catch (e) {
      console.warn('Scan tracking offline:', e);
    }
  },

  async trackReviewClick(identifier) {
    try {
      await fetch(`${API_BASE}/businesses/${identifier}/track-review-click`, { method: 'POST' });
    } catch (e) {
      console.warn('Click tracking offline:', e);
    }
  },

  async generateReviews(business, selectedService, selectedUsps, customNote) {
    const res = await fetch(`${API_BASE}/generate-reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business, selectedService, selectedUsps, customNote })
    });
    if (!res.ok) throw new Error('Failed to generate reviews');
    return res.json();
  },

  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async updateSettings(data) {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  }
};
