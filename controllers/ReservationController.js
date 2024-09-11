const { Reservation, User } = require('../models');
const fs = require('fs');
const path = require('path');
const db = require('../config/db');

const cleanPrice = (price) => {
  return parseFloat(price.replace(/Rp\s?|\.|,/g, ''));
};

exports.getAllReservations = async (req, res) => {
  try {
    // Mendapatkan data pengguna dari middleware autentikasi
    const user = req.user;

    // Jika pengguna adalah admin, ambil semua reservasi
    if (user.role === 'admin') {
      const reservations = await Reservation.findAll({
        include: [{ model: User, as: 'user' }],
      });

      return res.status(200).json({
        status: 'Success',
        data: reservations,
      });
    }

    // Jika bukan admin, ambil reservasi yang dimiliki oleh pengguna yang login
    const userId = user.id;
    const reservations = await Reservation.findAll({
      where: { userId: userId },
      include: [{ model: User, as: 'user' }],
    });

    return res.status(200).json({
      status: 'Success',
      data: reservations,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'Fail',
      error: 'Server down',
    });
  }
};

exports.totalReservations = async (req, res) => {
  try {
    const [result] = await db.query(
      'SELECT COUNT(*) AS totalReservations FROM reservations'
    );
    res.json(result[0]);
  } catch (err) {
    console.error('Error fetching total reservations: ', err);
    res.status(500).send('Error Fetching total reservations');
  }
};

exports.monthlyRevenueCurrent = async (req, res) => {
  try {
    const [result] = await db.query(
      `SELECT 
         SUM(price) AS totalRevenue 
       FROM reservations 
       WHERE MONTH(createdAt) = MONTH(CURDATE()) 
       AND YEAR(createdAt) = YEAR(CURDATE())`
    );
    res.json(result[0]);
  } catch (err) {
    console.error('Error fetching current month revenue: ', err);
    res.status(500).send('Error fetching current month revenue');
  }
};

exports.monthlyRevenue = async (req, res) => {
  const { month, year } = req.query;

  try {
    const [result] = await db.query(
      `SELECT 
         SUM(price) AS totalRevenue 
       FROM reservations 
       WHERE MONTH(createdAt) = ? 
       AND YEAR(createdAt) = ?`,
      {
        replacements: [month, year],
      }
    );
    res.json(result[0]);
  } catch (err) {
    console.error('Error fetching monthly revenue: ', err);
    res.status(500).send('Error fetching monthly revenue');
  }
};

exports.detailReservation = async (req, res) => {
  try {
    const id = req.params.id;
    const reservation = await Reservation.findByPk(id, {
      include: [{ model: User, as: 'user' }],
    });

    if (!reservation) {
      return res.status(404).json({
        status: 'Fail',
        error: 'Data id tidak ditemukan',
      });
    }

    return res.status(200).json({
      status: 'Success',
      data: reservation,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'Fail',
      error: 'Server down',
    });
  }
};

exports.storeReservation = async (req, res) => {
  try {
    const { name, phone, address, type, amount, note } = req.body;
    const userId = req.user.id;

    const newReservation = await Reservation.create({
      name,
      phone,
      address,
      type,
      amount,
      note,
      userId,
    });

    res.status(201).json({
      status: 'Success',
      data: newReservation,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'Fail',
      error: error.errors,
    });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const id = req.params.id;

    if (req.body.price) {
      req.body.price = cleanPrice(req.body.price);
    }

    await Reservation.update(req.body, {
      where: {
        id: id,
      },
    });

    const updatedReservation = await Reservation.findByPk(id, {
      include: [{ model: User, as: 'user' }],
    });

    if (!updatedReservation) {
      return res.status(404).json({
        status: 'Fail',
        error: 'Data id tidak ditemukan',
      });
    }

    return res.status(200).json({
      status: 'Success',
      data: updatedReservation,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'Fail',
      error: 'Server down',
    });
  }
};

exports.destroyReservation = async (req, res) => {
  const id = req.params.id;

  const reservation = await Reservation.findByPk(id);

  if (!reservation) {
    return res.status(404).json({
      status: 'Fail',
      error: 'Data id tidak ditemukan',
    });
  }

  await Reservation.destroy({
    where: {
      id,
    },
  });

  return res.status(200).json({
    status: 'Success',
    message: `Data dengan id ${id} berhasil dihapus`,
  });
};

exports.getSalesData = async (req, res) => {
  try {
    const salesData = await Reservation.findAll({
      attributes: [
        [db.fn('DATE', db.col('createdAt')), 'date'],
        [db.fn('SUM', db.col('amount')), 'sales'],
      ],
      group: ['date'],
      order: [['date', 'ASC']],
    });

    // Format data sesuai kebutuhan
    const formattedData = salesData.map((item) => ({
      date: item.date,
      sales: parseFloat(item.sales),
    }));

    res.json({ salesData: formattedData });
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fungsi untuk upload bukti pembayaran
exports.uploadPaymentProof = async (req, res) => {
  try {
    const id = req.params.id;
    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({
        status: 'Fail',
        error: 'Data id tidak ditemukan',
      });
    }

    // Simpan path bukti pembayaran
    reservation.paymentProof = req.file.path;
    await reservation.save();

    return res.status(200).json({
      status: 'Success',
      data: reservation,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'Fail',
      error: 'Server down',
    });
  }
};

// Fungsi untuk menghapus bukti pembayaran
exports.deletePaymentProof = async (req, res) => {
  try {
    const id = req.params.id;
    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({
        status: 'Fail',
        error: 'Data id tidak ditemukan',
      });
    }

    // Hapus file bukti pembayaran dari server jika ada
    if (reservation.paymentProof) {
      const filePath = path.join(__dirname, '..', reservation.paymentProof);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Gagal menghapus file:', err);
        }
      });
    }

    // Set paymentProof menjadi null
    reservation.paymentProof = null;
    await reservation.save();

    return res.status(200).json({
      status: 'Success',
      message: 'Bukti pembayaran berhasil dihapus',
      data: reservation,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'Fail',
      error: 'Server down',
    });
  }
};

// Fungsi untuk upload bukti pembayaran
exports.uploadPaidOff = async (req, res) => {
  try {
    const id = req.params.id;
    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({
        status: 'Fail',
        error: 'Data id tidak ditemukan',
      });
    }

    // Simpan path bukti pembayaran
    reservation.paidOff = req.file.path;
    await reservation.save();

    return res.status(200).json({
      status: 'Success',
      data: reservation,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'Fail',
      error: 'Server down',
    });
  }
};

// Fungsi untuk menghapus bukti pembayaran
exports.deletePaidOff = async (req, res) => {
  try {
    const id = req.params.id;
    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({
        status: 'Fail',
        error: 'Data id tidak ditemukan',
      });
    }

    // Hapus file bukti pembayaran dari server jika ada
    if (reservation.paidOff) {
      const filePath = path.join(__dirname, '..', reservation.paidOff);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Gagal menghapus file:', err);
        }
      });
    }

    // Set paidOff menjadi null
    reservation.paidOff = null;
    await reservation.save();

    return res.status(200).json({
      status: 'Success',
      message: 'Bukti pembayaran berhasil dihapus',
      data: reservation,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'Fail',
      error: 'Server down',
    });
  }
};
