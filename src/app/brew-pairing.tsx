import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, BackHandler, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const GOLD = '#D8891D';
const HEADING = '#C28B3D';
const BROWN = '#82553E';
const DURATION = 3 * 60 + 12;
const PLAN_FEEDBACK_MS = 350;
const ARC_WIDTH = 229;
const ARC_HEIGHT = 114;
const ARC_CAP_RADIUS = 12;
const ARC_CLIP_SIZE = ARC_WIDTH * 2;
// The left half of arc-track.svg, in the original Figma coordinates.
const ARC_POINTS = [[12, 114], [12, 79.6777], [38.1702, 11.9974], [114.258, 12]] as const;
const art = {
  background: require('../../assets/figma/brew-pairing/header-background.svg'),
  header: require('../../assets/figma/brew-pairing/header-overlay.svg'),
  track: require('../../assets/figma/brew-pairing/arc-track.svg'),
  progress: require('../../assets/figma/brew-pairing/arc-progress.svg'),
  caret: require('../../assets/figma/brew-pairing/caret.svg'),
  planChecked: require('../../assets/figma/brew-pairing/plan-checked.svg'),
  planDivider: require('../../assets/figma/brew-pairing/plan-divider.svg'),
  section: require('../../assets/figma/brew-pairing/section-icon.svg'),
  heart: require('../../assets/figma/brew-pairing/card-heart.svg'),
  search: require('../../assets/figma/brew-pairing/suggestion-search.svg'),
  back: require('../../assets/figma/brew-pairing/back.svg'),
  more: require('../../assets/figma/brew-pairing/more.svg'),
  rose: require('../../assets/figma/brew-pairing/rose.png'),
  ginger: require('../../assets/figma/brew-pairing/ginger.png'),
  longan: require('../../assets/figma/brew-pairing/longan.png'),
  jelly: require('../../assets/figma/brew-pairing/jelly.png'),
  date: require('../../assets/figma/brew-pairing/date-tea.png'),
  buns: require('../../assets/figma/brew-pairing/buns.png'),
  classTea: require('../../assets/figma/brew-pairing/class-tea.png'),
  activityHeart: require('../../assets/figma/journal-record/heart.svg'),
  star: require('../../assets/figma/journal-record/star.svg'),
};
const plans = [
  { number: '方案一', name: '红糖+红枣 茶' },
  { number: '方案二', name: '红糖+红枣+桂圆 茶' },
  { number: '方案三', name: '红糖+红枣+玫瑰 茶' },
];
const suggestions = ['最受欢迎的冲泡方案', '红糖冲泡秘诀', '红糖冲泡黄金时间'];
const ideas = [
  { name: '红糖玫瑰茶', image: art.rose, likes: 34 },
  { name: '红糖姜茶', image: art.ginger, likes: 27 },
  { name: '红糖桂花龙眼茶', image: art.longan, likes: 25 },
  { name: '红糖冰凉粉（夏）', image: art.jelly, likes: 21 },
  { name: '红糖枣茶', image: art.date, likes: 23 },
  { name: '红糖馒头', image: art.buns, likes: 22 },
];
const lessons = [
  { name: '巧家红糖枣茶冲泡讲解视频教程', image: art.classTea, tags: ['巧家红糖', '红枣'], likes: 126, saves: 52 },
  { name: '巧家红糖馒头视频教程', image: art.buns, tags: ['巧家红糖', '面粉', '酵母'], likes: 110, saves: 32 },
  { name: '红糖桂花龙眼饮品视频教程', image: art.longan, tags: ['巧家红糖', '桂花', '桂圆'], likes: 35, saves: 11 },
];

function planned(title: string) {
  Alert.alert(title, '功能规划中');
}

function frame(left: number, top: number, width: number, height: number, scale: number) {
  return { position: 'absolute' as const, left: left * scale, top: top * scale, width: width * scale, height: height * scale };
}

function formatTime(seconds: number) {
  return [Math.floor(seconds / 60), seconds % 60].map((part) => String(part).padStart(2, '0')).join(':');
}

function TimerArc({ remaining, scale }: { remaining: number; scale: number }) {
  const fraction = remaining / DURATION;
  const t = fraction;
  const u = 1 - t;
  const [start, first, second, end] = ARC_POINTS;
  const point = (axis: 0 | 1) => u ** 3 * start[axis] + 3 * u ** 2 * t * first[axis] + 3 * u * t ** 2 * second[axis] + t ** 3 * end[axis];
  const tangent = (axis: 0 | 1) => u ** 2 * (first[axis] - start[axis]) + 2 * u * t * (second[axis] - first[axis]) + t ** 2 * (end[axis] - second[axis]);
  const x = point(0);
  const y = point(1);
  const angle = Math.atan2(tangent(1), tangent(0));
  const angleDegrees = angle * 180 / Math.PI;
  const artworkStyle = { width: 126.258 * scale, height: ARC_HEIGHT * scale };

  return (
    <View pointerEvents="none" style={[frame(73, 9, ARC_WIDTH, ARC_HEIGHT, scale), styles.clip]}>
      <Image source={art.track} style={StyleSheet.absoluteFill} contentFit="contain" />
      {remaining === DURATION ? (
        <Image source={art.progress} style={artworkStyle} contentFit="contain" />
      ) : remaining > 0 && (
        <>
          {/* Cut across the curved stroke at the live tangent, then cap that cut with a circle. */}
          <View style={[styles.clip, frame(x - ARC_CLIP_SIZE, y - ARC_CLIP_SIZE / 2, ARC_CLIP_SIZE, ARC_CLIP_SIZE, scale), {
            transformOrigin: 'right center',
            transform: [{ rotate: `${angleDegrees}deg` }],
          }]}>
            <View style={[StyleSheet.absoluteFill, { transformOrigin: 'right center', transform: [{ rotate: `${-angleDegrees}deg` }] }]}>
              <Image source={art.progress} style={frame(ARC_CLIP_SIZE - x, ARC_CLIP_SIZE / 2 - y, 126.258, ARC_HEIGHT, scale)} contentFit="contain" />
            </View>
          </View>
          <View style={[frame(x - ARC_CAP_RADIUS, y - ARC_CAP_RADIUS, ARC_CAP_RADIUS * 2, ARC_CAP_RADIUS * 2, scale), {
            backgroundColor: GOLD,
            borderRadius: ARC_CAP_RADIUS * scale,
          }]} />
        </>
      )}
    </View>
  );
}

export default function BrewPairingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const width = Math.min(useWindowDimensions().width, 430);
  const scale = width / 370;
  const headerHeight = Math.max(82 * scale, insets.top + 40 * scale);
  const [plan, setPlan] = useState<string>();
  const [isPickerOpen, setPickerOpen] = useState(false);
  const pickerCloseTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [deadline, setDeadline] = useState<number>();
  const [remaining, setRemaining] = useState(DURATION);
  const running = deadline !== undefined && remaining > 0;
  const numberedPlan = plans.find((item) => item.name === plan);
  const planLabel = numberedPlan ? `${numberedPlan.number}   ${numberedPlan.name}` : (plan ?? '请选择冲泡方案');

  const cancelPickerClose = useCallback(() => {
    clearTimeout(pickerCloseTimer.current);
    pickerCloseTimer.current = undefined;
  }, []);

  const closePicker = useCallback(() => {
    cancelPickerClose();
    setPickerOpen(false);
  }, [cancelPickerClose]);

  useEffect(() => cancelPickerClose, [cancelPickerClose]);

  useEffect(() => {
    if (!isPickerOpen) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      closePicker();
      return true;
    });
    return () => subscription.remove();
  }, [closePicker, isPickerOpen]);

  useEffect(() => {
    if (deadline === undefined) return;
    const tick = () => {
      const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(seconds);
      if (seconds === 0) setDeadline(undefined);
    };
    tick();
    const timer = setInterval(tick, 250);
    return () => clearInterval(timer);
  }, [deadline]);

  function chooseHistoryPlan(name: string) {
    setPlan(name);
    cancelPickerClose();
    pickerCloseTimer.current = setTimeout(closePicker, PLAN_FEEDBACK_MS);
  }

  function startBrewing() {
    if (!plan) {
      setPickerOpen(true);
      return;
    }
    closePicker();
    setRemaining(DURATION);
    setDeadline(Date.now() + DURATION * 1000);
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={[styles.page, { width }]}>
        <View style={[styles.header, { height: headerHeight }]}>
          <Image source={art.header} style={StyleSheet.absoluteFill} contentFit="cover" />
          <View style={[styles.toolbar, { height: 38 * scale, paddingHorizontal: 16 * scale }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="返回手札"
              onPress={() => router.canGoBack() ? router.back() : router.replace('/notes')}
              style={[styles.headerBack, { paddingHorizontal: 8 * scale, gap: 10 * scale }]}
            >
              <Image source={art.back} style={{ width: 10 * scale, height: 18 * scale }} contentFit="contain" />
              <Text style={{ color: '#000000', fontSize: 16 * scale }}>暖饮时刻</Text>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="更多" onPress={() => planned('更多')} style={styles.center}>
              <Image source={art.more} style={{ width: 30 * scale, height: 30 * scale }} contentFit="contain" />
            </Pressable>
          </View>
        </View>
        <ScrollView keyboardShouldPersistTaps="handled" contentInsetAdjustmentBehavior="never" showsVerticalScrollIndicator={false}>
          <View style={{ height: 241 * scale }}>
            <Image source={art.background} style={frame(0, -82, 370, 339, scale)} contentFit="contain" />
            <TimerArc remaining={remaining} scale={scale} />
            <View style={[styles.center, frame(105, 62, 164, 64, scale)]} accessibilityLabel={`冲泡等待时间 ${formatTime(remaining)}`}>
              <Text style={[styles.time, { fontSize: 38 * scale, lineHeight: 43 * scale }]}>{formatTime(remaining)}</Text>
              <Text style={{ color: '#000000', fontSize: 12 * scale, letterSpacing: scale }}>{remaining === 0 ? '冲泡完成' : '冲泡等待时间'}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={startBrewing}
              disabled={running}
              style={[styles.center, frame(52, 187, 267, 38, scale), { backgroundColor: GOLD, borderRadius: 8 * scale, opacity: running ? 0.8 : 1 }]}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 12 * scale, fontWeight: '600' }}>{running ? '正在冲泡…' : '确认冲泡方案  开始冲泡红糖'}</Text>
            </Pressable>
            {isPickerOpen && (
              <Pressable
                accessible={false}
                onPress={closePicker}
                style={StyleSheet.absoluteFill}
              />
            )}
            <View style={[frame(87, 143, 197, isPickerOpen ? 98 : 24, scale), styles.picker]}>
              {isPickerOpen && (
                <View accessibilityRole="radiogroup" style={[styles.options, frame(0, 12, 197, 86, scale)]}>
                  <Text style={[styles.planText, { fontSize: 8 * scale, marginLeft: 9 * scale, marginTop: 17 * scale }]}>历史方案</Text>
                  <Image source={art.planDivider} style={frame(0, 29.75, 197, 0.5, scale)} contentFit="contain" />
                  {plans.map((item, index) => {
                    const checked = plan === item.name;
                    return (
                      <Pressable
                        key={item.number}
                        accessibilityRole="radio"
                        accessibilityLabel={`${item.number}，${item.name}`}
                        accessibilityState={{ checked }}
                        onPress={() => chooseHistoryPlan(item.name)}
                        style={[styles.plan, frame(0, 32 + index * 15.5, 197, 15.5, scale)]}
                      >
                        <Text style={[styles.planText, { fontSize: 8 * scale, marginLeft: 9 * scale, width: 49 * scale }]}>{item.number}</Text>
                        <Text style={[styles.planText, { fontSize: 8 * scale }]}>{item.name}</Text>
                        {checked && <Image source={art.planChecked} accessible={false} style={frame(177, 3.75, 8, 8, scale)} contentFit="contain" />}
                      </Pressable>
                    );
                  })}
                </View>
              )}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="选择冲泡方案"
                accessibilityValue={{ text: planLabel }}
                accessibilityState={{ expanded: isPickerOpen, disabled: running }}
                disabled={running}
                onPress={() => isPickerOpen ? closePicker() : setPickerOpen(true)}
                hitSlop={{ top: 6, bottom: 0, left: 6, right: 6 }}
                style={[styles.center, styles.pickerTrigger, frame(0, 0, 197, 24, scale), { borderRadius: 4 * scale }, isPickerOpen && styles.openTrigger]}
              >
                <Text numberOfLines={1} style={[styles.planText, { fontSize: 10 * scale, maxWidth: 160 * scale }]}>{isPickerOpen ? '请选择冲泡方案' : planLabel}</Text>
                <Image source={art.caret} accessible={false} style={[frame(178, 9, 9.53, 6, scale), { transform: [{ rotate: '180deg' }] }]} />
              </Pressable>
            </View>
          </View>
          <LinearGradient colors={['#FEFCF7', '#FDF4E3']} style={[styles.content, { paddingTop: 15 * scale, paddingBottom: 10 * scale, borderTopLeftRadius: 12 * scale, borderTopRightRadius: 12 * scale, gap: 10 * scale }]}>
            <Browse scale={scale} onSelect={(name) => { if (!running) { setPlan(name); closePicker(); } }} />
            <AiIdeas scale={scale} />
            <Classrooms scale={scale} />
          </LinearGradient>
        </ScrollView>
        <View style={{ height: insets.bottom, backgroundColor: '#FFFFFF' }} />
      </View>
    </View>
  );
}

function SectionTitle({ title, subtitle, scale }: { title: string; subtitle: string; scale: number }) {
  return (
    <View style={[styles.sectionTitle, { gap: 3 * scale, height: 24 * scale, marginLeft: 6 * scale }]}>
      <View style={{ width: 22 * scale, height: 22 * scale }}>
        <Image source={art.section} style={frame(3.3, 0, 17.6, 18.7, scale)} contentFit="contain" />
      </View>
      <Text accessibilityRole="header" style={{ color: HEADING, fontSize: 14 * scale, fontWeight: '700' }}>{title}</Text>
      <Text style={{ color: HEADING, fontSize: 10 * scale }}>· {subtitle}</Text>
    </View>
  );
}

function Browse({ scale, onSelect }: { scale: number; onSelect: (name: string) => void }) {
  return (
    <View style={[styles.panel, { width: 355 * scale, height: 167 * scale, paddingTop: 10 * scale, borderRadius: 8 * scale }]}>
      <SectionTitle title="方案浏览" subtitle="提供冲泡方案灵感" scale={scale} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 * scale, paddingHorizontal: 5 * scale, paddingVertical: 4 * scale }}>
        {ideas.map((item) => (
          <Pressable key={item.name} accessibilityRole="button" accessibilityLabel={`选择${item.name}`} onPress={() => onSelect(item.name)} style={[styles.idea, { width: 88 * scale, height: 120 * scale, padding: 3 * scale, borderRadius: 4 * scale }]}>
            <Image source={item.image} style={{ width: 82 * scale, height: 90 * scale, borderRadius: 4 * scale }} contentFit="cover" />
            <View style={[styles.ideaInfo, { marginTop: 8 * scale }]}>
              <Text numberOfLines={1} style={{ color: '#606060', fontSize: 8 * scale, flexShrink: 1 }}>{item.name}</Text>
              <Counter image={art.heart} value={item.likes} size={6} scale={scale} />
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function AiIdeas({ scale }: { scale: number }) {
  const [query, setQuery] = useState('');
  return (
    <View style={[styles.clip, styles.panel, { width: 354 * scale, height: 110 * scale, borderRadius: 8 * scale, paddingTop: 10 * scale }]}>
      <LinearGradient colors={['#FBF3E4', '#F1D3AD']} start={{ x: 0.1, y: 0.9 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
      <SectionTitle title="Ai推荐" subtitle="制定个性化一周引用方案" scale={scale} />
      <View style={[styles.inline, { gap: 7 * scale, paddingHorizontal: 8 * scale, marginTop: 9 * scale }]}>
        <TextInput
          accessibilityLabel="输入冲泡问题"
          value={query}
          onChangeText={setQuery}
          placeholder="帮我想一个红糖早茶方案~"
          placeholderTextColor="#989898"
          style={[styles.input, { height: 25 * scale, borderRadius: 13 * scale, fontSize: 8 * scale, paddingHorizontal: 10 * scale }]}
        />
        <Pressable accessibilityRole="button" onPress={() => planned('问一问Ai')} style={[styles.center, styles.white, { width: 70 * scale, height: 25 * scale, borderRadius: 13 * scale }]}>
          <Text style={{ color: HEADING, fontWeight: '700', fontSize: 10 * scale }}>问一问Ai</Text>
        </Pressable>
      </View>
      <ScrollView horizontal keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 * scale, paddingHorizontal: 8 * scale, paddingVertical: 8 * scale }}>
        {suggestions.map((suggestion) => (
          <Pressable key={suggestion} accessibilityRole="button" onPress={() => setQuery(suggestion)} style={[styles.inline, styles.white, { height: 22 * scale, paddingHorizontal: 10 * scale, borderRadius: 12 * scale, gap: 4 * scale }]}>
            <Image source={art.search} style={{ width: 10.37 * scale, height: 11 * scale }} contentFit="contain" />
            <Text style={{ color: '#606060', fontSize: 8 * scale }}>{suggestion}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function Classrooms({ scale }: { scale: number }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 * scale, paddingHorizontal: 8 * scale, paddingBottom: 5 * scale }}>
      {[0, 1, 2].map((group) => (
        <View key={group} style={[styles.classroom, { width: 277 * scale, borderRadius: 8 * scale, paddingTop: 10 * scale, paddingBottom: 12 * scale }]}>
          <SectionTitle title="精品课堂" subtitle="提供冲泡方案灵感" scale={scale} />
          {lessons.map((lesson, index) => (
            <Pressable key={lesson.name} accessibilityRole="button" accessibilityLabel={lesson.name} onPress={() => planned(lesson.name)} style={[styles.inline, { minHeight: 73 * scale, paddingHorizontal: 12 * scale, gap: 11 * scale }]}>
              <Text style={{ color: HEADING, fontWeight: '700', fontSize: 12 * scale, width: 9 * scale }}>{index + 1}</Text>
              <Image source={lesson.image} style={{ width: 58 * scale, height: 67 * scale }} contentFit="cover" />
              <View style={{ flex: 1, alignSelf: 'stretch', justifyContent: 'space-between', paddingVertical: 4 * scale }}>
                <Text numberOfLines={2} style={{ color: '#333333', fontSize: 12 * scale, lineHeight: 14 * scale }}>{lesson.name}</Text>
                <View style={[styles.inline, { gap: 5 * scale, flexWrap: 'wrap' }]}>
                  {lesson.tags.map((tag) => <Text key={tag} style={[styles.tag, { fontSize: 8 * scale, paddingHorizontal: 4 * scale }]}>{tag}</Text>)}
                </View>
                <View style={[styles.inline, { gap: 7 * scale }]}>
                  <Counter image={art.activityHeart} value={lesson.likes} size={8} scale={scale} />
                  <Counter image={art.star} value={lesson.saves} size={8} scale={scale} />
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

function Counter({ image, value, size, scale }: { image: number; value: number; size: number; scale: number }) {
  return (
    <View style={[styles.inline, { gap: 2 * scale }]}>
      <Image source={image} style={{ width: size * scale, height: size * scale }} contentFit="contain" />
      <Text style={{ color: '#777777', fontSize: size * scale }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', backgroundColor: '#FBF9F5' },
  page: { flex: 1, backgroundColor: '#FBF9F7' },
  header: { justifyContent: 'flex-end', overflow: 'hidden' },
  toolbar: { flexDirection: 'row', justifyContent: 'space-between' },
  headerBack: { flexDirection: 'row', alignItems: 'center' },
  time: { color: '#B57235', fontWeight: '600', fontVariant: ['tabular-nums'], letterSpacing: 2, includeFontPadding: false },
  center: { alignItems: 'center', justifyContent: 'center' },
  clip: { overflow: 'hidden' },
  content: { borderColor: '#FFFFFF', borderWidth: 1, alignItems: 'center' },
  panel: { backgroundColor: '#FFFFFF' },
  picker: { zIndex: 2 },
  pickerTrigger: { backgroundColor: '#FCF1E3' },
  openTrigger: { boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)' },
  options: { backgroundColor: '#FFFFFF' },
  plan: { flexDirection: 'row', alignItems: 'center' },
  planText: { color: BROWN, includeFontPadding: false },
  sectionTitle: { flexDirection: 'row', alignItems: 'center' },
  idea: { backgroundColor: '#FFFFFF', elevation: 1 },
  ideaInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  classroom: { backgroundColor: '#FEFDFC', elevation: 1 },
  inline: { flexDirection: 'row', alignItems: 'center' },
  white: { backgroundColor: '#FFFFFF' },
  input: { flex: 1, paddingVertical: 0, backgroundColor: '#FFFFFF', borderWidth: StyleSheet.hairlineWidth, borderColor: '#F4B876', color: '#333333' },
  tag: { color: '#DAAB6C', borderColor: '#DAAB6C', borderWidth: StyleSheet.hairlineWidth, backgroundColor: '#FFFAF2', borderRadius: 2 },
});
