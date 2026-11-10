import { createFileRoute, Link } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, type SubmitEvent } from 'react'
import { ApiError } from '../api/client'
import { createOrder } from '../api/orders'
import { useAuth } from '../auth/auth-context'
import { FormField } from '../components/FormField'
import { useCart } from '../hooks/useCart'
import type { Order, OrderDocumentType, OrderRequest, PaymentMethod } from '../types/order'

export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
})

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  CARD: 'Κάρτα',
  PAYPAL: 'PayPal',
  BANK_TRANSFER: 'Τραπεζική κατάθεση',
  CASH_ON_DELIVERY: 'Αντικαταβολή',
}

function CheckoutPage() {
  const { user } = useAuth()
  const cart = useCart()
  const queryClient = useQueryClient()

  const [documentType, setDocumentType] = useState<OrderDocumentType>('RECEIPT')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CARD')
  const [shippingStreet, setShippingStreet] = useState('')
  const [shippingCity, setShippingCity] = useState('')
  const [shippingPostalCode, setShippingPostalCode] = useState('')
  const [billingBusinessName, setBillingBusinessName] = useState('')
  const [billingTaxNumber, setBillingTaxNumber] = useState('')
  const [billingStreet, setBillingStreet] = useState('')
  const [billingProfession, setBillingProfession] = useState('')
  const [billingTaxOffice, setBillingTaxOffice] = useState('')
  const [notes, setNotes] = useState('')
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null)

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (order) => {
      setPlacedOrder(order)
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  if (!user) {
    return (
      <div className="py-10 text-center text-brown">
        <p className="mb-4">Συνδέσου για να ολοκληρώσεις την παραγγελία.</p>
        <Link to="/login" className="rounded bg-olive px-5 py-2 font-medium text-white">
          Σύνδεση
        </Link>
      </div>
    )
  }

  if (placedOrder) {
    return (
      <div className="py-10 text-center text-brown">
        <h1 className="mb-2 text-2xl font-bold text-olive">Ευχαριστούμε για την παραγγελία!</h1>
        <p className="mb-1">
          Αριθμός παραγγελίας: <span className="font-bold">{placedOrder.orderNumber}</span>
        </p>
        <p className="mb-6">Σύνολο: {placedOrder.totalAmount.toFixed(2)} €</p>
        <Link to="/products" className="rounded bg-olive px-5 py-2 font-medium text-white">
          Συνέχεια αγορών
        </Link>
      </div>
    )
  }

  if (cart.isPending) return <div className="min-h-[50vh]"><p>Φόρτωση...</p></div>
  if (cart.error) return <p>Δεν ήταν δυνατή η φόρτωση του καλαθιού.</p>

  const { items, totalAmount } = cart.data

  if (items.length === 0) {
    return (
      <div className="py-10 text-center text-brown">
        <p className="mb-4">Το καλάθι σου είναι άδειο.</p>
        <Link to="/products" className="rounded bg-olive px-5 py-2 font-medium text-white">
          Δες τα προϊόντα
        </Link>
      </div>
    )
  }

  const fieldErrors = mutation.error instanceof ApiError ? mutation.error.errors : undefined
  const generalError =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.error
        ? 'Κάτι πήγε στραβά.'
        : null

  function handleSubmit(e: SubmitEvent<HTMLFormElement>)  {
    e.preventDefault()
    const isInvoice = documentType === 'INVOICE'
    const data: OrderRequest = {
      documentType,
      paymentMethod,
      shippingStreet: shippingStreet.trim(),
      shippingCity: shippingCity.trim(),
      shippingPostalCode: shippingPostalCode.trim(),
      notes: notes.trim() || undefined,
      ...(isInvoice && {
        billingBusinessName: billingBusinessName.trim(),
        billingTaxNumber: billingTaxNumber.trim(),
        billingStreet: billingStreet.trim(),
        billingProfession: billingProfession.trim(),
        billingTaxOffice: billingTaxOffice.trim(),
      }),
    }
    mutation.mutate(data)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h1 className="text-2xl font-bold text-olive">Ολοκλήρωση παραγγελίας</h1>

        <section className="space-y-3">
          <h2 className="font-bold text-brown">Στοιχεία αποστολής</h2>
          <FormField id="shippingStreet" label="Διεύθυνση" value={shippingStreet}
            onChange={setShippingStreet} error={fieldErrors?.shippingStreet} />
          <FormField id="shippingCity" label="Πόλη" value={shippingCity}
            onChange={setShippingCity} error={fieldErrors?.shippingCity} />
          <FormField id="shippingPostalCode" label="Τ.Κ." value={shippingPostalCode}
            onChange={setShippingPostalCode} error={fieldErrors?.shippingPostalCode} />
        </section>

        <section className="space-y-3">
          <h2 className="font-bold text-brown">Παραστατικό</h2>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value as OrderDocumentType)}
            className="w-full rounded border border-brown/30 bg-white px-3 py-2"
          >
            <option value="RECEIPT">Απόδειξη</option>
            <option value="INVOICE">Τιμολόγιο</option>
          </select>

          {documentType === 'INVOICE' && (
            <div className="space-y-3">
              <FormField id="billingBusinessName" label="Επωνυμία" value={billingBusinessName}
                onChange={setBillingBusinessName} error={fieldErrors?.billingBusinessName} />
              <FormField id="billingTaxNumber" label="ΑΦΜ" value={billingTaxNumber}
                onChange={setBillingTaxNumber} error={fieldErrors?.billingTaxNumber} />
              <FormField id="billingStreet" label="Διεύθυνση έδρας" value={billingStreet}
                onChange={setBillingStreet} error={fieldErrors?.billingStreet} />
              <FormField id="billingProfession" label="Επάγγελμα" value={billingProfession}
                onChange={setBillingProfession} error={fieldErrors?.billingProfession} />
              <FormField id="billingTaxOffice" label="ΔΟΥ" value={billingTaxOffice}
                onChange={setBillingTaxOffice} error={fieldErrors?.billingTaxOffice} />
            </div>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="font-bold text-brown">Τρόπος πληρωμής</h2>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            className="w-full rounded border border-brown/30 bg-white px-3 py-2"
          >
            {(Object.keys(PAYMENT_LABELS) as PaymentMethod[]).map((method) => (
              <option key={method} value={method}>
                {PAYMENT_LABELS[method]}
              </option>
            ))}
          </select>
        </section>

        <div>
          <label htmlFor="notes" className="mb-1 block text-brown">Σημειώσεις (προαιρετικά)</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded border border-brown/30 bg-white px-3 py-2"
          />
        </div>

        {generalError && <p className="text-sm text-red-700">{generalError}</p>}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded bg-olive px-6 py-2 font-medium text-white disabled:opacity-60"
        >
          {mutation.isPending ? 'Αποστολή...' : 'Ολοκλήρωση παραγγελίας'}
        </button>
      </form>

      <aside className="h-fit space-y-3 rounded-lg border border-brown/20 bg-white/60 p-4 text-brown">
        <h2 className="font-bold">Σύνοψη</h2>
        <ul className="space-y-1 text-sm">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between gap-2">
              <span>{item.quantity} × {item.product.title}</span>
              <span>{item.subtotal.toFixed(2)} €</span>
            </li>
          ))}
        </ul>
        <p className="border-t border-brown/20 pt-3 text-lg">
          Σύνολο: <span className="font-bold text-olive">{totalAmount.toFixed(2)} €</span>
        </p>
      </aside>
    </div>
  )
}