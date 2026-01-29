import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const create = mutation({
  args: {
    teamId: v.id('teams'),
    items: v.array(
      v.object({
        productId: v.id('products'),
        name: v.string(),
        price: v.number(),
        quantity: v.number()
      })
    ),
    totalAmount: v.number(),
    createdBy: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    if (args.items.length === 0) {
      throw new Error('Warenkorb ist leer');
    }

    return await ctx.db.insert('purchases', {
      teamId: args.teamId,
      items: args.items,
      totalAmount: args.totalAmount,
      createdAt: Date.now(),
      createdBy: args.createdBy
    });
  }
});

const FIVE_MINUTES_MS = 5 * 60 * 1000;

export const getByTeam = query({
  args: { teamId: v.id('teams') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('purchases')
      .withIndex('by_team_created', (q) => q.eq('teamId', args.teamId))
      .order('desc')
      .collect();
  }
});

export const getRecentByTeam = query({
  args: {
    limit: v.optional(v.number()),
    teamId: v.id('teams')
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    return await ctx.db
      .query('purchases')
      .withIndex('by_team_created', (q) => q.eq('teamId', args.teamId))
      .order('desc')
      .take(limit);
  }
});

export const getPurchasesByTeamInRange = query({
  args: {
    endMs: v.number(),
    startMs: v.number(),
    teamId: v.id('teams')
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('purchases')
      .withIndex('by_team_created', (q) =>
        q
          .eq('teamId', args.teamId)
          .gte('createdAt', args.startMs)
          .lte('createdAt', args.endMs)
      )
      .order('desc')
      .collect();
  }
});

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query('purchases').order('desc').collect();
  }
});

export const getById = query({
  args: { id: v.id('purchases') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  }
});

export const remove = mutation({
  args: {
    id: v.id('purchases'),
    isAdmin: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const purchase = await ctx.db.get(args.id);
    if (!purchase) {
      throw new Error('Buchung nicht gefunden');
    }
    if (!args.isAdmin) {
      const age = Date.now() - purchase.createdAt;
      if (age > FIVE_MINUTES_MS) {
        throw new Error('Buchung kann nur innerhalb von 5 Minuten gelöscht werden');
      }
    }
    await ctx.db.delete(args.id);
  }
});
