const multer = require('multer');
const path = require('path');

// Set storage
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fieldSize: 10000000 },
    fileFilter: function(req,file, cb){
        checkFileType(file, cb);
    }
})

//Check for image
function checkFileType(file,cb){
    const filetypes = /jpeg|jpg|png/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    }
    else{
        cb('Error: you can only upload .png, .jpg, .jpeg, type files')
    }
}

module.exports = upload;