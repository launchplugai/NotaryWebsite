/**
 * Mock API Layer — Prototyped Backend Integration
 * Replace these with real API calls when backend is ready.
 */

const API_BASE = '/api'; // Placeholder base URL

// === Security: Input Sanitization ===
function sanitizeInput(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

function sanitizeObject(obj) {
  const sanitized = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      sanitized[key] = typeof obj[key] === 'string' ? sanitizeInput(obj[key]) : obj[key];
    }
  }
  return sanitized;
}

// Simulated network delay
function delay(ms = 600) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Mock user database
const mockUsers = [
  { id: 1, email: 'demo@notary.com', password: 'demo123', name: 'Jane Smith' }
];

// Mock appointments
const mockAppointments = [
  { id: 1, date: '2026-02-03', time: '10:00 AM', service: 'Real Estate Closing', status: 'confirmed' },
  { id: 2, date: '2026-02-05', time: '2:00 PM', service: 'Power of Attorney', status: 'pending' }
];

const API = {
  // === Auth ===
  async login(email, password) {
    await delay();
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      const token = btoa(JSON.stringify({ id: user.id, email: user.email }));
      return { success: true, token, user: { name: user.name, email: user.email } };
    }
    return { success: false, error: 'Invalid email or password' };
  },

  async signup(name, email, password) {
    await delay(800);
    if (mockUsers.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }
    const user = { id: mockUsers.length + 1, email, password, name };
    mockUsers.push(user);
    const token = btoa(JSON.stringify({ id: user.id, email }));
    return { success: true, token, user: { name, email } };
  },

  async logout() {
    await delay(200);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return { success: true };
  },

  // === Scheduling ===
  async getAvailableSlots(date) {
    await delay(400);
    const slots = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
    // Randomly remove some slots to simulate bookings
    const seed = new Date(date).getDate();
    return slots.filter((_, i) => (i + seed) % 3 !== 0);
  },

  async bookAppointment({ date, time, service, name, email, phone, notes }) {
    await delay(1000);
    const sanitized = sanitizeObject({ date, time, service, name, email, phone, notes });
    const appointment = {
      id: Date.now(),
      ...sanitized,
      status: 'confirmed',
      confirmationCode: 'NTR-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    };
    mockAppointments.push(appointment);
    return { success: true, appointment };
  },

  async getAppointments() {
    await delay(500);
    return { success: true, appointments: mockAppointments };
  },

  // === Contact / Lead Capture ===
  async submitContact({ name, email, phone, message }) {
    await delay(700);
    const sanitized = sanitizeObject({ name, email, phone, message });
    // In production, sanitized data would be sent to backend
    console.log('Contact form (sanitized):', sanitized);
    return { success: true, message: 'Thank you! We\'ll be in touch within 24 hours.' };
  },

  // === Pricing ===
  async getPricing() {
    await delay(300);
    return {
      success: true,
      plans: [
        {
          id: 'standard',
          name: 'Standard',
          price: 25,
          per: 'per signature',
          features: [
            'Single document notarization',
            'In-office appointments',
            'Standard processing',
            'Email confirmation'
          ]
        },
        {
          id: 'mobile',
          name: 'Mobile',
          price: 75,
          per: 'per visit',
          featured: true,
          features: [
            'We come to you in Charlotte',
            'Up to 5 signatures',
            'Same-day availability',
            'Priority scheduling',
            'Document review included'
          ]
        },
        {
          id: 'business',
          name: 'Business',
          price: 199,
          per: 'per month',
          features: [
            'Unlimited notarizations',
            'Dedicated notary assigned',
            'On-site or remote',
            'Bulk document handling',
            'Monthly invoicing',
            '24/7 support'
          ]
        }
      ]
    };
  }
};

// Auth helper
function isAuthenticated() {
  return !!localStorage.getItem('authToken');
}

function getCurrentUser() {
  const data = localStorage.getItem('user');
  return data ? JSON.parse(data) : null;
}

function setAuth(token, user) {
  localStorage.setItem('authToken', token);
  localStorage.setItem('user', JSON.stringify(user));
}
