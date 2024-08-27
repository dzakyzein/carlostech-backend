const express = require('express');
const router = express.Router();
const {
  storeUser,
  getAllUsers,
  detailUser,
  updateUser,
  destroyUser,
  totalUsers,
} = require('../controllers/userController');

//create data
router.post('/', storeUser);

//read data FindAll
router.get('/', getAllUsers);

//read data total users
router.get('/total-users', totalUsers);

//detail data
router.get('/:id', detailUser);

//update data
router.put('/:id', updateUser);

//delete data
router.delete('/:id', destroyUser);

module.exports = router;
