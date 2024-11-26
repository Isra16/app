import react from "react";
import {View, Text, ImageBackground, SafeAreaView, StyleSheet,Image , TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon library
import Footer from "./admin/AdminFooter";

const Dashboard=({navigation})=>{
    return(

       
        <SafeAreaView style={styles.container}>
            <Image
        source={require('../assets/f2.png')} 
        style={styles.topRightImage}
      />
       <Icon 
                name="search" 
                size={40} 
                color="#000"
                style={styles.topLeftImage} 
            />
       <Icon 
                name="menu" 
                size={40} 
                color="#000" 
        style={styles.topLeftImage1}
      />
        <Text style={styles.header}>DASHBOARD</Text>
        <View style={styles.buttonContainer}>
       
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ClientList')}>
          <Image source={require('../assets/User.png')} style={styles.buttonImage} />
            <Text style={styles.buttonText}>Clients</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Add Clients')}>
          <Image source={require('../assets/add.png')} style={styles.buttonImageAdd} />
            <Text style={styles.buttonText}>Add Client</Text>
          </TouchableOpacity>
          
        </View>
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Payments')}>
        <Image source={require('../assets/par.png')} style={styles.buttonImage1} />
            <Text style={styles.buttonText}>Payments</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Picture')}>
          <Image source={require('../assets/full.png')} style={styles.buttonImage2} />
            <Text style={styles.buttonText}>Statement</Text>
          </TouchableOpacity>
         
        </View>
        <Footer navigation={navigation}/>
      </SafeAreaView>
      
    );

}

const styles = StyleSheet.create({
    backgroundImage: {
     flex: 1,
     resizeMode: 'cover',
     justifyContent: 'center',
   },
   container: {
    flex: 1,
    backgroundColor: '#E0F0FF',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 300,
    marginBottom: 20,
  },
  buttonImage:{
    width: 50, 
    height: 40, 
    marginBottom: 5,
  },
  buttonImage1:{
    width: 40, 
    height: 40, 
    marginBottom: 5,
  },
    buttonImage2:{
    width: 40, 
    height: 50, 
    marginBottom: 5,
  },
  buttonImageAdd:{
    width:40,
    height: 40
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    width: '100%', 
    paddingHorizontal: 30, 
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: 150, 
    height:90,
    paddingVertical: 15,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    justifyContent:'center'
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '500',
  },
  topRightImage:{
    width: 150, 
    height: 70, 
    position: 'absolute',
    top: 20, 
    left: 20, 
    marginLeft:20,
    marginTop:20
  },
  topLeftImage: {
  
    position: 'absolute',
    top: 20,
    right: 20,
    marginRight: 45,
    marginTop: 35,
  },
  topLeftImage1: {
    width: 60,
    height: 70,
    position: 'absolute',
    right: 15,
    marginRight: -10,
    marginTop: 55,
  },

 });
export default Dashboard;
