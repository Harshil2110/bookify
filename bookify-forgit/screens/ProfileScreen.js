import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import LogoutButton from "../components/LogoutButton";
import tw from "twrnc";
import Header from "../components/Header";
import { onAuthStateChanged } from "firebase/auth";
import { CommonActions } from "@react-navigation/native";
import { auth } from "../firebase";

const ProfileScreen = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
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

  return (
    <SafeAreaView>
      {user ? (
        <View style={tw`relative h-full`}>
          <Header />
          <View>
            <Text style={tw`text-2xl p-2 font-bold text-green-700`}>
              Welcome, {user.email}
            </Text>
          </View>
          <View style={tw`absolute bottom-0 left-2`}>
            <LogoutButton />
          </View>
        </View>
      ) : (
        <Text>Loading.........</Text>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;
