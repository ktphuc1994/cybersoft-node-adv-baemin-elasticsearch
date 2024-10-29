import { z } from 'zod';
import { stringIntegerSchema } from './common.schema';

const addCartRequestSchema = z.object({
  user_id: z.number().int(),
  food_id: z.number().int(),
  stock: z.number().int(),
});
type AddCartRequest = z.infer<typeof addCartRequestSchema>;

const updateCartRequestSchema = addCartRequestSchema.extend({
  quantity: z.number().int(),
});
type UpdateCartRequest = z.infer<typeof updateCartRequestSchema>;

const removeCartRequestSchema = z.object({
  food_id: stringIntegerSchema,
  user_id: z.number().int(),
});
type RemoveCartRequest = z.infer<typeof removeCartRequestSchema>;

const validateCartRequestSchema = z.object({
  user_id: z.number().int(),
  foodIds: z.number().array(),
});
type ValidateCartRequest = z.infer<typeof validateCartRequestSchema>;

export {
  addCartRequestSchema,
  updateCartRequestSchema,
  removeCartRequestSchema,
  validateCartRequestSchema,
  type AddCartRequest,
  type UpdateCartRequest,
  type RemoveCartRequest,
  type ValidateCartRequest,
};
