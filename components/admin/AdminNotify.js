<<<<<<< HEAD
import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Footer from "./AdminFooter";

const AdminNotify=({navigation})=>{
    return(
    <View style={styles.container}>

        <Text>Notifications</Text>

        <Footer navigation={navigation}/>
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
});
=======
import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Footer from "./AdminFooter";

const AdminNotify=({navigation})=>{
    return(
    <View style={styles.container}>

        <Text>Notifications</Text>

        <Footer navigation={navigation}/>
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
});
>>>>>>> 97d9195f73ffb052c163c2b752b1ec0b802a1727
export default AdminNotify;