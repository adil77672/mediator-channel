import Link from 'next/link'
import { UploadForm } from '@/components/upload-form'
import { EarningsDashboard } from '@/components/earnings-dashboard'
import { NotificationPanel } from '@/components/notification-panel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Mission Control</p>
          <h1 className="text-3xl font-semibold mt-2">Mediator Operations Hub</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Upload new groups, monitor settlement status, and watch notifications in real time.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/dashboard/testing">Load Test</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/uploads">Manage Uploads</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <UploadForm />
        <div className="space-y-6">
          <EarningsDashboard />
          <NotificationPanel />
        </div>
      </div>

      <Card className="border-dashed border-border/60 bg-card/30">
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
            Platform KPIs
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Target Response', value: '< 2s UI / 1s API' },
            { label: 'Load Capacity', value: '500 concurrent users' },
            { label: 'Success Rate', value: '≥ 90% under load' }
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border/80 bg-background/50 p-4">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-lg font-semibold mt-1">{item.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

