import { useState } from "react";
import { View, Text, FlatList, StyleSheet, Modal, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const RecentPaymentList = ({ route }) => {
  const { payments } = route.params; // Get payments passed as a route parameter
  const [imageVisibleIndex, setImageVisibleIndex] = useState(null);

  // Toggle image visibility for specific payment item
  const toggleImage = (index) => {
    setImageVisibleIndex(imageVisibleIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Recent Payments</Text>

      <FlatList
        data={payments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.paymentItem}>
            <Text style={styles.paymentDate}>
              {new Date(item.payment_date).toLocaleDateString()}
            </Text>
            <Text style={styles.paymentAmount}>{item.amount_paid}</Text>

            <TouchableOpacity onPress={() => toggleImage(index)} style={styles.iconContainer}>
              <Icon name="photo-camera" size={26} color="black" />
            </TouchableOpacity>

            <Modal
              visible={imageVisibleIndex === index}
              transparent={true}
              animationType="fade"
              onRequestClose={() => toggleImage(index)}
            >
              <View style={styles.modalContainer}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => toggleImage(index)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
                <Image
                  source={{ uri: item.screenshot_url }} // Accessing screenshot_url from each payment item
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
            </Modal>
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
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
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

export default RecentPaymentList;
