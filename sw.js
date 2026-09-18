// سرویس‌ورکر نسخه‌ی ۴ — بدون هیچ کشی.
//
// چرا کش حذف شد: این داشبورد وضعیت پول واقعی را نشان می‌دهد. نسخه‌ی
// ذخیره‌شده یعنی ممکن است عددِ دیروز را ببینی و فکر کنی امروز است —
// این بدتر از ندیدن است. پس همه‌چیز همیشه مستقیم از شبکه می‌آید.
//
// این فایل فقط برای این نگه داشته شده که گوشی اجازه‌ی «افزودن به صفحه‌ی
// اصلی» بدهد (اندروید برای نصب، وجود سرویس‌ورکر را لازم دارد).
const VERSION = "v4-nocache";

self.addEventListener("install", () => {
  self.skipWaiting();   // منتظر بسته شدن تب‌ها نمان
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    // هر چیزی که نسخه‌های قبلی ذخیره کرده بودند پاک شود
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));

    await self.clients.claim();

    // صفحه‌هایی که همین الان باز هستند نسخه‌ی قدیمی را نشان می‌دهند.
    // یک بار تازه‌شان کن تا کاربر مجبور نباشد دستی کاری بکند.
    const clients = await self.clients.matchAll({type: "window"});
    for (const c of clients) {
      try { await c.navigate(c.url); } catch (_) { /* مهم نیست */ }
    }
  })());
});

self.addEventListener("fetch", e => {
  // هیچ چیز ذخیره نمی‌شود — فقط رد می‌شود
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request));
});
