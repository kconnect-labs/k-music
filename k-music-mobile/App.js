import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { MusicProvider } from './src/contexts/MusicContext';
import RootNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/styles/theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <MusicProvider>
          <StatusBar style="light" backgroundColor={COLORS.BACKGROUND} />
          <RootNavigator />
        </MusicProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
