import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import Header from "./Header";
import tw from "twrnc";

const BookAgent = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const userMessage = { text: inputText, isUser: true };
      setMessages((prev) => [...prev, userMessage]);
      setInputText("");

      const response = await fetch("https://mtb.meratravelbuddy.com/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: inputText }),
      });

      const data = await response.json();
      const botMessage = { text: data.answer || data.error, isUser: false };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        text: "Failed to connect to the server",
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <View style={tw`mt-7`}>
        <Header />
      </View>

      <View style={styles.container}>
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.message,
                item.isUser ? styles.userMessage : styles.botMessage,
              ]}
            >
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask about our books..."
            placeholderTextColor="#888"
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={isLoading}
          >
            <Text style={styles.sendButtonText}>
              {isLoading ? "..." : "Send"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gray",
    padding: 10,
  },
  listContent: {
    paddingBottom: 10,
  },
  message: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#e3f2fd",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "white",
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "white",
    borderRadius: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#333",
  },
  sendButton: {
    marginLeft: 8,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 6,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default BookAgent;
