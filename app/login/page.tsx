import Link from 'next/link'
import { signIn, signInWithGoogle } from '../../app/actions/auth'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold font-grotesk text-black mb-4 tracking-tight neobrutal-border bg-white px-6 py-4 inline-block neobrutal-shadow uppercase">
            rndm
          </h1>
          <p className="text-black font-bold text-base bg-white px-4 py-2 neobrutal-border neobrutal-shadow-sm inline-block uppercase">Track and share your cultural journey</p>
        </div>

        <div className="bg-white neobrutal-border neobrutal-shadow p-8 space-y-6">
          <div>
            <h2 className="text-3xl font-bold font-grotesk text-black mb-6 uppercase">
              Sign in
            </h2>
          </div>

          {/* Google Sign In */}
          <form action={signInWithGoogle}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white neobrutal-border neobrutal-shadow-sm text-black font-bold hover:bg-[#00F5FF] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-4 border-black"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-black font-bold uppercase">Or continue with email</span>
            </div>
          </div>

          {/* Email Sign In */}
          <form action={signIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-black mb-2 uppercase">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 bg-white neobrutal-border neobrutal-shadow-sm text-black font-bold focus:outline-none focus:bg-[#00F5FF] focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all uppercase placeholder:text-black placeholder:opacity-70"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-black mb-2 uppercase">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 bg-white neobrutal-border neobrutal-shadow-sm text-black font-bold focus:outline-none focus:bg-[#00F5FF] focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#00F5FF] text-black px-6 py-4 neobrutal-border neobrutal-shadow font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase"
            >
              Sign in
            </button>
          </form>

          <div className="text-center text-sm">
            <span className="text-black font-bold">Don't have an account? </span>
            <Link
              href="/signup"
              className="font-bold text-black bg-white px-3 py-1 neobrutal-border neobrutal-shadow-sm hover:bg-[#00F5FF] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}