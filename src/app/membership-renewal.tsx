import { Image, type ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, type ReactNode } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions, type TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 370;
const INK = '#3A1915';
const GOLD = '#D3964B';
const BROWN = '#87410C';
const CREAM = '#FFFAEB';
const art = {
  hero: require('../../assets/figma/renewal/hero.png'),
  logo: require('../../assets/figma/renewal/logo-mark.png'),
  logotype: require('../../assets/figma/renewal/logo-type.png'),
  heroLeft: require('../../assets/figma/renewal/hero-left.svg'),
  heroRight: require('../../assets/figma/renewal/hero-right.svg'),
  avatar: require('../../assets/figma/renewal/avatar.jpg'),
  memberCard: require('../../assets/figma/renewal/member-card.svg'),
  level: require('../../assets/figma/renewal/level.svg'),
  mascot: require('../../assets/figma/renewal/mascot.png'),
  mascotOutline: require('../../assets/figma/renewal/mascot-outline.svg'),
  back: require('../../assets/figma/renewal/back.svg'),
  shareBg: require('../../assets/figma/renewal/share-bg.svg'),
  share: require('../../assets/figma/renewal/share.svg'),
  categoryIndicator: require('../../assets/figma/renewal/category-indicator.svg'),
  agreement: require('../../assets/figma/renewal/agreement.svg'),
  agreementChecked: require('../../assets/figma/renewal/agreement-checked.svg'),
  headingLeft: require('../../assets/figma/renewal/reward-heading-left.svg'),
  headingRight: require('../../assets/figma/renewal/reward-heading-right.svg'),
  mainBg: require('../../assets/figma/renewal/main-bg.svg'),
  rewardBg: require('../../assets/figma/renewal/reward-bg.svg'),
  rewardLine: require('../../assets/figma/renewal/reward-line.svg'),
  growingGift: require('../../assets/figma/renewal/growth-art.png'),
};

const heroRewards = [
  { name: '巧家红糖', source: require('../../assets/figma/renewal/renew-art.png') },
  { name: '罐装巧家红糖', source: require('../../assets/figma/renewal/renew-sugar.png') },
  { name: '红糖甜点', source: require('../../assets/figma/renewal/renew-pastry.png') },
  { name: '桂圆红枣暖饮', source: require('../../assets/figma/renewal/renew-longan-cropped.png') },
  { name: '姜枣红糖饮', source: require('../../assets/figma/renewal/renew-ginger.png') },
];
const perks = [
  { label: '伴手礼抽奖券', source: require('../../assets/figma/renewal/perk-gift.png'), width: 32, height: 43 },
  { label: '伴手礼抽奖券', source: require('../../assets/figma/renewal/perk-back.png'), width: 57, height: 37 },
  { label: '线下店新品体验券', source: require('../../assets/figma/renewal/perk-store.png'), width: 31, height: 39 },
  { label: '红糖文化馆参观券', source: require('../../assets/figma/renewal/perk-museum.png'), width: 61, height: 36 },
];
const coupons = [
  { name: '红糖公主 礼盒优惠券', source: require('../../assets/figma/renewal/coupon-princess.png') },
  { name: '金沙唐韵 礼盒优惠券', source: require('../../assets/figma/renewal/coupon-tang.png') },
  { name: '呵糖 礼盒优惠券', source: require('../../assets/figma/renewal/coupon-he.png') },
];
const categories = ['续约有礼', '签到抽奖', '积分兑换', '好物推荐'];

function planned(title: string) {
  Alert.alert(title, '功能规划中');
}

type Scaled = { scale: number };
type Box = readonly [x: number, y: number, width: number, height: number];

function frame([x, y, width, height]: Box, scale: number) {
  return { position: 'absolute' as const, left: x * scale, top: y * scale, width: width * scale, height: height * scale };
}

function Artwork({ source, box, scale, fit = 'contain' }: Scaled & { source: ImageSource; box: Box; fit?: 'contain' | 'cover' }) {
  return <Image source={source} style={frame(box, scale)} contentFit={fit} accessible={false} />;
}

function Label({ box, scale, size, children, style }: Scaled & { box: Box; size: number; children: ReactNode; style?: TextStyle }) {
  return <Text numberOfLines={1} style={[styles.text, frame(box, scale), { fontSize: size * scale }, style]}>{children}</Text>;
}

function Action({ label, onPress, box, scale, children }: Scaled & { label: string; onPress: () => void; box: Box; children?: ReactNode }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} style={frame(box, scale)} onPress={onPress}>{children}</Pressable>;
}

export default function MembershipRenewalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const width = Math.min(useWindowDimensions().width, 430);
  const scale = width / DESIGN_WIDTH;
  const [accepted, setAccepted] = useState(false);

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/notes');
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={[styles.page, { width }]}>
        <ScrollView style={styles.scroll} contentInsetAdjustmentBehavior="never" showsVerticalScrollIndicator={false}>
          <View style={{ height: 978 * scale }}>
            <MemberHeader scale={scale} safeTop={insets.top} onBack={goBack} />
            <RenewalRewards scale={scale} />
          </View>
        </ScrollView>
        <View style={[styles.footer, { paddingTop: 18 * scale, paddingBottom: Math.max(insets.bottom, 14 * scale) + 9 * scale }]}>
          <Pressable
            accessibilityRole="button"
            style={[styles.purchase, { width: 337 * scale, minHeight: 38 * scale, borderRadius: 8 * scale }]}
            onPress={() => accepted ? planned('解锁手札会员') : Alert.alert('请先勾选会员服务须知')}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 12 * scale, fontWeight: '600', textAlign: 'center' }}>购买巧家红糖产品  解锁手札会员</Text>
          </Pressable>
          <View style={[styles.agreementRow, { marginTop: 4 * scale }]}>
            <Pressable accessibilityRole="checkbox" accessibilityLabel="同意会员服务须知" accessibilityState={{ checked: accepted }} onPress={() => setAccepted(current => !current)} style={styles.checkTarget}>
              <Image
                source={accepted ? art.agreementChecked : art.agreement}
                style={{ width: 10 * scale, height: 10 * scale }}
                contentFit="contain"
                accessible={false}
              />
            </Pressable>
            <Text style={{ color: '#8A8A8A', fontSize: 8 * scale }}>
              手札会员服务须知
              <Text onPress={() => planned('会员服务协议')}>《会员服务协议》</Text>
              <Text onPress={() => planned('活动规则')}>《活动规则》</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function MemberHeader({ scale, safeTop, onBack }: Scaled & { safeTop: number; onBack: () => void }) {
  const controlTop = Math.max(51, safeTop / scale + 3);
  return (
    <View style={[styles.hero, { height: 243 * scale }]}>
      <Artwork source={art.hero} scale={scale} box={[-27.3, -98.1, 404.8, 605.5]} fit="cover" />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#85490A99' }]} />
      <View style={[styles.clip, frame([127.4, 43, 59.7, 23.43], scale)]}>
        <Artwork source={art.logo} box={[0, 0, 59.7, 39.8]} scale={scale} />
      </View>
      <Artwork source={art.logotype} box={[174.3, 53.6, 48.7, 14.4]} scale={scale} />
      <Label box={[94, 72, 198, 22]} size={13.7} scale={scale} style={{ color: '#FEDFC6', letterSpacing: scale, textAlign: 'center' }}>一碗古法糖,暖暖每一天</Label>
      <Artwork source={art.heroLeft} box={[99, 95.7, 45.54, 7.78]} scale={scale} />
      <Artwork source={art.heroRight} box={[241.5, 95.2, 45.54, 7.78]} scale={scale} />
      <Label box={[144, 96.5, 97, 8]} size={4.87} scale={scale} style={{ color: '#FFFBF2', letterSpacing: 0.4 * scale, textAlign: 'center' }}>源自金沙江畔，沿用三百年古法熬制</Label>

      <Artwork source={art.memberCard} box={[17, 124.9, 337, 94.88]} scale={scale} />
      <View style={[frame([32.3, 136.9, 28.35, 29.06], scale), styles.clip, { borderRadius: 15 * scale, borderWidth: scale, borderColor: '#8B4C22' }]}>
        <Artwork source={art.avatar} box={[-21.3, -16.6, 74.6, 74.6]} scale={scale} />
      </View>
      <Label box={[73.7, 135, 62, 17]} size={13.14} scale={scale} style={styles.memberTitle}>糖艺知音</Label>
      <View style={[frame([134, 139.6, 30.9, 9.4], scale), styles.center, { backgroundColor: '#D5A06E', borderRadius: 4.7 * scale }]}>
        <Image source={art.level} style={{ width: 13.29 * scale, height: 4.92 * scale }} contentFit="contain" />
      </View>
      <Label box={[73.7, 154, 110, 12]} size={9.27} scale={scale} style={styles.memberText}>时序会员 · 成长值 860</Label>
      <View style={[frame([34, 179.4, 185, 0.6], scale), { backgroundColor: '#E9E2DC' }]} />
      {['我的卡包', '我的勋章', '我的积分'].map((item, index) => (
        <Action key={item} label={item} onPress={() => planned(item)} box={[29 + index * 61.1, 181, 50, 36]} scale={scale}>
          <Text style={[styles.memberText, { fontSize: 9.27 * scale, marginTop: 12 * scale, marginLeft: 4 * scale }]}>{item}</Text>
        </Action>
      ))}
      <Artwork source={art.mascotOutline} box={[231.85, 105.43, 99.25, 109.95]} scale={scale} />
      <Artwork source={art.mascot} box={[232.7, 105.88, 96.18, 107.7]} scale={scale} />
      <Action label="返回手札" onPress={onBack} box={[8, controlTop - 7, 44, 44]} scale={scale}>
        <Artwork source={art.back} box={[7, 7, 30, 30]} scale={scale} />
      </Action>
      <Action label="分享会员续约" onPress={() => planned('分享')} box={[316, controlTop - 7, 44, 44]} scale={scale}>
        <Artwork source={art.shareBg} box={[7, 7, 30, 30]} scale={scale} />
        <Artwork source={art.share} box={[12, 10.75, 20, 20]} scale={scale} />
      </Action>
    </View>
  );
}

function RenewalRewards({ scale }: Scaled) {
  return (
    <>
      <Artwork source={art.mainBg} box={[-4, 239, 378, 861]} scale={scale} />
      <View style={[frame([0, 243, DESIGN_WIDTH, 35], scale), styles.categoryRow]}>
        {categories.map((item, index) => (
          <Pressable key={item} accessibilityRole="tab" accessibilityState={{ selected: index === 0 }} onPress={() => { if (index > 0) planned(item); }} style={styles.category}>
            <Text style={[styles.text, { fontSize: 12 * scale, letterSpacing: 0.6 * scale }]}>{item}</Text>
            {index === 0 && <Image source={art.categoryIndicator} style={[styles.underline, { width: 14 * scale, height: 4 * scale, bottom: 2 * scale }]} contentFit="contain" />}
          </Pressable>
        ))}
      </View>
      <Artwork source={art.headingLeft} box={[51, 305.12, 65.17, 11.14]} scale={scale} />
      <Artwork source={art.headingRight} box={[254.83, 304.36, 65.17, 11.14]} scale={scale} />
      <Label box={[126, 301, 118, 22]} size={14} scale={scale} style={{ color: '#C8964B', textAlign: 'center', fontWeight: '700' }}>续约月月领好礼</Label>

      <View style={[frame([16, 340, 338, 149], scale), styles.rewardIntro, { borderTopLeftRadius: 8 * scale, borderTopRightRadius: 8 * scale }]} />
      <Label box={[33, 352, 239, 22]} size={12} scale={scale} style={{ color: GOLD, fontWeight: '700' }}>24天后好礼进度清零  续约可领</Label>
      <Label box={[33, 373, 242, 13]} size={8} scale={scale} style={styles.muted}>续卡恢复后按当前进度继续领奖</Label>
      <Pill box={[289, 354, 51, 15]} scale={scale} title="第一阶段" color="#D5A06E" />
      {heroRewards.map((item, index) => (
        <View key={item.name} style={[frame([32 + 63 * index, 391, 55, 55], scale), styles.rewardTile, { borderRadius: 4 * scale }]}>
          <Image source={item.source} style={StyleSheet.absoluteFill} contentFit="cover" alt={item.name} />
        </View>
      ))}
      <Artwork source={art.rewardLine} box={[26, 450, 321, 22]} scale={scale} />
      <Artwork source={art.rewardBg} box={[6, 476, 358, 497]} scale={scale} />

      <RewardHeading title="成长礼包" subtitle="成长限量好礼" y={493} scale={scale} />
      <RewardItem box={[33, 517, 306, 66]} source={art.growingGift} title="冲泡 红糖饮品 便携条装" subtitle="每日限时上架10份" action="5天后可抢" scale={scale} />
      <RewardHeading title="尊享服务" subtitle="享优质服务" y={591} scale={scale} />
      {perks.map((perk, index) => (
        <Action key={index} label={perk.label} onPress={() => planned(perk.label)} box={[33 + 78 * index, 615, 72, 55]} scale={scale}>
          <View style={[StyleSheet.absoluteFill, styles.rewardTile, { borderRadius: 6 * scale, backgroundColor: '#FFFEFB' }]}>
            <Artwork source={perk.source} box={[(72 - perk.width) / 2, 3 + (43 - perk.height) / 2, perk.width, perk.height]} scale={scale} />
            <Label box={[0, 47, 72, 8]} size={5.8} scale={scale} style={{ color: '#514942', textAlign: 'center' }}>{perk.label}</Label>
          </View>
        </Action>
      ))}
      <RewardHeading title="礼券赠送" subtitle="礼券可送亲朋好友" y={683} scale={scale} />
      {coupons.map((coupon, index) => (
        <RewardItem key={coupon.name} box={[33, 710 + 78 * index, 306, 70]} source={coupon.source} title={coupon.name} subtitle="每日限时领取" action="领取送好友" onPress={() => planned(coupon.name)} scale={scale} />
      ))}
    </>
  );
}

function RewardHeading({ title, subtitle, y, scale }: Scaled & { title: string; subtitle: string; y: number }) {
  return (
    <View style={[frame([33, y, 306, 22], scale), styles.heading]}>
      <Text style={{ color: BROWN, fontSize: 14 * scale, fontWeight: '700' }}>{title}</Text>
      <Text style={{ color: '#514942', fontSize: 10 * scale }}> · {subtitle}</Text>
    </View>
  );
}

function RewardItem({ title, subtitle, action, source, box, scale, onPress }: Scaled & { title: string; subtitle: string; action: string; source: ImageSource; box: Box; onPress?: () => void }) {
  const isCoupon = !!onPress;
  return (
    <View style={[frame(box, scale), styles.rewardItem, { borderRadius: 9 * scale }]}>
      <View style={[frame([isCoupon ? 15 : 12, 9, 48, 48], scale), styles.clip, { borderRadius: 4 * scale, backgroundColor: '#FFFBF4' }]}>
        <Image source={source} style={StyleSheet.absoluteFill} contentFit={isCoupon ? 'cover' : 'contain'} />
      </View>
      <Label box={[isCoupon ? 81 : 77, 12, 155, 16]} size={10} style={{ color: '#514942' }} scale={scale}>{title}</Label>
      <LinearGradient colors={['#D19A51', '#FFECB5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[frame([isCoupon ? 82 : 78, 33, isCoupon ? 133 : 138, 4], scale), { borderRadius: 4 * scale }]} />
      <Label box={[isCoupon ? 82 : 78, 44, 146, 12]} size={8} scale={scale} style={styles.muted}>{subtitle}</Label>
      <Pill box={[233, 25, 61, 16]} title={action} color="#CB9B58" scale={scale} />
      {onPress && <Action label={`${title}，${action}`} onPress={onPress} box={[224, 15, 80, 36]} scale={scale} />}
    </View>
  );
}

function Pill({ title, color, box, scale }: Scaled & { title: string; color: string; box: Box }) {
  return (
    <View style={[frame(box, scale), styles.center, { backgroundColor: color, borderRadius: box[3] * scale * 0.5 }]}>
      <Text style={{ color: '#FFFFFF', fontSize: 8 * scale }}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', backgroundColor: '#783908' },
  page: { flex: 1, backgroundColor: CREAM },
  scroll: { flex: 1 },
  clip: { overflow: 'hidden' },
  hero: { backgroundColor: '#85490A', overflow: 'hidden' },
  text: { color: INK, includeFontPadding: false },
  memberTitle: { color: '#731813', fontWeight: '700' },
  memberText: { color: '#731813' },
  muted: { color: '#8A8A8A' },
  center: { alignItems: 'center', justifyContent: 'center' },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FFFEFB' },
  category: { alignItems: 'center', justifyContent: 'center', flexGrow: 1 },
  underline: { position: 'absolute' },
  rewardIntro: { backgroundColor: '#FFFEFB', elevation: 1 },
  rewardTile: { overflow: 'hidden', backgroundColor: '#FFF8EC' },
  rewardItem: { backgroundColor: '#FFFEFB', elevation: 1 },
  heading: { flexDirection: 'row', alignItems: 'center' },
  footer: { alignItems: 'center', backgroundColor: '#FFFFFF', elevation: 9 },
  purchase: { alignItems: 'center', justifyContent: 'center', backgroundColor: GOLD },
  agreementRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  checkTarget: { width: 22, height: 24, alignItems: 'center', justifyContent: 'center' },
});
