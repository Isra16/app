import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal
} from "react-native";
import Footer from "./Footer";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons";
import { launchImageLibrary } from "react-native-image-picker";

const ClientDashboard = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [arrears, setArrears] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentPaymentsLoading, setRecentPaymentsLoading] = useState(false); // Loading for recent payments
  const [recentPayments, setRecentPayments] = useState([]); // State for recent payments
  const [imageVisible, setImageVisible] = useState(false);

  const currentDate = new Date();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://jeywb7rn6x.us-east-1.awsapprunner.com/client"
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();

        if (result.date) {
          const dateObject = new Date(result.date);
          result.date = isNaN(dateObject)
            ? "Invalid date"
            : dateObject.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });
        }

        setData(result);
      } catch (err) {
        setError(err.message);
        Alert.alert("Error", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    // Fetch recent payments if client data is loaded
    const fetchRecentPayments = async () => {
      if (!data?.name) return;

      setRecentPaymentsLoading(true);
      try {
        const response = await axios.get(
          "https://jeywb7rn6x.us-east-1.awsapprunner.com/recent-payments",
          { params: { clientName: data.name } } // Pass client name dynamically
        );

        if (response.status === 200) {
          setRecentPayments(response.data);
        } else {
          throw new Error("Failed to fetch recent payments");
        }
      } catch (err) {
        console.error(err.message);
        Alert.alert("Error", err.message);
      } finally {
        setRecentPaymentsLoading(false);
      }
    };

    if (data) fetchRecentPayments();
  }, [data]);

  const handlePayMonthly = async () => {
    const paymentDate = new Date().toISOString().split("T")[0]; // Format date as YYYY-MM-DD
    const paymentData = {
      clientName: name, // Name retrieved from the API
      amountPaid: amount, // Monthly charges retrieved from the API
      paymentDate: paymentDate,
    };
  
    try {
      const response = await axios.post(
        "https://jeywb7rn6x.us-east-1.awsapprunner.com/add-payment",
        paymentData
      );
  
      if (response.status === 201) {
        Alert.alert("Success", "Monthly payment recorded successfully");
  
        // Prompt user to upload a screenshot
        launchImageLibrary(
          { mediaType: "photo" },
          async (imageResponse) => {
            if (imageResponse.didCancel) {
              console.log("User cancelled image picker");
              return;
            }
  
            if (imageResponse.assets && imageResponse.assets.length > 0) {
              const formData = new FormData();
              formData.append("clientName", name);
              formData.append("amountPaid", amount);
              formData.append("paymentDate", paymentDate);
              formData.append("screenshot", {
                uri: imageResponse.assets[0].uri,
                name: imageResponse.assets[0].fileName,
                type: imageResponse.assets[0].type,
              });
  
              try {
                const uploadResponse = await axios.post(
                  "https://jeywb7rn6x.us-east-1.awsapprunner.com/add-payment",
                  formData,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  }
                );
                if (uploadResponse.status === 201) {
                  Alert.alert("Success", "Screenshot uploaded successfully");
                }
              } catch (err) {
                console.error("Error uploading screenshot:", err.message);
                Alert.alert("Error", "Failed to upload screenshot");
              }
            }
          }
        );
      } else {
        Alert.alert("Error", "Failed to record monthly payment");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handlePayFull = async () => {
    const paymentDate = new Date().toISOString().split("T")[0]; // Format date as YYYY-MM-DD
    const paymentData = new FormData();
    paymentData.append('clientName', name);  // Name retrieved from the screen
    paymentData.append('amountPaid', totalAmount);
    paymentData.append('paymentDate', paymentDate);
    
    // Assume user picks a screenshot using file picker
    if (screenshot) {
        paymentData.append('screenshot', {
            uri: screenshot.uri, // The URI of the selected image
            type: 'image/png',    // Set the image type (PNG)
            name: 'screenshot.png', // Set the name of the file
        });
    }

    try {
        const response = await axios.post(
            "https://jeywb7rn6x.us-east-1.awsapprunner.com/add-payment",
            paymentData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        if (response.status === 201) {
            Alert.alert("Success", "Payment recorded successfully");
        } else {
            Alert.alert("Error", "Failed to record payment");
        }
    } catch (error) {
        Alert.alert("Error", error.message);
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

  const { name, amount, AmountPaid, date } = data || {};
  const balance = amount - AmountPaid;
  const totalAmount = balance + arrears;

  const toggleImage = () => {
    setImageVisible(!imageVisible); // Toggle the visibility of the image
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image
          source={require("../assets/Capture.png")}
          style={styles.topLeftImage}
        />
        <TouchableOpacity
          style={styles.topRightImage}
          onPress={() => navigation.navigate("LogoScreen")}
        >
          <Image
            source={require("../assets/23.png")}
            style={styles.topRightImage}
          />
        </TouchableOpacity>
        <View style={styles.main}>
          <View style={styles.content}>
            <View style={styles.nameRow}>
              <Text style={styles.softwareName}>{name}</Text>
            </View>
            <Text style={styles.totalAmount}>Monthly Charges: {amount}</Text>
            <Text style={styles.totalAmount}>Amount Paid: {AmountPaid}</Text>
            <Text style={styles.totalAmount}>Balance: {balance}</Text>
            <Text style={styles.totalAmount}>Arrears: {arrears}</Text>
            <Text style={styles.totalAmount}>Total Amount: {totalAmount}</Text>
            <Text style={styles.dueDate}>Due Date: {date}</Text>
          </View>
          <View style={styles.payment}>
            <TouchableOpacity
              style={styles.payButton}
              onPress={handlePayFull} // Add the function to handle payment
            >
              <Text style={styles.payButtonText}>Pay Full</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.payButton} onPress={handlePayMonthly}>
    <Text style={styles.payButtonText}>Pay Monthly</Text>
  </TouchableOpacity>
          </View>
          <View style={styles.recentPayments}>
              <Text style={styles.recentPaymentsTitle}>Recent Payments</Text>
              {recentPaymentsLoading ? (
                <ActivityIndicator size="small" color="#1e90ff" />
              ) : recentPayments.length > 0 ? (
                recentPayments.map((payment, index) => (
                  <View key={index} style={styles.paymentItem}>
                    <Text style={styles.paymentAmount}>
                       {payment.amount_paid}
                    </Text>
                    <Text style={styles.paymentDate}>
                      
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </Text>
                    <TouchableOpacity onPress={toggleImage} style={styles.iconContainer}>
        <Icon name="photo-camera" size={28} color="black" />
      </TouchableOpacity>
      <Modal
        visible={imageVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleImage}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={toggleImage}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <Image
            source={{ uri: payment.screenshot_url }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
      
                ))
              ) : (
                <Text style={styles.paymentDate}>No recent payments found.</Text>
              )}
            </View>

        </View>
      </View>
      <Footer navigation={navigation} />
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
  topLeftImage: {
    width: 150,
    height: 70,
    position: "absolute",
    top: 30,
    left: -15,
  },
  topRightImage: {
    width: 20,
    height: 20,
    position: "absolute",
    top: 25,
    left: "73%",
  },
  main: {
    marginTop: "40%",
    marginVertical: 15,
    backgroundColor: "#fff",
    width: "80%",
    alignItems: "center",
    borderRadius: 40,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  content: {
    marginBottom: 20,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  iconContainer: {
    marginTop: 10,
    marginLeft: 170,
  },
  softwareName: {
    marginTop: 10,
    fontSize: 25,
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 18,
    marginBottom: 5,
  },
  dueDate: {
    fontSize: 18,
    marginBottom: 15,
  },
  payment: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  payButton: {
    flex: 1,
    backgroundColor: "#1e90ff",
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: "center",
  },
  payButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  recentPayments: {
    marginTop: 20,
  },
  recentPaymentsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign:'center'
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
  viewAllButton: {
    marginTop: 10,
    alignItems: "center",
  },
  viewAllText: {
    color: "#1e90ff",
    fontWeight: "bold",
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

  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  paymentAmount: {
    fontSize: 16,
  },
  paymentDate: {
    fontSize: 16,
    color: '#888',
    marginLeft:40
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  image: {
    width: 300,
    height: 300,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#000',
  },
 
});

export default ClientDashboard;
