import { z } from 'zod';
import { stringIntegerSchema } from './common.schema';
import { Food } from './food.schema';

const cartSchema = z.object({
  user_id: z.number().int(),
  food_id: z.number().int(),
  quantity: z.number().int(),
});

const addCartRequestSchema = cartSchema.omit({ quantity: true }).extend({
  stock: z.number().int(),
});
type AddCartRequest = z.infer<typeof addCartRequestSchema>;

const updateCartRequestSchema = cartSchema.extend({
  stock: z.number().int(),
});
type UpdateCartRequest = z.infer<typeof updateCartRequestSchema>;

const removeCartRequestSchema = z.object({
  food_id: stringIntegerSchema,
  user_id: z.number().int(),
});
type RemoveCartRequest = z.infer<typeof removeCartRequestSchema>;

const removeManyCartRequestSchema = z.object({
  user_id: z.number().int(),
  foodIds: z.number().int().array(),
});
type RemoveManyCartRequest = z.infer<typeof removeManyCartRequestSchema>;

const validateCartRequestSchema = z.object({
  user_id: z.number().int(),
  foodIds: z.number().int().array(),
});
type ValidateCartRequest = z.infer<typeof validateCartRequestSchema>;

type CartFood = Omit<Food, 'store_id' | 'stock' | 'tags'> & {
  quantity: number;
};

export {
  addCartRequestSchema,
  updateCartRequestSchema,
  removeCartRequestSchema,
  removeManyCartRequestSchema,
  validateCartRequestSchema,
  type CartFood,
  type AddCartRequest,
  type UpdateCartRequest,
  type RemoveCartRequest,
  type RemoveManyCartRequest,
  type ValidateCartRequest,
};
