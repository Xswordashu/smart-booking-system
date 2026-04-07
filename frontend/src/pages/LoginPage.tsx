import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useLoginMutation } from '@/services/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [login, { isLoading, error }] = useLoginMutation()
  
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (token) {
      window.location.replace('/dashboard')
    }
  }, [token])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const result = await login({ email, password }).unwrap()
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
          <h1 className="text-3xl font-semibold">Sign in</h1>
          <p className="text-slate-600">Access your appointment dashboard.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
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

          {error && <p className="text-sm text-red-600">Login failed. Check your credentials.</p>}

          <Button type="submit" disabled={isLoading} className='rounded-[8px]'>
            {isLoading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500">
          New here?{' '}
          <Link to="/register" className="font-medium text-slate-900">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  )
}
