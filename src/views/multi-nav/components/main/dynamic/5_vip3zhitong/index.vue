<template>
  <div class="vip">
    <img class="pay" src="./image/buy.png" alt="10元领取" @click="submit" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import payPanel from '@/components/pay-panel';
import { installMessage, listenerPositiveMessage, uninstallMessage } from '@/network';
import _ from 'lodash';
import assetNotify from '@/components/asset-notify';
import notifyValidate from '@/permissions/asset-notify-validate';
import { updateMenu } from '@/views/multi-nav/composables/nav-menu';

function addListenMsg() {
  installMessage({ msg_names: ['notify_asset_change_msg'] });

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
          if (type.startsWith('buy_gift_bag')) {
            updateMenu();
          }

          if (notifyValidate(type)) {
            assetNotify(filtAsset);
          }
        }
      }
    }
  });
}

function removeListenMsg() {
  uninstallMessage({ msg_names: ['notify_asset_change_msg'] });
}

export default defineComponent({
  name: 'Vip1zhitong',

  methods: {
    submit() {
      payPanel(10255, 300);
    },
  },

  mounted() {
    addListenMsg();
  },

  beforeUnmount() {
    removeListenMsg();
  },
});
</script>

<style lang="scss" scoped src="./index.scss" />
