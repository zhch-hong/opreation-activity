import store from '@/store';

export default function () {
  if (store.state.token && store.state.baseURL) return;

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
