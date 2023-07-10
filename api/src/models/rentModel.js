const pool = require('../../helpers/pgConnection');
const { RENT_STATUS_ENUM } = require('../../enums/rentStatus');
const camelize = require('camelize');

class RentModel {
  constructor() {
    this.pool = pool;
  }

  async createRent({ id, initDate, expirationDate, priceBlockchain, ownerAddress, renteeAddress, categoryId, itemId }) {
    const query = `
      INSERT INTO rents (id, init_date, expiration_date, price_blockchain, owner_address, rentee_address, category_id, item_id, rent_status_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, ${RENT_STATUS_ENUM.ACTIVE})
      RETURNING *;
    `;

    try {
      const result = await this.pool.query(query, [id, initDate, expirationDate, priceBlockchain, ownerAddress, renteeAddress, categoryId, itemId]);
      return camelize(result.rows[0]);
    } catch (error) {
      console.error('Error creating rent: ', error.stack);
    }
  }

  async getRentById(id) {
    const query = `
      SELECT *
      FROM rents
      WHERE id = $1;
    `;

    try {
      const result = await this.pool.query(query, [id]);
      return camelize(result.rows);
    } catch (error) {
      console.error('Error getting rent by ID: ', error.stack);
    }
  }

  async getActiveByOwner(ownerAddress) {
    const query = `
      SELECT *
      FROM rents
      WHERE owner_address = $1 AND rent_status_id = ${RENT_STATUS_ENUM.ACTIVE};
    `;

    try {
      const result = await this.pool.query(query, [ownerAddress]);
      return camelize(result.rows);
    } catch (error) {
      console.error('Error getting active rents by owner: ', error.stack);
    }
  }

  async getActiveByRentee(renteeAddress) {
    const query = `
      SELECT *
      FROM rents
      WHERE rentee_address = $1 AND rent_status_id = ${RENT_STATUS_ENUM.ACTIVE};
    `;

    try {
      const result = await this.pool.query(query, [renteeAddress]);
      return camelize(result.rows);
    } catch (error) {
      console.error('Error getting active rents by rentee: ', error.stack);
    }
  }

  async finishRent({ id, finishDate }) {
    const query = `
      UPDATE rents
      SET rent_status_id = ${RENT_STATUS_ENUM.FINISHED}, finish_date = $2
      WHERE id = $1
      RETURNING *;
    `;

    try {
      const result = await this.pool.query(query, [id, finishDate]);
      return camelize(result.rows);
    } catch (error) {
      console.error('Error finishing rent: ', error.stack);
    }
  }

  async getAllByRentee(renteeAddress) {
    const query = `
      SELECT *
      FROM rents
      WHERE rentee_address = $1;
    `;

    try {
      const result = await this.pool.query(query, [renteeAddress]);
      return camelize(result.rows);
    } catch (error) {
      console.error('Error getting all rents by rentee: ', error.stack);
    }
  }
}

module.exports = RentModel;
