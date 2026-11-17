import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { bottomTabs } from '@/data/home';

const DESIGN_WIDTH_DP = 370;
const DESIGN_BODY_HEIGHT_DP = 744;
const MAX_CONTENT_WIDTH_DP = 430;

const heroBackground = require('../../assets/figma/landmarks/scenery-hero-background.svg');
const brandBanner = require('../../assets/figma/gifts/occasion-corporate.png');
const sugarStory = require('../../assets/figma/landmarks/raw-05.jpeg');
const makerStory = require('../../assets/figma/landmarks/raw-18.jpeg');
const caneStory = require('../../assets/figma/landmarks/raw-11.jpeg');
const scenerySearchBar = require('../../assets/figma/landmarks/scenery-search-bar.svg');
const sceneryRecipeCard = require('../../assets/figma/landmarks/scenery-recipe-card.svg');

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

export default function SceneryScreen() {
  const window = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const width = Math.min(window.width, MAX_CONTENT_WIDTH_DP);
  const scale = width / DESIGN_WIDTH_DP;
  const fontScale = clamp(scale, 0.92, 1.12);
  const navHeight = 78 * scale + insets.bottom;

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={[styles.page, { width }]}>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ minHeight: DESIGN_BODY_HEIGHT_DP * scale + insets.top, paddingTop: insets.top, paddingBottom: navHeight }}
        >
          <View style={{ height: DESIGN_BODY_HEIGHT_DP * scale }}>
            <Hero scale={scale} />
            <SearchBar scale={scale} />
            <Content scale={scale} fontScale={fontScale} />
          </View>
        </ScrollView>
        <BottomNavigation scale={scale} fontScale={fontScale} bottomInset={insets.bottom} />
      </View>
    </View>
  );
}

function Hero({ scale }: { scale: number }) {
  return (
    <View style={[styles.hero, { height: 358 * scale }]}>
      <Image source={heroBackground} style={{ width: 370 * scale, height: 358 * scale }} contentFit="fill" />
    </View>
  );
}

function SearchBar({ scale }: { scale: number }) {
  return (
    <Pressable onPress={() => Alert.alert('搜索', '搜索功能规划中')} style={[styles.absolute, { left: 18 * scale, top: 60 * scale, width: 336 * scale, height: 43 * scale }]} accessibilityRole="button" accessibilityLabel="搜索">
      <Image source={scenerySearchBar} style={{ width: 336 * scale, height: 43 * scale }} contentFit="fill" />
    </Pressable>
  );
}

function Content({ scale, fontScale }: ScaleProps) {
  const [selectedTab, setSelectedTab] = useState('故事');
  const planned = useCallback((label: string) => Alert.alert(label, '功能规划中'), []);
  const stories = [
    { tag: '糖艺', title: '一块糖的慢工艺', image: sugarStory, position: { left: '74%', top: '22%' } as const },
    { tag: '匠人', title: '守着甘甜的人', image: makerStory, position: { left: '76%', top: '24%' } as const },
    { tag: '甘蔗', title: '鱼坝村甘蔗田', image: caneStory, position: { left: '54%', top: '48%' } as const },
  ];
  const tabs = ['故事', '匠人', '甘蔗', '食谱', '云游'];

  return (
    <View style={[styles.contentSheet, styles.absolute, { left: 10 * scale, top: 315 * scale, width: 350 * scale, height: 507 * scale, borderRadius: 20 * scale }]}>
      <Pressable onPress={() => planned('品牌故事')} style={[styles.brandCard, { left: 10 * scale, top: 14 * scale, width: 326 * scale, height: 109 * scale, borderRadius: 12 * scale }]}>
        <Image source={brandBanner} style={StyleSheet.absoluteFill} contentFit="fill" />
        <Text style={[styles.brandTitle, { left: 17 * scale, top: 15 * scale, fontSize: 16 * fontScale }]}>巧家 · 品牌风物</Text>
        <Text style={[styles.brandSub, { left: 17 * scale, top: 41 * scale, fontSize: 10 * fontScale }]}>崖香入釜  岁月成糖</Text>
        <View style={[styles.brandButton, { left: 18 * scale, bottom: 13 * scale, width: 70 * scale, height: 21 * scale, borderRadius: 11 * scale }]}><Text style={[styles.brandButtonText, { fontSize: 8 * fontScale }]}>点击了解</Text></View>
      </Pressable>

      <View style={[styles.tabRow, { left: 14 * scale, top: 138 * scale, width: 322 * scale, height: 24 * scale }]}>
        {tabs.map((tab) => {
          const selected = selectedTab === tab;
          return <Pressable key={tab} onPress={() => setSelectedTab(tab)} style={[styles.filterTab, { width: 54 * scale, height: 23 * scale, borderRadius: 12 * scale, backgroundColor: selected ? '#731813' : '#F0E4D9' }]}><Text style={[styles.filterText, { fontSize: 10 * fontScale, color: selected ? '#FFFDF9' : '#98502C', fontWeight: selected ? '700' : '400' }]}>{tab}</Text></Pressable>;
        })}
      </View>

      <SectionLabel title="品牌故事" top={177} scale={scale} fontScale={fontScale} onPress={() => planned('品牌故事')} />
      <View style={[styles.storyRow, { left: 14 * scale, top: 203 * scale, gap: 10 * scale }]}>
        {stories.map((story) => (
          <Pressable key={story.title} onPress={() => planned(story.title)} style={[styles.storyCard, { width: 100 * scale, height: 96 * scale, borderRadius: 12 * scale, padding: 6 * scale }]}>
            <Image source={story.image} style={{ width: 88 * scale, height: 45 * scale, borderRadius: 8 * scale }} contentFit="cover" contentPosition={story.position} />
            <View style={[styles.storyTag, { marginTop: 5 * scale, width: 31 * scale, height: 11 * scale, borderRadius: 4 * scale }]}><Text style={[styles.storyTagText, { fontSize: 5.5 * fontScale }]}>{story.tag}</Text></View>
            <Text numberOfLines={1} style={[styles.storyTitle, { marginTop: 3 * scale, fontSize: 9 * fontScale }]}>{story.title}</Text>
          </Pressable>
        ))}
      </View>

      <SectionLabel title="风物食谱" top={312} scale={scale} fontScale={fontScale} onPress={() => planned('风物食谱')} />
      <Pressable onPress={() => planned('桂花红糖烤梨')} style={[styles.recipeCard, { left: 10 * scale, top: 341 * scale, width: 326 * scale, height: 76 * scale, borderRadius: 12 * scale }]}>
        <Image source={sceneryRecipeCard} style={{ width: 326 * scale, height: 76 * scale }} contentFit="fill" />
      </Pressable>
    </View>
  );
}

function SectionLabel({ title, top, scale, fontScale, onPress }: ScaleProps & { title: string; top: number; onPress: () => void }) {
  return <View style={[styles.sectionLabel, { left: 14 * scale, top: top * scale, width: 322 * scale, height: 20 * scale }]}><Text style={[styles.sectionTitle, { fontSize: 16 * fontScale }]}>{title}</Text><Pressable onPress={onPress} style={styles.moreButton}><Text style={[styles.moreText, { fontSize: 12 * fontScale }]}>更多 ›</Text></Pressable></View>;
}

function BottomNavigation({ scale, fontScale, bottomInset }: ScaleProps & { bottomInset: number }) {
  const router = useRouter();
  const onPress = useCallback((id: string, label: string) => {
    if (id === 'culture') return;
    if (id === 'home') { router.replace('/'); return; }
    if (id === 'notes') { router.replace('/notes'); return; }
    if (id === 'gifts') { router.replace('/gifts'); return; }
    if (id === 'profile') { router.replace('/profile'); return; }
    Alert.alert(label, '功能规划中');
  }, [router]);
  return <View style={[styles.bottomNav, { height: 78 * scale + bottomInset, paddingBottom: bottomInset }]}>{bottomTabs.map((tab) => {
    const selected = tab.id === 'culture';
    return <Pressable key={tab.id} style={styles.bottomTab} onPress={() => onPress(tab.id, tab.label)} accessibilityRole="tab" accessibilityState={{ selected }}><Image source={tab.image} style={{ width: 40 * scale, height: 40 * scale }} contentFit="contain" /><Text style={[styles.bottomLabel, { fontSize: 9.4 * fontScale, color: selected ? '#731813' : '#9D8B82', fontWeight: selected ? '700' : '400' }]}>{tab.label}</Text></Pressable>;
  })}</View>;
}

type ScaleProps = { scale: number; fontScale: number };

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', backgroundColor: '#E4B580' },
  page: { flex: 1, overflow: 'hidden', backgroundColor: '#E4B580' },
  absolute: { position: 'absolute' },
  hero: { position: 'absolute', left: 0, right: 0, top: 0, overflow: 'hidden' },
  searchBar: { position: 'absolute', backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#F0E4D9', justifyContent: 'center' },
  searchInput: { position: 'absolute', height: '100%', color: '#614545', letterSpacing: 1.2, padding: 0 },
  searchButton: { position: 'absolute', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#D5A06E' },
  searchButtonText: { color: '#FFFFFF', fontWeight: '700', letterSpacing: 1.8 },
  contentSheet: { position: 'absolute', backgroundColor: '#FFFCF6', overflow: 'hidden' },
  brandCard: { position: 'absolute', overflow: 'hidden' },
  brandTitle: { position: 'absolute', color: '#3A1915', fontWeight: '700', letterSpacing: 1.6 },
  brandSub: { position: 'absolute', color: '#614545', letterSpacing: 0.8 },
  brandButton: { position: 'absolute', backgroundColor: '#C4894A', alignItems: 'center', justifyContent: 'center' },
  brandButtonText: { color: '#FFFFFF', fontWeight: '700', letterSpacing: 0.8 },
  tabRow: { position: 'absolute', flexDirection: 'row', justifyContent: 'space-between' },
  filterTab: { alignItems: 'center', justifyContent: 'center' },
  filterText: { letterSpacing: 1.4 },
  sectionLabel: { position: 'absolute', flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { color: '#3A1915', fontWeight: '700' },
  moreButton: { marginLeft: 'auto', height: '100%', justifyContent: 'center' },
  moreText: { color: '#7D6C62' },
  storyRow: { position: 'absolute', flexDirection: 'row' },
  storyCard: { overflow: 'hidden', backgroundColor: '#F5E1CF' },
  storyTag: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF5E8' },
  storyTagText: { color: '#731813', fontWeight: '700', letterSpacing: 0.8 },
  storyTitle: { color: '#3A1915', fontWeight: '700' },
  recipeCard: { position: 'absolute', overflow: 'hidden' },
  bottomNav: { position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 20, flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FFFDF9', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E6D9D1' },
  bottomTab: { flex: 1, alignItems: 'center', justifyContent: 'flex-start' },
  bottomLabel: { marginTop: -5 },
});
