import React, { useState, useEffect } from "react";
import { X, Smartphone, Download, CheckCircle, ExternalLink, Code2, Layers, QrCode } from "lucide-react";

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const currentUrl = window.location.href;

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert(
        "Para instalar no seu celular Android:\n\n1. Abra o menu do seu navegador (três pontinhos no canto superior)\n2. Toque em 'Instalar aplicativo' ou 'Adicionar à tela inicial'."
      );
    }
  };

  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-2xl w-full flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-indigo-950 text-white flex items-center justify-between border-b border-indigo-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-xs">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Instalar App SISA no Celular / Gerar APK</h3>
              <p className="text-xs text-indigo-200">Suporte completo para Android e iOS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-indigo-300 hover:text-white hover:bg-indigo-900 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-slate-800 text-sm overflow-y-auto max-h-[75vh]">
          {/* Opção 1: PWA Direto */}
          <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-indigo-600" />
                <h4 className="font-bold text-indigo-950 text-base">
                  1. Instalação Instantânea no Celular (Sem Loja / PWA)
                </h4>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-indigo-200 text-indigo-900 rounded-md">
                Recomendado
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              O SISA é um aplicativo web progressivo (PWA). Você pode instalá-lo diretamente no seu smartphone Android como um aplicativo nativo, com ícone na tela inicial, modo tela cheia e funcionamento offline sem precisar baixar arquivos APK externos.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={handleInstallPWA}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isInstalled ? "App Já Instalado" : "Instalar no Celular Agora"}
              </button>
            </div>
          </div>

          {/* Opção 2: Gerar APK Grátis via PWABuilder */}
          <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-3">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-emerald-600" />
              <h4 className="font-bold text-emerald-950 text-base">
                2. Gerar Arquivo APK em 1 Clique (PWABuilder)
              </h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Se você precisa especificamente do arquivo <strong>.APK</strong> para distribuir ou instalar em dispositivos Android via pendrive/WhatsApp:
            </p>

            <ol className="text-xs text-slate-700 list-decimal list-inside space-y-1.5 font-medium">
              <li>Clique no botão abaixo para abrir a ferramenta oficial gratuita de empacotamento.</li>
              <li>O endereço desta aplicação já estará configurado automaticamente.</li>
              <li>Clique em <strong>"Generate Package" &gt; "Android"</strong> para baixar o arquivo <strong>.APK</strong> compilado!</li>
            </ol>

            <div className="pt-2">
              <a
                href={pwaBuilderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                Gerar .APK Grátis no PWABuilder
              </a>
            </div>
          </div>

          {/* Opção 3: Compilar Nativo via Capacitor */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-slate-700" />
              <h4 className="font-bold text-slate-900 text-base">
                3. Compilar APK Nativo com Android Studio / Capacitor
              </h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              O projeto já está configurado com <strong>Capacitor (capacitor.config.json)</strong>. Desenvolvedores podem baixar o código-fonte e compilar o APK no Android Studio com os seguintes comandos:
            </p>

            <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-lg overflow-x-auto space-y-1">
              <p className="text-slate-400"># 1. Exportar o código pelo menu "Export" do AI Studio</p>
              <p>npm install</p>
              <p>npm run build</p>
              <p>npx cap add android</p>
              <p>npx cap open android</p>
              <p className="text-slate-400"># 2. No Android Studio: Build &gt; Build APK(s)</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
