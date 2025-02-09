import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import tw from "twrnc";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { useWishlist } from "../context/WishListContext";

const BookCard = ({ book, addToCart }) => {
  const navigation = useNavigation();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist(); // Use Wishlist context
  const isWishlisted = wishlist.some((item) => item._id === book._id);

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(book._id); // Remove from wishlist
    } else {
      addToWishlist(book); // Add to wishlist
    }
  };

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("BookDetails", { book, addToCart })}
      style={tw`bg-white rounded-lg shadow-sm shadow-blue-600 p-4 w-60 mr-4`}
    >
      <Image
        source={{ uri: book.imgLink }}
        style={tw`w-full h-40 rounded-lg`}
        resizeMode="cover"
      />
      <Text style={tw`text-lg font-bold text-black mt-2`}>
        {book.title.length > 20 ? `${book.title.slice(0, 20)}...` : book.title}
      </Text>
      <Text style={tw`text-green-600 text-lg font-semibold`}>
        ${book.price}
      </Text>
      <Text style={tw`text-gray-600 text-sm mt-1`}>
        {book.description.length > 75
          ? `${book.description.slice(0, 75)}...`
          : book.description}
      </Text>
      <View style={tw`flex-row mt-4 justify-between items-center`}>
        {/* Add to Cart Icon */}
        <TouchableOpacity onPress={() => addToCart(book)} style={tw`mr-4`}>
          <Text>
            <Fontisto name="shopping-basket-add" size={28} color="black" />
          </Text>
        </TouchableOpacity>

        {/* Wishlist Icon */}
        <TouchableOpacity onPress={handleWishlistToggle}>
          <Text>
            <AntDesign
              name="heart"
              size={28}
              color={isWishlisted ? "#ef4444" : "#9ca3af"}
            />
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

// BookSection Component
const BookSection = ({ title, books, addToCart, navigation }) => (
  <View style={tw`mb-6`}>
    <View style={tw`flex-row justify-between items-center`}>
      <Text style={tw`text-white text-2xl font-bold mb-4`}>{title}</Text>
      <TouchableOpacity
        style={tw`mb-4`}
        onPress={() => navigation.navigate("All Books")}
      >
        <Text style={tw`text-white text-2xl font-bold`}>View All</Text>
      </TouchableOpacity>
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {books.map((book) => (
        <BookCard
          key={book._id}
          book={book}
          addToCart={addToCart}
          navigation={navigation}
        />
      ))}
    </ScrollView>
  </View>
);

// Main BookStoreComponent
const BookStoreComponent = ({ addToCart }) => {
  const navigation = useNavigation();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://mtb.meratravelbuddy.com/api/books/books")
      .then((response) => {
        setBooks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex p-2 gap-5 mb-64`}>
      <BookSection
        title="Trending"
        books={books}
        addToCart={addToCart}
        navigation={navigation}
      />
      <BookSection
        title="Featured"
        books={books}
        addToCart={addToCart}
        navigation={navigation}
      />
      <BookSection
        title="Bestselling"
        books={books}
        addToCart={addToCart}
        navigation={navigation}
      />
      <BookSection
        title="Other Categories"
        books={books}
        addToCart={addToCart}
        navigation={navigation}
      />
    </ScrollView>
  );
};

export default BookStoreComponent;
