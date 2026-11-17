import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const titles: Record<string, string> = {
  flavor: '口味手札',
  scene: '场景手札',
  recipe: '食谱手札',
};

export default function JournalPlaceholderScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { entry } = useLocalSearchParams<{ entry: string }>();
  const title = titles[entry] ?? '手札';

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <StatusBar style="dark" />
      <Pressable onPress={() => router.back()} style={styles.back} accessibilityRole="button">
        <Text style={styles.backText}>‹ 返回</Text>
      </Pressable>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>功能规划中</Text>
        <Text style={styles.hint}>后续将根据设计稿补充这个页面。</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF8EF' },
  back: { alignSelf: 'flex-start', paddingHorizontal: 22, paddingVertical: 8 },
  backText: { color: '#731813', fontSize: 16, fontWeight: '600' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  title: { color: '#4D2924', fontSize: 25, fontWeight: '700' },
  description: { color: '#731813', fontSize: 18, fontWeight: '700', marginTop: 20 },
  hint: { color: '#91766A', fontSize: 14, marginTop: 10 },
});
