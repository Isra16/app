import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Modal } from 'react-native';

const Clientd = ({ route, navigation }) => {
    const { client } = route.params;
    const [amountPaid, setAmountPaid] = useState(client.AmountPaid);
    const [modalVisible, setModalVisible] = useState(false);
    const [newAmountPaid, setNewAmountPaid] = useState(amountPaid);

    const balance = client.amount - newAmountPaid;

    const updateAmountPaid = async () => {
        try {
            const response = await fetch('https://jeywb7rn6x.us-east-1.awsapprunner.com/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: client.id,
                    amountPaid: newAmountPaid,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Amount Paid updated successfully!');
                setModalVisible(false);  // Close modal on success
                navigation.goBack();
            } else {
                Alert.alert('Error', result.message || 'Failed to update Amount Paid');
            }
        } catch (error) {
            console.error('Error updating Amount Paid:', error);
            Alert.alert('Error', 'Something went wrong!');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.main}>
                <Text style={styles.header}>{client.name}</Text>
                <Text style={styles.detailText}>Service Charges: {client.amount}</Text>
                <Text style={styles.detailText}>Amount Paid: {amountPaid}</Text>
                <Text style={styles.detailText}>Balance: {balance}</Text>
                <Text style={styles.detailText}>Due Date: {new Date(client.date).toLocaleDateString()}</Text>
                
                <Button title="Update Amount Paid" onPress={() => setModalVisible(true)} />
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeader}>Update Amount Paid</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={newAmountPaid.toString()}
                            onChangeText={text => setNewAmountPaid(Number(text))}
                        />
                        <Button title="Save" onPress={updateAmountPaid} />
                        <Button title="Cancel" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
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
    main: {
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
    input: {
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: '100%',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        width: '80%',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default Clientd;
