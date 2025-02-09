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
import { createUserWithEmailAndPassword } from "firebase/auth";
import CountryDropdown from "../components/CountryDropdown";
import CustomDatePicker from "../components/CustomDatePicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState(null);
  const [dob, setDob] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (date) => {
    if (!date) return null; // Handle null cases
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
  };

  const handleSignup = async (e) => {
    setIsLoading(true);
    setError(null);

    e.preventDefault();

    console.log({
      name,
      email,
      password,
      phone,
      country,
      dob, // This should already be formatted as "YYYY-MM-DD"
    }); // Debugging
    try {
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
          phone,
          country,
          dob,
        }
      );

      // Store the user's name in AsyncStorage
      await AsyncStorage.setItem("userName", name);

      alert("Registration successful. Please login to order!");
      navigation.navigate("Login");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#ff7e5f", "#feb47b"]}
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
          placeholder="Name"
          style={styles.inputField}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          placeholder="Email"
          style={styles.inputField}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.inputField}
          onChangeText={(text) => setPassword(text)}
        />
        <TextInput
          placeholder="Phone Number"
          style={styles.inputField}
          keyboardType="phone-pad"
          onChangeText={(text) => setPhone(text)}
        />
        <CountryDropdown
          selectedCountry={country}
          // setSelectedCountry={setCountry}
          setSelectedCountry={(value) => {
            console.log("Selected country:", value); // Debugging
            setCountry(value);
          }}
        />
        <CustomDatePicker
          selectedDate={dob}
          // setSelectedDate={(date) => setDob(formatDate(date))}
          setSelectedDate={(value) => {
            console.log("Selected date:", value); // Debugging
            setDob(value);
          }}
        />

        <TouchableOpacity
          onPress={handleSignup}
          style={styles.registerButton}
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>Register</Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>Click here to login!</Text>
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
  registerButton: {
    backgroundColor: "#ff7e5f",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  loginText: {
    fontSize: 14,
    color: "#555",
  },
  loginLink: {
    fontSize: 14,
    color: "#feb47b",
    fontWeight: "bold",
    marginLeft: 5,
    textDecorationLine: "underline",
  },
});

export default RegisterScreen;
