import { useFocusEffect } from 'expo-router';
import { type PropsWithChildren, useCallback, useRef, useState } from 'react';
import { type StyleProp, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DESIGN_NAV_TOP_DP = 744;
const MIN_HEADER_GAP_DP = 12;

type MainPageScrollProps = PropsWithChildren<{
  scale: number;
  topGap: number;
  bodyHeight?: number;
  style?: StyleProp<ViewStyle>;
}>;

export function MainPageScroll({ children, scale, topGap, bodyHeight, style }: MainPageScrollProps) {
  const { top } = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [viewportHeight, setViewportHeight] = useState(0);
  // The reference includes the native insets. Fit shorter viewports using the leading blank space.
  const shortfall = viewportHeight > 0 ? DESIGN_NAV_TOP_DP * scale - viewportHeight : 0;
  const headerTrim = Math.min(Math.max(top, shortfall), (topGap - MIN_HEADER_GAP_DP) * scale);

  useFocusEffect(useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []));

  return (
    <ScrollView
      ref={scrollRef}
      onLayout={({ nativeEvent }) => setViewportHeight(nativeEvent.layout.height)}
      style={[styles.scroll, style, { marginTop: top }]}
      contentInsetAdjustmentBehavior="never"
      bounces={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 8 * scale }}
    >
      <View style={{ marginTop: -headerTrim, height: bodyHeight === undefined ? undefined : bodyHeight * scale }}>
        {children}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({ scroll: { flex: 1 } });
