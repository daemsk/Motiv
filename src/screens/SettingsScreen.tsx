import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks';
import { colors, spacing, typography, borderRadius } from '../theme';

export function SettingsScreen() {
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    console.log('handleSignOut called');
    try {
      await signOut();
      console.log('signOut() completed successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={24} color={colors.textSecondary} />
            <Text style={styles.infoText}>{user?.email || 'No email'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Info</Text>
          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={24} color={colors.textSecondary} />
            <Text style={styles.infoText}>Version 1.0.0</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.signOutButton}
          onPress={() => {
            console.log('Sign out button pressed');
            handleSignOut();
          }}
        >
          <Ionicons name="log-out-outline" size={24} color={colors.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  content: {
    padding: spacing.lg,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  infoText: {
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
    marginLeft: spacing.md,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.error,
  },
  signOutText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.error,
    marginLeft: spacing.sm,
  },
});
