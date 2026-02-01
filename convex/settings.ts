import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const get = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const setting = await ctx.db
      .query('settings')
      .withIndex('by_key', (q) => q.eq('key', args.key))
      .first();
    return setting?.value ?? null;
  },
});

export const getActiveTemplate = query({
  args: {},
  handler: async (ctx) => {
    const setting = await ctx.db
      .query('settings')
      .withIndex('by_key', (q) => q.eq('key', 'activeTemplate'))
      .first();
    return (setting?.value as 'A' | 'B') ?? 'A';
  },
});

export const set = mutation({
  args: {
    key: v.string(),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('settings')
      .withIndex('by_key', (q) => q.eq('key', args.key))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value });
    } else {
      await ctx.db.insert('settings', {
        key: args.key,
        value: args.value,
      });
    }
  },
});

export const setActiveTemplate = mutation({
  args: { template: v.union(v.literal('A'), v.literal('B')) },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('settings')
      .withIndex('by_key', (q) => q.eq('key', 'activeTemplate'))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { value: args.template });
    } else {
      await ctx.db.insert('settings', {
        key: 'activeTemplate',
        value: args.template,
      });
    }
  },
});
