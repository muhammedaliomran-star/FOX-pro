// ══════════════════════════════════════════
//  Lovable Pro — Popup Controller
// ══════════════════════════════════════════

const API_BASE = 'https://io.eklas.dev/api/v1';

// ── State ──
let currentPage = 'home';
let licenseData = null;

// ── Init ──
document.addEventListener('DOMContentLoaded', async () => {
  const store = await getStorage([
    'lp_lang', 'lp_license_key', 'lp_email',
    'lp_license_valid', 'lp_license_info',
    'lp_token', 'lp_project_id',
    'lp_guard', 'lp_autotoken', 'lp_notif', 'lp_watermark',
  ]);

  // Apply language
  const lang = store.lp_lang || 'ar';
  applyLang(lang);

  // Restore settings toggles
  setToggle('guard', store.lp_guard !== false);
  setToggle('autotoken', store.lp_autotoken !== false);
  setToggle('notif', store.lp_notif !== false);
  setToggle('watermark', !!store.lp_watermark);

  // Restore session fields
  if (store.lp_token) document.getElementById('token-input').value = store.lp_token;
  if (store.lp_project_id) document.getElementById('project-input').value = store.lp_project_id;

  // Restore license key input
  if (store.lp_license_key) {
    document.getElementById('license-input').value = store.lp_license_key;
  }

  // Render license status
  if (store.lp_license_valid && store.lp_license_key) {
    licenseData = store.lp_license_info || null;
    renderActiveLicense(store.lp_license_key, licenseData);
  } else {
    renderInactiveLicense();
  }

  // Check open page from storage
  const { lp_open_page } = await getStorage(['lp_open_page']);
  if (lp_open_page) {
    goTo(lp_open_page);
    chrome.storage.local.remove('lp_open_page');
  }
});

// ── Navigation ──
function goTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`page-${page}`)?.classList.add('active');
  document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
  currentPage = page;
}

// ── Language ──
function setLang(lang) {
  applyLang(lang);
  chrome.storage.local.set({ lp_lang: lang });
}

// ── License Rendering ──
function renderActiveLicense(key, info) {
  // Hero
  document.getElementById('hero-icon').textContent = '✅';
  document.getElementById('hero-title').textContent = t('hero_welcome');
  document.getElementById('hero-subtitle').textContent = t('hero_sub_active');

  // Status pill
  const pill = document.getElementById('status-pill');
  pill.className = 'status-pill ' + (info?.plan === 'Trial' ? 'trial' : 'active');
  document.getElementById('status-text').textContent =
    info?.plan === 'Trial' ? t('status_trial') : t('status_active');

  // Plan badge
  document.getElementById('plan-badge').textContent = info?.plan || 'Pro';

  // Stats
  const statsSection = document.getElementById('stats-section');
  statsSection.style.display = 'grid';
  document.getElementById('stat-plan').textContent = info?.plan || 'Pro';
  document.getElementById('stat-status').textContent = '✓ ' + t('status_active');

  // Expiry
  if (info?.expires_at) {
    const exp = new Date(info.expires_at);
    const now = new Date();
    const totalDays = info.duration_minutes ? Math.round(info.duration_minutes / 1440) : 30;
    const daysLeft = Math.max(0, Math.round((exp - now) / 86400000));
    const pct = Math.min(100, Math.round((daysLeft / totalDays) * 100));

    document.getElementById('stat-expires').textContent = exp.toLocaleDateString();
    document.getElementById('expiry-wrap').style.display = 'block';
    document.getElementById('expiry-days').textContent = daysLeft + (currentLang === 'ar' ? ' يوم' : ' days');
    document.getElementById('expiry-fill').style.width = pct + '%';
  }

  // Key display
  document.getElementById('key-display-wrap').style.display = 'block';
  document.getElementById('key-display').textContent = maskKey(key);

  // Buttons
  document.getElementById('btn-reload').style.display = 'flex';
  document.getElementById('btn-go-activate').style.display = 'none';

  // Activate page — show deactivate card
  document.getElementById('deactivate-card').style.display = 'block';
  document.getElementById('activate-key-display').textContent = maskKey(key);

  // Home alert
  document.getElementById('home-alert').style.display = 'none';
}

function renderInactiveLicense() {
  document.getElementById('hero-icon').textContent = '🔒';
  document.getElementById('hero-title').textContent = t('hero_welcome');
  document.getElementById('hero-subtitle').textContent = t('hero_sub_inactive');
  document.getElementById('status-pill').className = 'status-pill inactive';
  document.getElementById('status-text').textContent = t('status_inactive');
  document.getElementById('plan-badge').textContent = 'Pro';
  document.getElementById('stats-section').style.display = 'none';
  document.getElementById('expiry-wrap').style.display = 'none';
  document.getElementById('key-display-wrap').style.display = 'none';
  document.getElementById('btn-reload').style.display = 'none';
  document.getElementById('btn-go-activate').style.display = 'flex';
  document.getElementById('deactivate-card').style.display = 'none';
}

// ── Activate License ──
async function activateLicense() {
  const key = document.getElementById('license-input').value.trim();
  const email = document.getElementById('email-input').value.trim();

  hideAlert('activate-error');
  hideAlert('activate-success');

  if (!key) {
    showAlert('activate-error', '❌ ' + (currentLang === 'ar' ? 'أدخل مفتاح الترخيص أولاً' : 'Enter license key first'));
    return;
  }

  const btn = document.getElementById('btn-activate');
  btn.disabled = true;
  btn.innerHTML = `<div class="btn-spinner"></div> ${t('activating')}`;

  try {
    const res = await fetch(`${API_BASE}/licenses/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, licenseKey: key, email, extensionVersion: '1.0.0', heartbeat: false }),
    });
    const data = await res.json();

    if (data.ok || data.valid || data.status === 'active') {
      await chrome.storage.local.set({
        lp_license_key: key,
        lp_email: email,
        lp_license_valid: true,
        lp_license_info: data.license || data,
      });
      licenseData = data.license || data;
      showAlert('activate-success', t('activated_ok'));
      renderActiveLicense(key, licenseData);
      setTimeout(() => goTo('home'), 1500);
    } else {
      showAlert('activate-error', '❌ ' + (data.error || (currentLang === 'ar' ? 'مفتاح غير صحيح' : 'Invalid license key')));
    }
  } catch (e) {
    showAlert('activate-error', '❌ ' + (currentLang === 'ar' ? 'فشل الاتصال بالخادم' : 'Connection failed'));
  }

  btn.disabled = false;
  btn.innerHTML = `<span>🔑</span> <span data-key="btn_activate">${t('btn_activate')}</span>`;
}

// ── Deactivate ──
async function deactivateLicense() {
  if (!confirm(t('deactivate_confirm'))) return;
  await chrome.storage.local.remove(['lp_license_key', 'lp_email', 'lp_license_valid', 'lp_license_info']);
  licenseData = null;
  renderInactiveLicense();
  document.getElementById('license-input').value = '';
  goTo('home');
}

// ── Reload Lovable ──
async function reloadLovable() {
  const tabs = await chrome.tabs.query({ url: '*://lovable.dev/*' });
  tabs.forEach(tab => chrome.tabs.reload(tab.id));
  window.close();
}

// ── Copy Key ──
async function copyKey() {
  const store = await getStorage(['lp_license_key']);
  if (store.lp_license_key) {
    await navigator.clipboard.writeText(store.lp_license_key);
    const el = document.getElementById('key-display');
    const orig = el.textContent;
    el.textContent = t('copy_success');
    setTimeout(() => el.textContent = orig, 1500);
  }
}

// ── Save Session ──
async function saveSession() {
  const token = document.getElementById('token-input').value.trim();
  const projectId = document.getElementById('project-input').value.trim();
  await chrome.storage.local.set({ lp_token: token, lp_project_id: projectId });
  showTempMsg(t('save_success'));
}

// ── Clear All ──
async function clearAll() {
  if (!confirm(t('clear_confirm'))) return;
  await chrome.storage.local.clear();
  location.reload();
}

// ── Toggles ──
function setToggle(id, val) {
  const el = document.getElementById(`toggle-${id}`);
  if (!el) return;
  if (val) el.classList.add('on');
  else el.classList.remove('on');
}

async function toggleSetting(id) {
  const el = document.getElementById(`toggle-${id}`);
  const isOn = el.classList.toggle('on');
  await chrome.storage.local.set({ [`lp_${id}`]: isOn });
}

// ── Help Accordion ──
function toggleHelp(item) {
  item.classList.toggle('open');
}

// ── Helpers ──
function getStorage(keys) {
  return new Promise(resolve => chrome.storage.local.get(keys, resolve));
}

function maskKey(key) {
  if (!key) return '—';
  const parts = key.split('-');
  if (parts.length >= 4) {
    return parts[0] + '-' + parts[1] + '-****-****-' + parts[parts.length - 1];
  }
  return key.substring(0, 8) + '...';
}

function showAlert(id, msg) {
  const el = document.getElementById(id);
  const textId = id + '-text';
  if (el) { el.style.display = 'flex'; }
  const text = document.getElementById(textId);
  if (text) text.textContent = msg;
}

function hideAlert(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

function showTempMsg(msg) {
  const el = document.createElement('div');
  el.className = 'alert success';
  el.style.cssText = 'position:fixed;bottom:40px;left:50%;transform:translateX(-50%);z-index:999;animation:fadeIn 0.2s ease;white-space:nowrap;';
  el.innerHTML = '<span>✅</span><span>' + msg + '</span>';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2000);
}
