import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Clientd = ({ route }) => {
    const { client } = route.params; 

    const balance = client.amount - client.AmountPaid;

    return (
        <View style={styles.container}>
           <View style={styles.main}>
            <Text style={styles.header}>{client.name}</Text>
            <Text style={styles.detailText}>Service Charges: {client.amount}</Text>
            <Text style={styles.detailText}>Amount Paid: {client.AmountPaid}</Text>
            <Text style={styles.detailText}>Balance: {balance}</Text>
            <Text style={styles.detailText}>Due Date: {new Date(client.date).toLocaleDateString()}</Text>
</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#E0F0FF',
        alignItems: 'center',
    },
    main:{
        marginTop: 50,
        marginVertical: 10,
        backgroundColor: '#fff',
        width: '90%',
        justifyContent: 'center',
        borderRadius: 40,
        padding: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    detailText: {
        fontSize: 18,
        marginBottom: 10,
    },
});

export default Clientd;
