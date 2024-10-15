const express = require('express');
const router = express.Router({ mergeParams: true });
const tokenGenerate = require('../controllers/tokenGenerate');
const catchAsync = require('../utils/catchAsync');
const { isAdminOrTester, isLoggedIn } = require('../middleware');


router.get('/', isLoggedIn, isAdminOrTester, catchAsync( tokenGenerate.index ));
router.post('/', isLoggedIn, isAdminOrTester, catchAsync( tokenGenerate.gen ));

module.exports = router;