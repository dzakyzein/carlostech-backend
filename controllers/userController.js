const db = require("../config/db");
const { User } = require("../models");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    return res.status(200).json({
      status: "Success",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Fail",
      error: "Server down",
    });
  }
};

exports.totalUsers = async (req, res) => {
  try {
    const [result] = await db.query("SELECT COUNT(*) AS totalUsers FROM Users");
    res.json(result[0]);
  } catch (err) {
    console.error("Error fetching total users:", err);
    res.status(500).send("Error fetching total users");
  }
};

exports.detailUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        status: "Fail",
        error: "Data id tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "Success",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Fail",
      error: "Server down",
    });
  }
};

exports.storeUser = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    const newUser = await User.create({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      status: "Success",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      // Perbaiki status kode kesalahan menjadi 500
      status: "Fail",
      error: error.errors,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;

    await User.update(req.body, {
      where: {
        id: id,
      },
    });

    const newUser = await User.findByPk(id);

    if (!newUser) {
      return res.status(404).json({
        status: "Fail",
        error: "Data id tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "Success",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Fail",
      error: "Server down",
    });
  }
};

exports.destroyUser = async (req, res) => {
  const id = req.params.id;

  const idUser = await User.findByPk(id);

  if (!idUser) {
    return res.status(404).json({
      status: "Fail",
      error: "Data id tidak ditemukan",
    });
  }

  await User.destroy({
    where: {
      id,
    },
  });

  return res.status(200).json({
    status: "Success",
    message: `Data dengan id ${id} berhasil dihapus`,
  });
};
