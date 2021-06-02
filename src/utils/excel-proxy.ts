export default function (data: Record<string, unknown>[]) {
  const array: Record<string, unknown>[] = [];

  data.forEach((object) => {
    const proxy = new Proxy(object, {
      get: function (target, property: string) {
        const keys = Object.keys(target);
        const fullKey = keys.find((key) => key.split('|')[0] === property);

        if (typeof fullKey === 'undefined') {
          return target[property];
          // throw new Error(`${JSON.stringify(target)}不存在属性${fullKey}[${property}]`);
        }

        return target[fullKey];
      },

      set: function (target, property: string, value: unknown) {
        const keys = Object.keys(target);
        const fullKey = keys.find((key) => key.split('|')[0] === property);

        if (typeof fullKey === 'undefined') {
          target[property] = value;
          // throw new Error(`${JSON.stringify(target)}不存在属性${fullKey}[${property}]`);
        } else {
          target[fullKey] = value;
        }

        return true;
      },
    });

    array.push(proxy);
  });

  return array;
}
