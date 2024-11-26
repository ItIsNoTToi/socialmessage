var express = require('express');
var router = express.Router();
const authMiddleware = require('../../middlewares/web/authMiddleware');
var postcontroller = require('../../controllers/web/postcontroller');
const multer = require('multer');

router.get('/', authMiddleware, postcontroller.getpost);
router.get('/randompost', authMiddleware, postcontroller.getramdompost);


const upload = multer();

router.post('/', upload.fields([{ name: 'image', maxCount: 10 }, { name: 'video', maxCount: 5 }]), postcontroller.pushpost);

module.exports = router;
