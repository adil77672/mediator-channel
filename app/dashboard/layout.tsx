import { ReactNode } from 'react'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { ObjectId } from 'mongodb'
import { SidebarNav } from '@/components/sidebar-nav'
import { LogoutButton } from '@/components/logout-button'
import { AUTH_COOKIE_NAME, verifyAuthToken } from '@/lib/auth'
import { connectDB, db } from '@/lib/db'

const navItems = [
  { href: '/dashboard', label: 'Overview', description: 'Upload + insights' },
  { href: '/dashboard/uploads', label: 'Uploads', description: 'All group submissions' },
  { href: '/dashboard/earnings', label: 'Earnings', description: 'Revenue & settlement' },
  { href: '/dashboard/notifications', label: 'Notifications', description: 'Payment alerts' },
  { href: '/dashboard/testing', label: 'Testing', description: 'Load tests & cron' }
]

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getUserFromSession()

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="hidden lg:flex w-72 flex-col border-r border-border/60 bg-card/50 backdrop-blur">
        <div className="px-6 pt-8 pb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Mediator</p>
          <h1 className="text-xl font-bold mt-1">Channel Control</h1>
          <div className="mt-6 space-y-1">
            <p className="text-xs text-muted-foreground">Signed in as</p>
            <p className="text-sm font-medium">{session?.name ?? session?.email}</p>
            <p className="text-xs text-muted-foreground capitalize">{session?.role}</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4">
          <SidebarNav items={navItems} />
        </div>
        <div className="px-6 py-6 border-t border-border/60">
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="lg:hidden border-b border-border/50 bg-card/60 px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Signed in</p>
            <p className="text-sm font-medium">{session?.name ?? session?.email}</p>
          </div>
          <LogoutButton />
        </div>
        <div className="lg:hidden flex gap-3 overflow-x-auto border-b border-border/40 px-4 py-3 text-sm">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted-foreground hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </div>
        <div className="mx-auto w-full max-w-6xl px-4 py-8 lg:px-10">{children}</div>
      </main>
    </div>
  )
}

async function getUserFromSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
  const payload = await verifyAuthToken(token)
  if (!payload) return null

  await connectDB()
  const user = await db.collection('users').findOne(
    { _id: new ObjectId(payload.userId) },
    {
      projection: {
        password: 0
      }
    }
  )

  if (!user) return null

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role
  }
}

