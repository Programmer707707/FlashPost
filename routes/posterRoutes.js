const {Router} = require('express');
const {getPosters, addNewPosterPage, addNewPoster, getOnePoster, getEditPosterPage, DeletePosterPage, updatePosterById} = require('../controllers/posters');
const {protected, guest} = require('../middlewares/auth');
const upload = require('../utils/fileUpload');
const router = Router();

// Order of routes are matter
// HTML or .hbsdagi formlar action ichidagi urllar (base route + routerdagi route) kabi bo'lishi va method esa routerdagi method bilan bir xil bo'lishi kerak 
router.get('/', getPosters);
router.get('/add', protected, addNewPosterPage);
router.post('/add', protected, upload.single('image'), addNewPoster);
router.get('/:id', getOnePoster);
router.get('/:id/edit', protected, getEditPosterPage);
router.post('/:id/edit', protected, updatePosterById);
router.get('/:id/delete', protected, DeletePosterPage);


module.exports = router;