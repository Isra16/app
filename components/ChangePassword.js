import React, { useState } from 'react';
import {
  View, StyleSheet, Text, TextInput, TouchableOpacity, Alert
} from 'react-native';

const ChangePassword = () => {
  const [userid, setUserId] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateInputs = (id, oldPass, newPass) => {
    const newErrors = {};
    if (!id) newErrors.userid = 'User ID is required';
    if (!oldPass) newErrors.oldPassword = 'Old Password is required';
    if (!newPass) newErrors.newPassword = 'New Password is required';
    return Object.keys(newErrors).length ? newErrors : null;
  };

  const handleChangePassword = async () => {
    setErrors({});
    setSuccessMessage('');
    const newErrors = validateInputs(userid, oldPassword, newPassword);

    if (newErrors) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch('https://jeywb7rn6x.us-east-1.awsapprunner.com/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userid, oldPassword, newPassword }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage('Password changed successfully!');
      } else {
        throw new Error(result.message || 'Password change failed');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
      <TextInput
        placeholder="User ID"
        style={[styles.input, errors.userid && styles.errorInput]}
        onChangeText={setUserId}
      />
      {errors.userid && <Text style={styles.errorText}>{errors.userid}</Text>}
      <TextInput
        placeholder="Old Password"
        style={[styles.input, errors.oldPassword && styles.errorInput]}
        secureTextEntry
        onChangeText={setOldPassword}
      />
      {errors.oldPassword && <Text style={styles.errorText}>{errors.oldPassword}</Text>}
      <TextInput
        placeholder="New Password"
        style={[styles.input, errors.newPassword && styles.errorInput]}
        secureTextEntry
        onChangeText={setNewPassword}
      />
      {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
      {successMessage && (
        <Text style={styles.successText}>{successMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F0FF',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ChangePassword;
