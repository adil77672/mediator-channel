'use client'

import useSWR from 'swr'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function UploadsPage() {
  const { data, error, isLoading, mutate } = useSWR('/api/uploads', fetcher, {
    refreshInterval: 5000
  })

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Operations</p>
        <h2 className="text-3xl font-semibold mt-2">Group Uploads</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Track every group submission, reward tier, and settlement window.
        </p>
      </header>

      <Card className="border-border bg-card/80">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Uploads</CardTitle>
            <CardDescription>Maximum 50 latest records</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => mutate()}>
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {error && <p className="text-sm text-destructive">Failed to load uploads.</p>}
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, idx) => (
                <Skeleton key={idx} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {(data?.uploads || []).map((upload: any) => (
                <div
                  key={upload._id}
                  className="rounded-xl border border-border/60 bg-background/60 px-4 py-3 flex flex-wrap gap-y-2 items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{upload.group_id}</p>
                    <p className="text-xs text-muted-foreground">
                      {upload.category} · {upload.member_count} members
                    </p>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-sm font-semibold">${Number(upload.price ?? 0).toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground capitalize">{upload.pricing_mode.replace('-', ' ')}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{upload.reward_vxum} VXUM</p>
                    <p className="text-xs text-muted-foreground">
                      ${Number(upload.reward_usd ?? 0).toFixed(2)} reward
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {new Date(upload.timestamp).toLocaleString()}
                  </Badge>
                </div>
              ))}

              {data?.uploads?.length === 0 && (
                <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
                  No uploads yet. Start by using the upload form on the overview page.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

