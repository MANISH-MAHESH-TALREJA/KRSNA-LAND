const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/middleware");
const reviewController = require("../controllers/reviewController");

router.post("/:id", isLoggedIn, reviewController.postReview);
router.delete("/:listing/:id", isLoggedIn, reviewController.deleteReview);

module.exports = router;