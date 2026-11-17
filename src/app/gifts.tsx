import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { bottomTabs } from '@/data/home';

// React Native style numbers are density-independent pixels (dp), not screen pixels.
const DESIGN_WIDTH_DP = 370;
const DESIGN_BODY_HEIGHT_DP = 744;
const MAX_CONTENT_WIDTH_DP = 430;

const occasionBoard = require('../../assets/figma/gifts/occasion-board.png');
const longanDrink = require('../../assets/figma/home/9f3c5.png');
const gingerDrink = require('../../assets/figma/gifts/e3034.png');
const tangYunGift = require('../../assets/figma/gifts/7ce74.png');
const princessGift = require('../../assets/figma/gifts/555d7.png');
const codonopsisGift = require('../../assets/figma/gifts/0c53a.png');
const cupIcon = require('../../assets/figma/gifts/c9a31.svg');
const giftIcon = require('../../assets/figma/gifts/dddac.svg');

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

export default function GiftsScreen() {
  const window = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const width = Math.min(window.width, MAX_CONTENT_WIDTH_DP);
  const scale = width / DESIGN_WIDTH_DP;
  const fontScale = clamp(scale, 0.92, 1.12);
  const navHeight = 78 * scale + insets.bottom;

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <LinearGradient colors={['#FCFAF8', '#FFF5E4']} style={[styles.page, { width }]}>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ minHeight: DESIGN_BODY_HEIGHT_DP * scale + insets.top, paddingTop: insets.top, paddingBottom: navHeight }}
        >
          <View style={{ height: DESIGN_BODY_HEIGHT_DP * scale }}>
            <GiftSearch scale={scale} fontScale={fontScale} />
            <GiftCategories scale={scale} fontScale={fontScale} />
            <SeasonalDrinks scale={scale} fontScale={fontScale} />
            <GiftList scale={scale} fontScale={fontScale} />
          </View>
        </ScrollView>
        <BottomNavigation scale={scale} fontScale={fontScale} bottomInset={insets.bottom} />
      </LinearGradient>
    </View>
  );
}

function GiftSearch({ scale, fontScale }: ScaleProps) {
  const [query, setQuery] = useState('');
  const search = useCallback(() => Alert.alert('搜索', query.trim() ? `“${query.trim()}”的结果正在规划中` : '请输入想寻找的暖饮、红糖或礼盒'), [query]);

  return (
    <View style={[styles.searchBar, styles.absolute, { left: 9 * scale, top: 60 * scale, width: 353 * scale, height: 43 * scale, borderRadius: 22 * scale }]}>
      <Text style={[styles.scanIcon, { left: 16 * scale, fontSize: 21 * fontScale }]}>⌗</Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="搜暖饮包、红糖、礼盒"
        placeholderTextColor="#7D6C62"
        style={[styles.searchInput, { left: 55 * scale, right: 91 * scale, fontSize: 12 * fontScale }]}
        returnKeyType="search"
        onSubmitEditing={search}
      />
      <Pressable onPress={search} style={[styles.searchButton, { right: 7 * scale, width: 76 * scale, height: 29 * scale, borderRadius: 15 * scale }]}>
        <Text style={[styles.searchButtonText, { fontSize: 12 * fontScale }]}>⌕ 搜索</Text>
      </Pressable>
    </View>
  );
}

function GiftCategories({ scale }: ScaleProps) {
  const planned = useCallback((title: string) => Alert.alert(title, '功能规划中'), []);

  return (
    <View style={[styles.absolute, { left: 9 * scale, top: 117 * scale, width: 353 * scale, height: 195 * scale }]}>
      <Image source={occasionBoard} style={StyleSheet.absoluteFill} contentFit="fill" pointerEvents="none" />
      <Pressable onPress={() => planned('节庆礼盒')} style={[styles.categoryHitArea, { left: 10 * scale, top: 5 * scale, width: 86 * scale, height: 83 * scale }]} />
      <Pressable onPress={() => planned('个人伴手礼')} style={[styles.categoryHitArea, { left: 110 * scale, top: 5 * scale, width: 135 * scale, height: 83 * scale }]} />
      <Pressable onPress={() => planned('礼品专区')} style={[styles.categoryHitArea, { left: 260 * scale, top: 5 * scale, width: 83 * scale, height: 175 * scale }]} />
      <Pressable onPress={() => planned('企业定制礼品')} style={[styles.categoryHitArea, { left: 10 * scale, top: 100 * scale, width: 235 * scale, height: 80 * scale }]} />
    </View>
  );
}

function SeasonalDrinks({ scale, fontScale }: ScaleProps) {
  const planned = useCallback((name: string) => Alert.alert(name, '功能规划中'), []);
  const drinks = [
    { name: '桂圆红枣', detail: '暖饮包 · 轻甜回甘', price: '79', pack: '7天装', image: longanDrink, position: { left: '50%', top: '72%' } as const },
    { name: '姜枣红糖', detail: '暖饮包 · 浓醇暖香', price: '239', pack: '28天装', image: gingerDrink, position: { left: '50%', top: '50%' } as const },
  ];

  return (
    <View style={[styles.card, styles.absolute, { left: 9 * scale, top: 316 * scale, width: 353 * scale, height: 213 * scale, borderRadius: 8 * scale }]}>
      <SectionHeader title="当季暖饮" action="查看全部 ›" scale={scale} fontScale={fontScale} onPress={() => planned('当季暖饮')} />
      {drinks.map((drink, index) => (
        <Pressable key={drink.name} onPress={() => planned(drink.name)} style={[styles.drinkCard, { left: (9 + index * 174) * scale, top: 39 * scale, width: 159 * scale, height: 164 * scale, borderRadius: 8 * scale }]}>
          <LinearGradient colors={['#D0A362', '#EFD5A9']} style={StyleSheet.absoluteFill} />
          <Image source={drink.image} style={{ position: 'absolute', left: 9 * scale, top: 10 * scale, width: 141 * scale, height: 74 * scale, borderRadius: 7 * scale }} contentFit="cover" contentPosition={drink.position} />
          <Text style={[styles.drinkName, { left: 10 * scale, top: 94 * scale, fontSize: 14 * fontScale }]}>{drink.name}</Text>
          <Text style={[styles.drinkDetail, { left: 10 * scale, top: 114 * scale, fontSize: 10 * fontScale }]}>{drink.detail}</Text>
          <View style={[styles.packBadge, { right: 9 * scale, top: 94 * scale, width: 48 * scale, height: 15 * scale, borderRadius: 8 * scale }]}>
            <Text style={[styles.packText, { fontSize: 10 * fontScale }]}>{drink.pack}</Text>
          </View>
          <Text style={[styles.drinkPrice, { left: 10 * scale, bottom: 11 * scale, fontSize: 18 * fontScale }]}>¥ {drink.price}</Text>
          <Pressable onPress={() => planned(`${drink.name}加入购物车`)} style={[styles.addButton, { right: 10 * scale, bottom: 9 * scale, width: 25 * scale, height: 25 * scale, borderRadius: 13 * scale }]}>
            <Text style={[styles.addText, { fontSize: 21 * fontScale }]}>+</Text>
          </Pressable>
        </Pressable>
      ))}
    </View>
  );
}

function GiftList({ scale, fontScale }: ScaleProps) {
  const planned = useCallback((name: string) => Alert.alert(name, '功能规划中'), []);
  const gifts = [
    { name: '金沙唐韵礼盒', price: '128', image: tangYunGift, product: codonopsisGift },
    { name: '红糖公主礼盒', price: '40.8', image: princessGift },
  ];

  return (
    <View style={[styles.card, styles.absolute, { left: 9 * scale, top: 539 * scale, width: 353 * scale, height: 283 * scale, borderRadius: 8 * scale }]}>
      <SectionHeader title="岁时送礼" action="礼盒详情 ›" scale={scale} fontScale={fontScale} onPress={() => planned('岁时送礼')} gift />
      {gifts.map((gift, index) => (
        <Pressable key={gift.name} onPress={() => planned(gift.name)} style={[styles.giftRow, { left: 11 * scale, top: (38 + index * 97) * scale, width: 335 * scale, height: 89 * scale, borderRadius: 12 * scale }]}>
          <LinearGradient colors={['#F5E2D0', '#E7CBB0']} style={StyleSheet.absoluteFill} />
          <View style={[styles.giftImage, { left: 7 * scale, top: 8 * scale, width: 128 * scale, height: 73 * scale, borderRadius: 8 * scale }]}>
            <Image source={gift.image} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition={{ left: index === 0 ? '52%' : '62%', top: index === 0 ? '48%' : '45%' }} />
            {gift.product ? <Image source={gift.product} style={{ position: 'absolute', left: 20 * scale, top: 7 * scale, width: 91 * scale, height: 75 * scale }} contentFit="contain" /> : null}
          </View>
          <Text style={[styles.giftName, { left: 145 * scale, top: 12 * scale, fontSize: 14 * fontScale }]}>{gift.name}</Text>
          <Text style={[styles.giftTag, { left: 145 * scale, top: 35 * scale, fontSize: 7 * fontScale }]}>可定制贺卡 · 定时送达</Text>
          <Text style={[styles.giftTag, { left: 231 * scale, top: 35 * scale, fontSize: 7 * fontScale }]}>把温暖送给重要的人</Text>
          <Text style={[styles.giftPrice, { left: 145 * scale, bottom: 10 * scale, fontSize: 20 * fontScale }]}>￥{gift.price}</Text>
          <Text style={[styles.giftOffer, { left: 204 * scale, bottom: 12 * scale, fontSize: 8 * fontScale }]}>限时优惠</Text>
          <Text style={[styles.giftAction, { right: 15 * scale, bottom: 12 * scale, fontSize: 8 * fontScale }]}>点击了解 ›</Text>
        </Pressable>
      ))}
    </View>
  );
}

function SectionHeader({ title, action, scale, fontScale, onPress, gift = false }: ScaleProps & { title: string; action: string; onPress: () => void; gift?: boolean }) {
  return (
    <View style={[styles.sectionHeader, { height: 33 * scale, paddingHorizontal: 10 * scale }]}>
      <Image source={gift ? giftIcon : cupIcon} style={{ width: 17 * scale, height: 17 * scale, marginRight: 3 * scale }} contentFit="contain" />
      <Text style={[styles.sectionTitle, { fontSize: 14 * fontScale }]}>{title}</Text>
      <Text style={[styles.sectionSubtitle, { fontSize: 10 * fontScale }]}>· 品牌好物向您推荐</Text>
      <Pressable onPress={onPress} style={styles.sectionActionPress} hitSlop={8}><Text style={[styles.sectionAction, { fontSize: 10 * fontScale }]}>{action}</Text></Pressable>
    </View>
  );
}

function BottomNavigation({ scale, fontScale, bottomInset }: ScaleProps & { bottomInset: number }) {
  const router = useRouter();
  const onTabPress = useCallback((id: string, label: string) => {
    if (id === 'gifts') return;
    if (id === 'home') { router.replace('/'); return; }
    if (id === 'notes') { router.replace('/notes'); return; }
    Alert.alert(label, '功能规划中');
  }, [router]);

  return (
    <View style={[styles.bottomNav, { height: 78 * scale + bottomInset, paddingBottom: bottomInset }]}>
      {bottomTabs.map((tab) => {
        const selected = tab.id === 'gifts';
        return (
          <Pressable key={tab.id} style={styles.bottomTab} onPress={() => onTabPress(tab.id, tab.label)} accessibilityRole="tab" accessibilityState={{ selected }}>
            <Image source={tab.image} style={{ width: 40 * scale, height: 40 * scale }} contentFit="contain" />
            <Text style={[styles.bottomLabel, { fontSize: 9.4 * fontScale, color: selected ? '#731813' : '#9D8B82', fontWeight: selected ? '700' : '400' }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

type ScaleProps = { scale: number; fontScale: number };

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', backgroundColor: '#FCFAF8' },
  page: { flex: 1, overflow: 'hidden' },
  absolute: { position: 'absolute' },
  searchBar: { borderWidth: 2, borderColor: '#F0E4D9', backgroundColor: '#FFFFFF', justifyContent: 'center' },
  scanIcon: { position: 'absolute', color: '#D5A06E', top: 7 },
  searchInput: { position: 'absolute', height: '100%', color: '#614545', letterSpacing: 1.2 },
  searchButton: { position: 'absolute', top: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#D5A06E' },
  searchButtonText: { color: '#FFFFFF', fontWeight: '700', letterSpacing: 1.1 },
  card: { backgroundColor: '#FFFEFB', shadowColor: '#412700', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 2, overflow: 'hidden' },
  categoryHitArea: { position: 'absolute' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { color: '#C28B3D', fontWeight: '700' },
  sectionSubtitle: { color: '#CE9C4E', marginLeft: 2 },
  sectionActionPress: { marginLeft: 'auto', height: '100%', justifyContent: 'center' },
  sectionAction: { color: '#614545' },
  drinkCard: { position: 'absolute', overflow: 'hidden' },
  drinkName: { position: 'absolute', color: '#B06A39', fontWeight: '700' },
  drinkDetail: { position: 'absolute', color: '#FFFFFF' },
  packBadge: { position: 'absolute', backgroundColor: '#FDEDDB', alignItems: 'center', justifyContent: 'center' },
  packText: { color: '#731813', fontWeight: '700', letterSpacing: 0.6 },
  drinkPrice: { position: 'absolute', color: '#78201A', fontWeight: '700' },
  addButton: { position: 'absolute', alignItems: 'center', justifyContent: 'center', backgroundColor: '#731813' },
  addText: { color: '#FFFFFF', marginTop: -3 },
  giftRow: { position: 'absolute', overflow: 'hidden' },
  giftImage: { position: 'absolute', overflow: 'hidden', backgroundColor: '#F8F5EF' },
  giftName: { position: 'absolute', color: '#5B130B', fontWeight: '700', letterSpacing: 0.7 },
  giftTag: { position: 'absolute', color: '#8F150E', backgroundColor: '#FEF2E7', paddingHorizontal: 3, paddingVertical: 1, borderRadius: 3 },
  giftPrice: { position: 'absolute', color: '#8C2E25' },
  giftOffer: { position: 'absolute', color: '#8C2E25' },
  giftAction: { position: 'absolute', color: '#8C2E25' },
  bottomNav: { position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 20, flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FFFDF9', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E6D9D1' },
  bottomTab: { flex: 1, alignItems: 'center', justifyContent: 'flex-start' },
  bottomLabel: { marginTop: -5 },
});
