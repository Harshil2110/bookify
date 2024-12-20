import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import Header from "../components/Header";

const CartScreen = ({ cartItems }) => {
  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <SafeAreaView style={tw`h-full`}>
      <Header />

      <View style={tw`flex-1 p-4 bg-gray-100`}>
        <Text style={tw`text-2xl font-bold mb-4`}>Your Cart</Text>

        <ScrollView style={tw`flex-1 mb-24`}>
          {cartItems.length === 0 ? (
            <Text style={tw`text-lg text-gray-600`}>Your cart is empty.</Text>
          ) : (
            cartItems.map((item) => (
              <View
                key={item.id}
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
                    ${item.price} x {item.quantity}
                  </Text>
                  <Text style={tw`text-gray-600 mt-1`}>
                    Total: ${item.price * item.quantity}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* Footer Section */}
        {cartItems.length > 0 && (
          <View style={tw`p-4 bg-white`}>
            <View style={tw`mb-4`}>
              <Text style={tw`text-xl font-bold`}>
                Total: ${calculateTotal().toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity style={tw`bg-green-600 p-4 rounded-lg`}>
              <Text style={tw`text-xl font-bold text-center text-white`}>
                Proceed to Checkout
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CartScreen;
