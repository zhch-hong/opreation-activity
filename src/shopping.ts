/**
 * 赠送商品类型
 */
export type T_ATTACH_AWARD = {
  icon: string;
  text: string;
};

/**
 * ========================================= 豪华月卡
 */
export const HHYUEKA = { id: 10235, price: 48 };

/**
 * ========================================= 尊享月卡
 */
export const ZXYUEKA = { id: 10236, price: 96 };

/**
 * ========================================= 系统升级奖励ID
 */
export const SYSTEM_UPGRADE = 1000351;

/**
 * ========================================= 三元福利礼包
 */
export const SANYUANLIBAO = { id: 10, price: 3 };

/**
 * ========================================= 周卡
 */
export const ZHOUKA = { id: 10436, price: 10 };

/**
 * ========================================= 至尊季卡
 */
export const ZHIZUNJIKA = { id: 10168, price: 198 };

/**
 * ========================================= 每日特惠
 *
 * 根据vip等级展示相应的档次
 */
export type T_MEIRITEHUI = {
  id: number;
  price: number;
  desc: { text: string; icon: string }[];
};
export const MEIRITEHUI: Array<Array<T_MEIRITEHUI>> = [
  [
    {
      id: 10093,
      price: 18,
      desc: [
        { text: '90万', icon: 'ty_icon_jb_498y' },
        { text: '100万', icon: 'ty_icon_jb_30y' },
        { text: '10万', icon: 'ty_icon_yxb_2' },
      ],
    },
    {
      id: 10094,
      price: 48,
      desc: [
        { text: '240万', icon: 'ty_icon_jb_998y' },
        { text: '260万', icon: 'ty_icon_jb_50y' },
        { text: '10万', icon: 'ty_icon_yxb_4' },
      ],
    },
    {
      id: 10095,
      price: 98,
      desc: [
        { text: '490万', icon: 'ty_icon_jb_2498y' },
        { text: '520万', icon: 'ty_icon_jb_198y' },
        { text: '20万', icon: 'ty_icon_yxb_5' },
      ],
    },
  ],
  [
    {
      id: 10096,
      price: 48,
      desc: [
        { text: '240万', icon: 'ty_icon_jb_498y' },
        { text: '260万', icon: 'ty_icon_jb_30y' },
        { text: '10万', icon: 'ty_icon_yxb_2' },
      ],
    },
    {
      id: 10097,
      price: 88,
      desc: [
        { text: '490万', icon: 'ty_icon_jb_998y' },
        { text: '520万', icon: 'ty_icon_jb_50y' },
        { text: '20万', icon: 'ty_icon_yxb_4' },
      ],
    },
    {
      id: 10098,
      price: 198,
      desc: [
        { text: '990万', icon: 'ty_icon_jb_2498y' },
        { text: '1070万', icon: 'ty_icon_jb_198y' },
        { text: '30万', icon: 'ty_icon_yxb_5' },
      ],
    },
  ],
  [
    {
      id: 10099,
      price: 98,
      desc: [
        { text: '490万', icon: 'ty_icon_jb_498y' },
        { text: '520万', icon: 'ty_icon_jb_30y' },
        { text: '20万', icon: 'ty_icon_yxb_2' },
      ],
    },
    {
      id: 10100,
      price: 198,
      desc: [
        { text: '990万', icon: 'ty_icon_jb_998y' },
        { text: '1070万', icon: 'ty_icon_jb_50y' },
        { text: '30万', icon: 'ty_icon_yxb_4' },
      ],
    },
    {
      id: 10101,
      price: 498,
      desc: [
        { text: '2490万', icon: 'ty_icon_jb_2498y' },
        { text: '2640万', icon: 'ty_icon_jb_198y' },
        { text: '50万', icon: 'ty_icon_yxb_5' },
      ],
    },
  ],
  [
    {
      id: 10239,
      price: 6,
      desc: [
        { text: '30万', icon: 'ty_icon_jb_498y' },
        { text: '40万', icon: 'ty_icon_jb_30y' },
        { text: '5万', icon: 'ty_icon_yxb_2' },
      ],
    },
    {
      id: 10240,
      price: 48,
      desc: [
        { text: '240万', icon: 'ty_icon_jb_998y' },
        { text: '260万', icon: 'ty_icon_jb_50y' },
        { text: '10万', icon: 'ty_icon_yxb_2' },
      ],
    },
    {
      id: 10241,
      price: 98,
      desc: [
        { text: '490万', icon: 'ty_icon_jb_2498y' },
        { text: '520万', icon: 'ty_icon_jb_198y' },
        { text: '20万', icon: 'ty_icon_yxb_2' },
      ],
    },
  ],
  [
    {
      id: 10087,
      price: 1,
      desc: [
        { text: '5万', icon: 'ty_icon_jb_498y' },
        { text: '15万', icon: 'ty_icon_jb_30y' },
        { text: '1', icon: '3dby_btn_sd' },
      ],
    },
    {
      id: 10088,
      price: 3,
      desc: [
        { text: '15万', icon: 'ty_icon_jb_998y' },
        { text: '35万', icon: 'ty_icon_jb_50y' },
        { text: '2', icon: '3dby_btn_sd' },
      ],
    },
    {
      id: 10089,
      price: 6,
      desc: [
        { text: '30万', icon: 'ty_icon_jb_2498y' },
        { text: '60万', icon: 'ty_icon_jb_198y' },
        { text: '3', icon: '3dby_btn_sd' },
      ],
    },
  ],
  [
    {
      id: 10090,
      price: 6,
      desc: [
        { text: '30万', icon: 'ty_icon_jb_498y' },
        { text: '50万', icon: 'ty_icon_jb_30y' },
        { text: '3', icon: '3dby_btn_sd' },
      ],
    },
    {
      id: 10091,
      price: 10,
      desc: [
        { text: '50万', icon: 'ty_icon_jb_998y' },
        { text: '70万', icon: 'ty_icon_jb_50y' },
        { text: '10万', icon: 'ty_icon_yxb_2' },
      ],
    },
    {
      id: 10092,
      price: 18,
      desc: [
        { text: '90万', icon: 'ty_icon_jb_2498y' },
        { text: '110万', icon: 'ty_icon_jb_198y' },
        { text: '20万', icon: 'ty_icon_yxb_4' },
      ],
    },
  ],
];

/**
 * ========================================= 一本万利
 */
export type T_YIBENWANLI_ITEM = {
  id: number;
  price: number;
  name: string;
  taskid: number;
  handsel: string;
  neednum: number[];
  awards: number[];
};
export const YIBENWANLI: T_YIBENWANLI_ITEM[] = [
  {
    id: 10391,
    price: 2498,
    name: '荣耀礼包',
    taskid: 1000107,
    handsel: '2.5亿',
    neednum: [20000000, 50000000, 100000000, 500000000, 1000000000, 3000000000, 5000000000],
    awards: [160000, 250000, 500000, 600000, 1000000, 2000000, 3000000],
  },
  {
    id: 10390,
    price: 998,
    name: '王者礼包',
    taskid: 1000106,
    handsel: '9980万',
    neednum: [10000000, 30000000, 50000000, 100000000, 300000000, 500000000, 1000000000],
    awards: [100000, 150000, 200000, 250000, 300000, 450000, 600000],
  },
  {
    id: 10389,
    price: 498,
    name: '星耀礼包',
    taskid: 1000105,
    handsel: '4980万',
    neednum: [5000000, 10000000, 20000000, 50000000, 100000000, 300000000, 600000000],
    awards: [45000, 75000, 80000, 150000, 200000, 250000, 300000],
  },
  {
    id: 10388,
    price: 198,
    name: '钻石礼包',
    taskid: 1000104,
    handsel: '1980万',
    neednum: [5000000, 10000000, 20000000, 50000000, 100000000, 200000000, 400000000],
    awards: [20000, 30000, 50000, 60000, 80000, 120000, 250000],
  },
  {
    id: 10387,
    price: 98,
    name: '铂金礼包',
    taskid: 1000103,
    handsel: '980万',
    neednum: [1000000, 5000000, 10000000, 20000000, 50000000, 100000000, 300000000],
    awards: [10000, 15000, 20000, 30000, 50000, 80000, 200000],
  },
  {
    id: 10386,
    price: 68,
    name: '黄金礼包',
    taskid: 1000102,
    handsel: '680万',
    neednum: [1000000, 5000000, 10000000, 30000000, 50000000, 80000000, 150000000],
    awards: [8000, 12000, 20000, 30000, 40000, 50000, 60000],
  },
  {
    id: 10385,
    price: 30,
    name: '白银礼包',
    taskid: 1000101,
    handsel: '300万',
    neednum: [500000, 1000000, 5000000, 10000000, 20000000, 50000000, 100000000],
    awards: [2000, 5000, 10000, 15000, 20000, 30000, 50000],
  },
  {
    id: 10384,
    price: 6,
    name: '青铜礼包',
    taskid: 1000100,
    handsel: '60万',
    neednum: [100000, 300000, 600000, 1000000, 5000000, 10000000, 50000000],
    awards: [1000, 2000, 3000, 4000, 5000, 6000, 40000],
  },
];

// ========================================= 首充礼包
export type T_SCLB_GIFT = {
  id: number;
  price: number;
  count: number;
  icon: string;
  attach: T_ATTACH_AWARD[];
};
export const SHOUCHONGLIBAO: Record<string, T_SCLB_GIFT[]> = {
  true: [
    {
      id: 10611,
      price: 6,
      count: 600000,
      icon: 'pay_icon_gold7',
      attach: [
        {
          icon: 'ty_icon_pms1',
          text: 'x1',
        },
        {
          icon: 'ty_icon_jb_50y',
          text: '15万-60万',
        },
      ],
    },
    {
      id: 10612,
      price: 10,
      count: 1000000,
      icon: 'pay_icon_gold8',
      attach: [
        {
          icon: 'ty_icon_pms2',
          text: 'x1',
        },
        {
          icon: 'ty_icon_jb_198y',
          text: '40万-100万',
        },
      ],
    },
    {
      id: 10613,
      price: 48,
      count: 4800000,
      icon: 'pay_icon_gold9',
      attach: [
        {
          icon: 'ty_icon_pms2',
          text: 'x3',
        },
        {
          icon: 'ty_icon_jb_498y',
          text: '200万-480万',
        },
      ],
    },
  ],
  false: [
    {
      id: 95,
      price: 1,
      count: 50000,
      icon: 'pay_icon_gold7',
      attach: [
        {
          icon: 'ty_icon_jb_50y',
          text: 'x2',
        },
        {
          icon: 'ty_icon_jb_50y',
          text: '5.2万-20万',
        },
      ],
    },
    {
      id: 96,
      price: 10,
      count: 500000,
      icon: 'pay_icon_gold8',
      attach: [
        {
          icon: 'ty_icon_jb_198y',
          text: 'x20',
        },
        {
          icon: 'ty_icon_jb_198y',
          text: '55万-150万',
        },
      ],
    },
    {
      id: 99,
      price: 48,
      count: 2400000,
      icon: 'pay_icon_gold9',
      attach: [
        {
          icon: 'ty_icon_jb_498y',
          text: 'x200',
        },
        {
          icon: 'ty_icon_jb_498y',
          text: '260万-500万',
        },
      ],
    },
  ],
};
