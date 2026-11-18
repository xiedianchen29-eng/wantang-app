import { Image, type ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import { AccessibilityInfo, Alert, Animated, Easing, Keyboard, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, useAnimatedValue, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TangYunStylePicker, type TangYunStyleOption } from '@/components/TangYunStylePicker';

const art = {
  pack: require('../../assets/figma/gifts/0c53a.png'),
  longan: require('../../assets/figma/home/9f3c5.png'),
  clock: require('../../assets/figma/tang-yun-detail/clock.svg'),
  chevron: require('../../assets/figma/tang-yun-detail/chevron.svg'),
  check: require('../../assets/figma/journal-plan-inspiration/action-check.svg'),
  location: require('../../assets/figma/tang-yun-purchase/location.svg'),
  pencil: require('../../assets/figma/tang-yun-purchase/pencil.svg'),
  note: require('../../assets/figma/tang-yun-purchase/note.svg'),
  divider: require('../../assets/figma/tang-yun-purchase/row-divider.svg'),
  productYuan: require('../../assets/figma/tang-yun-purchase/product-yuan.svg'),
  priceDivider: require('../../assets/figma/tang-yun-purchase/price-divider.svg'),
  leftQuantityDivider: require('../../assets/figma/tang-yun-purchase/quantity-left-divider.svg'),
  rightQuantityDivider: require('../../assets/figma/tang-yun-purchase/quantity-right-divider.svg'),
  quantityPlus: require('../../assets/figma/tang-yun-purchase/quantity-plus.svg'),
  quantityMinus: require('../../assets/figma/tang-yun-purchase/quantity-minus.svg'),
  refresh: require('../../assets/figma/tang-yun-purchase/refresh.svg'),
  addOnPlus: require('../../assets/figma/tang-yun-purchase/add-on-plus.svg'),
  payment: require('../../assets/figma/tang-yun-purchase/payment.svg'),
  wechat: require('../../assets/figma/tang-yun-purchase/wechat.png'),
  alipay: require('../../assets/figma/tang-yun-purchase/alipay.png'),
  alipayCircle: require('../../assets/figma/tang-yun-purchase/alipay-circle.svg'),
  radioSelected: require('../../assets/figma/tang-yun-purchase/radio-selected.svg'),
  radioEmpty: require('../../assets/figma/tang-yun-purchase/radio-empty.svg'),
  totalYuan: require('../../assets/figma/tang-yun-purchase/total-yuan.svg'),
};

const paper = '#FFFEFB';
const gold = '#D3964B';
const priceColor = '#C38B3C';
const purchaseUnitCents = 12642;
const addOnCents = 7900;
const pairDiscountCents = 1000;
const transition = { duration: 300, easing: Easing.bezier(0, 0, 0.58, 1), useNativeDriver: true };
const paymentMethods = ['微信支付', '支付宝'] as const;
type PaymentMethod = (typeof paymentMethods)[number];
type Box = readonly [left: number, top: number, width: number, height: number];

function frame([left, top, width, height]: Box, scale: number) {
  return { position: 'absolute' as const, left: left * scale, top: top * scale, width: width * scale, height: height * scale };
}

function Artwork({ source, box, scale, fill = false }: { source: ImageSource; box: Box; scale: number; fill?: boolean }) {
  return <Image source={source} style={frame(box, scale)} contentFit={fill ? 'fill' : 'contain'} accessible={false} />;
}

export function TangYunPurchaseDrawer({ width, scale, onDismiss }: { width: number; scale: number; onDismiss: () => void }) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const sheetHeight = Math.min(611 * scale + insets.bottom, height - Math.max(insets.top, 44 * scale));
  const progress = useAnimatedValue(0);
  const closing = useRef(false);
  const reduceMotion = useRef(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedStyle, setSelectedStyle] = useState<TangYunStyleOption>();
  const [addOns, setAddOns] = useState<ReadonlySet<number>>(() => new Set());
  const [method, setMethod] = useState<PaymentMethod>('微信支付');
  const [noteText, setNoteText] = useState('');
  const totalCents = quantity * purchaseUnitCents + addOns.size * addOnCents - (quantity >= 2 ? pairDiscountCents : 0);
  const total = (totalCents / 100).toFixed(2);

  function showDrawer() {
    function start(reduced: boolean) {
      if (closing.current) return;
      reduceMotion.current = reduced;
      if (reduced) progress.setValue(1);
      else Animated.timing(progress, { ...transition, toValue: 1 }).start();
    }
    void AccessibilityInfo.isReduceMotionEnabled().then(start, () => start(false));
  }

  function closeDrawer() {
    if (closing.current) return;
    closing.current = true;
    Keyboard.dismiss();
    if (reduceMotion.current) {
      onDismiss();
      return;
    }
    Animated.timing(progress, { ...transition, toValue: 0 }).start(({ finished }) => {
      if (finished) onDismiss();
    });
  }

  function toggleAddOn(index: number) {
    setAddOns((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function previewPurchase() {
    Keyboard.dismiss();
    const lines = [`${method} ¥${total}`, `金沙唐韵礼盒 ${quantity} 份`];
    if (selectedStyle) lines.push(`款式：${selectedStyle.name}`);
    if (addOns.size) lines.push(`加购桂圆红枣 ${addOns.size} 份`);
    if (noteText.trim()) lines.push(`订单备注：${noteText.trim()}`);
    Alert.alert('模拟订单', lines.join('\n'));
  }

  return (
    <Modal transparent animationType="none" statusBarTranslucent navigationBarTranslucent hardwareAccelerated
      onShow={showDrawer} onRequestClose={closeDrawer}>
      <View style={styles.modal}>
        <Pressable accessibilityRole="button" accessibilityLabel="关闭支付抽屉" onPress={closeDrawer} style={StyleSheet.absoluteFill}>
          <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.scrim, {
            opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [0, 0.6] }),
          }]} />
        </Pressable>
        <Animated.View accessibilityViewIsModal style={[styles.sheet, {
          width, height: sheetHeight, borderTopLeftRadius: 12 * scale, borderTopRightRadius: 12 * scale,
          transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [sheetHeight, 0] }) }],
        }]}>
          <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior="never">
            <OrderSummary scale={scale} quantity={quantity} onIncrease={() => setQuantity((current) => current + 1)}
              onDecrease={() => setQuantity((current) => Math.max(1, current - 1))}
              selectedStyle={selectedStyle} onSelectStyle={setSelectedStyle} noteText={noteText} onChangeNote={setNoteText} />
            <AddOnList scale={scale} selected={addOns} onToggle={toggleAddOn} />
            <PaymentChooser scale={scale} value={method} onSelect={setMethod} />
          </ScrollView>
          <View style={[styles.checkout, { height: 55 * scale + insets.bottom, paddingHorizontal: 16 * scale }]}>
            <Pressable accessibilityRole="button" accessibilityLabel={`领券并购买，¥${total}`} onPress={previewPurchase}
              style={[styles.checkoutButton, { height: 39 * scale, borderRadius: 4 * scale }]}>
              <View style={[styles.currencyRow, { gap: scale, height: 24 * scale }]}>
                <Image source={art.totalYuan} style={{ width: 10.12 * scale, height: 13.2 * scale }} contentFit="contain" accessible={false} />
                <Text style={[styles.total, { fontSize: 23.14 * scale, letterSpacing: -0.8 * scale }]}>{total}</Text>
              </View>
              <Text style={[styles.checkoutLabel, { fontSize: 10 * scale, letterSpacing: scale }]}>领券并购买</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

function OrderSummary({ scale, quantity, onIncrease, onDecrease, selectedStyle, onSelectStyle, noteText, onChangeNote }: {
  scale: number;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  selectedStyle?: TangYunStyleOption;
  onSelectStyle: (option: TangYunStyleOption) => void;
  noteText: string;
  onChangeNote: (value: string) => void;
}) {
  const note = useRef<TextInput>(null);

  return (
    <View style={styles.panel}>
      <View style={{ height: 41 * scale }}>
        <Artwork source={art.location} box={[17, 15, 18, 18]} scale={scale} />
        <Text style={[styles.bodyText, frame([45, 17, 46, 17], scale), { fontSize: 12 * scale, letterSpacing: 0.48 * scale }]}>杨小巧</Text>
        <Text numberOfLines={1} style={[styles.bodyText, frame([93, 17, 209, 17], scale), { fontSize: 12 * scale, letterSpacing: 0.48 * scale }]}>云南省昭通市巧家县白鹤滩镇</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="改写地址" onPress={() => Alert.alert('改写地址', '功能规划中')}
          style={frame([307, 8, 57, 30], scale)}>
          <Artwork source={art.pencil} box={[2, 7, 18, 18]} scale={scale} />
          <Text style={[styles.muted, frame([23, 9, 27, 17], scale), { fontSize: 12 * scale }]}>改写</Text>
        </Pressable>
        <Artwork source={art.divider} box={[16, 40.75, 338, 0.5]} scale={scale} fill />
      </View>

      <View style={{ height: 120 * scale }}>
        <View style={[styles.productImage, frame([16, 12, 96, 96], scale)]}>
          {selectedStyle ? (
            <Image source={selectedStyle.source} style={StyleSheet.absoluteFill} contentFit="cover" accessible={false} />
          ) : (
            <View style={[styles.clip, frame([0, 9, 96, 80], scale)]}>
              <Artwork source={art.pack} box={[-3.12, -34.59, 99.12, 149.72]} scale={scale} fill />
            </View>
          )}
        </View>
        <Artwork source={art.productYuan} box={[127, 28.25, 14, 17.85]} scale={scale} />
        <Text style={[styles.productPrice, frame([141, 17, 57, 38], scale), { fontSize: 32 * scale, letterSpacing: -2.3 * scale }]}>126</Text>
        <Text style={[styles.priceText, frame([194, 29, 18, 18], scale), { fontSize: 14 * scale }]}>起</Text>
        <Artwork source={art.priceDivider} box={[212.5, 32, 1, 14]} scale={scale} />
        <Text style={[styles.priceText, frame([218, 29, 112, 18], scale), { fontSize: 14 * scale }]}>优惠前¥136起</Text>
        <View style={[styles.discount, frame([127, 60, 101, 18], scale), { borderWidth: 0.5 * scale, borderRadius: 4 * scale, gap: 4 * scale }]}>
          <Image source={art.clock} style={{ width: 14 * scale, height: 14 * scale }} contentFit="contain" accessible={false} />
          <Text style={[styles.priceText, { fontSize: 12 * scale }]}>两份立减10元</Text>
        </View>
        <QuantityControl scale={scale} quantity={quantity} onIncrease={onIncrease} onDecrease={onDecrease} />
        <Artwork source={art.divider} box={[16, 119.75, 338, 0.5]} scale={scale} fill />
      </View>

      <TangYunStylePicker scale={scale} selectedIndex={selectedStyle?.index} onSelect={onSelectStyle} />
      <View style={{ height: 41 * scale }}>
        <Artwork source={art.divider} box={[16, -0.25, 338, 0.5]} scale={scale} fill />
        <Artwork source={art.note} box={[14, 11, 18, 18]} scale={scale} />
        <TextInput ref={note} accessibilityLabel="订单备注" placeholder="订单备注" placeholderTextColor="#5E5E5E"
          value={noteText} onChangeText={onChangeNote}
          returnKeyType="done" maxLength={100} style={[styles.bodyText, styles.noteInput, frame([41, 0, 296, 41], scale), { fontSize: 12 * scale, letterSpacing: 0.48 * scale }]} />
        <Pressable accessibilityRole="button" accessibilityLabel="编辑订单备注" onPress={() => note.current?.focus()} style={frame([337, 0, 30, 41], scale)}>
          <Image source={art.chevron} style={[frame([10, 15, 6.85, 11.96], scale), styles.flip]} contentFit="contain" accessible={false} />
        </Pressable>
      </View>
    </View>
  );
}

function QuantityControl({ scale, quantity, onIncrease, onDecrease }: {
  scale: number; quantity: number; onIncrease: () => void; onDecrease: () => void;
}) {
  return (
    <View style={[styles.quantity, frame([127, 90, 101, 18], scale), { borderWidth: 0.5 * scale, borderRadius: 4 * scale }]}>
      <Pressable accessibilityRole="button" accessibilityLabel="增加商品数量" onPress={onIncrease} hitSlop={4}
        style={[styles.center, { width: 21.5 * scale }]}>
        <Image source={art.quantityPlus} style={{ width: 12 * scale, height: 12 * scale }} contentFit="contain" accessible={false} />
      </Pressable>
      <Image source={art.leftQuantityDivider} style={{ width: 0.5 * scale, height: 14 * scale }} contentFit="contain" accessible={false} />
      <View style={[styles.quantityValue, { height: 14 * scale }]}>
        <Text accessibilityLabel={`数量 ${quantity} 份`} style={[styles.quantityText, { fontSize: 9.8 * scale }]}>
          {quantity}<Text style={{ fontSize: 8 * scale }}> 份</Text>
        </Text>
      </View>
      <Image source={art.rightQuantityDivider} style={{ width: 0.5 * scale, height: 14 * scale }} contentFit="contain" accessible={false} />
      <Pressable accessibilityRole="button" accessibilityLabel="减少商品数量" disabled={quantity <= 1} onPress={onDecrease} hitSlop={4}
        style={[styles.center, { width: 21 * scale }]}>
        <Image source={art.quantityMinus} style={{ width: 10 * scale, height: 2 * scale }} contentFit="contain" accessible={false} />
      </Pressable>
    </View>
  );
}

function AddOnList({ scale, selected, onToggle }: { scale: number; selected: ReadonlySet<number>; onToggle: (index: number) => void }) {
  return (
    <View style={[styles.panel, { marginTop: 6 * scale, height: 168 * scale, paddingHorizontal: 16 * scale }]}>
      <View style={[styles.addOnHeader, { height: 38 * scale, gap: 9 * scale }]}>
        <View style={[styles.addOnBadge, { width: 34 * scale, height: 16 * scale, borderRadius: 2 * scale }]}>
          <Text style={[styles.addOnBadgeText, { fontSize: 8 * scale, letterSpacing: 0.4 * scale }]}>随心带</Text>
        </View>
        <Text style={[styles.addOnTitle, { fontSize: 12 * scale, letterSpacing: 0.6 * scale }]}>佳节将至 随心礼物带来温暖</Text>
        <View style={[styles.refresh, { gap: 3 * scale }]}>
          <Text style={[styles.refreshLabel, { fontSize: 12 * scale }]}>换一批</Text>
          <Image source={art.refresh} style={{ width: 16 * scale, height: 16 * scale }} contentFit="contain" accessible={false} />
        </View>
      </View>
      <View style={styles.addOnCards}>
        {[0, 1, 2].map((index) => (
          <AddOnCard key={index} scale={scale} index={index} selected={selected.has(index)} onToggle={() => onToggle(index)} />
        ))}
      </View>
    </View>
  );
}

function AddOnCard({ scale, index, selected, onToggle }: { scale: number; index: number; selected: boolean; onToggle: () => void }) {
  return (
    <View style={[styles.clip, { width: 109 * scale, height: 113 * scale, borderRadius: 5.5 * scale }]}>
      <LinearGradient pointerEvents="none" colors={['#D2AC74', '#EFE2CB']} style={StyleSheet.absoluteFill} />
      <View style={[styles.clip, frame([6.94, 7.68, 95.12, 50.92], scale), { borderRadius: 5 * scale }]}>
        <Artwork source={art.longan} box={[-3.68, -75.15, 98.97, 148.46]} scale={scale} fill />
      </View>
      <Text style={[styles.addOnName, frame([6.94, 64, 57, 14], scale), { fontSize: 9.63 * scale }]}>桂圆红枣</Text>
      <View style={[styles.addOnPack, frame([69.43, 65.57, 32.63, 10.46], scale), { borderRadius: 5.23 * scale }]}>
        <Text style={[styles.addOnPackLabel, { fontSize: 6.97 * scale, letterSpacing: 0.69 * scale }]}>7天装</Text>
      </View>
      <Text style={[styles.addOnDescription, frame([7.4, 78, 91, 11], scale), { fontSize: 6.88 * scale }]}>暖饮包 · 轻甜回甘</Text>
      <Text style={[styles.addOnPrice, frame([8, 91, 67, 16], scale), { fontSize: 12.56 * scale }]}>¥ 79</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={`${selected ? '取消加购' : '加购'}桂圆红枣 ${index + 1}`}
        accessibilityState={{ selected }} onPress={onToggle} hitSlop={6} style={[styles.center, frame([84.71, 90.7, 17.58, 17.14], scale)]}>
        <Image source={art.addOnPlus} pointerEvents="none" style={StyleSheet.absoluteFill} contentFit="contain" accessible={false} />
        {selected && <View pointerEvents="none" style={[styles.selectedAddOn, { width: 11 * scale, height: 11 * scale, borderRadius: 5.5 * scale }]}>
          <Image source={art.check} style={{ width: 10 * scale, height: 10 * scale }} contentFit="contain" accessible={false} />
        </View>}
      </Pressable>
    </View>
  );
}

function PaymentChooser({ scale, value, onSelect }: { scale: number; value: PaymentMethod; onSelect: (method: PaymentMethod) => void }) {
  return (
    <View style={[styles.panel, { marginTop: 6 * scale, height: 123 * scale }]}>
      <View style={[styles.paymentHeader, { height: 33 * scale, paddingHorizontal: 16 * scale, gap: 7 * scale }]}>
        <Image source={art.payment} style={{ width: 18 * scale, height: 18 * scale }} contentFit="contain" accessible={false} />
        <Text accessibilityRole="header" style={[styles.bodyText, { fontSize: 12 * scale, letterSpacing: 0.48 * scale }]}>付款方式</Text>
      </View>
      {paymentMethods.map((method) => (
        <Pressable key={method} accessibilityRole="radio" accessibilityLabel={method}
          accessibilityState={{ checked: method === value }} onPress={() => onSelect(method)} style={{ height: 40 * scale }}>
          {method === '微信支付' ? (
            <View style={[styles.clip, frame([16, 6, 28, 28], scale)]}>
              <Artwork source={art.wechat} box={[-16.09, -43.91, 58.36, 77.82]} scale={scale} fill />
            </View>
          ) : (
            <View style={[styles.clip, frame([16, 7.5, 25, 25], scale), { borderRadius: 12.5 * scale }]}>
              <Artwork source={art.alipayCircle} box={[0, 0, 25, 25]} scale={scale} />
              <Artwork source={art.alipay} box={[-17.01, -53.02, 59.53, 130.24]} scale={scale} fill />
            </View>
          )}
          <Text style={[styles.bodyText, frame([61, 11, 81, 17], scale), { fontSize: 12 * scale, letterSpacing: 0.48 * scale }]}>{method}</Text>
          <Artwork source={method === value ? art.radioSelected : art.radioEmpty} box={[334, 10, 20, 20]} scale={scale} />
          {method === value && <Artwork source={art.check} box={[337, 13, 14, 14]} scale={scale} />}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  modal: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  scrim: { backgroundColor: '#000000' },
  sheet: { overflow: 'hidden', backgroundColor: '#FAF4E9' },
  panel: { backgroundColor: paper },
  clip: { overflow: 'hidden' },
  bodyText: { color: '#5E5E5E', includeFontPadding: false },
  muted: { color: '#9E9E9E', includeFontPadding: false },
  productImage: { backgroundColor: '#F8F1E8', overflow: 'hidden' },
  priceText: { color: priceColor, includeFontPadding: false },
  productPrice: { color: priceColor, fontWeight: '500', includeFontPadding: false },
  discount: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderColor: priceColor },
  quantity: { flexDirection: 'row', alignItems: 'center', borderColor: '#DADADA', backgroundColor: '#E8E8E8' },
  quantityValue: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  quantityText: { color: '#767676', includeFontPadding: false },
  center: { alignItems: 'center', justifyContent: 'center', height: '100%' },
  noteInput: { padding: 0 },
  flip: { transform: [{ scaleX: -1 }] },
  addOnHeader: { flexDirection: 'row', alignItems: 'center' },
  addOnBadge: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#9E3927' },
  addOnBadgeText: { color: '#FDF6F0', fontWeight: '700', includeFontPadding: false },
  addOnTitle: { color: '#3A1915', includeFontPadding: false },
  refresh: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center' },
  refreshLabel: { color: '#CCCCCC', includeFontPadding: false },
  addOnCards: { flexDirection: 'row', justifyContent: 'space-between' },
  addOnName: { color: '#78201A', fontWeight: '700', includeFontPadding: false },
  addOnPack: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#FDEDDB' },
  addOnPackLabel: { color: '#731813', fontWeight: '700', includeFontPadding: false },
  addOnDescription: { color: '#FFFFFF', includeFontPadding: false },
  addOnPrice: { color: '#B16A39', fontWeight: '700', includeFontPadding: false },
  selectedAddOn: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#731813' },
  paymentHeader: { flexDirection: 'row', alignItems: 'center' },
  checkout: { backgroundColor: paper },
  checkoutButton: { alignItems: 'center', justifyContent: 'center', backgroundColor: gold },
  currencyRow: { flexDirection: 'row', alignItems: 'center' },
  total: { color: '#FFFFFF', fontWeight: '500', includeFontPadding: false },
  checkoutLabel: { color: '#FFFFFF', fontWeight: '700', includeFontPadding: false },
});
