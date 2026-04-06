import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useRegisterMutation } from '@/services/api'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [register, { isLoading, error }] = useRegisterMutation()
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (token) {
      window.location.replace('/dashboard')
    }
  }, [token])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const result = await register({ name, email, password }).unwrap()
      localStorage.setItem('token', result.token)
      window.location.replace('/dashboard')
    } catch (err) {
      console.error(err)
    }
  }

  if (token) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
          <div className="space-y-2 text-center">
            <p className="text-slate-600">Redirecting to dashboard...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold">Sign up</h1>
          <p className="text-slate-600">Create your account to book appointments.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 focus:border-slate-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 focus:border-slate-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 focus:border-slate-500"
          />

          {error && <p className="text-sm text-red-600">Registration failed. Try again.</p>}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing up…' : 'Sign up'}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-slate-900">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
