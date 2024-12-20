import React from "react";
import { TouchableOpacity, Text, Alert } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions, useNavigation } from "@react-navigation/native";
import tw from "twrnc";

const LogoutButton = () => {
  const navigation = useNavigation(); // Use navigation hook

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase
      await AsyncStorage.clear(); // Clear AsyncStorage on logout

      // Reset the navigation state to Login
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      );

      Alert.alert("Logged Out!", "You have been logged out successfully.");
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Failed to log out. Please try again.");
    }
  };

  return (
    <TouchableOpacity
      onPress={handleLogout}
      style={tw`px-4 py-2 my-2 bg-red-500 text-white rounded hover:bg-red-600`}
    >
      <Text style={tw`text-white font-bold text-lg text-center`}>Logout</Text>
    </TouchableOpacity>
  );
};

export default LogoutButton;
