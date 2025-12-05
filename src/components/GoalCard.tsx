import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Goal } from '../types';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';

interface GoalCardProps {
  goal: Goal;
  onPress: () => void;
}

export function GoalCard({ goal, onPress }: GoalCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="flag" size={24} color={colors.primary} />
          <Text style={styles.title} numberOfLines={2}>
            {goal.title}
          </Text>
        </View>
        
        {goal.description && (
          <Text style={styles.description} numberOfLines={2}>
            {goal.description}
          </Text>
        )}
      </View>
      
      <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
    marginLeft: spacing.md,
    flex: 1,
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
    marginLeft: 40, // Align with title (icon size + margin)
  },
});
