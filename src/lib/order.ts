import { formatPrice } from "@/data/products";
import { toLatinDigits } from "./numbers";

/** Where an order line came from: the styling suggestion is what we are paid for. */
export interface OrderSource {
  kind: "outfit" | "product";
  id: string;
  title: string;
}

export interface OrderLine {
  productId: string;
  nameFa: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  source?: OrderSource;
}

export interface Customer {
  name: string;
  phone: string;
  address: string;
  note: string;
}

/**
 * Order channels, set at build time (GitHub repo variables, see README):
 * NEXT_PUBLIC_ORDER_TELEGRAM = username without @
 * NEXT_PUBLIC_ORDER_WHATSAPP = number with country code, digits only (98912...)
 */
export const ORDER_CHANNELS = {
  telegram: (process.env.NEXT_PUBLIC_ORDER_TELEGRAM ?? "").replace(/^@/, "").trim(),
  whatsapp: toLatinDigits(process.env.NEXT_PUBLIC_ORDER_WHATSAPP ?? "").replace(/\D/g, ""),
};

export function newOrderCode(): string {
  const stamp = Date.now().toString(36).slice(-4);
  const rand = Math.random().toString(36).slice(2, 4);
  return `ST-${stamp}${rand}`.toUpperCase();
}

export const isValidPhone = (phone: string) =>
  toLatinDigits(phone).replace(/\D/g, "").length >= 10;

export function buildOrderMessage(code: string, customer: Customer, lines: OrderLine[]): string {
  const total = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const head = [
    `سفارش ستچی — کد ${code}`,
    `نام: ${customer.name.trim()}`,
    `موبایل: ${customer.phone.trim()}`,
    `آدرس: ${customer.address.trim()}`,
  ];
  if (customer.note.trim()) head.push(`توضیحات: ${customer.note.trim()}`);

  const body = lines.map((l, i) => {
    const rows = [
      `${i + 1}) ${l.nameFa} (کد ${l.productId})`,
      `   سایز ${l.size} · رنگ ${l.color} · ${l.quantity} عدد · ${formatPrice(l.price * l.quantity)}`,
    ];
    if (l.source) {
      rows.push(`   از ${l.source.kind === "outfit" ? "ست" : "محصول"}: ${l.source.title} (${l.source.id})`);
    }
    return rows.join("\n");
  });

  return [...head, "", ...body, "", `جمع کل: ${formatPrice(total)}`].join("\n");
}

export function whatsappLink(message: string): string | null {
  return ORDER_CHANNELS.whatsapp
    ? `https://wa.me/${ORDER_CHANNELS.whatsapp}?text=${encodeURIComponent(message)}`
    : null;
}

export function telegramLink(): string | null {
  return ORDER_CHANNELS.telegram ? `https://t.me/${ORDER_CHANNELS.telegram}` : null;
}
