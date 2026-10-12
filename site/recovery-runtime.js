/* Local host adaptations. Original scene/shader/animation code remains unchanged. */
(() => {
  const base = document.querySelector('meta[name="motion-sim-base"]')?.content || '';
  const localURL = value => {
    if (typeof value !== 'string') return value;
    if (value.startsWith('https://sael.net/')) value=value.slice('https://sael.net'.length);
    if (base && value.startsWith(location.origin+'/')) value=value.slice(location.origin.length);
    return base && value.startsWith('/') && !value.startsWith('//') && value!==base && !value.startsWith(base+'/') ? base+value : value;
  };
  const request = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const value = typeof input === 'string' ? input : input instanceof URL ? input.href : null;
    if (value) input=localURL(value);
    return request(input,init);
  };
  const OriginalSocket = window.WebSocket;
  window.WebSocket = class extends OriginalSocket {
    constructor(url, protocols) {
      if (String(url).startsWith('wss://api-db.d1.tel/')) url=(location.protocol==='https:'?'wss://':'ws://')+location.host+localURL('/runtime/session');
      super(url,protocols);
    }
  };
  if (base) {
    for (const method of ['pushState','replaceState']) {
      const original=history[method].bind(history);
      history[method]=(state,title,url)=>original(state,title,localURL(url));
    }
    const fixLinks = node => {
      if (node.nodeType!==1) return;
      for (const link of [node,...node.querySelectorAll('a[href]')]) {
        if (link.tagName==='A' && link.hasAttribute('href')) {
          const href=link.getAttribute('href'), next=localURL(href);
          if (next!==href) link.setAttribute('href',next);
        }
      }
    };
    new MutationObserver(records=>{
      for(const record of records) {
        if(record.type==='attributes') fixLinks(record.target);
        else for(const node of record.addedNodes) fixLinks(node);
      }
    }).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['href']});
    addEventListener('DOMContentLoaded',()=>fixLinks(document.documentElement),{once:true});
  }
})();
