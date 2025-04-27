import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { router } from 'expo-router';
import { useUser } from '@/context/UserContext';  // ✅ Correct import

export default function Login() {
  const { setUser } = useUser();   // ✅ get setUser from context
  const [email, setEmail] = useState('');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permissions are required.');
      }
    })();
  }, []);

  const captureFace = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
      base64: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      setCapturedPhoto(result.assets[0].uri);
    }
  };

  const handleLogin = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);

    if (capturedPhoto) {
      formData.append('file', {
        uri: capturedPhoto,
        name: 'face.jpg',
        type: 'image/jpeg',
      } as any);
    }

    try {
      const response = await axios.post('http://192.168.89.148:8000/login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log(response.data);

      if (response.data.name && response.data.email) {
        setUser({
          name: response.data.name,
          email: response.data.email,
          photo: capturedPhoto || 'https://randomuser.me/api/portraits/lego/1.jpg',  // fallback photo
        });

        Alert.alert('Success', 'Login Successful!');
        router.replace('/(tabs)/dashboard');   // ✅ go to dashboard
      } else {
        Alert.alert('Login Failed', 'Could not verify your identity.');
      }

    } catch (error) {
      console.error(error);
      Alert.alert('Login Failed', 'Could not verify your identity.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>GRIDCOINS Login</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="gray"
        style={styles.input}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.cameraContainer}>
        {capturedPhoto ? (
          <Image source={{ uri: capturedPhoto }} style={styles.capturedImage} />
        ) : (
          <View style={styles.noPhotoBox}>
            <Text style={{ color: 'gray' }}>No Photo Captured</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.captureButton} onPress={captureFace}>
        <Text style={styles.captureButtonText}>
          {capturedPhoto ? "Retake Photo" : "Capture Face"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0F0F0F',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    color: 'red',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#1F1F1F',
    color: 'white',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  cameraContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#1F1F1F',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPhotoBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  capturedImage: {
    width: '100%',
    height: '100%',
  },
  captureButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 15,
    alignItems: 'center',
  },
  captureButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
