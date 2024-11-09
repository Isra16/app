import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Footer from "./Footer";

const Notifications=({navigation})=>{
    return(
    <View style={styles.container}>

        <Text style = {styles.text}>Notifications</Text>

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
      text:{
        marginTop:20
      }
});
export default Notifications;