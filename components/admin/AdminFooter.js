// Footer.js

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import UserModal from './AdminUModal';

const AdminFooter = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleChangePassword = () => {
        console.log("Change Password pressed");
        setModalVisible(false);
    };

    const handleSignOut = () => {
        console.log("Sign Out pressed");
        setModalVisible(false);
    };

    return (
        <>
            <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
                    <Icon name="home-outline" size={30} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('NotificationsA')}>
                    <Icon name="notifications-outline" size={30} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Icon name="person-outline" size={30} color="#000" />
                </TouchableOpacity>
            </View>

            <UserModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onChangePassword={handleChangePassword}
                onSignOut={handleSignOut}
            />
        </>
    );
};

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderColor: '#ddd',
        width: '100%',
        position: 'absolute',
        bottom: 0,
    },
});

export default AdminFooter;
