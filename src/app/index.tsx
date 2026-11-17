import { Image } from 'expo-image';
import {
  Alert,
  FlatList,
  type ListRenderItemInfo,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  bottomTabs,
  categories,
  type Category,
  products,
  storySlides,
} from '@/data/home';
import { colors } from '@/theme/tokens';

const DESIGN_WIDTH = 370;
const MAX_CONTENT_WIDTH = 430;
const AUTOPLAY_MS = 4000;

const heroBackground = require('../../assets/figma/home/home-hero-background.png');
const categoryCircle = require('../../assets/figma/home/43334.svg');

type StorySlide = (typeof storySlides)[number];

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

export default function HomeScreen() {
  const window = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const contentWidth = Math.min(window.width, MAX_CONTENT_WIDTH);
  const scale = contentWidth / DESIGN_WIDTH;
  const fontScale = clamp(scale, 0.92, 1.12);
  const navHeight = 64 * scale + insets.bottom;

  return (
    <View style={styles.screen}>
      <View style={{ height: insets.top, backgroundColor: colors.heroBrown }} />
      <View style={[styles.centeredColumn, { width: contentWidth }]}>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: navHeight + 12 }}
        >
          <Hero scale={scale} />
          <View
            style={[
              styles.contentPanelShadow,
              { minHeight: 579 * scale, marginTop: -24 * scale },
            ]}
          >
            <View style={[styles.contentPanel, { minHeight: 579 * scale, paddingTop: 18 * scale }]}>
              <CategoryGrid scale={scale} fontScale={fontScale} />
              <StoryCarousel scale={scale} fontScale={fontScale} contentWidth={contentWidth} />
              <Products scale={scale} fontScale={fontScale} />
            </View>
          </View>
        </ScrollView>
        <BottomNavigation scale={scale} fontScale={fontScale} bottomInset={insets.bottom} />
      </View>
    </View>
  );
}

function Hero({ scale }: { scale: number }) {
  return (
    <View style={[styles.hero, { height: 267 * scale }]}>
      <Image
        source={heroBackground}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        contentPosition={{ left: '50%', top: '0%' }}
      />
    </View>
  );
}

function CategoryGrid({ scale, fontScale }: { scale: number; fontScale: number }) {
  const showPlanned = useCallback((label: string) => {
    Alert.alert(label, '功能规划中');
  }, []);

  return (
    <View style={styles.categoryGrid}>
      {categories.map((category) => (
        <Pressable
          key={category.id}
          style={[styles.categoryItem, { minHeight: 81 * scale }]}
          onPress={() => showPlanned(category.label)}
          accessibilityRole="button"
          accessibilityLabel={`${category.label}，功能规划中`}
        >
          <View style={{ width: 58 * scale, height: 54 * scale }}>
            <Image source={categoryCircle} style={StyleSheet.absoluteFill} contentFit="contain" />
            <CategoryIcon category={category} scale={scale} />
          </View>
          <Text style={[styles.categoryLabel, { fontSize: 9.7 * fontScale }]}>
            {category.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function CategoryIcon({ category, scale }: { category: Category; scale: number }) {
  if (!category.iconLayout) {
    return (
      <Image
        source={category.image}
        style={{ width: 58 * scale, height: 50 * scale }}
        contentFit="contain"
      />
    );
  }

  const visibleTargetSize = 46;
  const imageScale = Math.min(
    visibleTargetSize / category.iconLayout.visibleWidth,
    visibleTargetSize / category.iconLayout.visibleHeight,
  );
  const imageWidth = category.iconLayout.sourceWidth * imageScale;
  const imageHeight = category.iconLayout.sourceHeight * imageScale;
  const left = 29 - category.iconLayout.visibleCenterX * imageScale;
  const top = 27 - category.iconLayout.visibleCenterY * imageScale;

  return (
    <View style={[styles.categoryIconViewport, { width: 58 * scale, height: 54 * scale }]}>
      <Image
        source={category.image}
        style={{
          position: 'absolute',
          left: left * scale,
          top: top * scale,
          width: imageWidth * scale,
          height: imageHeight * scale,
        }}
        contentFit="fill"
      />
    </View>
  );
}

function StoryCarousel({
  scale,
  fontScale,
  contentWidth,
}: {
  scale: number;
  fontScale: number;
  contentWidth: number;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const listRef = useRef<FlatList<StorySlide>>(null);
  const slideWidth = contentWidth;
  const storyWidth = (830.56006 / storySlides.length) * scale;
  const storyHeight = 112.18696 * scale;

  const setIndex = useCallback((index: number) => {
    activeIndexRef.current = index;
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (activeIndexRef.current + 1) % storySlides.length;
      listRef.current?.scrollToIndex({ index: next, animated: true });
      setIndex(next);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [setIndex]);

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const next = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
      setIndex(clamp(next, 0, storySlides.length - 1));
    },
    [setIndex, slideWidth],
  );

  const renderStory = useCallback(
    ({ item }: ListRenderItemInfo<StorySlide>) => (
      <View style={[styles.storySlide, { width: slideWidth, paddingHorizontal: 14 * scale }]}>
        <View style={[styles.storyCrop, { width: storyWidth, height: storyHeight }]}>
          <Image source={item.image} style={StyleSheet.absoluteFill} contentFit="contain" />
        </View>
      </View>
    ),
    [scale, slideWidth, storyHeight, storyWidth],
  );

  return (
    <View style={{ marginTop: 2 * scale }}>
      <SectionHeader title="故事轮播" action="故事详情 ›" scale={scale} fontScale={fontScale} />
      <FlatList
        ref={listRef}
        horizontal
        pagingEnabled
        data={storySlides}
        keyExtractor={(item) => item.id}
        renderItem={renderStory}
        getItemLayout={(_, index) => ({ length: slideWidth, offset: slideWidth * index, index })}
        onMomentumScrollEnd={onMomentumScrollEnd}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        accessibilityLabel="故事轮播，可左右滑动"
      />
      <View style={[styles.dots, { height: 20 * scale }]}>
        {storySlides.map((story, index) => (
          <View
            key={story.id}
            style={[
              styles.dot,
              {
                width: 8 * scale,
                height: 8 * scale,
                borderRadius: 4 * scale,
                backgroundColor: index === activeIndex ? '#963A35' : '#C7B4A8',
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

function Products({ scale, fontScale }: { scale: number; fontScale: number }) {
  const addToCart = useCallback((name: string) => {
    Alert.alert('已加入购物车', `${name} 已加入模拟购物车`);
  }, []);

  return (
    <View>
      <SectionHeader title="今日暖意" action="查看全部 ›" scale={scale} fontScale={fontScale} />
      <View style={[styles.productRow, { paddingHorizontal: 14 * scale, gap: 8 * scale }]}>
        {products.map((product) => (
          <View
            key={product.id}
            style={[
              styles.productCard,
              {
                width: 109 * scale,
                height: 124 * scale,
                borderRadius: 8 * scale,
                padding: 7 * scale,
              },
            ]}
          >
            <Image
              source={product.image}
              style={{ width: 95 * scale, height: 64 * scale, borderRadius: 4 * scale }}
              contentFit="cover"
              contentPosition={product.imagePosition}
            />
            <View style={[styles.productTitleRow, { marginTop: 3 * scale }]}>
              <Text numberOfLines={1} style={[styles.productName, { fontSize: 7 * fontScale }]}>
                {product.name}
              </Text>
              <Text style={[styles.productMeta, { fontSize: 6.3 * fontScale }]}>暖饮灵感</Text>
            </View>
            <View style={[styles.tagRow, { marginTop: 3 * scale, gap: 3 * scale }]}>
              <Text style={[styles.productTag, { fontSize: 4.1 * fontScale }]}>一杯暖意，刚好入秋</Text>
              <Text style={[styles.productTag, { fontSize: 4.1 * fontScale }]}>有机食品</Text>
            </View>
            <Text style={[styles.promoCopy, { fontSize: 3.7 * fontScale, marginTop: 3 * scale }]}>
              限时优惠，补贴后到手价
            </Text>
            <View style={styles.productFooter}>
              <View style={styles.priceRow}>
                <Text style={[styles.currency, { fontSize: 11.4 * fontScale }]}>¥</Text>
                <Text style={[styles.price, { fontSize: 7.7 * fontScale }]}>{product.price}</Text>
              </View>
              <Pressable
                style={[
                  styles.addButton,
                  { width: 13 * scale, height: 13 * scale, borderRadius: 6.5 * scale },
                ]}
                onPress={() => addToCart(product.name)}
                accessibilityRole="button"
                accessibilityLabel={`将${product.name}加入购物车`}
              >
                <Text style={[styles.addButtonText, { fontSize: 10 * fontScale }]}>+</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function SectionHeader({
  title,
  action,
  scale,
  fontScale,
}: {
  title: string;
  action: string;
  scale: number;
  fontScale: number;
}) {
  return (
    <View style={[styles.sectionHeader, { paddingHorizontal: 14 * scale, height: 34 * scale }]}>
      <Text style={[styles.sectionTitle, { fontSize: 17 * fontScale }]}>{title}</Text>
      <Text style={[styles.sectionAction, { fontSize: 12 * fontScale }]}>{action}</Text>
    </View>
  );
}

function BottomNavigation({
  scale,
  fontScale,
  bottomInset,
}: {
  scale: number;
  fontScale: number;
  bottomInset: number;
}) {
  const onTabPress = useCallback((id: string, label: string) => {
    if (id === 'home') return;
    Alert.alert(label, '功能规划中');
  }, []);

  return (
    <View
      style={[
        styles.bottomNav,
        { height: 64 * scale + bottomInset, paddingBottom: bottomInset },
      ]}
    >
      {bottomTabs.map((tab) => {
        const selected = tab.id === 'home';
        return (
          <Pressable
            key={tab.id}
            style={styles.bottomTab}
            onPress={() => onTabPress(tab.id, tab.label)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
          >
            <Image
              source={tab.image}
              style={{ width: 40 * scale, height: 40 * scale }}
              contentFit="contain"
            />
            <Text
              style={[
                styles.bottomLabel,
                {
                  fontSize: 9.4 * fontScale,
                  color: selected ? '#68201B' : '#9D8B82',
                  fontWeight: selected ? '700' : '400',
                },
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.canvas,
  },
  centeredColumn: {
    flex: 1,
    alignSelf: 'center',
    backgroundColor: colors.canvas,
  },
  hero: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: colors.heroBrown,
  },
  contentPanelShadow: {
    backgroundColor: colors.canvas,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 10,
    shadowColor: '#4E2100',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.37,
    shadowRadius: 10,
  },
  contentPanel: {
    overflow: 'hidden',
    backgroundColor: colors.canvas,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' },
  categoryItem: { width: '20%', alignItems: 'center', justifyContent: 'flex-start' },
  categoryIconViewport: { position: 'relative', overflow: 'hidden' },
  categoryLabel: { color: colors.textSecondary, textAlign: 'center', marginTop: -1 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: { color: colors.textPrimary, fontWeight: '700' },
  sectionAction: { color: colors.textSecondary },
  storySlide: { alignItems: 'center' },
  storyCrop: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: colors.canvasSoft,
  },
  dots: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  dot: {},
  productRow: { flexDirection: 'row', paddingBottom: 10 },
  productCard: { backgroundColor: colors.brandBrown },
  productTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productName: { maxWidth: '64%', color: colors.white, fontWeight: '700' },
  productMeta: { color: '#DEC7AF' },
  tagRow: { flexDirection: 'row' },
  productTag: {
    overflow: 'hidden',
    borderRadius: 2,
    paddingHorizontal: 3,
    paddingVertical: 1,
    color: colors.brandRed,
    backgroundColor: colors.tag,
  },
  promoCopy: { color: '#DEC7AF', textAlign: 'right' },
  productFooter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end' },
  currency: { color: colors.white, lineHeight: 13 },
  price: { color: colors.white, lineHeight: 11 },
  addButton: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  addButtonText: { color: colors.brandBrown, lineHeight: 12 },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.navBorder,
    backgroundColor: colors.white,
  },
  bottomTab: { flex: 1, alignItems: 'center', justifyContent: 'flex-start' },
  bottomLabel: { marginTop: -5 },
});
