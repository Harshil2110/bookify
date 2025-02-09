import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

const generateDays = () => Array.from({ length: 31 }, (_, i) => i + 1);
const generateMonths = () => [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const generateYears = () =>
  Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

const CustomDatePicker = ({ selectedDate, setSelectedDate }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const [showDayDropdown, setShowDayDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const toggleDropdown = (type) => {
    if (type === "day") setShowDayDropdown(!showDayDropdown);
    else if (type === "month") setShowMonthDropdown(!showMonthDropdown);
    else if (type === "year") setShowYearDropdown(!showYearDropdown);
  };

  const selectValue = (type, value) => {
    if (type === "day") setSelectedDay(value);
    else if (type === "month") setSelectedMonth(value);
    else if (type === "year") setSelectedYear(value);

    // Calculate and format the full date when all values are selected
    const day = type === "day" ? value : selectedDay;
    const month =
      type === "month" ? generateMonths().indexOf(value) + 1 : selectedMonth;
    const year = type === "year" ? value : selectedYear;

    if (day && month && year) {
      const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
      // console.log("Formatted date:", formattedDate); // Debugging
      setSelectedDate(formattedDate); // Pass the formatted date to the parent
    }

    setShowDayDropdown(false);
    setShowMonthDropdown(false);
    setShowYearDropdown(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Date of Birth</Text>
      <View style={styles.row}>
        {/* Day Dropdown */}
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => toggleDropdown("day")}
        >
          <Text style={styles.selectedText}>
            {selectedDay ? selectedDay : "Day"}
          </Text>
        </TouchableOpacity>
        {showDayDropdown && (
          <View style={styles.dropdownListContainer}>
            <FlatList
              data={generateDays()}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => selectValue("day", item)}
                >
                  <Text style={styles.itemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Month Dropdown */}
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => toggleDropdown("month")}
        >
          <Text style={styles.selectedText}>
            {selectedMonth ? selectedMonth : "Month"}
          </Text>
        </TouchableOpacity>
        {showMonthDropdown && (
          <View style={styles.dropdownListContainer}>
            <FlatList
              data={generateMonths()}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => selectValue("month", item)}
                >
                  <Text style={styles.itemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Year Dropdown */}
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => toggleDropdown("year")}
        >
          <Text style={styles.selectedText}>
            {selectedYear ? selectedYear : "Year"}
          </Text>
        </TouchableOpacity>
        {showYearDropdown && (
          <View style={styles.dropdownListContainer}>
            <FlatList
              data={generateYears()}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => selectValue("year", item)}
                >
                  <Text style={styles.itemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      <Text style={styles.result}>
        Selected DOB: {selectedDate ? selectedDate : "Not selected"}
      </Text>
    </View>
  );
};

export default CustomDatePicker;

const styles = StyleSheet.create({
  container: {
    // marginTop: 50,
    // paddingHorizontal: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
    width: "30%", // Adjust width for day, month, year
  },
  selectedText: {
    fontSize: 16,
  },
  dropdownListContainer: {
    position: "absolute",
    top: 50,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 3,
    maxHeight: 150, // Limit dropdown height
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
  result: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
    fontStyle: "italic",
  },
});
