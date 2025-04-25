import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform, StyleSheet } from 'react-native';

// Import auth screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ProfileSetupScreen from '../screens/auth/ProfileSetupScreen';

// Import main screens
import MusicScreen from '../screens/MusicScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChartsScreen from '../screens/ChartsScreen';

// Import auth context
import { useAuth } from '../context/AuthContext';

// Import theme and strings
import { COLORS, FONTS } from '../styles/theme';
import { APP_STRINGS } from '../constants/strings';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Кастомный компонент для лейбла таба
const TabLabel = ({ focused, color, children }) => (
  <Text 
    style={{ 
      color, 
      fontSize: 12, 
      fontWeight: focused ? '600' : '400',
      marginTop: 2
    }}
  >
    {children}
  </Text>
);

// Auth navigator for unauthenticated users
const AuthNavigator = () => (
  <Stack.Navigator 
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: COLORS.BACKGROUND },
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
  </Stack.Navigator>
);

// Tab navigator for main app screens
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: COLORS.BACKGROUND_SECONDARY,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
        borderTopWidth: 1,
        elevation: 0,
        height: Platform.OS === 'ios' ? 88 : 68,
        paddingBottom: Platform.OS === 'ios' ? 28 : 16,
        paddingTop: 8,
      },
      tabBarLabel: () => null,
      tabBarIcon: ({ focused }) => {
        let iconName;

        if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        } else if (route.name === 'Music') {
          iconName = focused ? 'musical-notes' : 'musical-notes-outline';
        } else if (route.name === 'Charts') {
          iconName = focused ? 'stats-chart' : 'stats-chart-outline';
        } else if (route.name === 'Settings') {
          iconName = focused ? 'settings' : 'settings-outline';
        }

        return (
          <View style={styles.tabIconContainer}>
            <Ionicons 
              name={iconName} 
              size={24} 
              color={focused ? COLORS.PRIMARY : COLORS.TEXT_SECONDARY} 
            />
            {focused && <View style={styles.dot} />}
          </View>
        );
      },
      tabBarHideOnKeyboard: true,
    })}
    initialRouteName="Profile"
    backBehavior="history"
  >
    <Tab.Screen name="Profile" component={ProfileScreen} />
    <Tab.Screen name="Music" component={MusicScreen} />
    <Tab.Screen name="Charts" component={ChartsScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

// Main app navigator for authenticated users
const AppNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: COLORS.BACKGROUND },
    }}
  >
    <Stack.Screen name="MainTabs" component={TabNavigator} />
  </Stack.Navigator>
);

// Root navigator
const RootNavigator = () => {
  const { isAuthenticated, needsProfileSetup, loading } = useAuth();

  if (loading) {
    // You can create a dedicated splash screen later
    return null;
  }

  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: COLORS.PRIMARY,
          background: COLORS.BACKGROUND,
          card: COLORS.BACKGROUND_SECONDARY,
          text: COLORS.TEXT_PRIMARY,
          border: COLORS.BORDER,
          notification: COLORS.PRIMARY,
        }
      }}
    >
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : (
        <AppNavigator />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    width: 42,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.PRIMARY,
    position: 'absolute',
    bottom: 0,
  },
});

export default RootNavigator; 