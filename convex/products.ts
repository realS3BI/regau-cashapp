import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const getByCategory = query({
  args: { categoryId: v.id('categories') },
  handler: async (ctx, args) => {
    const list = await ctx.db
      .query('products')
      .withIndex('by_category_active', (q) =>
        q.eq('categoryId', args.categoryId).eq('active', true)
      )
      .collect();
    return list.filter((p) => p.deletedAt === undefined);
  },
});

export const listAllActive = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query('products').collect();
    return all
      .filter((p) => p.active && p.deletedAt === undefined)
      .sort((a, b) => a.createdAt - b.createdAt);
  },
});

export const listForAdmin = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('products').collect();
  },
});

export const create = mutation({
  args: {
    active: v.optional(v.boolean()),
    categoryId: v.id('categories'),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    name: v.string(),
    price: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert('products', {
      active: args.active ?? true,
      categoryId: args.categoryId,
      createdAt: now,
      description: args.description,
      imageUrl: args.imageUrl,
      name: args.name,
      price: args.price,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    active: v.optional(v.boolean()),
    categoryId: v.optional(v.id('categories')),
    description: v.optional(v.string()),
    id: v.id('products'),
    imageUrl: v.optional(v.string()),
    name: v.optional(v.string()),
    price: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id('products') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { deletedAt: Date.now() });
  },
});
