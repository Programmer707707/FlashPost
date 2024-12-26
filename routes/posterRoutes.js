const {Router} = require('express');
const {getPosters, addNewPosterPage, addNewPoster, getOnePoster, getEditPosterPage, DeletePosterPage, updatePosterById} = require('../controllers/posters');
const upload = require('../utils/fileUpload');
const router = Router();

// Order of routes are matter
// HTML or .hbsdagi formlar action ichidagi urllar (base route + routerdagi route) kabi bo'lishi va method esa routerdagi method bilan bir xil bo'lishi kerak 
router.get('/', getPosters);
router.get('/add', addNewPosterPage);
router.post('/add', upload.single('image'), addNewPoster);
router.get('/:id', getOnePoster);
router.get('/:id/edit', getEditPosterPage);
router.post('/:id/edit', updatePosterById);
router.get('/:id/delete', DeletePosterPage);


module.exports = router;