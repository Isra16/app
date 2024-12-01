import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Footer from "./AdminFooter";

const AdminNotify = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Notifications</Text>
            <Footer navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E0F0FF',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 20,
    },
});

export default AdminNotify;
