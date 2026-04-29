import { MenuItem } from './types';

export const mockMenu: MenuItem[] = [
  {
    id: 'm1',
    category: '麵類',
    name: '特製豚骨拉麵',
    price: 180,
    description: '濃郁豬骨熬製高湯，搭配軟嫩叉燒與蔥花。',
    sizes: [
      { name: '正常', priceModifier: 0 },
      { name: '大碗', priceModifier: 30 }
    ],
    addOns: [
      { name: '加糖心蛋', price: 30 },
      { name: '加叉燒', price: 50 },
      { name: '加海苔', price: 20 }
    ],
    image: '🍜'
  },
  {
    id: 'm2',
    category: '麵類',
    name: '柚子鹽味拉麵',
    price: 190,
    description: '清爽柚子香氣點綴的雞高湯底，口感層次豐富。',
    sizes: [
      { name: '正常', priceModifier: 0 },
      { name: '大碗', priceModifier: 30 }
    ],
    addOns: [
      { name: '加糖心蛋', price: 30 },
      { name: '加叉燒', price: 50 },
    ],
    image: '🍲'
  },
  {
    id: 'm3',
    category: '飯類',
    name: '炙燒叉燒飯',
    price: 120,
    isSoldOut: true,
    description: '特製醬汁滷製叉燒肉，大火炙燒逼出迷人油脂香氣。',
    sizes: [
      { name: '小', priceModifier: 0 },
      { name: '大', priceModifier: 40 }
    ],
    addOns: [
      { name: '加溫泉蛋', price: 25 },
    ],
    image: '🍚'
  },
  {
    id: 'm4',
    category: '小菜',
    name: '日式唐揚雞',
    price: 100,
    description: '外酥內嫩的日式炸雞塊，現點現炸多汁美味。',
    sizes: [
      { name: '正常', priceModifier: 0 }
    ],
    addOns: [
      { name: '美乃滋', price: 0 },
      { name: '明太子醬', price: 20 }
    ],
    image: '🍗'
  },
  {
    id: 'm5',
    category: '湯類',
    name: '味噌湯',
    price: 40,
    description: '採用傳統日式紅味噌熬製，暖胃首選。',
    sizes: [
      { name: '正常', priceModifier: 0 }
    ],
    addOns: [],
    image: '🥣'
  },
  {
    id: 'm6',
    category: '套餐',
    name: '拉麵唐揚雞套餐',
    price: 260,
    description: '經典豚骨拉麵搭配香酥唐揚雞的超值雙饗組合。',
    sizes: [
      { name: '正常', priceModifier: 0 }
    ],
    addOns: [
      { name: '加糖心蛋', price: 30 }
    ],
    image: '🍱'
  }
];

export const CATEGORIES = ['飯類', '麵類', '湯類', '小菜', '套餐'];

export const DEFAULT_LOGO = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='46' fill='%23FAF9F6' stroke='%23333333' stroke-width='2'/%3E%3Ccircle cx='50' cy='35' r='15' fill='%23BC2732'/%3E%3Cpath d='M25 65 Q50 85 75 65' stroke='%23333333' stroke-width='4' fill='none' stroke-linecap='round'/%3E%3Cline x1='20' y1='55' x2='80' y2='55' stroke='%23333333' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E";
