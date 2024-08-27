const jwt = require('jsonwebtoken');
const { User } = require('../models/');

exports.authMiddleware = async (req, res, next) => {
  // 1) fungsi jika di header kita masukkan token atau tidak
  let token = req.headers.authorization;

  if (!token) {
    return next(
      res.status(401).json({
        status: 401,
        message: 'Anda belum login/register token tidak ditemukan',
      })
    );
  }

  // 2) decode verifikasi token
  let decoded;
  console.log(token);
  try {
    token = token.split(' ')[1];
    decoded = await jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(
      res.status(401).json({
        error: err,
        message: 'Token yang dimasukkan tidak ditemukan/tidak ada',
      })
    );
  }

  // 3) ambil data user berdasarkan kondisi decode nya
  const currentUser = await User.findByPk(decoded.id);
  if (!currentUser) {
    return next(
      res.status(401).json({
        status: 401,
        message: 'User sudah terhapus token sudah tidak bisa digunakan',
      })
    );
  }
  //   console.log(currentUser);

  req.user = currentUser;

  next();
};

exports.permissionUser = (...roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({
          status: 404,
          error: 'Pengguna tidak ditemukan!',
        });
      }

      const roleName = user.role;

      if (!roles.includes(roleName)) {
        return res.status(403).json({
          status: 403,
          error: 'Anda tidak dapat mengakses halaman ini!',
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'Terjadi kesalahan pada server!',
      });
    }
  };
};
