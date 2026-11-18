import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Pressable, StyleSheet, Text, View, useAnimatedValue } from 'react-native';

import { journalProducts, type JournalProduct, type ProductTag } from '@/data/journalProducts';

const art = {
  ai: require('../../assets/figma/journal-plan-inspiration/ai-mark.svg'),
  popular: require('../../assets/figma/journal-plan-inspiration/popular.svg'),
  actionCheck: require('../../assets/figma/journal-plan-inspiration/action-check.svg'),
  pendingCheck: require('../../assets/figma/journal-plan-inspiration/pending-check.svg'),
  leaf: require('../../assets/figma/journal-plan-inspiration/organic-leaf.svg'),
  nourish: require('../../assets/figma/journal-plan-inspiration/nourish-icon.svg'),
};

const addDuration = 150;
const easeOut = Easing.bezier(0, 0, 0.58, 1);
const cardLayouts = {
  blocks: { photoLeft: 7, photoTop: 8, crop: [0.08, -28.63, 98.21, 104.66], tagsTop: 32 },
  longan: { photoLeft: 7, photoTop: 8, crop: [-0.08, -61.41, 84.16, 130.01], tagsTop: 29 },
  sugar: { photoLeft: 9, photoTop: 8, crop: [-94.06, -152.57, 179.12, 238.91], tagsTop: 30 },
  gift: { photoLeft: 9, photoTop: 9, crop: [0.08, -57.5, 84, 122.7], tagsTop: 31 },
  'three-sugars': { photoLeft: 9, photoTop: 9, crop: [0, -48.81, 84, 120.98], tagsTop: 32 },
} as const;

export function JournalInspiration({ scale, addedIds, onAdd }: {
  scale: number;
  addedIds: ReadonlySet<JournalProduct['id']>;
  onAdd: (id: JournalProduct['id']) => void;
}) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let mounted = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReduceMotion(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return (
    <View style={{ gap: 10 * scale }}>
      <View accessible accessibilityRole="header" accessibilityLabel="AI 推荐，健康食谱原料"
        style={[styles.heading, { height: 14 * scale, marginLeft: 6 * scale, gap: 3 * scale }]}>
        <Image source={art.ai} style={{ width: 16.82 * scale, height: 13.97 * scale }} contentFit="contain" accessible={false} />
        <Text style={[styles.headingTitle, { fontSize: 14 * scale }]}>推荐</Text>
        <Text style={[styles.headingSubtitle, { fontSize: 10 * scale }]}>· 健康食谱原料</Text>
      </View>
      {journalProducts.map((product) => (
        <InspirationCard key={product.id} product={product} scale={scale} added={addedIds.has(product.id)} reduceMotion={reduceMotion} onAdd={onAdd} />
      ))}
    </View>
  );
}

function InspirationCard({ product, scale, added, reduceMotion, onAdd }: {
  product: JournalProduct;
  scale: number;
  added: boolean;
  reduceMotion: boolean;
  onAdd: (id: JournalProduct['id']) => void;
}) {
  const progress = useAnimatedValue(added ? 1 : 0);
  const layout = cardLayouts[product.id];
  const [imageLeft, imageTop, imageWidth, imageHeight] = layout.crop;
  const imageShift = Math.max(7.63, 79 - imageTop - imageHeight);
  const tags = product.id === 'gift' ? [...product.tags].reverse() : product.tags;

  useEffect(() => {
    if (!added) return;
    if (reduceMotion) {
      progress.setValue(1);
      return;
    }
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: addDuration,
      easing: easeOut,
      useNativeDriver: false,
      isInteraction: false,
    });
    animation.start();
    return () => animation.stop();
  }, [added, progress, reduceMotion]);

  function animateSize(from: number, to: number) {
    return progress.interpolate({ inputRange: [0, 1], outputRange: [from * scale, to * scale] });
  }

  const confirmationOpacity = progress.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] });
  const actionTextOpacity = progress.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0, 0] });

  return (
    <Animated.View style={[styles.card, { height: animateSize(76, 96), borderWidth: scale, borderRadius: 8 * scale }]}>
      <Animated.View style={[styles.photo, {
        left: (layout.photoLeft - 1) * scale, top: (layout.photoTop - 1) * scale,
        width: 84 * scale, height: animateSize(59, 79), borderRadius: 4 * scale,
      }]}>
        <Animated.View style={[styles.imageLayer, {
          left: imageLeft * scale, top: animateSize(imageTop, imageTop + imageShift),
          width: imageWidth * scale, height: imageHeight * scale,
        }]}>
          <Image source={product.source} style={StyleSheet.absoluteFill} contentFit="cover" accessible={false} />
        </Animated.View>
      </Animated.View>

      <View style={[styles.copy, { left: 104 * scale, right: 7 * scale }]}>
        <Text numberOfLines={1} style={[styles.title, { marginTop: 7 * scale, fontSize: 12 * scale, lineHeight: 17 * scale }]}>{product.title}</Text>
        <View style={[styles.badges, { top: (layout.tagsTop - 1) * scale, gap: 6.5 * scale }]}>
          {tags.map((tag) => <InspirationBadge key={tag} tag={tag} showNourishIcon={product.id !== 'longan'} scale={scale} />)}
        </View>
        <View style={[styles.statusRow, { top: 53 * scale, height: 13 * scale, gap: 4 * scale }]}>
          <Image source={art.popular} style={{ width: 10 * scale, height: 13 * scale }} contentFit="contain" accessible={false} />
          <Text style={[styles.popular, { fontSize: 10 * scale, letterSpacing: 0.8 * scale }]}>320人做过</Text>
        </View>
        {added && (
          <Animated.View accessibilityLiveRegion="polite" style={[styles.statusRow, {
            top: 73 * scale, height: 13 * scale, gap: 4 * scale, opacity: confirmationOpacity,
          }]}>
            <Image source={art.pendingCheck} style={{ width: 13 * scale, height: 13 * scale }} contentFit="contain" accessible={false} />
            <Text style={[styles.confirmation, { fontSize: 10 * scale, letterSpacing: 0.8 * scale }]}>已添加至待办</Text>
          </Animated.View>
        )}
      </View>
      <Animated.View style={[styles.action, {
        top: animateSize(46, 63), width: animateSize(67, 20),
        right: 7 * scale, height: 20 * scale, borderRadius: 10 * scale,
      }]}>
        <Pressable accessibilityRole="button" disabled={added} accessibilityState={{ disabled: added }}
          accessibilityLabel={`${added ? '已添加至待办' : '点击添加'}，${product.title}`}
          onPress={() => onAdd(product.id)} style={styles.actionPressable}>
          <Animated.Text numberOfLines={1} style={[styles.actionLabel, {
            width: 67 * scale, fontSize: 10 * scale, letterSpacing: scale, opacity: actionTextOpacity,
          }]}>点击添加</Animated.Text>
          {added && (
            <Animated.View style={[styles.checkLayer, { opacity: confirmationOpacity, top: 4 * scale }]}>
              <Image source={art.actionCheck} style={{ width: 14 * scale, height: 14 * scale }} contentFit="contain" accessible={false} />
            </Animated.View>
          )}
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

function InspirationBadge({ tag, showNourishIcon, scale }: { tag: ProductTag; showNourishIcon: boolean; scale: number }) {
  const organic = tag === '纯天然有机';
  const nourish = tag === '补血养颜' && showNourishIcon;
  const color = organic ? '#ABC63E' : '#DAAB6C';
  const width = organic ? 63.924 : nourish ? 52.173 : 44.183;

  return (
    <View style={[styles.badge, {
      width: width * scale, height: 14.1 * scale, borderRadius: 1.5 * scale, gap: 4.5 * scale,
      borderColor: color, borderWidth: (organic ? 0.391 : 0.353) * scale, backgroundColor: organic ? '#F6FAE6' : '#FFFAF2',
    }]}>
      {organic && <Image source={art.leaf} style={{ width: 8.72 * scale, height: 9.4 * scale }} contentFit="contain" accessible={false} />}
      {nourish && <Image source={art.nourish} style={{ width: 4.1 * scale, height: 8.76 * scale }} contentFit="contain" accessible={false} />}
      <Text style={[styles.badgeLabel, { color, fontSize: 7.52 * scale }]}>{tag}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { flexDirection: 'row', alignItems: 'center' },
  headingTitle: { color: '#C28B3D', fontWeight: '700', includeFontPadding: false },
  headingSubtitle: { color: '#CE9C4E', includeFontPadding: false },
  card: { borderColor: '#BFBFBF', backgroundColor: '#FFFFFF', overflow: 'hidden' },
  photo: { position: 'absolute', overflow: 'hidden', backgroundColor: '#D9D9D9' },
  imageLayer: { position: 'absolute' },
  copy: { position: 'absolute', top: 0, bottom: 0 },
  title: { color: '#464646', includeFontPadding: false },
  badges: { position: 'absolute', flexDirection: 'row' },
  badge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  badgeLabel: { includeFontPadding: false },
  statusRow: { position: 'absolute', left: 0, flexDirection: 'row', alignItems: 'center' },
  popular: { color: '#9F9F9F', includeFontPadding: false },
  confirmation: { color: '#74914B', includeFontPadding: false },
  action: { position: 'absolute', backgroundColor: '#D3964B', overflow: 'hidden' },
  actionPressable: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { color: '#FFFFFF', fontWeight: '700', textAlign: 'center', includeFontPadding: false },
  checkLayer: { position: 'absolute' },
});
