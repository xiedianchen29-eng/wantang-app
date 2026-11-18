import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useCallback } from 'react';
import { Alert, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { IconTile, type IconTileIcon } from '@/components/IconTile';
import { BottomNavigation } from '@/components/BottomNavigation';
import { MainPageScroll } from '@/components/MainPageScroll';

const DESIGN_WIDTH_DP = 370;
const MAX_CONTENT_WIDTH_DP = 430;
const RECOMMENDATION_TOP_DP = 657;
const RECOMMENDATION_HEIGHT_DP = 152;
const DESIGN_BODY_HEIGHT_DP = RECOMMENDATION_TOP_DP + RECOMMENDATION_HEIGHT_DP;
const HEADER_TOP_DP = 55;

const profileIdentity = require('../../assets/figma/profile/profile-identity.svg');
const membershipArtwork = require('../../assets/figma/profile/profile-membership.png');
const couponArtwork = require('../../assets/figma/profile/profile-coupon.png');
const recommendationArtwork = require('../../assets/figma/profile/profile-recommendations.png');
const supportIcon = require('../../assets/figma/profile/2bcc6.png');
const allArrow = require('../../assets/figma/profile/91578.svg');
const headerActions = [
  { label: '消息', icon: require('../../assets/figma/profile/notification-bell.svg'), width: 15, height: 14, left: 285 },
  { label: '设置', icon: require('../../assets/figma/profile/857dd.svg'), width: 15, height: 13.3333, left: 325 },
];

const shortcutSections = {
  order: {
    title: '我的订单',
    allLabel: '全部订单',
    top: 414,
    height: 108,
    row: { left: 12, top: 38, width: 315 },
    items: [
      { label: '待付款', icon: { source: require('../../assets/figma/profile/e74fb.png'), width: 25.41, height: 25.41, top: 4.24 } },
      { label: '待发货', icon: { source: require('../../assets/figma/profile/89cd7.png'), width: 36, height: 36, top: 0 } },
      { label: '待收货', icon: { source: require('../../assets/figma/profile/79c60.png'), width: 32.82, height: 32.82, top: 2.12, offsetX: 1.59 } },
      { label: '足迹', icon: { source: require('../../assets/figma/profile/04d40.png'), width: 30.71, height: 30.71, top: 3.18, offsetX: 1.59 } },
      { label: '售后', icon: { source: supportIcon, width: 30.71, height: 30.71, top: 3.18, offsetX: 0.53 } },
    ],
  },
  service: {
    title: '常用服务',
    allLabel: '全部服务',
    top: 534,
    height: 114,
    row: { left: 18, top: 36, width: 302.54 },
    items: [
      { label: '收货地址', icon: { source: require('../../assets/figma/profile/ad2e7.svg'), width: 18.0568, height: 24, top: 11, offsetX: -0.8 } },
      { label: '客服', icon: { source: supportIcon, width: 33.8242, height: 33.8242, top: 7 } },
      { label: '积分', icon: { source: require('../../assets/figma/profile/653a6.svg'), width: 17, height: 27, top: 9, offsetX: -0.24 } },
      { label: '支付设置', icon: { source: require('../../assets/figma/profile/payment-settings.svg'), width: 31, height: 23, top: 13, offsetX: 0.73 } },
    ],
  },
} satisfies Record<string, {
  title: string;
  allLabel: string;
  top: number;
  height: number;
  row: { left: number; top: number; width: number };
  items: { label: string; icon: IconTileIcon }[];
}>;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

export default function ProfileScreen() {
  const window = useWindowDimensions();
  const width = Math.min(window.width, MAX_CONTENT_WIDTH_DP);
  const scale = width / DESIGN_WIDTH_DP;
  const fontScale = clamp(scale, 0.92, 1.12);
  const planned = useCallback((label: string) => Alert.alert(label, '功能规划中'), []);


  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={[styles.page, { width }]}>
        <MainPageScroll scale={scale} topGap={HEADER_TOP_DP} bodyHeight={DESIGN_BODY_HEIGHT_DP} style={styles.scroll}>
          <LinearGradient colors={['#FFE7CC', '#FBE7D1']} style={[styles.topBackground, { height: 294 * scale }]} />
          <LinearGradient colors={['#FFFCF5', '#FFF8EB']} style={[styles.contentBackground, { top: 275 * scale, height: 466 * scale, borderTopLeftRadius: 12 * scale, borderTopRightRadius: 12 * scale }]} />
          <ProfileHeader scale={scale} fontScale={fontScale} onPress={planned} />
          <MemberCard scale={scale} onPress={planned} />
          <CouponCard scale={scale} onPress={planned} />
          <ShortcutCard variant="order" scale={scale} fontScale={fontScale} onPress={planned} />
          <ShortcutCard variant="service" scale={scale} fontScale={fontScale} onPress={planned} />
          <Image
            source={recommendationArtwork}
            style={[styles.absolute, {
              left: -2 * scale,
              top: RECOMMENDATION_TOP_DP * scale,
              width: 374 * scale,
              height: RECOMMENDATION_HEIGHT_DP * scale,
            }]}
            contentFit="contain"
            accessibilityLabel="猜你喜欢、我的收藏、我的评价。推荐图片：红糖块、红糖暖饮。"
          />
        </MainPageScroll>
        <BottomNavigation currentTab="profile" scale={scale} fontScale={fontScale} />
      </View>
    </View>
  );
}

function ProfileHeader({ scale, fontScale, onPress }: ScaleProps & { onPress: (label: string) => void }) {
  return <>
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress('礼品上新')}
      style={[styles.notice, {
        left: 18 * scale, top: 60 * scale, width: 208 * scale, height: 29 * scale,
        borderRadius: 15 * scale, paddingLeft: 17 * scale, paddingRight: 11 * scale,
      }]}
    >
      <Text style={[styles.noticeText, { fontSize: 12 * fontScale }]}>礼品上新！产品选购指南</Text>
      <Image source={allArrow} style={[styles.noticeArrow, { width: 6.10768 * scale, height: 9.33335 * scale }]} contentFit="contain" accessible={false} />
    </Pressable>
    {headerActions.map((action) => (
      <Pressable
        key={action.label}
        accessibilityRole="button"
        accessibilityLabel={action.label}
        onPress={() => onPress(action.label)}
        style={[styles.headerAction, { left: action.left * scale, top: HEADER_TOP_DP * scale, width: 26 * scale, height: 42 * scale }]}
      >
        <View style={[styles.headerActionCircle, { width: 26 * scale, height: 26 * scale, borderRadius: 13 * scale }]}>
          <Image source={action.icon} style={{ width: action.width * scale, height: action.height * scale }} contentFit="contain" accessible={false} />
        </View>
        <Text style={[styles.topActionLabel, { marginTop: 3 * scale, fontSize: 10 * fontScale }]}>{action.label}</Text>
      </Pressable>
    ))}
    <Image
      source={profileIdentity}
      style={[styles.absolute, { left: 18 * scale, top: 102 * scale, width: 186 * scale, height: 56 * scale }]}
      contentFit="contain"
      accessibilityLabel="糖艺知音，LV 3，欢迎回来"
    />
  </>;
}

function MemberCard({ scale, onPress }: { scale: number; onPress: (label: string) => void }) {
  // The artwork extends 68 dp above the card face to show the full sugarcane illustration.
  return (
    <Pressable
      onPress={() => onPress('时序会员')}
      accessibilityRole="button"
      accessibilityLabel="时序会员，成长值 860，IP 地址：云南省昆明市，甘蔗林飞速增长中"
      style={[styles.absolute, { left: 18 * scale, top: 169 * scale, width: 335 * scale, height: 86 * scale }]}
    >
      <Image
        source={membershipArtwork}
        style={{ position: 'absolute', top: -68 * scale, width: 335 * scale, height: 154 * scale }}
        contentFit="contain"
        pointerEvents="none"
      />
    </Pressable>
  );
}

function CouponCard({ scale, onPress }: { scale: number; onPress: (label: string) => void }) {
  return (
    <Pressable
      onPress={() => onPress('暖饮心意券')}
      accessibilityRole="button"
      accessibilityLabel="暖饮心意券，查看所有券码"
      style={[styles.absolute, { left: 11.5 * scale, top: 293 * scale, width: 347 * scale, height: 117 * scale }]}
    >
      <Image source={couponArtwork} style={StyleSheet.absoluteFill} contentFit="contain" pointerEvents="none" />
    </Pressable>
  );
}

function ShortcutCard({ variant, scale, fontScale, onPress }: ScaleProps & {
  variant: keyof typeof shortcutSections;
  onPress: (label: string) => void;
}) {
  const section = shortcutSections[variant];

  return (
    <View style={[styles.whiteCard, {
      left: 18 * scale,
      top: section.top * scale,
      width: 335 * scale,
      height: section.height * scale,
      borderRadius: 8 * scale,
      borderWidth: scale,
    }]}>
      <Text accessibilityRole="header" style={[styles.cardHeading, {
        left: 17 * scale, top: 9 * scale, fontSize: 16 * fontScale, lineHeight: 22 * fontScale,
      }]}>
        {section.title}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={section.allLabel}
        onPress={() => onPress(section.allLabel)}
        hitSlop={6 * scale}
        style={[styles.allButton, { right: 14 * scale, top: 12 * scale, gap: 3 * scale }]}
      >
        <Text style={[styles.allText, { fontSize: 12 * fontScale, lineHeight: 16 * fontScale }]}>全部</Text>
        <Image source={allArrow} style={{ width: 5 * scale, height: 8 * scale }} contentFit="contain" accessible={false} />
      </Pressable>
      <View style={[styles.shortcutRow, {
        left: section.row.left * scale,
        top: section.row.top * scale,
        width: section.row.width * scale,
      }]}>
        {section.items.map(({ label, icon }) => (
          <IconTile
            key={label}
            variant={variant}
            label={label}
            icon={icon}
            scale={scale}
            fontScale={fontScale}
            onPress={() => onPress(label)}
          />
        ))}
      </View>
    </View>
  );
}

type ScaleProps = { scale: number; fontScale: number };

const styles = StyleSheet.create({
  cardHeading: { position: 'absolute', color: '#3A1915', fontWeight: '700', includeFontPadding: false },
  allButton: { position: 'absolute', flexDirection: 'row', alignItems: 'center' },
  allText: { color: '#7D6C62', includeFontPadding: false },
  shortcutRow: { position: 'absolute', flexDirection: 'row', justifyContent: 'space-between' },
  scroll: { flex: 1, backgroundColor: '#FFF8EB' },
  headerAction: { position: 'absolute', alignItems: 'center' },
  headerActionCircle: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#D5A06E' },
  screen: { flex: 1, alignItems: 'center', backgroundColor: '#FFE7CC' }, page: { flex: 1, overflow: 'hidden', backgroundColor: '#FFE7CC' }, topBackground: { position: 'absolute', left: 0, right: 0, top: 0 }, contentBackground: { position: 'absolute', left: 0, right: 0 }, notice: { position: 'absolute', flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF3E6' }, noticeText: { color: '#7D6C62', letterSpacing: 1.2 }, noticeArrow: { marginLeft: 'auto' }, topActionLabel: { color: '#7D6C62', includeFontPadding: false }, absolute: { position: 'absolute' }, whiteCard: { position: 'absolute', backgroundColor: '#FFFDF9', borderColor: '#E8DBCE' },
});
