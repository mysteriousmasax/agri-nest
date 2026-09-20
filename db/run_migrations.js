const fs = require('fs');
const path = require('path');
const knexConfig = require('./knexfile');
const Knex = require('knex');

async function run() {
  const knex = Knex(knexConfig);
  try {
    const sqlPath = path.join(__dirname, '..', 'sql', 'schema_core.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log('Running core schema SQL...');
    await knex.raw(sql);

    console.log('Ensuring listings table exists...');
    const exists = await knex.schema.hasTable('listings');
    if (!exists) {
      await knex.schema.createTable('listings', (t) => {
        t.uuid('listing_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        t.uuid('farmer_id').references('user_id').inTable('users');
        t.string('crop_type');
        t.decimal('quantity');
        t.decimal('price');
        t.timestamp('created_at').defaultTo(knex.fn.now());
      });
    }

    console.log('Migrations complete.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

run();
