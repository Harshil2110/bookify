// HomeScreen.js
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
} from "react-native";
import tw from "twrnc";
import { SafeAreaView } from "react-native-safe-area-context";
import BookStoreComponent from "../components/BookStoreComponent";
import { CommonActions } from "@react-navigation/native";
import Header from "../components/Header";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
// import BookAgent from "../components/BookAgent";

const HomeScreen = ({ navigation, addToCart }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch books from the API based on category
  const fetchBooks = async (category) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://mtb.meratravelbuddy.com/api/books/${category}`
      );
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  // Open modal and fetch books for a specific category
  const openModal = (category) => {
    fetchBooks(category); // Fetch books based on the selected category
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const storedRole = await AsyncStorage.getItem("userRole");
        // console.log("Stored Role: ", storedRole);

        setRole(storedRole); // Set the role (worker or customer)
      } else {
        setUser(null);
        setRole(null);
        // Reset the navigation state to Login
        // navigation.navigate("Login");
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Login" }],
          })
        );
      }
    });
    return () => unsubscribe();
  }, []);

  const renderBookCard = ({ item }) => (
    <View style={tw`w-1/2 p-2`}>
      <View style={tw`bg-white rounded-lg p-3 shadow relative`}>
        <Image
          source={{ uri: item.imgLink }}
          style={tw`w-full h-40 rounded-lg`}
          resizeMode="cover"
        />
        <Text style={tw`text-lg font-bold mt-2`}>
          {item.title.length > 20
            ? `${item.title.slice(0, 20)}...`
            : item.title}
        </Text>
        <Text style={tw`text-green-600 font-semibold line-through`}>
          ${item.price}
        </Text>
        <Text style={tw`text-green-600 font-semibold`}>${item.price / 2}</Text>
        <View style={tw`flex-row justify-between mt-2`}>
          <TouchableOpacity onPress={() => addToCart(item)}>
            <FontAwesome name="cart-plus" size={24} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialIcons name="favorite-border" size={24} color="red" />
          </TouchableOpacity>
        </View>
        <View style={tw`absolute top-2 right-2 bg-green-700 p-2 rounded-lg`}>
          <Text style={tw`text-white text-base`}>50% Off</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={tw`bg-gray-600 h-full mt-22`}>
      <View style={tw`flex items-center justify-center`}>
        {user ? (
          <>
            <Header />
            <View
              style={tw`flex-row justify-between items-center w-full p-3 bg-gray-300`}
            >
              <TouchableOpacity
                style={tw`flex-column items-center`}
                // onPress={openModal}
                onPress={() => openModal("second-hand")}
              >
                <Entypo name="book" size={44} color="black" />
                <Text>2nd Hand Books</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`flex-column items-center`}
                // onPress={openModal}
                onPress={() => openModal("sci-fi")}
              >
                <MaterialIcons name="science" size={44} color="black" />
                <Text>Sci-fi Books</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`flex-column items-center`}
                // onPress={openModal}
                onPress={() => openModal("suspense")}
              >
                <Entypo name="open-book" size={44} color="black" />
                <Text>Suspense Books</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`flex-column items-center`}
                // onPress={openModal}
                onPress={() => openModal("thriller")}
              >
                <FontAwesome name="book" size={44} color="black" />
                <Text>Thriller Books</Text>
              </TouchableOpacity>
            </View>
            <View style={tw` p-4 gap-5`}>
              <BookStoreComponent addToCart={addToCart} />
            </View>

            {/* Modal for showing books */}

            <Modal
              visible={modalVisible}
              animationType="slide"
              onRequestClose={closeModal}
            >
              <SafeAreaView style={tw`flex-1 bg-white`}>
                <Header />
                <FlatList
                  data={books}
                  keyExtractor={(item) => item._id}
                  renderItem={renderBookCard}
                  numColumns={2}
                  contentContainerStyle={tw`p-4 gap-4`}
                  ListHeaderComponent={
                    <TouchableOpacity
                      style={tw`bg-red-500 p-2 rounded-lg w-24`}
                      onPress={closeModal}
                    >
                      <Text style={tw`text-white text-center`}>Close</Text>
                    </TouchableOpacity>
                  }
                  ListEmptyComponent={
                    <Text style={tw`text-center text-lg`}>
                      No books available
                    </Text>
                  }
                />
              </SafeAreaView>
            </Modal>
          </>
        ) : (
          <Text>Loading.........</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
