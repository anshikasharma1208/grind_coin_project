import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, StyleSheet, Modal, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useUser } from '@/context/UserContext';
import { router } from 'expo-router';

export default function Dashboard() {
  const { user, loadingUser, setUser } = useUser();
  const [goals, setGoals] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');
  const [newGoalDuration, setNewGoalDuration] = useState('');
  const [fetchingGoals, setFetchingGoals] = useState(false);

  const userEmail = user?.email || '';

  useEffect(() => {
    if (userEmail) {
      fetchGoals();
    }
  }, [userEmail]);

  const fetchGoals = async () => {
    try {
      setFetchingGoals(true);
      const response = await axios.get(`http://ec2-13-60-91-252.eu-north-1.compute.amazonaws.com:8000/get-goals?email=${userEmail}`);
      setGoals(response.data.goals || []);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not fetch goals.');
    } finally {
      setFetchingGoals(false);
    }
  };

  const addGoal = async () => {
    if (!newGoalTitle.trim() || !newGoalDeadline.trim()) {
      Alert.alert('Error', 'Please fill Title and Deadline.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('email', userEmail);
      formData.append('title', newGoalTitle);
      formData.append('deadline', newGoalDeadline);
      formData.append('duration', newGoalDuration);

      await axios.post('http://ec2-13-60-91-252.eu-north-1.compute.amazonaws.com:8000/add-goal', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      Alert.alert('Success', 'Goal Added!');
      setModalVisible(false);
      setNewGoalTitle('');
      setNewGoalDeadline('');
      setNewGoalDuration('');
      fetchGoals();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not add goal.');
    }
  };

  const completeGoal = async (goalTitle: string) => {
    try {
      // 📸 Open camera for video recording
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        videoMaxDuration: 30,
        quality: 0.7,
      });

      if (result.canceled || result.assets.length === 0) {
        Alert.alert('Cancelled', 'No video captured.');
        return;
      }

      const capturedVideo = result.assets[0].uri;

      const formData = new FormData();
      formData.append('email', userEmail);
      formData.append('title', goalTitle);
      formData.append('video', {
        uri: capturedVideo,
        name: 'proof_video.mp4',
        type: 'video/mp4',
      } as any);

      // Upload video to backend
      // await axios.post('http://ec2-13-60-91-252.eu-north-1.compute.amazonaws.com:8000/complete-goal-video', formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // });

      Alert.alert('Success', 'Goal marked as completed! 🏆 +10 coins');

      // 🎯 Update coins locally
      setUser(prev => prev ? { ...prev, coins: (prev.coins || 0) + 10 } : prev);

      fetchGoals();

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not complete goal.');
    }
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  if (loadingUser) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileSection} onPress={() => router.push('/settings')}>
          <Image
            source={{ uri: user?.photo || 'https://randomuser.me/api/portraits/lego/1.jpg' }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.welcomeText}>Welcome!</Text>
            <Text style={styles.nameText}>{user.name || 'User'}</Text>
            <Text style={styles.coinsText}>Coins: {user.coins || 0}</Text>
          </View>
        </TouchableOpacity>
        <Ionicons name="menu" size={28} color="white" />
      </View>

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="gray" style={{ marginHorizontal: 8 }} />
        <TextInput placeholder="Search a goal..." placeholderTextColor="gray" style={styles.searchInput} />
      </View>

      {/* Add Goal Button */}
      <TouchableOpacity style={styles.addGoalBox} onPress={() => setModalVisible(true)}>
        <Ionicons name="add-circle" size={60} color="#fff" />
        <Text style={styles.addGoalText}>Add New Goal</Text>
      </TouchableOpacity>

      {/* Modal to Add Goal */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Goal</Text>
            <TextInput
              placeholder="Goal Title"
              placeholderTextColor="gray"
              style={styles.input}
              value={newGoalTitle}
              onChangeText={setNewGoalTitle}
            />
            <TextInput
              placeholder="Deadline (e.g., 30 May)"
              placeholderTextColor="gray"
              style={styles.input}
              value={newGoalDeadline}
              onChangeText={setNewGoalDeadline}
            />
            <TextInput
              placeholder="Duration (e.g., 1 hour)"
              placeholderTextColor="gray"
              style={styles.input}
              value={newGoalDuration}
              onChangeText={setNewGoalDuration}
            />
            <TouchableOpacity style={styles.saveButton} onPress={addGoal}>
              <Text style={styles.saveButtonText}>Save Goal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ color: 'gray', marginTop: 10 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Current Goals */}
      <Text style={styles.sectionTitle}>Current Goals</Text>

      {fetchingGoals ? (
        <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {goals.map((goal, index) => (
            <View key={index} style={styles.goalCard}>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <Text style={styles.goalDeadline}>Complete by: {goal.deadline}</Text>
              <Text style={styles.goalDuration}>Duration: {goal.duration}</Text>

              {!goal.completed && (
                <TouchableOpacity 
                  style={styles.completeButton}
                  onPress={() => completeGoal(goal.title)}
                >
                  <Text style={styles.completeButtonText}>Mark Completed</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#0F0F0F',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 10,
  },
  welcomeText: {
    color: 'gray',
    fontSize: 14,
  },
  nameText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  coinsText: {
    color: '#00FFFF',
    fontSize: 14,
    marginTop: 2,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 10,
    marginTop: 20,
  },
  searchInput: {
    color: 'white',
    flex: 1,
  },
  addGoalBox: {
    backgroundColor: '#d1c6ff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 20,
  },
  addGoalText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  goalCard: {
    backgroundColor: '#a0f3e1',
    width: 200,
    padding: 20,
    borderRadius: 18,
    marginRight: 15,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  goalDeadline: {
    marginTop: 10,
    color: '#333',
  },
  goalDuration: {
    marginTop: 6,
    color: '#555',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
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
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#2c2c2c',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    color: 'white',
  },
  saveButton: {
    backgroundColor: '#d1c6ff',
    padding: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  completeButton: {
    marginTop: 10,
    backgroundColor: 'green',
    padding: 8,
    borderRadius: 10,
  },
  completeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
