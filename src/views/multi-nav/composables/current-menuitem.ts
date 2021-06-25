import { ref, watch, WatchStopHandle } from 'vue';
import { getMenu } from './nav-menu';

const menuID = ref(0);
const menuComponentName = ref('');
let watchStop: WatchStopHandle | null = null;

export function activeMenu() {
  if (watchStop === null) {
    const activityList = getMenu();
    watchStop = watch(
      menuID,
      (id) => {
        const act = activityList.find((m) => m['ID'] === id);

        menuComponentName.value = act
          ? (act['dynamic_component'] as string) || 'default-component'
          : 'default-component';
      },
      {
        immediate: true,
      }
    );

    watch(activityList, (value) => {
      if (value.length !== 0) {
        menuID.value = value[0]['ID'] as number;
      }
    });
  }

  return {
    menuID,
    menuComponentName,
  };
}
