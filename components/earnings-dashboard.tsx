'use client'

import useSWR from 'swr'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function EarningsDashboard() {
  // Poll every 3 seconds for real-time updates
  const { data, error, isLoading } = useSWR('/api/earnings', fetcher, {
    refreshInterval: 3000,
    revalidateOnFocus: true
  })

  if (error) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Failed to load earnings data</p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    )
  }

  const { totals, earnings } = data || {
    totals: { pending: '0.00', paid: '0.00', total: '0.00' },
    earnings: []
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-card-foreground">Earnings Overview</CardTitle>
        <CardDescription className="text-muted-foreground">
          Real-time tracking of your revenue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Earnings */}
        <div className="p-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg border border-primary/30">
          <p className="text-sm text-muted-foreground mb-1">Total Earnings</p>
          <p className="text-4xl font-bold text-foreground">
            ${totals.total}
          </p>
        </div>

        {/* Pending Earnings */}
        <div className="p-4 bg-background rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-semibold text-foreground">
                ${totals.pending}
              </p>
            </div>
            <div className="px-3 py-1 bg-accent/20 text-accent text-xs font-medium rounded-full">
              Settles in 10 days
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Awaiting automatic settlement
          </p>
        </div>

        {/* Paid Earnings */}
        <div className="p-4 bg-background rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Paid</p>
              <p className="text-2xl font-semibold text-foreground">
                ${totals.paid}
              </p>
            </div>
            <div className="px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">
              Settled
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Successfully processed earnings
          </p>
        </div>

        {/* Recent Earnings */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Recent Payouts</p>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {earnings.length === 0 && (
              <div className="text-sm text-muted-foreground border border-dashed border-border rounded-lg p-4">
                No earnings yet. Upload a group to get started.
              </div>
            )}

            {earnings.slice(0, 5).map((earning: any) => (
              <div
                key={earning._id}
                className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{earning.group_id}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(earning.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">${earning.amount.toFixed(2)}</p>
                  <span
                    className={`text-xs font-medium ${
                      earning.status === 'paid' ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {earning.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Share Info */}
        <div className="p-4 bg-muted/50 rounded-lg border border-border text-xs text-muted-foreground">
          Live updates every 3 seconds · Auto-settlement after 10 days
        </div>
      </CardContent>
    </Card>
  )
}
