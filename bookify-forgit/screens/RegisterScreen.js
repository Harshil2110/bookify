import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import tw from "twrnc";
import axios from "axios";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save user info to MongoDB
      const response = await axios.post(
        "https://mtb.meratravelbuddy.com/signup",
        {
          name,
          email: user.email,
          password,
          // role, // Send the role (customer or worker) to MongoDB
        }
      );

      alert("Registration successful. Please login to order!");
      navigation.navigate("Login");
    } catch (err) {
      setError(err.message);
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
            type="text"
            placeholder="Name"
            style={tw`w-full p-2 mb-4 text-lg border rounded`}
            onChangeText={(text) => setName(text)}
          />
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
            onPress={handleSignup}
            style={tw`px-4 py-2 bg-blue-600 rounded`}
          >
            <Text style={tw`text-white text-center text-lg`}>Register</Text>
          </TouchableOpacity>
          <View style={tw`flex-row gap-2 justify-start items-center mt-2`}>
            <Text style={tw`text-base`}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text
                style={tw`text-green-700 font-semibold underline text-base`}
              >
                Click here to login!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RegisterScreen;
