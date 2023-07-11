const express = require('express');
const RentController = require('../src/controllers/rentController');
const ItemModel = require('../src/models/itemModel');
const ItemService = require('../src/services/itemService');
const RentService = require('../src/services/rentService');
const RentModel = require('../src/models/rentModel');

const rentModel = new RentModel();
const rentService = new RentService(rentModel);
const itemModel = new ItemModel();
const itemService = new ItemService(itemModel);
const rentController = new RentController(rentService, itemService);

const router = express.Router();

router.post("/start-rent", (req, res) => rentController.createRent(req, res));
router.get("/get-active-by-rentee/:renteeAddress", (req, res) => rentController.getActiveByRentee(req, res));
router.get("/get-all-by-rentee/:renteeAddress", (req, res) => rentController.getAllByRentee(req, res));
router.post("/finish-rent", (req, res) => rentController.finishRent(req, res));

module.exports = router;
