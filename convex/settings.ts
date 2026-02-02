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

const DEFAULT_TEMPLATE_NAME_A = 'Vorlage A';
const DEFAULT_TEMPLATE_NAME_B = 'Vorlage B';

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

export const getTemplateNames = query({
  args: {},
  handler: async (ctx) => {
    const nameA = await ctx.db
      .query('settings')
      .withIndex('by_key', (q) => q.eq('key', 'templateNameA'))
      .first();
    const nameB = await ctx.db
      .query('settings')
      .withIndex('by_key', (q) => q.eq('key', 'templateNameB'))
      .first();
    return {
      nameA: (nameA?.value as string) ?? DEFAULT_TEMPLATE_NAME_A,
      nameB: (nameB?.value as string) ?? DEFAULT_TEMPLATE_NAME_B,
    };
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

export const setTemplateNames = mutation({
  args: {
    nameA: v.string(),
    nameB: v.string(),
  },
  handler: async (ctx, args) => {
    const upsert = async (key: string, value: string) => {
      const existing = await ctx.db
        .query('settings')
        .withIndex('by_key', (q) => q.eq('key', key))
        .first();
      if (existing) {
        await ctx.db.patch(existing._id, { value });
      } else {
        await ctx.db.insert('settings', { key, value });
      }
    };
    await upsert('templateNameA', args.nameA.trim() || DEFAULT_TEMPLATE_NAME_A);
    await upsert('templateNameB', args.nameB.trim() || DEFAULT_TEMPLATE_NAME_B);
  },
});
