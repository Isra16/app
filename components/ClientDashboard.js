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
  Modal,
  BackHandler
} from "react-native";
import Footer from "./Footer";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons";

const ClientDashboard = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [arrears, setArrears] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentPaymentsLoading, setRecentPaymentsLoading] = useState(false);
  const [recentPayments, setRecentPayments] = useState([]);
  const [imageVisible, setImageVisible] = useState(false);

  const currentDate = new Date();

  useEffect(() => {
            const backAction = () => {
        
              BackHandler.exitApp();
              return true;
            };
        
            const backHandler = BackHandler.addEventListener(
              "hardwareBackPress",
              backAction
            );
            return () => backHandler.remove();
          }, []);
  

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

        const arrearsAmount = result.amount; // Simplified arrears calculation
        setArrears(arrearsAmount);
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
    const fetchRecentPayments = async () => {
      if (!data?.name) return;

      setRecentPaymentsLoading(true);
      try {
        const response = await axios.get(
          "https://jeywb7rn6x.us-east-1.awsapprunner.com/recent-payments",
          { params: { clientName: data.name } }
        );

        if (response.status === 200) {
          setRecentPayments(response.data);
        } else {
          throw new Error("Failed to fetch recent payments");
        }
      } catch (err) {
        Alert.alert("Error", err.message);
      } finally {
        setRecentPaymentsLoading(false);
      }
    };

    if (data?.name) fetchRecentPayments();
  }, [data?.name]);

  const handlePayMonthly = async () => {
    const paymentDate = new Date().toISOString().split("T")[0];
    const paymentMonth = new Date().getMonth(); // Get the current month (0 = January, 11 = December)
    const currentYear = new Date().getFullYear(); // Get the current year
  
    // Check if there's already a payment made in December
    const isPaymentMadeInDecember = recentPayments.some(payment => {
      const paymentDate = new Date(payment.payment_date);
      return paymentDate.getMonth() === 11 && paymentDate.getFullYear() === currentYear;
    });
  
    if (isPaymentMadeInDecember) {
      Alert.alert("Payment Already Made", "You have already made a payment this month.");
      return; // Exit the function if payment is already made


    }
    const paymentData = {
      clientName: data.name,
      amountPaid: data.amount,
      paymentDate: paymentDate,
    };

    try {
      const response = await axios.post(
        "https://jeywb7rn6x.us-east-1.awsapprunner.com/add-payment",
        paymentData
      );

      if (response.status === 201) {
        Alert.alert("Success", "Monthly payment recorded successfully");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handlePayFull = async () => {
    const paymentDate = new Date().toISOString().split("T")[0];
    const paymentMonth = new Date().getMonth(); // Get the current month (0 = January, 11 = December)
    const currentYear = new Date().getFullYear(); // Get the current year
  
    // Check if there's already a payment made in December
    const isPaymentMadeInDecember = recentPayments.some(payment => {
      const paymentDate = new Date(payment.payment_date);
      return paymentDate.getMonth() === 11 && paymentDate.getFullYear() === currentYear;
    });
  
    if (isPaymentMadeInDecember) {
      Alert.alert("Payment Already Made", "You have already made a payment this month.");
      return; // Exit the function if payment is already made
    }
    const paymentData = new FormData();
    const totalAmount = data.amount + arrears;

    paymentData.append("clientName", data.name);
    paymentData.append("amountPaid", totalAmount);
    paymentData.append("paymentDate", paymentDate);
    paymentData.append("arrears", arrears); // Add arrears to the payload

    if (data.screenshot) {
        paymentData.append("screenshot", {
            uri: data.screenshot.uri,
            type: "image/png",
            name: "screenshot.png",
        });
    }

    try {
        const response = await axios.post(
            "https://jeywb7rn6x.us-east-1.awsapprunner.com/add-payment",
            paymentData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.status === 201) {
            Alert.alert("Success", "Payment recorded successfully");

            setArrears(0);
            setData((prevData) => ({
                ...prevData,
                amount: 0,
            }));
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

  const { name, amount, date } = data || {};
  const totalAmount = amount + arrears;

  const toggleImage = () => {
    setImageVisible(!imageVisible);
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
         
        </TouchableOpacity>
        <View style={styles.main}>
          <View style={styles.content}>
            <Text style={styles.softwareName}>{name}</Text>
            <Text style={styles.totalAmount}>Monthly Charges: {amount}</Text>
            <Text style={styles.totalAmount}>Arrears: {arrears}</Text>
            <Text style={styles.totalAmount}>Total Amount: {totalAmount}</Text>
            <Text style={styles.dueDate}>Due Date: {date}</Text>
          </View>
          <View style={styles.payment}>
            <TouchableOpacity style={styles.payButton} onPress={handlePayFull}>
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
              recentPayments.slice(0, 3).map((payment, index) => (
                <View key={index} style={styles.paymentItem}>
                  <Text style={styles.paymentDate}>
                    {new Date(payment.payment_date).toLocaleDateString()}
                  </Text>
                  <Text style={styles.paymentAmount}>{payment.amount_paid}</Text>
                  <TouchableOpacity onPress={toggleImage} style={styles.iconContainer}>
                    <Icon name="photo-camera" size={26} color="black" />
                  </TouchableOpacity>
                  <Modal
                    visible={imageVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={toggleImage}
                  >
                    <View style={styles.modalContainer}>
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={toggleImage}
                      >
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
              <Text>No recent payments found.</Text>
            )}

            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() =>
                navigation.navigate("RecentPaymentList", {
                  payments: recentPayments,
                })
              }
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
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
    position: 'absolute',
    top: 20, 
    left: -25, 
    marginLeft: 20,
    marginTop: 20,
  },
  main: {
    marginTop: "40%",
    marginVertical: 15,
    backgroundColor: "#fff",
    width: "80%",
    alignItems: "center",
    borderRadius: 40,
    padding: 30,
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
  flexDirection: 'row',
  justifyContent: 'space-between',  // This ensures that items are spaced evenly.
  paddingVertical: 5,
  borderBottomWidth: 1,
  borderBottomColor: '#ccc',
  width: '100%', // Make sure the item stretches across the full width of its parent.
},

paymentAmount: {
  fontSize: 16,
  marginRight: 10,  // Optionally add margin to create space between amount and the camera icon
},

paymentDate: {
  fontSize: 16,
  color: '#888',
  flex: 1,  // This ensures the date takes up available space and pushes the amount to the right
  textAlign: 'right',  // Aligns the date text to the right for better readability
},

iconContainer: {
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 10, // Adds space between date and the camera icon
  marginTop: 5,  // Slight margin at the top to align better with the text
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
    marginRight:25
  },
  iconContainer: {
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


