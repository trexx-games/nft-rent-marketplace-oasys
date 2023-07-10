const express = require('express');
const ItemController = require('../src/controllers/itemController')
const ItemService = require('../src/services/itemService');
const ItemModel = require('../src/models/itemModel');

const itemModel = new ItemModel();
const itemService = new ItemService(itemModel);
const itemController = new ItemController(itemService);

const router = express.Router();

router.post('/create-item', (req, res) => itemController.createItem(req, res));
router.put('/add-to-pool/:nftId', (req, res) => itemController.addToPool(req, res));
router.get('/get-in-pool/:ownerAddress', (req, res) => itemController.getItemsInPoolByUser(req, res));
router.get('/get-rented/:ownerAddress', (req, res) => itemController.getItemsRentedByUser(req, res));
router.get('/get-owned/:ownerAddress', (req, res) => itemController.getByOwner(req, res));
router.get('/get-by-nft-id/:nftId', (req, res) => itemController.getByNftId(req, res));
router.get('/:id', (req, res) => itemController.getById(req, res));
module.exports = router;
