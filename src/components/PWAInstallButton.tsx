import React, { useState } from 'react';
import { Download, Smartphone, CheckCircle, Info } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { ApkInfoModal } from './ApkInfoModal';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        {isInstalled ? (
          <div 
            id="installed-badge"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-medium"
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>App Instalada</span>
          </div>
        ) : isInstallable ? (
          <button
            id="install-apk-header-btn"
            onClick={install}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-sm hover:shadow transition transform active:scale-95"
            title="Instalar aplicación en tu dispositivo móvil o escritorio"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Instalar APK</span>
          </button>
        ) : isIOS ? (
          <button
            id="install-ios-btn"
            onClick={() => setShowIOSGuide(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium transition"
          >
            <Smartphone className="w-3.5 h-3.5 text-slate-500" />
            <span>Instalar en iOS</span>
          </button>
        ) : (
          <button
            id="info-apk-btn"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/70 text-xs font-medium transition"
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-600" />
            <span>Modo APK</span>
          </button>
        )}

        <button
          id="apk-help-icon-btn"
          onClick={() => setShowModal(true)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition"
          title="Información sobre la app móvil y formato APK"
          aria-label="Ayuda sobre APK"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      <ApkInfoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onInstall={install}
        isInstallable={isInstallable}
      />

      {/* iOS Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900">Instalar en iPhone o iPad</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              1. Pulsa el botón <strong>Compartir</strong> (ícono cuadrado con flecha hacia arriba en Safari).<br />
              2. Desplázate por el menú y selecciona <strong>"Agregar a inicio"</strong>.<br />
              3. Toca "Agregar" en la esquina superior derecha.
            </p>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-xl bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};
