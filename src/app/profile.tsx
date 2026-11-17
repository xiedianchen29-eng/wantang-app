import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { bottomTabs } from '@/data/home';

const DESIGN_WIDTH_DP = 370;
const DESIGN_BODY_HEIGHT_DP = 744;
const MAX_CONTENT_WIDTH_DP = 430;

const avatar = require('../../assets/figma/profile/2604d.png');
const sugarcane = require('../../assets/figma/profile/45bfe.png');
const rabbit = require('../../assets/figma/profile/666e5.png');
const couponScene = require('../../assets/figma/gifts/e0033.png');
const orderIcons = [
  require('../../assets/figma/profile/e74fb.png'),
  require('../../assets/figma/profile/89cd7.png'),
  require('../../assets/figma/profile/79c60.png'),
  require('../../assets/figma/profile/2bcc6.png'),
  require('../../assets/figma/profile/04d40.png'),
];

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

export default function ProfileScreen() {
  const window = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const width = Math.min(window.width, MAX_CONTENT_WIDTH_DP);
  const scale = width / DESIGN_WIDTH_DP;
  const fontScale = clamp(scale, 0.92, 1.12);
  const navHeight = 78 * scale + insets.bottom;
  const planned = useCallback((label: string) => Alert.alert(label, '功能规划中'), []);

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={[styles.page, { width }]}>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{ minHeight: DESIGN_BODY_HEIGHT_DP * scale + insets.top, paddingTop: insets.top, paddingBottom: navHeight }}>
          <View style={{ height: DESIGN_BODY_HEIGHT_DP * scale }}>
            <LinearGradient colors={['#FFE7CC', '#FBE7D1']} style={[styles.topBackground, { height: 294 * scale }]} />
            <LinearGradient colors={['#FFFCF5', '#FFF8EB']} style={[styles.contentBackground, { top: 275 * scale, height: 466 * scale, borderTopLeftRadius: 12 * scale, borderTopRightRadius: 12 * scale }]} />
            <ProfileHeader scale={scale} fontScale={fontScale} onPress={planned} />
            <MemberCard scale={scale} fontScale={fontScale} onPress={planned} />
            <CouponCard scale={scale} fontScale={fontScale} onPress={planned} />
            <OrderCard scale={scale} fontScale={fontScale} onPress={planned} />
            <ServiceCard scale={scale} fontScale={fontScale} onPress={planned} />
            <RecommendationTabs scale={scale} fontScale={fontScale} />
          </View>
        </ScrollView>
        <BottomNavigation scale={scale} fontScale={fontScale} bottomInset={insets.bottom} />
      </View>
    </View>
  );
}

function ProfileHeader({ scale, fontScale, onPress }: ScaleProps & { onPress: (label: string) => void }) {
  return <>
    <Pressable onPress={() => onPress('礼品上新')} style={[styles.notice, { left: 18 * scale, top: 60 * scale, width: 208 * scale, height: 30 * scale, borderRadius: 16 * scale }]}><Text style={[styles.noticeText, { fontSize: 12 * fontScale }]}>礼品上新！产品选购指南</Text><Text style={[styles.noticeArrow, { fontSize: 20 * fontScale }]}>›</Text></Pressable>
    <Pressable onPress={() => onPress('消息')} style={[styles.topAction, { left: 286 * scale, top: 55 * scale, width: 27 * scale, height: 27 * scale, borderRadius: 14 * scale }]}><Text style={[styles.topActionIcon, { fontSize: 14 * fontScale }]}>♟</Text><Text style={[styles.topActionLabel, { top: 32 * scale, fontSize: 10 * fontScale }]}>消息</Text></Pressable>
    <Pressable onPress={() => onPress('设置')} style={[styles.topAction, { left: 326 * scale, top: 55 * scale, width: 27 * scale, height: 27 * scale, borderRadius: 14 * scale }]}><Text style={[styles.topActionIcon, { fontSize: 15 * fontScale }]}>⚙</Text><Text style={[styles.topActionLabel, { top: 32 * scale, fontSize: 10 * fontScale }]}>设置</Text></Pressable>
    <Image source={avatar} style={{ position: 'absolute', left: 18 * scale, top: 102 * scale, width: 55 * scale, height: 55 * scale, borderRadius: 28 * scale }} contentFit="cover" contentPosition={{ left: '50%', top: '44%' }} />
    <Text style={[styles.userName, { left: 86 * scale, top: 110 * scale, fontSize: 17 * fontScale }]}>糖艺知音</Text>
    <View style={[styles.levelBadge, { left: 164 * scale, top: 114 * scale, width: 40 * scale, height: 12 * scale, borderRadius: 6 * scale }]}><Text style={[styles.levelText, { fontSize: 8 * fontScale }]}>LV 3</Text></View>
    <Text style={[styles.greeting, { left: 86 * scale, top: 136 * scale, fontSize: 12 * fontScale }]}>Hi~欢迎回来</Text>
  </>;
}

function MemberCard({ scale, fontScale, onPress }: ScaleProps & { onPress: (label: string) => void }) {
  return <Pressable onPress={() => onPress('时序会员')} style={[styles.memberCard, { left: 18 * scale, top: 169 * scale, width: 335 * scale, height: 85 * scale, borderRadius: 8 * scale }]}>
    <LinearGradient colors={['#721B18', '#A54032']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
    <Image source={sugarcane} style={{ position: 'absolute', right: -7 * scale, top: -68 * scale, width: 129 * scale, height: 118 * scale }} contentFit="contain" />
    <Image source={rabbit} style={{ position: 'absolute', left: 155 * scale, top: 37 * scale, width: 54 * scale, height: 27 * scale }} contentFit="contain" />
    <Text style={[styles.memberCaption, { left: 22 * scale, top: 30 * scale, fontSize: 12 * fontScale }]}>时序会员 · 成长值</Text>
    <Text style={[styles.memberValue, { left: 22 * scale, top: 51 * scale, fontSize: 24 * fontScale }]}>860</Text>
    <Text style={[styles.memberGrowth, { right: 17 * scale, top: 35 * scale, fontSize: 8 * fontScale }]}>甘蔗林 飞速增长中</Text>
    <View style={[styles.memberTrack, { left: 76 * scale, top: 66 * scale, width: 244 * scale, height: 8 * scale, borderRadius: 5 * scale }]}><View style={[styles.memberProgress, { width: 98 * scale, height: 8 * scale, borderRadius: 5 * scale }]} /></View>
  </Pressable>;
}

function CouponCard({ scale, fontScale, onPress }: ScaleProps & { onPress: (label: string) => void }) {
  return <Pressable onPress={() => onPress('暖饮心意券')} style={[styles.couponCard, { left: 18 * scale, top: 297 * scale, width: 335 * scale, height: 105 * scale, borderRadius: 8 * scale }]}>
    <LinearGradient colors={['#DDBA84', '#F1D7AF']} style={StyleSheet.absoluteFill} />
    <Image source={couponScene} style={{ position: 'absolute', right: -70 * scale, top: -17 * scale, width: 245 * scale, height: 142 * scale, opacity: 0.2 }} contentFit="cover" />
    <View style={[styles.couponDash, { left: 8 * scale, top: 6 * scale, right: 8 * scale, bottom: 6 * scale, borderRadius: 5 * scale }]} />
    <Text style={[styles.couponSmall, { left: 24 * scale, top: 18 * scale, fontSize: 11 * fontScale }]}>您的优惠券：</Text>
    <Text style={[styles.couponTitle, { left: 24 * scale, top: 40 * scale, fontSize: 20 * fontScale }]}>“暖饮心意券”</Text>
    <View style={[styles.couponTag, { left: 25 * scale, top: 78 * scale, width: 35 * scale, height: 12 * scale, borderRadius: 6 * scale }]}><Text style={[styles.couponTagText, { fontSize: 5.7 * fontScale }]}>非遗熬制</Text></View>
    <View style={[styles.couponTag, { left: 70 * scale, top: 78 * scale, width: 35 * scale, height: 12 * scale, borderRadius: 6 * scale }]}><Text style={[styles.couponTagText, { fontSize: 5.7 * fontScale }]}>暖甜滋养</Text></View>
    <View style={[styles.couponTag, { left: 115 * scale, top: 78 * scale, width: 35 * scale, height: 12 * scale, borderRadius: 6 * scale }]}><Text style={[styles.couponTagText, { fontSize: 5.7 * fontScale }]}>甘蔗原香</Text></View>
    <Text style={[styles.couponLink, { right: 24 * scale, bottom: 15 * scale, fontSize: 9.7 * fontScale }]}>点击查看所有券码 ›</Text>
  </Pressable>;
}

function OrderCard({ scale, fontScale, onPress }: ScaleProps & { onPress: (label: string) => void }) {
  const labels = ['待付款', '待发货', '待收货', '足迹', '售后'];
  return <View style={[styles.whiteCard, { left: 18 * scale, top: 414 * scale, width: 335 * scale, height: 108 * scale, borderRadius: 8 * scale }]}>
    <Text style={[styles.cardHeading, { left: 17 * scale, top: 10 * scale, fontSize: 16 * fontScale }]}>我的订单</Text><Pressable onPress={() => onPress('全部订单')} style={[styles.allButton, { right: 16 * scale, top: 9 * scale }]}><Text style={[styles.allText, { fontSize: 12 * fontScale }]}>全部 ›</Text></Pressable>
    <View style={[styles.orderRow, { left: 12 * scale, top: 37 * scale, width: 311 * scale }]}>{labels.map((label, index) => <Pressable key={label} onPress={() => onPress(label)} style={styles.orderItem}><Image source={orderIcons[index]} style={{ width: 31 * scale, height: 31 * scale, borderRadius: 8 * scale }} contentFit="contain" /><Text style={[styles.orderLabel, { marginTop: 4 * scale, fontSize: 10 * fontScale }]}>{label}</Text></Pressable>)}</View>
  </View>;
}

function ServiceCard({ scale, fontScale, onPress }: ScaleProps & { onPress: (label: string) => void }) {
  const services = [{ icon: '⌾', label: '收货地址' }, { icon: '♧', label: '客服' }, { icon: '◔', label: '积分' }, { icon: '￥', label: '支付设置' }];
  return <View style={[styles.whiteCard, { left: 18 * scale, top: 534 * scale, width: 335 * scale, height: 114 * scale, borderRadius: 8 * scale }]}>
    <Text style={[styles.cardHeading, { left: 17 * scale, top: 11 * scale, fontSize: 16 * fontScale }]}>常用服务</Text><Pressable onPress={() => onPress('全部服务')} style={[styles.allButton, { right: 16 * scale, top: 9 * scale }]}><Text style={[styles.allText, { fontSize: 12 * fontScale }]}>全部 ›</Text></Pressable>
    <View style={[styles.serviceRow, { left: 17 * scale, top: 36 * scale, width: 301 * scale }]}>{services.map((service) => <Pressable key={service.label} onPress={() => onPress(service.label)} style={[styles.serviceItem, { width: 68 * scale, height: 62 * scale, borderRadius: 12 * scale }]}><Text style={[styles.serviceIcon, { fontSize: service.icon === '￥' ? 21 * fontScale : 25 * fontScale }]}>{service.icon}</Text><Text style={[styles.serviceLabel, { fontSize: 9 * fontScale }]}>{service.label}</Text></Pressable>)}</View>
  </View>;
}

function RecommendationTabs({ scale, fontScale }: ScaleProps) {
  return <View style={[styles.recommendation, { top: 660 * scale, height: 100 * scale, borderTopLeftRadius: 12 * scale, borderTopRightRadius: 12 * scale }]}><View style={[styles.recommendationTabs, { height: 34 * scale, paddingLeft: 20 * scale, gap: 25 * scale }]}><Text style={[styles.recommendationSelected, { fontSize: 12 * fontScale }]}>猜你喜欢</Text><Text style={[styles.recommendationText, { fontSize: 12 * fontScale }]}>我的收藏</Text><Text style={[styles.recommendationText, { fontSize: 12 * fontScale }]}>我的评价</Text></View><View style={[styles.recommendationLine, { left: 37 * scale, top: 25 * scale, width: 12 * scale, height: 2 * scale }]} /></View>;
}

function BottomNavigation({ scale, fontScale, bottomInset }: ScaleProps & { bottomInset: number }) {
  const router = useRouter();
  const onPress = useCallback((id: string, label: string) => { if (id === 'profile') return; if (id === 'home') { router.replace('/'); return; } if (id === 'notes') { router.replace('/notes'); return; } if (id === 'gifts') { router.replace('/gifts'); return; } if (id === 'culture') { router.replace('/scenery'); return; } Alert.alert(label, '功能规划中'); }, [router]);
  return <View style={[styles.bottomNav, { height: 78 * scale + bottomInset, paddingBottom: bottomInset }]}>{bottomTabs.map((tab) => { const selected = tab.id === 'profile'; return <Pressable key={tab.id} style={styles.bottomTab} onPress={() => onPress(tab.id, tab.label)} accessibilityRole="tab" accessibilityState={{ selected }}><Image source={tab.image} style={{ width: 40 * scale, height: 40 * scale }} contentFit="contain" /><Text style={[styles.bottomLabel, { fontSize: 9.4 * fontScale, color: selected ? '#731813' : '#9D8B82', fontWeight: selected ? '700' : '400' }]}>{tab.label}</Text></Pressable>; })}</View>;
}

type ScaleProps = { scale: number; fontScale: number };

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', backgroundColor: '#FFE7CC' }, page: { flex: 1, overflow: 'hidden', backgroundColor: '#FFF8EB' }, topBackground: { position: 'absolute', left: 0, right: 0, top: 0 }, contentBackground: { position: 'absolute', left: 0, right: 0 }, notice: { position: 'absolute', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 8, backgroundColor: '#FFF3E6' }, noticeText: { color: '#7D6C62', letterSpacing: 1.2 }, noticeArrow: { marginLeft: 'auto', color: '#7D6C62' }, topAction: { position: 'absolute', alignItems: 'center', justifyContent: 'center', backgroundColor: '#D5A06E' }, topActionIcon: { color: '#FFFFFF' }, topActionLabel: { position: 'absolute', color: '#7D6C62' }, userName: { position: 'absolute', color: '#000000', fontWeight: '700' }, levelBadge: { position: 'absolute', alignItems: 'center', justifyContent: 'center', backgroundColor: '#D5A06E' }, levelText: { color: '#FFFFFF', fontWeight: '700' }, greeting: { position: 'absolute', color: '#7D6C62', letterSpacing: 1.2 }, memberCard: { position: 'absolute', overflow: 'hidden' }, memberCaption: { position: 'absolute', color: '#FFFDF9', letterSpacing: 0.6 }, memberValue: { position: 'absolute', color: '#FFFFFF', fontWeight: '700', letterSpacing: 1.2 }, memberGrowth: { position: 'absolute', color: '#FFFDF9', letterSpacing: 0.4 }, memberTrack: { position: 'absolute', backgroundColor: '#FFF3E6' }, memberProgress: { backgroundColor: '#D5A06E' }, couponCard: { position: 'absolute', overflow: 'hidden' }, couponDash: { position: 'absolute', borderWidth: 2, borderColor: '#B24A3D', borderStyle: 'dashed' }, couponSmall: { position: 'absolute', color: '#2A0901' }, couponTitle: { position: 'absolute', color: '#FFFFFF', fontWeight: '700', letterSpacing: 2 }, couponTag: { position: 'absolute', alignItems: 'center', justifyContent: 'center', backgroundColor: '#9A5230' }, couponTagText: { color: '#FFFFFF' }, couponLink: { position: 'absolute', color: '#2A0901' }, whiteCard: { position: 'absolute', backgroundColor: '#FFFDF9', borderWidth: 1, borderColor: '#E8DBCE' }, cardHeading: { position: 'absolute', color: '#3A1915', fontWeight: '700' }, allButton: { position: 'absolute' }, allText: { color: '#7D6C62' }, orderRow: { position: 'absolute', flexDirection: 'row', justifyContent: 'space-between' }, orderItem: { alignItems: 'center', width: 48 }, orderLabel: { color: '#8E7C73' }, serviceRow: { position: 'absolute', flexDirection: 'row', justifyContent: 'space-between' }, serviceItem: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5E9DC' }, serviceIcon: { color: '#8E342A', fontWeight: '700' }, serviceLabel: { marginTop: 2, color: '#8E7C73' }, recommendation: { position: 'absolute', left: 2, right: 1, backgroundColor: '#FFFDF9', borderTopWidth: 1, borderColor: '#E8DBCE' }, recommendationTabs: { flexDirection: 'row', alignItems: 'center' }, recommendationSelected: { color: '#3A1915' }, recommendationText: { color: '#A3A3A3' }, recommendationLine: { position: 'absolute', backgroundColor: '#731813' }, bottomNav: { position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 20, flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FFFDF9', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E6D9D1' }, bottomTab: { flex: 1, alignItems: 'center', justifyContent: 'flex-start' }, bottomLabel: { marginTop: -5 },
});
