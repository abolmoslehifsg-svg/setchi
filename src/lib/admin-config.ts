/**
 * تنظیمات ورود ادمین (فقط کلاینت — روی هاست استاتیک امنیت واقعی نیست)
 *
 * قبل از دیپلوی این مقادیر را عوض کن، بعد دوباره build بگیر.
 * هرگز رمز واقعی مهم را اینجا نگذار اگر سایت عمومی است.
 */
export const ADMIN_CONFIG = {
  /** نام کاربری ادمین (مثلاً آیدی تلگرام بدون @) */
  username: "tenmanogod",
  /** رمز عبور — قبل از انتشار عمومی حتماً عوض کن */
  password: "tenmanogod",
  /** کلید session در sessionStorage */
  sessionKey: "setchi_admin_v1",
} as const;
