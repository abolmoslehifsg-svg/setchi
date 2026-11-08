import { Product } from "@/types";

export const products: Product[] = [
  {
    id: "p1",
    name: "Oversized Boxy Tee",
    nameFa: "تی‌شرت باکسی اورسایز",
    description: "Heavyweight cotton oversized t-shirt with dropped shoulders. Perfect base layer for streetwear looks.",
    descriptionFa: "تی‌شرت اورسایز پنبه‌ای سنگین با شانه‌های افتاده. پایه ایده‌آل برای استایل‌های استریت‌ویر.",
    category: "oversized-tshirt",
    price: 890000,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Olive", "Beige"],
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
    ],
    tags: ["oversized", "basic", "streetwear", "minimal"],
  },
  {
    id: "p2",
    name: "Graphic Print Tee",
    nameFa: "تی‌شرت گرافیک",
    description: "Bold graphic print on premium cotton. Statement piece for casual and street looks.",
    descriptionFa: "چاپ گرافیک جسورانه روی پنبه باکیفیت. قطعه کلیدی برای استایل کژوال و استریت.",
    category: "oversized-tshirt",
    price: 980000,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Gray"],
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
    ],
    tags: ["graphic", "statement", "streetwear"],
  },
  {
    id: "p3",
    name: "Essential Heavy Hoodie",
    nameFa: "هودی سنگین ضروری",
    description: "Premium heavyweight fleece hoodie with kangaroo pocket and ribbed cuffs. Everyday essential.",
    descriptionFa: "هودی فلیس سنگین با جیب کانگورویی و سرآستین کشی. ضروری روزانه.",
    category: "hoodie",
    price: 1890000,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Gray", "Olive", "Navy"],
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
      "https://images.unsplash.com/photo-1578768079052-aa76e5251b3c?w=800&q=80",
    ],
    tags: ["hoodie", "layering", "casual", "streetwear"],
  },
  {
    id: "p4",
    name: "Zip-Up Tech Hoodie",
    nameFa: "هودی زیپی تک",
    description: "Technical fabric zip hoodie with subtle branding. Sporty and modern.",
    descriptionFa: "هودی زیپی با پارچه تکنیکال و برندینگ ظریف. اسپرتی و مدرن.",
    category: "hoodie",
    price: 2190000,
    sizes: ["M", "L", "XL"],
    colors: ["Black", "Gray", "Olive"],
    images: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
    ],
    tags: ["tech", "zip", "sporty", "modern"],
  },
  {
    id: "p5",
    name: "Relaxed Cargo Pants",
    nameFa: "شلوار کارگو ریلکس",
    description: "Relaxed fit cargo pants with multiple pockets. Versatile for street and casual wear.",
    descriptionFa: "شلوار کارگو با فیت ریلکس و جیب‌های متعدد. همه‌کاره برای استریت و کژوال.",
    category: "cargo-pants",
    price: 1590000,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Olive", "Beige", "Khaki"],
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
    ],
    tags: ["cargo", "utility", "streetwear", "casual"],
  },
  {
    id: "p6",
    name: "Straight Fit Chinos",
    nameFa: "شلوار چینی استریت",
    description: "Clean straight fit chinos in premium cotton twill. Minimalist essential.",
    descriptionFa: "شلوار چینی فیت استریت از تویل پنبه‌ای. ضروری مینیمال.",
    category: "cargo-pants",
    price: 1290000,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Beige", "Black", "Navy", "Olive"],
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
    ],
    tags: ["chinos", "minimal", "smart-casual"],
  },
  {
    id: "p7",
    name: "Oversized Bomber Jacket",
    nameFa: "کاپشن بمبر اورسایز",
    description: "Oversized bomber with ribbed hem and cuffs. Classic streetwear outer layer.",
    descriptionFa: "کاپشن بمبر اورسایز با لبه و سرآستین کشی. لایه بیرونی کلاسیک استریت‌ویر.",
    category: "jacket",
    price: 2890000,
    sizes: ["M", "L", "XL"],
    colors: ["Black", "Olive", "Navy"],
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80",
    ],
    tags: ["bomber", "outerwear", "streetwear"],
  },
  {
    id: "p8",
    name: "Lightweight Utility Jacket",
    nameFa: "کاپشن یوتیلیتی سبک",
    description: "Lightweight utility jacket with multiple pockets and clean lines.",
    descriptionFa: "کاپشن یوتیلیتی سبک با جیب‌های متعدد و خطوط تمیز.",
    category: "jacket",
    price: 2490000,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Beige", "Olive"],
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    ],
    tags: ["utility", "lightweight", "modern"],
  },
  {
    id: "p9",
    name: "Chunky Sneakers",
    nameFa: "اسنیکرز چانکی",
    description: "Chunky sole sneakers with premium materials. Statement footwear for modern looks.",
    descriptionFa: "اسنیکرز با Sole چانکی و متریال پریمیوم. کفش بیانیه برای استایل مدرن.",
    category: "sneakers",
    price: 3290000,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Gray"],
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
    ],
    tags: ["sneakers", "chunky", "streetwear"],
  },
  {
    id: "p10",
    name: "Minimal Leather Sneakers",
    nameFa: "اسنیکرز چرم مینیمال",
    description: "Clean minimal leather sneakers. Versatile for casual and smart looks.",
    descriptionFa: "اسنیکرز چرم مینیمال تمیز. همه‌کاره برای کژوال و اسمارت.",
    category: "sneakers",
    price: 2790000,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Beige"],
    images: [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80",
    ],
    tags: ["minimal", "leather", "clean"],
  },
  {
    id: "p11",
    name: "Canvas Cap",
    nameFa: "کلاه کپ کانواس",
    description: "Structured canvas cap with adjustable strap. Everyday accessory.",
    descriptionFa: "کلاه کپ کانواس ساختاریافته با بند قابل تنظیم. اکسسوری روزانه.",
    category: "accessories",
    price: 490000,
    sizes: ["M"],
    colors: ["Black", "Beige", "Olive"],
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78ebb29543?w=800&q=80",
    ],
    tags: ["cap", "accessory", "casual"],
  },
  {
    id: "p12",
    name: "Minimal Crossbody Bag",
    nameFa: "کیف کراس‌بادی مینیمال",
    description: "Compact crossbody bag in durable nylon. Practical and stylish.",
    descriptionFa: "کیف کراس‌بادی جمع‌وجور از نایلون بادوام. کاربردی و شیک.",
    category: "accessories",
    price: 890000,
    sizes: ["M"],
    colors: ["Black", "Olive", "Gray"],
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    ],
    tags: ["bag", "crossbody", "utility"],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
}
