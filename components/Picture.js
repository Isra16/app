import React, { useState } from 'react';
import { View, Button, Image, Text } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

const Picture = () => {
  const [imageUri, setImageUri] = useState(null);
  const [uploadUrl, setUploadUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const chooseImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', maxWidth: 800, maxHeight: 800 },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          setImageUri(response.assets[0].uri);
        }
      }
    );
  };

  const uploadImage = async () => {
    if (!imageUri) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg', // Modify according to your image type
      name: 'image.jpg',
    });

    try {
      const res = await axios.post('https://jeywb7rn6x.us-east-1.awsapprunner.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data && res.data.url) {
        setUploadUrl(res.data.url);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Choose Image" onPress={chooseImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
      <Button title="Upload Image" onPress={uploadImage} disabled={isUploading} />
      {uploadUrl && <Text>Image uploaded! URL: {uploadUrl}</Text>}
    </View>
  );
};

export default Picture;
