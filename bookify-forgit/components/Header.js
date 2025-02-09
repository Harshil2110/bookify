import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
} from "react-native";
import tw from "twrnc";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "../context/CartContext";

const Header = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState([]); // To store books data fetched from API
  const [filteredBooks, setFilteredBooks] = useState([]);

  const navigation = useNavigation();

  const { addToCart } = useCart();

  // Animation reference
  const bounceAnim = useRef(new Animated.Value(0)).current;

  // Fetch books data from the API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          "https://mtb.meratravelbuddy.com/api/books/books"
        );
        const data = await response.json();
        // console.log("Fetched Data:", data);
        setBooks(data); // Assuming API response is an array of books
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  // Handle Search
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = books.filter((book) =>
        book.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks([]);
    }
  };

  // Start bounce animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [bounceAnim]);

  return (
    <View>
      <View
        style={tw`p-6 flex-row w-full justify-between items-center bg-white rounded`}
      >
        <Image
          source={{
            uri: "https://raw.githubusercontent.com/anm27/bookStoreUpdated/refs/heads/main/assets/bookify-horizontal.png",
          }}
          // source={require("../assets/bookify-horizontal.png")}
          style={tw`w-60 h-10`}
          resizeMode="contain"
        />

        {/* Search Emoji with Animation */}
        <TouchableOpacity onPress={() => setSearchVisible(true)}>
          <Animated.Text
            style={[
              tw`text-3xl`,
              {
                transform: [{ translateY: bounceAnim }],
              },
            ]}
          >
            🔍
          </Animated.Text>
        </TouchableOpacity>
      </View>

      {/* Search Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={searchVisible}
        onRequestClose={() => setSearchVisible(false)}
      >
        <BlurView intensity={80} style={styles.fullScreen}>
          <View style={styles.searchContainer}>
            <Text style={tw`text-2xl font-bold mb-4`}>Search Books</Text>

            {/* Search Input */}
            <TextInput
              placeholder="Search for books..."
              style={tw`w-full p-4 mb-4 border rounded text-lg`}
              value={searchQuery}
              onChangeText={handleSearch}
            />

            {/* Search Results */}
            <ScrollView>
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <TouchableOpacity
                    key={book._id}
                    onPress={() => {
                      setSearchVisible(false); // Close Search Modal
                      navigation.navigate("SearchedBookDetails", {
                        book,
                        addToCart,
                      });
                    }}
                  >
                    <Text style={tw`p-4 text-lg border-b border-gray-300`}>
                      {book.title}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={tw`text-gray-500 text-center mt-6`}>
                  No books found.
                </Text>
              )}
            </ScrollView>

            {/* Close Button */}
            <TouchableOpacity
              style={tw`mt-6 px-6 py-3 bg-red-600 rounded`}
              onPress={() => setSearchVisible(false)}
            >
              <Text style={tw`text-white text-lg font-bold text-center`}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    width: "90%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default Header;
