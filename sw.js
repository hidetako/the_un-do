/* 坐雲堂 Service Worker — オフラインでも開く堂
   方針：
   - index.html（ナビゲーション）＝ network-first。デプロイ更新が即届き、圏外時のみキャッシュへ退く
   - 同一オリジンの静的資産（画像・manifest等）＝ cache-first（初回取得時にキャッシュ）
   - 外部オリジン（Google Fonts / esm.sh / supabase.co）＝ SWは関与しない（素通し）
   資産を差し替えたのに反映されない事故を防ぐため、資産のファイル名を変えるか V を上げること。 */
const V = 'zaundo-v1';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(V).then(c => c.addAll(['/', '/manifest.json'])).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;   // 外部は素通し（CSP/鮮度は本体に任せる）

  if (e.request.mode === 'navigate' || u.pathname === '/' || u.pathname.endsWith('/index.html')) {
    e.respondWith(
      fetch(e.request).then(r => {
        const cp = r.clone(); caches.open(V).then(c => c.put('/', cp));
        return r;
      }).catch(() => caches.match('/'))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
      if (r.ok) { const cp = r.clone(); caches.open(V).then(c => c.put(e.request, cp)); }
      return r;
    }))
  );
});
