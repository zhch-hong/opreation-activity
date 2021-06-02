import { ref, watchEffect } from 'vue';

const activeMenu = ref(18);

watchEffect(() => console.log(activeMenu.value));

export default activeMenu;
