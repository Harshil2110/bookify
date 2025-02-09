import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { countries } from "../data/countries"; // Import the countries list

const CountryDropdown = ({ selectedCountry, setSelectedCountry }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectCountry = (country) => {
    setSelectedCountry(country.name);
    setIsDropdownOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* Selected country or placeholder */}
      <TouchableOpacity style={styles.dropdown} onPress={toggleDropdown}>
        <Text style={styles.selectedText}>
          {selectedCountry ? selectedCountry : "Select a country"}
        </Text>
      </TouchableOpacity>

      {/* Dropdown list */}
      {isDropdownOpen && (
        <View style={styles.dropdownListContainer}>
          <FlatList
            data={countries}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => selectCountry(item)}
              >
                <Text style={styles.itemText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default CountryDropdown;

const styles = StyleSheet.create({
  container: {
    // marginTop: 50,
    // paddingHorizontal: 10,
    marginBottom: 12,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  selectedText: {
    fontSize: 16,
  },
  dropdownListContainer: {
    position: "absolute", // Position it directly below the dropdown
    top: 50, // Adjust according to your dropdown's height
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 3,
    maxHeight: 250, // Limit dropdown height
    zIndex: 1,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
  },
});
