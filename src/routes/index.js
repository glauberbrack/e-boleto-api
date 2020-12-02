const { Router } = require('express');

const BilletController = require('../controllers/BilletController');

const routes = Router();

routes.get('/boleto/:number', BilletController.show);

module.exports = routes;
