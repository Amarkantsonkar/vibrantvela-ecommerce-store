const mongoose = require("mongoose");
const Review = require("./Review");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "All",
        "Mouse",
        "Keyboard",
        "Headphones",
        "Sneakers",
        "Phone Chargers",
        "Power Banks",
        "Mobile Cases",
        "Trimmers",
        "Yoga Mats",
        "Office Chairs",
        "Printed T-Shirts",
        "Hoodies",
        "Notebooks",
        "Pet Toys",
      ],
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    images: {
      type: Array,
      required: true,
    },
    rating: {
      type: Number,
      default: 5,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    colors: {
      type: Array,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// calculate average rating

productSchema.methods.calculateRating = async function () {
  const reviews = await Review.find({ productId: this._id });

  if (reviews.length > 0) {
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating = totalRating / reviews.length;
  } else {
    this.rating = 5; // Default rating if no reviews
  }

  await this.save();
};

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
