import React, { createContext, useState, useContext } from "react";
import { Alert } from "react-native";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const addToWishlist = (book) => {
    if (wishlist.some((item) => item._id === book._id)) {
      Alert.alert("Already in Wishlist", `${book.title} is already added.`);
      return;
    }
    setWishlist([...wishlist, book]); // Add the book to the wishlist
    Alert.alert("Added to Wishlist", `${book.title} has been added.`);
  };

  const removeFromWishlist = (bookId) => {
    setWishlist(wishlist.filter((item) => item._id !== bookId));
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
