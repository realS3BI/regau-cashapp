import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

const isTeamVisible = (doc: { active?: boolean; deletedAt?: number }) =>
  doc.deletedAt == null && doc.active !== false;

export const list = query({
  handler: async (ctx) => {
    const all = await ctx.db.query('teams').order('desc').collect();
    return all.filter(isTeamVisible);
  },
});

export const listForAdmin = query({
  handler: async (ctx) => {
    return await ctx.db.query('teams').order('desc').collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const doc = await ctx.db
      .query('teams')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first();
    if (!doc || !isTeamVisible(doc)) return null;
    return doc;
  },
});

export const create = mutation({
  args: {
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
      active: true,
      createdAt: Date.now(),
      name: args.name,
      slug: args.slug,
    });
  },
});

export const update = mutation({
  args: {
    active: v.optional(v.boolean()),
    id: v.id('teams'),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const team = await ctx.db.get(id);
    if (!team) throw new Error('Team nicht gefunden');

    if (updates.slug != null && updates.slug !== team.slug) {
      const newSlug = updates.slug;
      const existing = await ctx.db
        .query('teams')
        .withIndex('by_slug', (q) => q.eq('slug', newSlug))
        .first();
      if (existing && existing.deletedAt == null && existing._id !== id) {
        throw new Error('Team mit diesem Slug existiert bereits');
      }
    }

    const patch: Record<string, unknown> = {};
    if (updates.name != null) patch.name = updates.name;
    if (updates.slug != null) patch.slug = updates.slug;
    if (updates.active != null) patch.active = updates.active;

    if (Object.keys(patch).length === 0) return id;
    await ctx.db.patch(id, patch);
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id('teams') },
  handler: async (ctx, args) => {
    const team = await ctx.db.get(args.id);
    if (!team) throw new Error('Team nicht gefunden');
    await ctx.db.patch(args.id, { deletedAt: Date.now() });
    return args.id;
  },
});
