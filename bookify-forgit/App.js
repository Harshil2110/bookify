import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider } from "react-native-safe-area-context";
import tw from "twrnc";

// Screens
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import CartScreen from "./screens/CartScreen";
import ProfileScreen from "./screens/ProfileScreen";
import BookDetailsScreen from "./screens/BookDetailsScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  // Function to Add Items to Cart
  const addToCart = (book) => {
    const itemIndex = cartItems.findIndex((item) => item.id === book.id);
    if (itemIndex !== -1) {
      const updatedCart = [...cartItems];
      updatedCart[itemIndex].quantity += 1;
      setCartItems(updatedCart);
      alert("Quantity increased!");
    } else {
      setCartItems([...cartItems, { ...book, quantity: 1 }]);
      alert("Added to cart!");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userId");
        setUser(storedUser); // Set user if found
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="MainTabs">
            {(props) => (
              <MainTabs
                {...props}
                cartItems={cartItems}
                addToCart={addToCart}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="BookDetails" component={BookDetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// Tab Navigator for Main App Screens
function MainTabs({ cartItems, addToCart }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let label;
          if (route.name === "Home") label = "🏠";
          if (route.name === "Cart") label = "🛒";
          if (route.name === "Profile") label = "👤";
          return <Text style={{ color, fontSize: size }}>{label}</Text>;
        },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home">
        {(props) => <HomeScreen {...props} addToCart={addToCart} />}
      </Tab.Screen>

      <Tab.Screen name="Cart">
        {(props) => <CartScreen {...props} cartItems={cartItems} />}
      </Tab.Screen>

      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
