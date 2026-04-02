var express = require("express");
var router = express.Router();
let multer = require('multer');
let path = require('path');
let { CreateUserValidator, validationResult } = require('../utils/validatorHandler')
let userModel = require("../schemas/users");
let userController = require('../controllers/users')
let { CheckLogin, CheckRole } = require('../utils/authHandler')
let { importUsersFromFile } = require('../utils/userImportHandler');
let mailHandler = require('../utils/mailHandler');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, 'users_' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.xlsx', '.xls', '.csv'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only .xlsx, .xls, and .csv files are allowed'));
    }
  }
});

router.get("/", CheckLogin, CheckRole("ADMIN", "MODERATOR"), async function (req, res, next) {
  let users = await userModel
    .find({ isDeleted: false })
    .populate({
      path: 'role',
      select: 'name'
    })
  res.send(users);
});

router.get("/:id", CheckLogin, CheckRole("ADMIN"), async function (req, res, next) {
  try {
    let result = await userModel
      .find({ _id: req.params.id, isDeleted: false })
    if (result.length > 0) {
      res.send(result);
    }
    else {
      res.status(404).send({ message: "id not found" });
    }
  } catch (error) {
    res.status(404).send({ message: "id not found" });
  }
});

router.post("/", CreateUserValidator, validationResult, async function (req, res, next) {
  try {
    let newItem = await userController.CreateAnUser(
      req.body.username, req.body.password, req.body.email, req.body.role
    )
    res.send(newItem);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

/**
 * Import users from file
 * POST /api/v1/users/import
 * - Accepts Excel (.xlsx, .xls) or CSV (.csv) file
 * - Creates users with random 16-character passwords
 * - Sends password via email to each user
 * - Requires ADMIN role
 */
router.post("/import", CheckLogin, CheckRole("ADMIN"), upload.single('file'), async function (req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
    }

    if (!req.body.roleId) {
      return res.status(400).send({ message: "roleId is required" });
    }

    // Import users from file
    const result = await importUsersFromFile(
      req.file.path,
      req.body.roleId,
      userController,
      mailHandler
    );

    // Delete uploaded file after processing
    const fs = require('fs');
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting file:', err);
    });

    res.send({
      success: true,
      message: "Users imported successfully",
      data: result
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: err.message
    });
  }
});

router.put("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await
      userModel.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedItem) return res.status(404).send({ message: "id not found" });

    let populated = await userModel
      .findById(updatedItem._id)
    res.send(populated);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await userModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).send({ message: "id not found" });
    }
    res.send(updatedItem);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;