const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/middleware");
const checkListingOwnership = require("../middleware/listingMiddleware")
const listingController = require("../controllers/listingController");

router.get("/", listingController.indexPage);
router.get("/add", isLoggedIn, listingController.addListingPage);
router.get("/:id/edit", isLoggedIn, checkListingOwnership, listingController.editListingPage);
router.get("/:id", listingController.listingDetailPage);
router.post("/", isLoggedIn, listingController.addListing);
router.patch("/:id", isLoggedIn, checkListingOwnership, listingController.updateListing);
router.delete("/:id", isLoggedIn, checkListingOwnership, listingController.deleteListing);

module.exports = router;

