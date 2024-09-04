const express = require('express');
const router = express.Router({ mergeParams: true });
const resumeCtrl = require('../controllers/resume')
const catchAsync = require('../utils/catchAsync');
const multer = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({storage})
const { isLoggedIn} = require('../middleware');


router.get('/', isLoggedIn, catchAsync(resumeCtrl.index));
router.put('/', isLoggedIn, upload.array('profileImgs'), catchAsync(resumeCtrl.put));
router.get('/edit', isLoggedIn, catchAsync(resumeCtrl.editForm) );

module.exports = router;