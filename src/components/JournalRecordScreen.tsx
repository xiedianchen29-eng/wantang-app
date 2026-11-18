import { Image, type ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { type Flavor } from '@/data/journal';

const DESIGN_WIDTH = 370;
const PAGE_COLOR = '#FCFCFC';
const GOLD = '#C28B3D';

const art = {
  paper: require('../../assets/figma/journal-record/paper.png'),
  flavorCard: require('../../assets/figma/journal-record/flavor-card.png'),
  back: require('../../assets/figma/journal-record/back.svg'),
  more: require('../../assets/figma/journal-record/more.svg'),
  tea: require('../../assets/figma/journal-record/tea.svg'),
  heart: require('../../assets/figma/journal-record/heart.svg'),
  star: require('../../assets/figma/journal-record/star.svg'),
  search: require('../../assets/figma/journal-record/search.svg'),
  plus: require('../../assets/figma/journal-record/collection-add.svg'),
  arrow: require('../../assets/figma/journal-record/collection-chevron.svg'),
  underline: require('../../assets/figma/journal-record/tab-underline.svg'),
};

type Box = readonly [left: number, top: number, width: number, height: number];
type Scaled = { scale: number };

const flavorHotspots: { flavor: Flavor; box: Box }[] = [
  { flavor: '红糖甜品', box: [73, 59, 66, 28] },
  { flavor: '红糖早餐', box: [224, 65, 64, 26] },
  { flavor: '红糖主食', box: [43, 106, 71, 29] },
  { flavor: '红糖糕点', box: [254, 112, 56, 25] },
  { flavor: '红糖饮品', box: [128, 77, 110, 41] },
];

type Tutorial = {
  source: ImageSource;
  title: string;
  tag: string;
  likes: number;
  saves: number;
  crop: Box;
  height: number;
  quote?: boolean;
};

const buns: Tutorial = { source: require('../../assets/figma/journal-record/steamed-buns.png'), title: '零失败！红糖红枣馒头教程', tag: '高分菜谱', likes: 126, saves: 52, crop: [-2, -12, 163, 163], height: 136 };
const balls: Tutorial = { source: require('../../assets/figma/journal-record/rice-balls.png'), title: '红糖糯米小圆子', tag: '“爱吃红糖的一定要做”', likes: 110, saves: 32, crop: [-2, -12, 176, 117], height: 100, quote: true };
const cakes: Tutorial = { source: require('../../assets/figma/journal-record/crispy-cakes.png'), title: '红糖糍粑 简易教程', tag: '多人重复做', likes: 324, saves: 78, crop: [-1, -4, 167, 167], height: 163 };
const sago: Tutorial = { ...buns, source: require('../../assets/figma/journal-record/sago.png'), crop: [-11, -11, 186, 248], height: 179 };
const tea: Tutorial = { source: require('../../assets/figma/journal-record/red-date-tea.png'), title: '红糖红枣茶', tag: '健康养身', likes: 35, saves: 11, crop: [0, -11, 161, 121], height: 100 };
const angelica: Tutorial = { source: require('../../assets/figma/journal-record/angelica-tea.png'), title: '红糖红枣当归茶', tag: '“工作生活来一包”', likes: 29, saves: 14, crop: [-61, -20, 234, 156], height: 136, quote: true };
const riceCake: Tutorial = { ...cakes, source: require('../../assets/figma/journal-record/rice-cake.png'), title: '红糖年糕教程 不用烤箱用平底锅也能炸', tag: '高分菜谱', crop: [-13, -2, 186, 148], height: 136 };
const roll: Tutorial = { ...buns, source: require('../../assets/figma/journal-record/sugar-roll.png'), title: '超好吃的红糖卷教程', likes: 104, saves: 25, crop: [-13, -43, 186, 248], height: 163 };
const tutorialColumns = [[buns, cakes, tea, riceCake, cakes, angelica], [balls, sago, angelica, roll, sago, tea]];
const sections = ['笔记', '视频', '菜谱', '课程'];

function planned(title: string) {
  Alert.alert(title, '功能规划中');
}

function frame([left, top, width, height]: Box, scale: number) {
  return { position: 'absolute' as const, left: left * scale, top: top * scale, width: width * scale, height: height * scale };
}

function Artwork({ source, box, scale }: Scaled & { source: ImageSource; box: Box }) {
  return <Image source={source} style={frame(box, scale)} contentFit="contain" accessible={false} />;
}

export function JournalRecordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const width = Math.min(useWindowDimensions().width, 430);
  const scale = width / DESIGN_WIDTH;
  const headerTop = Math.max(48 * scale, insets.top);
  const headerHeight = headerTop + 34 * scale;

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/notes');
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={[styles.page, { width }]}>
        <View style={[styles.header, { height: headerHeight }]}>
          <Artwork source={art.paper} box={[0, headerHeight / scale - 185, 370, 185]} scale={scale} />
          <Pressable accessibilityRole="button" accessibilityLabel="返回手札" onPress={goBack} style={frame([16, headerTop / scale - 4, 103, 40], scale)}>
            <Artwork source={art.back} box={[8.1, 12.2, 9.55, 17.14]} scale={scale} />
            <Text accessibilityRole="header" style={[styles.headerTitle, { fontSize: 16 * scale, marginLeft: 24 * scale, marginTop: 9 * scale }]}>手札记录</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="更多" onPress={() => planned('更多')} style={frame([316, headerTop / scale - 2, 44, 36], scale)}>
            <Artwork source={art.more} box={[7, 4, 30, 30]} scale={scale} />
          </Pressable>
        </View>
        <ScrollView contentInsetAdjustmentBehavior="never" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 12 * scale }}>
          <LinearGradient colors={['#FEEED8', PAGE_COLOR]} style={frame([0, 0, 370, 212], scale)} />
          <FlavorCard scale={scale} onStart={(flavor) => router.push({ pathname: '/journal/start', params: flavor ? { flavor } : {} })} />
          <HistoryCard scale={scale} onPress={() => router.push('/journal/history')} />
          <TutorialFeed scale={scale} />
        </ScrollView>
        <View style={{ height: insets.bottom, backgroundColor: '#FFFFFF' }} />
      </View>
    </View>
  );
}

function FlavorCard({ scale, onStart }: Scaled & { onStart: (flavor?: Flavor) => void }) {
  return (
    <View style={{ alignSelf: 'center', width: 362 * scale, height: 190 * scale, marginTop: 7 * scale }}>
      <Artwork source={art.flavorCard} box={[0, 0, 362, 190]} scale={scale} />
      <View accessible accessibilityRole="header" accessibilityLabel="记录口味" style={frame([28, 17, 87, 18], scale)} />
      <Pressable accessibilityRole="button" accessibilityLabel="切换模板" onPress={() => planned('切换模板')} style={frame([269, 10, 74, 30], scale)} />
      {flavorHotspots.map(({ flavor, box }) => (
        <Pressable key={flavor} accessibilityRole="button" accessibilityLabel={flavor} onPress={() => onStart(flavor)} style={frame(box, scale)} />
      ))}
      <Pressable accessibilityRole="button" accessibilityLabel="开始记录" accessibilityHint="支持智能导入记录" onPress={() => onStart()} style={frame([113, 130, 136, 42], scale)} />
    </View>
  );
}

function HistoryCard({ scale, onPress }: Scaled & { onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="过往记录" onPress={onPress} style={[styles.clip, styles.panel, { width: 350 * scale, height: 66 * scale, borderRadius: 8 * scale, marginTop: 8 * scale }]}>
      <LinearGradient colors={['#FAEBD7', '#FFFFFF', '#FFFFFF']} locations={[0, 0.74, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
      <Artwork source={art.paper} box={[2.45, -8.69, 160.29, 80.15]} scale={scale} />
      <LinearGradient colors={['#FAEBD700', '#FFFFFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={frame([20, 0, 144, 66], scale)} />
      <LinearGradient colors={['#FFFFFF', '#FFFFFF00']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={frame([164, 0, 40, 66], scale)} />
      <Artwork source={art.tea} box={[16, 21, 20, 20]} scale={scale} />
      <Text style={[styles.historyTitle, { left: 42 * scale, top: 22 * scale, fontSize: 14 * scale }]}>过往记录</Text>
      <Text style={[styles.historyHint, { right: 17 * scale, top: 26 * scale, fontSize: 10 * scale }]}>回忆你的过往手札 ›</Text>
    </Pressable>
  );
}

function TutorialFeed({ scale }: Scaled) {
  return (
    <View style={[styles.panel, { width: 350 * scale, borderRadius: 8 * scale, marginTop: 10 * scale }]}>
      <View style={[styles.feedTabs, { height: 31 * scale }]}>
        {sections.map((item, index) => (
          <Pressable key={item} accessibilityRole="tab" accessibilityState={{ selected: index === 0 }} onPress={() => { if (index > 0) planned(item); }} style={[styles.feedTab, { width: 53 * scale }]}>
            <Text style={{ fontSize: 12 * scale, color: index === 0 ? '#383838' : '#888888' }}>{item}</Text>
            {index === 0 && <Artwork source={art.underline} box={[19.5, 23, 14, 4]} scale={scale} />}
          </Pressable>
        ))}
        <Pressable accessibilityRole="button" accessibilityLabel="搜索教程" onPress={() => planned('搜索教程')} style={frame([301, 0, 49, 31], scale)}>
          <Artwork source={art.search} box={[20, 9, 12.62, 12.25]} scale={scale} />
        </Pressable>
      </View>
      <View style={[styles.collections, { marginLeft: 13 * scale, marginTop: 7 * scale, gap: 5 * scale }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="收藏合集，18 项" onPress={() => planned('收藏合集')} style={[styles.collectionPill, { width: 82 * scale, height: 18 * scale, borderRadius: 2 * scale, paddingHorizontal: 5 * scale }]}>
          <Text style={{ fontSize: 10 * scale, color: '#888888' }}>收藏合集</Text>
          <Text style={{ fontSize: 10 * scale, color: '#888888', marginLeft: 5 * scale }}>18</Text>
          <Image source={art.arrow} style={{ width: 3.8 * scale, height: 5.8 * scale, marginLeft: 2 * scale }} contentFit="contain" />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="新增收藏合集" onPress={() => planned('新增收藏合集')} style={[styles.collectionPill, styles.center, { width: 18 * scale, height: 18 * scale, borderRadius: 2 * scale }]}>
          <Image source={art.plus} style={{ width: 9 * scale, height: 9 * scale }} contentFit="contain" />
        </Pressable>
      </View>
      <Text accessibilityRole="header" style={{ color: GOLD, fontSize: 14 * scale, fontWeight: '700', marginLeft: 14 * scale, marginTop: 7 * scale, marginBottom: 3 * scale, lineHeight: 21 * scale }}>视频教程</Text>
      <View style={[styles.tutorialGrid, { gap: 6 * scale, marginLeft: 13 * scale, paddingBottom: 15 * scale }]}>
        {tutorialColumns.map((column, index) => (
          <View key={index} style={{ width: 160 * scale, gap: 4 * scale }}>
            {column.map((item, itemIndex) => <TutorialCard key={itemIndex} item={item} scale={scale} />)}
          </View>
        ))}
      </View>
    </View>
  );
}

function TutorialCard({ item, scale }: Scaled & { item: Tutorial }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={item.title} onPress={() => planned(item.title)}>
      <View style={[styles.clip, { width: 160 * scale, height: item.height * scale, borderRadius: 8 * scale }]}>
        <Artwork source={item.source} box={item.crop} scale={scale} />
      </View>
      <View style={{ paddingHorizontal: 6 * scale, paddingTop: 4 * scale, height: 43 * scale }}>
        <Text numberOfLines={1} style={[styles.tutorialTitle, { fontSize: 10 * scale, lineHeight: 14 * scale }]}>{item.title}</Text>
        <View style={[styles.tutorialMeta, { marginTop: 3 * scale }]}>
          <View style={{ backgroundColor: item.quote ? '#C1C1C1' : '#FEE9DA', borderRadius: 2 * scale, paddingHorizontal: 4 * scale, paddingVertical: 1 * scale }}>
            <Text numberOfLines={1} style={{ color: item.quote ? '#FFFFFF' : '#8F150E', fontSize: 7 * scale }}>{item.tag}</Text>
          </View>
          <View style={[styles.metricRow, { gap: 6 * scale }]}>
            <Metric source={art.heart} width={10.25} height={8.93} value={item.likes} scale={scale} />
            <Metric source={art.star} width={11} height={11} value={item.saves} scale={scale} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function Metric({ source, width, height, value, scale }: Scaled & { source: ImageSource; width: number; height: number; value: number }) {
  return (
    <View style={[styles.metricRow, { gap: 2 * scale }]}>
      <Image source={source} style={{ width: width * scale, height: height * scale }} contentFit="contain" accessible={false} />
      <Text style={{ color: '#888888', fontSize: 8 * scale }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: PAGE_COLOR, alignItems: 'center' },
  page: { flex: 1, backgroundColor: PAGE_COLOR },
  header: { overflow: 'hidden', backgroundColor: '#FEEED8' },
  headerTitle: { color: '#000000', fontWeight: '500' },
  panel: { alignSelf: 'center', backgroundColor: '#FFFFFF' },
  clip: { overflow: 'hidden' },
  historyTitle: { position: 'absolute', color: GOLD, fontWeight: '600' },
  historyHint: { position: 'absolute', color: '#9A9A9A' },
  feedTabs: { flexDirection: 'row', alignItems: 'stretch', paddingLeft: 4, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#EDEDED' },
  feedTab: { alignItems: 'center', justifyContent: 'center' },
  collections: { flexDirection: 'row' },
  collectionPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F3F3' },
  center: { alignItems: 'center', justifyContent: 'center' },
  tutorialGrid: { flexDirection: 'row' },
  tutorialTitle: { color: '#2B2B2B', includeFontPadding: false },
  tutorialMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  metricRow: { flexDirection: 'row', alignItems: 'center' },
});
