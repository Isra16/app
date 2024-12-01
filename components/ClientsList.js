import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Footer from './admin/AdminFooter';

const ClientsList = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await fetch('https://jeywb7rn6x.us-east-1.awsapprunner.com/clients');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const clients = await response.json();
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

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const handleClientPress = (client) => {
        navigation.navigate('ClientDetails', { client });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleClientPress(item)}>
                        <View style={styles.clientView}>
                            <Text style={styles.header}>{item.name}</Text>
                            <Text style={styles.clientText}>Service Charges: {item.amount}</Text>
                            <Text>Due Date: {new Date(item.date).toLocaleDateString()}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
            <Footer navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f9f9f9',
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
});

export default ClientsList;
