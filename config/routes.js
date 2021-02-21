const router = require("express").Router();
const miscController = require("../controllers/misc.controller")

router.get("/", miscController.home);

module.exports =router