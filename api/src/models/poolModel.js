const pool = require('../../helpers/pgConnection');
const camelize = require('camelize');

class PoolModel {
  constructor() {
    this.pool = pool;
  }

  async createPool({ categoryId, gameId, basePrice }) {
    const imageUrl = `https://nft-rent-marketplace.s3.us-east-2.amazonaws.com/categories/${categoryId}.png`
    const query = `
      INSERT INTO pools (category_id, game_id, base_price, image_url, is_active)
      VALUES ($1, $2, $3, '${imageUrl}', true)
      RETURNING *;
    `;

    try {
      const result = await this.pool.query(query, [categoryId, gameId, basePrice]);
      return camelize(result.rows[0]);
    } catch (error) {
      console.error('Error creating pool: ', error.stack);
    }
  }

  async getById(id) {
    const query = `
      SELECT *
      FROM pools
      INNER JOIN categories 
      ON pools.categoryId = categories.id
      WHERE pools.categoryId = $1;
    `;

    try {
      const result = await this.pool.query(query, [id]);
      return camelize(result.rows);
    } catch (error) {
      console.error('Error getting pool by ID: ', error.stack);
    }
  }

  async getAll() {
    const query = `
    SELECT pools.*, 
    categories.name AS category_name,
    categories.short_description,
    rarities.name AS rarity_name,
    rarities.id AS rarity_id
    FROM pools 
    INNER JOIN categories 
    ON pools.category_id = categories.id
    INNER JOIN rarities
    ON categories.rarity_id = rarities.id;
    `;

    try {
      const result = await this.pool.query(query);
      return camelize(result.rows);
    } catch (error) {
      console.error('Error getting all pools: ', error.stack);
    }
  }
}

module.exports = PoolModel;