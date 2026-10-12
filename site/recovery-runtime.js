/* Local host adaptations. Original scene/shader/animation code remains unchanged. */
(() => {
  const request = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const value = typeof input === 'string' ? input : input instanceof URL ? input.href : null;
    if (value && /^https:\/\/sael\.net\//.test(value)) input=value.replace('https://sael.net','');
    return request(input,init);
  };
  const OriginalSocket = window.WebSocket;
  window.WebSocket = class extends OriginalSocket {
    constructor(url, protocols) {
      if (String(url).startsWith('wss://api-db.d1.tel/')) url=(location.protocol==='https:'?'wss://':'ws://')+location.host+'/runtime/session';
      super(url,protocols);
    }
  };
})();
