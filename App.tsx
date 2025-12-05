import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthProvider, GoalsProvider } from './src/contexts';
import { AppNavigator } from './src/navigation';

// Root App Component
export default function App() {
  return (
    <AuthProvider>
      <GoalsProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </GoalsProvider>
    </AuthProvider>
  );
}
