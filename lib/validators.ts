import { z } from 'zod'

export const groupUploadSchema = z.object({
  group_id: z
    .string()
    .regex(/^[a-zA-Z0-9]{6,20}$/, 'Group ID must be 6-20 alphanumeric characters'),
  category: z.enum(['General', 'Entertainment', 'E-commerce', 'Finance', 'Stocks', 'Cryptocurrency']),
  price: z.number().min(0.1).max(150),
  pricing_mode: z.enum(['per-person', 'per-group']),
  member_count: z.number().int().min(50).max(500)
}).superRefine((data, ctx) => {
  if (data.pricing_mode === 'per-person' && (data.price < 0.1 || data.price > 0.3)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Per-person price must be between $0.10 and $0.30'
    })
  }

  if (data.pricing_mode === 'per-group' && (data.price < 0.1 || data.price > 150)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Per-group price must be between $0.10 and $150.00'
    })
  }
})

