import type { ImageContentPosition } from 'expo-image';

export type CategoryIconLayout = {
  sourceWidth: number;
  sourceHeight: number;
  visibleCenterX: number;
  visibleCenterY: number;
  visibleWidth: number;
  visibleHeight: number;
};

export type Category = {
  id: string;
  label: string;
  image: number;
  iconLayout?: CategoryIconLayout;
};
export type Product = {
  id: string;
  name: string;
  price: string;
  image: number;
  imagePosition: ImageContentPosition;
};
export type BottomTab = { id: string; label: string; image: number };

export const categories: Category[] = [
  { id: 'recipes', label: '红糖食谱', image: require('../../assets/figma/home/a4f73.png') },
  { id: 'gift', label: '暖饮礼包', image: require('../../assets/figma/home/16f96.png') },
  { id: 'story', label: '品牌故事', image: require('../../assets/figma/home/f7b27.png') },
  { id: 'solar', label: '节气专栏', image: require('../../assets/figma/home/2ebf0.png') },
  { id: 'merch', label: '品牌周边', image: require('../../assets/figma/home/f9b72.png') },
  {
    id: 'sale',
    label: '特价好物',
    image: require('../../assets/figma/home/category-special-offer.png'),
    iconLayout: {
      sourceWidth: 100,
      sourceHeight: 90,
      visibleCenterX: 45.5,
      visibleCenterY: 47,
      visibleWidth: 78,
      visibleHeight: 75,
    },
  },
  {
    id: 'source',
    label: '原料溯源',
    image: require('../../assets/figma/home/category-source-strip.png'),
    iconLayout: {
      sourceWidth: 376,
      sourceHeight: 104,
      visibleCenterX: 183,
      visibleCenterY: 51.5,
      visibleWidth: 83,
      visibleHeight: 68,
    },
  },
  {
    id: 'business',
    label: '企业合作',
    image: require('../../assets/figma/home/category-business.png'),
    iconLayout: {
      sourceWidth: 106,
      sourceHeight: 94,
      visibleCenterX: 53,
      visibleCenterY: 41,
      visibleWidth: 75,
      visibleHeight: 75,
    },
  },
  { id: 'craft', label: '红糖工艺', image: require('../../assets/figma/home/50f78.png') },
];

export const products: Product[] = [
  {
    id: 'longan-red-date',
    name: '桂圆红枣暖饮',
    price: '40.8',
    image: require('../../assets/figma/home/9f3c5.png'),
    imagePosition: { left: '50%', top: '76%' },
  },
  {
    id: 'ginger-red-date',
    name: '姜枣红糖暖饮',
    price: '62.4',
    image: require('../../assets/figma/home/ee677.png'),
    imagePosition: { left: '50%', top: '78%' },
  },
  {
    id: 'jarred-sugar',
    name: '罐装巧家红糖',
    price: '40.8',
    image: require('../../assets/figma/home/64a20.png'),
    imagePosition: { left: '0%', top: '0%' },
  },
];

export const bottomTabs: BottomTab[] = [
  { id: 'home', label: '首页', image: require('../../assets/figma/home/37cc5.png') },
  { id: 'notes', label: '手札', image: require('../../assets/figma/home/d95b8.png') },
  { id: 'gifts', label: '礼事', image: require('../../assets/figma/home/620bb.png') },
  { id: 'culture', label: '风物', image: require('../../assets/figma/home/425a6.png') },
  { id: 'profile', label: '我的', image: require('../../assets/figma/home/7fa70.png') },
];

export const storySlides = [
  { id: 'slow-cook', quadrant: 'bottom-left' as const },
  { id: 'harvest', quadrant: 'top-left' as const },
  { id: 'pressing', quadrant: 'top-right' as const },
];