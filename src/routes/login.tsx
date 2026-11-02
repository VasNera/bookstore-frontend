import { useState, type SubmitEvent } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { login } from '../api/auth'
import { ApiError } from '../api/client'
import { useAuth } from '../auth/auth-context'

export const Route = createFileRoute('/login')({
    component: LoginPage
})

function LoginPage(){
    const { signIn } = useAuth()
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const mutation = useMutation({
        mutationFn: login,
        onSuccess:(response) =>{
            signIn(response)
            navigate({to: '/'})
        },
    })

    function handleSubmit(e: SubmitEvent<HTMLFormElement>){
        e.preventDefault()
        mutation.mutate({username,password})
    }

    const error = mutation.error
    const apiError = error instanceof ApiError ? error: null
    const fieldErrors = apiError?.errors ?? {}

    let message: string | null = null
    if (apiError?.status === 401) message = "Λάθος username ή κωδικός"
    else if(error && !apiError?.errors) message ="Κάτι πήγε στραβά. Δοκιμάστε ξανά"

return (
    <div className="mx-auto max-w-md rounded-lg border border-brown/20 bg-white/60 p-8">
      <h1 className="mb-6 text-center text-2xl font-bold text-olive">Σύνδεση</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="mb-1 block text-brown">Username</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded border border-brown/30 bg-white px-3 py-2"
          />
          {fieldErrors.username && <p className="mt-1 text-sm text-red-700">{fieldErrors.username}</p>}
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-brown">Κωδικός</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-brown/30 bg-white px-3 py-2"
          />
          {fieldErrors.password && <p className="mt-1 text-sm text-red-700">{fieldErrors.password}</p>}
        </div>

        {message && <p className="text-sm text-red-700">{message}</p>}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full rounded bg-olive px-4 py-2 font-medium text-white disabled:opacity-60"
        >
          {mutation.isPending ? 'Σύνδεση...' : 'Σύνδεση'}
        </button>
      </form>
    </div>
  )
}


