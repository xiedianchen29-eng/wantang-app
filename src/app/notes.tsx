import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { bottomTabs } from '@/data/home';

const DESIGN_WIDTH = 370;
const DESIGN_BODY_HEIGHT = 744;
const MAX_CONTENT_WIDTH = 430;

const segmentBackground = require('../../assets/figma/notes/13e40.svg');
const segmentSelected = require('../../assets/figma/notes/370e2.svg');
const journalArtwork = require('../../assets/figma/notes/journal-artwork.png');
const journalPhotoStrip = require('../../assets/figma/notes/journal-photo-strip.png');
const journalTitle = require('../../assets/figma/notes/journal-title.svg');
const journalLabels = require('../../assets/figma/notes/journal-labels.svg');
const progressIcon = require('../../assets/figma/notes/503e2.svg');
const weekIcon = require('../../assets/figma/notes/2f35f.svg');
const teaIcon = require('../../assets/figma/notes/c9a31.svg');
const waterCircle = require('../../assets/figma/notes/46e08.svg');
const waterDrop = require('../../assets/figma/notes/3fc89.svg');
const steamCircle = require('../../assets/figma/notes/bd801.svg');
const steamIcon = require('../../assets/figma/notes/5cca2.svg');

const WEEK_DAYS = [
  { day: '一', date: '11', state: 'done' },
  { day: '二', date: '12', state: 'done' },
  { day: '三', date: '13', state: 'today' },
  { day: '四', date: '14', state: 'future' },
  { day: '五', date: '15', state: 'future' },
  { day: '六', date: '16', state: 'future' },
  { day: '日', date: '17', state: 'future' },
] as const;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

export default function NotesScreen() {
  const window = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const width = Math.min(window.width, MAX_CONTENT_WIDTH);
  const scale = width / DESIGN_WIDTH;
  const fontScale = clamp(scale, 0.92, 1.12);
  const navHeight = 78 * scale + insets.bottom;

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <LinearGradient
        colors={['#FCFAF8', '#FFF5E4']}
        locations={[0, 1]}
        style={[styles.page, { width }]}
      >
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            minHeight: DESIGN_BODY_HEIGHT * scale + insets.top,
            paddingTop: insets.top,
            paddingBottom: navHeight,
          }}
        >
          <View style={{ height: DESIGN_BODY_HEIGHT * scale }}>
            <PlanSelector scale={scale} fontScale={fontScale} />
            <JournalEntry scale={scale} fontScale={fontScale} />
            <ProgressCard scale={scale} fontScale={fontScale} />
            <WeeklyMemory scale={scale} fontScale={fontScale} />
            <TodayMoment scale={scale} fontScale={fontScale} />
          </View>
        </ScrollView>
        <BottomNavigation scale={scale} fontScale={fontScale} bottomInset={insets.bottom} />
      </LinearGradient>
    </View>
  );
}

function PlanSelector({ scale, fontScale }: ScaleProps) {
  const planned = useCallback(() => Alert.alert('28 天呵护', '功能规划中'), []);

  return (
    <View style={[styles.absolute, { left: 18 * scale, top: 68 * scale, width: 335 * scale, height: 43 * scale }]}>
      <Image source={segmentBackground} style={StyleSheet.absoluteFill} contentFit="fill" />
      <Image
        source={segmentSelected}
        style={{ position: 'absolute', left: 3 * scale, top: 3 * scale, width: 162.713 * scale, height: 37 * scale }}
        contentFit="fill"
      />
      <Pressable style={[styles.segmentHalf, { left: 0 }]} accessibilityRole="tab" accessibilityState={{ selected: true }}>
        <Text style={[styles.selectedSegmentText, { fontSize: 15 * fontScale }]}>7 天暖饮包</Text>
      </Pressable>
      <Pressable style={[styles.segmentHalf, { right: 0 }]} onPress={planned} accessibilityRole="tab" accessibilityState={{ selected: false }}>
        <Text style={[styles.segmentText, { fontSize: 15 * fontScale }]}>28 天呵护</Text>
      </Pressable>
    </View>
  );
}

function JournalEntry({ scale }: ScaleProps) {
  const planned = useCallback(() => Alert.alert('手札记录', '功能规划中'), []);

  return (
    <View style={[styles.absolute, { left: 18 * scale, top: 136 * scale, width: 335 * scale, height: 125 * scale }]}>
      <Pressable
        style={[styles.journalArtwork, { width: 94 * scale, height: 125 * scale }]}
        onPress={planned}
      >
        <Image source={journalArtwork} style={StyleSheet.absoluteFill} contentFit="fill" />
        <Image
          source={journalTitle}
          style={{ position: 'absolute', left: 38 * scale, top: 17.5 * scale, width: 18 * scale, height: 90 * scale }}
          contentFit="contain"
        />
      </Pressable>

      <Pressable
        onPress={planned}
        style={[styles.entryTray, { left: 105 * scale, width: 230 * scale, height: 125 * scale, borderRadius: 10 * scale }]}
      >
        <LinearGradient
          colors={['#B37B3D', '#D99650']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Image
          source={journalPhotoStrip}
          style={{ position: 'absolute', left: 16 * scale, top: 11 * scale, width: 207 * scale, height: 89 * scale }}
          contentFit="fill"
        />
        <Image
          source={journalLabels}
          style={{ position: 'absolute', left: 33 * scale, top: 105 * scale, width: 166 * scale, height: 10 * scale }}
          contentFit="contain"
        />
      </Pressable>
    </View>
  );
}

function ProgressCard({ scale, fontScale }: ScaleProps) {
  const planned = useCallback(() => Alert.alert('进度卡片', '功能规划中'), []);

  return (
    <View style={[styles.card, styles.absolute, { left: 9 * scale, top: 275 * scale, width: 353 * scale, height: 142 * scale, borderRadius: 8 * scale }]}>
      <SectionTitle icon={progressIcon} title="进度卡片" action="" scale={scale} fontScale={fontScale} />
      <LinearGradient
        colors={['#9A3F32', '#6E1713']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.progressBody, { left: 9 * scale, top: 27 * scale, width: 335 * scale, height: 106 * scale, borderRadius: 12 * scale }]}
      >
        <View style={[styles.progressTop, { marginHorizontal: 16 * scale, marginTop: 12 * scale }]}>
          <View>
            <Text style={[styles.progressDay, { fontSize: 15 * fontScale }]}>第 3 天</Text>
            <Text style={[styles.progressMeta, { fontSize: 8 * fontScale, marginTop: 1 * scale }]}>已完成 2 / 7 天</Text>
          </View>
          <Text style={[styles.progressPack, { fontSize: 9 * fontScale }]}>进行中的暖饮包</Text>
        </View>
        <Text style={[styles.progressDrink, { fontSize: 11 * fontScale, marginLeft: 16 * scale, marginTop: 8 * scale }]}>桂圆红枣暖饮 · 今日一包</Text>
        <View style={[styles.progressTrack, { left: 16 * scale, top: 66 * scale, width: 297 * scale, height: 7.5 * scale, borderRadius: 4 * scale }]}>
          <View style={[styles.progressFill, { width: 96 * scale, borderRadius: 4 * scale }]} />
        </View>
        <View style={[styles.progressBottom, { left: 16 * scale, right: 16 * scale, bottom: 10 * scale }]}>
          <Pressable onPress={planned} hitSlop={8}>
            <Text style={[styles.progressLink, { fontSize: 8 * fontScale }]}>我的记录 ›</Text>
          </Pressable>
          <Pressable
            onPress={planned}
            style={[styles.progressButton, { width: 51 * scale, height: 17 * scale, borderRadius: 9 * scale }]}
          >
            <Text style={[styles.progressButtonText, { fontSize: 7 * fontScale }]}>查看进度</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

function WeeklyMemory({ scale, fontScale }: ScaleProps) {
  const planned = useCallback(() => Alert.alert('本周记忆', '功能规划中'), []);

  return (
    <View style={[styles.card, styles.absolute, { left: 9 * scale, top: 427 * scale, width: 353 * scale, height: 136 * scale, borderRadius: 8 * scale }]}>
      <SectionTitle icon={weekIcon} title="本周记忆" subtitle="· 品牌好物向您推荐" action="查看时间轴 ›" onAction={planned} scale={scale} fontScale={fontScale} />
      <View style={[styles.weekPanel, { left: 9 * scale, top: 34 * scale, width: 335 * scale, height: 64 * scale, borderRadius: 8 * scale }]}>
        {WEEK_DAYS.map((item, index) => (
          <Pressable
            key={item.day}
            onPress={planned}
            style={[styles.dayColumn, { left: (10 + index * 46) * scale, top: 7 * scale, width: 38 * scale, height: 50 * scale }]}
          >
            <View
              style={[
                styles.dayCard,
                {
                  width: 38 * scale,
                  height: 45 * scale,
                  borderRadius: 10 * scale,
                  backgroundColor: item.state === 'done' ? '#731813' : item.state === 'today' ? '#F6DFCB' : '#FFFDF9',
                  borderWidth: item.state === 'future' ? 1 : 0,
                  borderColor: '#DCCBBE',
                },
              ]}
            >
              <Text style={[styles.dayLabel, { fontSize: 7 * fontScale, color: item.state === 'done' ? '#F7E3CB' : '#80665B' }]}>周{item.day}</Text>
              <Text style={[styles.dateLabel, { fontSize: 14 * fontScale, color: item.state === 'done' ? '#FFFFFF' : '#731813' }]}>{item.date}</Text>
              <View style={[styles.dayDot, { width: 5 * scale, height: 5 * scale, borderRadius: 3 * scale, backgroundColor: item.state === 'done' ? '#F7E3CB' : item.state === 'today' ? '#731813' : '#E6D8CD' }]} />
            </View>
          </Pressable>
        ))}
      </View>
      <View style={[styles.weekFooter, { left: 9 * scale, bottom: 9 * scale, width: 334 * scale, height: 21 * scale, borderRadius: 11 * scale }]}>
        <Text style={[styles.weekFooterText, { fontSize: 8 * fontScale }]}>连续 2 天 · 完成 5 天即可解锁专属优惠</Text>
      </View>
    </View>
  );
}

function TodayMoment({ scale, fontScale }: ScaleProps) {
  const planned = useCallback(() => Alert.alert('今日暖饮时刻', '功能规划中'), []);

  return (
    <View style={[styles.card, styles.absolute, { left: 9 * scale, top: 573 * scale, width: 353 * scale, height: 161 * scale, borderRadius: 8 * scale }]}>
      <SectionTitle icon={teaIcon} title="今日暖饮时刻" subtitle="· 品牌好物向您推荐" action="查看记忆卡 ›" onAction={planned} scale={scale} fontScale={fontScale} />
      <View style={[styles.todayPanel, { left: 9 * scale, top: 34 * scale, width: 335 * scale, height: 117 * scale, borderRadius: 9 * scale }]}>
        <View style={{ position: 'absolute', left: 19 * scale, top: 14 * scale, width: 46 * scale, height: 46 * scale }}>
          <Image source={waterCircle} style={StyleSheet.absoluteFill} contentFit="contain" />
          <Image source={waterDrop} style={{ position: 'absolute', left: 12 * scale, top: 7 * scale, width: 21.5 * scale, height: 32.7 * scale }} contentFit="contain" />
        </View>
        <Text style={[styles.todayHeadline, { left: 80 * scale, top: 16 * scale, fontSize: 13 * fontScale }]}>温水冲泡，慢等 3 分钟</Text>
        <Text style={[styles.todayDescription, { left: 80 * scale, top: 39 * scale, fontSize: 9 * fontScale }]}>记录这一杯的温度和心情</Text>
        <View style={{ position: 'absolute', right: 17 * scale, top: 17 * scale, width: 24 * scale, height: 24 * scale }}>
          <Image source={steamCircle} style={StyleSheet.absoluteFill} contentFit="contain" />
          <Image source={steamIcon} style={{ position: 'absolute', left: 4.5 * scale, top: 5.5 * scale, width: 15 * scale, height: 12.9 * scale }} contentFit="contain" />
        </View>
        <Pressable onPress={planned} style={[styles.brewButton, { left: 17 * scale, bottom: 15 * scale, width: 301 * scale, height: 28 * scale, borderRadius: 14 * scale }]}>
          <LinearGradient colors={['#A64A39', '#731813']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={StyleSheet.absoluteFill} />
          <Text style={[styles.brewButtonText, { fontSize: 10 * fontScale }]}>查看冲泡搭配方案</Text>
        </Pressable>
      </View>
    </View>
  );
}

function SectionTitle({ icon, title, subtitle, action, onAction, scale, fontScale }: ScaleProps & {
  icon: number;
  title: string;
  subtitle?: string;
  action: string;
  onAction?: () => void;
}) {
  return (
    <View style={[styles.sectionTitleRow, { height: 27 * scale, paddingHorizontal: 12 * scale }]}>
      <Image source={icon} style={{ width: 18 * scale, height: 18 * scale }} contentFit="contain" />
      <Text style={[styles.sectionTitle, { fontSize: 13 * fontScale, marginLeft: 4 * scale }]}>{title}</Text>
      {subtitle ? <Text style={[styles.sectionSubtitle, { fontSize: 7 * fontScale, marginLeft: 4 * scale }]}>{subtitle}</Text> : null}
      {action ? (
        <Pressable onPress={onAction} style={styles.sectionActionButton} hitSlop={8}>
          <Text style={[styles.sectionAction, { fontSize: 8 * fontScale }]}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function BottomNavigation({ scale, fontScale, bottomInset }: ScaleProps & { bottomInset: number }) {
  const router = useRouter();
  const onTabPress = useCallback((id: string, label: string) => {
    if (id === 'notes') return;
    if (id === 'home') {
      router.replace('/');
      return;
    }
    Alert.alert(label, '功能规划中');
  }, [router]);

  return (
    <View style={[styles.bottomNav, { height: 78 * scale + bottomInset, paddingBottom: bottomInset }]}>
      {bottomTabs.map((tab) => {
        const selected = tab.id === 'notes';
        return (
          <Pressable
            key={tab.id}
            style={styles.bottomTab}
            onPress={() => onTabPress(tab.id, tab.label)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
          >
            <Image source={tab.image} style={{ width: 40 * scale, height: 40 * scale }} contentFit="contain" />
            <Text style={[styles.bottomLabel, { fontSize: 9.4 * fontScale, color: selected ? '#68201B' : '#9D8B82', fontWeight: selected ? '700' : '400' }]}>{tab.label}</Text>
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
  segmentHalf: { position: 'absolute', top: 0, bottom: 0, width: '50%', alignItems: 'center', justifyContent: 'center' },
  selectedSegmentText: { color: '#FFF8EF', fontWeight: '700', letterSpacing: 0.4 },
  segmentText: { color: '#876F63', fontWeight: '500', letterSpacing: 0.4 },
  journalArtwork: { position: 'absolute', left: 0, top: 0, overflow: 'hidden' },
  entryTray: { position: 'absolute', top: 0, overflow: 'hidden' },
  card: { backgroundColor: '#FFFEFC', shadowColor: '#8D664B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 7, elevation: 2, overflow: 'hidden' },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { color: '#4D2924', fontWeight: '700' },
  sectionSubtitle: { color: '#A18D83' },
  sectionActionButton: { marginLeft: 'auto', height: '100%', justifyContent: 'center' },
  sectionAction: { color: '#73554B' },
  progressBody: { position: 'absolute', overflow: 'hidden' },
  progressTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  progressDay: { color: '#FFF7E9', fontWeight: '700' },
  progressMeta: { color: '#E8BCAA' },
  progressPack: { color: '#F4D9C9', marginTop: 2 },
  progressDrink: { color: '#FFF7ED', fontWeight: '600' },
  progressTrack: { position: 'absolute', overflow: 'hidden', backgroundColor: '#731813' },
  progressFill: { height: '100%', backgroundColor: '#FFF4E7' },
  progressBottom: { position: 'absolute', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  progressLink: { color: '#F3D0BE' },
  progressButton: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF9F0' },
  progressButtonText: { color: '#731813', fontWeight: '700' },
  weekPanel: { position: 'absolute', backgroundColor: '#F8EDE2', overflow: 'hidden' },
  dayColumn: { position: 'absolute', alignItems: 'center' },
  dayCard: { alignItems: 'center', justifyContent: 'center' },
  dayLabel: { lineHeight: 10 },
  dateLabel: { fontWeight: '700', lineHeight: 18 },
  dayDot: { marginTop: 2 },
  weekFooter: { position: 'absolute', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3E6D9' },
  weekFooterText: { color: '#8A6D60' },
  todayPanel: { position: 'absolute', backgroundColor: '#F5E5D4', overflow: 'hidden' },
  todayHeadline: { position: 'absolute', color: '#5B302A', fontWeight: '700' },
  todayDescription: { position: 'absolute', color: '#9D7D6D' },
  brewButton: { position: 'absolute', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  brewButtonText: { color: '#FFF8EE', fontWeight: '700' },
  bottomNav: { position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 20, flexDirection: 'row', alignItems: 'flex-start', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E6D9D1', backgroundColor: '#FFFFFF' },
  bottomTab: { flex: 1, alignItems: 'center', justifyContent: 'flex-start' },
  bottomLabel: { marginTop: -5 },
});

