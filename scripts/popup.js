// ══════════════════════════════════════════
//  Lovable Pro — Popup Controller
//  🟢 OPEN SOURCE VERSION — No license required
// ══════════════════════════════════════════

let licenseData = null;
let currentLang = 'ar'; // default

// ═══════════════════════════════
//  DOM Ready — Wire everything
// ═══════════════════════════════
document.addEventListener('DOMContentLoaded', async () => {

  // ── Load storage ──
  const store = await getStorage([
    'lp_lang', 'lp_license_key', 'lp_email',
    'lp_license_valid', 'lp_license_info',
    'lp_token', 'lp_project_id',
    'lp_guard', 'lp_autotoken', 'lp_notif', 'lp_watermark'
  ]);

  // 🟢 تفعيل تلقائي إذا لم يكن هناك ترخيص (لأول مرة)
  if (!store.lp_license_valid || !store.lp_license_key) {
    const fakeKey = 'OPEN-' + Math.random().toString(36).substring(2, 10).toUpperCase() +
                    '-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    await chrome.storage.local.set({
      lp_license_key: fakeKey,
      lp_license_valid: true,
      lp_license_info: {
        plan: 'Open Source',
        status: 'active',
        expires_at: new Date(Date.now() + 365 * 86400000).toISOString(),
        duration_minutes: 525600
      }
    });
    // بعد التفعيل، نعيد تحميل الـ popup عشان تظهر الحالة النشطة
    location.reload();
    return; // نوقف تنفيذ باقي الكود لأن الصفحة هتعيد التحميل
  }

  // ── Language ──
  currentLang = store.lp_lang || 'ar';
  applyLang(currentLang);
  document.getElementById('lang-ar').addEventListener('click', () => setLang('ar'));
  document.getElementById('lang-en').addEventListener('click', () => setLang('en'));

  // ── Nav tabs ──
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => goTo(tab.dataset.page));
  });

  // ── Home buttons ──
  document.getElementById('btn-reload').addEventListener('click', reloadLovable);
  document.getElementById('btn-go-activate').addEventListener('click', () => goTo('activate'));
  document.getElementById('key-display').addEventListener('click', copyKey);

  // ── Activate page ──
  document.getElementById('btn-activate').addEventListener('click', activateLicense);
  document.getElementById('btn-deactivate').addEventListener('click', deactivateLicense);
  document.getElementById('btn-get-trial').addEventListener('click', getTrialKey);

  // ── Settings page ──
  document.querySelectorAll('.toggle[data-setting]').forEach(toggle => {
    toggle.addEventListener('click', () => toggleSetting(toggle.dataset.setting));
  });
  document.getElementById('btn-save-session').addEventListener('click', saveSession);
  document.getElementById('btn-clear-all').addEventListener('click', clearAll);

  // ── Help accordion ──
  document.querySelectorAll('.help-item').forEach(item => {
    item.querySelector('.help-item-header').addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });

  // ── Restore settings toggles ──
  setToggle('guard',     store.lp_guard     !== false);
  setToggle('autotoken', store.lp_autotoken !== false);
  setToggle('notif',     store.lp_notif     !== false);
  setToggle('watermark', !!store.lp_watermark);

  // ── Restore session fields ──
  if (store.lp_token)      document.getElementById('token-input').value = store.lp_token;
  if (store.lp_project_id) document.getElementById('project-input').value = store.lp_project_id;
  if (store.lp_license_key) document.getElementById('license-input').value = store.lp_license_key;

  // ── Render license status ──
  if (store.lp_license_valid && store.lp_license_key) {
    licenseData = store.lp_license_info || { plan: 'Open Source', status: 'active', expires_at: null };
    renderActiveLicense(store.lp_license_key, licenseData);
  } else {
    renderInactiveLicense();
  }
});

// ═══════════════════════════════
//  Navigation
// ═══════════════════════════════
function goTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`page-${page}`)?.classList.add('active');
  document.querySelector(`.nav-tab[data-page="${page}"]`)?.classList.add('active');
}

// ═══════════════════════════════
//  Language
// ═══════════════════════════════
function setLang(lang) {
  currentLang = lang;
  applyLang(lang);
  chrome.storage.local.set({ lp_lang: lang });
  location.reload();
}

// ═══════════════════════════════
//  License Rendering
// ═══════════════════════════════
function renderActiveLicense(key, info) {
  document.getElementById('hero-icon').textContent = '✅';
  document.getElementById('hero-title').textContent = t('hero_welcome');
  document.getElementById('hero-subtitle').textContent = t('hero_sub_active');

  const pill = document.getElementById('status-pill');
  pill.className = 'status-pill ' + (info?.plan === 'Trial' ? 'trial' : 'active');
  document.getElementById('status-text').textContent =
    info?.plan === 'Trial' ? t('status_trial') : t('status_active');
  document.getElementById('plan-badge').textContent = info?.plan || 'Open Source';

  document.getElementById('stats-section').style.display = 'grid';
  document.getElementById('stat-plan').textContent = info?.plan || 'Open Source';
  document.getElementById('stat-status').textContent = '✓ ' + t('status_active');

  if (info?.expires_at) {
    const exp = new Date(info.expires_at);
    const totalDays = info.duration_minutes ? Math.round(info.duration_minutes / 1440) : 365;
    const daysLeft = Math.max(0, Math.round((exp - Date.now()) / 86400000));
    const pct = Math.min(100, Math.round((daysLeft / totalDays) * 100));

    document.getElementById('stat-expires').textContent = exp.toLocaleDateString();
    document.getElementById('expiry-wrap').style.display = 'block';
    document.getElementById('expiry-days').textContent = daysLeft + (currentLang === 'ar' ? ' يوم' : ' days');
    document.getElementById('expiry-fill').style.width = pct + '%';
  } else {
    document.getElementById('stat-expires').textContent = currentLang === 'ar' ? 'غير محدود' : 'Unlimited';
    document.getElementById('expiry-wrap').style.display = 'block';
    document.getElementById('expiry-days').textContent = currentLang === 'ar' ? '♾️ غير محدود' : '♾️ Unlimited';
    document.getElementById('expiry-fill').style.width = '100%';
  }

  document.getElementById('key-display-wrap').style.display = 'block';
  document.getElementById('key-display').textContent = maskKey(key);
  document.getElementById('btn-reload').style.display = 'flex';
  document.getElementById('btn-go-activate').style.display = 'none';
  document.getElementById('deactivate-card').style.display = 'block';
  document.getElementById('activate-key-display').textContent = maskKey(key);
  document.getElementById('home-alert').style.display = 'none';
}

function renderInactiveLicense() {
  document.getElementById('hero-icon').textContent = '🔓';
  document.getElementById('hero-title').textContent = t('hero_welcome');
  document.getElementById('hero-subtitle').textContent = currentLang === 'ar' 
    ? 'نسخة مفتوحة المصدر — اضغط "تفعيل" لبدء الاستخدام' 
    : 'Open source version — Click "Activate" to start';
  document.getElementById('status-pill').className = 'status-pill inactive';
  document.getElementById('status-text').textContent = currentLang === 'ar' ? 'غير مفعل' : 'Inactive';
  document.getElementById('plan-badge').textContent = 'Open Source';
  document.getElementById('stats-section').style.display = 'none';
  document.getElementById('expiry-wrap').style.display = 'none';
  document.getElementById('key-display-wrap').style.display = 'none';
  document.getElementById('btn-reload').style.display = 'none';
  document.getElementById('btn-go-activate').style.display = 'flex';
  document.getElementById('deactivate-card').style.display = 'none';
}

// ═══════════════════════════════
//  Generate Trial Key (BYPASSED - gives fake key)
// ═══════════════════════════════
async function getTrialKey() {
  const btn = document.getElementById('btn-get-trial');
  btn.disabled = true;
  btn.innerHTML = `<div class="btn-spinner"></div> ${t('generating_trial')}`;
  hideAlert('activate-error');
  hideAlert('activate-success');

  const fakeKey = 'OPEN-' + Math.random().toString(36).substring(2, 10).toUpperCase() + 
                  '-' + Math.random().toString(36).substring(2, 10).toUpperCase() +
                  '-' + Math.random().toString(36).substring(2, 6).toUpperCase();

  await chrome.storage.local.set({
    lp_license_key: fakeKey,
    lp_license_valid: true,
    lp_license_info: {
      plan: 'Open Source',
      status: 'active',
      expires_at: new Date(Date.now() + 365 * 86400000).toISOString(),
      duration_minutes: 525600
    }
  });

  document.getElementById('license-input').value = fakeKey;
  await activateLicense();
  btn.disabled = false;
  btn.innerHTML = `<span>⚡</span> <span>${t('btn_get_trial')}</span>`;
}

// ═══════════════════════════════
//  Activate License (LOCAL - no server)
// ═══════════════════════════════
async function activateLicense() {
  const key   = document.getElementById('license-input').value.trim();
  const email = document.getElementById('email-input').value.trim();

  hideAlert('activate-error');
  hideAlert('activate-success');

  if (!key) {
    showAlert('activate-error', currentLang === 'ar' ? 'أدخل مفتاح الترخيص أولاً' : 'Enter your license key first');
    return;
  }

  const btn = document.getElementById('btn-activate');
  btn.disabled = true;
  btn.innerHTML = `<div class="btn-spinner"></div> ${t('activating')}`;

  try {
    const fakeInfo = {
      plan: 'Open Source',
      status: 'active',
      expires_at: new Date(Date.now() + 365 * 86400000).toISOString(),
      duration_minutes: 525600
    };

    await chrome.storage.local.set({
      lp_license_key: key,
      lp_email: email,
      lp_license_valid: true,
      lp_license_info: fakeInfo,
    });

    licenseData = fakeInfo;
    showAlert('activate-success', currentLang === 'ar' ? '✅ تم التفعيل بنجاح!' : '✅ Activated successfully!');
    renderActiveLicense(key, fakeInfo);
    setTimeout(() => goTo('home'), 1500);
  } catch (e) {
    showAlert('activate-error', currentLang === 'ar' ? 'حدث خطأ أثناء التفعيل' : 'Activation error');
  }

  btn.disabled = false;
  btn.innerHTML = `<span>🔑</span> <span>${t('btn_activate')}</span>`;
}

// ═══════════════════════════════
//  Deactivate
// ═══════════════════════════════
async function deactivateLicense() {
  if (!confirm(t('deactivate_confirm'))) return;
  await chrome.storage.local.remove(['lp_license_key','lp_email','lp_license_valid','lp_license_info']);
  licenseData = null;
  renderInactiveLicense();
  document.getElementById('license-input').value = '';
  goTo('home');
}

// ═══════════════════════════════
//  Reload Lovable
// ═══════════════════════════════
async function reloadLovable() {
  const tabs = await chrome.tabs.query({ url: ['*://lovable.dev/*', '*://*.lovable.dev/*'] });
  tabs.forEach(tab => chrome.tabs.reload(tab.id));
  window.close();
}

// ═══════════════════════════════
//  Copy Key
// ═══════════════════════════════
async function copyKey() {
  const store = await getStorage(['lp_license_key']);
  if (!store.lp_license_key) return;
  await navigator.clipboard.writeText(store.lp_license_key);
  const el = document.getElementById('key-display');
  const orig = el.textContent;
  el.textContent = t('copy_success');
  setTimeout(() => { el.textContent = orig; }, 1500);
}

// ═══════════════════════════════
//  Save Session
// ═══════════════════════════════
async function saveSession() {
  const token     = document.getElementById('token-input').value.trim();
  const projectId = document.getElementById('project-input').value.trim();
  await chrome.storage.local.set({ lp_token: token, lp_project_id: projectId });
  showTempMsg(t('save_success'));
}

// ═══════════════════════════════
//  Clear All
// ═══════════════════════════════
async function clearAll() {
  if (!confirm(t('clear_confirm'))) return;
  await chrome.storage.local.clear();
  location.reload();
}

// ═══════════════════════════════
//  Toggles
// ═══════════════════════════════
function setToggle(id, val) {
  const el = document.getElementById(`toggle-${id}`);
  if (!el) return;
  el.classList.toggle('on', val);
}

async function toggleSetting(id) {
  const el = document.getElementById(`toggle-${id}`);
  const isOn = el.classList.toggle('on');
  await chrome.storage.local.set({ [`lp_${id}`]: isOn });
}

// ═══════════════════════════════
//  Helpers
// ═══════════════════════════════
function getStorage(keys) {
  return new Promise(resolve => chrome.storage.local.get(keys, resolve));
}

function maskKey(key) {
  if (!key) return '—';
  const parts = key.split('-');
  if (parts.length >= 5) return `${parts[0]}-${parts[1]}-****-****-${parts[4]}`;
  if (key.length > 12) return key.substring(0, 8) + '...' + key.substring(key.length - 4);
  return key.substring(0, 8) + '...';
}

function showAlert(id, msg) {
  const wrap = document.getElementById(id);
  const text = document.getElementById(`${id}-text`);
  if (wrap) wrap.style.display = 'flex';
  if (text) text.textContent = msg;
}

function hideAlert(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

function showTempMsg(msg) {
  const el = document.createElement('div');
  el.className = 'alert success';
  el.style.cssText = 'position:fixed;bottom:44px;left:50%;transform:translateX(-50%);z-index:9999;white-space:nowrap;';
  el.innerHTML = `<span>✅</span><span>${msg}</span>`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2000);
}
