import { Image, type ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PAGE = '#FCFCFC';
const WIDTH = 370;
const art = {
  paper: require('../../../assets/figma/journal-record/paper.png'),
  back: require('../../../assets/figma/journal-history/back.svg'),
  more: require('../../../assets/figma/journal-record/more.svg'),
  section: require('../../../assets/figma/brew-pairing/section-icon.svg'),
  buns: require('../../../assets/figma/journal-record/steamed-buns.jpg'),
  balls: require('../../../assets/figma/journal-record/rice-balls.jpg'),
  sago: require('../../../assets/figma/journal-record/sago.jpg'),
  cakes: require('../../../assets/figma/journal-record/crispy-cakes.jpg'),
  riceCake: require('../../../assets/figma/journal-record/rice-cake.jpg'),
  pie: require('../../../assets/figma/journal-record/sugar-roll.jpg'),
  ginger: require('../../../assets/figma/journal-history/ginger.jpg'),
  egg: require('../../../assets/figma/journal-history/angelica-egg.jpg'),
  olderSago: require('../../../assets/figma/journal-history/sago-2025.jpg'),
};

// Local samples from the design, until saved journal data is connected.
const activityRows = [
  '100011000110001100011000110001100011011010011000001111000110',
  '010000100001000010000100001000010001010111000010001000100001',
  '101011010110101101011010110101101010001101011100001100101001',
  '111011110111101111011110111101111010001010100101010101000010',
  '001110011100111001110011100111001111000100101000001000101001',
  '110001100011000110001100011000110001001111010110100010010100',
  '111011110111101111011110111101111011011110111000001010010100',
];
const months = Array.from({ length: 12 }, (_, i) => i + 1);

type Box = readonly [left: number, top: number, width: number, height: number];
type Entry = { title: string; tag: string; image: ImageSource; crop: Box; flip?: true };
type Year = { year: number; groups: { month: number; entries: Entry[] }[] };
const egg: Entry = { title: '红糖当归蛋', tag: '红糖主食', image: art.egg, crop: [-2, -81, 244, 194] };
const timeline: Year[] = [
  { year: 2026, groups: [
    { month: 5, entries: [
      { title: '红糖馒头首次尝试', tag: '红糖早餐', image: art.buns, crop: [-2, -54, 248, 248] },
      { title: '红糖糯米小圆子', tag: '红糖甜品', image: art.balls, crop: [-3, -27, 252, 168] },
    ] },
    { month: 4, entries: [
      { title: '红糖姜枣西米露 成果展示', tag: '红糖甜品', image: art.sago, crop: [-11, -18, 256, 341] },
      { title: '红糖糍粑', tag: '红糖糕点', image: art.cakes, crop: [0, -84, 245, 245], flip: true },
    ] },
    { month: 3, entries: [
      { title: '红糖年糕  多人份', tag: '红糖主食', image: art.riceCake, crop: [-1, -80, 243, 195] },
    ] },
  ] },
  { year: 2025, groups: [
    { month: 12, entries: [
      { title: '红糖馅饼', tag: '红糖主食', image: art.pie, crop: [1, -142, 248, 330] },
    ] },
    { month: 10, entries: [
      { title: '红糖西米露', tag: '红糖甜品', image: art.olderSago, crop: [-6, -38, 250, 332] },
      { title: '红糖姜茶', tag: '红糖饮品', image: art.ginger, crop: [-11, -117, 287, 287] },
    ] },
    { month: 8, entries: [egg] },
    { month: 7, entries: [egg, egg, egg] },
  ] },
];

function planned(title: string) {
  Alert.alert(title, '功能规划中');
}

function frame([left, top, width, height]: Box, scale: number) {
  return { position: 'absolute' as const, left: left * scale, top: top * scale, width: width * scale, height: height * scale };
}

export default function JournalHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const width = Math.min(useWindowDimensions().width, 430);
  const scale = width / WIDTH;
  const headerTop = Math.max(48 * scale, insets.top);
  const headerHeight = headerTop + 34 * scale;

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={[styles.page, { width }]}>
        <LinearGradient colors={['#FFE7C2', PAGE, PAGE]} locations={[0, 0.2443, 1]} style={[StyleSheet.absoluteFill, { height: 822 * scale }]} />
        <View style={[styles.header, { height: headerHeight }]}>
          <Image source={art.paper} style={frame([0, -76, 370, 185], scale)} contentFit="contain" />
          <Pressable accessibilityRole="button" accessibilityLabel="返回手札记录"
            onPress={() => router.canGoBack() ? router.back() : router.replace('/journal/flavor')}
            style={frame([16, headerTop / scale - 4, 116, 38], scale)}>
            <Image source={art.back} style={frame([8.1, 12.2, 9.55, 17.14], scale)} contentFit="contain" />
            <Text accessibilityRole="header" style={{ color: '#000000', fontSize: 16 * scale, marginLeft: 24 * scale, marginTop: 9 * scale }}>过往记录</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="更多" onPress={() => planned('更多')} style={frame([316, headerTop / scale - 2, 44, 36], scale)}>
            <Image source={art.more} style={frame([7, 4, 30, 30], scale)} contentFit="contain" />
          </Pressable>
        </View>
        <ScrollView nestedScrollEnabled contentInsetAdjustmentBehavior="never" showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 14 * scale, paddingTop: 12 * scale, paddingBottom: 18 * scale }}>
          <ActivityBoard scale={scale} />
          <View style={[styles.panel, { width: 350 * scale, borderRadius: 12 * scale, paddingTop: 14 * scale, paddingBottom: 16 * scale }]}>
            <SectionTitle title="记录时刻" scale={scale} />
            {timeline.map((group) => <YearTimeline key={group.year} group={group} scale={scale} />)}
          </View>
        </ScrollView>
        <View style={{ height: insets.bottom, backgroundColor: '#FFFFFF' }} />
      </View>
    </View>
  );
}

function SectionTitle({ title, scale }: { title: string; scale: number }) {
  return (
    <View style={[styles.sectionTitle, { height: 22 * scale, marginLeft: 13 * scale, gap: 5 * scale }]}>
      <Image source={art.section} style={{ width: 17.6 * scale, height: 18.7 * scale }} contentFit="contain" accessible={false} />
      <Text accessibilityRole="header" style={{ color: '#C28B3D', fontSize: 14 * scale, fontWeight: '700', letterSpacing: 0.7 * scale }}>{title}</Text>
    </View>
  );
}

function ActivityBoard({ scale }: { scale: number }) {
  return (
    <View style={[styles.panel, { width: 350 * scale, height: 143 * scale, borderRadius: 8 * scale, paddingTop: 8 * scale }]}>
      <SectionTitle title="记录看板" scale={scale} />
      <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, width: 331 * scale, height: 100 * scale, marginLeft: 10 * scale, marginTop: 3 * scale }}>
        <View style={{ width: 718 * scale, height: 100 * scale }}>
          {months.map((month) => (
            <Text key={month} style={[frame([60 * (month - 1) - 5, 0, 33, 12], scale), styles.monthCaption, { fontSize: 8 * scale }]}>{month}月</Text>
          ))}
          <View accessible accessibilityLabel="全年记录热力图" style={[styles.activityGrid, { top: 18 * scale, rowGap: 0.893 * scale }]}>
            {activityRows.map((row, rowIndex) => (
              <View key={rowIndex} style={[styles.activityRow, { columnGap: scale }]}>
                {Array.from(row, (active, column) => (
                  <View key={column} style={{ width: 10.964 * scale, height: 10.964 * scale, borderRadius: 2 * scale, backgroundColor: active === '1' ? '#FDE3B5' : '#FBF7EE' }} />
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function YearTimeline({ group, scale }: { group: Year; scale: number }) {
  return (
    <View style={{ marginTop: (group.year === timeline[0].year ? 8 : 18) * scale }}>
      <View style={[styles.yearHeader, { marginLeft: 13 * scale, marginRight: 6 * scale, height: 21 * scale, marginBottom: 6 * scale }]}>
        <Text accessibilityRole="header" style={{ color: '#B57235', fontSize: 16 * scale }}>{group.year}年</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={`查看${group.year}年记录详情`} hitSlop={8} onPress={() => planned(`${group.year}年记录`)}>
          <Text style={{ color: '#9A9A9A', fontSize: 8 * scale }}>查看详情 ›</Text>
        </Pressable>
      </View>
      <View style={{ gap: 10 * scale }}>
        {group.groups.map(({ month, entries }) => (
          <View key={month} style={[styles.monthGroup, { gap: 10 * scale }]}>
            <View style={[styles.monthLabel, { width: 36 * scale, height: 72 * scale, paddingLeft: 3 * scale }]}>
              <Text style={{ color: '#C7A280', fontSize: 14 * scale }}>{month}月</Text>
            </View>
            {entries.map((entry, i) => <RecordCard key={i} entry={entry} scale={scale} />)}
          </View>
        ))}
      </View>
    </View>
  );
}

function RecordCard({ entry, scale }: { entry: Entry; scale: number }) {
  return (
    <View style={[styles.record, { width: 314 * scale, height: 72 * scale, borderTopLeftRadius: 8 * scale, borderBottomLeftRadius: 8 * scale }]}>
      <View style={[styles.recordCopy, { width: 83 * scale, paddingLeft: 6 * scale, paddingRight: 10 * scale, paddingTop: 7 * scale, paddingBottom: 6 * scale }]}>
        <Text numberOfLines={3} style={[styles.recordTitle, { fontSize: 10 * scale, lineHeight: 13 * scale, letterSpacing: 0.5 * scale }]}>{entry.title}</Text>
        <View style={[styles.recordTag, { width: 40 * scale, height: 13 * scale, borderRadius: 2 * scale }]}>
          <Text style={{ color: '#FDE3B5', fontSize: 7 * scale, letterSpacing: 0.35 * scale, includeFontPadding: false }}>{entry.tag}</Text>
        </View>
      </View>
      <View style={styles.photoClip}>
        <Image source={entry.image} accessible={false} style={[frame(entry.crop, scale), entry.flip && styles.flip]} contentFit="cover" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', backgroundColor: PAGE },
  page: { flex: 1, overflow: 'hidden', backgroundColor: PAGE },
  header: { overflow: 'hidden', backgroundColor: '#FEEED8' },
  panel: { alignSelf: 'center', backgroundColor: '#FFFFFF', boxShadow: '0 0 10px rgba(65, 39, 0, 0.06)' },
  sectionTitle: { flexDirection: 'row', alignItems: 'center' },
  monthCaption: { color: '#909090', textAlign: 'center', includeFontPadding: false },
  activityGrid: { position: 'absolute', left: 0 },
  activityRow: { flexDirection: 'row' },
  yearHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  monthGroup: { alignItems: 'flex-end' },
  monthLabel: { position: 'absolute', left: 0, top: 0, alignItems: 'flex-start', justifyContent: 'center' },
  record: { flexDirection: 'row', backgroundColor: '#FFFFFF', boxShadow: '0 0 4px rgba(0, 0, 0, 0.10)' },
  recordCopy: { justifyContent: 'space-between' },
  recordTitle: { color: '#2B2B2B', includeFontPadding: false },
  recordTag: { backgroundColor: '#D09F51', alignItems: 'center', justifyContent: 'center' },
  photoClip: { flex: 1, overflow: 'hidden' },
  flip: { transform: [{ scaleX: -1 }] },
});
