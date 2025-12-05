import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useGoalsContext } from '../contexts';
import { GoalsStackParamList } from '../navigation/AppNavigator';
import { colors, spacing, typography, borderRadius } from '../theme';

type GoalDetailRouteProp = RouteProp<GoalsStackParamList, 'GoalDetail'>;
type NavigationProp = NativeStackNavigationProp<GoalsStackParamList, 'GoalDetail'>;

export function GoalDetailScreen() {
  const route = useRoute<GoalDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { goals } = useGoalsContext();
  const { goalId, goalTitle } = route.params;

  const goal = goals.find((g) => g.id === goalId);

  const handleAddHabit = () => {
    navigation.navigate('AddHabit', { goalId, goalTitle });
  };

  if (!goal) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={64} color={colors.error} />
        <Text style={styles.errorText}>Goal not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="flag" size={48} color={colors.primary} />
          <Text style={styles.title}>{goal.title}</Text>
          {goal.description && (
            <Text style={styles.description}>{goal.description}</Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Habits</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddHabit}
            >
              <Ionicons name="add" size={20} color={colors.primary} />
              <Text style={styles.addButtonText}>Add Habit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.emptyHabits}>
            <Ionicons name="checkmark-circle-outline" size={64} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>No habits yet</Text>
            <Text style={styles.emptySubtitle}>
              Add daily habits to track your progress toward this goal
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.fab}>
        <TouchableOpacity
          style={styles.fabButton}
          onPress={handleAddHabit}
        >
          <Ionicons name="add" size={32} color={colors.white} />
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.xl,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  description: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: typography.fontSize.md * typography.lineHeight.normal,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.sm,
  },
  addButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  emptyHabits: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  errorText: {
    fontSize: typography.fontSize.md,
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xl,
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
