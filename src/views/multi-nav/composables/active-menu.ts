import { ref, watch, WatchStopHandle } from 'vue';
import configMenu from './config-menu';

const menuID = ref(0);
const menuComponentName = ref('');
let watchStop: WatchStopHandle | null = null;

export function activeMenu() {
  if (watchStop === null) {
    const activityList = configMenu();

    watchStop = watch(
      menuID,
      (id) => {
        const act = activityList.value.find((m) => m['ID'] === id);

        menuComponentName.value = act
          ? (act['dynamic_component'] as string) || 'default-component'
          : 'default-component';
      },
      {
        immediate: true,
      }
    );

    const watchListStop = watch(activityList, (value) => {
      if (value.length !== 0) {
        menuID.value = value[0]['ID'] as number;

        watchListStop();
      }
    });
  }

  return {
    menuID,
    menuComponentName,
  };
}
