const knex = require('../../../../db');

async function createUser(phone, name) {
  const result = await knex('users').insert({ phone, name }).returning(['user_id', 'phone', 'name']);
  return Array.isArray(result) ? result[0] : result;
}

module.exports = { createUser };
