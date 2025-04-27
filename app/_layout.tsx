import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === 'dashboard') {
            iconName = 'home';
          } else if (route.name === 'goals') {
            iconName = 'list';
          } else if (route.name === 'add') {
            iconName = 'add-circle';
          } else if (route.name === 'progress') {
            iconName = 'bar-chart';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00FFFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#0F0F0F' },
        headerShown: false,
      })}
    >
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="goals" />
      <Tabs.Screen name="add" />
      <Tabs.Screen name="progress" />
    </Tabs>
  );
}
