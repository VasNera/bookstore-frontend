import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Pencil, Trash2 } from 'lucide-react'
import { useState, type SubmitEvent } from 'react'
import { createCategory, deleteCategory, updateCategory } from '../api/adminCategories'
import { ApiError } from '../api/client'
import { useCategories } from '../hooks/useCategories'
import type { Category } from '../types/category'

export const Route = createFileRoute('/admin/categories')({
  component: AdminCategoriesPage,
})

function AdminCategoriesPage() {
  const queryClient = useQueryClient()
  const categories = useCategories()

  const [newName, setNewName] = useState('')
  const [newParentId, setNewParentId] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ['categories'] })
  }

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      setNewName('')
      setNewParentId('')
      refresh()
    },
  })
  const updateMutation = useMutation({
    mutationFn: (vars: { id: number; name: string; parentCategoryId?: number }) =>
      updateCategory(vars.id, { name: vars.name, parentCategoryId: vars.parentCategoryId }),
    onSuccess: () => {
      setEditingId(null)
      refresh()
    },
  })
  const deleteMutation = useMutation({ mutationFn: deleteCategory, onSuccess: refresh })

  function handleCreate(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    createMutation.mutate({
      name: newName.trim(),
      parentCategoryId: newParentId ? Number(newParentId) : undefined,
    })
  }

  function startEdit(category: Category) {
    setEditingId(category.id)
    setEditName(category.name)
    updateMutation.reset()
  }

  const actionError = createMutation.error ?? updateMutation.error ?? deleteMutation.error
  const errorMessage =
    actionError instanceof ApiError ? actionError.message : actionError ? 'Κάτι πήγε στραβά.' : null
  const busy = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending

  function renderRow(category: Category, parentId?: number) {
    const isEditing = editingId === category.id
    return (
      <li key={category.id} className="flex items-center justify-between gap-3 py-2">
        {isEditing ? (
          <form
            className="flex flex-1 gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              updateMutation.mutate({
                id: category.id,
                name: editName.trim(),
                parentCategoryId: parentId,
              })
            }}
          >
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              autoFocus
              className="flex-1 rounded border border-brown/30 bg-white px-3 py-1"
            />
            <button type="submit" disabled={busy} className="rounded bg-olive px-3 py-1 text-white">
              Αποθήκευση
            </button>
            <button type="button" onClick={() => setEditingId(null)} className="px-2 text-brown">
              Άκυρο
            </button>
          </form>
        ) : (
          <>
            <span className={parentId === undefined ? 'font-bold' : ''}>{category.name}</span>
            <div className="flex gap-3 text-brown/60">
              <button onClick={() => startEdit(category)} aria-label="Μετονομασία" className="hover:text-olive">
                <Pencil size={18} />
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`Διαγραφή της κατηγορίας «${category.name}»;`)) {
                    deleteMutation.mutate(category.id)
                  }
                }}
                disabled={busy}
                aria-label="Διαγραφή"
                className="hover:text-red-700 disabled:opacity-60"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </>
        )}
      </li>
    )
  }

  return (
    <div className="max-w-xl space-y-6 text-brown">
      <h1 className="text-2xl font-bold text-olive">Κατηγορίες</h1>

      <form onSubmit={handleCreate} className="flex flex-wrap gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Όνομα νέας κατηγορίας"
          className="flex-1 rounded border border-brown/30 bg-white px-3 py-2"
        />
        <select
          value={newParentId}
          onChange={(e) => setNewParentId(e.target.value)}
          className="rounded border border-brown/30 bg-white px-3 py-2"
        >
          <option value="">Κύρια κατηγορία</option>
          {categories.data?.map((c) => (
            <option key={c.id} value={c.id}>Υπο-κατηγορία του «{c.name}»</option>
          ))}
        </select>
        <button
          type="submit"
          disabled={busy || newName.trim() === ''}
          className="rounded bg-olive px-4 py-2 font-medium text-white disabled:opacity-60"
        >
          Προσθήκη
        </button>
      </form>

      {errorMessage && <p className="text-sm text-red-700">{errorMessage}</p>}
      {categories.isPending && <p>Φόρτωση...</p>}
      {categories.error && <p>Δεν ήταν δυνατή η φόρτωση των κατηγοριών.</p>}

      {categories.data && (
        <ul className="divide-y divide-brown/20 rounded-lg border border-brown/20 bg-white/60 px-4">
          {categories.data.map((parent) => (
            <li key={parent.id}>
              <ul>{renderRow(parent)}</ul>
              {parent.subCategories.length > 0 && (
                <ul className="mb-2 ml-6 divide-y divide-brown/10">
                  {parent.subCategories.map((sub) => renderRow(sub, parent.id))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
