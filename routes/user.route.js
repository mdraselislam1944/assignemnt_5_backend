const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/auth/register", userController.setUsers);
router.post("/auth/login",userController.getUser);

module.exports = router;
