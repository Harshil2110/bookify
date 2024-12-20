import axios from "axios";
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import tw from "twrnc";

// const books = [
//   {
//     id: 1,
//     title: "The Origin of Species",
//     price: 19.99,
//     description: "A great book to read.",
//     image:
//       "https://cdn.shopify.com/s/files/1/0070/1884/0133/t/8/assets/pf-71b40b91--Books_1200x.jpg?v=1620061288",
//   },
//   {
//     id: 2,
//     title: "Harry Potter and the Sorcerers Stone",
//     price: 15.49,
//     description: "A bestseller and must-read.",
//     image:
//       "https://cdn.shopify.com/s/files/1/0070/1884/0133/t/8/assets/pf-b57dac15--Books8_1200x.jpg?v=1620061403",
//   },
//   {
//     id: 3,
//     title: "The Catcher in the Rye",
//     price: 12.99,
//     description: "An insightful and engaging story.",
//     image:
//       "https://cdn.shopify.com/s/files/1/0070/1884/0133/t/8/assets/pf-0b918a84--Books3_1200x.jpg?v=1620061361",
//   },
// ];

const BookCard = ({ book, addToCart }) => (
  <View style={tw`bg-white rounded-lg shadow-sm shadow-blue-600 p-4 w-60 mr-4`}>
    <Image
      source={{ uri: book.imgLink }}
      style={tw`w-full h-40 rounded-lg`}
      resizeMode="cover"
    />
    <Text style={tw`text-lg font-bold text-black mt-2 h-16`}>{book.title}</Text>
    <Text style={tw`text-green-600 text-lg font-semibold`}>${book.price}</Text>
    <Text style={tw`text-gray-600 text-sm mt-1`}>{book.description}</Text>
    <TouchableOpacity
      onPress={() => addToCart(book)}
      style={tw`mt-4 px-4 py-2 bg-blue-600 rounded`}
    >
      <Text style={tw`text-white text-center text-base`}>Add to Cart</Text>
    </TouchableOpacity>
  </View>
);

const BookSection = ({ title, books, addToCart }) => (
  <View style={tw`mb-6`}>
    <Text style={tw`text-black text-2xl font-bold mb-4`}>{title}</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {books.map((book) => (
        <BookCard key={book.id} book={book} addToCart={addToCart} />
      ))}
    </ScrollView>
  </View>
);

const BookStoreComponent = ({ addToCart }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://mtb.meratravelbuddy:5000/api/books/books")
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
    <ScrollView style={tw`flex p-2 gap-5 mb-30`}>
      <BookSection title="Trending" books={books} addToCart={addToCart} />
      <BookSection title="Featured" books={books} addToCart={addToCart} />
      <BookSection title="Bestselling" books={books} addToCart={addToCart} />
      <BookSection
        title="Other Categories"
        books={books}
        addToCart={addToCart}
      />
    </ScrollView>
  );
};

export default BookStoreComponent;
