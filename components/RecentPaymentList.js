import React from "react";
import { View, Text, FlatList, StyleSheet} from "react-native";

const RecentPaymentList = ({ route }) => {
  const { payments } = route.params; // Get payments passed as a route parameter

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Recent Payments</Text>

      <FlatList
        data={payments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.paymentItem}>
            <Text style={styles.paymentDate}>
              {new Date(item.payment_date).toLocaleDateString()}
            </Text>
            <Text style={styles.paymentAmount}>{item.amount_paid}</Text>
          </View>
        )}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E0F0FF",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  paymentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  paymentDate: {
    fontSize: 16,
    color: "#555",
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 20,
    backgroundColor: "#1e90ff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default RecentPaymentList;
