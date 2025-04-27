// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { router } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// interface AuthContextType {
//   isLoggedIn: boolean;
//   login: () => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const checkLoginStatus = async () => {
//       const token = await AsyncStorage.getItem('user-token');
//       if (token) {
//         setIsLoggedIn(true);
//       }
//     };
//     checkLoginStatus();
//   }, []);

//   const login = async () => {
//     await AsyncStorage.setItem('user-token', 'loggedin');
//     setIsLoggedIn(true);
//     router.replace('/(tabs)/dashboard'); // redirect to Dashboard
//   };

//   const logout = async () => {
//     await AsyncStorage.removeItem('user-token');
//     setIsLoggedIn(false);
//     router.replace('/(auth)/login'); // back to login
//   };

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used inside AuthProvider');
//   }
//   return context;
// };
