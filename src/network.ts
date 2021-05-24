import axios from 'axios';
import _ from 'lodash';
import store from '@/store';
import { v4 } from 'uuid';
import { ref, watch } from 'vue';
import { isBrowser, isWebview } from '@/runtime-env';
import { emitter } from '@/window-listener';

/**
 * 从webview发送消息到客户端
 * @returns
 */
function webview2client() {
  /**
   * 标识当前是否正处于通讯状态
   * 即从webview发送消息到客户端，客户端还有没有消息回执（告诉webview客户端已经收到消息了）
   */
  let messageRun = false;

  /**
   * 每当客户端告诉webview当前发送的消息已经收到了，就判断消息队列是否还有消息
   * 如果消息队列为空了，就将count置为0
   * 否则count+1，触发监听，取消息队列第一条消息进行发送
   * 以此循环
   */
  const count = ref(0);

  /**
   * 消息队列
   */
  const messageStack = ref<string[]>([]);

  const cb = (v: number) => {
    console.log('count', 'send', v);

    if (v === 0) return;

    const url = messageStack.value.shift();
    if (url) {
      messageRun = true;
      console.log('发送消息', url);

      location.href = url;
    }
  };

  watch(count, cb);
  watch(
    messageStack,
    (cur, pre) => {
      console.log('messageStack变化', _.cloneDeep(cur), pre);

      // cur.length > pre.length
      // 说明是有消息被添加到消息队列，如果当前没有消息正处于通讯状态，则触发消息发送机制
      // 如果当前正有消息处于通讯状态，则消息触发交由 emitter.on(readuuid) 回调函数处理
      if (pre) {
        console.log('if');

        if (cur.length > pre.length) {
          if (!messageRun) {
            count.value++;
          }
        }
      } else {
        console.log('else', _.cloneDeep(cur), cur.length, messageRun);

        if (cur.length > 0) {
          if (!messageRun) {
            console.log('++');

            count.value++;
          }
        }
      }
    },
    { deep: true, immediate: true }
  );

  return function <T>(url: string, response: boolean) {
    console.log(url, response);
    console.log(messageStack);

    const uuid = v4();
    const readuuid = v4();

    if (url.includes('?')) url += `&uuid='${uuid}'&readuuid='${readuuid}'`;
    else url += `?uuid='${uuid}'&readuuid='${readuuid}'`;

    messageStack.value.push(url);

    emitter.on(readuuid, () => {
      console.log('消息回执', readuuid);

      emitter.off(readuuid);
      messageRun = false;
      if (messageStack.value.length === 0) count.value = 0;
      else count.value++;
    });

    if (response) {
      return new Promise<T>((resolve, reject) => {
        emitter.on<T>(uuid, (data) => {
          console.log('数据响应', uuid);

          if (data) resolve(data);
          else reject();
          emitter.off(uuid);
        });
      });
    }
  };
}

const send = webview2client();

/**
 * 请求客户端配置
 * @param url
 * @returns
 */
function fetchClientConfig(url: string) {
  return new Promise<Record<string, Record<string, unknown>[]>>((resolve) => {
    const cache = localStorage.getItem(url);

    if (cache) {
      resolve(JSON.parse(cache));
    }

    axios({
      baseURL: process.env.VUE_APP_ASSET_URL,
      url,
      method: 'GET',
    })
      .then(({ data }) => {
        resolve(data);
        localStorage.setItem(url, JSON.stringify(data));
      })
      .catch(() => {
        alert(`获取配置文件失败[${url}]`);
      });
  });
}

/**
 * 登录
 * @returns
 */
function login(): Promise<void> {
  if (isBrowser) {
    return new Promise<void>((resolve, reject) => {
      axios({
        baseURL: store.state.baseURL,
        url: 'get_user_by_token',
        method: 'GET',
        params: { token: store.state.token },
      })
        .then(({ data }) => {
          // 计算服务器时间和本地时间差值
          data['diff'] = Math.floor((new Date().valueOf() - (data.ts as number) * 1000) / 1000);
          store.commit('COMMIT_USER', data);
          resolve();
        })
        .catch(reject);
    });
  }

  return new Promise<void>((resolve) => {
    const data: Record<string, unknown> = {
      assets: { prop_web_chip_huafei: 1, jing_bi: 1, shop_gold_sum: 1 },
      jing_bi: 1,
      prop_web_chip_huafei: 1,
      shop_gold_sum: 1,
      nickname: '用户昵称',
      result: '0',
      status: 'enable',
      ts: 0,
      user_id: '105390',
    };
    data['diff'] = Math.floor((new Date().valueOf() - (data.ts as number) * 1000) / 1000);
    store.commit('COMMIT_USER', data);
    resolve();
  });
}

/**
 * 循环请求主动推送的消息，只在浏览器环境中使用
 * @returns
 */
function loopFetch() {
  const loop = ref(true);
  const fetch = () => {
    if (store.state.token && !_.isEmpty(store.state.user)) {
      axios({
        baseURL: store.state.baseURL,
        url: `pull_msg?user_id=${store.state.user.user_id}`,
        method: 'GET',
        headers: {
          token: store.state.token,
          userid: store.state.user.user_id,
        },
      }).then((response) => {
        const data = response.data as Record<string, unknown>[];

        data.forEach((msg) => {
          const name = msg.name as string;
          const param = msg.data as Record<string, string | Record<string, string>[]>;
          emitter.emit(name, param);
        });

        if (loop.value) {
          setTimeout(() => {
            fetch();
          }, 1000);
        }
      });
    } else {
      if (loop.value) {
        setTimeout(() => {
          fetch();
        }, 1000);
      }
    }
  };

  fetch();

  return loop;
}

/**
 * 监听主动推送的消息
 * @param message 消息名称
 * @param callback 回调函数
 */
function listenerPositiveMessage(message: string, callback: (params: unknown) => void) {
  emitter.on<unknown>(message, (event) => callback(event));
}

/**
 * 发送消息并需要返回
 * @param params
 * @returns
 */
function fetchCall<T>(params: Record<string, string | Record<string, unknown>>) {
  if (isBrowser) {
    const data = _.cloneDeep(params);
    data['user_id'] = store.state.user.user_id as string;
    return new Promise<T>((resolve) => {
      axios({
        baseURL: store.state.baseURL,
        url: `msg_call`,
        method: 'POST',
        withCredentials: false,
        data,
        headers: {
          token: store.state.token,
          userid: store.state.user.user_id,
        },
      }).then(({ data }) => {
        resolve(data);
      });
    });
  } else {
    const name = params.name as string;
    const query = JSON.stringify(params.data);

    return send<T>(`webmessage://request?name=${name}&params=${query}`, true)!;
  }
}

/**
 * 发送消息不需要返回
 * @param params
 * @returns
 */
function fetchSend(params: unknown) {
  axios({
    baseURL: store.state.baseURL,
    url: `msg_send`,
    method: 'POST',
    withCredentials: false,
    data: params,
    headers: {
      token: store.state.token,
      userid: store.state.user.user_id,
    },
  });
}

/**
 * 注册需要发送到webview的消息
 * @param params
 */
function installMessage(params: Record<string, unknown>) {
  if (isBrowser) {
    axios({
      baseURL: store.state.baseURL,
      url: `register_msg`,
      method: 'POST',
      withCredentials: false,
      data: params,
      headers: {
        token: store.state.token,
        userid: store.state.user.user_id,
      },
    });
  } else {
    const ms = params.msg_names as string[];
    let query = '';
    ms.forEach((m, i) => {
      query += `${i + 1}=${m}&`;
    });
    send(`webmessage://addlisten?${query.slice(0, -1)}`, false);
  }
}

/**
 * 取消注册需要发送到webview的消息
 * @param params
 */
function uninstallMessage(params: Record<string, unknown>) {
  if (isBrowser) {
    // axios({
    //   baseURL: baseURL.value,
    //   url: `/register_msg`,
    //   method: 'POST',
    //   withCredentials: false,
    //   data: params,
    //   headers: {
    //     token: TOKEN.value,
    //     userid: USER.value?.user_id,
    //   },
    // });
  } else {
    const ms = params.msg_names as string[];
    let query = '';
    ms.forEach((m, i) => {
      query += `${i + 1}=${m}&`;
    });
    send(`webmessage://removelisten?${query.slice(0, -1)}`, false);
  }
}

/**
 * 通过服务器向客户端发送消息
 * @param params
 * @returns
 */
function fetchNative(params: Record<string, string | Record<string, unknown>>) {
  const data = _.cloneDeep(params);
  data['user_id'] = store.state.user.user_id as string;
  return axios({
    baseURL: store.state.baseURL,
    url: `msg_webview_notify`,
    method: 'GET',
    withCredentials: false,
    params: data,
    headers: {
      token: store.state.token,
      userid: store.state.user.user_id,
    },
  });
}

export default send;
export { login, fetchClientConfig, loopFetch, fetchCall, installMessage, listenerPositiveMessage, uninstallMessage };
