import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LogoutButton from "../components/LogoutButton";
import tw from "twrnc";
import Header from "../components/Header";
import { onAuthStateChanged } from "firebase/auth";
import { CommonActions } from "@react-navigation/native";
import { auth } from "../firebase";

const getOrdinalSuffix = (day) => {
  const j = day % 10,
    k = day % 100;
  if (j === 1 && k !== 11) return day + "st";
  if (j === 2 && k !== 12) return day + "nd";
  if (j === 3 && k !== 13) return day + "rd";
  return day + "th";
};

const formatDob = (dob) => {
  if (!dob) return "";
  const date = new Date(dob);
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.toLocaleString("en-US", { month: "short" });
  return `${getOrdinalSuffix(day)} ${month}, ${year}`;
};

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch stored name and mobile number on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedName = await AsyncStorage.getItem("fullName");
        const storedMobile = await AsyncStorage.getItem("mobileNumber");

        if (storedName) setFullName(storedName);
        if (storedMobile) setMobileNumber(storedMobile);
      } catch (error) {
        console.error("Error fetching data from AsyncStorage:", error);
      }
    };

    fetchData();
  }, []);

  // Fetch user data from backend by email
  const fetchUserData = async (email) => {
    try {
      const response = await fetch(
        `https://mtb.meratravelbuddy.com/user-by-email/${email}`
      );
      const data = await response.json();

      if (response.ok) {
        setUserData(data.user); // Set the user data from response
        setLoading(false);
      } else {
        setLoading(false);
        Alert.alert("Error", data.message || "User not found.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching user data:", error);
      Alert.alert("Error", "Failed to fetch user data.");
    }
  };

  // Handle saving/updating details
  const handleSaveDetails = async () => {
    if (!fullName || !mobileNumber) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }

    try {
      await AsyncStorage.setItem("fullName", fullName);
      await AsyncStorage.setItem("mobileNumber", mobileNumber);
      Alert.alert("Success", "Details updated successfully.");
    } catch (error) {
      console.error("Error saving to AsyncStorage:", error);
      Alert.alert("Error", "Failed to save details. Please try again.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserData(currentUser.email);
      } else {
        setUser(null);

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

  // Function to format DOB into a readable format
  // const formatDob = (dob) => {
  //   const date = new Date(dob);
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   return date.toLocaleDateString(undefined, options);
  // };

  return (
    <SafeAreaView>
      {user ? (
        <View style={tw`relative h-full bg-gray-600`}>
          <Header />
          <View>
            <Text style={tw`text-2xl p-2 font-bold text-cyan-300`}>
              Welcome, {user.email}
            </Text>
          </View>

          {/* Displaying user details */}
          {loading ? (
            <Text>Loading user data...</Text>
          ) : (
            <View style={tw`p-4`}>
              <Text style={tw`text-lg font-bold mb-2 text-white`}>
                Full Name
              </Text>
              <Text style={tw`bg-gray-200 p-2 rounded-lg mb-4`}>
                {userData?.name}
              </Text>

              <Text style={tw`text-lg font-bold mb-2 text-white`}>
                Mobile Number
              </Text>
              <Text style={tw`bg-gray-200 p-2 rounded-lg mb-4`}>
                {userData?.phone}
              </Text>

              <Text style={tw`text-lg font-bold mb-2 text-white`}>
                Date of Birth
              </Text>
              <Text style={tw`bg-gray-200 p-2 rounded-lg mb-4`}>
                {formatDob(userData?.dob)}
              </Text>

              <Text style={tw`text-lg font-bold mb-2 text-white`}>Age</Text>
              <Text style={tw`bg-gray-200 p-2 rounded-lg mb-4`}>
                {userData?.age} years
              </Text>

              <Text style={tw`text-lg font-bold mb-2 text-white`}>Country</Text>
              <Text style={tw`bg-gray-200 p-2 rounded-lg mb-4`}>
                {userData?.country}
              </Text>

              <Text style={tw`text-2xl font-bold mb-2 text-cyan-300 mt-5`}>
                My Orders
              </Text>
              <Text style={tw`text-center p-2 mb-4 text-white`}>
                You haven't ordered yet! Continue shopping...
              </Text>
            </View>
          )}

          <View style={tw`absolute bottom-0 left-2`}>
            <LogoutButton />
          </View>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;
