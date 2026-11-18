export const flavors = ['红糖饮品', '红糖主食', '红糖早餐', '红糖糕点', '红糖甜品'] as const;

export type Flavor = (typeof flavors)[number];
