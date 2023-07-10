class RentService {
  constructor(rentModel) {
    this.rentModel = rentModel;
  }

  async createRent(rentData) {
    return await this.rentModel.createRent(rentData);
  }

  async getRentById(id) {
    return await this.rentModel.getRentById(id);
  }

  async getActiveByOwner(ownerAddress) {
    return await this.rentModel.getActiveByOwner(ownerAddress);
  }

  async getActiveByRentee(renteeAddress) {
    return await this.rentModel.getActiveByRentee(renteeAddress);
  }

  async finishRent(finishRentData) {
    return await this.rentModel.finishRent(finishRentData);
  }

  async getAllByRentee(renteeAddress) {
    return await this.rentModel.getAllByRentee(renteeAddress);
  }
}

module.exports = RentService;
