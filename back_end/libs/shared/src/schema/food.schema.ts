import { z } from 'zod';
import { stringIntegerSchema } from './common.schema';

const foodRequestSchema = z.object({
  foodName: z.string().optional(),
  menuId: stringIntegerSchema.optional(),
  storeId: stringIntegerSchema.optional(),
  page: stringIntegerSchema.optional(),
  pageSize: stringIntegerSchema.optional(),
});
type FoodRequest = z.infer<typeof foodRequestSchema>;

const foodElasticRequestSchema = foodRequestSchema.omit({ menuId: true });
type FoodElasticRequest = z.infer<typeof foodElasticRequestSchema>;

const todayFoodSchema = z.object({
  food_id: z.number(),
  name: z.string(),
  image: z.string().nullable().optional(),
  store_name: z.string(),
  store_address: z.string(),
  store_id: z.number(),
});
type TodayFood = z.infer<typeof todayFoodSchema>;

const foodSchema = todayFoodSchema
  .omit({ store_name: true, store_address: true })
  .extend({
    price: z.number(),
    stock: z.number(),
    description: z.string().nullable().optional(),
    tags: z.string().array(),
  });
type Food = z.infer<typeof foodSchema>;

const checkStockRequestSchema = z.object({
  food_id: z.number().int(),
  quantity: z.number().int(),
});
type CheckStockRequest = z.infer<typeof checkStockRequestSchema>;

const checkStockResponseSchema = checkStockRequestSchema.extend({
  stock: z.number().int(),
});
type CheckStockResponse = z.infer<typeof checkStockResponseSchema>;

const validateFoodInStoreRequestSchema = z.object({
  foodIds: stringIntegerSchema.array(),
  storeId: stringIntegerSchema,
});
type ValidateFoodInStoreRequest = z.infer<
  typeof validateFoodInStoreRequestSchema
>;

const updateFoodRequestSchema = foodSchema
  .omit({ food_id: true })
  .partial()
  .extend({
    food_id: z.number().int(),
  });
type UpdateFoodRequest = z.infer<typeof updateFoodRequestSchema>;

export {
  todayFoodSchema,
  foodRequestSchema,
  foodElasticRequestSchema,
  checkStockRequestSchema,
  validateFoodInStoreRequestSchema,
  updateFoodRequestSchema,
  type FoodRequest,
  type FoodElasticRequest,
  type TodayFood,
  type Food,
  type CheckStockRequest,
  type CheckStockResponse,
  type ValidateFoodInStoreRequest,
  type UpdateFoodRequest,
};
