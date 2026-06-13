const assert = require('assert');

const API_BASE = 'http://localhost:5001/api/v1';
const APP_BASE = 'http://localhost:5001';

async function runTests() {
  const results = {
    backendStarts: false,
    registration: false,
    login: false,
    jwtAuth: false,
    urlShortening: false,
    redirect: false,
    dashboardLoad: false,
    analytics: false,
    errors: []
  };

  try {
    // 1. Backend Starts
    try {
      const health = await fetch(`${API_BASE}/public/nonexistent`);
      results.backendStarts = true;
    } catch (e) {
      results.errors.push(`Backend start check failed: ${e.message}`);
    }

    // Wait for DB connection if needed
    await new Promise(r => setTimeout(r, 1000));

    // 3. User registration
    const username = `testuser_${Date.now()}`;
    const email = `${username}@example.com`;
    const password = 'password123';
    
    let token;
    try {
      const regRes = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const regData = await regRes.json();
      if (regData.token) {
        results.registration = true;
        token = regData.token;
      } else {
        results.errors.push(`Registration failed: ${regData.error}`);
      }
    } catch (e) {
      results.errors.push(`Registration failed: ${e.message}`);
    }

    // 4. User login & 5. JWT Auth
    try {
      const loginRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const loginData = await loginRes.json();
      if (loginData.token) {
        results.login = true;
        token = loginData.token; // Update token
      } else {
        results.errors.push(`Login failed: ${loginData.error}`);
      }
      
      const meRes = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const meData = await meRes.json();
      if (meData.success) {
        results.jwtAuth = true;
      } else {
        results.errors.push(`JWT Auth failed: ${meData.error}`);
      }
    } catch (e) {
      results.errors.push(`Login/JWT failed: ${e.message}`);
    }

    // 6. URL Shortening
    let shortCode;
    try {
      const urlRes = await fetch(`${API_BASE}/urls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ originalUrl: 'https://example.com/verify-' + Date.now() })
      });
      const urlData = await urlRes.json();
      if (urlData.data && urlData.data.shortCode) {
        results.urlShortening = true;
        shortCode = urlData.data.shortCode;
      } else {
        results.errors.push(`URL Shortening failed: ${urlData.error}`);
      }
    } catch (e) {
      results.errors.push(`URL Shortening failed: ${e.message}`);
    }

    // 7. Redirect
    try {
      if (shortCode) {
        const redirRes = await fetch(`${APP_BASE}/${shortCode}`, {
          redirect: 'manual'
        });
        if (redirRes.status === 302 || redirRes.status === 301) {
          results.redirect = true;
        } else {
          results.errors.push(`Redirect failed: Status ${redirRes.status}`);
        }
      }
    } catch (e) {
      results.errors.push(`Redirect failed: ${e.message}`);
    }

    // Wait a bit for analytics click async tracking to finish
    await new Promise(r => setTimeout(r, 500));

    // 8. Dashboard Loads URLs
    try {
      const getUrlsRes = await fetch(`${API_BASE}/urls`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const getUrlsData = await getUrlsRes.json();
      if (getUrlsData.data && Array.isArray(getUrlsData.data)) {
        results.dashboardLoad = true;
      } else {
        results.errors.push(`Dashboard URL loading failed: ${getUrlsData.error}`);
      }
    } catch (e) {
      results.errors.push(`Dashboard URL loading failed: ${e.message}`);
    }

    // 9. Analytics Endpoint
    try {
      if (shortCode) {
        const analyticsRes = await fetch(`${API_BASE}/analytics/${shortCode}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const analyticsData = await analyticsRes.json();
        if (analyticsData.data) {
          results.analytics = true;
        } else {
          results.errors.push(`Analytics failed: ${analyticsData.error}`);
        }
      }
    } catch (e) {
      results.errors.push(`Analytics failed: ${e.message}`);
    }

  } catch (globalErr) {
    results.errors.push(`Global testing error: ${globalErr.message}`);
  }

  console.log(JSON.stringify(results, null, 2));
}

runTests();
