const express = require('express');
const router = express.Router();
const {
  getAllTools,
  detailTool,
  updateTool,
  destroyTool,
  createTool,
} = require('../controllers/ToolController');
const {
  authMiddleware,
  permissionUser,
} = require('../middleware/UserMiddleware');
const upload = require('../middleware/uploadMiddleware');
const multer = require('multer');
const uploadbb = multer({ storage: multer.memoryStorage() });
//create data
router.post(
  '/',
  authMiddleware,
  permissionUser('admin'),
  upload.single('image'),
  createTool
);

//read data FindAll
router.get('/', getAllTools);

//detail data
router.get('/:id', authMiddleware, permissionUser('admin'), detailTool);

//update data
router.put(
  '/:id',
  authMiddleware,
  permissionUser('admin'),
  upload.single('image'),
  updateTool
);

//delete data
router.delete('/:id', authMiddleware, permissionUser('admin'), destroyTool);

module.exports = router;
