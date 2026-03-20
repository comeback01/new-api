import { useEffect, useMemo, useState } from 'react';
import { fetchDashboardCurrentUser, fetchDashboardUsage } from './api';
import { getStoredUser } from '../../lib/api-client';

function toTimestamp(date) {
  return Math.floor(date.getTime() / 1000);
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function aggregateUsage(items) {
  const safeItems = Array.isArray(items) ? items : [];
  return safeItems.reduce(
    (acc, item) => {
      acc.requests += Number(item.count || 0);
      acc.quota += Number(item.quota || 0);
      return acc;
    },
    { requests: 0, quota: 0, items: safeItems.length },
  );
}

export function useDashboard() {
  const storedUser = getStoredUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [usage, setUsage] = useState([]);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const now = new Date();
      const currentUser = await fetchDashboardCurrentUser();
      const usageData = await fetchDashboardUsage({
        isAdmin: (storedUser?.role || 0) >= 10,
        username: currentUser?.username || '',
        startTimestamp: toTimestamp(startOfToday()),
        endTimestamp: toTimestamp(now),
        defaultTime: 'day',
      });
      setUser(currentUser);
      setUsage(usageData);
    } catch (err) {
      setError(err?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const summary = useMemo(() => aggregateUsage(usage), [usage]);

  return { loading, error, user, usage, summary, reload: load };
}
