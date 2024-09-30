const { Tool } = require('../models');
const asyncHandle = require('../middleware/asyncHandle');
const upload = require('../middleware/uploadMiddleware');
const storeImage = require('../utils/lib');

exports.getAllTools = async (req, res) => {
  try {
    const tools = await Tool.findAll();

    return res.status(200).json({
      status: 'Success',
      data: tools,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'Fail',
      error: 'Server down',
    });
  }
};

exports.detailTool = async (req, res) => {
  try {
    const id = req.params.id;
    const tool = await Tool.findByPk(id);

    if (!tool) {
      return res.status(404).json({
        status: 'Fail',
        error: 'Data id tidak ditemukan',
      });
    }

    return res.status(200).json({
      status: 'Success',
      data: tool,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'Fail',
      error: 'Server down',
    });
  }
};

exports.createTool = async (req, res) => {
  try {
    const imgFile = req.file;
    if (!imgFile) {
      console.error('Image not found');
      return res.status(400).json({
        status: 'Fail',
        error: 'Image not found',
      });
    }
    const imgString = imgFile ? await storeImage(imgFile) : '';

    const newTool = await Tool.create({
      title,
      type,
      description,
      imageUrl: imgString,
    });
    res.status(201).json({
      status: 'Success',
      data: newTool,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'Fail',
      error: 'Server down',
    });
  }
};

exports.storeTool = [
  upload.single('image'),
  asyncHandle(async (req, res) => {
    const { title, type, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newTool = await Tool.create({
      title,
      type,
      description,
      imageUrl, // Simpan nama file gambar
    });

    res.status(201).json({
      status: 'Success',
      data: newTool,
    });
  }),
];

exports.updateTool = asyncHandle(async (req, res) => {
  const id = req.params.id;

  const [updated] = await Tool.update(req.body, {
    where: { id: id },
  });

  console.log(`Mencoba mengupdate tool dengan ID: ${id}`);

  if (!updated) {
    return res.status(404).json({
      status: 'Fail',
      error: 'Tool tidak ditemukan',
    });
  }

  const updatedTool = await Tool.findByPk(id);

  return res.status(200).json({
    status: 'Success',
    data: updatedTool,
  });
});

exports.destroyTool = async (req, res) => {
  const id = req.params.id;

  const tool = await Tool.findByPk(id);

  if (!tool) {
    return res.status(404).json({
      status: 'Fail',
      error: 'Data id tidak ditemukan',
    });
  }

  await Tool.destroy({
    where: {
      id,
    },
  });

  return res.status(200).json({
    status: 'Success',
    message: `Data dengan id ${id} berhasil dihapus`,
  });
};
