import { faker } from '@faker-js/faker'
import type {
  Customer,
  Order,
  OrderLine,
  OrderPaymentMethod,
  OrderStatus,
  Product,
  ProductCategory,
  ProductVariant,
  SaleSummary,
} from '@/types'

faker.seed(42_001)

const phoneModels = [
  'جالاكسي S24 ألترا',
  'آيفون 15 برو',
  'بيكسل 8 برو',
  'ناثينغ فون (٢)',
  'إكسبيريا 1 V',
  'ريدمي نوت 13 برو',
  'ون بلس 12',
  'رازر 40 ألترا',
]

const accessoryTypes = [
  'غطاء سيليكون',
  'واقي شاشة زجاجي',
  'شاحن سريع 65 وات',
  'سماعات لاسلكية',
  'بنك طاقة 20000',
  'كابل USB-C',
  'محفظة مغناطيسية',
  'حامل سيارة',
]

const brandsPhone = [
  'سامسونج',
  'أبل',
  'جوجل',
  'ون بلس',
  'سوني',
  'شاومي',
] as const

const descPool = [
  'تصميم عصري وأداء موثوق للاستخدام اليومي.',
  'خيار مثالي لمن يبحث عن التوازن بين السعر والجودة.',
  'جودة تصنيع عالية مع ضمان محلي.',
  'بطارية تدوم طوال اليوم مع شحن سريع.',
  'شاشة واضحة وألوان دقيقة لمشاهدة مريحة.',
]

const specPhoneRam = ['8', '12', '16'] as const
const specPhoneStorage = ['128', '256', '512', '1024'] as const

const productColorsAr = [
  'أسود',
  'أبيض',
  'أزرق',
  'رمادي',
  'ذهبي',
  'أخضر',
  'بنفسجي',
] as const

const accessoryMaterialsAr = [
  'سيليكون ناعم',
  'بلاستيك معزز',
  'جلد',
  'ألومنيوم',
  'قماش',
] as const

/**
 * Catalog imagery — Unsplash (https://unsplash.com/license): free for commercial use.
 * Curated smartphone & tech-accessory photos; consistent crop via CDN params.
 */
const CATALOG_IMAGE_PARAMS = 'auto=format&fit=crop&w=960&q=88'

const PHONE_CATALOG_IMAGES = [
  `https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?${CATALOG_IMAGE_PARAMS}`,
  `https://images.unsplash.com/photo-1592750475338-74b7b21085ab?${CATALOG_IMAGE_PARAMS}`,
  `https://images.unsplash.com/photo-1510557880182-8d8a65e0c6e0?${CATALOG_IMAGE_PARAMS}`,
  `https://images.unsplash.com/photo-1592899677986-878eb9688c0d?${CATALOG_IMAGE_PARAMS}`,
  `https://images.unsplash.com/photo-1610945265064-0e44e2ce3005?${CATALOG_IMAGE_PARAMS}`,
  `https://images.unsplash.com/photo-1598327105666-5b89351aff97?${CATALOG_IMAGE_PARAMS}`,
  `https://images.unsplash.com/photo-1565849904461-04a58ad377e0?${CATALOG_IMAGE_PARAMS}`,
  `https://images.unsplash.com/photo-1556656793-08538906a9f8?${CATALOG_IMAGE_PARAMS}`,
] as const

const ACCESSORY_CATALOG_IMAGES = [
  `https://images.unsplash.com/photo-1601784556446-34c8a6c4c0d8?${CATALOG_IMAGE_PARAMS}`,
  `https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?${CATALOG_IMAGE_PARAMS}`,
  `https://images.unsplash.com/photo-1625948515291-69613eec4ca1?${CATALOG_IMAGE_PARAMS}`,
  `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?${CATALOG_IMAGE_PARAMS}`,
  `https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?${CATALOG_IMAGE_PARAMS}`,
  `https://images.unsplash.com/photo-1583863785172-8e73e0fc7d4e?${CATALOG_IMAGE_PARAMS}`,
  `https://images.unsplash.com/photo-1603314585442-ee3b2c16fb32?${CATALOG_IMAGE_PARAMS}`,
  `https://images.unsplash.com/photo-1590658268037-6bf12165a8df?${CATALOG_IMAGE_PARAMS}`,
] as const

function catalogImageUrl(category: ProductCategory, index: number): string {
  if (category === 'phone') {
    return PHONE_CATALOG_IMAGES[index % PHONE_CATALOG_IMAGES.length]
  }
  return ACCESSORY_CATALOG_IMAGES[index % ACCESSORY_CATALOG_IMAGES.length]
}

function slugFromId(id: string) {
  return id.replace(/_/g, '-')
}

function buildPhoneVariants(
  productId: string,
  skuBase: string,
  basePrice: number,
  seedIndex: number,
  ramGb: string,
  storageGbA: string,
  storageGbB: string,
  colors: [string, string],
): ProductVariant[] {
  const storages: [string, string] = [storageGbA, storageGbB]
  const variants: ProductVariant[] = []
  let idx = 0
  for (const storage of storages) {
    for (const color of colors) {
      const bump = idx * 48
      const price = basePrice + bump
      const compareAt =
        faker.datatype.boolean({ probability: 0.38 })
          ? price + faker.number.int({ min: 55, max: 220 })
          : undefined
      const stock = faker.number.int({ min: 0, max: 55 })
      variants.push({
        id: `${productId}_v${idx}`,
        sku: `${skuBase}-V${String(idx).padStart(2, '0')}`,
        label: `${storage} جيجابايت — ${color}`,
        price,
        compareAtPrice: compareAt,
        imageUrl: PHONE_CATALOG_IMAGES[(seedIndex + idx) % PHONE_CATALOG_IMAGES.length],
        stock,
        attributes: {
          color,
          storage: `${storage} جيجابايت`,
          ram: `${ramGb} جيجابايت رام`,
        },
      })
      idx++
    }
  }
  return variants
}

function buildAccessoryVariants(
  productId: string,
  skuBase: string,
  basePrice: number,
  seedIndex: number,
  colors: [string, string],
  materials: [string, string],
): ProductVariant[] {
  const variants: ProductVariant[] = []
  let idx = 0
  for (const color of colors) {
    for (const material of materials) {
      const bump = idx * 9
      const price = Math.max(10, basePrice + bump)
      const stock = faker.number.int({ min: 0, max: 90 })
      variants.push({
        id: `${productId}_v${idx}`,
        sku: `${skuBase}-V${String(idx).padStart(2, '0')}`,
        label: `${material} — ${color}`,
        price,
        compareAtPrice:
          faker.datatype.boolean({ probability: 0.25 })
            ? price + faker.number.int({ min: 5, max: 35 })
            : undefined,
        imageUrl:
          ACCESSORY_CATALOG_IMAGES[(seedIndex + idx) % ACCESSORY_CATALOG_IMAGES.length],
        stock,
        attributes: { color, material },
      })
      idx++
    }
  }
  return variants
}

function makeProduct(
  i: number,
  category: ProductCategory,
  nameBase: string,
): Product {
  const name =
    category === 'phone'
      ? `${faker.helpers.arrayElement(brandsPhone)} ${nameBase}`
      : `${nameBase} — ${faker.helpers.arrayElement(['فاخر', 'عملي', 'خفيف', 'مقاوم'])}`
  const baseListPrice =
    category === 'phone'
      ? faker.number.int({ min: 399, max: 1299 })
      : faker.number.int({ min: 12, max: 189 })
  const id = `prd_${category[0]}_${String(i).padStart(3, '0')}`
  const slug = slugFromId(id)
  const skuBase = `SKU-${category.toUpperCase().slice(0, 3)}-${faker.string.alphanumeric(6).toUpperCase()}`

  const ramGb = faker.helpers.arrayElement(specPhoneRam)
  const storageGbA = specPhoneStorage[i % specPhoneStorage.length]
  const storageGbB = specPhoneStorage[(i + 2) % specPhoneStorage.length]

  if (category === 'phone') {
    const colors = faker.helpers.arrayElements([...productColorsAr], 2) as [
      string,
      string,
    ]
    const variants = buildPhoneVariants(
      id,
      skuBase,
      baseListPrice,
      i,
      ramGb,
      storageGbA,
      storageGbB,
      colors,
    )
    const minPrice = Math.min(...variants.map((v) => v.price))
    const totalStock = variants.reduce((s, v) => s + v.stock, 0)
    const storageForSpecs = storageGbA

    return {
      id,
      sku: skuBase,
      name,
      slug,
      category,
      brand: name.split(' ')[0] ?? 'عام',
      price: minPrice,
      compareAtPrice: undefined,
      imageUrl: catalogImageUrl(category, i),
      stock: totalStock,
      description: faker.helpers.arrayElement(descPool),
      attributes: variants[0].attributes,
      specs: [
        `${ramGb} جيجابايت رام`,
        `${storageForSpecs} جيجابايت تخزين`,
        `${faker.number.int({ min: 4000, max: 6000 })} مللي أمبير`,
        faker.helpers.arrayElement(['5G', '5G + شريحة إلكترونية', '5G مموّج']),
      ],
      variants,
      variantOptionOrder: ['storage', 'color', 'ram'],
    }
  }

  const colorsAcc = faker.helpers.arrayElements([...productColorsAr], 2) as [
    string,
    string,
  ]
  const mats = faker.helpers.arrayElements([...accessoryMaterialsAr], 2) as [
    string,
    string,
  ]
  const variants = buildAccessoryVariants(
    id,
    skuBase,
    baseListPrice,
    i,
    colorsAcc,
    mats,
  )
  const minPrice = Math.min(...variants.map((v) => v.price))
  const totalStock = variants.reduce((s, v) => s + v.stock, 0)

  return {
    id,
    sku: skuBase,
    name,
    slug,
    category,
    brand: name.split(' ')[0] ?? 'عام',
    price: minPrice,
    compareAtPrice: undefined,
    imageUrl: catalogImageUrl(category, i),
    stock: totalStock,
    description: faker.helpers.arrayElement(descPool),
    attributes: variants[0].attributes,
    specs: [
      faker.helpers.arrayElement(['بلاستيك معزز', 'سيليكون ناعم', 'ألومنيوم']),
      faker.helpers.arrayElement(['ضمان سنة', 'ضمان سنتين']),
      'عبوة تجزئة',
    ],
    variants,
    variantOptionOrder: ['color', 'material'],
  }
}

export const products: Product[] = [
  ...phoneModels.map((m, i) => makeProduct(i, 'phone', m)),
  ...accessoryTypes.map((m, i) =>
    makeProduct(i + phoneModels.length, 'accessory', m),
  ),
]

const customerNames = [
  'ليلى حسن',
  'عمر خليل',
  'نور الدين',
  'سارة المصري',
  'يوسف فريد',
  'مريم سعد',
  'كريم ناصر',
  'هنا شوكت',
]

export const customers: Customer[] = customerNames.map((name, i) => ({
  id: `cus_${String(i + 1).padStart(4, '0')}`,
  name,
  email: `c${String(i + 1).padStart(4, '0')}@abutalal.mobile`,
  phone: faker.phone.number({ style: 'international' }),
  city: faker.helpers.arrayElement([
    'القاهرة',
    'الإسكندرية',
    'الجيزة',
    'الأقصر',
    'أسوان',
  ]),
  createdAt: faker.date.past({ years: 2 }).toISOString(),
}))

const statuses: OrderStatus[] = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

function makeOrder(i: number): Order {
  const customer = faker.helpers.arrayElement(customers)
  const lineCount = faker.number.int({ min: 1, max: 4 })
  const picked = faker.helpers.arrayElements(products, lineCount)
  const lines: OrderLine[] = picked.map((p) => ({
    productId: p.id,
    name: p.name,
    unitPrice: p.price,
    quantity: faker.number.int({ min: 1, max: 3 }),
  }))
  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0)
  const tax = Math.round(subtotal * 0.14 * 100) / 100
  const total = Math.round((subtotal + tax) * 100) / 100
  const status = faker.helpers.arrayElement(statuses)
  const id = `ord_${String(i + 1).padStart(5, '0')}`
  const paymentMethod = faker.helpers.arrayElement<OrderPaymentMethod>([
    'cash',
    'card',
    'cod',
    'online',
  ])

  return {
    id,
    customerId: customer.id,
    customerName: customer.name,
    lines,
    subtotal,
    tax,
    total,
    status,
    paymentMethod,
    createdAt: faker.date.recent({ days: 60 }).toISOString(),
  }
}

export const orders: Order[] = Array.from({ length: 12 }, (_, i) =>
  makeOrder(i),
)

export const salesSummaries: SaleSummary[] = orders.map((o, i) => ({
  id: `sale_${String(i + 1).padStart(5, '0')}`,
  orderId: o.id,
  channel: faker.helpers.arrayElement(['online', 'pos'] as const),
  total: o.total,
  createdAt: o.createdAt,
}))

export function productBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function productById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}
