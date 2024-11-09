import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Footer from './admin/AdminFooter';

const ClientDetails = ({ route, navigation }) => {
    const { client } = route.params;
    const [isEditing, setIsEditing] = useState(false);
    const [editedClient, setEditedClient] = useState({
        name: client.name,
        amount: client.amount.toString(),
        dueDate: new Date(client.date),
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [date, setDate] = useState(new Date(client.date));

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedClient({
            name: client.name,
            amount: client.amount.toString(),
            dueDate: new Date(client.date) || new Date(),
        });
        setDate(new Date(client.date));
    };

    const handleSave = async () => {
        try {
            const selectedDate = date;

            const response = await fetch(`http://10.0.2.2:808/clients`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: client.name,
                    newName: editedClient.name,
                    amount: parseFloat(editedClient.amount),
                    dueDate: selectedDate.toISOString().split('T')[0],
                }),
            });

            const textResponse = await response.text();
            console.log('Raw response:', textResponse);

            if (!response.ok) {
                throw new Error(textResponse);
            }

            Alert.alert('Success', `Changes saved for ${editedClient.name}`);
            setIsEditing(false);
            navigation.navigate('Dashboard');
        } catch (error) {
            Alert.alert('Error', error.message);
            console.error('Error:', error);
        }
    };

    const handleDelete = async () => {
        Alert.alert('Delete Client', `Are you sure you want to delete ${client.name}?`, [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'OK',
                onPress: async () => {
                    try {
                        const response = await fetch(`http://10.0.2.2:808/clients/${encodeURIComponent(client.name)}`, {
                            method: 'DELETE',
                        });

                        if (!response.ok) {
                            const errorText = await response.text();
                            throw new Error(`Failed to delete client: ${errorText}`);
                        }

                        Alert.alert('Deleted', `${client.name} has been deleted.`);
                        navigation.navigate('Dashboard');
                    } catch (error) {
                        Alert.alert('Error', error.message);
                    }
                },
            },
        ]);
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShowDatePicker(false);
        setDate(currentDate);
        setEditedClient({ ...editedClient, dueDate: currentDate });
    };

    const handleBusinessNameChange = (text) => {
        const validText = text.replace(/[^a-zA-Z\s]/g, '');
        setEditedClient({ ...editedClient, name: validText });
    };

    const handleAmountChange = (text) => {
        const validAmount = text.replace(/[^0-9.]/g, '');
        setEditedClient({ ...editedClient, amount: validAmount });
    };

    return (
        <View style={styles.container}>
            <View style={styles.main}>
                <Text style={styles.header}>{client.name}</Text>
                {!isEditing ? (
                    <>
                        <Text style={styles.detailText}>Service Charges: {client.amount}</Text>
                        <Text style={styles.detailText}>Due Date: {new Date(client.date).toLocaleDateString()}</Text>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleEdit}>
                                <Text style={styles.buttonText}>Edit Client</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={handleDelete}>
                                <Text style={styles.buttonText}>Delete Client</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Business Name"
                            value={editedClient.name}
                            onChangeText={handleBusinessNameChange}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Service Charges"
                            keyboardType="numeric"
                            value={editedClient.amount}
                            onChangeText={handleAmountChange}
                        />
                        <TouchableOpacity style={styles.input} onPress={showDatepicker}>
                            <Text>{date.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="default"
                                onChange={onChangeDate}
                            />
                        )}
                        <View style={styles.buttonContainer1}>
                            <Button title="Save Changes" onPress={handleSave} />
                            <Button title="Cancel" onPress={handleCancel} />
                        </View>
                    </View>
                )}
            </View>
            <Footer navigation={navigation}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
        backgroundColor: '#E0F0FF',
        alignItems: 'center',
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        justifyContent: 'center',
        textAlign: 'center',
    },
    detailText: {
        fontSize: 18,
        marginBottom: 15,
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    buttonContainer1: {
        marginTop: 20,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    button: {
        backgroundColor: '#1e90ff',
        marginTop: 10,
        padding: 15,
        borderRadius: 5,
        marginVertical: 10,
        alignItems: 'center',
        
    },
    main: {
        marginTop: 80,
        marginVertical: 10,
        backgroundColor: '#fff',
        width: '80%',
        justifyContent: 'center',
        borderRadius: 40,
        padding: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
        
    },
    formContainer: {
        marginTop: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ClientDetails;
