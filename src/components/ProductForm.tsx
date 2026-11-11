import { useState, type SubmitEvent } from 'react'
import { ApiError } from '../api/client'
import { useCategories } from '../hooks/useCategories'
import {
  buildPayload,
  COMMON_FIELDS,
  TYPE_FIELDS,
  type ProductFormValues,
  type ProductType,
} from '../types/adminProduct'
import { FormField } from './FormField'

interface ProductFormProps {
  type: ProductType
  initialValues?: ProductFormValues
  initialFeatured?: boolean
  submitLabel: string
  isPending: boolean
  error: Error | null
  onSubmit: (payload: Record<string, string | number | boolean | undefined>) => void
}

export function ProductForm({
  type,
  initialValues = {},
  initialFeatured = false,
  submitLabel,
  isPending,
  error,
  onSubmit,
}: ProductFormProps) {
  const categories = useCategories()
  const [values, setValues] = useState<ProductFormValues>(initialValues)
  const [featured, setFeatured] = useState(initialFeatured)

  function setValue(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    onSubmit(buildPayload(type, values, featured))
  }

  const fieldErrors = error instanceof ApiError ? error.errors : undefined
  const generalError =
    error instanceof ApiError ? error.message : error ? 'Κάτι πήγε στραβά.' : null

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {[...COMMON_FIELDS, ...TYPE_FIELDS[type]].map((field) => (
        <FormField
          key={field.name}
          id={field.name}
          label={field.label}
          type={field.type}
          value={values[field.name] ?? ''}
          onChange={(v) => setValue(field.name, v)}
          error={fieldErrors?.[field.name]}
        />
      ))}

      <div>
        <label htmlFor="categoryId" className="mb-1 block text-brown">Κατηγορία</label>
        <select
          id="categoryId"
          value={values.categoryId ?? ''}
          onChange={(e) => setValue('categoryId', e.target.value)}
          className="w-full rounded border border-brown/30 bg-white px-3 py-2"
        >
          <option value="">— Διάλεξε κατηγορία —</option>
          {categories.data?.map((parent) => (
            <optgroup key={parent.id} label={parent.name}>
              {parent.subCategories.map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </optgroup>
          ))}
        </select>
        {fieldErrors?.categoryId && (
          <p className="mt-1 text-sm text-red-700">{fieldErrors.categoryId}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-brown">Περιγραφή</label>
        <textarea
          id="description"
          value={values.description ?? ''}
          onChange={(e) => setValue('description', e.target.value)}
          rows={4}
          className="w-full rounded border border-brown/30 bg-white px-3 py-2"
        />
      </div>

      <label className="flex items-center gap-2 text-brown">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
        Προτεινόμενο (εμφανίζεται στην αρχική)
      </label>

      {generalError && <p className="text-sm text-red-700">{generalError}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-olive px-6 py-2 font-medium text-white disabled:opacity-60"
      >
        {isPending ? 'Αποθήκευση...' : submitLabel}
      </button>
    </form>
  )
}
