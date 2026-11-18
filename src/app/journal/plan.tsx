import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { JournalInspiration } from '@/components/JournalInspiration';
import { flavors, type Flavor } from '@/data/journal';
import { journalProducts, type JournalProduct } from '@/data/journalProducts';

const art = {
  headerBackground: require('../../../assets/figma/journal-plan/header-background.svg'),
  headerPaper: require('../../../assets/figma/journal-plan/header-paper.png'),
  toolbarCircle: require('../../../assets/figma/journal-plan/toolbar-circle.svg'),
  back: require('../../../assets/figma/journal-plan/back.svg'),
  share: require('../../../assets/figma/journal-plan/share.svg'),
  more: require('../../../assets/figma/journal-plan/more.svg'),
  calendar: require('../../../assets/figma/journal-start/calendar.svg'),
  edit: require('../../../assets/figma/journal-plan/edit.svg'),
  add: require('../../../assets/figma/journal-plan/add.svg'),
  divider: require('../../../assets/figma/journal-plan/tab-divider.svg'),
};

const schedule = [
  { date: '10月7日', weekday: '周二', title: '冲泡红糖姜枣茶' },
  { date: '11月2日', weekday: '周五', title: '制作红糖年糕' },
];
const pendingFlavors: readonly Flavor[] = ['红糖主食', '红糖甜品', '红糖糕点', '红糖饮品'];
const planTabs = ['方案详情', '制作灵感', '代定设置'] as const;
const overview = '总览';

function getDateLabel(choice?: string) {
  if (choice !== '今天' && choice !== '昨天') return schedule[0].date;
  const date = new Date();
  if (choice === '昨天') date.setDate(date.getDate() - 1);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function planned(label: string) {
  Alert.alert(label, '功能规划中');
}

export default function JournalPlanScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ note?: string; flavor?: string; date?: string }>();
  const insets = useSafeAreaInsets();
  const width = Math.min(useWindowDimensions().width, 430);
  const scale = width / 370;
  const toolbarTop = Math.max(54 * scale, insets.top + 6 * scale);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => getDateLabel(params.date));
  const [dateFilter, setDateFilter] = useState(overview);
  const [activeTab, setActiveTab] = useState<(typeof planTabs)[0 | 1]>('方案详情');
  const [addedIds, setAddedIds] = useState<ReadonlySet<JournalProduct['id']>>(() => new Set());
  const titleInput = useRef<TextInput>(null);

  const chosenFlavor = flavors.find((flavor) => flavor === params.flavor);
  const pending = chosenFlavor && !pendingFlavors.includes(chosenFlavor)
    ? [...pendingFlavors, chosenFlavor]
    : pendingFlavors;
  const draft = typeof params.note === 'string' ? params.note.trim() : '';
  const pendingText = draft || pending.join('、') + '......';
  const visibleSchedule = dateFilter === overview ? schedule : schedule.filter((entry) => entry.date === dateFilter);
  const addedProducts = journalProducts.filter((product) => addedIds.has(product.id));

  function addInspiration(id: JournalProduct['id']) {
    setAddedIds((current) => current.has(id) ? current : new Set([...current, id]));
  }

  function chooseDate() {
    titleInput.current?.blur();
    Alert.alert('选择记录日期', undefined, [
      { text: '取消', style: 'cancel' },
      { text: '昨天', onPress: () => setDate(getDateLabel('昨天')) },
      { text: '今天', onPress: () => setDate(getDateLabel('今天')) },
    ]);
  }

  function sharePlan() {
    const lines = [title.trim() || '方案详情', ...schedule.map((entry) => `${entry.date} ${entry.weekday} ${entry.title}`),
      `待安排：${pendingText}`, ...addedProducts.map((product) => product.title)];
    void Share.share({ message: lines.join('\n') }).catch(() => Alert.alert('分享方案', '暂时无法打开分享。'));
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={[styles.page, { width }]}>
        <LinearGradient colors={['#FFE7C2', '#FCFCFC']} style={[StyleSheet.absoluteFill, { height: 201 * scale }]} />
        <Image source={art.headerBackground} contentFit="contain" accessible={false}
          style={[styles.headerArt, { width, height: 82 * scale }]} />
        <Image source={art.headerPaper} contentFit="contain" accessible={false}
          style={[styles.headerArt, { width, height: 109 * scale }]} />
        <View style={[styles.toolbar, { marginTop: toolbarTop, height: 30 * scale, marginBottom: 17 * scale, paddingHorizontal: 10 * scale, gap: 8 * scale }]}>
          <Pressable accessibilityRole="button" accessibilityLabel="返回记录口味" hitSlop={6}
            onPress={() => router.canGoBack() ? router.back() : router.replace('/journal/start')}>
            <Image source={art.back} style={{ width: 30 * scale, height: 30 * scale }} contentFit="contain" accessible={false} />
          </Pressable>
          <View style={styles.spacer} />
          <Pressable accessibilityRole="button" accessibilityLabel="分享方案" hitSlop={4} onPress={sharePlan} style={styles.toolbarButton}>
            <Image source={art.toolbarCircle} style={{ width: 30 * scale, height: 30 * scale }} contentFit="contain" accessible={false} />
            <Image source={art.share} style={[styles.shareIcon, { left: 5 * scale, top: 3.75 * scale, width: 20 * scale, height: 20 * scale }]} contentFit="contain" accessible={false} />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="更多" hitSlop={4} onPress={() => planned('更多')} style={styles.toolbarButton}>
            <Image source={art.toolbarCircle} style={{ width: 30 * scale, height: 30 * scale }} contentFit="contain" accessible={false} />
            <Image source={art.more} style={StyleSheet.absoluteFill} contentFit="contain" accessible={false} />
          </Pressable>
        </View>

        <View style={[styles.sheet, { borderTopLeftRadius: 8 * scale, borderTopRightRadius: 8 * scale }]}>
          <View style={[styles.handle, { marginTop: 9 * scale, width: 50 * scale, height: 6 * scale, borderRadius: 3 * scale }]} />
          <View style={[styles.titleRow, { marginTop: 16 * scale, marginHorizontal: 19 * scale, height: 29 * scale, gap: 3 * scale }]}>
            <TextInput ref={titleInput} accessibilityLabel="手札记录标题" value={title} onChangeText={setTitle}
              placeholder="给手札记录取一个标题吧~" placeholderTextColor="#161616" maxLength={36} returnKeyType="done"
              style={[styles.titleInput, { width: 234 * scale, fontSize: 18 * scale, letterSpacing: 1.8 * scale }]} />
            <Pressable accessibilityRole="button" accessibilityLabel="编辑标题" onPress={() => titleInput.current?.focus()} hitSlop={6}
              style={{ marginTop: 4 * scale }}>
              <Image source={art.edit} style={{ width: 15 * scale, height: 15 * scale }} contentFit="contain" accessible={false} />
            </Pressable>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel={`设置日期：${date}`} hitSlop={5} onPress={chooseDate}
            style={[styles.dateRow, { marginLeft: 19 * scale, marginTop: 9 * scale, height: 16 * scale, gap: 4 * scale }]}>
            <Image source={art.calendar} style={{ width: 16 * scale, height: 16 * scale }} contentFit="contain" accessible={false} />
            <Text style={[styles.bodyText, { fontSize: 10 * scale }]}>设置日期：{date}</Text>
          </Pressable>

          <View style={[styles.dateFilters, { marginTop: 15 * scale, marginLeft: 17 * scale, marginRight: 10 * scale, gap: 12 * scale, height: 22 * scale }]}>
            {[overview, ...schedule.map((entry) => entry.date)].map((label) => {
              const active = label === dateFilter;
              return (
                <Pressable key={label} accessibilityRole="tab" accessibilityState={{ selected: active }} accessibilityLabel={label}
                  onPress={() => setDateFilter(label)} hitSlop={{ top: 4, bottom: 4 }}
                  style={[styles.datePill, { width: 69 * scale, height: 22 * scale, borderRadius: 11 * scale, borderWidth: scale }, active && styles.activePill]}>
                  <Text style={[styles.bodyText, { fontSize: 12 * scale, color: active ? '#FFFFFF' : '#464646' }]}>{label}</Text>
                </Pressable>
              );
            })}
            <View style={styles.spacer} />
            <Pressable accessibilityRole="button" accessibilityLabel="添加日期" onPress={() => planned('添加日期')} hitSlop={6}
              style={[styles.addButton, { width: 22 * scale, height: 22 * scale, borderRadius: 11 * scale }]}>
              <Image source={art.add} style={{ width: 11 * scale, height: 11 * scale }} contentFit="contain" accessible={false} />
            </Pressable>
          </View>

          <View style={[styles.tabBar, { height: 37 * scale, marginTop: 10 * scale, paddingHorizontal: 22 * scale }]}>
            <Image source={art.divider} style={[styles.tabDivider, { left: -0.5 * scale, width: 371 * scale, height: scale }]} contentFit="contain" accessible={false} />
            {planTabs.map((label) => (
              <Pressable key={label} accessibilityRole="tab" accessibilityState={{ selected: label === activeTab }}
                onPress={() => label === '代定设置' ? planned(label) : setActiveTab(label)} style={styles.tab}>
                <Text style={[styles.bodyText, { fontSize: 12 * scale }]}>{label}</Text>
                {label === activeTab && <View style={[styles.activeTab, { height: 3 * scale }]} />}
              </Pressable>
            ))}
          </View>

          <ScrollView key={activeTab} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentInsetAdjustmentBehavior="never"
            contentContainerStyle={{ paddingTop: (activeTab === '制作灵感' ? 12 : 22) * scale, paddingHorizontal: 10 * scale, paddingBottom: 16 * scale, gap: 12 * scale }}>
            {activeTab === '制作灵感' ? (
              <JournalInspiration scale={scale} addedIds={addedIds} onAdd={addInspiration} />
            ) : (
              <>
                {visibleSchedule.map((entry) => (
                  <View key={entry.date} style={[styles.scheduleCard, { minHeight: 51 * scale, borderRadius: 8 * scale, borderWidth: scale, paddingHorizontal: 13 * scale }]}>
                    <Text style={[styles.bodyText, { width: 54 * scale, fontSize: 12 * scale }]}>{entry.date}</Text>
                    <Text style={[styles.bodyText, { width: 46 * scale, fontSize: 12 * scale }]}>{entry.weekday}</Text>
                    <Text style={[styles.bodyText, styles.spacer, { fontSize: 12 * scale }]}>{entry.title}</Text>
                  </View>
                ))}
                {dateFilter === overview && (
                  <View style={[styles.pendingCard, { marginTop: 3 * scale, minHeight: 60 * scale, borderRadius: 8 * scale, borderWidth: scale, paddingHorizontal: 13 * scale, paddingVertical: 11 * scale, gap: 5 * scale }]}>
                    <Text style={[styles.bodyText, { fontSize: 12 * scale }]}>待安排</Text>
                    <Text style={[styles.pendingText, { fontSize: 10 * scale, lineHeight: 13 * scale }]}>{pendingText}</Text>
                    {addedProducts.map((product) => (
                      <Text key={product.id} style={[styles.bodyText, { fontSize: 12 * scale }]}>· {product.title}</Text>
                    ))}
                  </View>
                )}
              </>
            )}
          </ScrollView>
          <View style={{ height: insets.bottom }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', backgroundColor: '#FCFCFC' },
  page: { flex: 1, overflow: 'hidden' },
  headerArt: { position: 'absolute', left: 0, top: 0 },
  toolbar: { flexDirection: 'row', alignItems: 'center' },
  toolbarButton: { position: 'relative' },
  shareIcon: { position: 'absolute' },
  spacer: { flex: 1 },
  sheet: { flex: 1, overflow: 'hidden', backgroundColor: '#FFFFFF' },
  handle: { alignSelf: 'center', backgroundColor: '#D3D3D3' },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  titleInput: { padding: 0, color: '#161616', fontWeight: '700', includeFontPadding: false },
  dateRow: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center' },
  bodyText: { color: '#000000', includeFontPadding: false },
  dateFilters: { flexDirection: 'row', alignItems: 'center' },
  datePill: { alignItems: 'center', justifyContent: 'center', borderColor: '#BFBFBF' },
  activePill: { backgroundColor: '#B58238', borderColor: '#B58238' },
  addButton: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#EEEEEE' },
  tabBar: { flexDirection: 'row' },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabDivider: { position: 'absolute', bottom: 0 },
  activeTab: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#464646' },
  scheduleCard: { flexDirection: 'row', alignItems: 'center', borderColor: '#BFBFBF' },
  pendingCard: { justifyContent: 'center', borderColor: '#BFBFBF' },
  pendingText: { color: '#4E4E4E', includeFontPadding: false },
});
