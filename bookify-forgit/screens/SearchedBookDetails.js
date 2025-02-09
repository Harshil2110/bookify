import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import Header from "../components/Header";

const SearchedBookDetails = ({ route, navigation }) => {
  const { book } = route.params;

  return (
    <>
      <SafeAreaView>
        <Header />
      </SafeAreaView>
      <View style={tw`p-6 bg-gray-100 flex-1`}>
        <Image
          source={{ uri: book.imgLink }}
          style={tw`w-full h-80 rounded-lg`}
          resizeMode="cover"
        />
        <Text style={tw`text-3xl font-bold mt-6`}>{book.title}</Text>
        <Text style={tw`text-green-600 text-2xl font-semibold mt-2`}>
          ${book.price}
        </Text>
        <Text style={tw`text-gray-600 text-base mt-4`}>{book.description}</Text>

        <TouchableOpacity
          style={tw`mt-8 px-6 py-4 bg-blue-600 rounded-lg`}
          //   onPress={() => addToCart(book)}
        >
          <Text style={tw`text-white text-center text-lg font-bold`}>
            Add to Cart
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`mt-4 px-6 py-3 bg-red-500 rounded-lg`}
          onPress={() => navigation.goBack()}
        >
          <Text style={tw`text-white text-center text-lg font-bold`}>
            Back to Search
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default SearchedBookDetails;
