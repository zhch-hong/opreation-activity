import axios from 'axios';
import _ from 'lodash';
import store from '@/store';
import { v4 } from 'uuid';
import { reactive, ref, watch } from 'vue';
import { isBrowser, isWebview } from '@/vendors/runtime-env';
import { emitter } from '@/vendors/window-listener';

/**
 * 发送消息不需要返回
 * @param params
 * @returns
 */
/* function fetchSend(params: unknown) {
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
} */

/**
 * 通过服务器向客户端发送消息
 * @param params
 * @returns
 */
/* function fetchNative(params: Record<string, string | Record<string, unknown>>) {
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
} */

/**
 * 从webview发送消息到客户端
 * @returns
 */
const fetchMessage = (function webview2client() {
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

      // const rIndex = url.indexOf('readuuid');
      // const uIndex = url.indexOf('&uuid');
      // if (uIndex !== -1) {
      //   console.group(`发送消息【${url.slice(uIndex + 7, uIndex + 43)}】`);
      //   console.log(url);
      //   console.groupEnd();
      // } else if (rIndex !== -1) {
      //   console.group(`发送消息【${url.slice(rIndex + 10, rIndex + 46)}】`);
      //   console.log(url);
      //   console.groupEnd();
      // } else {
      //   console.error(`发送消息未添加uuid或readuuid【${url}】`);
      // }

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

  return function <T = any>(url: string, response: boolean) {
    const uuid = v4();
    const readuuid = v4();

    if (url.includes('?')) url += `&readuuid='${readuuid}'`;
    else url += `?readuuid='${readuuid}'`;

    // 只有需要返回数据的消息，才用uuid
    if (response) {
      url += `&uuid='${uuid}'`;
    }

    messageStack.push(url);

    emitter.on<number>(readuuid, () => {
      // console.group(`消息已读【${readuuid}】`);
      // console.groupEnd();

      emitter.off(readuuid);

      messageRun = false;

      if (messageStack.length === 0) {
        count.value = 0;
      } else {
        count.value++;
      }
    });

    if (response) {
      return new Promise<T>((resolve, reject) => {
        emitter.on<T>(uuid, (data) => {
          // console.group(`消息响应【${uuid}】`);
          // console.log(data);
          // console.groupEnd();

          emitter.off(uuid);

          if (data) resolve(data);
          else reject();
        });
      });
    }
  };
})();

/**
 * 请求客户端配置
 * @param url
 * @returns
 */
function fetchClientConfig<T = any>(url: string) {
  return new Promise<T>((resolve) => {
    axios({
      baseURL: process.env.VUE_APP_ASSET_URL,
      url,
      method: 'GET',
    })
      .then((response) => {
        const data = response.data as T;
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
 * 请求服务器数据
 * @param message 消息名称
 * @param data
 * @returns
 */
function fetchCall<T = any>(message: string, data: Record<string, unknown> = {}): Promise<T> {
  if (isWebview) {
    return fetchMessage<T>(`webmessage://request?name=${message}&params=${JSON.stringify(data)}`, true)!;
  }

  return new Promise<T>((resolve) => {
    axios({
      baseURL: store.state.baseURL,
      url: `msg_call`,
      method: 'POST',
      data: {
        name: message,
        user_id: store.state.user.user_id,
        data,
      },
      headers: {
        token: store.state.token,
        userid: store.state.user.user_id,
      },
    }).then(({ data }) => {
      resolve(data);
    });
  });
}

/**
 * 需要注册的服务端主动推送的消息列表
 */
const SERVE_MESSAGE_LIST: string[] = [];
/**
 * 注册消息延时发送定时器
 */
let messageTimer: number | null = null;
/**
 * 注册服务端消息
 * @param message 服务端推送的消息名称
 * @param callback 处理数据的回调函数
 */
function registerServeMsg<T>(message: string, callback: (params: T) => void) {
  SERVE_MESSAGE_LIST.push(message);

  emitter.on<T>(message, (event) => {
    if (typeof event !== 'undefined' && callback) callback(event);
  });

  if (messageTimer) {
    clearTimeout(messageTimer);
  }

  messageTimer = _.delay(() => {
    if (isWebview) {
      let params = '';
      SERVE_MESSAGE_LIST.forEach((m, i) => {
        params += `${++i}=${m}&`;
      });
      params = params.slice(0, -1);

      fetchMessage(`webmessage://addlisten?${params}`, false);
    } else {
      const data = {
        user_id: store.state.user.user_id,
        msg_names: SERVE_MESSAGE_LIST,
      };

      axios({
        baseURL: store.state.baseURL,
        url: `register_msg`,
        method: 'POST',
        data,
        headers: {
          token: store.state.token,
          userid: data.user_id,
        },
      });
    }

    SERVE_MESSAGE_LIST.splice(0);
    messageTimer = null;
  }, 600);
}

/**
 * 需要取消注册的服务端主动推送的消息列表
 */
const UNSERVE_MESSAGE_LIST: string[] = [];
/**
 * 取消注册消息延时发送定时器
 */
let unmessageTimer: number | null = null;
/**
 * 注销服务端消息
 * @param message
 */
function unregisterServeMsg(message: string) {
  UNSERVE_MESSAGE_LIST.push(message);
  emitter.off(message);

  if (unmessageTimer) clearTimeout(unmessageTimer);

  unmessageTimer = _.delay(() => {
    if (isWebview) {
      let params = '';
      UNSERVE_MESSAGE_LIST.forEach((m, i) => {
        params += `${++i}=${m}&`;
      });
      params = params.slice(0, -1);

      fetchMessage(`webmessage://removelisten?${params}`, false);
    } else {
      const data = {
        user_id: store.state.user.user_id,
        msg_names: [],
      };

      axios({
        baseURL: store.state.baseURL,
        url: `register_msg`,
        method: 'POST',
        data,
        headers: {
          token: store.state.token,
          userid: data.user_id,
        },
      });
    }

    UNSERVE_MESSAGE_LIST.splice(0);
    unmessageTimer = null;
  }, 300);
}

export { fetchMessage, login, fetchClientConfig, loopFetch, fetchCall, registerServeMsg, unregisterServeMsg };
