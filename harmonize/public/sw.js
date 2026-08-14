/**
 * Service worker do Harmonize Clinical.
 *
 * Objetivo: a clínica precisa abrir o prontuário e a agenda mesmo sem
 * internet (sala de procedimento no subsolo, 4G instável). Os dados já vivem
 * no localStorage; o que falta é a casca do app ficar disponível offline.
 *
 * Estratégias:
 *  - navegação (HTML): network-first com fallback para o cache, para que uma
 *    nova versão publicada seja pega assim que houver rede, sem travar offline;
 *  - assets com hash no nome (/assets/*): cache-first, pois o conteúdo é imutável;
 *  - ícones/manifest: stale-while-revalidate;
 *  - /api/*: nunca cacheado — respostas de IA e health check precisam ser reais.
 */

const VERSION = 'v1';
const SHELL_CACHE = `harmonize-shell-${VERSION}`;
const ASSET_CACHE = `harmonize-assets-${VERSION}`;
const CURRENT_CACHES = [SHELL_CACHE, ASSET_CACHE];

/** Recursos suficientes para a primeira pintura offline. */
const SHELL_URLS = [
  '/',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      // addAll é atômico: um 404 aborta a instalação inteira. Como os ícones
      // podem variar entre builds, cada item é adicionado isoladamente.
      await Promise.all(
        SHELL_URLS.map(async (url) => {
          try {
            await cache.add(new Request(url, { cache: 'reload' }));
          } catch (error) {
            console.warn('[sw] Não foi possível pré-cachear', url, error);
          }
        }),
      );
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => name.startsWith('harmonize-') && !CURRENT_CACHES.includes(name))
          .map((name) => caches.delete(name)),
      );

      // navigationPreload deixa o network-first de navegação bem mais rápido.
      if (self.registration.navigationPreload) {
        try {
          await self.registration.navigationPreload.enable();
        } catch (error) {
          console.warn('[sw] navigationPreload indisponível', error);
        }
      }

      await self.clients.claim();
    })(),
  );
});

/** Permite que a UI aplique a atualização sem o usuário fechar o app. */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/** Página mínima mostrada se nem a rede nem o cache tiverem o HTML. */
function offlineFallbackResponse() {
  return new Response(
    `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Harmonize Clinical — sem conexão</title>
    <style>
      body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center;
             background:#102438; color:#E2E8F0; font-family: system-ui, -apple-system, sans-serif;
             text-align:center; padding:24px; }
      h1 { font-size:1.25rem; margin:0 0 8px; }
      p { font-size:.875rem; color:#A2C7E5; margin:0 0 20px; line-height:1.6; }
      button { background:#2563EB; color:#fff; border:0; border-radius:999px;
               padding:10px 24px; font-size:.8125rem; font-weight:600; cursor:pointer; }
    </style>
  </head>
  <body>
    <div>
      <h1>Você está sem conexão</h1>
      <p>Abra o app novamente quando a internet voltar.<br />Seus dados continuam salvos no aparelho.</p>
      <button onclick="location.reload()">Tentar de novo</button>
    </div>
  </body>
</html>`,
    { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
}

async function handleNavigation(event) {
  const cache = await caches.open(SHELL_CACHE);

  try {
    const preloaded = await event.preloadResponse;
    const response = preloaded || (await fetch(event.request));
    if (response && response.ok) {
      // Guarda sempre em '/' para qualquer rota servir a mesma casca SPA.
      cache.put('/', response.clone());
    }
    return response;
  } catch {
    const cached = (await cache.match(event.request)) || (await cache.match('/'));
    return cached || offlineFallbackResponse();
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response && response.ok) cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const network = fetch(request)
    .then((response) => {
      if (response && response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => undefined);

  if (cached) return cached;

  const response = await network;
  if (response) return response;
  throw new Error('Recurso indisponível offline');
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Só GET é cacheável; POSTs de IA passam direto.
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Requisições para outras origens (fontes do Google, por exemplo) ficam
  // a cargo do próprio navegador.
  if (url.origin !== self.location.origin) return;

  // Nunca cachear a API: respostas de IA e health check precisam ser frescas.
  if (url.pathname.startsWith('/api/')) return;

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(event));
    return;
  }

  // Bundles do Vite têm hash no nome — o conteúdo nunca muda.
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      cacheFirst(request, ASSET_CACHE).catch(() => Response.error()),
    );
    return;
  }

  if (/\.(png|svg|ico|webmanifest|woff2?)$/i.test(url.pathname)) {
    event.respondWith(
      staleWhileRevalidate(request, SHELL_CACHE).catch(() => Response.error()),
    );
  }
});
