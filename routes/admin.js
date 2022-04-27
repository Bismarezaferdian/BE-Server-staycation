const router = require("express").Router();
const adminController = require("../controller/adminController.js");
const { upload, uploadMultiple } = require("../middlewares/multer.js");
const auth = require("../middlewares/auth.js");

router.get("/signin", adminController.viewSingin);
router.post("/signin", adminController.actionSignin);
router.use(auth);
router.get("/logout", adminController.actionLogout);
router.get("/dashboard", adminController.viewDashboard);
//router category
router.get("/category", adminController.viewCategory);
router.post("/category", adminController.addCategory);
router.put("/category", adminController.editCategory);
router.delete("/category/:id", adminController.deleteCategory);
//router bank
router.get("/bank", adminController.viewBank);
router.post("/bank", upload, adminController.addBank);
router.put("/bank", upload, adminController.editBank);
router.delete("/bank/:id", adminController.deleteBank);
//router item
router.get("/item", adminController.viewItem);
router.post("/item", uploadMultiple, adminController.addItem);
router.get("/item/show-image/:id", adminController.showImageItem);
router.get("/item/:id", adminController.showEditItem);
router.put("/item/:id", uploadMultiple, adminController.editItem);
router.delete("/item/:id/delete", adminController.deleteItem);
//router item feature
router.get("/item/show-detail-item/:itemId", adminController.showDetailItem);
router.post("/item/add/feature", upload, adminController.addFeature);
router.put("/item/update/feature", upload, adminController.editFeature);
router.delete("/item/:itemId/feature/:id", adminController.deleteFeature);
//router item feature
router.post("/item/add/activity", upload, adminController.addActivity);
router.put("/item/update/activity", upload, adminController.editActivity);
router.delete("/item/:itemId/activity/:id", adminController.deleteActivity);
// Booking
router.get("/booking", adminController.viewBooking);
router.get("/booking/:id", adminController.showDetailBooking);
router.put("/booking/:id/confirm", adminController.actionConfirmation);
router.put("/booking/:id/reject", adminController.actionReject);
// router.put("/booking/:id/reject", adminController.actionReject);

module.exports = router;
