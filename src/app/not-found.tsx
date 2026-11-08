import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-[var(--accent)]">۴۰۴</h1>
      <p className="mt-4 text-xl font-semibold">صفحه پیدا نشد</p>
      <p className="mt-2 text-[var(--secondary)]">
        این صفحه وجود ندارد یا منتقل شده است.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-[var(--foreground)] px-8 py-3 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent)] transition-colors"
      >
        بازگشت به خانه
      </Link>
    </div>
  );
}
