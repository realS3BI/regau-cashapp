import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  categories: defineTable({
    active: v.boolean(),
    createdAt: v.number(),
    deletedAt: v.optional(v.number()),
    name: v.string(),
    order: v.number(),
  }).index('by_order', ['order']),

  products: defineTable({
    active: v.boolean(),
    categoryId: v.id('categories'),
    createdAt: v.number(),
    deletedAt: v.optional(v.number()),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    isFavorite: v.optional(v.boolean()),
    name: v.string(),
    priceA: v.optional(v.number()),
    priceB: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index('by_category', ['categoryId'])
    .index('by_category_active', ['categoryId', 'active']),

  purchases: defineTable({
    createdAt: v.number(),
    createdBy: v.optional(v.string()),
    items: v.array(
      v.object({
        name: v.string(),
        price: v.number(),
        productId: v.id('products'),
        quantity: v.number(),
      })
    ),
    teamId: v.id('teams'),
    totalAmount: v.number(),
  })
    .index('by_created', ['createdAt'])
    .index('by_team', ['teamId'])
    .index('by_team_created', ['teamId', 'createdAt']),

  settings: defineTable({
    key: v.string(),
    value: v.string(),
  }).index('by_key', ['key']),

  teams: defineTable({
    active: v.optional(v.boolean()),
    createdAt: v.number(),
    deletedAt: v.optional(v.number()),
    name: v.string(),
    slug: v.string(),
  }).index('by_slug', ['slug']),
});
