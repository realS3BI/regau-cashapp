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

export const listNonEmpty = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query('categories').withIndex('by_order').collect();
    const activeCategories = all
      .filter((c) => c.deletedAt === undefined && c.active)
      .sort((a, b) => a.order - b.order);

    const products = await ctx.db.query('products').collect();
    const categoryIdsWithProducts = new Set(
      products.filter((p) => p.deletedAt === undefined && p.active).map((p) => p.categoryId)
    );

    return activeCategories.filter((c) => categoryIdsWithProducts.has(c._id));
  },
});

export const listForAdmin = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query('categories').withIndex('by_order').collect();
    return all.sort((a, b) => a.order - b.order);
  },
});

interface ProductWithCategory {
  categoryId: string;
  deletedAt?: number;
}

const countProductsByCategory = (products: ProductWithCategory[]): Map<string, number> => {
  const nonDeletedProducts = products.filter((product) => product.deletedAt === undefined);
  const countByCategoryId = new Map<string, number>();
  for (const product of nonDeletedProducts) {
    const categoryId = product.categoryId;
    countByCategoryId.set(categoryId, (countByCategoryId.get(categoryId) ?? 0) + 1);
  }
  return countByCategoryId;
};

export const listForAdminWithProductCount = query({
  args: {},
  handler: async (ctx) => {
    const allCategories = await ctx.db.query('categories').withIndex('by_order').collect();
    const sortedCategories = allCategories.sort((a, b) => a.order - b.order);

    const allProducts = await ctx.db.query('products').collect();
    const productCountByCategory = countProductsByCategory(allProducts);

    return sortedCategories.map((category) => ({
      ...category,
      productCount: productCountByCategory.get(category._id) ?? 0,
    }));
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

export const updateManyActive = mutation({
  args: {
    active: v.boolean(),
    ids: v.array(v.id('categories')),
  },
  handler: async (ctx, args) => {
    for (const id of args.ids) {
      await ctx.db.patch(id, { active: args.active });
    }
  },
});

export const reorder = mutation({
  args: {
    orderedIds: v.array(v.id('categories')),
  },
  handler: async (ctx, args) => {
    for (let index = 0; index < args.orderedIds.length; index++) {
      await ctx.db.patch(args.orderedIds[index], { order: index });
    }
  },
});
