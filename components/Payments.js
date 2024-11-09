import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Footer from './admin/AdminFooter';

const Payments = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('received'); 
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()+1); // Default to current month

    const fetchData = async () => {
        try {
            const response = await fetch('https://jeywb7rn6x.us-east-1.awsapprunner.com/clients');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const clients = await response.json();
            console.log('Fetched Clients:', clients);

            if (Array.isArray(clients)) {
                setData(clients);
            } else {
                throw new Error('Response is not an array');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching Clients:', error);
            Alert.alert('Error', 'Unable to fetch data.');
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchData();
        }, [])
    );

    const handleClientPress = (client) => {
        navigation.navigate('Client', { client });
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const filteredData = data.filter(client => {
        const dueDate = new Date(client.date);
        const clientMonth = dueDate.getMonth()+1;
        if (filter === 'received') {
            return client.AmountPaid > 0 && clientMonth === selectedMonth; 
        } else if (filter === 'receivables') {
            return client.AmountPaid === 0 && clientMonth === selectedMonth; 
        }
        return true; 
    });
    const receivedCount = data.filter(client => {
        const dueDate = new Date(client.date);
        const clientMonth = dueDate.getMonth() + 1;
        return client.AmountPaid > 0 && clientMonth === selectedMonth;
    }).length;

    const receivablesCount = data.filter(client => {
        const dueDate = new Date(client.date);
        const clientMonth = dueDate.getMonth() + 1;
        return client.AmountPaid === 0 && clientMonth === selectedMonth;
    }).length;

    return (
        <View style={styles.container}>
            <View style={styles.filterContainer}>
                <TouchableOpacity 
                    style={[styles.filterButton, filter === 'received' && styles.activeFilter]} 
                    onPress={() => setFilter('received')}
                >
                    <Text style={styles.filterText}>Received  ({receivedCount})</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.filterButton, filter === 'receivables' && styles.activeFilter]} 
                    onPress={() => setFilter('receivables')}
                >
                    <Text style={styles.filterText}>Receivables ({receivablesCount})</Text>
                </TouchableOpacity>
            </View>

            <Picker
                selectedValue={selectedMonth}
                style={styles.monthPicker}
                onValueChange={(itemValue) => setSelectedMonth(itemValue)}
            >
                {Array.from({ length: 12 }, (_, index) => (
                    <Picker.Item key={index} label={new Date(0, index).toLocaleString('default', { month: 'long' })} value={index} />
                ))}
            </Picker>

            <FlatList
                data={filteredData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => {
                    const dueDate = new Date(item.date);
                    const today = new Date();
                    const isDueDatePassed = dueDate < today; 
                    return (
                        <TouchableOpacity onPress={() => handleClientPress(item)}>
                            <View style={styles.clientView}>
                                <Text style={styles.header}>{item.name}</Text>
                                <Text style={styles.clientText}>Service Charges: {item.amount}</Text>
                                <Text style={styles.clientText}>Amount Paid: {item.AmountPaid}</Text>
                                {filter === 'receivables' && (
                                    <Text
                                        style={[styles.dueDateText, isDueDatePassed && styles.overdue]}
                                    >
                                        Due Date: {dueDate.toLocaleDateString()}
                                    </Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />
            <Footer navigation={navigation}/>
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
    monthPicker: {
        height: 50,
        width: '100%',
        marginBottom: 10,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clientView: {
        backgroundColor: '#E0F0FF',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    clientText: {
        fontSize: 16,
        color: 'black',
        marginBottom: 10,
    },
    dueDateText: {
        fontSize: 16,
        color: 'black',
    },
    overdue: {
        color: 'red',
        fontWeight: 'normal',
    },
});

export default Payments;
