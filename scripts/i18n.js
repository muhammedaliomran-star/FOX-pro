// ══════════════════════════════════════════
//  i18n — Arabic / English translations
// ══════════════════════════════════════════

const STRINGS = {
  ar: {
    tab_home: 'الرئيسية',
    tab_activate: 'التفعيل',
    tab_settings: 'الإعدادات',
    tab_help: 'المساعدة',
    stat_plan: 'الخطة',
    stat_status: 'الحالة',
    stat_devices: 'الأجهزة',
    stat_expires: 'الانتهاء',
    expiry_remaining: 'المتبقي',
    your_key: 'مفتاح الترخيص',
    btn_reload: 'تحديث Lovable',
    btn_activate_now: 'تفعيل الترخيص',
    activate_title: 'تفعيل الترخيص',
    key_label: 'مفتاح الترخيص',
    email_label: 'البريد الإلكتروني (اختياري)',
    btn_activate: 'تفعيل الآن',
    current_license: 'الترخيص الحالي',
    active: 'نشط',
    btn_deactivate: 'إلغاء التفعيل',
    settings_general: 'عام',
    setting_guard: 'حماية النموذج',
    setting_guard_desc: 'منع استخدام Lovable بدون ترخيص',
    setting_autotoken: 'جلب الجلسة تلقائياً',
    setting_autotoken_desc: 'استخراج token عند فتح Lovable',
    setting_notif: 'الإشعارات',
    setting_notif_desc: 'تنبيه عند اقتراب انتهاء الترخيص',
    setting_watermark: 'إزالة العلامة المائية',
    setting_watermark_desc: 'إزالة "Built with Lovable" تلقائياً',
    settings_session: 'جلسة Lovable',
    session_desc: 'الجلسة تُجلب تلقائياً عند فتح Lovable. يمكنك إدخالها يدوياً هنا.',
    project_id: 'Project ID',
    btn_save: 'حفظ',
    settings_danger: 'خطر',
    btn_clear_all: 'مسح كل البيانات',
    help_intro: 'تجد هنا حلول لأكثر المشكلات شيوعاً.',
    help_1_title: 'الإضافة مش بتشتغل',
    help_1_body: 'تأكد من أن الترخيص مفعّل من صفحة التفعيل.\nأعد تحميل صفحة Lovable بعد التفعيل.\nتأكد من وجود كريديت واحد على الأقل في حسابك.',
    help_2_title: 'طلب إكمال CAPTCHA',
    help_2_body: '<strong>الحل 1:</strong> أوقف الإضافة، أرسل برومبت عادي، أكمل الـ CAPTCHA، ثم أعد تشغيلها.<br><br><strong>الحل 2:</strong> استخدم VPN أو غير الخادم.<br><br><strong>الحل 3:</strong> سجّل خروج ودخول من Lovable.',
    help_3_title: 'رسالة "0 Credits"',
    help_3_body: 'الإضافة تحتاج كريديت واحد على الأقل.<br><br><strong>الحل 1:</strong> انتظر إعادة تعيين 5 كريديتات المجانية (24 ساعة).<br><br><strong>الحل 2:</strong> استخدم مساحة عمل أخرى بها كريديت.',
    help_4_title: 'نشاط مريب / تم الحظر',
    help_4_body: '<strong>الحل 1:</strong> غيّر الـ IP باستخدام VPN.<br><br><strong>الحل 2:</strong> استخدم حساب Lovable آخر.',
    help_5_title: 'الاستخدام الصحيح',
    help_5_body: '• أعد تحميل Lovable بعد تفعيل الترخيص.<br>• بعد إرسال برومبت، تأكد من ظهور "Lovable" في حقل الإدخال.<br>• إذا ظهر برومبتك بدلاً من "Lovable"، أعد التحميل وحاول مرة أخرى.',
    footer_copy: '© 2026 Lovable Pro',
    settings_about: 'عن الإضافة',
    about_version: 'الإصدار',
    about_source: 'كود المصدر',
    about_dev: 'المطور',
    status_active: 'نشط',
    status_inactive: 'غير مفعّل',
    status_trial: 'تجريبي',
    hero_welcome: 'مرحباً بك في Lovable Pro',
    hero_sub_inactive: 'فعّل ترخيصك للاستمتاع بالبناء غير المحدود',
    hero_sub_active: 'ترخيصك نشط — استمتع بالبناء!',
    copy_success: 'تم النسخ!',
    save_success: 'تم الحفظ بنجاح',
    clear_confirm: 'هل تريد مسح كل البيانات؟',
    deactivate_confirm: 'هل تريد إلغاء التفعيل؟',
    activating: 'جاري التفعيل...',
    activated_ok: 'تم التفعيل بنجاح! 🎉',
  },
  en: {
    tab_home: 'Home',
    tab_activate: 'Activate',
    tab_settings: 'Settings',
    tab_help: 'Help',
    stat_plan: 'Plan',
    stat_status: 'Status',
    stat_devices: 'Devices',
    stat_expires: 'Expires',
    expiry_remaining: 'Remaining',
    your_key: 'License Key',
    btn_reload: 'Reload Lovable',
    btn_activate_now: 'Activate License',
    activate_title: 'Activate License',
    key_label: 'License Key',
    email_label: 'Email (optional)',
    btn_activate: 'Activate Now',
    current_license: 'Current License',
    active: 'Active',
    btn_deactivate: 'Deactivate',
    settings_general: 'General',
    setting_guard: 'Form Guard',
    setting_guard_desc: 'Block Lovable without a valid license',
    setting_autotoken: 'Auto Session',
    setting_autotoken_desc: 'Extract session token automatically',
    setting_notif: 'Notifications',
    setting_notif_desc: 'Alert when license is about to expire',
    setting_watermark: 'Remove Watermark',
    setting_watermark_desc: 'Remove "Built with Lovable" automatically',
    settings_session: 'Lovable Session',
    session_desc: 'Session is fetched automatically. You can enter it manually here.',
    project_id: 'Project ID',
    btn_save: 'Save',
    settings_danger: 'Danger Zone',
    btn_clear_all: 'Clear All Data',
    settings_about: 'About',
    about_version: 'Version',
    about_source: 'Source Code',
    about_dev: 'Developer',
    help_intro: 'Find solutions to the most common issues here.',
    help_1_title: 'Extension Not Working',
    help_1_body: 'Make sure your license is activated.\nReload Lovable after activating.\nEnsure you have at least 1 credit in your account.',
    help_2_title: 'CAPTCHA Required',
    help_2_body: '<strong>Fix 1:</strong> Disable the extension, send a prompt, complete the CAPTCHA, then re-enable.<br><br><strong>Fix 2:</strong> Use a VPN or change servers.<br><br><strong>Fix 3:</strong> Sign out and back into Lovable.',
    help_3_title: '"0 Credits" Message',
    help_3_body: 'The extension needs at least 1 credit.<br><br><strong>Fix 1:</strong> Wait for your 5 free daily credits to reset (up to 24h).<br><br><strong>Fix 2:</strong> Switch to a workspace with available credits.',
    help_4_title: 'Suspicious Activity / Blocked',
    help_4_body: '<strong>Fix 1:</strong> Change your IP using a VPN.<br><br><strong>Fix 2:</strong> Use a different Lovable account.',
    help_5_title: 'Correct Usage',
    help_5_body: '• Reload Lovable after activating your license.<br>• After sending a prompt, make sure the input shows "Lovable".<br>• If it shows your prompt instead, reload and try again.',
    footer_copy: '© 2026 Lovable Pro',
    status_active: 'Active',
    status_inactive: 'Inactive',
    status_trial: 'Trial',
    hero_welcome: 'Welcome to Lovable Pro',
    hero_sub_inactive: 'Activate your license to build without limits',
    hero_sub_active: 'License active — happy building!',
    copy_success: 'Copied!',
    save_success: 'Saved successfully',
    clear_confirm: 'Clear all data?',
    deactivate_confirm: 'Deactivate license?',
    activating: 'Activating...',
    activated_ok: 'Activated successfully! 🎉',
  }
};

let currentLang = 'ar';

function t(key) {
  return STRINGS[currentLang]?.[key] || STRINGS.en[key] || key;
}

function applyLang(lang) {
  currentLang = lang;
  const body = document.getElementById('body');
  if (lang === 'ar') {
    body.classList.add('rtl');
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'ar');
  } else {
    body.classList.remove('rtl');
    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('lang', 'en');
  }
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.getAttribute('data-key');
    const val = t(key);
    if (el.innerHTML.includes('<')) el.innerHTML = val;
    else el.textContent = val;
  });
  document.getElementById('lang-ar').classList.toggle('active', lang === 'ar');
  document.getElementById('lang-en').classList.toggle('active', lang === 'en');
}
