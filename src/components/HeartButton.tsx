"use client";

type Props = {
  active: boolean;
  onToggle: () => void;
  className?: string;
  size?: "sm" | "md";
  label?: string;
};

export function HeartButton({
  active,
  onToggle,
  className = "",
  size = "md",
  label = "علاقه‌مندی",
}: Props) {
  const icon = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className={`rounded-full bg-white/90 backdrop-blur p-2 text-red-500 shadow-sm hover:scale-110 active:scale-95 transition-transform ${className}`}
      aria-label={label}
      aria-pressed={active}
      title={active ? "حذف از علاقه‌مندی" : "افزودن به علاقه‌مندی"}
    >
      <svg
        className={icon}
        fill={active ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
}
