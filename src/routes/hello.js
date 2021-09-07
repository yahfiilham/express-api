const express = require('express');

const { sayHello } = require('../controllers/hello');

const router = express.Router();

router.get('/', sayHello);

module.exports = router;