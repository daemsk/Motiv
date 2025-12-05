import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';

export function PremiumScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="star-outline" size={80} color={colors.warning} />
        <Text style={styles.title}>Premium Features</Text>
        <Text style={styles.subtitle}>
          Unlock advanced analytics and insights
        </Text>
        <Text style={styles.comingSoon}>Coming in Phase 8...</Text>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  comingSoon: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.semiBold,
  },
});
