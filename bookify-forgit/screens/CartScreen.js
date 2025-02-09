import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import Header from "../components/Header";

const CartScreen = ({ cartItems, removeFromCart }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState({
    houseNumber: "",
    area: "",
    directions: "",
  });
  const [storedAddress, setStoredAddress] = useState("");

  useEffect(() => {
    // Load stored address from AsyncStorage
    const loadAddress = async () => {
      const savedAddress = await AsyncStorage.getItem("userAddress");
      if (savedAddress) {
        setStoredAddress(savedAddress);
      }
    };
    loadAddress();
  }, []);

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!address.houseNumber) {
      Alert.alert("Error", "House/Flat/Block No. is required.");
      return;
    }

    // Save the new address to AsyncStorage
    await AsyncStorage.setItem("userAddress", JSON.stringify(address));
    setStoredAddress(JSON.stringify(address));
    setModalVisible(false);

    // Simulate order confirmation
    Alert.alert(
      "Order Placed",
      "Your order has been placed successfully. Cash on delivery."
    );
  };

  const openModal = () => {
    setAddress(storedAddress || "");
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={tw`h-full`}>
      <Header />

      <View style={tw`flex-1 p-4 bg-gray-600`}>
        <Text style={tw`text-2xl font-bold mb-4 text-white`}>My Cart</Text>

        <ScrollView style={tw`flex-1 mb-24`}>
          {cartItems.length === 0 ? (
            <Text style={tw`text-lg text-white`}>Your cart is empty.</Text>
          ) : (
            cartItems.map((item, index) => (
              <View
                key={`${item._id}_${index}`}
                style={tw`bg-white rounded-lg shadow-sm p-4 mb-4 flex-row items-center`}
              >
                <Image
                  source={{ uri: item.imgLink }}
                  style={tw`w-24 h-24 rounded-lg`}
                  resizeMode="cover"
                />
                <View style={tw`ml-4 flex-1`}>
                  <Text style={tw`text-lg font-bold`}>{item.title}</Text>
                  <Text style={tw`text-green-600 font-semibold`}>
                    ₹{item.price} x {item.quantity}
                  </Text>
                  <Text style={tw`text-gray-600 mt-1`}>
                    Total: ₹{item.price * item.quantity}
                  </Text>
                </View>
                {/* Remove Button */}
                <TouchableOpacity
                  onPress={() => removeFromCart(item)}
                  style={tw`bg-red-600 p-2 rounded-lg`}
                >
                  <Text style={tw`text-white font-bold`}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>

        {/* Footer Section */}
        {cartItems.length > 0 && (
          <View style={tw`p-4 bg-white`}>
            <View style={tw`mb-4`}>
              <Text style={tw`text-xl font-bold`}>
                Total: ₹{calculateTotal().toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity
              style={tw`bg-green-600 p-4 rounded-lg`}
              onPress={openModal}
            >
              <Text style={tw`text-xl font-bold text-center text-white`}>
                Proceed to Checkout
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Address Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
        >
          <View style={tw`bg-white p-6 rounded-lg w-4/5`}>
            <Text style={tw`text-xl font-bold mb-4 underline`}>
              Add or Select Address
            </Text>

            <Text style={tw`text-lg font-semibold mb-2`}>First Name</Text>
            <TextInput
              style={tw`border p-3 rounded-lg mb-4`}
              placeholder="First Name"
            />

            <Text style={tw`text-lg font-semibold mb-2`}>Last Name</Text>
            <TextInput
              style={tw`border p-3 rounded-lg mb-4`}
              placeholder="Last Name"
            />

            <Text style={tw`text-lg font-semibold mb-2`}>Mobile Number</Text>
            <TextInput
              style={tw`border p-3 rounded-lg mb-4`}
              placeholder="Mobile Number"
              keyboardType="phone-pad"
            />

            {/* House/Flat/Block No. (Required) */}
            <Text style={tw`text-lg font-semibold mb-2`}>
              House/Flat/Block No.
            </Text>
            <TextInput
              style={tw`border p-3 rounded-lg mb-4`}
              placeholder="Enter your house/flat/block number"
              value={address.houseNumber}
              onChangeText={(text) =>
                setAddress((prev) => ({ ...prev, houseNumber: text }))
              }
            />

            {/* Apartment/Road/Area (Optional) */}
            <Text style={tw`text-lg font-semibold mb-2`}>
              Apartment/Road/Area (Optional)
            </Text>
            <TextInput
              style={tw`border p-3 rounded-lg mb-4`}
              placeholder="Enter apartment/road/area"
              value={address.area}
              onChangeText={(text) =>
                setAddress((prev) => ({ ...prev, area: text }))
              }
            />

            {/* Directions to Reach (Optional) */}
            <Text style={tw`text-lg font-semibold mb-2`}>
              Directions to Reach (Optional)
            </Text>
            <TextInput
              style={tw`border p-3 rounded-lg mb-4`}
              placeholder="Enter directions to reach"
              value={address.directions}
              onChangeText={(text) =>
                setAddress((prev) => ({ ...prev, directions: text }))
              }
            />

            {/* Use Saved Address */}
            {storedAddress && (
              <TouchableOpacity
                style={tw`mb-4`}
                onPress={() => setAddress(JSON.parse(storedAddress))}
              >
                <Text style={tw`text-blue-500 font-semibold mb-1`}>
                  Use Saved Address:
                </Text>
                <Text style={tw`text-gray-600 border border-gray-400`}>
                  {(() => {
                    const parsedAddress = JSON.parse(storedAddress);
                    return `
                      House/Flat/Block No: ${parsedAddress.houseNumber || "N/A"}
                      Apartment/Road/Area: ${parsedAddress.area || "N/A"}
                      Directions: ${parsedAddress.directions || "N/A"}
                    `;
                  })()}
                </Text>
              </TouchableOpacity>
            )}

            {/* Confirm and Cancel Buttons */}
            <View style={tw`flex-row justify-between`}>
              <TouchableOpacity
                style={tw`bg-green-600 p-3 rounded-lg`}
                onPress={handlePlaceOrder}
              >
                <Text style={tw`text-white text-center font-bold`}>
                  Confirm Order
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-red-600 p-3 rounded-lg`}
                onPress={() => setModalVisible(false)}
              >
                <Text style={tw`text-white text-center font-bold`}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CartScreen;
