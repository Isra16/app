import React from 'react';
import { View, Modal, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const UserModal = ({ visible, onClose }) => {
    const navigation = useNavigation();

    const handleSignOut = async () => {
        try {
            const response = await fetch('https://jeywb7rn6x.us-east-1.awsapprunner.com/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                Alert.alert('Success', 'You have been logged out.');
                navigation.navigate('LogoScreen');
            } else {
              
                const data = await response.json();
                Alert.alert('Error', data.message || 'Logout failed');
            }
        } catch (error) {
            console.error('Logout Error:', error);
            Alert.alert('Error', 'An error occurred during logout.');
        }
    };

    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('ChangePassword');
                            onClose();
                        }}
                        style={styles.option}
                    >
                        <Text style={styles.optionText}>Change Password</Text>
                    </TouchableOpacity>

                    <View style={styles.separator} />

                    <TouchableOpacity
                        onPress={handleSignOut} 
                        style={styles.option}
                    >
                        <Text style={styles.optionText}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingBottom: 60,
    },
    modal: {
        width: '55%',
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        alignItems: 'center',
        elevation: 5,
    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: 'black',
        marginVertical: 0,
    },
    option: {
        padding: 10,
        alignItems: 'center',
    },
    optionText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
    },
});

export default UserModal;
