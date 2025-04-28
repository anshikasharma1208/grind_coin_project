// import React, { useState, useRef } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
// import { Camera } from 'expo-camera';
// import * as CameraPermissions from 'expo-camera';


// export default function Signup() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [hasPermission, setHasPermission] = useState<boolean | null>(null);
//   const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
//   const cameraRef = useRef<Camera>(null);

//   React.useEffect(() => {
//     (async () => {
//       const { status } = await CameraPermissions.requestCameraPermissionsAsync();
//       setHasPermission(status === 'granted');
//     })();
//   }, []);

//   const captureFace = async () => {
//     if (cameraRef.current) {
//       const photo = await cameraRef.current.takePictureAsync({ base64: true });
//       setCapturedPhoto(photo.uri);
//     }
//   };

//   const handleSignup = async () => {
//     if (!name || !email || !capturedPhoto) {
//       Alert.alert('Error', 'Please fill all fields and capture your face.');
//       return;
//     }
//     // API call to /signup
//     console.log('Signing up with:', { name, email, capturedPhoto });
//   };

//   if (hasPermission === null) return <View />;
//   if (hasPermission === false) return <Text>No access to camera</Text>;

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>GRIDCOINS Signup</Text>

//       <TextInput
//         placeholder="Name"
//         placeholderTextColor="gray"
//         style={styles.input}
//         value={name}
//         onChangeText={setName}
//       />

//       <TextInput
//         placeholder="Email"
//         placeholderTextColor="gray"
//         style={styles.input}
//         keyboardType="email-address"
//         value={email}
//         onChangeText={setEmail}
//       />

//       <View style={styles.cameraContainer}>
//         {capturedPhoto ? (
//           <Image source={{ uri: capturedPhoto }} style={styles.capturedImage} />
//         ) : (
//           <Camera style={styles.camera} ref={cameraRef} />
//         )}
//       </View>

//       <TouchableOpacity style={styles.captureButton} onPress={captureFace}>
//         <Text style={styles.captureButtonText}>{capturedPhoto ? "Retake Photo" : "Capture Face"}</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
//         <Text style={styles.signupButtonText}>Sign Up</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: '#0F0F0F',
//     alignItems: 'center',
//     paddingTop: 60,
//     paddingBottom: 30,
//     paddingHorizontal: 20,
//   },
//   title: {
//     color: 'red',
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 30,
//   },
//   input: {
//     backgroundColor: '#1F1F1F',
//     color: 'white',
//     width: '100%',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 15,
//   },
//   cameraContainer: {
//     width: '100%',
//     height: 300,
//     backgroundColor: '#1F1F1F',
//     borderRadius: 15,
//     overflow: 'hidden',
//     marginBottom: 20,
//   },
//   camera: {
//     flex: 1,
//   },
//   capturedImage: {
//     width: '100%',
//     height: '100%',
//   },
//   captureButton: {
//     backgroundColor: 'red',
//     padding: 15,
//     borderRadius: 10,
//     width: '100%',
//     marginBottom: 15,
//     alignItems: 'center',
//   },
//   captureButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   signupButton: {
//     backgroundColor: 'white',
//     padding: 15,
//     borderRadius: 10,
//     width: '100%',
//     alignItems: 'center',
//   },
//   signupButtonText: {
//     color: 'red',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router'; // ✅ Correct import for expo-router
import axios from 'axios';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [otpModalVisible, setOtpModalVisible] = useState(false);

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

  const handleSignup = async () => {
    if (!name || !email || !capturedPhoto) {
      Alert.alert('Error', 'Please fill all fields and capture your face.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('file', {
      uri: capturedPhoto,
      name: 'face.jpg',
      type: 'image/jpeg',
    } as any);

    try {
      const response = await axios.post('http://ec2-13-60-91-252.eu-north-1.compute.amazonaws.com:8000/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log(response.data);
      setOtpModalVisible(true);
    } catch (error) {
      console.error(error);
      Alert.alert('Signup Failed', 'Could not complete signup.');
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post('http://ec2-13-60-91-252.eu-north-1.compute.amazonaws.com/verify-otp', {
        email,
        otp,
      }, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      console.log(response.data);
      Alert.alert('Success', 'Email verified! Please login.');
      setOtpModalVisible(false);
      router.push('/(auth)/login');  // ✅ Correct navigation after OTP
    } catch (error) {
      console.error(error);
      Alert.alert('OTP Failed', 'Incorrect OTP. Try again.');
    }
  };

  const goToLogin = () => {
    router.push('/(auth)/login');  // ✅ Correct manual login button navigation
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>GRIDCOINS Signup</Text>

      <TextInput
        placeholder="Name"
        placeholderTextColor="gray"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

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

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* NEW - Go to Login Button */}
      <TouchableOpacity style={styles.loginLinkButton} onPress={goToLogin}>
        <Text style={styles.loginLinkText}>Already have an account? Login</Text>
      </TouchableOpacity>

      {/* OTP Modal */}
      <Modal visible={otpModalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter OTP</Text>
            <TextInput
              placeholder="Enter OTP"
              placeholderTextColor="gray"
              style={styles.input}
              keyboardType="numeric"
              value={otp}
              onChangeText={setOtp}
            />
            <TouchableOpacity style={styles.signupButton} onPress={verifyOtp}>
              <Text style={styles.signupButtonText}>Verify OTP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  signupButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  signupButtonText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginLinkButton: {
    marginTop: 10,
  },
  loginLinkText: {
    color: 'gray',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1F1F1F',
    width: '80%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    color: 'red',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
