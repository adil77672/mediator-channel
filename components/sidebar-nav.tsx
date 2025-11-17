'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

type NavItem = {
  href: string
  label: string
  description?: string
}

export function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col rounded-lg px-3 py-2 text-sm transition-colors border border-transparent',
              isActive
                ? 'bg-primary/10 text-primary border-primary/30'
                : 'text-muted-foreground hover:text-foreground hover:border-border'
            )}
          >
            <span className="font-medium">{item.label}</span>
            {item.description && <span className="text-xs">{item.description}</span>}
          </Link>
        )
      })}
    </nav>
  )
}

