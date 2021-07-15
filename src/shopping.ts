/**
 * 豪华月卡
 */
export const HHYUEKA = { id: 10235, price: 48 };

/**
 * 尊享月卡
 */
export const ZXYUEKA = { id: 10236, price: 96 };

/**
 * 系统升级奖励ID
 */
export const SYSTEM_UPGRADE = 1000351;

/**
 * 三元福利礼包
 */
export const SANYUANLIBAO = { id: 10, price: 3 };

/**
 * 周卡
 */
export const ZHOUKA = { id: 10436, price: 10 };

/**
 * 至尊季卡
 */
export const ZHIZUNJIKA = { id: 10168, price: 198 };

/**
 * 每日特惠配置数据结构
 */
export type TYPE_MEIRITEHUI = {
  id: number;
  price: number;
  desc: { text: string; icon: string }[];
};
/**
 * 每日特惠
 * 根据vip等级展示相应的档次
 */
export const MEIRITEHUI: Array<Array<TYPE_MEIRITEHUI>> = [
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
