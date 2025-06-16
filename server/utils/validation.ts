import { z } from "zod"

export const RegistrationSchema = z.object({
  name: z.string().nonempty(),
  conditionsRead: z.boolean(),
  conditionsAccepted: z.boolean(),
  message: z.string().optional(),
  tickets: z.array(z.number()),
  meals: z.array(z.number()),
  hasPaid: z.boolean().optional(),
})
