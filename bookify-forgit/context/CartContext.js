// context/CartContext.js
import React, { createContext, useState, useContext } from "react";
import { Alert } from "react-native";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (book) => {
    const itemIndex = cartItems.findIndex((item) => item._id === book._id);
    if (itemIndex !== -1) {
      const updatedCart = [...cartItems];
      updatedCart[itemIndex].quantity += 1;
      setCartItems(updatedCart);
      Alert.alert("Quantity Increased", `${book.title} quantity updated.`);
    } else {
      setCartItems([...cartItems, { ...book, quantity: 1 }]);
      Alert.alert(
        "Added to Cart",
        `${book.title} has been added to your cart.`
      );
    }
  };

  const removeFromCart = (bookId) => {
    setCartItems(cartItems.filter((item) => item._id !== bookId));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
