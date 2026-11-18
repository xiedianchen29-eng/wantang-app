import { Image } from 'expo-image';
import { hide } from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

const mark = require('../../assets/branding/startup-mark.png');
const displayDurationMs = 2000;
const imageLoadTimeoutMs = 1200;

export function StartupScreen({ onFinished }: { onFinished: () => void }) {
  const { width } = useWindowDimensions();
  const scale = Math.min(width, 430) / 370;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setReady(true), imageLoadTimeoutMs);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!ready) return;
    hide();
    const timeout = setTimeout(onFinished, displayDurationMs);
    return () => clearTimeout(timeout);
  }, [onFinished, ready]);

  return (
    <View style={[StyleSheet.absoluteFill, styles.screen]} accessibilityViewIsModal>
      <StatusBar hidden />
      <Image source={mark} accessible accessibilityLabel="碗糖时序正在启动" contentFit="contain"
        onDisplay={() => setReady(true)} onError={() => setReady(true)}
        style={{
          width: 160 * scale,
          height: 160 * scale,
          transform: [{ translateX: 7.53 * scale }, { translateY: -36 * scale }],
        }} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', zIndex: 1 },
});
