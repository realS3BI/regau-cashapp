import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  teams: defineTable({
    active: v.optional(v.boolean()),
    createdAt: v.number(),
    deletedAt: v.optional(v.number()),
    name: v.string(),
    slug: v.string(),
  }).index('by_slug', ['slug']),

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
    name: v.string(),
    price: v.number(),
    updatedAt: v.number(),
  })
    .index('by_category', ['categoryId'])
    .index('by_category_active', ['categoryId', 'active']),

  purchases: defineTable({
    teamId: v.id('teams'),
    items: v.array(
      v.object({
        productId: v.id('products'),
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
      })
    ),
    totalAmount: v.number(),
    createdAt: v.number(),
    createdBy: v.optional(v.string()),
  })
    .index('by_team', ['teamId'])
    .index('by_team_created', ['teamId', 'createdAt']),
});
