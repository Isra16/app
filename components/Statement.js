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
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";

const Statement = ({ navigation }) => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageVisible, setImageVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(
          "https://jeywb7rn6x.us-east-1.awsapprunner.com/all-payments"
        );

        if (response.status === 200) {
          setPayments(response.data);
          setFilteredPayments(response.data); // Initially display all data
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

const applyFilter = () => {
  if (startDate && endDate) {
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setHours(23, 59, 59, 999); // Include the entire end date

    const filtered = payments.filter((item) => {
      const paymentDate = new Date(item.payment_date);
      return paymentDate >= startDate && paymentDate <= adjustedEndDate;
    });

    setFilteredPayments(filtered);
  } else {
    Alert.alert("Error", "Please select both start and end dates.");
  }
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
      <Text style={styles.paymentAmount}>{item.client_name}</Text>
      <Text style={styles.paymentAmount}>{item.amount_paid}</Text>
      <Text style={styles.paymentDate}>
        {new Date(item.payment_date).toLocaleDateString()}
      </Text>
      {item.screenshot_url && (
        <TouchableOpacity
          onPress={() => toggleImage(item.screenshot_url)}
          style={styles.iconContainer}
        >
          <Icon name="photo-camera" size={28} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Filters Section */}
      <View style={styles.filterContainer}>
        <View style={styles.datePickerContainer}>
          <Text style={styles.filterLabel}>Start Date:</Text>
          <TouchableOpacity
            onPress={() => setShowStartPicker(true)}
            style={styles.datePickerButton}
          >
            <Text style={styles.datePickerText}>
              {startDate ? startDate.toLocaleDateString() : "Select Date"}
            </Text>
          </TouchableOpacity>
          {showStartPicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowStartPicker(false); // Close the picker
                if (selectedDate) setStartDate(selectedDate);
              }}
            />
          )}
        </View>
        <View style={styles.datePickerContainer}>
          <Text style={styles.filterLabel}>End Date:</Text>
          <TouchableOpacity
            onPress={() => setShowEndPicker(true)}
            style={styles.datePickerButton}
          >
            <Text style={styles.datePickerText}>
              {endDate ? endDate.toLocaleDateString() : "Select Date"}
            </Text>
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowEndPicker(false); // Close the picker
                if (selectedDate) setEndDate(selectedDate);
              }}
            />
          )}
        </View>
        <TouchableOpacity onPress={applyFilter} style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Apply Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Payments List */}
      <View style={styles.recentPayments}>
        {filteredPayments.length > 0 ? (
          <FlatList
            data={filteredPayments}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={true} // Show vertical scroll bar
              contentContainerStyle={{ paddingBottom: 10 }} // Optional spacing
            
          />
        ) : (
          <Text style={styles.paymentDate}>No payments found.</Text>
        )}
      </View>

      {/* Image Modal */}
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
    alignItems: "center",
    justifyContent: "flex-start",
  },
  filterContainer: {
    width: "90%",
    marginVertical: 10,
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  datePickerButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    flex: 1,
  },
  datePickerText: {
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: "#1e90ff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  filterButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  recentPayments: {
    marginTop: 20,
    width: "90%",
  },
  paymentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
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
    marginLeft: 40,
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
