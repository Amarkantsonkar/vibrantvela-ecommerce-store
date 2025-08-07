const router = require("express").Router();
const { verifyToken } = require("../middlewares/verifyToken");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductByName,
  blackListProduct,
  removeFromBlacklist,
} = require("../controllers/productController");
const upload = require("../middlewares/multer");

router.post(
  "/create-product",
  verifyToken,
  upload.array("images", 4),
  createProduct
);

router.put("/update-product/:id", verifyToken, updateProduct);
router.delete("/delete-product/:id", verifyToken, deleteProduct);
router.get("/get-products", getProducts);
router.get("/get-products-by-name/:name", getProductByName);
router.put("/blacklist-product/:id", verifyToken, blackListProduct);
router.put("/remove-from-blacklist/:id", verifyToken, removeFromBlacklist);

module.exports = router;
