import { createSlice } from "@reduxjs/toolkit";
export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    totalQuantity: 0,
    totalPrice: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;

      // Find item with matching _id and color
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item._id === newItem._id && item.color === newItem.color
      );

      if (existingItemIndex !== -1) {
        // ✅ If item exists, update quantity and totalItemPrice
        const existingItem = state.cartItems[existingItemIndex];
        existingItem.quantity += newItem.quantity;
        existingItem.totalItemPrice =
          existingItem.quantity * existingItem.price;
      } else {
        // ✅ Else, add as new item with totalItemPrice
        state.cartItems.push({
          ...newItem,
          totalItemPrice: newItem.quantity * newItem.price,
        });
      }

      // ✅ Always update total quantity and price
      state.totalQuantity += newItem.quantity;
      state.totalPrice += newItem.quantity * newItem.price;
    },
    removeFromCart: (state, action) => {
      const itemToRemove = action.payload;

      // Match both _id and color to uniquely identify the item
      const existingItemIndex = state.cartItems.findIndex(
        (item) =>
          item._id === itemToRemove._id && item.color === itemToRemove.color
      );

      if (existingItemIndex === -1) return;

      const existingItem = state.cartItems[existingItemIndex];

      // Decrease quantity and totalItemPrice
      existingItem.quantity -= itemToRemove.quantity;
      existingItem.totalItemPrice = existingItem.quantity * existingItem.price;

      // Update overall cart totals
      state.totalQuantity -= itemToRemove.quantity;
      state.totalPrice -= itemToRemove.price * itemToRemove.quantity;

      // If quantity drops to zero or less, remove item from cart
      if (existingItem.quantity <= 0) {
        state.cartItems.splice(existingItemIndex, 1);
      }
    },

    emptyCart: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addToCart, removeFromCart, emptyCart } = cartSlice.actions;
export default cartSlice.reducer;
