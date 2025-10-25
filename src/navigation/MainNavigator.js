import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View, Platform, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';

// Import Main Screens
import HomeScreen from '../screens/HomeScreen';
import InsightFeedScreen from '../screens/InsightFeedScreen';
import AIRecommendScreen from '../screens/AIRecommendScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Import Auth Screens
import LoginSelectScreen from '../screens/auth/LoginSelectScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let icon;

          if (route.name === 'Home') {
            icon = '🏠';
          } else if (route.name === 'Insights') {
            icon = '📰';
          } else if (route.name === 'AIRecommend') {
            icon = '🤖';
          } else if (route.name === 'Community') {
            icon = '💬';
          } else if (route.name === 'Profile') {
            icon = '👤';
          }

          return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{
                fontSize: focused ? 24 : 20,
                includeFontPadding: false,
                textAlignVertical: 'center',
              }}>
                {icon}
              </Text>
            </View>
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          includeFontPadding: false,
          textAlignVertical: 'center',
          marginTop: -4,
          marginBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 80 : 60,
        },
        headerStyle: {
          backgroundColor: colors.primary,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.textWhite,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
          includeFontPadding: false,
          textAlignVertical: 'center',
        },
        headerTitleAlign: 'center',
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: '홈',
          headerTitle: '🤖 Ainus',
        }}
      />
      <Tab.Screen
        name="Insights"
        component={InsightFeedScreen}
        options={{
          tabBarLabel: '인사이트',
          headerTitle: '📰 AI 인사이트',
        }}
      />
      <Tab.Screen
        name="AIRecommend"
        component={AIRecommendScreen}
        options={{
          tabBarLabel: 'AI 추천',
          headerTitle: '🤖 AI 추천',
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          tabBarLabel: '커뮤니티',
          headerTitle: '💬 커뮤니티',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: '마이',
          headerTitle: '👤 마이페이지',
        }}
      />
    </Tab.Navigator>
  );
};

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginSelect" component={LoginSelectScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ fontSize: 48, marginBottom: 20 }}>🤖 Ainus</Text>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 20, color: colors.textSecondary }}>자동 로그인 확인 중...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="MainTabs" component={TabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default MainNavigator;
