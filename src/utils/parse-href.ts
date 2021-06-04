import { isBrowser } from '@/runtime-env';
import store from '@/store';

export default function () {
  console.log(location.href);

  if (isBrowser) {
    store.commit('COMMIT_BASEURL', process.env.VUE_APP_HTTP_HOST);
    store.commit('COMMIT_SCALE', localStorage.getItem('scale'));
  }

  const query = location.href.split('?')[1];
  const map = query.split('&');
  map.forEach((s) => {
    const k = s.split('=')[0];
    const v = s.split('=')[1];

    if (k === 'token') store.commit('COMMIT_TOKEN', v);

    if (k === 'url') store.commit('COMMIT_BASEURL', decodeURIComponent(v));

    if (k === 'scale') store.commit('COMMIT_SCALE', v);
  });
}
