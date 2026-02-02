import { createClient } from '@supabase/supabase-js';
import { ConvexHttpClient } from 'convex/browser';
import dotenv from 'dotenv';
import { api, Doc, Id } from '@convex';

dotenv.config();

// Supabase/PostgREST liefert standardmäßig max. 1000 Zeilen pro Request
const SUPABASE_PAGE_SIZE = 1000;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase Client Schema-Typ passt nicht
const fetchAllFromTable = async <T>(supabase: any, table: string): Promise<T[]> => {
  const all: T[] = [];
  let from = 0;
  let hasMore = true;
  while (hasMore) {
    const to = from + SUPABASE_PAGE_SIZE - 1;
    const { data, error } = await supabase.from(table).select('*').range(from, to);
    if (error) throw error;
    const page = (data ?? []) as T[];
    all.push(...page);
    hasMore = page.length === SUPABASE_PAGE_SIZE;
    from = to + 1;
    if (page.length > 0 && hasMore) {
      process.stdout.write(`\r  ${table}: ${all.length} Zeilen geladen...`);
    }
  }
  if (all.length > SUPABASE_PAGE_SIZE) {
    console.log(`\r  ${table}: ${all.length} Zeilen geladen.`);
  }
  return all;
};

// Types für Supabase Daten
type SupabaseTeam = {
  id: number;
  created_at: string;
  name: string;
  uuid: string;
  shortName: string;
  visible: boolean;
  deleted: boolean;
};

type SupabaseProduct = {
  id: number;
  created_at: string;
  price: string | number;
  name: string;
  uuid: string;
  food: boolean;
  icon: string;
  visible: boolean;
  deleted: boolean;
  name2: string;
};

type SupabaseBill = {
  id: number;
  created_at: string;
  products: Array<{
    id: number;
    price: number;
    amount: number;
  }>;
  team: string; // UUID
  sum: string | number;
  uuid: string;
};

const main = async () => {
  console.log('🚀 Starte Migration von Supabase nach Convex...\n');

  // Supabase Setup
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_URL und SUPABASE_KEY müssen in .env gesetzt sein');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Convex Setup
  const convexUrl = process.env.VITE_CONVEX_URL || process.env.CONVEX_URL;

  if (!convexUrl) {
    throw new Error('VITE_CONVEX_URL oder CONVEX_URL muss in .env gesetzt sein');
  }

  const convex = new ConvexHttpClient(convexUrl);

  console.log('✅ Verbindungen hergestellt\n');

  // 1. Fetch Supabase Data (mit Paginierung; PostgREST limit ist 1000 pro Request)
  console.log('📥 Lade Daten von Supabase...');

  const teams = await fetchAllFromTable<SupabaseTeam>(supabase, 'teams');
  console.log(`  Teams: ${teams.length}`);

  const products = await fetchAllFromTable<SupabaseProduct>(supabase, 'products');
  console.log(`  Products: ${products.length}`);

  const billsList = await fetchAllFromTable<SupabaseBill>(supabase, 'bills');
  console.log(`  Bills: ${billsList.length}`);

  if (teams.length === 0 && products.length === 0 && billsList.length === 0) {
    console.error('\n❌ Keine Daten von Supabase erhalten. Mögliche Ursachen:');
    console.error(
      '  1. Row Level Security (RLS): In Supabase Dashboard → Authentication → Policies prüfen oder für Migration den service_role Key verwenden.'
    );
    console.error(
      '  2. Falsche URL/Key: SUPABASE_URL und SUPABASE_KEY in .env bzw. .env.local prüfen.'
    );
    console.error('  3. Tabellen leer oder anderer Schema-Name (z.B. nicht public).');
    process.exit(1);
  }

  console.log(
    `\n✅ Daten geladen: ${teams.length} Teams, ${products.length} Products, ${billsList.length} Bills\n`
  );

  // 2. Create Categories from unique icons
  console.log('📁 Erstelle Kategorien...');

  const uniqueIcons = [...new Set(products.map((p) => p.icon).filter((icon) => icon))];
  const iconToCategoryIdMap: Record<string, string> = {};
  const epochDate = new Date('1970-01-01').getTime();

  for (let i = 0; i < uniqueIcons.length; i++) {
    const icon = uniqueIcons[i];
    try {
      const categoryId = await convex.mutation(api.migration.createCategoryWithDate, {
        createdAt: epochDate,
        name: icon,
        order: i + 1,
      });
      iconToCategoryIdMap[icon] = categoryId;
      console.log(`  ✓ Kategorie erstellt: ${icon} (Order: ${i + 1})`);
    } catch (error) {
      console.error(`  ✗ Fehler beim Erstellen der Kategorie ${icon}:`, error);
      throw error;
    }
  }

  console.log(`✅ ${uniqueIcons.length} Kategorien erstellt\n`);

  // 3. Migrate Teams
  console.log('👥 Migriere Teams...');

  const uuidToTeamIdMap: Record<string, string> = {};

  for (const team of teams as SupabaseTeam[]) {
    try {
      const createdAt = new Date(team.created_at).getTime();
      const teamId = await convex.mutation(api.migration.createTeamWithDate, {
        active: team.visible,
        createdAt,
        name: team.name,
        slug: team.shortName,
      });

      uuidToTeamIdMap[team.uuid] = teamId;
      console.log(`  ✓ Team migriert: ${team.name} (${team.shortName})`);
    } catch (error: unknown) {
      if (error instanceof Error && error.message?.includes('existiert bereits')) {
        // Team existiert bereits, hole die ID
        const existingTeam = await convex.query(api.teams.getBySlug, {
          slug: team.shortName,
        });
        if (existingTeam) {
          uuidToTeamIdMap[team.uuid] = existingTeam._id;
          console.log(`  ⚠ Team existiert bereits: ${team.name} (${team.shortName})`);
        }
      } else {
        console.error(`  ✗ Fehler beim Migrieren des Teams ${team.name}:`, error);
        throw error;
      }
    }
  }

  console.log(`✅ ${teams.length} Teams migriert\n`);

  // 4. Migrate Products
  console.log('🛍️ Migriere Products...');

  const supabaseIdToProductIdMap: Record<number, string> = {};

  for (const product of products as SupabaseProduct[]) {
    const categoryId = iconToCategoryIdMap[product.icon];

    if (!categoryId) {
      console.warn(
        `  ⚠ Product ${product.name} hat unbekanntes Icon "${product.icon}", überspringe...`
      );
      continue;
    }

    try {
      const productName = `${product.name} ${product.name2}`.trim();
      const createdAt = new Date(product.created_at).getTime();
      // Preis in Cents (Supabase); Integer für Convex
      const priceInCents = Number(product.price) * 100;
      const productId = await convex.mutation(api.migration.createProductWithDate, {
        active: product.visible,
        categoryId: categoryId as Id<'categories'>,
        createdAt,
        deletedAt: product.deleted ? new Date('1970-01-01').getTime() : undefined,
        description: undefined,
        name: productName,
        price: priceInCents,
        updatedAt: createdAt,
      });

      supabaseIdToProductIdMap[product.id] = productId;
      console.log(`  ✓ Product migriert: ${productName}`);
    } catch (error) {
      console.error(`  ✗ Fehler beim Migrieren des Products ${product.name}:`, error);
      throw error;
    }
  }

  console.log(`✅ ${Object.keys(supabaseIdToProductIdMap).length} Products migriert\n`);

  // 4.5. Erstelle Fallback-Produkt für unbekannte Produkt-IDs in Bills
  console.log('🔧 Erstelle Fallback-Produkt für Migration...');
  const firstCategoryId = Object.values(iconToCategoryIdMap)[0] as Id<'categories'>;
  if (!firstCategoryId) {
    throw new Error('Keine Kategorie vorhanden für Fallback-Produkt');
  }
  const fallbackProductId = await convex.mutation(api.migration.createProductWithDate, {
    active: false,
    categoryId: firstCategoryId,
    createdAt: epochDate,
    description: undefined,
    name: 'Unbekanntes Produkt (Migration)',
    price: 0,
    updatedAt: epochDate,
    deletedAt: new Date('1970-01-01').getTime(),
  });
  console.log(`  ✓ Fallback-Produkt erstellt: ${fallbackProductId}\n`);

  // 5. Migrate Purchases (Bills) – bei ~26.900 Einträgen nur Fortschritt loggen
  const totalBills = billsList.length;
  console.log(`💰 Migriere Purchases (${totalBills} Bills)...`);

  // Hole alle Products einmal für die Purchase-Migration
  const allProducts = await convex.query(api.products.listForAdmin, {});
  const productIdToProductMap = new Map<Id<'products'>, Doc<'products'>>(
    allProducts.map((p) => [p._id, p])
  );

  let purchaseCount = 0;
  let skippedCount = 0;
  const progressInterval = 500; // Fortschritt alle 500 Bills

  for (let i = 0; i < billsList.length; i++) {
    const bill = billsList[i] as SupabaseBill;
    const teamId = uuidToTeamIdMap[bill.team];

    if (!teamId) {
      console.warn(`  ⚠ Bill ${bill.id} hat unbekanntes Team UUID "${bill.team}", überspringe...`);
      skippedCount++;
      continue;
    }

    // Transform products array - verwende Fallback-Produkt für unbekannte IDs
    const items: Array<{
      productId: Id<'products'>;
      name: string;
      price: number;
      quantity: number;
    }> = [];
    for (const item of bill.products) {
      const productId = supabaseIdToProductIdMap[item.id];
      // Preis in Cents (Supabase); Integer für Convex
      const priceInCents = Number(item.price) * 100;

      if (!productId) {
        // Unbekanntes Produkt: Verwende Fallback-Produkt
        items.push({
          productId: fallbackProductId as Id<'products'>,
          name: `Unbekannt (Supabase-ID: ${item.id})`,
          price: priceInCents,
          quantity: item.amount,
        });
        continue;
      }

      // Get product name from cached map
      const productDoc = productIdToProductMap.get(productId as Id<'products'>);

      if (!productDoc) {
        // Produkt-ID existiert nicht in Convex: Verwende Fallback-Produkt
        items.push({
          productId: fallbackProductId as Id<'products'>,
          name: `Unbekannt (Supabase-ID: ${item.id})`,
          price: priceInCents,
          quantity: item.amount,
        });
        continue;
      }

      items.push({
        productId: productId as Id<'products'>,
        name: productDoc.name,
        price: priceInCents,
        quantity: item.amount,
      });
    }

    // Falls bill.products leer ist, erstelle ein Fallback-Item mit totalAmount
    if (items.length === 0) {
      const totalAmountInCents = Number(bill.sum) * 100;
      items.push({
        productId: fallbackProductId as Id<'products'>,
        name: 'Unbekanntes Produkt (Migration)',
        price: totalAmountInCents,
        quantity: 1,
      });
    }

    try {
      const createdAt = new Date(bill.created_at).getTime();
      // Preis in Cents (Supabase); Integer für Convex
      const totalAmountInCents = Number(bill.sum) * 100;
      await convex.mutation(api.migration.createPurchaseWithDate, {
        createdAt,
        createdBy: undefined,
        items,
        teamId: teamId as Id<'teams'>,
        totalAmount: totalAmountInCents,
      });
      purchaseCount++;
      if ((i + 1) % progressInterval === 0 || i === billsList.length - 1) {
        process.stdout.write(`\r  ${purchaseCount}/${totalBills} Purchases migriert...`);
      }
    } catch (error) {
      console.error(`\n  ✗ Fehler beim Migrieren der Bill ${bill.id}:`, error);
      throw error;
    }
  }
  console.log('');

  console.log(`✅ ${purchaseCount} Purchases migriert, ${skippedCount} übersprungen\n`);

  // 6. Summary
  console.log('📊 Migration abgeschlossen!');
  console.log(`  - Teams: ${teams.length}`);
  console.log(`  - Categories: ${uniqueIcons.length}`);
  console.log(`  - Products: ${Object.keys(supabaseIdToProductIdMap).length}`);
  console.log(`  - Purchases: ${purchaseCount}`);
  console.log('\n✅ Alle Daten wurden erfolgreich migriert!');
};

main().catch((error) => {
  console.error('\n❌ Fehler bei der Migration:', error);
  process.exit(1);
});
