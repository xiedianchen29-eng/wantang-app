import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const tabs = [
  { id: 'home', href: '/', label: '首页', image: require('../../assets/figma/home/37cc5.png') },
  { id: 'notes', href: '/notes', label: '手札', image: require('../../assets/figma/home/d95b8.png') },
  { id: 'gifts', href: '/gifts', label: '礼事', image: require('../../assets/figma/home/620bb.png') },
  { id: 'culture', href: '/scenery', label: '风物', image: require('../../assets/figma/home/425a6.png') },
  { id: 'profile', href: '/profile', label: '我的', image: require('../../assets/figma/home/7fa70.png') },
] as const;

type BottomNavigationProps = {
  currentTab: (typeof tabs)[number]['id'];
  scale: number;
  fontScale: number;
};

export function BottomNavigation({ currentTab, scale, fontScale }: BottomNavigationProps) {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { height: 62 * scale + bottom, paddingTop: 3 * scale, paddingBottom: bottom }]}>
      {tabs.map((tab) => {
        const selected = tab.id === currentTab;
        return (
          <Pressable
            key={tab.id}
            style={styles.tab}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected }}
            onPress={() => {
              if (!selected) router.replace(tab.href);
            }}
          >
            <Image source={tab.image} style={{ width: 40 * scale, height: 40 * scale }} contentFit="contain" accessible={false} />
            <Text style={[styles.label, selected && styles.selectedLabel, { fontSize: 9.4 * fontScale }]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexShrink: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFDF9',
    borderTopColor: '#E6D9D1',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tab: { flex: 1, alignItems: 'center' },
  label: { marginTop: -3, color: '#9D8B82' },
  selectedLabel: { color: '#731813', fontWeight: '700' },
});
