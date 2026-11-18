import { Stack } from 'expo-router';
import { preventAutoHideAsync } from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { StartupScreen } from '@/components/StartupScreen';

void preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [startupVisible, setStartupVisible] = useState(true);
  const finishStartup = useCallback(() => setStartupVisible(false), []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={styles.app} importantForAccessibility={startupVisible ? 'no-hide-descendants' : 'auto'}
        accessibilityElementsHidden={startupVisible}>
        <Stack screenOptions={{ headerShown: false, animation: 'none' }} />
      </View>
      {startupVisible && <StartupScreen onFinished={finishStartup} />}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1 },
});
