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
    <div className="min-h-screen bg-[#FAF9F6]">
      <nav className="border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-12">
              <Link href="/feed" className="group">
                <span className="text-2xl font-bold font-grotesk text-black tracking-tight group-hover:text-[#35553D] transition-colors">
                  rndm
                </span>
              </Link>
              <div className="hidden sm:flex sm:gap-8">
                <Link
                  href="/feed"
                  className="text-sm font-medium text-gray-600 hover:text-[#35553D] transition-colors"
                >
                  Feed
                </Link>
                <Link
                  href="/my-entries"
                  className="text-sm font-medium text-gray-600 hover:text-[#35553D] transition-colors"
                >
                  Collection
                </Link>
                <Link
                  href="/add"
                  className="text-sm font-medium text-gray-600 hover:text-[#35553D] transition-colors"
                >
                  Add
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-500 hidden md:block">{user.email}</span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
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