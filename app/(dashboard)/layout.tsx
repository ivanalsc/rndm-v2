import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { signOut } from '../../app/actions/auth'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="neobrutal-border-thick border-b-0 sticky top-0 bg-white z-50 neobrutal-shadow">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-8">
              <Link href="/feed" className="group">
                <span className="text-3xl font-bold font-grotesk text-black tracking-tight uppercase neobrutal-border bg-white px-4 py-2 neobrutal-shadow-sm group-hover:bg-[#00F5FF] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
                  rndm
                </span>
              </Link>
              <div className="hidden sm:flex sm:gap-4">
                <Link
                  href="/feed"
                  className="text-sm font-bold text-black bg-white px-4 py-2 neobrutal-border neobrutal-shadow-sm hover:bg-[#00F5FF] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase"
                >
                  Feed
                </Link>
                <Link
                  href="/my-entries"
                  className="text-sm font-bold text-black bg-white px-4 py-2 neobrutal-border neobrutal-shadow-sm hover:bg-[#00F5FF] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase"
                >
                  Collection
                </Link>
                <Link
                  href="/add"
                  className="text-sm font-bold text-black bg-white px-4 py-2 neobrutal-border neobrutal-shadow-sm hover:bg-[#00F5FF] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase"
                >
                  Add
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-black bg-white px-3 py-2 neobrutal-border neobrutal-shadow-sm hidden md:block uppercase">{user.email}</span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-sm font-bold text-white bg-[#FF1744] px-4 py-2 neobrutal-border neobrutal-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main className="py-12 px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}