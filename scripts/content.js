// ══════════════════════════════════════════
//  Lovable Pro — Content Script
//  Runs on: lovable.dev
// ══════════════════════════════════════════

(function () {
  'use strict';

  // ── Capture Lovable Token from page ──
  const _origXHR = window.XMLHttpRequest.prototype.open;
  window.XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this.addEventListener('load', function () {
      try {
        const auth = this.getResponseHeader('authorization') || this.getResponseHeader('x-auth-token');
        if (auth && auth.startsWith('Bearer ') && auth.length > 30) {
          const token = auth.slice(7);
          chrome.runtime.sendMessage({ action: 'tokenCaptured', token }).catch(() => {});
        }
      } catch {}
    });
    return _origXHR.call(this, method, url, ...rest);
  };

  // ── Capture project ID from URL ──
  function captureProjectId() {
    const match = window.location.pathname.match(/\/projects\/([a-f0-9-]{36})/i);
    if (match) {
      chrome.runtime.sendMessage({ action: 'projectCaptured', projectId: match[1] }).catch(() => {});
    }
  }
  captureProjectId();

  // Observe URL changes (SPA)
  let lastPath = location.pathname;
  setInterval(() => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      captureProjectId();
    }
  }, 1000);

  // ── Listen for guard state ──
  let guardActive = false;

  chrome.storage.local.get(['lp_license_valid', 'lp_guard'], (store) => {
    const valid = !!store.lp_license_valid;
    const guard = store.lp_guard !== false;
    guardActive = guard && !valid;
    if (guardActive) applyGuard();
  });

  chrome.storage.onChanged.addListener((changes) => {
    chrome.storage.local.get(['lp_license_valid', 'lp_guard'], (store) => {
      const valid = !!store.lp_license_valid;
      const guard = store.lp_guard !== false;
      guardActive = guard && !valid;
      if (guardActive) applyGuard();
      else removeGuard();
    });
  });

  // ── Guard: overlay on chat form ──
  function applyGuard() {
    if (document.getElementById('lp-guard-overlay')) return;
    const target = document.querySelector('form#chat-input, form[id*="chat"]');
    if (!target) {
      setTimeout(applyGuard, 800);
      return;
    }
    if (getComputedStyle(target).position === 'static') target.style.position = 'relative';
    const overlay = document.createElement('div');
    overlay.id = 'lp-guard-overlay';
    overlay.style.cssText = [
      'position:absolute;inset:0;z-index:999999',
      'display:flex;align-items:center;justify-content:center;padding:12px',
      'border-radius:inherit',
      'background:rgba(7,7,10,0.80)',
      'backdrop-filter:blur(12px)',
      'pointer-events:all;cursor:not-allowed',
    ].join(';');
    overlay.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;max-width:340px;padding:12px 14px;
        border-radius:14px;background:rgba(22,22,29,0.97);
        box-shadow:0 20px 60px rgba(0,0,0,.5);
        border:1px solid rgba(255,90,0,0.2);font-family:Cairo,Inter,sans-serif">
        <div style="width:36px;height:36px;border-radius:10px;
          background:linear-gradient(135deg,#ff5a00,#a259ff);
          display:flex;align-items:center;justify-content:center;
          font-weight:900;font-size:16px;color:#fff;flex-shrink:0">L</div>
        <div>
          <div style="font-size:13px;font-weight:800;color:#f0f0f5;line-height:1.2">Lovable Pro</div>
          <div style="font-size:11px;color:#8888a0;line-height:1.4;margin-top:3px">
            فعّل ترخيصك لاستخدام Lovable غير المحدود
          </div>
        </div>
      </div>`;
    ['click','mousedown','keydown','submit','touchstart'].forEach(ev => {
      overlay.addEventListener(ev, e => { e.preventDefault(); e.stopImmediatePropagation(); }, true);
    });
    target.appendChild(overlay);
  }

  function removeGuard() {
    document.getElementById('lp-guard-overlay')?.remove();
  }

  // Watch DOM for form appearance
  new MutationObserver(() => {
    if (guardActive) applyGuard();
  }).observe(document.documentElement, { childList: true, subtree: true });

})();
