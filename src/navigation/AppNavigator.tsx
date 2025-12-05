import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts';

// Import screens
import { AuthScreen } from '../screens/AuthScreen';
import { GoalsListScreen } from '../screens/GoalsListScreen';
import { GoalDetailScreen } from '../screens/GoalDetailScreen';
import { AddGoalScreen } from '../screens/AddGoalScreen';
import { AddHabitScreen } from '../screens/AddHabitScreen';
import { DailyDashboardScreen } from '../screens/DailyDashboardScreen';
import { PremiumScreen } from '../screens/PremiumScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

// Navigation types
export type MainTabParamList = {
  GoalsTab: undefined;
  DashboardTab: undefined;
  PremiumTab: undefined;
  SettingsTab: undefined;
};

export type GoalsStackParamList = {
  GoalsList: undefined;
  GoalDetail: { goalId: string; goalTitle: string };
  AddGoal: undefined;
  EditGoal: { goalId: string };
  AddHabit: { goalId: string; goalTitle: string };
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const GoalsStack = createNativeStackNavigator<GoalsStackParamList>();

// Goals Stack Navigator
function GoalsNavigator() {
  return (
    <GoalsStack.Navigator
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTintColor: '#007AFF',
      }}
    >
      <GoalsStack.Screen
        name="GoalsList"
        component={GoalsListScreen}
        options={{ title: 'Goals' }}
      />
      <GoalsStack.Screen
        name="GoalDetail"
        component={GoalDetailScreen}
        options={({ route }) => ({ title: route.params.goalTitle })}
      />
      <GoalsStack.Screen
        name="AddGoal"
        component={AddGoalScreen}
        options={{ title: 'New Goal', presentation: 'modal' }}
      />
      <GoalsStack.Screen
        name="AddHabit"
        component={AddHabitScreen}
        options={({ route }) => ({
          title: `Add Habit to ${route.params.goalTitle}`,
          presentation: 'modal',
        })}
      />
    </GoalsStack.Navigator>
  );
}

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'GoalsTab') {
            iconName = focused ? 'flag' : 'flag-outline';
          } else if (route.name === 'DashboardTab') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'PremiumTab') {
            iconName = focused ? 'star' : 'star-outline';
          } else {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          paddingTop: 4,
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="GoalsTab"
        component={GoalsNavigator}
        options={{ tabBarLabel: 'Goals' }}
      />
      <Tab.Screen
        name="DashboardTab"
        component={DailyDashboardScreen}
        options={{ tabBarLabel: 'Dashboard' }}
      />
      <Tab.Screen
        name="PremiumTab"
        component={PremiumScreen}
        options={{ tabBarLabel: 'Premium' }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{ tabBarLabel: 'Settings' }}
      />
    </Tab.Navigator>
  );
}

// Loading component
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

// Root Navigator - conditionally renders Auth or Main based on auth state
export function AppNavigator() {
  const { user, loading } = useAuth();

  console.log('AppNavigator render:', { user: !!user, loading });

  return (
    <NavigationContainer>
      {loading ? (
        <LoadingScreen />
      ) : user ? (
        <MainTabs />
      ) : (
        <AuthScreen />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
