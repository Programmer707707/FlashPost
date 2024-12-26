const {Router} = require('express');
const router = Router();
const {getProfilePage} = require('../controllers/profile');

router.get('/:username', getProfilePage);

module.exports = router;