import { z } from "zod"

export const RegistrationSchema = z.object({
  name: z.string().nonempty(),
  conditionsRead: z.boolean().optional(),
  conditionsAccepted: z.boolean().optional(),
  message: z.string().optional(),
  tickets: z.array(z.number()),
  meals: z.array(z.number()),
  hasPaid: z.boolean().optional(),
})
