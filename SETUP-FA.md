# راهنمای راه‌اندازی فاز ۲ — SETCHI با Supabase (رایگان)

## چیزهایی که الان اضافه شده:

- صفحه ورود (`/auth/login`)
- صفحه ثبت‌نام (`/auth/register`)
- سبد خرید با LocalStorage (`/cart`)
- پنل ادمین موقت (`/admin`)
- ساختار آماده برای اتصال به Supabase

## قدم ۱: ساخت حساب رایگان Supabase

1. برو به: https://supabase.com
2. Sign up کن
3. یک پروژه جدید بساز

## قدم ۲: گرفتن کلیدهای API

از Settings → API این دو تا را کپی کن:
- Project URL
- Publishable / anon key

## قدم ۳: فایل .env.local

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## قدم ۴: جداول دیتابیس

محتوای `supabase-schema.sql` را در SQL Editor اجرا کن.

## قدم ۵

```bash
npm install
npm run dev
```

## ادمین شدن

بعد از ثبت‌نام، در Table Editor → profiles فیلد role را به admin تغییر بده.
