const pool = require('../../helpers/pgConnection');
const camelize = require('camelize');
class ItemModel {
  constructor() {
    this.pool = pool;
  }

  async getItemByNftId(nftId) {
    const query = `
    SELECT * 
    FROM items 
    WHERE nft_id = $1;
  `;

    try {
      const result = await this.pool.query(query, [nftId]);
      return camelize(result.rows[0]);
    } catch (error) {
      console.error("Error getting item by NFT ID: ", error.stack);
      throw error;
    }
  }

  async createItem({ id, categoryId, ownerAddress, gameId, nftContractAddress, nftId, rarityId, blockchainId }) {
    const query = `
    INSERT INTO items (id, category_id, owner_address, rentee_address, is_in_pool, game_id, nft_contract_address, nft_id, rarity_id, blockchain_id, is_rented) 
    VALUES ($1, $2, $3, NULL, false, $4, $5, $6, $7, $8, false)
    RETURNING *;
  `;

    try {
      const result = await this.pool.query(query, [id, categoryId, ownerAddress, gameId, nftContractAddress, nftId, rarityId, blockchainId]);
      return camelize(result.rows[0]);
    } catch (error) {
      console.error("Error creating item: ", error.stack);
      throw error;
    }
  }

  async getByOwner(ownerAddress) {
    const query = `
      SELECT *
      FROM items
      WHERE items.owner_address = $1;
    `;
    try {
      const result = await this.pool.query(query, [ownerAddress]);
      return camelize(result.rows);
    }
    catch (error) {
      console.error("Error getting items by owner: ", error.stack);
      throw error;
    }
  }

  async getById(itemId) {
    const query = `
      SELECT *
      FROM items
      WHERE items.id = $1;
    `;
    try {
      const result = await this.pool.query(query, [itemId]);
      if (result.rows.length > 0) {
        return camelize(result.rows[0]);
      }
      return null;
    }
    catch (error) {
      console.error("Error getting item by Id: ", error.stack);
      throw error;
    }
  }

  async getIdleByOwner(ownerAddress) {
    const query = `
      SELECT *
      FROM items
      WHERE items.owner_address = $1 AND items.is_in_pool = false;
    `;
    try {
      const result = await this.pool.query(query, [ownerAddress]);
      return camelize(result.rows);
    }
    catch (error) {
      console.error("Error getting idle items by owner: ", error.stack);
      throw error;
    }
  }

  async rentItem({ itemId, renteeAddress }) {
    const query = `
      UPDATE items
      SET rentee_address = $1, is_rented = true
      WHERE id = $2;
    `;
    try {
      const result = await this.pool.query(query, [renteeAddress, itemId]);
      return camelize(result.rows);
    }
    catch (error) {
      console.error("Error renting item: ", error.stack);
      throw error;
    }
  }

  async finishRent(itemId) {
    const query = `
      UPDATE items
      SET rentee_address = NULL, is_rented = false
      WHERE id = $1;
    `;
    try {
      const result = await this.pool.query(query, [itemId]);
      return camelize(result.rows);
    }
    catch (error) {
      console.error("Error finishing rent: ", error.stack);
      throw error;
    }
  }

  async addToPool(itemId) {
    const query = `
      UPDATE items
      SET is_in_pool = true
      WHERE id = $1;
    `;
    try {
      const result = await this.pool.query(query, [itemId]);
      return camelize(result.rows);
    }
    catch (error) {
      console.error("Error adding item to pool: ", error.stack);
      throw error;
    }
  }

  async getItemsInPoolByUser(ownerAddress) {
    const query = `
      SELECT *
      FROM items
      WHERE items.owner_address = $1 AND items.is_in_pool = true;
    `;
    try {
      const result = await this.pool.query(query, [ownerAddress]);
      return camelize(result.rows);
    }
    catch (error) {
      console.error("Error getting items in pool by owner: ", error.stack);
      throw error;
    }
  }

  async getItemsRentedByUser(ownerAddress) {
    const query = `
      SELECT *
      FROM items
      WHERE items.owner_address = $1 AND items.is_rented = true;
    `;
    try {
      const result = await this.pool.query(query, [ownerAddress]);
      return camelize(result.rows);
    }
    catch (error) {
      console.error("Error getting items rented by owner: ", error.stack);
      throw error;
    }
  }
}

module.exports = ItemModel;