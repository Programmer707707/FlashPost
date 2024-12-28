const {Router} = require('express');
const router = Router();
const {getLoginPage, getRegisterPage, registerNewUser, loginUser, logoutUser} = require('../controllers/auth');
const {protected, guest} = require('../middlewares/auth');

router.get('/login', guest, getLoginPage);
router.get('/signup', guest, getRegisterPage);
router.post('/signup', guest, registerNewUser);
router.post('/login', guest, loginUser);
router.get('/logout', logoutUser);

module.exports = router;