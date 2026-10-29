# تشغيل المنصة على أي سيرفر خاص (خطة بديلة للنشر)

هذا الملف يشرح كيف تُشغّل التطبيق نفسه على أي سيرفر Node.js إذا تأخّر النشر من المنصة.
التطبيق لا يحتاج قاعدة بيانات ولا مفاتيح API: بيانات السوق تُجلب من Yahoo Finance مباشرة من الـ API route.

## المتطلبات
- Node.js 20 أو أحدث
- ذاكرة 1GB على الأقل

## أوامر التشغيل

```bash
npm ci --legacy-peer-deps      # تثبيت النسخ المقفلة في package-lock.json
npm run build                  # بناء الإنتاج (نفس ما يفعله منصة النشر)
PORT=3000 npm run start        # تشغيل السيرفر
```

## متغيرات البيئة (اختيارية)
لا يوجد أي متغير إلزامي. هذه اختيارية فقط:

| المتغير | الاستخدام |
|---|---|
| `PORT` | منفذ التشغيل (افتراضي 3000) |
| `IQX_PROJECT_ID` | يُستخدم فقط لبناء قائمة `allowedDevOrigins` في `next.config.ts` |

## خلف reverse proxy (nginx / Caddy)
وجّه الدومين إلى `http://127.0.0.1:3000`:

```nginx
server {
  server_name example.com;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

## تشغيل دائم مع systemd

```ini
[Unit]
Description=Abo Naser Platform
After=network.target

[Service]
WorkingDirectory=/var/www/app
ExecStart=/usr/bin/npm run start
Environment=PORT=3000
Restart=always

[Install]
WantedBy=multi-user.target
```

## ملاحظات
- `/api/market` يحتاج خروجًا إلى الإنترنت (Yahoo Finance)، وبلا اتصال يعود بـ `502` وليس بانهيار.
- الملفات المبنية تُوضع في `.next/`؛ لا تحذفها بعد البناء.
