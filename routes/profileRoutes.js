const {Router} = require('express');
const router = Router();
const {getProfilePage, updateUserPage, updateUser} = require('../controllers/profile');
const {protected, guest} = require('../middlewares/auth');

router.get('/change', protected, updateUserPage);
router.get('/:username', protected, getProfilePage);
router.post('/change', protected, updateUser);

module.exports = router;