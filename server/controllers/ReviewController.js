const Product = require("../models/Product");
const Review = require("../models/Review");
const { ROLES } = require("../utils/contant");

// Create a new review
const createReview = async (req, res) => {
  if (req.role !== ROLES.user) {
    return res.status(401).json({ message: "Access denied" });
  }

  const userId = req.id;

  try {
    const { productId, review, rating } = req.body;

    const newReview = await Review.create({
      productId,
      review,
      userId,
      rating,
    });

    await newReview.populate("userId", "name");

    const product = await Product.findByIdAndUpdate(
      productId,
      { $push: { reviews: newReview._id } },
      { new: true }
    );

    if (product && typeof product.calculateRating === "function") {
      await product.calculateRating();
    }

    return res.status(201).json({
      success: true,
      message: "Thanks for the Review",
      data: newReview,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update a review
const updateReview = async (req, res) => {
  if (req.role !== ROLES.user) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    const { id } = req.params;
    const { updatedReview } = req.body;

    const review = await Review.findByIdAndUpdate(
      id,
      { review: updatedReview },
      { new: true }
    ).populate("userId", "name");

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Reply to a review
const replyReview = async (req, res) => {
  if (req.role !== ROLES.user) {
    return res.status(401).json({ message: "Access denied" });
  }

  const userId = req.id;
  const { id } = req.params;

  try {
    const { review } = req.body;

    const foundReview = await Review.findByIdAndUpdate(
      id,
      { $push: { replies: { userId, review } } },
      { new: true }
    )
      .populate("userId", "name")
      .populate("replies.userId", "name");

    if (!foundReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Reply added successfully",
      data: foundReview,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  if (req.role !== ROLES.user) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const product = await Product.findByIdAndUpdate(
      review.productId,
      { $pull: { reviews: review._id } },
      { new: true }
    );

    if (product && typeof product.calculateRating === "function") {
      await product.calculateRating();
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all reviews for a product
// Get all reviews for a product
const getReviews = async (req, res) => {
  try {
    const { id } = req.params;

    const reviews = await Review.find({ productId: id })
      .populate("userId", "name")
      .populate("replies.userId", "name");

    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: reviews,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {
  createReview,
  updateReview,
  replyReview,
  deleteReview,
  getReviews,
};
