<div align="center">
  <img src="icons/icon-ar-128.png" width="80" alt="Lovable Pro Logo">
  <h1>Lovable Pro</h1>
  <p><strong>إضافة Chrome احترافية لـ Lovable AI — بناء غير محدود بدون قيود</strong></p>
  <p>
    <img src="https://img.shields.io/badge/version-1.0.0-ff5a00?style=flat-square">
    <img src="https://img.shields.io/badge/manifest-v3-a259ff?style=flat-square">
    <img src="https://img.shields.io/badge/languages-AR%20%7C%20EN-22c55e?style=flat-square">
    <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square">
  </p>
</div>

---

## ✨ المميزات

- 🌍 **ثنائي اللغة** — واجهة كاملة عربي وإنجليزي مع دعم RTL
- 🗂️ **4 صفحات منفصلة** — الرئيسية، التفعيل، الإعدادات، المساعدة
- 🔑 **إدارة الترخيص** — تفعيل وإلغاء تفعيل مباشر من الـ popup
- 📊 **لوحة إحصائيات** — الخطة، الحالة، تاريخ الانتهاء، شريط المدة
- 🛡️ **حماية النموذج** — منع استخدام Lovable بدون ترخيص
- ⚡ **جلب الجلسة تلقائياً** — استخراج session token من الصفحة
- 🔔 **إشعارات انتهاء الترخيص** — تنبيه قبل انتهاء الاشتراك
- 🎨 **تصميم داكن احترافي** — gradient، glassmorphism، micro-animations

---

## 📸 الواجهة

| الرئيسية | التفعيل | الإعدادات | المساعدة |
|:---:|:---:|:---:|:---:|
| لوحة الحالة والإحصائيات | إدخال وإدارة السيريال | الإعدادات والجلسة | accordion للمشكلات الشائعة |

---

## 🚀 التثبيت

### التطوير المحلي

```bash
git clone https://github.com/seotarek/lovable-pro.git
cd lovable-pro
```

ثم في Chrome:
1. افتح `chrome://extensions`
2. فعّل **Developer mode**
3. اضغط **Load unpacked**
4. اختار مجلد المشروع

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
│   └── popup.js               ← منطق الـ popup
├── styles/
│   └── main.css               ← Design system كامل
└── icons/
    ├── icon-ar-*.png          ← أيقونة عربية (ل)
    └── icon-en-*.png          ← أيقونة إنجليزية (L)
```

---

## ⚙️ الـ API

تعتمد الإضافة على `io.eklas.dev`:

| Endpoint | الوظيفة |
|---|---|
| `POST /licenses/validate` | التحقق من السيريال |
| `POST /lovable/chat` | إرسال برومبت |
| `POST /lovable/source-code` | جلب الكود |

---

## 👤 المطور

**seotarek** — [github.com/seotarek](https://github.com/seotarek)

---

<div align="center">
  <sub>Built with ❤️ — Lovable Pro v1.0.0</sub>
</div>
