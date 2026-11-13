/**
 * مالک اصلی — فقط از طریق دیپلوی/کد عوض می‌شود.
 * ادمین‌های اضافی را مالک از پنل «تیم» اضافه می‌کند (localStorage).
 */
export const ADMIN_CONFIG = {
  ownerUsername: "tenmanogod",
  ownerPassword: "tenmanogod",
  sessionKey: "setchi_admin_session_v2",
  adminsKey: "setchi_admins_v1",
  ownerPasswordKey: "setchi_owner_password_v1",
} as const;
