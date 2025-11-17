import { NotificationPanel } from '@/components/notification-panel'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function NotificationsPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Signals</p>
        <h2 className="text-3xl font-semibold mt-2">Payment Notifications</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Real-time VXUM payout alerts from the sandbox payment simulator or future blockchain
          integrations.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <NotificationPanel />

        <Card className="border-border bg-card/80">
          <CardHeader>
            <CardTitle>Notification Flow</CardTitle>
            <CardDescription>MongoDB collection: notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>1. `/api/payment/simulate` records user deposits.</p>
            <p>2. Mediator earnings captured in `earnings` collection.</p>
            <p>3. Notification document inserted with message template.</p>
            <p>4. React panel polls `/api/notifications` every 3 seconds.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

