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

  const currentDate = new Date();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://jeywb7rn6x.us-east-1.awsapprunner.com/client");
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
    if (data?.date && data?.amount && data?.AmountPaid) {
      const dueDate = new Date(data.date);
      const balance = data.amount - data.AmountPaid;

      if (currentDate > dueDate && balance > 0) {
        setArrears(balance);
      } else {
        setArrears(0);
      }
    }
  }, [currentDate, data]);

  // Fetch recent payments for the client
  useEffect(() => {
    const fetchRecentPayments = async () => {
      try {
        const response = await fetch(
          `https://jeywb7rn6x.us-east-1.awsapprunner.com/api/payments?clientName=${data?.name}`
        );
        if (!response.ok) throw new Error("Failed to fetch recent payments");
        const payments = await response.json();
        setRecentPayments(payments);
      } catch (err) {
        console.error(err.message);
      }
    };

    if (data?.name) {
      fetchRecentPayments();
    }
  }, [data]);

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
              <TouchableOpacity style={styles.iconContainer}>
                <Icon name="photo-camera" size={28} color="black" />
              </TouchableOpacity>
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
            {recentPayments.length > 0 ? (
              recentPayments.map((payment, index) => (
                <View key={index} style={styles.paymentItem}>
                  <Text style={styles.paymentAmount}>${payment.total_amount}</Text>
                  <Text style={styles.paymentDate}>{new Date(payment.payment_date).toLocaleDateString()}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noPaymentsText}>No recent payments available</Text>
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
});

export default ClientDashboard;