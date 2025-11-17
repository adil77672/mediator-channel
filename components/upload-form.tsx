'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

const categories = ['General', 'Entertainment', 'E-commerce', 'Finance', 'Stocks', 'Cryptocurrency']

export function UploadForm() {
  const [groupId, setGroupId] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [priceType, setPriceType] = useState<'per-person' | 'per-group'>('per-person')
  const [memberCount, setMemberCount] = useState('100')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate group ID
      if (!/^[a-zA-Z0-9]{6,20}$/.test(groupId)) {
        toast({
          title: 'Invalid Group ID',
          description: 'Group ID must be 6-20 alphanumeric characters',
          variant: 'destructive'
        })
        return
      }

      if (!category) {
        toast({
          title: 'Category Required',
          description: 'Please select a category',
          variant: 'destructive'
        })
        return
      }

      // Validate price range
      const priceNum = parseFloat(price)
      if (priceType === 'per-person' && (priceNum < 0.1 || priceNum > 0.3)) {
        toast({
          title: 'Invalid Price',
          description: 'Price per person must be between $0.1 and $0.3',
          variant: 'destructive'
        })
        return
      }
      if (priceType === 'per-group' && (priceNum < 0.1 || priceNum > 150)) {
        toast({
          title: 'Invalid Price',
          description: 'Price per group must be between $0.1 and $150',
          variant: 'destructive'
        })
        return
      }

      const memberCountNum = parseInt(memberCount, 10)
      if (Number.isNaN(memberCountNum) || memberCountNum < 50 || memberCountNum > 500) {
        toast({
          title: 'Invalid Member Count',
          description: 'Members must be between 50 and 500',
          variant: 'destructive'
        })
        return
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          group_id: groupId,
          category,
          price: priceNum,
          pricing_mode: priceType,
          member_count: memberCountNum
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      toast({
        title: 'Success',
        description: `Group uploaded successfully! Reward: ${data.reward} VXUM`,
      })

      // Reset form
      setGroupId('')
      setCategory('')
      setPrice('')
      setMemberCount('100')
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload group',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-card-foreground">Upload Group Resource</CardTitle>
        <CardDescription className="text-muted-foreground">
          Add a new group and start earning 90% revenue share
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group ID */}
          <div className="space-y-2">
            <Label htmlFor="groupId" className="text-card-foreground">Group ID</Label>
            <Input
              id="groupId"
              placeholder="e.g., GROUP123ABC"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="bg-background border-border text-foreground"
              required
            />
            <p className="text-xs text-muted-foreground">
              6-20 alphanumeric characters
            </p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-card-foreground">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Type */}
          <div className="space-y-2">
            <Label className="text-card-foreground">Pricing Model</Label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setPriceType('per-person')}
                className={`flex-1 py-2 px-4 rounded-md border transition-colors ${
                  priceType === 'per-person'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-foreground border-border hover:border-primary'
                }`}
              >
                Per Person
              </button>
              <button
                type="button"
                onClick={() => setPriceType('per-group')}
                className={`flex-1 py-2 px-4 rounded-md border transition-colors ${
                  priceType === 'per-group'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-foreground border-border hover:border-primary'
                }`}
              >
                Per Group
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-card-foreground">
              Price (USD)
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder={priceType === 'per-person' ? '0.10 - 0.30' : '0.10 - 150.00'}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-background border-border text-foreground"
              required
            />
            <p className="text-xs text-muted-foreground">
              {priceType === 'per-person' 
                ? 'Range: $0.10 - $0.30 per person'
                : 'Range: $0.10 - $150.00 per group'}
            </p>
          </div>

          {/* Member Count */}
          <div className="space-y-2">
            <Label htmlFor="members" className="text-card-foreground">
              Estimated Members
            </Label>
            <Input
              id="members"
              type="number"
              min={50}
              max={500}
              value={memberCount}
              onChange={(e) => setMemberCount(e.target.value)}
              className="bg-background border-border text-foreground"
              required
            />
            <p className="text-xs text-muted-foreground">
              Rewards scale between 5-10 VXUM for 50-500 verified members
            </p>
          </div>

          {/* Revenue Info */}
          <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
            <p className="text-sm text-accent-foreground font-medium">
              Your Revenue Share: 90%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              You receive 70% base + 20% commission on all payments
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Group'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
