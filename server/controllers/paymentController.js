const Razorpay = require("razorpay");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const crypto = require("crypto");

var {
  validatePaymentVerification,
} = require("razorpay/dist/utils/razorpay-utils");

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const generatePayment = async (req, res) => {
  const userId = req.id;

  try {
    const { amount } = req.body;
    
    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid amount" 
      });
    }

    const options = {
      amount: amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      receipt: Math.random().toString(36).substring(2),
    };

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    instance.orders.create(options, async (err, order) => {
      if (err) {
        console.error("Razorpay order creation error:", err);
        return res.status(500).json({ 
          success: false, 
          message: "Payment order creation failed",
          error: err.message 
        });
      }
      return res.status(200).json({
        success: true,
        message: "Payment order created successfully",
        data: {
          ...order,
          name: user.name,
        },
      });
    });
  } catch (error) {
    console.error("Generate payment error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Payment generation failed",
      error: error.message 
    });
  }
};

const verifyPayment = async (req, res) => {
  const userId = req.id;

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      amount,
      productArray,
      address,
    } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !amount || !productArray || !address) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment details"
      });
    }

    // Generate signature
    const signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Validate payment
    const validatedPayment = validatePaymentVerification(
      { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
      signature,
      process.env.RAZORPAY_KEY_SECRET
    );

    if (!validatedPayment) {
      return res.status(400).json({ 
        success: false, 
        message: "Payment verification failed" 
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update user's purchased products and product stock
    for (const product of productArray) {
      // Check if product exists and has sufficient stock
      const productDoc = await Product.findById(product.id);
      if (!productDoc) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${product.id} not found`
        });
      }

      if (productDoc.stock < product.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product ${productDoc.name}`
        });
      }

      // Update user's purchased products
      await User.findByIdAndUpdate(
        { _id: userId },
        { $push: { purchasedProducts: product.id } }
      );

      // Update product stock
      await Product.findByIdAndUpdate(
        { _id: product.id },
        { $inc: { stock: -product.quantity } }
      );
    }

    // Create order record
    const order = await Order.create({
      amount: amount / 100,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: signature,
      products: productArray,
      address: address,
      userId: userId,
    });

    return res.status(200).json({ 
      success: true, 
      message: "Payment verified successfully",
      data: {
        orderId: order._id,
        message: "Payment verified successfully"
      }
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Payment verification failed",
      error: error.message 
    });
  }
};

module.exports = { generatePayment, verifyPayment };