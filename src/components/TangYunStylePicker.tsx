import { Image } from 'expo-image';
import { useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const art = {
  styles: require('../../assets/figma/tang-yun-detail/styles.svg'),
  divider: require('../../assets/figma/tang-yun-detail/thumbnails-divider.svg'),
  chevron: require('../../assets/figma/tang-yun-detail/chevron.svg'),
};

const options = [
  { name: '红糖块', index: 3, source: require('../../assets/figma/home/b4262.png'), crop: [0, -57.96, 59, 103.97] },
  { name: '桂圆红枣', index: 4, source: require('../../assets/figma/home/9f3c5.png'), crop: [-0.06, -46.98, 59.11, 89.95] },
  { name: '姜枣红糖', index: 5, source: require('../../assets/figma/tang-yun-detail/ginger-thumbnail.png'), crop: [0, -7, 59, 45] },
  { name: '小碗红糖', index: 6, source: require('../../assets/figma/home/64a20.png'), crop: [-73.32, -36.7, 144.8, 192.66] },
  { name: '礼盒包装', index: 2, source: require('../../assets/figma/tang-yun-detail/dark-photo.png'), crop: [-17.12, -1.01, 89.21, 73.04] },
  { name: '开盒展示', index: 0, source: require('../../assets/figma/tang-yun-detail/gift-thumbnail.png'), crop: [0, -3, 59, 39] },
] as const;

export type TangYunStyleOption = (typeof options)[number];

function frame([left, top, width, height]: readonly [number, number, number, number], scale: number) {
  return { position: 'absolute' as const, left: left * scale, top: top * scale, width: width * scale, height: height * scale };
}

export function TangYunStylePicker({ scale, onSelect, onMore, selectedIndex }: {
  scale: number;
  onSelect: (option: TangYunStyleOption) => void;
  onMore?: () => void;
  selectedIndex?: number;
}) {
  const list = useRef<ScrollView>(null);
  const showMore = onMore ?? (() => list.current?.scrollToEnd({ animated: true }));

  return (
    <View style={{ height: 51 * scale }}>
      <Pressable accessibilityRole="button" accessibilityLabel="款式选择" onPress={showMore} style={frame([10, 4, 86, 45], scale)}>
        <Image source={art.styles} style={frame([5, 3, 18, 18], scale)} contentFit="contain" accessible={false} />
        <Text style={[styles.label, frame([31, 3, 55, 18], scale), { fontSize: 12 * scale, letterSpacing: 0.48 * scale }]}>款式选择</Text>
        <Text style={[styles.category, frame([31, 25, 55, 16], scale), { fontSize: 10 * scale }]}>品类</Text>
      </Pressable>
      <Image source={art.divider} style={frame([95.5, 10, 1, 30], scale)} contentFit="contain" accessible={false} />
      <ScrollView ref={list} horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false} style={frame([101, 5, 236, 40], scale)}
        contentContainerStyle={{ paddingLeft: scale, gap: 5 * scale, alignItems: 'center' }}>
        {options.map((item) => (
          <Pressable key={item.name} accessibilityRole="button" accessibilityLabel={`查看${item.name}图片`} onPress={() => onSelect(item)}
            accessibilityState={{ selected: item.index === selectedIndex }}
            style={[styles.clip, { width: 59 * scale, height: 30 * scale, borderRadius: 5 * scale }]}>
            <Image source={item.source} style={frame(item.crop, scale)} contentFit="fill" accessible={false} />
            {item.index === selectedIndex && <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.outline, { borderWidth: scale, borderRadius: 5 * scale }]} />}
          </Pressable>
        ))}
      </ScrollView>
      <Pressable accessibilityRole="button" accessibilityLabel="更多款式" onPress={showMore} style={frame([337, 5, 30, 40], scale)}>
        <Image source={art.chevron} style={[frame([10, 14, 6.85, 11.96], scale), styles.flip]} contentFit="contain" accessible={false} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { color: '#5E5E5E', includeFontPadding: false },
  category: { color: '#AAAAAA', includeFontPadding: false },
  clip: { overflow: 'hidden' },
  outline: { borderColor: '#D3964B' },
  flip: { transform: [{ scaleX: -1 }] },
});
