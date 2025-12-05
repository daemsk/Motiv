import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';
import { Button } from '@/components';
import * as WebBrowser from "expo-web-browser";


export function PremiumScreen() {
  const CHECKOUT_URL = "https://buy.stripe.com/test_5kQaEX1xU2IC3kl9Wpds400"
  const handlePress = async () => {
    await WebBrowser.openBrowserAsync(CHECKOUT_URL);
  };
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="star-outline" size={80} color={colors.warning} />
        <Text style={styles.title}>Premium Features</Text>
        <Text style={styles.subtitle}>
          Unlock advanced analytics and insights
        </Text>
        <Button title="Buy Now" onPress={handlePress}/>
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
