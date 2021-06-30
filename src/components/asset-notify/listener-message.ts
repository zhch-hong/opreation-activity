import _ from 'lodash';
import { installMessage, listenerPositiveMessage, uninstallMessage } from '@/network';
import assetNotify from '.';
import notifyValidate from './asset-notify-validate';

function addListenMsg(cb?: (p: Record<string, unknown>) => void) {
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

          if (notifyValidate(type)) {
            assetNotify(filtAsset);
          }

          cb && cb(params);
        }
      }
    }
  });
}

function removeListenMsg() {
  uninstallMessage({ msg_names: ['notify_asset_change_msg'] });
}

export { addListenMsg, removeListenMsg };
