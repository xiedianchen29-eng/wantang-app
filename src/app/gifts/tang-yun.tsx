import { Image, type ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { type ReactNode, useRef, useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView, Share, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TangYunPurchaseDrawer } from '@/components/TangYunPurchaseDrawer';
import { TangYunStylePicker } from '@/components/TangYunStylePicker';

const art = {
  pack: require('../../../assets/figma/gifts/0c53a.png'),
  logo: require('../../../assets/figma/home/64b17.png'),
  sugarBowl: require('../../../assets/figma/home/b4262.png'),
  longan: require('../../../assets/figma/home/9f3c5.png'),
  ginger: require('../../../assets/figma/home/ee677.png'),
  sugarBlocks: require('../../../assets/figma/home/64a20.png'),
  activeTab: require('../../../assets/figma/profile/d81c3.svg'),
  toolbarCircle: require('../../../assets/figma/journal-plan/toolbar-circle.svg'),
  toolbarShare: require('../../../assets/figma/journal-plan/share.svg'),
  openPack: require('../../../assets/figma/tang-yun-detail/previous.png'),
  mascot: require('../../../assets/figma/tang-yun-detail/mascot.png'),
  brandCopy: require('../../../assets/figma/tang-yun-detail/brand-copy.png'),
  darkPack: require('../../../assets/figma/tang-yun-detail/dark-photo.png'),
  brandCopyLight: require('../../../assets/figma/tang-yun-detail/brand-copy-light.png'),
  service: require('../../../assets/figma/tang-yun-detail/service.svg'),
  footerShare: require('../../../assets/figma/tang-yun-detail/footer-share.svg'),
  favorite: require('../../../assets/figma/tang-yun-detail/favorite.svg'),
  truck: require('../../../assets/figma/tang-yun-detail/truck.svg'),
  gift: require('../../../assets/figma/tang-yun-detail/gift.svg'),
  coupon: require('../../../assets/figma/tang-yun-detail/coupon.svg'),
  clock: require('../../../assets/figma/tang-yun-detail/clock.svg'),
  yuan: require('../../../assets/figma/tang-yun-detail/yuan.svg'),
  priceDivider: require('../../../assets/figma/tang-yun-detail/price-divider.svg'),
  popular: require('../../../assets/figma/tang-yun-detail/popular.svg'),
  tagsChevron: require('../../../assets/figma/tang-yun-detail/tags-chevron.svg'),
  organic: require('../../../assets/figma/tang-yun-detail/organic.svg'),
  nourish: require('../../../assets/figma/tang-yun-detail/nourish.svg'),
  shippingDivider: require('../../../assets/figma/tang-yun-detail/shipping-divider.svg'),
  chevron: require('../../../assets/figma/tang-yun-detail/chevron.svg'),
  sectionDivider: require('../../../assets/figma/tang-yun-detail/section-divider.svg'),
  back: require('../../../assets/figma/tang-yun-detail/back.svg'),
  cart: require('../../../assets/figma/tang-yun-detail/cart.svg'),
  search: require('../../../assets/figma/tang-yun-detail/search.svg'),
};

const designWidth = 370;
const heroHeight = 466;
const productName = '金沙唐韵礼盒';
const title = '巧家万华  金沙唐韵 红糖礼盒';
const gold = '#D3964B';
const paper = '#FFFEFB';
const canvas = '#FAF4E9';
const defaultPhotoIndex = 1;

type Box = readonly [left: number, top: number, width: number, height: number];
type Photo = { key: string; source?: ImageSource; crop?: Box };

const gallery: Photo[] = [
  { key: '开盒展示', source: art.openPack, crop: [-5.11, -26.98, 415.18, 554] },
  { key: '金沙唐韵礼盒封面' },
  { key: '礼盒包装', source: art.darkPack, crop: [-107.34, 2.91, 559.44, 466.28] },
  { key: '红糖块', source: art.sugarBowl, crop: [0, -171.39, 370, 658.5] },
  { key: '桂圆红枣', source: art.longan, crop: [-0.04, -42.49, 370.7, 556.05] },
  { key: '姜枣红糖', source: art.ginger, crop: [0.33, -49.67, 370, 542.3] },
  { key: '小碗红糖', source: art.sugarBlocks, crop: [-370, -23, 740, 986.67] },
];

const tags = [
  { title: '纯天然有机', width: 95, icon: art.organic, iconWidth: 11.51, iconHeight: 12.42, color: '#ABC63E', background: '#F6FAE6' },
  { title: '补血养颜', width: 74, icon: art.nourish, iconWidth: 5.54, iconHeight: 11.83, color: '#DAAB6C', background: '#FFFAF2' },
  { title: '暖胃散寒', width: 64, color: '#DAAB6C', background: '#FFFAF2' },
  { title: '活血化瘀', width: 64, color: '#DAAB6C', background: '#FFFAF2' },
] as const;

function frame([left, top, width, height]: Box, scale: number) {
  return { position: 'absolute' as const, left: left * scale, top: top * scale, width: width * scale, height: height * scale };
}

function planned(label: string) {
  Alert.alert(label, '功能规划中');
}

function Artwork({ source, box, scale, fill = false }: { source: ImageSource; box: Box; scale: number; fill?: boolean }) {
  return <Image source={source} style={frame(box, scale)} contentFit={fill ? 'fill' : 'contain'} accessible={false} />;
}

export default function TangYunDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const width = Math.min(useWindowDimensions().width, 430);
  const scale = width / designWidth;
  const body = useRef<ScrollView>(null);
  const galleryList = useRef<FlatList<Photo>>(null);
  const [favorite, setFavorite] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [purchaseOpen, setPurchaseOpen] = useState(false);

  function shareProduct() {
    void Share.share({ message: `${title} · 活动优惠后 ¥126 起` }).catch(() => Alert.alert('分享', '暂时无法打开分享。'));
  }

  function showPhoto(index: number) {
    galleryList.current?.scrollToIndex({ index, animated: true });
    body.current?.scrollTo({ y: 0, animated: true });
  }

  function addToCart() {
    setCartCount((count) => count + 1);
    Alert.alert('已加入购物车', `${productName}已加入模拟购物车`);
  }

  return (
    <View style={styles.screen}>
      <StatusBar style={purchaseOpen ? 'light' : 'dark'} />
      <View style={[styles.page, { width }]}>
        <ScrollView ref={body} showsVerticalScrollIndicator={false} contentInsetAdjustmentBehavior="never">
          <View style={{ height: heroHeight * scale }}>
            <FlatList ref={galleryList} data={gallery} keyExtractor={(photo) => photo.key} horizontal pagingEnabled nestedScrollEnabled
              showsHorizontalScrollIndicator={false} initialScrollIndex={defaultPhotoIndex}
              getItemLayout={(_, index) => ({ length: width, offset: index * width, index })}
              renderItem={({ item }) => <GalleryPage photo={item} scale={scale} />} />
          </View>
          <PriceBand scale={scale} />
          <ProductInformation scale={scale} />
          <ShippingAndStyles scale={scale} onSelectPhoto={showPhoto} />
          <ProductDescription scale={scale} />
        </ScrollView>

        <View pointerEvents="box-none" style={[styles.toolbar, {
          top: Math.max(51 * scale, insets.top + 6 * scale),
          paddingHorizontal: 16 * scale,
        }]}>
          <TopButton label="返回礼事" source={art.back} scale={scale}
            onPress={() => router.canGoBack() ? router.back() : router.replace('/gifts')} />
          <View style={styles.spacer} />
          <TopButton label="购物车" source={art.cart} scale={scale} marginRight={14}
            onPress={() => Alert.alert('模拟购物车', cartCount ? `${productName} × ${cartCount}` : '购物车为空')} />
          <TopButton label="搜索商品" source={art.search} scale={scale} marginRight={9} onPress={() => planned('搜索商品')} />
          <TopButton label="分享礼盒" source={art.toolbarCircle} scale={scale} onPress={shareProduct}>
            <Artwork source={art.toolbarShare} box={[5, 3.75, 20, 20]} scale={scale} />
          </TopButton>
        </View>

        <View style={styles.footer}>
          <View style={[styles.footerRow, { height: 49 * scale, paddingLeft: 12 * scale, paddingRight: 18 * scale }]}>
            <FooterIcon label={favorite ? '已收藏' : '收藏'} icon={art.favorite} scale={scale} selected={favorite} onPress={() => setFavorite((value) => !value)} />
            <FooterIcon label="客服" icon={art.service} scale={scale} onPress={() => planned('客服')} />
            <FooterIcon label="分享" icon={art.footerShare} scale={scale} onPress={shareProduct} />
            <View style={styles.spacer} />
            <Pressable accessibilityRole="button" onPress={addToCart} style={[styles.purchase, styles.cartAction, {
              width: 89 * scale, height: 30 * scale, borderRadius: 15 * scale, borderWidth: 0.5 * scale, marginRight: 7 * scale,
            }]}>
              <Text style={[styles.actionText, { color: gold, fontSize: 10 * scale, letterSpacing: scale }]}>加入购物车</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => setPurchaseOpen(true)} style={[styles.purchase, styles.buyAction, {
              width: 87 * scale, height: 30 * scale, borderRadius: 15 * scale,
            }]}>
              <Text style={[styles.actionText, { color: '#FFFFFF', fontSize: 10 * scale, letterSpacing: scale }]}>领券购买</Text>
            </Pressable>
          </View>
          <View style={{ height: insets.bottom }} />
        </View>
      </View>
      {purchaseOpen && <TangYunPurchaseDrawer width={width} scale={scale} onDismiss={() => setPurchaseOpen(false)} />}
    </View>
  );
}

function GalleryPage({ photo, scale }: { photo: Photo; scale: number }) {
  const isDarkPack = photo.source === art.darkPack;

  return (
    <View style={[styles.galleryPage, { width: designWidth * scale, height: heroHeight * scale }]}>
      {isDarkPack && <LinearGradient colors={['#4E2D17', '#664027', '#664027']} locations={[0, 0.03366, 1]} style={StyleSheet.absoluteFill} />}
      {photo.source && photo.crop ? (
        <>
          <Artwork source={photo.source} box={photo.crop} scale={scale} fill />
          {isDarkPack && (
            <>
              <View style={[styles.clip, frame([5, 389, 95, 40.16], scale)]}>
                <Artwork source={art.logo} box={[-12.73, 0, 107.43, 71.62]} scale={scale} fill />
              </View>
              <Artwork source={art.brandCopyLight} box={[5, 433.06, 87.14, 25.47]} scale={scale} />
              <Text style={[styles.brand, frame([269, 414, 101, 16], scale), { color: '#FFFFFF', fontSize: 10.45 * scale, letterSpacing: 1.05 * scale }]}>万华食品</Text>
              <Text style={[styles.brand, frame([255, 430, 101, 31], scale), { color: '#FFFFFF', fontSize: 17.42 * scale, letterSpacing: 1.74 * scale }]}>巧家红糖</Text>
            </>
          )}
        </>
      ) : (
        <>
          <View style={[styles.clip, frame([37, 147, 308, 255], scale)]}>
            <Artwork source={art.pack} box={[-10.01, -110.26, 318.01, 477.23]} scale={scale} fill />
          </View>
          <Artwork source={art.mascot} box={[233, 309, 122, 136]} scale={scale} />
          <Text style={[styles.brand, styles.brandRight, frame([242, 94, 87, 18], scale), { fontSize: 12.19 * scale, letterSpacing: 1.22 * scale }]}>万华食品</Text>
          <Text style={[styles.brand, styles.brandRight, frame([226, 112, 103, 29], scale), { fontSize: 20.31 * scale, letterSpacing: 2.03 * scale }]}>巧家红糖</Text>
          <View style={[styles.clip, frame([7.29, 74, 109.69, 40.63], scale)]}>
            <Artwork source={art.logo} box={[0, 0, 109.69, 73.13]} scale={scale} fill />
          </View>
          <Artwork source={art.brandCopy} box={[19.47, 118.69, 89.37, 26.48]} scale={scale} />
        </>
      )}
    </View>
  );
}

function PriceBand({ scale }: { scale: number }) {
  return (
    <View style={[styles.priceBand, { height: 75 * scale, marginTop: -14 * scale, borderTopLeftRadius: 12 * scale, borderTopRightRadius: 12 * scale }]}>
      <Text style={[styles.priceText, frame([16, 19, 76, 19], scale), { fontSize: 14 * scale, letterSpacing: 0.56 * scale }]}>活动优惠后</Text>
      <Artwork source={art.yuan} box={[91, 16, 14, 17.85]} scale={scale} />
      <Text style={[styles.priceText, styles.amount, frame([103, 4, 57, 36], scale), { fontSize: 32 * scale, letterSpacing: -2.3 * scale }]}>126</Text>
      <Text style={[styles.priceText, frame([159, 19, 18, 19], scale), { fontSize: 14 * scale }]}>起</Text>
      <Artwork source={art.priceDivider} box={[177.5, 20, 1, 14]} scale={scale} />
      <Text style={[styles.priceText, frame([183, 19, 111, 19], scale), { fontSize: 14 * scale }]}>优惠前¥136起</Text>
      <View style={[styles.coupon, frame([16, 44, 101, 18], scale), { borderRadius: 4 * scale, gap: 4 * scale }]}>
        <Image source={art.clock} style={{ width: 14 * scale, height: 14 * scale }} contentFit="contain" accessible={false} />
        <Text style={[styles.goldText, { fontSize: 12 * scale }]}>两份立减10元</Text>
      </View>
      <View style={[styles.coupon, frame([123, 44, 100, 18], scale), { borderRadius: 4 * scale, gap: 4 * scale }]}>
        <Image source={art.coupon} style={{ width: 15 * scale, height: 15 * scale }} contentFit="contain" accessible={false} />
        <Text style={[styles.goldText, { fontSize: 12 * scale }]}>满200减20元</Text>
      </View>
      <View style={frame([288, 45, 10, 14], scale)}>
        <Image source={art.popular} style={{ width: 9.68 * scale, height: 13.82 * scale, transform: [{ rotate: '9.6deg' }] }} contentFit="contain" accessible={false} />
      </View>
      <Text style={[styles.priceText, frame([302, 45, 56, 16], scale), { fontSize: 12 * scale }]}>热销200+</Text>
    </View>
  );
}

function ProductInformation({ scale }: { scale: number }) {
  return (
    <View style={[styles.section, { height: 70 * scale }]}>
      <View style={[styles.season, frame([16, 11, 43, 16], scale), { borderRadius: 2 * scale }]}>
        <Text style={[styles.seasonLabel, { fontSize: 8 * scale, letterSpacing: 0.4 * scale }]}>岁时送礼</Text>
      </View>
      <Text accessibilityRole="header" accessibilityLabel="金沙唐韵礼盒详情" numberOfLines={1}
        style={[styles.productTitle, frame([71, 9, 237, 22], scale), { fontSize: 17 * scale }]}>{title}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="送礼" onPress={() => planned('送礼')}
        style={[styles.giftAction, frame([309, 7, 45, 24], scale), { gap: 4 * scale }]}>
        <Image source={art.gift} style={{ width: 16 * scale, height: 16 * scale }} contentFit="contain" accessible={false} />
        <Text style={[styles.muted, { fontSize: 12 * scale }]}>送礼</Text>
      </Pressable>
      <View style={[styles.tagRow, frame([16, 37, 321, 20], scale), { gap: 8 * scale }]}>
        {tags.map((tag) => (
          <View key={tag.title} style={[styles.tag, {
            width: tag.width * scale, height: 20 * scale, borderRadius: 2 * scale, borderWidth: 0.5 * scale,
            borderColor: tag.color, backgroundColor: tag.background, gap: 4 * scale,
          }]}>
            {'icon' in tag && <Image source={tag.icon} style={{
              width: tag.iconWidth * scale, height: tag.iconHeight * scale,
            }} contentFit="contain" accessible={false} />}
            <Text style={[styles.text, { color: tag.color, fontSize: 12 * scale }]}>{tag.title}</Text>
          </View>
        ))}
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="商品标签详情" onPress={() => planned('商品标签详情')}
        style={frame([337, 32, 30, 30], scale)}>
        <Chevron source={art.tagsChevron} box={[10, 9, 6.85, 11.96]} scale={scale} />
      </Pressable>
    </View>
  );
}

function Chevron({ source = art.chevron, box, scale }: { source?: ImageSource; box: Box; scale: number }) {
  return <Image source={source} style={[frame(box, scale), styles.flipHorizontally]} contentFit="contain" accessible={false} />;
}

function ShippingAndStyles({ scale, onSelectPhoto }: { scale: number; onSelectPhoto: (index: number) => void }) {
  return (
    <View style={[styles.section, { marginTop: 5 * scale, height: 85 * scale }]}>
      <Pressable accessibilityRole="button" accessibilityLabel="配送信息，48小时内发货，云南昭通，快递免运费"
        onPress={() => Alert.alert('配送信息', '48小时内发货\n云南昭通\n快递：免运费')} style={frame([0, 0, 370, 31], scale)}>
        <Artwork source={art.truck} box={[16, 7, 18, 18]} scale={scale} />
        <Text style={[styles.goldText, frame([40, 9, 84, 17], scale), { fontSize: 12 * scale, letterSpacing: 0.48 * scale }]}>48小时内发货</Text>
        <Text style={[styles.shippingText, frame([129, 9, 54, 17], scale), { fontSize: 12 * scale, letterSpacing: 0.48 * scale }]}>云南昭通</Text>
        <Artwork source={art.shippingDivider} box={[182.5, 10, 1, 14]} scale={scale} />
        <Text style={[styles.shippingText, frame([187, 9, 115, 17], scale), { fontSize: 12 * scale, letterSpacing: 0.48 * scale }]}>快递：免运费</Text>
        <Chevron box={[347, 11, 6.85, 11.96]} scale={scale} />
      </Pressable>
      <Artwork source={art.sectionDivider} box={[16, 30.75, 338, 0.5]} scale={scale} />
      <View style={{ top: 31 * scale }}>
        <TangYunStylePicker scale={scale} onSelect={(item) => onSelectPhoto(item.index)} onMore={() => planned('款式选择')} />
      </View>
    </View>
  );
}

function ProductDescription({ scale }: { scale: number }) {
  const tabs = ['商品详情', '商品评价', '好物推荐', '好物推荐'];
  return (
    <View style={[styles.section, { marginTop: 5 * scale }]}>
      <View style={[styles.detailTabs, { height: 34 * scale, paddingHorizontal: 16 * scale }]}>
        {tabs.map((label, index) => (
          <Pressable key={index} accessibilityRole="tab" accessibilityState={{ selected: index === 0 }}
            onPress={index === 0 ? undefined : () => planned(label)} style={styles.detailTab}>
            <Text style={[styles.detailTabText, { fontSize: 12 * scale, letterSpacing: 0.6 * scale }]}>{label}</Text>
            {index === 0 && <Image source={art.activeTab} style={[styles.detailUnderline, { width: 14 * scale, height: 4 * scale, top: 23 * scale }]} contentFit="contain" accessible={false} />}
          </Pressable>
        ))}
      </View>
      <View style={[styles.clip, { height: 508 * scale }]}>
        <Artwork source={art.longan} box={[-0.37, -37.49, 370.7, 564.13]} scale={scale} fill />
      </View>
      <Artwork source={art.sectionDivider} box={[16, 33.75, 338, 0.5]} scale={scale} />
    </View>
  );
}

function TopButton({ label, source, scale, onPress, marginRight = 0, children }: {
  label: string; source: ImageSource; scale: number; onPress: () => void; marginRight?: number; children?: ReactNode;
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} hitSlop={5} onPress={onPress}
      style={{ width: 30 * scale, height: 30 * scale, marginRight: marginRight * scale }}>
      <Artwork source={source} box={[0, 0, 30, 30]} scale={scale} />
      {children}
    </Pressable>
  );
}

function FooterIcon({ label, icon, scale, selected = false, onPress }: {
  label: string; icon: ImageSource; scale: number; selected?: boolean; onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected }} onPress={onPress}
      style={[styles.footerIcon, { width: 29 * scale, marginRight: 19 * scale, gap: 3 * scale }]}>
      <Image source={icon} style={{ width: 18 * scale, height: 18 * scale }} contentFit="contain" tintColor={selected ? '#A12B22' : undefined} accessible={false} />
      <Text style={[styles.footerLabel, { color: selected ? '#A12B22' : '#333333', fontSize: 10 * scale, letterSpacing: 0.5 * scale }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', backgroundColor: canvas },
  page: { flex: 1, backgroundColor: canvas, overflow: 'hidden' },
  clip: { overflow: 'hidden' },
  galleryPage: { backgroundColor: '#F9F5ED', overflow: 'hidden' },
  brand: { color: '#4B1302', textAlign: 'center', includeFontPadding: false },
  brandRight: { textAlign: 'right' },
  toolbar: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', alignItems: 'center' },
  spacer: { flex: 1 },
  priceBand: { overflow: 'hidden', backgroundColor: '#D8891D' },
  priceText: { color: '#FFFFFF', includeFontPadding: false },
  amount: { fontWeight: '500' },
  coupon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  goldText: { color: '#C38B3C', includeFontPadding: false },
  section: { backgroundColor: paper },
  season: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#9E3927' },
  seasonLabel: { color: '#FDF6F0', fontWeight: '700', includeFontPadding: false },
  productTitle: { color: '#222222', fontWeight: '500', includeFontPadding: false },
  giftAction: { flexDirection: 'row', alignItems: 'center' },
  muted: { color: '#9B9B9B', includeFontPadding: false },
  tagRow: { flexDirection: 'row', alignItems: 'center' },
  tag: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  text: { includeFontPadding: false },
  flipHorizontally: { transform: [{ scaleX: -1 }] },
  shippingText: { color: '#5E5E5E', includeFontPadding: false },
  detailTabs: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  detailTab: { alignItems: 'center', justifyContent: 'center', height: '100%' },
  detailTabText: { color: '#3A1915', includeFontPadding: false },
  detailUnderline: { position: 'absolute' },
  footer: { backgroundColor: '#FFFFFF' },
  footerRow: { flexDirection: 'row', alignItems: 'center' },
  footerIcon: { alignItems: 'center', justifyContent: 'center' },
  footerLabel: { includeFontPadding: false },
  purchase: { alignItems: 'center', justifyContent: 'center' },
  cartAction: { borderColor: '#C58F41' },
  buyAction: { backgroundColor: gold },
  actionText: { fontWeight: '700', includeFontPadding: false },
});
