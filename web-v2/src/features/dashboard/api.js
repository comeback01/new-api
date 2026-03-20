import { api } from '../../lib/api-client';

export async function fetchDashboardCurrentUser() {
  const res = await api.get('/api/user/self');
  const payload = res.data;
  if (!payload?.success) throw new Error(payload?.message || 'Failed to load current user');
  return payload.data;
}

export async function fetchDashboardUsage({ isAdmin = false, username = '', startTimestamp, endTimestamp, defaultTime = '' }) {
  const params = new URLSearchParams();
  if (startTimestamp) params.set('start_timestamp', String(startTimestamp));
  if (endTimestamp) params.set('end_timestamp', String(endTimestamp));
  if (defaultTime) params.set('default_time', defaultTime);
  if (isAdmin && username) params.set('username', username);
  const base = isAdmin ? '/api/data/' : '/api/data/self/';
  const url = `${base}?${params.toString()}`;
  const res = await api.get(url);
  const payload = res.data;
  if (!payload?.success) throw new Error(payload?.message || 'Failed to load dashboard usage');
  return payload.data || [];
}
