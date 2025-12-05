import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAuth } from '@/hooks';
import { Button, Input } from '@/components';

export const AuthScreen: React.FC = () => {
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle sign in
  const handleSignIn = async () => {
    // Reset error
    setEmailError('');

    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email.trim())) {
      setEmailError('Please enter a valid email address');
      return;
    }

    try {
      await signIn(email.trim().toLowerCase());
      setMagicLinkSent(true);
      Alert.alert(
        'Check your email',
        `We sent a magic link to ${email}. Click the link to sign in.`,
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      console.error('Sign in error:', error);
      Alert.alert(
        'Sign in failed',
        error.message || 'Something went wrong. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  if (magicLinkSent) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>
            We sent a magic link to{'\n'}
            <Text style={styles.email}>{email}</Text>
          </Text>
          <Text style={styles.instructions}>
            Click the link in the email to sign in.{'\n'}
            You can close this screen.
          </Text>
          <Button
            title="Send another link"
            variant="secondary"
            onPress={() => setMagicLinkSent(false)}
            style={styles.button}
          />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Motiv</Text>
        <Text style={styles.subtitle}>
          Sign in with your email to get started
        </Text>

        <Input
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError('');
          }}
          error={emailError}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
          style={styles.input}
        />

        <Button
          title="Sign in with Magic Link"
          onPress={handleSignIn}
          loading={loading}
          style={styles.button}
        />

        <Text style={styles.disclaimer}>
          We'll send you a magic link to sign in.{'\n'}
          No password needed.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 22,
  },
  email: {
    fontWeight: '600',
    color: '#007AFF',
  },
  instructions: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 22,
  },
  input: {
    marginBottom: 24,
  },
  button: {
    marginBottom: 16,
  },
  disclaimer: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
});
