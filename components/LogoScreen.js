import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Image,
  Text,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  BackHandler
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LogoScreen = () => {
  const [isLogoVisible, setLogoVisible] = useState(true);
  const slideAnim = useRef(new Animated.Value(200)).current;
  const containerAnim = useRef(new Animated.Value(400)).current;
  const topImageAnim = useRef(new Animated.Value(400)).current;
  const [userid, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loginMessage, setLoginMessage] = useState('');
  const navigation = useNavigation();


  const validateInputs = (id, pass) => {
    const newErrors = {};
    if (!id) newErrors.userid = 'User ID is required';
    if (!pass) newErrors.password = 'Password is required';
    return Object.keys(newErrors).length ? newErrors : null;
  };
  
    useEffect(() => {
      const backAction = () => {
  
        BackHandler.exitApp();
        return true;
      };
  
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
      return () => backHandler.remove();
    }, []);
  

  const buttonHandler = async () => {
    setErrors({}); 
    setLoginMessage(''); 
  
    
    const newErrors = validateInputs(userid, password);
    if (newErrors) {
      setErrors(newErrors);
      return; 
    }
  
    try {
  
      const clientResponse = await fetch('https://jeywb7rn6x.us-east-1.awsapprunner.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userid, password }),
      });
  
      const clientResult = await clientResponse.json();
  
      if (clientResponse.ok) {

        setLoginMessage('Login Successful');
        console.log('Client Login Result:', clientResult);
        navigation.navigate('UserPanel');
        return; 
      }
  
    
      console.log('Client Login Failed:', clientResult.message);
  
      const adminResponse = await fetch('https://jeywb7rn6x.us-east-1.awsapprunner.com/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userid, password }),
      });
  
      const adminResult = await adminResponse.json();
  
      if (adminResponse.ok) {
      
        setLoginMessage('Login Successful');
        console.log('Admin Login Result:', adminResult);
        navigation.navigate('Dashboard');
      } else {
       
        console.log('Admin Login Failed:', adminResult.message);
        throw new Error(adminResult.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error:', error.message);
      setLoginMessage(error.message);
    }
  };
  

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      setLogoVisible(false);
      Animated.parallel([
        Animated.timing(containerAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(topImageAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 2000);

    return () => clearTimeout(timer);
  }, [slideAnim, containerAnim, topImageAnim]);

  if (isLogoVisible) {
    return (
      <ImageBackground source={require('../assets/back.jpg')} style={styles.background1}>
        <View style={styles.container1}>
          <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
            <Image source={require('../assets/Capture.png')} style={styles.logo1} />
          </Animated.View>
        </View>
      </ImageBackground>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'padding' : 'height'} style={styles.container2}>
      <ImageBackground source={require('../assets/back.jpg')} style={styles.background}>
        <View style={styles.header}>
          <Text style={styles.title1}>Software Information Experts</Text>
          <Text style={styles.subtitle}>Softix Technologies</Text>
        </View>
        <Animated.View style={{ transform: [{ translateX: topImageAnim }] }}>
          <Image source={require('../assets/top.jpg')} style={styles.topImage} />
        </Animated.View>
        <Animated.View style={[styles.container, { transform: [{ translateX: containerAnim }] }]}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>ID</Text>
            <TextInput
              placeholder="Enter ID"
              style={[styles.input, errors.userid && styles.errorInput]}
              onChangeText={setUserId}
            />
            {errors.userid && <Text style={styles.errorText}>{errors.userid}</Text>}
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="Enter Password"
              style={[styles.input, errors.password && styles.errorInput]}
              secureTextEntry
              onChangeText={setPassword}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            <TouchableOpacity style={styles.button} onPress={buttonHandler}>
              <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>
            {loginMessage && (
              <Text style={loginMessage.includes('Successful') ? styles.successText : styles.errorText}>
                {loginMessage}
              </Text>
            )}
          </View>
        </Animated.View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container2: {
    flex: 1,
  },
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background1: {
    width: '100%',
    height: '100%',
  },
  logo1: {
    width: 200,
    height: 100,
    marginBottom: 20,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  topImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    top: 20,
    alignSelf: 'center',
    zIndex: 1,
    position: 'absolute',
  },
  container: {
    padding: 20,
    paddingTop: 60,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    zIndex: 0,
    shadowColor: 'skyblue',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 75,
  },
  title1: {
    fontSize: 18,
    color: '#2C3E50',
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 40,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2980B9',
  },
  inputContainer: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'darkblue',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  successText: {
    color: 'green',
    fontSize: 14,
    marginTop: 10,
  },
  button: {
    backgroundColor: 'darkblue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    marginBottom: 0,
  },
});

export default LogoScreen;
