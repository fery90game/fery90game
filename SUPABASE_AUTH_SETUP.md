# راه‌اندازی احراز هویت Fery90Game

## موارد پیاده‌سازی‌شده
- ثبت‌نام با ایمیل و رمز عبور
- ورود با ایمیل و رمز عبور
- ورود با Google OAuth (پس از فعال‌سازی Provider)
- تأیید ایمیل از طریق لینک Supabase
- ارسال لینک بازیابی و ثبت رمز جدید
- خروج از حساب و نگهداری نشست توسط Supabase Auth

## تنظیمات ضروری در Supabase
در داشبورد پروژه `fery90game` به **Authentication → URL Configuration** بروید:
- Site URL: `https://fery90game.github.io/fery90game/`
- Redirect URLs: `https://fery90game.github.io/fery90game/auth.html`

برای توسعه محلی نیز در صورت نیاز آدرس دقیق محلی auth.html را به Redirect URLs اضافه کنید.

## فعال‌سازی ورود گوگل
1. در Google Cloud Console یک OAuth Client از نوع Web application بسازید.
2. در Authorized redirect URIs مقدار callback خود پروژه را وارد کنید:
   `https://twchvyxflykaljyqwpvx.supabase.co/auth/v1/callback`
3. در Supabase → Authentication → Sign In / Providers → Google، Provider را فعال و Client ID و Client Secret گوگل را وارد کنید.
4. در Authorized JavaScript origins گوگل، آدرس سایت GitHub Pages را ثبت کنید.

Client Secret گوگل فقط در داشبورد Supabase وارد می‌شود؛ هرگز آن را در فایل‌های سایت یا GitHub قرار ندهید.

## نکات امنیتی
- کد مرورگر فقط از Project URL و Publishable Key استفاده می‌کند.
- هیچ Secret / service_role key در مخزن وجود ندارد.
- داده‌های علاقه‌مندی و تنظیمات هنوز به حساب کاربری متصل یا ابری نشده‌اند؛ این مرحله فقط احراز هویت است.
- تنظیم تأیید ایمیل و قالب ایمیل‌ها در Authentication → Providers / Email و Email Templates مدیریت می‌شود.
- پس از انتشار، ورود، ثبت‌نام، تأیید ایمیل، OAuth و بازیابی رمز باید روی دامنه واقعی آزمایش شوند.
