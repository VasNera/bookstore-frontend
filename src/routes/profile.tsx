import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, type SubmitEvent } from 'react'
import { ApiError } from '../api/client'
import { changeMyPassword, fetchMyProfile, updateMyProfile } from '../api/users'
import { useAuth } from '../auth/auth-context'
import { FormField } from '../components/FormField'
import type { UserProfile } from '../types/auth'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { user } = useAuth()
  const profile = useQuery({
    queryKey: ['profile'],
    queryFn: fetchMyProfile,
    enabled: user != null,
  })

  if (!user) {
    return (
      <div className="py-10 text-center text-brown">
        <p className="mb-4">Συνδέσου για να δεις το προφίλ σου.</p>
        <Link to="/login" className="rounded bg-olive px-5 py-2 font-medium text-white">
          Σύνδεση
        </Link>
      </div>
    )
  }

  if (profile.isPending) return <div className="min-h-[50vh]"><p>Φόρτωση...</p></div>
  if (profile.error) return <p>Δεν ήταν δυνατή η φόρτωση του προφίλ.</p>

  return (
    <div className="mx-auto max-w-xl space-y-10">
      <h1 className="text-2xl font-bold text-olive">Το προφίλ μου</h1>
      <ProfileForm profile={profile.data} />
      <PasswordForm />
    </div>
  )
}

function ProfileForm({ profile }: { profile: UserProfile }) {
  const queryClient = useQueryClient()
  const [firstname, setFirstname] = useState(profile.firstname)
  const [lastname, setLastname] = useState(profile.lastname)
  const [phone, setPhone] = useState(profile.phone)
  const [email, setEmail] = useState(profile.email)

  const mutation = useMutation({
    mutationFn: () =>
      updateMyProfile({
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        phone: phone.trim(),
        email: email.trim(),
      }),
    onSuccess: (updated) => queryClient.setQueryData(['profile'], updated),
  })

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    mutation.mutate()
  }

  const fieldErrors = mutation.error instanceof ApiError ? mutation.error.errors : undefined
  const generalError =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.error
        ? 'Κάτι πήγε στραβά.'
        : null

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h2 className="font-bold text-brown">Στοιχεία</h2>
      <p className="text-sm text-brown/70">Όνομα χρήστη: {profile.username}</p>
      <FormField id="firstname" label="Όνομα" value={firstname}
        onChange={setFirstname} error={fieldErrors?.firstname} />
      <FormField id="lastname" label="Επώνυμο" value={lastname}
        onChange={setLastname} error={fieldErrors?.lastname} />
      <FormField id="phone" label="Τηλέφωνο" value={phone}
        onChange={setPhone} error={fieldErrors?.phone} />
      <FormField id="email" label="Email" type="email" value={email}
        onChange={setEmail} error={fieldErrors?.email} />

      {generalError && <p className="text-sm text-red-700">{generalError}</p>}
      {mutation.isSuccess && <p className="text-sm text-olive">Τα στοιχεία αποθηκεύτηκαν.</p>}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="rounded bg-olive px-5 py-2 font-medium text-white disabled:opacity-60"
      >
        {mutation.isPending ? 'Αποθήκευση...' : 'Αποθήκευση'}
      </button>
    </form>
  )
}

function PasswordForm() {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const mutation = useMutation({
    mutationFn: () => changeMyPassword({ oldPassword, newPassword }),
    onSuccess: () => {
      setOldPassword('')
      setNewPassword('')
    },
  })

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    mutation.mutate()
  }

  const fieldErrors = mutation.error instanceof ApiError ? mutation.error.errors : undefined
  const generalError =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.error
        ? 'Κάτι πήγε στραβά.'
        : null

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h2 className="font-bold text-brown">Αλλαγή κωδικού</h2>
      <FormField id="oldPassword" label="Τρέχων κωδικός" type="password" value={oldPassword}
        onChange={setOldPassword} error={fieldErrors?.oldPassword} />
      <FormField id="newPassword" label="Νέος κωδικός" type="password" value={newPassword}
        onChange={setNewPassword} error={fieldErrors?.newPassword} />

      {generalError && <p className="text-sm text-red-700">{generalError}</p>}
      {mutation.isSuccess && <p className="text-sm text-olive">Ο κωδικός άλλαξε.</p>}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="rounded bg-olive px-5 py-2 font-medium text-white disabled:opacity-60"
      >
        {mutation.isPending ? 'Αποθήκευση...' : 'Αλλαγή κωδικού'}
      </button>
    </form>
  )
}