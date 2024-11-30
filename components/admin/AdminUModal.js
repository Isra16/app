<<<<<<< HEAD
// UserModal.js
import React from 'react';
import { View, Modal, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const UserModal = ({ visible, onClose, onSignOut }) => {
    const navigation = useNavigation(); // Use navigation hook

    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    {/* Change Password Option */}
                    <TouchableOpacity 
                        onPress={() => {
                            navigation.navigate('ChangeOldPassword');
                            onClose(); // Optionally close the modal after navigating
                        }} 
                        style={styles.option}
                    >
                        <Text style={styles.optionText}>Change Password</Text>
                    </TouchableOpacity>

                    <View style={styles.separator} />

                    {/* Sign Out Option */}
                    <TouchableOpacity onPress={()=>{navigation.navigate('LogoScreen')}} style={styles.option}>
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
=======
// UserModal.js
import React from 'react';
import { View, Modal, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const UserModal = ({ visible, onClose, onSignOut }) => {
    const navigation = useNavigation(); // Use navigation hook

    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    {/* Change Password Option */}
                    <TouchableOpacity 
                        onPress={() => {
                            navigation.navigate('ChangeOldPassword');
                            onClose(); // Optionally close the modal after navigating
                        }} 
                        style={styles.option}
                    >
                        <Text style={styles.optionText}>Change Password</Text>
                    </TouchableOpacity>

                    <View style={styles.separator} />

                    {/* Sign Out Option */}
                    <TouchableOpacity onPress={()=>{navigation.navigate('LogoScreen')}} style={styles.option}>
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
>>>>>>> 97d9195f73ffb052c163c2b752b1ec0b802a1727
