class PoolController {
  constructor(poolService) {
    this.poolService = poolService;
  }

  async getAll(_, res) {
    try {
      const pools = await this.poolService.getAll();

      if (!pools) {
        return res.status(404).json({ error: 'Pools not found.' });
      }
      return res.status(200).json({ pools });
    } catch (error) {
      console.error('Error getting all pools: ', error.stack);
      res.status(500).json({ error: 'Server error.' });
    }
  }

  async getById(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Pool id is required.' });
    }

    try {
      const pool = await this.poolService.getById(id);
      if (!pool) {
        return res.status(404).json({ error: 'Pool not found.' });
      }

      return res.status(200).json({ pool });
    } catch (error) {
      console.error('Error getting pool by ID: ', error.stack);
      res.status(500).json({ error: 'Server error.' });
    }
  }

  async createPool(req, res) {
    const poolData = req.body;
    if (!poolData) {
      return res.status(400).json({ error: 'Pool data is required.' });
    }

    const requiredFields = ['categoryId', 'basePrice', 'gameId'];
    for (const field of requiredFields) {
      if (!poolData[field]) {
        return res.status(400).json({ error: `Field ${field} is required.` });
      }
    }
    try {
      const pool = await this.poolService.createPool(poolData);
      if (!pool) {
        return res.status(500).json({ error: 'Failed to create pool.' });
      }

      return res.status(201).json(pool);
    } catch (error) {
      console.error('Error creating pool: ', error.stack);
      res.status(500).json({ error: 'Server error.' });
    }
  }
}
module.exports = PoolController;
