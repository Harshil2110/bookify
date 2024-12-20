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

// Sample Books Data for Searching
const books = [
  {
    id: 1,
    title: "The Origin of Species",
    price: 19.99,
    description: "A great book to read.",
    image:
      "https://cdn.shopify.com/s/files/1/0070/1884/0133/t/8/assets/pf-71b40b91--Books_1200x.jpg?v=1620061288",
  },
  {
    id: 2,
    title: "Harry Potter and the Sorcerer's Stone",
    price: 15.49,
    description: "A bestseller and must-read.",
    image:
      "https://cdn.shopify.com/s/files/1/0070/1884/0133/t/8/assets/pf-b57dac15--Books8_1200x.jpg?v=1620061403",
  },
  {
    id: 3,
    title: "The Catcher in the Rye",
    price: 12.99,
    description: "An insightful and engaging story.",
    image:
      "https://cdn.shopify.com/s/files/1/0070/1884/0133/t/8/assets/pf-0b918a84--Books3_1200x.jpg?v=1620061361",
  },
];

const Header = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);

  const navigation = useNavigation();

  // Animation reference
  const bounceAnim = useRef(new Animated.Value(0)).current;

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
            uri: "https://meratravelbuddy.com/bookify/img/bookify-horizontal.png",
          }}
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
                    key={book.id}
                    onPress={() => {
                      setSearchVisible(false); // Close Search Modal
                      navigation.navigate("BookDetails", { book });
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
