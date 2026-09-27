const CACHE='tahadi-v19';
const CORE=[
  './','./index.html','./manifest.webmanifest','./privacy.html','./support.html',
  './assets/thinking.wav','./assets/setup.wav','./assets/countdown.wav',
  './assets/correct.wav','./assets/wrong1.wav','./assets/wrong2.wav',
  './assets/timeup.wav','./assets/win1.wav','./assets/win2.wav','./assets/transition.wav'
];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(CORE))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;

  const isNavigation=event.request.mode==='navigate';
  const isHtml=event.request.destination==='document'||event.request.url.endsWith('/index.html');

  if(isNavigation||isHtml){
    event.respondWith(
      fetch(event.request,{cache:'no-store'})
        .then(res=>{
          const copy=res.clone();
          caches.open(CACHE).then(cache=>cache.put(event.request,copy));
          return res;
        })
        .catch(()=>caches.match(event.request).then(hit=>hit||caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(hit=>{
      if(hit)return hit;
      return fetch(event.request).then(res=>{
        const copy=res.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request,copy));
        return res;
      });
    })
  );
});
