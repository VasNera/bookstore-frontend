import { useState, type SubmitEvent } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { register } from '../api/auth'
import { ApiError } from '../api/client'
import { FormField } from '../components/FormField'
import type { RegisterRequest } from '../types/auth'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage(){
    const navigate = useNavigate()
    const [form, setForm] = useState<RegisterRequest>({
        username: '',
        password: '',
        firstname: '',
        lastname: '',
        phone: '',
        email: ''
    })

    const mutation = useMutation({
        mutationFn: register,
        onSuccess:() => navigate({to: '/login'})
    })

    function setField(field: keyof RegisterRequest){
        return(value: string) => setForm((prev) => ({...prev, [field]:value}))
    }

    function handleSubmit(e:SubmitEvent<HTMLFormElement>){
        e.preventDefault()
        mutation.mutate(form)
    }

    const error = mutation.error
    const apiError = error instanceof ApiError ? error: null
    const fieldErrors = apiError?.errors ??{}

    let message: string | null = null
     if (apiError?.status === 409) message = 'Το username χρησιμοποιείται ήδη.'
  else if (error && !apiError?.errors) message = 'Κάτι πήγε στραβά. Δοκίμασε ξανά.'
        

   return (
    <div className="mx-auto max-w-md rounded-lg border border-brown/20 bg-white/60 p-8">
      <h1 className="mb-6 text-center text-2xl font-bold text-olive">Εγγραφή</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField id="username" label="Username" value={form.username}
          onChange={setField('username')} error={fieldErrors.username} />
        <FormField id="password" label="Κωδικός" type="password" value={form.password}
          onChange={setField('password')} error={fieldErrors.password} />
        <FormField id="firstname" label="Όνομα" value={form.firstname}
          onChange={setField('firstname')} error={fieldErrors.firstname} />
        <FormField id="lastname" label="Επώνυμο" value={form.lastname}
          onChange={setField('lastname')} error={fieldErrors.lastname} />
        <FormField id="phone" label="Τηλέφωνο" value={form.phone}
          onChange={setField('phone')} error={fieldErrors.phone} />
        <FormField id="email" label="Email" type="email" value={form.email}
          onChange={setField('email')} error={fieldErrors.email} />

        {message && <p className="text-sm text-red-700">{message}</p>}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full rounded bg-olive px-4 py-2 font-medium text-white disabled:opacity-60"
        >
          {mutation.isPending ? 'Εγγραφή...' : 'Εγγραφή'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-brown">
        Έχεις ήδη λογαριασμό?{' '}
        <Link to="/login" className="font-medium text-olive underline">Σύνδεση</Link>
      </p>
    </div>
  )
}
    

