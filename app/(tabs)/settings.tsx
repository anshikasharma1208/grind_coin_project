import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useUser } from '@/context/UserContext';
import { router } from 'expo-router';

export default function Settings() {
  const { user, setUser } = useUser();

  const handleLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          setUser(null); // ✅ clear user
          router.replace('/(auth)/login'); // ✅ redirect to login
        },
      },
    ]);
  };

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <Image
        source={{ uri: user.photo || 'https://randomuser.me/api/portraits/lego/1.jpg' }}
        style={styles.profileImage}
      />
      <Text style={styles.nameText}>{user.name}</Text>
      <Text style={styles.emailText}>{user.email}</Text>

      {/* Coins */}
      <View style={styles.coinsBox}>
        <Text style={styles.coinsTitle}>Your Coins 💰</Text>
        <Text style={styles.coinsValue}>{user.coins || 0}</Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  nameText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  emailText: {
    color: 'gray',
    fontSize: 16,
    marginTop: 5,
    marginBottom: 20,
  },
  coinsBox: {
    backgroundColor: '#1F1F1F',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  coinsTitle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },
  coinsValue: {
    color: '#00FFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
