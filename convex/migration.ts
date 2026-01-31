import { mutation } from './_generated/server';
import { v } from 'convex/values';

// Migration Mutations für Supabase Import
// Diese Mutations erlauben das Setzen von createdAt für die Migration

export const createCategoryWithDate = mutation({
  args: {
    active: v.optional(v.boolean()),
    createdAt: v.number(),
    name: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('categories', {
      active: args.active ?? true,
      createdAt: args.createdAt,
      name: args.name,
      order: args.order,
    });
  },
});

export const createTeamWithDate = mutation({
  args: {
    active: v.optional(v.boolean()),
    createdAt: v.number(),
    name: v.string(),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('teams')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first();

    if (existing && existing.deletedAt == null) {
      throw new Error('Team mit diesem Slug existiert bereits');
    }

    return await ctx.db.insert('teams', {
      active: args.active ?? true,
      createdAt: args.createdAt,
      name: args.name,
      slug: args.slug,
    });
  },
});

export const createProductWithDate = mutation({
  args: {
    active: v.optional(v.boolean()),
    categoryId: v.id('categories'),
    createdAt: v.number(),
    deletedAt: v.optional(v.number()),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    name: v.string(),
    price: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('products', {
      active: args.active ?? true,
      categoryId: args.categoryId,
      createdAt: args.createdAt,
      deletedAt: args.deletedAt,
      description: args.description,
      imageUrl: args.imageUrl,
      name: args.name,
      price: args.price,
      updatedAt: args.updatedAt,
    });
  },
});

export const createPurchaseWithDate = mutation({
  args: {
    createdAt: v.number(),
    createdBy: v.optional(v.string()),
    items: v.array(
      v.object({
        productId: v.id('products'),
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
      })
    ),
    teamId: v.id('teams'),
    totalAmount: v.number(),
  },
  handler: async (ctx, args) => {
    if (args.items.length === 0) {
      throw new Error('Warenkorb ist leer');
    }

    return await ctx.db.insert('purchases', {
      createdAt: args.createdAt,
      createdBy: args.createdBy,
      items: args.items,
      teamId: args.teamId,
      totalAmount: args.totalAmount,
    });
  },
});
