// ══════════════════════════════════════════
//  Lovable Pro — Background Service Worker
// ══════════════════════════════════════════

const API_BASE = 'https://io.eklas.dev/api/v1';

// ── Startup ──
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ lp_guard: true, lp_autotoken: true, lp_notif: true });
});

// ── Alarm: Heartbeat every 30 min ──
chrome.alarms.create('lp_heartbeat', { periodInMinutes: 30 });
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'lp_heartbeat') await heartbeat();
  if (alarm.name === 'lp_expiry_check') await checkExpiry();
});

// Expiry check daily
chrome.alarms.create('lp_expiry_check', { periodInMinutes: 1440 });

// ── Message handler ──
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'validateLicense') {
    validateLicense(msg.key, msg.email).then(sendResponse);
    return true;
  }
  if (msg.action === 'sendChat') {
    sendChat(msg).then(sendResponse);
    return true;
  }
  if (msg.action === 'getStatus') {
    getStatus().then(sendResponse);
    return true;
  }
  if (msg.action === 'tokenCaptured') {
    chrome.storage.local.set({ lp_token: msg.token });
    return false;
  }
  if (msg.action === 'projectCaptured') {
    chrome.storage.local.set({ lp_project_id: msg.projectId });
    return false;
  }
});

// ── Validate License ──
async function validateLicense(key, email = '') {
  try {
    const res = await fetch(`${API_BASE}/licenses/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, licenseKey: key, email, extensionVersion: '1.0.0', heartbeat: false }),
    });
    const data = await res.json();
    const valid = !!(data.ok || data.valid || data.status === 'active');
    if (valid) {
      await chrome.storage.local.set({
        lp_license_key: key,
        lp_license_valid: true,
        lp_license_info: data.license || data,
      });
    }
    return { ok: valid, ...data };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ── Send Chat ──
async function sendChat({ message, projectId, token, files = [] }) {
  const store = await getStorage(['lp_license_key', 'lp_email', 'lp_token', 'lp_project_id']);
  const licenseKey = store.lp_license_key || '';
  const email = store.lp_email || '';
  const tk = token || store.lp_token || '';
  const pid = projectId || store.lp_project_id || '';

  try {
    const res = await fetch(`${API_BASE}/lovable/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-License-Key': licenseKey,
      },
      body: JSON.stringify({ message, licenseKey, email, projectId: pid, token: tk, files, optimisticImageUrls: [], clientGitSha: '' }),
    });
    return await res.json();
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ── Heartbeat ──
async function heartbeat() {
  const store = await getStorage(['lp_license_key', 'lp_email', 'lp_license_valid']);
  if (!store.lp_license_valid || !store.lp_license_key) return;
  try {
    await fetch(`${API_BASE}/licenses/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: store.lp_license_key, licenseKey: store.lp_license_key, email: store.lp_email || '', heartbeat: true, extensionVersion: '1.0.0' }),
    });
  } catch {}
}

// ── Check Expiry ──
async function checkExpiry() {
  const store = await getStorage(['lp_license_info', 'lp_notif', 'lp_license_valid']);
  if (!store.lp_license_valid || !store.lp_notif) return;
  const info = store.lp_license_info;
  if (!info?.expires_at) return;
  const daysLeft = Math.round((new Date(info.expires_at) - Date.now()) / 86400000);
  if (daysLeft <= 3 && daysLeft >= 0) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon-ar-128.png',
      title: 'Lovable Pro',
      message: `ترخيصك ينتهي خلال ${daysLeft} أيام. جدّد الآن!`,
    });
  }
}

// ── Get Status ──
async function getStatus() {
  const store = await getStorage(['lp_license_valid', 'lp_license_key', 'lp_license_info']);
  return {
    valid: !!store.lp_license_valid,
    key: store.lp_license_key || '',
    info: store.lp_license_info || null,
  };
}

// ── Helpers ──
function getStorage(keys) {
  return new Promise(resolve => chrome.storage.local.get(keys, resolve));
}
