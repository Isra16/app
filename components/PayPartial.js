<<<<<<< HEAD
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList, 
  Alert 
} from 'react-native';

const PayPartial = ({ navigation }) => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const totalAmount = 700;
  const dueDate = '28 January, 2024';

  const paymentOptions = [
    { id: '2', label: '50% ($350)', value: totalAmount * 0.5 },
    { id: '3', label: '80% ($560)', value: totalAmount * 0.8 },
  ];

  const handlePayment = () => {
    if (!selectedAmount) {
      Alert.alert('Error', 'Please select an amount to proceed.');
      return;
    }
    Alert.alert('Payment Success', `You paid $${selectedAmount}.`);
  };

  const renderOption = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.optionButton,
        selectedAmount === item.value && { backgroundColor: '#32CD32' },
      ]}
      onPress={() => setSelectedAmount(item.value)}
    >
      <Text style={styles.optionText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.content}>
          <Text style={styles.softwareName}>Software Name</Text>
          <Text style={styles.totalAmount}>Total Amount: ${totalAmount}</Text>
          <Text style={styles.dueDate}>Due Date: {dueDate}</Text>
        </View>

        <FlatList
          data={paymentOptions}
          keyExtractor={(item) => item.id}
          renderItem={renderOption}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F0FF',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  main: {
    marginTop: '30%',
    backgroundColor: '#fff',
    width: '80%',
    alignItems: 'center',
    borderRadius: 40,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  content: {
    marginBottom: 20,
  },
  softwareName: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  totalAmount: {
    fontSize: 20,
    marginBottom: 5,
  },
  dueDate: {
    fontSize: 20,
    marginBottom: 15,
  },
  optionButton: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
    width: '100%',
  },
  optionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  payButton: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  payButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PayPartial;
=======
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList, 
  Alert 
} from 'react-native';

const PayPartial = ({ navigation }) => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const totalAmount = 700;
  const dueDate = '28 January, 2024';

  const paymentOptions = [
    { id: '2', label: '50% ($350)', value: totalAmount * 0.5 },
    { id: '3', label: '80% ($560)', value: totalAmount * 0.8 },
  ];

  const handlePayment = () => {
    if (!selectedAmount) {
      Alert.alert('Error', 'Please select an amount to proceed.');
      return;
    }
    Alert.alert('Payment Success', `You paid $${selectedAmount}.`);
  };

  const renderOption = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.optionButton,
        selectedAmount === item.value && { backgroundColor: '#32CD32' },
      ]}
      onPress={() => setSelectedAmount(item.value)}
    >
      <Text style={styles.optionText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.content}>
          <Text style={styles.softwareName}>Software Name</Text>
          <Text style={styles.totalAmount}>Total Amount: ${totalAmount}</Text>
          <Text style={styles.dueDate}>Due Date: {dueDate}</Text>
        </View>

        <FlatList
          data={paymentOptions}
          keyExtractor={(item) => item.id}
          renderItem={renderOption}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F0FF',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  main: {
    marginTop: '30%',
    backgroundColor: '#fff',
    width: '80%',
    alignItems: 'center',
    borderRadius: 40,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  content: {
    marginBottom: 20,
  },
  softwareName: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  totalAmount: {
    fontSize: 20,
    marginBottom: 5,
  },
  dueDate: {
    fontSize: 20,
    marginBottom: 15,
  },
  optionButton: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
    width: '100%',
  },
  optionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  payButton: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  payButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PayPartial;
>>>>>>> 97d9195f73ffb052c163c2b752b1ec0b802a1727
