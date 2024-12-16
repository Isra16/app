
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";

const Statement = ({ navigation }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageVisible, setImageVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(
          "https://jeywb7rn6x.us-east-1.awsapprunner.com/all-payments"
        );

        if (response.status === 200) {
          setPayments(response.data);
        } else {
          throw new Error("Failed to fetch payments");
        }
      } catch (err) {
        setError(err.message);
        Alert.alert("Error", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const toggleImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageVisible(!imageVisible);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e90ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.paymentItem}>
      <Text style={styles.paymentAmount}>${item.amount_paid}</Text>
      <Text style={styles.paymentDate}>
        {new Date(item.payment_date).toLocaleDateString()}
      </Text>
      <TouchableOpacity
        onPress={() => toggleImage(item.screenshot_url)}
        style={styles.iconContainer}
      >
        <Icon name="photo-camera" size={28} color="black" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Payments</Text>
      </View>
      <FlatList
        data={payments}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <Modal
        visible={imageVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => toggleImage(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => toggleImage(null)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.image}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F0FF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  paymentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  paymentAmount: {
    fontSize: 16,
  },
  paymentDate: {
    fontSize: 16,
    color: "#888",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0F0FF",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0F0FF",
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  image: {
    width: 300,
    height: 300,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#000",
  },
});

export default Statement;