const knex = require('../../../../db');

async function createListing(data) {
  const result = await knex('listings').insert({
    farmer_id: data.farmer_id,
    crop_type: data.crop_type,
    quantity: data.quantity,
    price: data.price,
  }).returning(['listing_id', 'farmer_id', 'crop_type', 'quantity', 'price']);
  return Array.isArray(result) ? result[0] : result;
}

async function listings() {
  return knex('listings').select('*').limit(100);
}

module.exports = { createListing, listings };
