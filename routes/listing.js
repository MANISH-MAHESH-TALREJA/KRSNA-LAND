require('dotenv').config();
const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/middleware");
const checkListingOwnership = require("../middleware/listingMiddleware")
const listingController = require("../controllers/listingController");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer(storage);

router.route("/")
	.get(listingController.indexPage)
	.post(isLoggedIn, upload.single('image'),  listingController.addListing);

router.get("/add", isLoggedIn, listingController.addListingPage);
router.get("/:id/edit", isLoggedIn, checkListingOwnership, listingController.editListingPage);

router.route("/:id")
	.get(listingController.listingDetailPage)
	.patch(isLoggedIn, checkListingOwnership, upload.single('image'), listingController.updateListing)
	.delete(isLoggedIn, checkListingOwnership, listingController.deleteListing);


module.exports = router;

