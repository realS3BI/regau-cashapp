import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import type { QueryCtx } from './_generated/server';

const getActiveTemplate = async (ctx: QueryCtx): Promise<'A' | 'B'> => {
  const templateSetting = await ctx.db
    .query('settings')
    .withIndex('by_key', (q) => q.eq('key', 'activeTemplate'))
    .first();
  return (templateSetting?.value as 'A' | 'B') ?? 'A';
};

const calculateEffectivePrice = (
  product: { priceA?: number; priceB?: number },
  template: 'A' | 'B'
): number => {
  return template === 'A' ? (product.priceA ?? 0) : (product.priceB ?? 0);
};

export const getByCategory = query({
  args: { categoryId: v.id('categories') },
  handler: async (ctx, args) => {
    const activeTemplate = await getActiveTemplate(ctx);

    const products = await ctx.db
      .query('products')
      .withIndex('by_category_active', (q) =>
        q.eq('categoryId', args.categoryId).eq('active', true)
      )
      .collect();

    return products
      .filter((product) => product.deletedAt === undefined)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((product) => ({
        ...product,
        price: calculateEffectivePrice(product, activeTemplate),
      }));
  },
});

export const listAllActive = query({
  args: {},
  handler: async (ctx) => {
    const activeTemplate = await getActiveTemplate(ctx);
    const allProducts = await ctx.db.query('products').collect();

    return allProducts
      .filter((product) => product.active && product.deletedAt === undefined)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((product) => ({
        ...product,
        price: calculateEffectivePrice(product, activeTemplate),
      }));
  },
});

export const listForAdmin = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query('products').collect();
    return products
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((p) => ({
        ...p,
        priceA: p.priceA ?? 0,
        priceB: p.priceB ?? 0,
      }));
  },
});

export const create = mutation({
  args: {
    active: v.optional(v.boolean()),
    categoryId: v.id('categories'),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    isFavorite: v.optional(v.boolean()),
    name: v.string(),
    priceA: v.number(),
    priceB: v.number(),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    return await ctx.db.insert('products', {
      active: args.active ?? true,
      categoryId: args.categoryId,
      createdAt: timestamp,
      description: args.description,
      imageUrl: args.imageUrl,
      isFavorite: args.isFavorite ?? false,
      name: args.name,
      priceA: args.priceA,
      priceB: args.priceB,
      updatedAt: timestamp,
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
    isFavorite: v.optional(v.boolean()),
    name: v.optional(v.string()),
    priceA: v.optional(v.number()),
    priceB: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const updatePrice = mutation({
  args: {
    id: v.id('products'),
    price: v.number(),
    template: v.union(v.literal('A'), v.literal('B')),
  },
  handler: async (ctx, args) => {
    const update = args.template === 'A' ? { priceA: args.price } : { priceB: args.price };
    await ctx.db.patch(args.id, {
      ...update,
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

export const updateManyActive = mutation({
  args: {
    active: v.boolean(),
    ids: v.array(v.id('products')),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    for (const productId of args.ids) {
      await ctx.db.patch(productId, { active: args.active, updatedAt: timestamp });
    }
  },
});
