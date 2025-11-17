import { EarningsDashboard } from '@/components/earnings-dashboard'
import { EarningsTable } from '@/components/earnings-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function EarningsPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Revenue</p>
        <h2 className="text-3xl font-semibold mt-2">Earnings & Settlement</h2>
        <p className="text-sm text-muted-foreground mt-2">
          90% share auto-accrues and moves from pending to paid after 10 days.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <EarningsDashboard />

        <Card className="border-border bg-card/80">
          <CardHeader>
            <CardTitle>Settlement Policy</CardTitle>
            <CardDescription>Sandbox timeline</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>• Payments received are marked as pending for 10 days.</p>
            <p>• Cron job `/api/cron/settle-earnings` promotes pending to paid daily.</p>
            <p>• Notifications are generated once funds move to paid.</p>
          </CardContent>
        </Card>
      </div>

      <EarningsTable />
    </div>
  )
}

