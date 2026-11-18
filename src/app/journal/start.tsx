import { Image, type ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { flavors, type Flavor } from '@/data/journal';
import { journalProducts, type ProductTag } from '@/data/journalProducts';

const PAGE = '#FCFCFC';
const GOLD = '#C28B3D';
const PRICE = '#8C2E25';
const notePrefix = '我准备制作';
const aiRecordLabel = 'AI 创建手札记录';
const manualRecordLabel = '手动创建手札记录';
const art = {
  paper: require('../../../assets/figma/journal-record/paper.png'),
  back: require('../../../assets/figma/journal-history/back.svg'),
  more: require('../../../assets/figma/journal-record/more.svg'),
  headerTitle: require('../../../assets/figma/journal-start/header-title.svg'),
  formTitle: require('../../../assets/figma/journal-start/form-title.svg'),
  actions: require('../../../assets/figma/journal-start/record-actions.svg'),
  tea: require('../../../assets/figma/notes/c9a31.svg'),
  add: require('../../../assets/figma/journal-start/tag-add.svg'),
  calendar: require('../../../assets/figma/journal-start/calendar.svg'),
  heart: require('../../../assets/figma/journal-start/heart.svg'),
  microphone: require('../../../assets/figma/journal-start/microphone.svg'),
  ai: require('../../../assets/figma/journal-start/ai-mark.svg'),
  leaf: require('../../../assets/figma/journal-start/organic-leaf.svg'),
  nourish: require('../../../assets/figma/journal-start/nourish-icon.svg'),
  dateTea: require('../../../assets/figma/journal-start/guide-date.png'),
  coffee: require('../../../assets/figma/journal-start/guide-coffee.png'),
  threeSugars: require('../../../assets/figma/journal-start/three-sugars.jpg'),
};

type Crop = readonly [left: number, top: number, width: number, height: number];

const guides = [
  { title: '一杯红糖枣茶的温度', source: art.dateTea, width: 152, crop: [-5.61, -97.11, 162.73, 203.34] },
  { title: '红糖与咖啡的奇妙搭配', source: art.coffee, width: 153, crop: [-1.06, -89.11, 163.8, 204.68] },
  { title: '轻饮品 红糖牛乳枣茶', source: art.threeSugars, width: 152, crop: [0, -87.4, 152, 202.37] },
] as const;

function planned(title: string) {
  Alert.alert(title, '功能规划中');
}

function frame([left, top, width, height]: Crop, scale: number) {
  return { position: 'absolute' as const, left: left * scale, top: top * scale, width: width * scale, height: height * scale };
}

function CropImage({ source, crop, width, height, radius = 0, scale }: {
  source: ImageSource; crop: Crop; width: number; height: number; radius?: number; scale: number;
}) {
  return (
    <View style={{ width: width * scale, height: height * scale, borderRadius: radius * scale, overflow: 'hidden' }}>
      <Image source={source} style={frame(crop, scale)} contentFit="cover" accessible={false} />
    </View>
  );
}

export default function JournalStartScreen() {
  const router = useRouter();
  const { flavor } = useLocalSearchParams<{ flavor?: string }>();
  const initialFlavor = flavors.find((label) => label === flavor);
  const insets = useSafeAreaInsets();
  const width = Math.min(useWindowDimensions().width, 430);
  const scale = width / 370;
  const headerTop = Math.max(48 * scale, insets.top);
  const headerHeight = headerTop + 34 * scale;

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/journal/flavor');
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={[styles.page, { width }]}>
        <LinearGradient colors={['#FFE7C2', PAGE, PAGE]} locations={[0, 0.2443, 1]} style={[StyleSheet.absoluteFill, { height: 822 * scale }]} />
        <View style={{ height: headerHeight }}>
          <Image source={art.paper} style={frame([0, -76, 370, 185], scale)} contentFit="contain" accessible={false} />
          <Pressable accessibilityRole="button" accessibilityLabel="返回手札记录" onPress={goBack}
            style={frame([16, headerTop / scale - 3, 25, 36], scale)} hitSlop={{ left: 10, right: 0, top: 3, bottom: 3 }}>
            <Image source={art.back} style={frame([8.1, 11.2, 9.55, 17.14], scale)} contentFit="contain" accessible={false} />
          </Pressable>
          <Image source={art.headerTitle} accessible accessibilityRole="header" accessibilityLabel="记录口味"
            style={frame([41, headerTop / scale + 9.5, 63, 15], scale)} contentFit="contain" />
          <Pressable accessibilityRole="button" accessibilityLabel="更多" onPress={() => planned('更多')} style={frame([316, headerTop / scale - 2, 44, 36], scale)}>
            <Image source={art.more} style={frame([7, 4, 30, 30], scale)} contentFit="contain" accessible={false} />
          </Pressable>
        </View>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentInsetAdjustmentBehavior="never"
          contentContainerStyle={{ paddingTop: 13 * scale, paddingBottom: 16 * scale }}>
          <RecordForm key={initialFlavor} scale={scale} initialFlavor={initialFlavor}
            onCreate={(params) => router.push({ pathname: '/journal/plan', params })} />
          <DrinkingGuide scale={scale} />
          <Recommendations scale={scale} />
        </ScrollView>
        <View style={{ height: insets.bottom, backgroundColor: '#FFFFFF' }} />
      </View>
    </View>
  );
}

function RecordForm({ scale, initialFlavor, onCreate }: {
  scale: number;
  initialFlavor?: Flavor;
  onCreate: (params: { note?: string; flavor?: Flavor; date?: string }) => void;
}) {
  const [selected, setSelected] = useState(initialFlavor);
  const [note, setNote] = useState(initialFlavor ? notePrefix + initialFlavor : '');
  const [editing, setEditing] = useState(false);
  const [date, setDate] = useState('');
  const input = useRef<TextInput>(null);
  const isPrefilledNote = selected !== undefined && note === notePrefix + selected;

  function selectFlavor(flavor: Flavor) {
    setSelected(flavor);
    setNote(notePrefix + flavor);
    input.current?.blur();
  }

  function chooseDate() {
    input.current?.blur();
    Alert.alert('选择记录日期', undefined, [
      { text: '取消', style: 'cancel' },
      { text: '昨天', onPress: () => setDate('昨天') },
      { text: '今天', onPress: () => setDate('今天') },
    ]);
  }

  function createManualRecord() {
    input.current?.blur();
    onCreate({
      note: isPrefilledNote ? undefined : note.trim() || undefined,
      flavor: selected,
      date: date || undefined,
    });
  }

  return (
    <View style={[styles.panel, styles.formPanel, { width: 350 * scale, borderRadius: 8 * scale, paddingHorizontal: 13 * scale, paddingTop: 14 * scale, paddingBottom: 9 * scale }]}>
      <Image source={art.formTitle} accessible accessibilityRole="header" accessibilityLabel="记录口味表单"
        style={{ width: 86.86 * scale, height: 18 * scale, marginBottom: 13 * scale }} contentFit="contain" />
      <View style={[styles.editor, { width: 325 * scale, height: 184 * scale, borderRadius: 8 * scale, borderWidth: scale }]}>
        <ScrollView horizontal nestedScrollEnabled keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false}
          contentOffset={{ x: initialFlavor === '红糖甜品' ? 67 * scale : 0, y: 0 }}
          style={{ flexGrow: 0, marginTop: 7 * scale }} contentContainerStyle={{ paddingHorizontal: 6 * scale, gap: 12 * scale }}>
          {flavors.map((flavor) => (
            <Pressable key={flavor} accessibilityRole="button" accessibilityLabel={flavor} accessibilityState={{ selected: flavor === selected }}
              onPress={() => selectFlavor(flavor)} style={[styles.tag, { width: 66 * scale, height: 23 * scale, borderRadius: 12 * scale, borderWidth: 0.5 * scale }]}>
              <Text numberOfLines={1} style={[styles.label, { fontSize: 10 * scale }]}>{flavor}</Text>
              <Image source={art.add} style={{ width: 10 * scale, height: 10 * scale }} contentFit="contain" accessible={false} />
            </Pressable>
          ))}
        </ScrollView>
        <View style={{ flex: 1, marginHorizontal: 10 * scale, marginTop: 16 * scale }}>
          <TextInput ref={input} accessibilityLabel="填写手札记录" multiline textAlignVertical="top"
            value={note} onChangeText={setNote} onFocus={() => setEditing(true)} onBlur={() => setEditing(false)}
            placeholder="告诉我一个日期或偏好，我可以为你生成个性化手札记录方案" placeholderTextColor="#A6A6A6"
            style={[styles.input, { fontSize: 10 * scale }]} />
          {!editing && isPrefilledNote && (
            <View pointerEvents="none" importantForAccessibility="no-hide-descendants" style={[StyleSheet.absoluteFill, styles.noteCover]}>
              <Text style={[styles.formattedNote, { fontSize: 10 * scale, letterSpacing: scale }]}>
                {notePrefix}<Text style={{ color: GOLD }}>{selected}</Text>
              </Text>
            </View>
          )}
        </View>
        <View style={[styles.formTools, { height: 23 * scale, gap: 6 * scale, margin: 7 * scale }]}>
          <FormTool source={art.calendar} label={date || '日期'} onPress={chooseDate} scale={scale} />
          <FormTool source={art.heart} label="偏好" onPress={() => input.current?.focus()} scale={scale} />
          <Pressable accessibilityRole="button" accessibilityLabel="语音输入" onPress={() => planned('语音输入')} hitSlop={5} style={styles.microphone}>
            <Image source={art.microphone} style={{ width: 18 * scale, height: 18 * scale }} contentFit="contain" accessible={false} />
          </Pressable>
        </View>
      </View>
      <View style={{ width: 325 * scale, height: 52 * scale, marginTop: 12 * scale }}>
        <Image source={art.actions} style={StyleSheet.absoluteFill} contentFit="contain" accessible={false} />
        <Pressable accessibilityRole="button" accessibilityLabel={aiRecordLabel} onPress={() => planned(aiRecordLabel)}
          style={frame([0, 0, 325, 34], scale)} />
        <Pressable accessibilityRole="button" accessibilityLabel={manualRecordLabel} onPress={createManualRecord}
          style={frame([105, 34, 115, 18], scale)} />
      </View>
    </View>
  );
}

function FormTool({ source, label, onPress, scale }: { source: ImageSource; label: string; onPress: () => void; scale: number }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}
      style={[styles.formTool, { width: 59 * scale, height: 23 * scale, borderRadius: 12 * scale, gap: 4 * scale }]}>
      <Image source={source} style={{ width: 16 * scale, height: 16 * scale }} contentFit="contain" accessible={false} />
      <Text style={[styles.label, { fontSize: 10 * scale }]}>{label}</Text>
    </Pressable>
  );
}

function SectionTitle({ title, subtitle, source, scale }: { title: string; subtitle: string; source: ImageSource; scale: number }) {
  return (
    <View style={[styles.sectionTitle, { gap: 4 * scale, marginLeft: 6 * scale, height: 21 * scale }]}>
      <Image source={source} style={{ width: 17 * scale, height: 18 * scale }} contentFit="contain" accessible={false} />
      <Text accessibilityRole="header" style={{ color: GOLD, fontWeight: '700', fontSize: 14 * scale, includeFontPadding: false }}>{title}</Text>
      <Text style={{ color: '#CE9C4E', fontSize: 10 * scale, includeFontPadding: false }}>· {subtitle}</Text>
    </View>
  );
}

function DrinkingGuide({ scale }: { scale: number }) {
  return (
    <View style={[styles.panel, styles.outline, { width: 350 * scale, height: 157 * scale, borderRadius: 8 * scale, marginTop: 16 * scale, paddingTop: 4 * scale }]}>
      <SectionTitle title="健康饮用指南" subtitle="健康食谱向您推荐" source={art.tea} scale={scale} />
      <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: 5 * scale, marginTop: 8 * scale }} contentContainerStyle={{ gap: 10 * scale }}>
        {guides.map((guide) => (
          <Pressable accessibilityRole="button" accessibilityLabel={guide.title} onPress={() => planned(guide.title)} key={guide.title}>
            <CropImage source={guide.source} crop={guide.crop} width={guide.width} height={85} radius={6} scale={scale} />
            <Text style={[styles.guideCaption, { fontSize: 12 * scale, marginTop: 10 * scale, letterSpacing: 0.6 * scale }]}>{guide.title}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function Recommendations({ scale }: { scale: number }) {
  return (
    <View style={[styles.panel, styles.outline, { width: 350 * scale, minHeight: 403 * scale, borderRadius: 8 * scale, marginTop: 10 * scale, paddingTop: 5 * scale }]}>
      <SectionTitle title="推荐" subtitle="健康食谱原料" source={art.ai} scale={scale} />
      <View style={{ marginTop: 6 * scale, marginHorizontal: 8 * scale }}>
        {journalProducts.map((product, index) => (
          <View key={product.id} style={[styles.product, { height: 68 * scale, gap: 14 * scale }]}>
            {index > 0 && <View style={[styles.divider, { top: -6 * scale }]} />}
            <CropImage source={product.source} crop={product.crop} width={76} height={56} scale={scale} />
            <View style={styles.productDetails}>
              <Text numberOfLines={1} style={{ color: '#464646', fontSize: 12 * scale, includeFontPadding: false }}>{product.title}</Text>
              <View style={[styles.productTags, { gap: 5 * scale, marginTop: 3 * scale }]}>
                {product.tags.map((tag) => <ProductBadge key={tag} tag={tag} scale={scale} />)}
              </View>
              <View style={[styles.price, { marginTop: 8 * scale }]}>
                <Text style={{ color: PRICE, fontSize: 12 * scale, includeFontPadding: false }}>¥</Text>
                <Text style={{ color: PRICE, fontSize: 16 * scale, includeFontPadding: false }}>{product.price}</Text>
                <Text style={{ color: PRICE, fontSize: 10 * scale, includeFontPadding: false }}> 起 | 优惠前 ¥{product.previous}起</Text>
              </View>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel={`点击下单，${product.title}`} onPress={() => planned('点击下单')}
              style={[styles.order, { width: 67 * scale, height: 20 * scale, top: 32 * scale, borderRadius: 10 * scale }]}>
              <Text style={{ color: '#FFFFFF', fontSize: 10 * scale, letterSpacing: scale, fontWeight: '700' }}>点击下单</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}

function ProductBadge({ tag, scale }: { tag: ProductTag; scale: number }) {
  const organic = tag === '纯天然有机';
  const color = organic ? '#ABC63E' : '#DAAB6C';
  const source = organic ? art.leaf : tag === '补血养颜' ? art.nourish : null;
  return (
    <View style={[styles.badge, {
      height: 14 * scale, borderRadius: 1.5 * scale, gap: 3 * scale, paddingHorizontal: 5 * scale,
      borderColor: color, backgroundColor: organic ? '#F6FAE6' : '#FFFAF2',
    }]}>
      {source && <Image source={source} style={{ width: 9 * scale, height: 9 * scale }} contentFit="contain" accessible={false} />}
      <Text style={{ color, fontSize: 7.5 * scale, includeFontPadding: false }}>{tag}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', backgroundColor: PAGE },
  page: { flex: 1, overflow: 'hidden', backgroundColor: PAGE },
  panel: { alignSelf: 'center', backgroundColor: '#FFFFFF' },
  formPanel: { alignItems: 'flex-start', elevation: 1, shadowColor: '#644C1F' },
  outline: { borderWidth: StyleSheet.hairlineWidth, borderColor: '#E3E3E3' },
  editor: { borderColor: '#E1B669', overflow: 'hidden' },
  tag: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', borderColor: '#CFCFCF' },
  label: { color: '#000000', includeFontPadding: false },
  input: { flex: 1, color: '#272727', padding: 0, includeFontPadding: false },
  noteCover: { backgroundColor: '#FFFFFF' },
  formattedNote: { color: '#AEAEAE', includeFontPadding: false },
  formTools: { flexDirection: 'row', alignItems: 'center' },
  formTool: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7F7F7' },
  microphone: { marginLeft: 'auto' },
  sectionTitle: { flexDirection: 'row', alignItems: 'center' },
  guideCaption: { color: '#9D8B82', textAlign: 'center', fontWeight: '500', includeFontPadding: false },
  product: { flexDirection: 'row', alignItems: 'flex-start' },
  divider: { position: 'absolute', left: 0, right: 0, height: StyleSheet.hairlineWidth, backgroundColor: '#E8E8E8' },
  productDetails: { flex: 1 },
  productTags: { flexDirection: 'row' },
  badge: { flexDirection: 'row', alignItems: 'center', borderWidth: StyleSheet.hairlineWidth },
  price: { flexDirection: 'row', alignItems: 'baseline' },
  order: { position: 'absolute', right: 0, backgroundColor: '#D3964B', alignItems: 'center', justifyContent: 'center' },
});
