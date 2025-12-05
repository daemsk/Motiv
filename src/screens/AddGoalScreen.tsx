import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useGoalsContext } from '../contexts';
import { Button } from '../components/Button';
import { GoalsStackParamList } from '../navigation/AppNavigator';
import { colors, spacing, typography, borderRadius } from '../theme';

type NavigationProp = NativeStackNavigationProp<GoalsStackParamList, 'AddGoal'>;

export function AddGoalScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { createGoal } = useGoalsContext();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    setTitleError('');

    if (!title.trim()) {
      setTitleError('Goal title is required');
      return false;
    }

    if (title.trim().length < 3) {
      setTitleError('Goal title must be at least 3 characters');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const newGoal = await createGoal(title.trim(), description.trim() || undefined);
      
      if (newGoal) {
        navigation.goBack();
        // Optionally navigate to the new goal detail
        // navigation.replace('GoalDetail', { goalId: newGoal.id, goalTitle: newGoal.title });
      } else {
        Alert.alert('Error', 'Failed to create goal. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.label}>Goal Title *</Text>
          <TextInput
            style={[styles.input, titleError && styles.inputError]}
            placeholder="e.g., Get fit, Learn Spanish, Read more books"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              setTitleError('');
            }}
            editable={!loading}
            maxLength={100}
          />
          {titleError ? (
            <Text style={styles.errorText}>{titleError}</Text>
          ) : null}

          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add more details about your goal..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!loading}
            maxLength={500}
          />
          <Text style={styles.characterCount}>
            {description.length}/500
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Cancel"
          variant="secondary"
          onPress={handleCancel}
          disabled={loading}
          style={styles.button}
        />
        <Button
          title="Save Goal"
          onPress={handleSave}
          loading={loading}
          style={styles.button}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: spacing.lg,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.error,
  },
  textArea: {
    minHeight: 120,
    paddingTop: spacing.md,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.xs,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
  characterCount: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  button: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
});
