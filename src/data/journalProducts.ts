export type ProductTag = '纯天然有机' | '补血养颜' | '暖胃散寒' | '活血化瘀';

export const journalProducts = [
  {
    id: 'blocks',
    title: '巧家万华小碗红糖 块装',
    source: require('../../assets/figma/journal-start/sugar-blocks.png'),
    crop: [-1, -26, 91, 97],
    tags: ['纯天然有机', '补血养颜'],
    price: 28,
    previous: 36,
  },
  {
    id: 'longan',
    title: '巧家万华桂圆红糖枣茶 盒装',
    source: require('../../assets/figma/journal-start/longan.png'),
    crop: [0, -58.29, 76.14, 123.4],
    tags: ['暖胃散寒', '活血化瘀', '补血养颜'],
    price: 52,
    previous: 63,
  },
  {
    id: 'sugar',
    title: '巧家万华小碗红糖 呵糖 适宜孕妇群体',
    source: require('../../assets/figma/notes/64a20.png'),
    crop: [-80.42, -131.0, 156.47, 208.7],
    tags: ['纯天然有机', '补血养颜', '暖胃散寒'],
    price: 31,
    previous: 38,
  },
  {
    id: 'gift',
    title: '巧家万华金沙唐韵 礼盒 高档 送礼',
    source: require('../../assets/figma/journal-start/gift.png'),
    crop: [0, -54.58, 76, 116.46],
    tags: ['活血化瘀', '补血养颜'],
    price: 128,
    previous: 136,
  },
  {
    id: 'three-sugars',
    title: '巧家万华红糖 全套 三款红糖',
    source: require('../../assets/figma/journal-start/three-sugars.png'),
    crop: [0, -47.33, 76, 117.3],
    tags: ['纯天然有机', '补血养颜'],
    price: 215,
    previous: 228,
  },
] as const;

export type JournalProduct = (typeof journalProducts)[number];
