import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const Payments = () => {
  const [clients, setClients] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('received');
  const currentMonth = new Date().getMonth() + 1; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientsResponse = await fetch('https://jeywb7rn6x.us-east-1.awsapprunner.com/all-clients');
        const clientsData = await clientsResponse.json();

        const paymentsResponse = await fetch('https://jeywb7rn6x.us-east-1.awsapprunner.com/all-payments');
        const paymentsData = await paymentsResponse.json();

        setClients(clientsData);
        setPayments(paymentsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Unable to fetch data.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const mergedData = clients.map((client) => {
    const payment = payments.find((p) =>
      p.client_name === client.name &&
      new Date(p.payment_date).getMonth() + 1 === currentMonth
    );
    return {
      ...client,
      amount_paid: payment ? payment.amount_paid : 0,
      payment_date: payment ? new Date(payment.payment_date) : null,
    };
  });

  const filteredData = mergedData.filter((client) => {
    const clientMonth = new Date(client.date).getMonth() + 1;
    if (filter === 'received') {
      return client.amount_paid > 0 && new Date(client.payment_date).getMonth() + 1 === currentMonth; 
    } else if (filter === 'receivables') {
      return client.amount_paid === 0 && clientMonth === currentMonth; 
    }
    return true;
  });

  const receivedCount = mergedData.filter((client) => {
    return client.amount_paid > 0 && new Date(client.payment_date).getMonth() + 1 === currentMonth; 
  }).length;

  const receivablesCount = mergedData.filter((client) => {
    const clientMonth = new Date(client.date).getMonth() + 1;
    return client.amount_paid === 0 && clientMonth === currentMonth; 
  }).length;

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const isDueDatePassed = (dueDate) => {
    return new Date(dueDate) < new Date(); // Check if the due date has passed
  };

  return (
    <View style={styles.container}>
      {/* Filters */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'received' && styles.activeFilter]}
          onPress={() => setFilter('received')}
        >
          <Text style={styles.filterText}>Received ({receivedCount})</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'receivables' && styles.activeFilter]}
          onPress={() => setFilter('receivables')}
        >
          <Text style={styles.filterText}>Receivables ({receivablesCount})</Text>
        </TouchableOpacity>
      </View>

      {/* Client List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.clientView}>
            <Text style={styles.header}>{item.name}</Text>
            <Text style={styles.clientText}>Service Charges: {item.amount}</Text>
            <Text style={styles.clientText}>Amount Paid: {item.amount_paid}</Text>
            {filter === 'received' && item.payment_date && (
              <Text style={styles.clientText}>
                Payment Date: {item.payment_date.toLocaleDateString()}
              </Text>
            )}
            <Text
              style={[
                styles.clientText,
                filter === 'receivables' && isDueDatePassed(item.date) && styles.pastDueDate,
              ]}
            >
              Due Date: {new Date(item.date).toLocaleDateString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
    width: 180,
  },
  activeFilter: {
    backgroundColor: '#A8D0FF',
  },
  filterText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'center',
  },
  clientView: {
    backgroundColor: '#E0F0FF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clientText: {
    fontSize: 16,
    color: 'black',
    marginBottom: 5,
  },
  pastDueDate: {
    color: 'red', // Apply red color if the due date has passed
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Payments;
