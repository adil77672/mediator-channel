'use client'

import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function EarningsTable() {
  const { data, error, isLoading } = useSWR('/api/earnings', fetcher, {
    refreshInterval: 5000
  })

  return (
    <Card className="border-border bg-card/80">
      <CardHeader>
        <CardTitle>Settlement Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="text-sm text-destructive">Unable to load earnings.</p>}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, idx) => (
              <Skeleton key={idx} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {(data?.earnings || []).map((earning: any) => (
              <div
                key={earning._id}
                className="flex flex-wrap items-center justify-between rounded-xl border border-border/70 bg-background/80 px-4 py-3 gap-y-2"
              >
                <div>
                  <p className="text-sm font-semibold">{earning.group_id}</p>
                  <p className="text-xs text-muted-foreground">
                    Created {new Date(earning.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">${Number(earning.amount ?? 0).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">90% share</p>
                </div>
                <Badge
                  variant={earning.status === 'paid' ? 'default' : 'outline'}
                  className={earning.status === 'paid' ? 'bg-emerald-500/10 text-emerald-300' : ''}
                >
                  {earning.status === 'paid'
                    ? `Paid ${earning.paid_at ? new Date(earning.paid_at).toLocaleDateString() : ''}`
                    : 'Pending · settles in 10 days'}
                </Badge>
              </div>
            ))}
            {data?.earnings?.length === 0 && (
              <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
                No earnings yet. Payments will appear as soon as deposits are received.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

