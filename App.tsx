import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { AuthProvider, useAuth } from '@/contexts';
import { AuthScreen } from '@/screens';

// Main App Content (wrapped in AuthProvider)
function AppContent() {
  const { user, loading } = useAuth();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Show auth screen if not authenticated
  if (!user) {
    return <AuthScreen />;
  }

  // Show placeholder for authenticated state (will be replaced with navigation)
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to Motiv, {user.email}!</Text>
      <Text style={styles.placeholderText}>
        Main app screens coming in Phase 3...
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

// Root App Component
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 12,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
