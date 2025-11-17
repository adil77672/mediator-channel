import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const highlights = [
  {
    title: 'Upload & Verify',
    desc: '6-20 char group IDs, uniqueness checks, pricing + tiered VXUM rewards.'
  },
  {
    title: 'Earnings Engine',
    desc: '90% revenue share, SWR-powered dashboard, 10-day auto settlements.'
  },
  {
    title: 'Notifications & QA',
    desc: 'Payment alerts, sandbox payment simulator, cron-driven payouts.'
  }
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 text-foreground">
        <header className="space-y-6 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Mediator Channel</p>
          <h1 className="text-4xl font-semibold leading-tight">
            Web3-ready mediator platform for uploads, escrow revenue, and VXUM payouts.
          </h1>
          <p className="text-muted-foreground">
            React 18 + Node.js + MongoDB stack, tuned for &lt;2s client response and 500-user load tests.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button asChild>
              <Link href="/register">Create sandbox account</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <Card key={item.title} className="border-border bg-card/80">
              <CardContent className="p-6 space-y-3">
                <p className="text-sm uppercase tracking-[0.3em] text-primary">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="rounded-3xl border border-border/70 bg-card/80 p-8 space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Delivery Timeline</p>
          <div className="grid gap-3 md:grid-cols-3 text-sm text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground">Nov 16 — Draft</p>
              <p>Upload form + revenue backend</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Nov 22 — Delivery</p>
              <p>GitHub release + README, cron + tests</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Nov 23 — Sandbox QA</p>
              <p>500-user load test report (&gt;=90% pass)</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
