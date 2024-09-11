const express = require('express');
const router = express.Router();
const {
  storeReservation,
  getAllReservations,
  detailReservation,
  updateReservation,
  destroyReservation,
  uploadPaymentProof,
  deletePaymentProof,
  totalReservations,
  monthlyRevenueCurrent,
  getSalesData,
  revenueByMonth,
  uploadPaidOff,
  deletePaidOff,
  monthlyRevenue,
} = require('../controllers/ReservationController');
const { authMiddleware } = require('../middleware/UserMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Create data
router.post('/', authMiddleware, storeReservation);

// Read data FindAll
router.get('/', authMiddleware, getAllReservations);

// Read data total reservations
router.get('/total-reservations', authMiddleware, totalReservations);

// Read data total monthly current
router.get('/current-month-revenue', authMiddleware, monthlyRevenueCurrent);

router.get('/monthly-revenue', authMiddleware, monthlyRevenue);

// Read data sales
router.get('/sales-data', authMiddleware, getSalesData);

// Detail data
router.get('/:id', authMiddleware, detailReservation);

// Update data
router.put('/:id', authMiddleware, updateReservation);

// Delete data
router.delete('/:id', authMiddleware, destroyReservation);

// Delete payment proof
router.put('/delete-proof/:id', authMiddleware, deletePaymentProof);

// Endpoint untuk upload bukti pembayaran
router.put(
  '/upload-proof/:id',
  authMiddleware,
  upload.single('proof'),
  uploadPaymentProof
);

// Delete paidoff
router.put('/delete-paidoff/:id', authMiddleware, deletePaidOff);

// Endpoint untuk upload bukti kelunasan
router.put(
  '/upload-paidoff/:id',
  authMiddleware,
  upload.single('paidoff'),
  uploadPaidOff
);

module.exports = router;
