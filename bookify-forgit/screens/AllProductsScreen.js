import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Pressable,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import tw from "twrnc";
import { useWishlist } from "../context/WishListContext";

// Main Component
const AllProductsScreen = ({ navigation, addToCart }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  // const [wishlist, setWishlist] = useState([]);
  const { addToWishlist } = useWishlist();

  // Fetch books from the API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          "https://mtb.meratravelbuddy.com/api/books/books"
        );
        const data = await response.json();
        setBooks(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleAddToWishlist = (book) => {
    addToWishlist(book); // Call the context function
    setModalVisible(false); // Close the modal
  };

  // Open modal with selected book details
  const openModal = (book) => {
    setSelectedBook(book);
    setModalVisible(true);
  };

  // Render a single book item
  const renderBook = ({ item }) => (
    <Pressable onPress={() => openModal(item)} style={styles.card}>
      <Image source={{ uri: item.imgLink }} style={styles.bookImage} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>Price: ₹{item.price}</Text>
        <Text>
          {item.description.length > 150
            ? `${item.description.slice(0, 150)}...`
            : item.description}
        </Text>
        <TouchableOpacity
          style={tw`bg-blue-500 w-1/2 rounded-md py-1`}
          onPress={() => addToCart(item)}
        >
          <Text style={tw`text-white text-center font-bold text-lg`}>
            Add to Cart
          </Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading Books...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`bg-gray-600`}>
      {/* Header */}
      <Header />

      {/* FlatList of Books */}
      <FlatList
        data={books}
        renderItem={renderBook}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal for Book Details */}
      {selectedBook && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Image
                source={{ uri: selectedBook.imgLink }}
                style={styles.modalImage}
              />
              <Text style={styles.modalTitle}>{selectedBook.title}</Text>
              <Text style={styles.modalPrice}>
                Price: ₹{selectedBook.price}
              </Text>
              <Text style={styles.modalDescription}>
                {selectedBook.description}
              </Text>

              {/* Static Reviews Section */}
              <View style={styles.reviewsContainer}>
                <Text style={styles.reviewsTitle}>Reviews</Text>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewerName}>John Doe:</Text>
                  <Text style={styles.reviewText}>
                    "Amazing book! Highly recommend to everyone."
                  </Text>
                </View>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewerName}>Jane Smith:</Text>
                  <Text style={styles.reviewText}>
                    "A truly captivating story with great lessons."
                  </Text>
                </View>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewerName}>Alex Johnson:</Text>
                  <Text style={styles.reviewText}>
                    "Good read, but a bit slow in the middle chapters."
                  </Text>
                </View>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewerName}>Emily Davis:</Text>
                  <Text style={styles.reviewText}>
                    "The best book I've read this year. Highly recommended!"
                  </Text>
                </View>
              </View>

              <View style={tw`flex-row justify-between w-full`}>
                <Pressable
                  style={styles.addToWishlistButton}
                  // onPress={() => addToWishlist(selectedBook)}
                  onPress={() => handleAddToWishlist(selectedBook)}
                >
                  <Text style={styles.addToWishlistText}>Add to Wishlist</Text>
                </Pressable>
                <Pressable onPress={() => setModalVisible(false)}>
                  <Text
                    style={tw`text-black bg-blue-600 text-white p-2 font-semibold rounded-md text-base`}
                  >
                    Close
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

// Wishlist Screen
export const WishlistScreen = ({ addToCart }) => {
  // const { wishlist } = route.params;
  const { wishlist } = useWishlist();

  const renderWishlistItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imgLink }} style={styles.bookImage} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>Price: ₹{item.price}</Text>
        <Text>
          {item.description.length > 100
            ? `${item.description.slice(0, 100)}...`
            : item.description}
        </Text>
        <TouchableOpacity
          style={tw`bg-green-500 p-2 mt-1 rounded-md`}
          onPress={() => addToCart(item)}
        >
          <Text style={tw`text-center font-bold text-white`}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={tw`bg-gray-600 h-full`}>
      <Header />
      <Text style={styles.header}>My Wishlist ❤️</Text>
      <FlatList
        data={wishlist}
        renderItem={renderWishlistItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // safeArea: {
  //   flex: 1,
  //   backgroundColor: "#F3F4F6",
  // },
  headerContainer: {
    backgroundColor: "#2196F3",
    padding: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    color: "#ffffff",
    margin: 11,
    marginTop: 18,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 15,
    elevation: 3,
    flexDirection: "row",
    overflow: "hidden",
  },
  bookImage: {
    width: 100,
    height: "100%",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  textContainer: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F57C00",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
    color: "#2196F3",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalImage: {
    width: 150,
    height: 200,
    marginBottom: 15,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 10,
  },
  modalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F57C00",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    color: "#757575",
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  wishlistButton: {
    backgroundColor: "#FF5722",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 10,
  },
  wishlistText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  addToWishlistButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  addToWishlistText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  reviewsContainer: {
    width: "100%",
    marginTop: 20,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  reviewItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 8,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },
  reviewText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});

export default AllProductsScreen;
