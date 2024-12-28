const {Router} = require('express');
const router = Router();
const {getProfilePage} = require('../controllers/profile');
const {protected, guest} = require('../middlewares/auth');

router.get('/:username', protected, getProfilePage);

module.exports = router;