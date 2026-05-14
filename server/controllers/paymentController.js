const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');

// Initialize Razorpay
// We use placeholder values if env variables are not set yet
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_secret',
});

// POST /api/payment/create-order
const createOrder = async (req, res) => {
  const { amount } = req.body; // Amount expected in INR (Rupees)

  if (!amount) {
    return res.status(400).json({ message: "Amount is required" });
  }

  try {
    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_order_${req.user._id}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: "Failed to create Razorpay order" });
    }

    res.json({
      ...order,
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key'
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({ message: "Failed to create order. Ensure your Razorpay keys are correct." });
  }
};

// POST /api/payment/verify
const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_secret';
    
    // Create the expected signature
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const expectedSignature = shasum.digest('hex');

    // Compare signatures
    if (expectedSignature === razorpay_signature) {
      // Payment is authentic. Upgrade user to Premium.
      const user = await User.findById(req.user._id);
      user.isPremium = true;
      await user.save();

      return res.json({ 
        message: "Payment verified successfully",
        isPremium: true 
      });
    } else {
      return res.status(400).json({ message: "Invalid payment signature" });
    }
  } catch (error) {
    console.error("Razorpay verification error:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

// POST /api/payment/cancel
const cancelPremium = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.isPremium = false;
    await user.save();
    
    res.json({ message: "Premium status removed for testing.", isPremium: false });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove premium status" });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  cancelPremium
};
