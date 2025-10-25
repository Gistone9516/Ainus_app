import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';
import { colors } from '../theme/colors';

// Import Screens
import HomeScreen from '../screens/HomeScreen';
import InsightFeedScreen from '../screens/InsightFeedScreen';
import AIRecommendScreen from '../screens/AIRecommendScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ProfileScreen from '../screens/ProfileScreen';

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

          return <Text style={{ fontSize: focused ? 24 : 20 }}>{icon}</Text>;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.textWhite,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
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

const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
