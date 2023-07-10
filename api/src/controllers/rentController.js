class RentController {
  constructor(rentService, itemService) {
    this.rentService = rentService
    this.itemService = itemService
  }

  async createRent(req, res) {
    const rentData = req.body;
    if (!rentData) {
      return res.status(400).json({ error: 'Rent data is required.' });
    }

    const requiredFields = ['id', 'initDate', 'expirationDate', 'priceBlockchain', 'ownerAddress', 'renteeAddress', 'categoryId', 'itemId'];
    for (const field of requiredFields) {
      if (!rentData[field]) {
        return res.status(400).json({ error: `Field ${field} is required.` });
      }
    }

    try {
      const rent = await this.rentService.createRent(rentData);
      if (!rent) {
        return res.status(500).json({ error: 'Failed to create rent.' });
      }

      await this.itemService.rentItem(rent.itemId, rent.renteeAddress);

      return res.status(201).json(rent);
    } catch (error) {
      console.error('Error creating rent: ', error.stack);
      res.status(500).json({ error: 'Server error.' });
    }
  }

  async getRentById(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Rent ID is required.' });
    }

    try {
      const rent = await this.rentService.getRentById(id);
      if (!rent) {
        return res.status(404).json({ error: 'Rent not found.' });
      }

      return res.status(200).json(rent);
    } catch (error) {
      console.error('Error getting rent by ID: ', error.stack);
      res.status(500).json({ error: 'Server error.' });
    }
  }

  async getActiveByOwner(req, res) {
    const { ownerAddress } = req.params;

    if (!ownerAddress) {
      return res.status(400).json({ error: 'Owner adress is required.' });
    }

    try {
      const rents = await this.rentService.getActiveByOwner(ownerAddress);
      if (!rents) {
        return res.status(404).json({ error: 'Active rents by owner not found.' });
      }

      return res.status(200).json(rents);
    } catch (error) {
      console.error('Error getting active rents by owner: ', error.stack);
      res.status(500).json({ error: 'Server error.' });
    }
  }

  async getActiveByRentee(req, res) {
    const { renteeAddress } = req.params;

    if (!renteeAddress) {
      return res.status(400).json({ error: 'Rentee adress is required.' });
    }
    try {
      const rents = await this.rentService.getActiveByRentee(renteeAddress);
      if (!rents) {
        return res.status(404).json({ error: 'Active rents by rentee not found.' });
      }

      return res.status(200).json(rents);
    } catch (error) {
      console.error('Error getting active rents by rentee: ', error.stack);
      res.status(500).json({ error: 'Server error.' });
    }
  }

  async finishRent(req, res) {
    const { id, finishDate, itemId } = req.body;
    const requiredFields = ['id', 'finishDate', 'itemId'];
    for (const field of requiredFields) {
      if (!rentData[field]) {
        return res.status(400).json({ error: `Field ${field} is required.` });
      }
    }

    try {
      const rent = await this.rentService.finishRent({ id, finishDate });
      if (!rent) {
        return res.status(500).json({ error: 'Failed to finish rent.' });
      }
      this.itemService.finishRent(itemId);

      return res.status(200).json(rent);
    } catch (error) {
      console.error('Error finishing rent: ', error.stack);
      res.status(500).json({ error: 'Server error.' });
    }
  }

  async getAllByRentee(req, res) {
    const { renteeAddress } = req.params;
    if (!renteeAddress) {
      return res.status(400).json({ error: 'Rentee address is required.' });
    }

    try {
      const rents = await this.rentService.getAllByRentee(renteeAddress);
      if (!rents) {
        return res.status(404).json({ error: 'All rents by rentee not found.' });
      }

      return res.status(200).json(rents);
    } catch (error) {
      console.error('Error getting all rents by rentee: ', error.stack);
      res.status(500).json({ error: 'Server error.' });
    }
  }
}

module.exports = RentController;
