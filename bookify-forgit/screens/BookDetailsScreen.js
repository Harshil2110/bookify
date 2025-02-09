import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import Header from "../components/Header";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useWishlist } from "../context/WishListContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BookDetailsScreen = ({ route, navigation }) => {
  const initialBook = route.params.book;
  const { addToCart } = route.params;
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist(); // Use Wishlist context

  const [bookDetails, setBookDetails] = useState(initialBook);
  const [userReview, setUserReview] = useState("");
  const [reviews, setReviews] = useState(initialBook.reviews || []);
  const [successMessage, setSuccessMessage] = useState("");

  const isWishlisted = wishlist.some((item) => item._id === bookDetails._id);

  const [storedUsername, setStoredUsername] = useState("");

  // Fetch updated book details (including reviews) when the component mounts.
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(
          `https://mtb.meratravelbuddy.com/api/books/${initialBook._id}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        // Check if the response has a JSON content type.
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await response.json();
          if (response.ok) {
            setBookDetails(data);
            setReviews(data.reviews);
          } else {
            console.error("Failed to fetch book details:", data.message);
          }
        } else {
          // If not JSON, log the text response.
          const textData = await response.text();
          console.error("Expected JSON, got:", textData);
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };
    fetchBookDetails();
  }, [initialBook._id]);

  useEffect(() => {
    // Load username from AsyncStorage
    const loadUsername = async () => {
      const savedUsername = await AsyncStorage.getItem("userName");
      if (savedUsername) {
        setStoredUsername(savedUsername);
        console.log("Username: ", storedUsername);
      }
    };
    loadUsername();
  }, []);

  // useEffect(() => {
  //   console.log("loadUsername useEffect triggered");
  //   const loadUsername = async () => {
  //     try {
  //       const savedUsername = await AsyncStorage.getItem("userName");
  //       console.log("Username: ", savedUsername);
  //       setStoredUsername(savedUsername);
  //     } catch (error) {
  //       console.error("Error loading username: ", error);
  //     }
  //   };
  //   loadUsername();
  // }, []);

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(bookDetails._id); // Remove from wishlist
    } else {
      addToWishlist(bookDetails); // Add to wishlist
    }
  };

  // Function to handle review submission.
  const handleSubmitReview = async () => {
    if (!userReview.trim()) return;

    try {
      const response = await fetch(
        `https://mtb.meratravelbuddy.com/api/books/${bookDetails._id}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            reviewText: userReview,
            reviewerName: storedUsername,
          }),
        }
      );
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (response.ok) {
          // Add the new review to the beginning of the reviews list.
          setReviews((prevReviews) => [data.review, ...prevReviews]);
          setUserReview("");
          setSuccessMessage("Review Submitted!");
          setTimeout(() => setSuccessMessage(""), 3000);
        } else {
          console.error("Failed to submit review:", data.message);
        }
      } else {
        const textData = await response.text();
        console.error("Expected JSON, got:", textData);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <>
      <SafeAreaView>
        <Header />
      </SafeAreaView>
      <ScrollView style={tw`flex-1`}>
        <View style={tw`p-6 bg-gray-100 flex-1`}>
          <Image
            source={{ uri: bookDetails.imgLink }}
            style={tw`w-full h-80 rounded-lg`}
            resizeMode="cover"
          />
          <Text style={tw`text-3xl font-bold mt-6`}>{bookDetails.title}</Text>
          <Text style={tw`text-green-600 text-2xl font-semibold mt-2`}>
            ${bookDetails.price}
          </Text>
          <Text style={tw`text-gray-600 text-base mt-4`}>
            {bookDetails.description}
          </Text>

          {/* --- New Review Input Section --- */}
          <View style={tw`mt-6 p-4 bg-white rounded-lg shadow`}>
            <Text style={tw`text-lg font-bold mb-2`}>Leave a Review</Text>
            <TextInput
              style={tw`border border-gray-300 p-2 rounded-lg`}
              placeholder="Write your review here..."
              value={userReview}
              onChangeText={setUserReview}
              multiline
            />
            <TouchableOpacity
              onPress={handleSubmitReview}
              style={tw`mt-2 bg-blue-600 p-2 rounded-lg`}
            >
              <Text style={tw`text-white text-center`}>Submit Review</Text>
            </TouchableOpacity>
            {/* Success Message */}
            {successMessage ? (
              <Text style={tw`mt-2 text-green-600 text-center`}>
                {successMessage}
              </Text>
            ) : null}
          </View>

          {/* Static Reviews Section */}
          <View style={styles.reviewsContainer}>
            <Text style={styles.reviewsTitle}>Reviews</Text>
            {reviews.length === 0 ? (
              <Text style={styles.reviewText}>
                No reviews yet. Be the first to review!
              </Text>
            ) : (
              reviews.map((review, index) => (
                <View key={index} style={styles.reviewItem}>
                  <Text style={styles.reviewerName}>
                    {review.reviewerName}:
                  </Text>
                  <Text style={styles.reviewText}>"{review.reviewText}"</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
      <View style={tw`absolute bottom-0`}>
        <View
          style={tw`flex-row w-full bg-white p-5 mt-4 justify-between items-center`}
        >
          {/* Add to Cart Icon */}
          <TouchableOpacity
            onPress={() => addToCart(bookDetails)}
            style={tw`mr-4`}
          >
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
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  reviewsContainer: {
    width: "100%",
    marginTop: 20,
    marginBottom: 80,
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

export default BookDetailsScreen;
