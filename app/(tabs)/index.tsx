import { Redirect } from 'expo-router';
import { useUser } from '@/context/UserContext';

export default function Index() {
  const { user } = useUser();

  if (user) {
    return <Redirect href="/(tabs)/dashboard" />;
  } else {
    return <Redirect href="/(auth)/signup" />;  // Or login, your choice
  }
}
