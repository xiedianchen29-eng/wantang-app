import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, AppState, type NativeScrollEvent, type NativeSyntheticEvent, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { BottomNavigation } from '@/components/BottomNavigation';
import { MainPageScroll } from '@/components/MainPageScroll';

const DESIGN_WIDTH_DP = 370;
const DESIGN_BODY_HEIGHT_DP = 744;
const MAX_CONTENT_WIDTH_DP = 430;
const CONTENT_SHEET_WIDTH_DP = 350;
const BRAND_BANNER_WIDTH_DP = 325;
const BRAND_BANNER_HEIGHT_DP = 109;

const HERO_AUTOPLAY_MS = 5000;
const HERO_INITIAL_INDEX = 2;
const HERO_SETTLE_MS = 120;
const HERO_SCROLL_TIMEOUT_MS = 900;
const SCENERY_SKY = '#E4B580';
const SCENERY_SURFACE = '#FFFCF6';
const heroSlides = [
  { source: require('../../assets/figma/landmarks/scenery-hero-slide-01.png'), label: '红糖暖饮', left: -22, top: 83, width: 415, height: 273 },
  { source: require('../../assets/figma/landmarks/scenery-hero-slide-02.png'), label: '姜片与红糖', left: 0, top: 72.5, width: 370, height: 274 },
  { source: require('../../assets/figma/landmarks/scenery-hero-slide-03.png'), label: '彩色甘蔗田', hasGradient: true },
  { source: require('../../assets/figma/landmarks/scenery-hero-slide-04.png'), label: '甘蔗田版画', left: 0, top: 99, width: 370, height: 263 },
] as const;
const heroPages = [heroSlides[heroSlides.length - 1], ...heroSlides, heroSlides[0]];
const brandBanner = require('../../assets/figma/landmarks/scenery-brand-banner-centered.png');
const brandStoriesArtwork = require('../../assets/figma/landmarks/scenery-brand-stories.png');
const brandStories = [
  { tag: '糖艺', title: '一块糖的慢工艺' },
  { tag: '匠人', title: '守着甘甜的人' },
  { tag: '甘蔗', title: '鱼坝村甘蔗田' },
];
const scenerySearchBar = require('../../assets/figma/landmarks/scenery-search-bar.svg');
const sceneryRecipeCard = require('../../assets/figma/landmarks/scenery-recipe-card.svg');

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

export default function SceneryScreen() {
  const window = useWindowDimensions();
  const width = Math.min(window.width, MAX_CONTENT_WIDTH_DP);
  const scale = width / DESIGN_WIDTH_DP;
  const fontScale = clamp(scale, 0.92, 1.12);

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={[styles.page, { width }]}>
        <MainPageScroll scale={scale} topGap={60} bodyHeight={DESIGN_BODY_HEIGHT_DP} style={styles.scroll}>
          <Hero scale={scale} />
          <SearchBar scale={scale} />
          <Content scale={scale} fontScale={fontScale} />
        </MainPageScroll>
        <BottomNavigation currentTab="culture" scale={scale} fontScale={fontScale} />
      </View>
    </View>
  );
}

function Hero({ scale }: { scale: number }) {
  const width = DESIGN_WIDTH_DP * scale;
  const height = 358 * scale;
  const [activeIndex, setActiveIndex] = useState(HERO_INITIAL_INDEX);
  const scroll = useRef<ScrollView>(null);
  const page = useRef(HERO_INITIAL_INDEX + 1);
  const offset = useRef((HERO_INITIAL_INDEX + 1) * width);
  const touch = useRef(false);
  const lastScrollAt = useRef(0);
  const lastInteractionAt = useRef(0);
  const settling = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const initialOffset = useMemo(() => ({ x: page.current * width, y: 0 }), [width]);

  const settle = useCallback(() => {
    clearTimeout(settling.current);
    if (touch.current) return;
    const slot = clamp(Math.round(offset.current / width), 0, heroPages.length - 1);
    // The first/last pages are copies. Jump to the matching real page only once motion stops.
    const realSlot = slot === 0 ? heroSlides.length : slot === heroPages.length - 1 ? 1 : slot;
    page.current = realSlot;
    setActiveIndex(realSlot - 1);
    const target = realSlot * width;
    if (Math.abs(offset.current - target) > 1) {
      offset.current = target;
      scroll.current?.scrollTo({ x: target, animated: false });
    }
  }, [width]);

  const moveSlide = useCallback((direction: number) => {
    lastInteractionAt.current = Date.now();
    scroll.current?.scrollTo({ x: (page.current + direction) * width, animated: true });
    clearTimeout(settling.current);
    settling.current = setTimeout(settle, HERO_SCROLL_TIMEOUT_MS);
  }, [settle, width]);

  useEffect(() => {
    offset.current = initialOffset.x;
  }, [initialOffset]);

  useFocusEffect(useCallback(() => {
    lastInteractionAt.current = Date.now();
    const timer = setInterval(() => {
      const now = Date.now();
      if (AppState.currentState === 'active'
        && !touch.current
        && now - Math.max(lastScrollAt.current, lastInteractionAt.current) >= HERO_AUTOPLAY_MS) {
        moveSlide(1);
      }
    }, 250);
    return () => {
      clearInterval(timer);
      clearTimeout(settling.current);
      touch.current = false;
      settle();
    };
  }, [moveSlide, settle]));

  const onScroll = useCallback(({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
    offset.current = nativeEvent.contentOffset.x;
    lastScrollAt.current = Date.now();
    const slot = clamp(Math.round(offset.current / width), 0, heroPages.length - 1);
    setActiveIndex((slot + heroSlides.length - 1) % heroSlides.length);
    if (!touch.current) {
      clearTimeout(settling.current);
      settling.current = setTimeout(settle, HERO_SETTLE_MS);
    }
  }, [settle, width]);

  const onTouchStart = () => {
    touch.current = true;
    clearTimeout(settling.current);
  };

  const onTouchEnd = () => {
    touch.current = false;
    lastInteractionAt.current = Date.now();
    clearTimeout(settling.current);
    settling.current = setTimeout(settle, HERO_SETTLE_MS);
  };

  return (
    <View style={[styles.hero, { height }]}>
      <ScrollView
        ref={scroll}
        horizontal
        pagingEnabled
        snapToInterval={width}
        disableIntervalMomentum
        decelerationRate="fast"
        bounces={false}
        overScrollMode="never"
        directionalLockEnabled
        showsHorizontalScrollIndicator={false}
        contentOffset={initialOffset}
        scrollEventThrottle={32}
        onScroll={onScroll}
        onScrollBeginDrag={onTouchStart}
        onScrollEndDrag={onTouchEnd}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        onMomentumScrollEnd={settle}
        style={StyleSheet.absoluteFill}
      >
        {heroPages.map((photo, index) => (
          <View key={index} style={{ width, height, overflow: 'hidden', backgroundColor: SCENERY_SURFACE }}>
            {'hasGradient' in photo ? (
              <Image source={photo.source} style={StyleSheet.absoluteFill} contentFit="contain" />
            ) : (
              <>
                <Image
                  source={photo.source}
                  style={[styles.absolute, { left: photo.left * scale, top: photo.top * scale, width: photo.width * scale, height: photo.height * scale }]}
                  contentFit="contain"
                />
                <LinearGradient
                  colors={[SCENERY_SKY, SCENERY_SKY, '#CD966400', '#CD966400']}
                  locations={[0, 0.281305, 0.528355, 1]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={[styles.heroFade, { top: 0, height: 345 * scale }]}
                />
                <LinearGradient
                  colors={['#FFFCF600', SCENERY_SURFACE]}
                  style={[styles.heroFade, { top: 312 * scale, height: (Math.min(353, photo.top + photo.height) - 312) * scale }]}
                />
                <View style={[styles.heroFade, { top: Math.min(353, photo.top + photo.height) * scale, bottom: 0, backgroundColor: SCENERY_SURFACE }]} />
              </>
            )}
          </View>
        ))}
      </ScrollView>
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={`${heroSlides[activeIndex].label}，第 ${activeIndex + 1} 张，共 ${heroSlides.length} 张`}
        accessibilityActions={[{ name: 'increment', label: '下一张' }, { name: 'decrement', label: '上一张' }]}
        onAccessibilityAction={({ nativeEvent }) => moveSlide(nativeEvent.actionName === 'increment' ? 1 : -1)}
        pointerEvents="none"
        style={[styles.heroDots, { top: 289 * scale, right: 13 * scale, gap: 7 * scale }]}
      >
        {heroSlides.map(({ label }, index) => (
          <View
            key={label}
            style={{
              width: 8 * scale,
              height: 8 * scale,
              borderRadius: 4 * scale,
              backgroundColor: index === activeIndex ? '#FFFFFF' : '#BEBEBE',
            }}
          />
        ))}
      </View>
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
  const tabs = ['故事', '匠人', '甘蔗', '食谱', '云游'];

  return (
    <View style={[styles.contentSheet, { left: ((DESIGN_WIDTH_DP - CONTENT_SHEET_WIDTH_DP) / 2) * scale, top: 315 * scale, width: CONTENT_SHEET_WIDTH_DP * scale, height: (DESIGN_BODY_HEIGHT_DP - 315) * scale, borderTopLeftRadius: 20 * scale, borderTopRightRadius: 20 * scale }]}>
      <Pressable
        onPress={() => planned('品牌故事')}
        accessibilityRole="button"
        accessibilityLabel="巧家品牌风物，点击了解"
        style={[styles.brandCard, { top: 14 * scale, width: BRAND_BANNER_WIDTH_DP * scale, height: BRAND_BANNER_HEIGHT_DP * scale }]}
      >
        <Image source={brandBanner} style={StyleSheet.absoluteFill} contentFit="contain" />
      </Pressable>

      <View style={[styles.tabRow, { left: 14 * scale, top: 138 * scale, width: 322 * scale, height: 24 * scale }]}>
        {tabs.map((tab) => {
          const selected = selectedTab === tab;
          return <Pressable key={tab} onPress={() => setSelectedTab(tab)} style={[styles.filterTab, { width: 54 * scale, height: 23 * scale, borderRadius: 12 * scale, backgroundColor: selected ? '#731813' : '#F0E4D9' }]}><Text style={[styles.filterText, { fontSize: 10 * fontScale, color: selected ? '#FFFDF9' : '#98502C', fontWeight: selected ? '700' : '400' }]}>{tab}</Text></Pressable>;
        })}
      </View>

      <SectionLabel title="品牌故事" top={177} scale={scale} fontScale={fontScale} onPress={() => planned('品牌故事')} />
      <View style={[styles.storyRow, { left: 14 * scale, top: 202 * scale, width: 325 * scale, height: 97 * scale }]}>
        <Image source={brandStoriesArtwork} style={StyleSheet.absoluteFill} contentFit="contain" />
        {brandStories.map((story, index) => (
          <Pressable
            key={story.title}
            accessibilityRole="button"
            accessibilityLabel={`${story.tag}，${story.title}`}
            onPress={() => planned(story.title)}
            style={[styles.absolute, { left: 110 * index * scale, width: 105 * scale, height: 97 * scale }]}
          />
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

type ScaleProps = { scale: number; fontScale: number };

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', backgroundColor: SCENERY_SKY },
  page: { flex: 1, overflow: 'hidden', backgroundColor: SCENERY_SKY },
  scroll: { backgroundColor: SCENERY_SURFACE },
  absolute: { position: 'absolute' },
  hero: { position: 'absolute', left: 0, right: 0, top: 0, overflow: 'hidden' },
  heroFade: { position: 'absolute', left: 0, right: 0 },
  heroDots: { position: 'absolute', flexDirection: 'row', zIndex: 2 },
  searchBar: { position: 'absolute', backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#F0E4D9', justifyContent: 'center' },
  searchInput: { position: 'absolute', height: '100%', color: '#614545', letterSpacing: 1.2, padding: 0 },
  searchButton: { position: 'absolute', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#D5A06E' },
  searchButtonText: { color: '#FFFFFF', fontWeight: '700', letterSpacing: 1.8 },
  contentSheet: { position: 'absolute', backgroundColor: SCENERY_SURFACE, overflow: 'hidden' },
  brandCard: { position: 'absolute', alignSelf: 'center' },
  tabRow: { position: 'absolute', flexDirection: 'row', justifyContent: 'space-between' },
  filterTab: { alignItems: 'center', justifyContent: 'center' },
  filterText: { letterSpacing: 1.4 },
  sectionLabel: { position: 'absolute', flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { color: '#3A1915', fontWeight: '700' },
  moreButton: { marginLeft: 'auto', height: '100%', justifyContent: 'center' },
  moreText: { color: '#7D6C62' },
  storyRow: { position: 'absolute' },
  recipeCard: { position: 'absolute', overflow: 'hidden' },
});
