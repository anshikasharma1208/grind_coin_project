import React,{ useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Dashboard() {
  const [goals, setGoals] = useState([
    { title: 'Learn Guitar 🎸', deadline: '30 May',duration: '1 hour'  },
    { title: 'Fitness Challenge 💪', deadline: '10 June', duration: '45 mins'  },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');
  const [newGoalDuration, setNewGoalDuration] = useState('');
  const [newGoalTag, setNewGoalTag] = useState('Daily');
  const addGoal = () => {
    if (newGoalTitle.trim() !== '' && newGoalDeadline.trim() !== '') {
      setGoals([...goals, { title: newGoalTitle, deadline: newGoalDeadline, duration: newGoalDuration }]);
      setNewGoalTitle('');
      setNewGoalDeadline('');
      setNewGoalTag('Daily');
      setModalVisible(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/women/1.jpg' }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.welcomeText}>Welcome!</Text>
            <Text style={styles.nameText}>Jane Doe</Text>
          </View>
        </View>
        <Ionicons name="menu" size={28} color="white" />
      </View>

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="gray" style={{ marginHorizontal: 8 }} />
        <TextInput placeholder="Search a goal..." placeholderTextColor="gray" style={styles.searchInput} />
      </View>

      {/* Add Goal Section */}
      <TouchableOpacity style={styles.addGoalBox} onPress={() => setModalVisible(true)}>
        <Ionicons name="add-circle" size={60} color="#fff" />
        <Text style={styles.addGoalText}>Add New Goal</Text>
      </TouchableOpacity>

      {/* Modal for Adding Goal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {goals.map((goal, index) => (
          <View key={index} style={styles.goalCard}>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <Text style={styles.goalDeadline}>Complete by: {goal.deadline}</Text>
            <Text style={styles.goalDuration}>Duration: {goal.duration}</Text>
          </View>
        ))}
       
      </ScrollView>

      {/* Last Goals / History */}
      <Text style={styles.sectionTitle}>Last Completed Goals</Text>
      <View style={styles.historyItem}>
        <Ionicons name="checkmark-circle" size={24} color="#a0f3e1" />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.historyTitle}>Meditation Habit</Text>
          <Text style={styles.historyDate}>Completed on: 20 April</Text>
        </View>
      </View>

      <View style={styles.historyItem}>
        <Ionicons name="checkmark-circle" size={24} color="#a0f3e1" />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.historyTitle}>Daily Journaling</Text>
          <Text style={styles.historyDate}>Completed on: 15 April</Text>
        </View>
      </View>

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
  goalDuration: {
    marginTop: 6,
    color: '#555',
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
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F1F',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  historyTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyDate: {
    color: 'gray',
    fontSize: 12,
    marginTop: 4,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
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
});
