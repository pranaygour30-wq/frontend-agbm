export const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Debug: surface API base in console to verify environment usage
console.log('[api] Using API_BASE:', API_BASE);

async function request(path: string, options: RequestInit = {}) {
  // Get auth token from localStorage if available
  const token = localStorage.getItem('memberToken');
  
  // Prepare headers with auth token if available
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  
  return res.json();
}

export const api = {
  // Auth endpoints
  authLogin: (email: string, phone: string) => 
    request('/auth/login', { 
      method: 'POST', 
      body: JSON.stringify({ email, phone }) 
    }),
  
  // Data endpoints
  members: () => request('/members'),
  member: (id: string) => request(`/members/${id}`),
  officebearers: () => request('/officebearers'),
  events: () => request('/events'),
  gallery: () => request('/gallery'),
  redClub: () => request('/members?bloodGroup=O%2B'),
  birthdays: () => request('/members/birthdays'),
  anniversaries: () => request('/members/anniversaries'),
};