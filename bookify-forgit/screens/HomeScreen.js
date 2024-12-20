// HomeScreen.js
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View } from "react-native";
import tw from "twrnc";
import { SafeAreaView } from "react-native-safe-area-context";
import BookStoreComponent from "../components/BookStoreComponent";
import { CommonActions } from "@react-navigation/native";
import Header from "../components/Header";

const HomeScreen = ({ navigation, addToCart }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  console.log("Role: ", role, "User :", user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const storedRole = await AsyncStorage.getItem("userRole");
        console.log("Stored Role: ", storedRole);

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

  return (
    <SafeAreaView style={tw`bg-green-50 h-full mt-11`}>
      <View style={tw`flex items-center justify-center`}>
        {user ? (
          <>
            <Header />
            <View style={tw` p-4 gap-5`}>
              <BookStoreComponent addToCart={addToCart} />
            </View>
          </>
        ) : (
          <Text>Loading.........</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
