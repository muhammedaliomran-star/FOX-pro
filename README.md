<div align="center">
  <img src="icons/icon-ar-128.png" width="80" alt="Lovable Pro Logo">
  <h1>Lovable Pro</h1>
  <p><strong>إضافة Chrome احترافية لـ Lovable AI — بناء غير محدود بدون قيود</strong></p>
  <p>
    <img src="https://img.shields.io/badge/version-1.0.0-ff5a00?style=flat-square">
    <img src="https://img.shields.io/badge/manifest-v3-a259ff?style=flat-square">
    <img src="https://img.shields.io/badge/languages-AR%20%7C%20EN-22c55e?style=flat-square">
  </p>
</div>

---

## ✨ المميزات

- 🌍 **ثنائي اللغة** — واجهة كاملة عربي وإنجليزي مع دعم RTL
- 🎁 **مفتاح تجريبي فوري** — توليد سيريال تجربة 30 دقيقة بنقرة واحدة من الإضافة أو الصفحة
- 🗂️ **4 صفحات منفصلة** — الرئيسية، التفعيل، الإعدادات، المساعدة
- 🔑 **إدارة الترخيص** — تفعيل وإلغاء تفعيل مباشر من الـ popup
- 📊 **لوحة إحصائيات** — الخطة، الحالة، تاريخ الانتهاء، شريط المدة
- 🛡️ **حماية النموذج** — منع استخدام Lovable بدون ترخيص
- ⚡ **جلب الجلسة تلقائياً** — استخراج session token من الصفحة
- 🔔 **إشعارات انتهاء الترخيص** — تنبيه قبل انتهاء الاشتراك
- 🎨 **تصميم داكن احترافي** — gradient، glassmorphism، micro-animations

---

## 🎁 التجربة المجانية (Free Trial)

يمكن للمستخدمين تجربة الإضافة لمدة **30 دقيقة** فوراً:
1. افتح صفحة التفعيل في الإضافة أو الموقع.
2. اضغط على **"توليد مفتاح تجريبي" (Get Trial Key)**.
3. يتم توليد وتفعيل مفتاح التجربة فوراً لبدء العمل.

---

## 📁 هيكل المشروع

```
lovable-pro/
├── manifest.json              ← Chrome Extension MV3
├── popup.html                 ← واجهة الـ popup (4 صفحات)
├── scripts/
│   ├── background.js          ← Service worker + API + heartbeat
│   ├── content.js             ← حقن في lovable.dev
│   ├── i18n.js               ← ترجمات عربي / إنجليزي
│   └── popup.js               ← منطق الـ popup + توليد التجربة
├── styles/
│   └── main.css               ← Design system كامل
├── docs/
│   └── index.html             ← GitHub Pages Landing Page
└── icons/
    ├── icon-ar-*.png          ← أيقونة عربية (ل)
    └── icon-en-*.png          ← أيقونة إنجليزية (L)
```

---

## 👤 المطور

**seotarek**

---

<div align="center">
  <sub>Built with ❤️ — Lovable Pro v1.0.0</sub>
</div>
