import { useCallback, useEffect, useState } from 'react';

/**
 * Integração do app com o service worker e com a instalação do PWA.
 *
 * Expõe três coisas que a UI precisa mostrar para a clínica:
 *  - se está offline (os dados continuam locais, mas a IA não responde);
 *  - se há uma versão nova esperando para ser aplicada;
 *  - se o navegador permite instalar o app na tela inicial.
 */

/** Evento não-padrão do Chromium para instalação do PWA. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PwaState {
  isOffline: boolean;
  updateReady: boolean;
  canInstall: boolean;
  isInstalled: boolean;
  applyUpdate: () => void;
  promptInstall: () => Promise<'accepted' | 'dismissed' | 'unavailable'>;
  dismissInstall: () => void;
}

const INSTALL_DISMISSED_KEY = 'harmonize_install_dismissed_at';
/** Depois de recusar, só voltamos a sugerir a instalação daqui a 14 dias. */
const INSTALL_SNOOZE_MS = 14 * 24 * 60 * 60 * 1000;

function installRecentlyDismissed(): boolean {
  try {
    const raw = window.localStorage.getItem(INSTALL_DISMISSED_KEY);
    if (!raw) return false;
    return Date.now() - Number(raw) < INSTALL_SNOOZE_MS;
  } catch {
    return false;
  }
}

function detectInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  const standalone = window.matchMedia?.('(display-mode: standalone)').matches;
  // iOS Safari não suporta display-mode e usa esta propriedade própria.
  const iosStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone;
  return Boolean(standalone || iosStandalone);
}

export function usePwa(): PwaState {
  const [isOffline, setIsOffline] = useState(() =>
    typeof navigator === 'undefined' ? false : !navigator.onLine,
  );
  const [updateReady, setUpdateReady] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(detectInstalled);

  // --- Conectividade ---
  useEffect(() => {
    const goOnline = () => setIsOffline(false);
    const goOffline = () => setIsOffline(true);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // --- Registro do service worker ---
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    // Em dev o SW atrapalha o HMR do Vite; só registramos no build de produção.
    if (import.meta.env.DEV) return;

    let cancelled = false;

    const trackInstalling = (registration: ServiceWorkerRegistration) => {
      const installing = registration.installing;
      if (!installing) return;
      installing.addEventListener('statechange', () => {
        // controller nulo = primeira instalação, não é uma "atualização".
        if (installing.state === 'installed' && navigator.serviceWorker.controller) {
          if (cancelled) return;
          setWaitingWorker(installing);
          setUpdateReady(true);
        }
      });
    };

    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        if (cancelled) return;

        if (registration.waiting && navigator.serviceWorker.controller) {
          setWaitingWorker(registration.waiting);
          setUpdateReady(true);
        }

        registration.addEventListener('updatefound', () => trackInstalling(registration));

        // Procura atualizações ao voltar para o app, sem precisar recarregar.
        const checkOnFocus = () => {
          if (document.visibilityState === 'visible') registration.update().catch(() => {});
        };
        document.addEventListener('visibilitychange', checkOnFocus);
      })
      .catch((error) => console.warn('[pwa] Falha ao registrar o service worker:', error));

    // Quando o novo SW assume, recarrega uma única vez para pegar o bundle novo.
    let reloading = false;
    const onControllerChange = () => {
      if (reloading) return;
      reloading = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    return () => {
      cancelled = true;
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    };
  }, []);

  // --- Instalação ---
  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      // Impede o mini-infobar para exibirmos o convite no momento certo.
      event.preventDefault();
      if (!installRecentlyDismissed()) {
        setInstallEvent(event as BeforeInstallPromptEvent);
      }
    };

    const onInstalled = () => {
      setInstallEvent(null);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const applyUpdate = useCallback(() => {
    setUpdateReady(false);
    if (waitingWorker) {
      // O reload acontece no listener de controllerchange.
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
    }
  }, [waitingWorker]);

  const promptInstall = useCallback(async () => {
    if (!installEvent) return 'unavailable' as const;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    setInstallEvent(null);
    if (outcome === 'dismissed') {
      try {
        window.localStorage.setItem(INSTALL_DISMISSED_KEY, String(Date.now()));
      } catch {
        // Sem localStorage o convite volta na próxima visita; aceitável.
      }
    }
    return outcome;
  }, [installEvent]);

  const dismissInstall = useCallback(() => {
    setInstallEvent(null);
    try {
      window.localStorage.setItem(INSTALL_DISMISSED_KEY, String(Date.now()));
    } catch {
      // idem
    }
  }, []);

  return {
    isOffline,
    updateReady,
    canInstall: installEvent !== null && !isInstalled,
    isInstalled,
    applyUpdate,
    promptInstall,
    dismissInstall,
  };
}
