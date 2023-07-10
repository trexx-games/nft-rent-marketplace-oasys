class ItemService {
  constructor(itemModel) {
    this.itemModel = itemModel;
  }

  async getItemByNftId(nftId) {
    return await this.itemModel.getItemByNftId(nftId);
  }

  async getById(itemId) {
    return await this.itemModel.getById(itemId);
  }

  async createItem(itemData) {
    return await this.itemModel.createItem(itemData);
  }

  async getByOwner(ownerAddress) {
    return await this.itemModel.getByOwner(ownerAddress);
  }

  async getIdleByOwner(ownerAddress) {
    return await this.itemModel.getIdleByOwner(ownerAddress);
  }

  async rentItem(rentItemData) {
    return await this.itemModel.rentItem(rentItemData);
  }

  async finishRent(itemId) {
    return await this.itemModel.finishRent(itemId);
  }

  async addToPool(itemId) {
    return await this.itemModel.addToPool(itemId);
  }

  async getItemsInPoolByUser(ownerAddress) {
    return await this.itemModel.getItemsInPoolByUser(ownerAddress);
  }

  async getItemsRentedByUser(ownerAddress) {
    return await this.itemModel.getItemsRentedByUser(ownerAddress);
  }
}

module.exports = ItemService;
