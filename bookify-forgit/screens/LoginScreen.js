import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import tw from "twrnc";
import axios from "axios";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user; // Firebase user

      const { data } = await axios.get(
        `https://mtb.meratravelbuddy.com/user-role/${email}`
      );

      if (data && data.user) {
        await AsyncStorage.setItem("userId", data.user._id);

        // Reset stack and navigate to the main screen
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "MainTabs" }],
          })
        );
      } else {
        setError("User not found. Please check your email.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <View
      style={tw`flex flex-col items-center justify-center h-full bg-gray-100`}
    >
      <View style={tw`bg-white w-4/5 lg:w-1/4 p-6 rounded-md py-8`}>
        {/* Container for the Image */}
        <View style={tw`flex-row items-center justify-center w-full mb-6`}>
          <Image
            source={{
              uri: "https://meratravelbuddy.com/bookify/img/bookify.png",
            }}
            style={tw`w-40 h-40`}
            resizeMode="contain"
          />
        </View>
        {error && <Text style={tw`text-red-500`}>{error}</Text>}
        <View>
          <TextInput
            placeholder="Email"
            style={tw`w-full p-2 mb-4 text-lg border rounded`}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={tw`w-full p-2 mb-4 text-lg border rounded`}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity
            onPress={handleLogin}
            style={tw`px-4 py-2 bg-green-600 rounded`}
          >
            <Text style={tw`text-white text-center text-lg`}>Login</Text>
          </TouchableOpacity>
          <View style={tw`flex-row gap-2 justify-start items-center mt-2`}>
            <Text style={tw`text-base`}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={tw`text-blue-700 font-semibold underline text-base`}>
                Click here to register!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
