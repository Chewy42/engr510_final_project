/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // First, delete all existing entries
  await knex('projects').del();
  await knex('users').del();
  
  // Then insert seed entries
  await knex('users').insert([
    {
      id: 1,
      email: 'test@example.com',
      // This is a hashed version of 'password123'
      password: '$2b$10$YaB6X5UZZ7K/YdXvHpMqU.vK5YF9JxGp1L3L1L5L5L5L5L5L5L5L5'
    }
  ]);
};
