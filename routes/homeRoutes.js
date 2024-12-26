const {Router} = require('express');
const getHome = require('../controllers/home');
const router = Router();

router.get('/', getHome);

module.exports = router;