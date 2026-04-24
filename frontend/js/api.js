import { API_BASE_URL, DEMO_RESOURCES, DEMO_THERAPISTS } from './config.js';

const getToken = () => localStorage.getItem('mindease_token');

const request = async (path, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (getToken()) {
    headers.Authorization = `Bearer ${getToken()}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

export const api = {
  async register(payload) {
    return request('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
  },
  async login(payload) {
    return request('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
  },
  async getProfile() {
    return request('/auth/profile');
  },
  async updateProfile(payload) {
    return request('/auth/profile', { method: 'PUT', body: JSON.stringify(payload) });
  },
  async changePassword(payload) {
    return request('/auth/change-password', { method: 'PUT', body: JSON.stringify(payload) });
  },
  async getMoodEntries() {
    return request('/moods');
  },
  async addMoodEntry(payload) {
    return request('/moods', { method: 'POST', body: JSON.stringify(payload) });
  },
  async getWeeklyStats() {
    return request('/moods/weekly-stats');
  },
  async getMonthlyStats() {
    return request('/moods/monthly-stats');
  },
  async getJournalEntries() {
    return request('/journal');
  },
  async addJournalEntry(payload) {
    return request('/journal', { method: 'POST', body: JSON.stringify(payload) });
  },
  async searchJournalEntries(query) {
    return request(`/journal/search?q=${encodeURIComponent(query)}`);
  },
  async deleteJournalEntry(id) {
    return request(`/journal/${id}`, { method: 'DELETE' });
  },
  async getTherapists() {
    try {
      return await request('/therapists');
    } catch (error) {
      return { therapists: DEMO_THERAPISTS };
    }
  },
  async getTherapistById(id) {
    try {
      return await request(`/therapists/${id}`);
    } catch (error) {
      return { therapist: DEMO_THERAPISTS.find((item) => item._id === id) || DEMO_THERAPISTS[0] };
    }
  },
  async createBooking(payload) {
    return request('/bookings', { method: 'POST', body: JSON.stringify(payload) });
  },
  async getBookings() {
    return request('/bookings');
  },
  async cancelBooking(id) {
    return request(`/bookings/${id}/cancel`, { method: 'PUT' });
  },
  async rescheduleBooking(id, payload) {
    return request(`/bookings/${id}/reschedule`, { method: 'PUT', body: JSON.stringify(payload) });
  },
  async getResources() {
    try {
      return await request('/resources');
    } catch (error) {
      return { resources: DEMO_RESOURCES };
    }
  },
  async getAdminAnalytics() {
    return request('/admin/analytics');
  },
  async getAdminUsers() {
    return request('/admin/users');
  },
  async getAdminBookings() {
    return request('/admin/bookings');
  }
};
