import axios from 'axios';
import _ from 'lodash';
import store from '@/store';
import { v4 } from 'uuid';
import { reactive, ref, watch } from 'vue';
import { isBrowser } from '@/runtime-env';
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
  watch(count, (v: number) => {
    if (v === 0) return;

    const url = messageStack.shift();
    if (url) {
      messageRun = true;
      console.log(`发送消息___${url}`);
      location.href = url;
    }
  });

  /**
   * 消息队列
   */
  const messageStack = reactive<string[]>([]);
  watch(
    () => [...messageStack],
    (cur, pre) => {
      // cur.length > pre.length
      // 说明是有消息被添加到消息队列，如果当前没有消息正处于通讯状态，则触发消息发送机制
      // 如果当前正有消息处于通讯状态，则消息触发交由 emitter.on(readuuid) 回调函数处理
      if (pre) {
        if (cur.length > pre.length) {
          if (!messageRun) {
            count.value++;
          }
        }
      } else {
        if (cur.length > 0) {
          if (!messageRun) {
            count.value++;
          }
        }
      }
    }
  );

  return function <T>(url: string, response: boolean) {
    const uuid = v4();
    const readuuid = v4();

    if (url.includes('?')) url += `&readuuid='${readuuid}'`;
    else url += `?readuuid='${readuuid}'`;

    // 只有需要返回数据的消息，才用uuid
    if (response) {
      url += `&uuid='${uuid}'`;
    }

    messageStack.push(url);

    emitter.on(readuuid, () => {
      console.log(`消息回执___${readuuid}`);

      emitter.off(readuuid);
      messageRun = false;
      if (messageStack.length === 0) count.value = 0;
      else count.value++;
    });

    if (response) {
      return new Promise<T>((resolve, reject) => {
        emitter.on<T>(uuid, (data) => {
          if (data) resolve(data);
          else reject();
          emitter.off(uuid);
        });
      });
    }
  };
}

const fetchMessage = webview2client();

/**
 * 请求客户端配置
 * @param url
 * @returns
 */
function fetchClientConfig(url: string) {
  return new Promise<Record<string, Record<string, unknown>[]>>((resolve) => {
    axios({
      baseURL: process.env.VUE_APP_ASSET_URL,
      url,
      method: 'GET',
    })
      .then(({ data }) => {
        resolve(data);
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
          const param = msg.data as Record<string, unknown>;
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
function listenerPositiveMessage<T = unknown>(message: string, callback: (params?: T) => void) {
  emitter.on<T>(message, (event) => callback(event));
}

type FetchCallParam = {
  name: string;
  data: string | Record<PropertyKey, unknown>;
  user_id?: string; // 这个参数只有在浏览器环境下跟服务器通信需要，在webview环境下跟客户端通信时不需要
};
/**
 * 发送消息并需要返回
 * @param params
 * @returns
 */
function fetchCall<T>(params: FetchCallParam) {
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

    return fetchMessage<T>(`webmessage://request?name=${name}&params=${query}`, true)!;
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

type InstallMsgParam = {
  msg_names: string[];
  user_id?: string; // 这个参数只有在浏览器环境下跟服务器通信需要，在webview环境下跟客户端通信时不需要
};
/**
 * 注册需要发送到webview的消息
 * @param params
 */
function installMessage(params: InstallMsgParam) {
  if (isBrowser) {
    if (!params['user_id']) {
      params['user_id'] = store.state.user.user_id as string;
    }

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
    fetchMessage(`webmessage://addlisten?${query.slice(0, -1)}`, false);
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
    fetchMessage(`webmessage://removelisten?${query.slice(0, -1)}`, false);
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

export {
  fetchMessage,
  login,
  fetchClientConfig,
  loopFetch,
  fetchCall,
  installMessage,
  listenerPositiveMessage,
  uninstallMessage,
};
