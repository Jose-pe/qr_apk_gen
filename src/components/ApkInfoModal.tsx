import React from 'react';
import { Smartphone, Download, CheckCircle2, X, Sparkles, ShieldCheck } from 'lucide-react';

interface ApkInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall?: () => void;
  isInstallable: boolean;
}

export const ApkInfoModal: React.FC<ApkInfoModalProps> = ({
  isOpen,
  onClose,
  onInstall,
  isInstallable,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        id="apk-info-card"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/15 rounded-xl backdrop-blur-xs">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Instalación como APK / App</h3>
              <p className="text-blue-100 text-xs">PWA & WebAPK para Android y dispositivos móviles</p>
            </div>
          </div>
          <button
            id="close-apk-modal-btn"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700 text-sm">
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-4 flex gap-3 items-start">
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900 text-sm">
                ¿Qué es un WebAPK / PWA?
              </p>
              <p className="text-blue-800/90 text-xs mt-1 leading-relaxed">
                Esta aplicación está construida con el estándar oficial de Google <strong>WebAPK / Progressive Web App</strong>. 
                Al instalarla en Android, el sistema operativo genera un paquete APK nativo de forma automática, sin requerir descargas riesgosas de fuentes externas.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Ventajas de la versión instalada:
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <li className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>100% segura y libre de virus</span>
              </li>
              <li className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <Smartphone className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Ícono directo en cajón y pantalla</span>
              </li>
              <li className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <Download className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Genera QRs sin conexión a internet</span>
              </li>
              <li className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Experiencia a pantalla completa (sin URL bar)</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-900 text-sm">¿Cómo instalar en tu móvil?</h4>
            <div className="space-y-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <div className="flex gap-2">
                <span className="font-bold text-blue-600 bg-blue-100 w-5 h-5 rounded-full flex items-center justify-center shrink-0">1</span>
                <span><strong>En Google Chrome (Android):</strong> Toca el botón inferior "Instalar APK" o abre el menú de tres puntos (⋮) y selecciona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a pantalla principal"</strong>.</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-blue-600 bg-blue-100 w-5 h-5 rounded-full flex items-center justify-center shrink-0">2</span>
                <span><strong>En Safari (iPhone / iPad):</strong> Pulsa el botón Compartir y elige <strong>"Agregar a inicio"</strong>.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-slate-600 hover:text-slate-800 text-xs font-medium hover:bg-slate-200/60 transition"
          >
            Entendido
          </button>
          {isInstallable && onInstall && (
            <button
              id="modal-install-btn"
              onClick={() => {
                onInstall();
                onClose();
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition active:scale-98"
            >
              <Download className="w-4 h-4" />
              Instalar ahora en el dispositivo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
