# راه‌اندازی احراز هویت و پروفایل Fery90Game

## قابلیت‌های پیاده‌سازی‌شده در سایت
- ثبت‌نام و ورود با ایمیل و رمز عبور
- ثبت نام نمایشی اختیاری هنگام ساخت حساب
- نمایش و ویرایش نام نمایشی از پنل حساب کاربری
- ذخیره نام در `user_metadata.display_name` و `user_metadata.full_name` در Supabase Auth
- دکمه ورود و ثبت‌نام با Google OAuth از طریق Supabase
- درخواست انتخاب حساب گوگل هنگام شروع ورود
- تأیید ایمیل، بازیابی رمز عبور و خروج از حساب

## تنظیمات ضروری Supabase
در داشبورد پروژه `fery90game` به **Authentication → URL Configuration** برو:
- Site URL: `https://fery90game.github.io/fery90game/`
- Redirect URLs: `https://fery90game.github.io/fery90game/auth.html`

برای توسعه محلی نیز آدرس دقیق محلی `auth.html` را در Redirect URLs اضافه کن.

## فعال‌سازی واقعی Google OAuth
وجود دکمه و کد سمت سایت به‌تنهایی به معنی فعال بودن Provider نیست. برای تکمیل اتصال:

1. در Google Cloud Console یک OAuth Client از نوع **Web application** بساز.
2. در بخش Authorized redirect URIs این callback را دقیقاً ثبت کن:
   `https://twchvyxflykaljyqwpvx.supabase.co/auth/v1/callback`
3. در Supabase → Authentication → Sign In / Providers → Google، Provider را فعال کن و Client ID و Client Secret گوگل را وارد کن.
4. در Google Cloud، Authorized JavaScript origins را با دامنه سایت ثبت کن:
   `https://fery90game.github.io`
5. مطمئن شو آدرس بازگشت سایت در Supabase URL Configuration مجاز است.

**Client Secret گوگل را هرگز در کد سایت، فایل‌های مخزن یا پیام عمومی قرار نده.** فقط آن را در تنظیمات امن Provider در داشبورد Supabase وارد کن.

## مدل ذخیره نام
نام نمایشی در metadata حساب کاربر Supabase Auth ذخیره می‌شود؛ بنابراین برای این قابلیت به جدول عمومی جدید یا کلید service-role در مرورگر نیازی نیست. نام کاربر خصوصیِ احراز هویت است و نباید برای اطلاعات عمومی یا داده‌های قابل جست‌وجوی کاربران استفاده شود.

## چک‌لیست تست پس از تنظیم Provider
- ثبت‌نام ایمیلی با نام نمایشی و بدون نام نمایشی
- ورود و خروج با ایمیل
- ویرایش نام و بررسی ماندگاری آن پس از بارگذاری مجدد
- ورود با گوگل برای حساب جدید و حساب موجود
- بررسی نمایش نام پروفایل گوگل و امکان تغییر آن
- تأیید ایمیل و بازیابی رمز عبور
- تست روی دامنه GitHub Pages و موبایل

## نکات امنیتی
- کد مرورگر فقط از Project URL و Publishable Key استفاده می‌کند.
- هیچ Secret یا service_role key در مخزن قرار نده.
- علاقه‌مندی‌ها و تنظیمات هنوز به حساب کاربری متصل یا ابری نشده‌اند؛ این تغییر فقط پروفایل و احراز هویت را پوشش می‌دهد.
