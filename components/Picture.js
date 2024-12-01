import React, { useState } from 'react';
import { View, Button, Image, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

const Picture = () => {
  const [imageUri, setImageUri] = useState(null);
  const [uploadUrl, setUploadUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');


  const chooseImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', maxWidth: 800, maxHeight: 800 },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.error('Error picking image:', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          setImageUri(response.assets[0].uri);
        }
      }
    );
  };


  const uploadImage = async () => {
    if (!imageUri) {
      setSuccessMessage('Please select an image first.');
      return;
    }

    setIsUploading(true);
    setSuccessMessage('');

    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
    });

    try {
      const res = await axios.post(
        'https://jeywb7rn6x.us-east-1.awsapprunner.com/uploads',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 10000, 
        }
      );

      if (res.data && res.data.url) {
        setUploadUrl(res.data.url);
        setSuccessMessage('Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading image:', error.message);
      setSuccessMessage('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Choose Image" onPress={chooseImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}
      <Button
        title={isUploading ? 'Uploading...' : 'Upload Image'}
        onPress={uploadImage}
        disabled={isUploading}
      />
      {isUploading && <ActivityIndicator size="large" color="#0000ff" />}
      {successMessage && <Text style={styles.message}>{successMessage}</Text>}
      {uploadUrl && (
        <Text style={styles.uploadUrl}>
          Image uploaded! URL: 
          <Text style={{ color: 'blue' }}>{uploadUrl}</Text>
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginVertical: 16,
    borderRadius: 8,
  },
  message: {
    marginVertical: 10,
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
  },
  uploadUrl: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Picture;
