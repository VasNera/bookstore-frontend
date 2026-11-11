import type { productDetail } from './product'

export type ProductType = 'BOOK' | 'MUSIC' | 'TOY' | 'STATIONERY'

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  BOOK: 'Βιβλίο',
  MUSIC: 'Μουσική',
  TOY: 'Παιχνίδι',
  STATIONERY: 'Χαρτικό',
}

// το κομμάτι του URL του backend ανά τύπο (POST /admin/books, /admin/music, ...)
export const PRODUCT_TYPE_PATH: Record<ProductType, string> = {
  BOOK: 'books',
  MUSIC: 'music',
  TOY: 'toys',
  STATIONERY: 'stationery',
}

export interface FieldDef {
  name: string
  label: string
  type?: 'text' | 'number'
}

// πεδία κοινά σε όλους τους τύπους (εκτός από περιγραφή, κατηγορία και featured)
export const COMMON_FIELDS: FieldDef[] = [
  { name: 'title', label: 'Τίτλος' },
  { name: 'sku', label: 'SKU (κωδικός)' },
  { name: 'price', label: 'Τιμή (€)', type: 'number' },
  { name: 'discountPrice', label: 'Τιμή με έκπτωση (€)', type: 'number' },
  { name: 'stock', label: 'Απόθεμα (τεμάχια)', type: 'number' },
  { name: 'dimensions', label: 'Διαστάσεις' },
  { name: 'imageUrl', label: 'Εικόνα (URL ή /images/...)' },
]

// πεδία που υπάρχουν μόνο σε συγκεκριμένο τύπο
export const TYPE_FIELDS: Record<ProductType, FieldDef[]> = {
  BOOK: [
    { name: 'isbn', label: 'ISBN' },
    { name: 'pages', label: 'Σελίδες', type: 'number' },
    { name: 'author', label: 'Συγγραφέας' },
    { name: 'publisher', label: 'Εκδότης' },
    { name: 'releaseYear', label: 'Έτος έκδοσης', type: 'number' },
  ],
  MUSIC: [
    { name: 'artist', label: 'Καλλιτέχνης' },
    { name: 'productionCompany', label: 'Δισκογραφική' },
  ],
  TOY: [{ name: 'ageRange', label: 'Ηλικίες' }],
  STATIONERY: [{ name: 'company', label: 'Εταιρεία' }],
}

const NUMBER_FIELDS = ['price', 'discountPrice', 'stock', 'pages', 'releaseYear', 'categoryId']

// τιμές της φόρμας (όλα strings, γιατί τα <input> δίνουν strings)
export type ProductFormValues = Record<string, string>

// Μετατρέπει τις τιμές της φόρμας στο JSON που περιμένει το backend:
// αριθμοί → number, κενά → δεν στέλνονται
export function buildPayload(type: ProductType, values: ProductFormValues, featured: boolean) {
  const names = [
    ...COMMON_FIELDS.map((f) => f.name),
    ...TYPE_FIELDS[type].map((f) => f.name),
    'description',
    'categoryId',
  ]
  const payload: Record<string, string | number | boolean | undefined> = { featured }
  for (const name of names) {
    const raw = (values[name] ?? '').trim()
    if (raw === '') continue
    payload[name] = NUMBER_FIELDS.includes(name) ? Number(raw) : raw
  }
  return payload
}

// Το backend δεν επιστρέφει τον τύπο, αλλά κάθε τύπος έχει δικά του πεδία στο JSON
export function detectType(p: productDetail): ProductType {
  if ('isbn' in p) return 'BOOK'
  if ('artist' in p || 'productionCompany' in p) return 'MUSIC'
  if ('ageRange' in p) return 'TOY'
  return 'STATIONERY'
}

// από το αντικείμενο του backend σε τιμές φόρμας (null → '')
export function toFormValues(p: productDetail, categoryId: number | undefined): ProductFormValues {
  const values: ProductFormValues = {}
  for (const [key, value] of Object.entries(p)) {
    values[key] = value == null ? '' : String(value)
  }
  values.categoryId = categoryId != null ? String(categoryId) : ''
  return values
}
