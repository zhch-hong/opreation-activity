<template>
  <img class="lbdy" src="./image/btn_1.png" alt="礼包兑换" @click="duihuan" />
  <OverlayDialog :visible="visible" @close="visible = false">
    <template #title>
      <span>礼包兑换</span>
    </template>
    <div class="main">
      <input
        v-model.trim="giftCode"
        :disabled="disable"
        ref="CodeInput"
        class="input"
        maxlength="10"
        type="text"
        placeholder="请输入礼包兑换码"
      />

      <span v-if="invalid" class="invalid">兑换码格式错误</span>
      <span v-if="disable" class="disable">
        连续输入错误次数已达上限，请稍后
        <b>({{ timedown }})</b>
      </span>

      <button class="button" @click="submit">兑&nbsp;&nbsp;换</button>
    </div>
  </OverlayDialog>
</template>
<script lang="ts">
import { defineComponent, ref, watch, watchEffect } from 'vue';
import { fetchCall, installMessage, uninstallMessage, listenerPositiveMessage } from '@/network';
import { parseTimestamp } from '@/utils/stamp2hms';
import alertMessage from '@/components/alert';
import assetNotify from '@/components/asset-notify';
import _ from 'lodash';

import OverlayDialog from '@/components/overlay-dialog/index.vue';

function cutdown(count: number) {
  const time = ref('');
  const timestamp = ref(count);

  watchEffect(() => (time.value = parseTimestamp(timestamp.value)));

  const timer = setInterval(() => {
    timestamp.value--;
  }, 1000);

  return { time, timer };
}

function addListenMsg() {
  installMessage({ msg_names: ['notify_asset_change_msg'] });
}

function removeListenMsg() {
  uninstallMessage({ msg_names: ['notify_asset_change_msg'] });
}

function listenCallback() {
  listenerPositiveMessage<Record<string, unknown>>('notify_asset_change_msg', (params) => {
    if (params) {
      if (typeof params.type !== 'undefined') {
        const asset = params.change_asset as Record<string, string>[] | undefined;
        if (asset) {
          // 需要弹出
          const filtAsset = asset
            .filter((item) => {
              if (item.asset_type.startsWith('obj_')) {
                if (typeof item.attribute !== 'undefined') {
                  return true;
                }
              } else {
                if (_.toNumber(item.asset_value) > 0) {
                  return true;
                }
              }
            })
            .map((item) => ({ name: item.asset_type, count: _.toNumber(item.asset_value) }));

          const type = params.type as string;

          if (typeof type === 'undefined') return;

          // 不需要弹出得列表
          if (
            [
              'task_newplayer_xrcdj1',
              'task_newplayer_xrcdj2',
              'task_newplayer_xrcdj3',
              'task_p_029_hlqjd_hammer',
              'little_game_yingjin_task',
              'buyu_fire_award_hongbao_task',
              'buyu_2d_leiji_dapao_new_task',
              'box_exchange_active_award_37',
              'box_exchange_active_award_38',
              'box_exchange_active_award_39',
              'box_exchange_active_award_40',
              'box_exchange_active_award_41',
              'box_exchange_active_award_42',
              'box_exchange_active_award_69',
              'box_exchange_active_award_87',
              'box_exchange_active_award_88',
              'box_exchange_active_award_99',
              'task_ocean_explore_week_children_task',
              'buy_gift_bag_10436',
              'treasure_bowl_restore',
              'task_p_hammer',
              'box_exchange_active_award_74',
              'box_exchange_active_award_75',
              'box_exchange_active_award_76',
              'box_exchange_active_award_77',
              'box_exchange_active_award_78',
              'box_exchange_active_award_89',
              'box_exchange_active_award_96',
              'box_exchange_active_award_97',
              'box_exchange_active_award_98',
              'box_exchange_active_award_93',
              'box_exchange_active_award_94',
              'box_exchange_active_award_95',
              'box_exchange_active_award_100',
              'box_exchange_active_award_101',
              'box_exchange_active_award_102',
              'box_exchange_active_award_103',
              'task_award_1000069',
              'fishbowl_lottery',
              'task_award_1000129',
              'task_award_no_show',
              'activity_exchange_43',
              'activity_exchange_44',
              'task_p_xrxsfl_hlby',
              'task_p_xrxsfl_cjj',
              'buy_gift_bag_10496',
              'task_xiaoxiaole_tower',
              'change_assets_by_webview',
              'task_aquaman_passport_base',
              'all_return_lb_overtime_award',
              'gold_pig2_task_award',
              'box_exchange_active_award_60',
              'buy_gift_bag_10331',
              'buy_gift_bag_10332',
              'buy_gift_bag_10333',
              'buy_gift_bag_10334',
              'buy_gift_bag_10335',
              'buy_gift_bag_10336',
              'task_award_1000116',
            ].includes(type)
          )
            return;

          if (type.startsWith('bullet_rank_award_settle_')) {
            assetNotify(filtAsset);
            return;
          }

          //需要弹出得列表
          if (
            [
              'BUY',
              'BUY_GIFT',
              'SHOPING',
              'MERCHANT_BUY',
              'WITHDRAW',
              'PAY_EXCHANGE_JING_BI',
              'PAY_EXCHANGE_JIPAIQI',
              'PAY_EXCHANGE_ROOMCARD',
              'DWQ_CHANGE_1',
              'DWQ_CHANGE_2',
              'DWQ_CHANGE_3',
              'DWQ_CHANGE_4',
              'GWJ_CHANGE_1',
              'MANUAL_SEND',
              'EVERYDAY_SHARED_FRIEND',
              'EVERYDAY_SHARED_TIMELINE',
              'EVERYDAY_FLAUNT',
              'EVERYDAY_SHARED_MATCH',
              'XSYD_FINISH_AWARD',
              'TASK_AWARD',
              'GLORY_AWARD',
              'REDEEM_CODE_AWARD',
              'BUY_GIFT_BAG_7',
              'BUY_GIFT_BAG_8',
              'BUY_GIFT_BAG_10',
              'BUY_GIFT_BAG_11',
              'BUY_GIFT_BAG_12',
              'BUY_GIFT_BAG_13',
              'BUY_GIFT_BAG_20',
              'BUY_GIFT_BAG_21',
              'BUY_GIFT_BAG_28',
              'BUY_GIFT_BAG_29',
              'BUY_GIFT_BAG_30',
              'BUY_GIFT_BAG_31',
              'BUY_GIFT_BAG_32',
              'BUY_GIFT_BAG_33',
              'BUY_GIFT_BAG_35',
              'BUY_GIFT_BAG_36',
              'BUY_GIFT_BAG_37',
              'BUY_GIFT_BAG_38',
              'BUY_GIFT_BAG_39',
              'BUY_GIFT_BAG_40',
              'BROKE_SUBSIDY',
              'FREE_BROKE_SUBSIDY',
              'BROKE_SHARE_POP',
              'GOLD_PIG2_TASK_AWARD',
              'PAY_EXCHANGE_EXPRESSION_57',
              'EVERYDAY_WYS_SHARED',
              'FREESTYLE_SETTLE_EXCHANGE_HONGBAO',
              'ACTIVITY_EXCHANGE_DUANWUJIE_FISHGAME_ZONGZI',
              'BUYU_DAILY_TASK_AWARD',
              'OPEN_LUCK_BOX',
              'IOS_PLYJ',
              'BUYU_RANK_AWARD',
              'LD_PLAYER_LOTTERY_RANK_AWARD',
              'PAY_STRIDE_1000',
              'BIND_PHONE_AWARD',
              'JING_YU_KUAI_PAO_EMAIL_AWARD',
              'CTIVITY_EXCHANGE_RECYCLE',
              'ATERMElON_RANK_AWARD',
              'IP_CHARGE_AWARD',
              'JING_YU_KUAI_PAO_AUTO_AWARD',
              'HOUNIANQING_YUYUE_AWARD',
              'NQ_LOOK_BACK',
              'ZNQ_JNB_EXCHANGE_DHQ',
              'ZHOUNIANQING_YINGJING_RANK_EMAIL_AWARD',
              'ZNQ_JNB_RECYCLE',
              'ZHOUNIANQING_YINGJING_RANK_WANGZHE_EMAIL',
              'IAOXIAOLE_ONCE_GAME_RANK_AWARD',
              'ITHDRAW_TO_SHOP_GOLD',
              'NEW_USER_QYS_AWARD',
              'QYS_EVERY_TIME_REMIND',
              'IGN_IN_AWARD',
              'IGN_IN_ACC_AWARD',
              'EMAIL_NOTIFICATION_GIFT',
              'NATIONAL_DAY_LOTTERY_RANK_EMAIL_AWARD',
              'SCZD_ACHIEVEMENT_SYS_AWARD',
              'OCTOBER_19_LOTTERY_2_RANK_EMAIL_AWARD',
              'BOX_EXCHANGE',
              'BUYU_MATCH_AWARD',
              'BROKE_BEG',
              'FREESTYLE_ACTIVITY_AWARD_EMAIL',
              'STXT_EVERYDAY_TASK_AWARDS',
              'STXT_GIVE_PROPS',
              'YUYUE_GNS',
              'WATCH_AD_AWARD',
              'AUTHENTICATION_AWARD',
              'FISH_3D_CAIBEI_AWARD',
              'PAY_EXCHANGE_ROOM_CARD',
              'ALL_RETURN_LB_3_EXTRA_AWARD',
              'PAY_EXCHANGE_PROP_FISH_SUMMON_FISH',
              'NPCA_BOX_AWARD',
              'XIAOXIAOLE_SHUIHU_ONCE_GAME_RANK_AWARD',
              'ADD_FISH_3D_GUN',
              'DEPOSIT_WITHDRAW_MONEY',
              'BULLET_RANK_EVERYDAY_EMAIL_AWARD',
              'BULLET_RANK_AWARD_SETTLE',
              'OPEN_TEST',
              'BUYU_3D_YINGJIN_RANK_EMAIL_AWARD',
              'ALL_RETURN_LB_OVERTIME_AWARD',
              'FISHBOWL_OPEN',
              'FISHBOWL_SALE',
              'FISHING_3D_GAME_FREE_LOTTERY',
              'FISHING_3D_GAME_AD_FISH',
              'NEW_YUEKA_AWARD',
              'XIAOLONGXIA_BOSS_025_RANK_EMAIL_AWARD',
              'XIAOLONGXIAQUAN_025_RANK_EMAIL_AWARD',
              'TRUE_LOVE_026_RANK_EMAIL_AWARD',
              'LEIJIYINGJIN_RANK_EMAIL_AWARD',
              'LEIJIXIAOHAO_RANK_EMAIL_AWARD',
              'OCEAN_EXPLORE_WEEK_RANK_EMAIL_AWARD',
              'JJSL_AWARD',
              'FISHBOWL_SALE_OBJ',
              'FISHBOWL_SALE_PROP',
              'GUN_OVERFLOW_AWARD_BARREL_1',
              'GUN_OVERFLOW_AWARD_BARREL_2',
              'GUN_OVERFLOW_AWARD_BARREL_3',
              'GUN_OVERFLOW_AWARD_BARREL_4',
              'GUN_OVERFLOW_AWARD_BARREL_5',
              'GUN_OVERFLOW_AWARD_BARREL_6',
              'GUN_OVERFLOW_AWARD_BARREL_7',
              'S12_12_LHSJB_RANK_EMAIL_AWARD',
              'DZ_JZSJB_RANK_EMAIL_AWARD',
              'SD_LHSJB_RANK_EMAIL_AWARD',
              'YD_JYD_RANK_EMAIL_AWARD',
              'HLQD_XXPHB_RANK_EMAIL_AWARD',
              'HHQJNH_046_LHSJB_RANK_EMAIL_AWARD',
              'KHQD_001_LZPHB_RANK_EMAIL_AWARD',
              'DRWSN_002_YGBD_RANK_EMAIL_AWARD',
              'CJS_003_BZPHB_RANK_EMAIL_AWARD',
              'SLEEP_ACT_TASK_AUTO_GET_AWARD_EMAIL_AWARD',
              'XIAOXIAOLE_2_9_RATE_RANK_EMAIL_AWARD',
              'GDN_004_JZBD_RANK_EMAIL_AWRAD',
              'YCS_005_JYBB_RANK_EMAIL_AWARD',
              'NYX_006_YXBD_RANK_EMAIL_AWARD',
              'XXLZB_005_RANK_EMAIL_AWARD',
              'KH315_008_LHPHB_RANK_EMAIL_AWARD',
              'XXLZB_005_RANK_EXT_EMAIL_AWARD',
              'KH315_008_LHPHB_RANK_EXT_EMAIL_AWARD',
              'XXLZB_006_RANK_EMAIL_AWARD',
              'CNHK_009_THPHB_RANK_EMAIL_AWARD',
              'XXLZB_006_RANK_EXT_EMAIL_AWARD',
              'CNHK_009_THPHB_RANK_EXT_EMAIL_AWARD',
              'XXLZB_007_RANK_EMAIL_AWARD',
              'XXLZB_007_RANK_EXT_EMAIL_AWARD',
              'YMKH_010_WXPHB_RANK_EMAIL_AWARD',
              'YMKH_010_WXPHB_RANK_EXT_EMAIL_AWARD',
              'XXLZB_008_RANK_EMAIL_AWARD',
              'XXLZB_008_RANK_EXT_EMAIL_AWARD',
              'QMYL_011_HDPHB_RANK_EMAIL_AWARD',
              'QMYL_011_HDPHB_RANK_EXT_EMAIL_AWARD',
              'XXLZB_009_RANK_EMAIL_AWARD',
              'XXLZB_009_RANK_EXT_EMAIL_AWARD',
              'ITQF_012_FQDR_RANK_EMAIL_AWARD',
              'ITQF_012_FQDR_RANK_EXT_EMAIL_AWARD',
              'CJJ_XXLZB_RANK_EMAIL_AWARD',
              'CJJ_XXLZB_RANK_EXT_EMAIL_AWARD',
              'HLSYT_013_BSYL_RANK_EMAIL_AWARD',
              'HLSYT_013_BSYL_RANK_EXT_EMAIL_AWARD',
              'WYLFT_014_LDXFB_RANK_EMAIL_AWARD',
              'WYLFT_014_LDXFB__RANK_EXT_EMAIL_AWARD',
              'HLJNH_015_YXDR_RANK_EMAIL_AWARD',
              'HLJNH_015_YXDR_RANK_EXT_EMAIL_AWARD',
              'HLWYT_016_FQDR_RANK_EMAIL_AWARD',
              'HLWYT_016_FQDR_RANK_EXT_EMAIL_AWARD',
              'YMSHF_017_HLDR_RANK_EMAIL_AWARD',
              'YMSHF_017_HLDR_RANK_EXT_EMAIL_AWARD',
              'HLLY_018_HLBD_RANK_EMAIL_AWARD',
              'HLLY_018_HLBD_RANK_EXT_EMAIL_AWARD',
              'ZQDW_019_FQDR_RANK_EMAIL_AWARD',
              'ZQDW_019_FQDR_RANK_EXT_EMAIL_AWARD',
              'FQJKH_020_YXBD_RANK_EMAIL_AWARD',
              'FQJKH_020_YXBD_RANK_EXT_EMAIL_AWARD',
              'QLYX_021_XGPHB_RANK_EMAIL_AWARD',
              'QLYX_021_XGPHB_RANK_EXT_EMAIL_AWARD',
              'YQHP_022_NQDR_RANK_EMAIL_AWARD',
              'YQHP_022_NQDR_RANK_EXT_EMAIL_AWARD',
              'XIAOXIAOLE_TOWER_WEEK_RANK_EMAIL_AWARD',
              'FISHBOWL_SHOP_BUY',
              'FISHBOWL_COMPOSE',
              'XXLZB_004_RANK_EMAIL_AWARD',
              'NSJ_007_MGBD_RANK_EMAIL_AWARD',
            ].includes(params.type as string)
          ) {
            assetNotify(filtAsset);
            return;
          }

          if (type.startsWith('xycd_ljyj_task') || type.startsWith('task_p_026_lmqx_lmlh_yj')) return;

          if (
            type.startsWith('task_') ||
            type.startsWith('buy_gift_bag_') ||
            type.startsWith('everyday_') ||
            type.startsWith('activity_exchange_')
          ) {
            assetNotify(filtAsset);
            return;
          }
        }
      }
    }
  });
}

export default defineComponent({
  components: {
    OverlayDialog,
  },

  setup() {
    const visible = ref(false);
    const timedown = ref('');

    return {
      visible,
      timedown,
    };
  },

  mounted() {
    addListenMsg();
    listenCallback();
  },

  beforeUnmount() {
    removeListenMsg();
    clearInterval(this.timer);
  },

  data() {
    return {
      timer: -1,
      giftCode: '',
      invalid: false,
      disable: false,
    };
  },

  methods: {
    duihuan() {
      this.visible = true;
    },

    validate(): boolean {
      if (this.giftCode.length < 6) return false;

      if (/\W|_/.test(this.giftCode)) return false;

      return true;
    },

    submit() {
      if (this.validate()) {
        fetchCall<Record<'result' | 'time', number>>({
          name: 'use_redeem_code',
          data: { code: this.giftCode },
        }).then(({ result, time }) => {
          if (result === 0) {
            this.visible = false;
            this.giftCode = '';
          } else {
            if (time !== 0) {
              alertMessage('你操作错误过多，稍后再试');
              this.disable = true;

              clearInterval(this.timer);

              const refCut = cutdown(time);

              this.timer = refCut.timer;

              watch(
                refCut.time,
                (value) => {
                  this.timedown = value;
                  if (value === '') {
                    this.disable = false;
                  }
                },
                { immediate: true }
              );
            } else {
              alertMessage('兑换码无效');
            }
          }
        });
      } else {
        this.invalid = true;

        (this.$refs.CodeInput as HTMLInputElement).addEventListener(
          'focus',
          () => {
            this.invalid = false;
          },
          { once: true }
        );
      }
    },
  },
});
</script>
<style lang="scss" scoped src="./index.scss" />
