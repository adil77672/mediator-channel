'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export default function TestingPage() {
  const [numUsers, setNumUsers] = useState('500')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const { toast } = useToast()

  const runLoadTest = async () => {
    setLoading(true)
    setResults(null)

    try {
      const startTime = Date.now()

      const response = await fetch('/api/test/simulate-payment-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numUsers: parseInt(numUsers) })
      })

      const data = await response.json()
      const endTime = Date.now()
      const duration = ((endTime - startTime) / 1000).toFixed(2)

      setResults({
        ...data.results,
        duration: `${duration}s`,
        avgResponseTime: `${(
          (parseFloat(duration) / Math.max(1, parseInt(numUsers))) *
          1000
        ).toFixed(0)}ms`
      })

      toast({
        title: 'Load Test Complete',
        description: `Processed ${data.results.numUsers} users with ${data.results.successRate} success rate`
      })
    } catch (error) {
      toast({
        title: 'Test Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const clearTestData = async () => {
    try {
      await fetch('/api/test/clear-test-data', { method: 'POST' })
      toast({
        title: 'Test Data Cleared',
        description: 'All test data has been removed'
      })
      setResults(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to clear test data',
        variant: 'destructive'
      })
    }
  }

  const testSettlement = async () => {
    try {
      const response = await fetch('/api/cron/settle-earnings')
      const data = await response.json()

      toast({
        title: 'Settlement Test Complete',
        description: `Settled ${data.count} earnings`
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to test settlement',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">QA Lab</p>
        <h2 className="text-3xl font-semibold mt-2">Load & Settlement Testing</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Run 500-user simulations, trigger cron logic, and keep the sandbox database tidy.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="border-border bg-card/80">
          <CardHeader>
            <CardTitle className="text-card-foreground">Load Test</CardTitle>
            <CardDescription className="text-muted-foreground">
              Simulate concurrent user payments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="numUsers" className="text-card-foreground">
                Number of Users
              </Label>
              <Input
                id="numUsers"
                type="number"
                value={numUsers}
                onChange={(e) => setNumUsers(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>

            <Button
              onClick={runLoadTest}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground"
            >
              {loading ? 'Running Test...' : 'Run Load Test'}
            </Button>

            {results && (
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm rounded-lg border border-border/70 bg-background/80 p-4">
                <div>
                  <p className="text-muted-foreground">Total Users</p>
                  <p className="font-semibold">{results.numUsers}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Success Rate</p>
                  <p className="font-semibold">{results.successRate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-semibold">{results.duration}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Avg Response</p>
                  <p className="font-semibold">{results.avgResponseTime}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Earnings</p>
                  <p className="font-semibold">${results.totalEarnings}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Failed</p>
                  <p className="font-semibold">{results.failed}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card/80">
          <CardHeader>
            <CardTitle className="text-card-foreground">System Tests</CardTitle>
            <CardDescription className="text-muted-foreground">
              Additional testing utilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={testSettlement} variant="outline" className="w-full">
              Test Settlement Cron
            </Button>

            <Button onClick={clearTestData} variant="destructive" className="w-full">
              Clear Test Data
            </Button>

            <div className="mt-4 p-4 bg-muted/50 rounded-lg text-xs text-muted-foreground space-y-1">
              <p>Test Endpoints</p>
              <p>• POST /api/test/simulate-payment-flow</p>
              <p>• POST /api/test/clear-test-data</p>
              <p>• GET /api/cron/settle-earnings</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

