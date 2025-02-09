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
import AllProductsScreen, { WishlistScreen } from "./screens/AllProductsScreen";
import { WishlistProvider } from "./context/WishListContext";
import { CartProvider } from "./context/CartContext";
import SearchedBookDetails from "./screens/SearchedBookDetails";
import BookAgent from "./components/BookAgent";
// import { WishlistProvider } from "./context/WishListContext";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  // Function to Add Items to Cart
  const addToCart = (book) => {
    const itemIndex = cartItems.findIndex((item) => item._id === book._id);
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

  // New function to remove items from the cart
  const removeFromCart = (book) => {
    const itemIndex = cartItems.findIndex((item) => item._id === book._id);
    if (itemIndex !== -1) {
      const updatedCart = [...cartItems];
      if (updatedCart[itemIndex].quantity > 1) {
        // Decrease quantity if more than one exists
        updatedCart[itemIndex].quantity -= 1;
      } else {
        // Remove the item if quantity is 1
        updatedCart.splice(itemIndex, 1);
      }
      setCartItems(updatedCart);
      alert("Item removed from cart!");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userId");
        if (storedUser) {
          setUser(storedUser); // Set user if found
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <CartProvider>
          <WishlistProvider>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="Wishlist" component={WishlistScreen} />
              <Stack.Screen name="MainTabs">
                {(props) => (
                  <MainTabs
                    {...props}
                    cartItems={cartItems}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="BookDetails" component={BookDetailsScreen} />
              <Stack.Screen
                name="SearchedBookDetails"
                component={SearchedBookDetails}
              />
            </Stack.Navigator>
          </WishlistProvider>
        </CartProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// Tab Navigator for Main App Screens
function MainTabs({ cartItems, addToCart, removeFromCart }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let labelStyle = { color, fontSize: size };
              let label;
              if (route.name === "Home") label = "🏠";
              if (route.name === "Cart") label = "🛒";
              if (route.name === "Profile") label = "👤";
              if (route.name === "All Books") label = "📦";
              if (route.name === "Wishlist") label = "❤️";
              if (route.name === "Agent") label = "🤖";
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
            {(props) => (
              <CartScreen
                {...props}
                cartItems={cartItems}
                removeFromCart={removeFromCart}
              />
            )}
          </Tab.Screen>

          <Tab.Screen name="Profile" component={ProfileScreen} />

          <Tab.Screen name="All Books">
            {(props) => <AllProductsScreen {...props} addToCart={addToCart} />}
          </Tab.Screen>

          {/* <Tab.Screen name="Wishlist" component={WishlistScreen} /> */}
          <Tab.Screen name="Wishlist">
            {(props) => <WishlistScreen {...props} addToCart={addToCart} />}
          </Tab.Screen>
          <Tab.Screen name="Agent" component={BookAgent} />
        </Tab.Navigator>
      </WishlistProvider>
    </CartProvider>
  );
}
