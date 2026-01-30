import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query('categories').withIndex('by_order').collect();
    return all
      .filter((c) => c.deletedAt === undefined && c.active)
      .sort((a, b) => a.order - b.order);
  },
});

export const listForAdmin = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query('categories').withIndex('by_order').collect();
    return all.sort((a, b) => a.order - b.order);
  },
});

export const create = mutation({
  args: {
    active: v.optional(v.boolean()),
    name: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('categories', {
      active: args.active ?? true,
      createdAt: Date.now(),
      name: args.name,
      order: args.order,
    });
  },
});

export const update = mutation({
  args: {
    active: v.optional(v.boolean()),
    id: v.id('categories'),
    name: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id('categories') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { deletedAt: Date.now() });
  },
});
