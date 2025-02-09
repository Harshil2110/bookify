import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
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
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  return (
    <LinearGradient
      colors={["#6a11cb", "#2575fc"]}
      style={styles.gradientContainer}
    >
      <View style={styles.cardContainer}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={{
              uri: "https://raw.githubusercontent.com/anm27/bookStoreUpdated/refs/heads/main/assets/bookify.png",
            }}
            // source={require("../assets/bookify.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Error Message */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Input Fields */}
        <TextInput
          placeholder="Email"
          placeholderTextColor="#ccc"
          style={styles.inputField}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          style={styles.inputField}
          onChangeText={(text) => setPassword(text)}
        />

        {/* Loading Indicator */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#6a11cb" />
        ) : (
          // Login Button
          <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        )}

        {/* Registration Link */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerLink}>Click here to register!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    width: width * 0.85,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },
  errorText: {
    color: "#e74c3c",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
  inputField: {
    width: "100%",
    height: 50,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  loginButton: {
    backgroundColor: "#6a11cb",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  registerText: {
    fontSize: 14,
    color: "#555",
  },
  registerLink: {
    fontSize: 14,
    color: "#2575fc",
    fontWeight: "bold",
    marginLeft: 5,
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
