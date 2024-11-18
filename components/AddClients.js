import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddClients = ({ navigation }) => {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [AmountPaid, setAmountPaid] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSave = async () => {
        try {
            const response = await fetch('https://jeywb7rn6x.us-east-1.awsapprunner.com/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    amount: amount,
                    AmountPaid: AmountPaid,
                    date: new Date(date).toISOString().split('T')[0], // Ensure date is properly formatted
                }),
            });
    
            const textResponse = await response.text();
            console.log('Raw response:', textResponse);
    
            const result = JSON.parse(textResponse);
    
            if (response.ok) {
                Alert.alert(
                    'Success',
                    `Client Added Successfully!\n\nID: ${result.id}\nPassword: ${result.password}\nName: ${result.name}\nAmount: ${result.amount}\nDate: ${result.date}`
                );
                navigation.navigate('Dashboard');
            } else {
                Alert.alert('Error', result.message || 'Failed to add Client');
                console.error('Error response:', result);
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        }
    };
    
    const validateInputs = (name, amount, AmountPaid) => {
        const newErrors = {};
        if (!name) {
            newErrors.name = 'Name is required';
        }
        if (!amount) {
            newErrors.amount = 'Amount is required';
        }
        if (!AmountPaid) {
            newErrors.AmountPaid = 'Amount Paid is required';
        }
        return Object.keys(newErrors).length ? newErrors : null;
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
    };

    return (
        <View style={styles.container}>
            <View style={styles.main}>
                <Image 
                    source={require('../assets/top.jpg')}  
                    style={styles.topImage}
                />
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Business Name:</Text>
                    <TextInput
                        style={[styles.input, errors.name && styles.errorInput]}
                        value={name}
                        onChangeText={(text) => {
                            const alphaOnly = text.replace(/[^a-zA-Z\s]/g, '');
                            setName(alphaOnly);
                        }}
                        placeholder="Enter Business Name"
                    />
                    {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                </View>
                
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Services Charges:</Text>
                    <TextInput
                        style={[styles.input, errors.amount && styles.errorInput]}
                        value={amount}
                        onChangeText={(text) => {
                            const numericOnly = text.replace(/[^0-9]/g, '');
                            setAmount(numericOnly);
                        }}
                        placeholder="Enter Services Charges"
                        keyboardType="numeric"
                    />
                    {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Amount Paid:</Text>
                    <TextInput
                        style={[styles.input, errors.AmountPaid && styles.errorInput]}
                        value={AmountPaid}
                        onChangeText={(text) => {
                            const numericOnly = text.replace(/[^0-9]/g, '');
                            setAmountPaid(numericOnly);
                        }}
                        placeholder="Enter Amount Paid"
                        keyboardType="numeric"
                    />
                    {errors.AmountPaid && <Text style={styles.errorText}>{errors.AmountPaid}</Text>} 
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Date:</Text>
                    <TouchableOpacity onPress={showDatepicker} style={[styles.input, { justifyContent: 'center' }]}>
                        <Text>{date.toDateString()}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                        />
                    )}
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E0F0FF',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    main: {
        marginTop: 170,
        marginVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 40,       
        padding: 30,          
        shadowColor: '#000',     
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3, 
    }, 
    topImage: {
        width: 100,   
        height: 100,  
        position: 'absolute',
        top: -50,     
        left: '50%',
        marginLeft: -50,
        backgroundColor: '#fff',
        borderRadius: 50,  
        borderWidth: 2,
        borderColor: '#ccc',
    },
    inputContainer: {
        marginVertical: 10,
        marginTop: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold'
    },
    input: {
        height: 40,
        width: 250,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    button: {
        backgroundColor: '#1e90ff',
        padding: 10,
        width: 250,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    errorText: {
        color: 'red',
    },
    errorInput: {
        borderColor: 'red',
    }
});

export default AddClients;
