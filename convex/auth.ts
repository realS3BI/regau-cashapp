import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const verifyPassword = mutation({
  args: { password: v.string() },
  handler: async (_, args) => {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      throw new Error('ADMIN_PASSWORD ist nicht konfiguriert');
    }
    return args.password === adminPassword;
  }
});
