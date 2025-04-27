// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Picker } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { v4 as uuidv4 } from 'uuid';

// const AddGoalScreen = () => {
//   const navigation = useNavigation<any>();
//   const route = useRoute<any>();
//   const { setGoals } = route.params;

//   const [title, setTitle] = useState('');
//   const [duration, setDuration] = useState('');
//   const [category, setCategory] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');

//   const handleAddGoal = () => {
//     const newGoal = { id: uuidv4(), title, duration, category, completed: false };
//     setGoals((prev: any) => [...prev, newGoal]);
//     navigation.goBack();
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Add New Goal</Text>

//       <TextInput
//         placeholder="Goal Title"
//         style={styles.input}
//         placeholderTextColor="#aaa"
//         value={title}
//         onChangeText={setTitle}
//       />

//       <TextInput
//         placeholder="Duration (e.g., 20 mins)"
//         style={styles.input}
//         placeholderTextColor="#aaa"
//         value={duration}
//         onChangeText={setDuration}
//       />

//       <View style={styles.pickerContainer}>
//         <Text style={styles.label}>Category:</Text>
//         <Picker
//           selectedValue={category}
//           style={styles.picker}
//           onValueChange={(itemValue) => setCategory(itemValue)}
//         >
//           <Picker.Item label="Daily" value="Daily" />
//           <Picker.Item label="Weekly" value="Weekly" />
//           <Picker.Item label="Monthly" value="Monthly" />
//         </Picker>
//       </View>

//       <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
//         <Text style={styles.addButtonText}>Add Goal</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#0F0F0F', padding: 20 },
//   header: { fontSize: 24, fontWeight: 'bold', color: '#a0f3e1', marginBottom: 20 },
//   input: { backgroundColor: '#1f1f1f', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 15 },
//   pickerContainer: { backgroundColor: '#1f1f1f', borderRadius: 10, marginBottom: 20, padding: 10 },
//   label: { color: '#aaa', marginBottom: 5 },
//   picker: { color: '#fff' },
//   addButton: { backgroundColor: '#d1c6ff', padding: 15, borderRadius: 10 },
//   addButtonText: { color: '#000', fontWeight: 'bold', textAlign: 'center' },
// });

// export default AddGoalScreen;
