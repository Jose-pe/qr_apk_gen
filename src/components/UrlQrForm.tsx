import React, { useState } from 'react';
import { Globe, Link as LinkIcon, AlertCircle, Sparkles, MessageCircle, MapPin, Instagram, Youtube, ArrowRight } from 'lucide-react';

interface UrlQrFormProps {
  url: string;
  onChangeUrl: (newUrl: string) => void;
  onGenerate: () => void;
}

export const UrlQrForm: React.FC<UrlQrFormProps> = ({
  url,
  onChangeUrl,
  onGenerate,
}) => {
  const [activeShortcut, setActiveShortcut] = useState<string | null>(null);
  const [customWaNumber, setCustomWaNumber] = useState('');
  const [customWaMsg, setCustomWaMsg] = useState('');
  const [showWaBuilder, setShowWaBuilder] = useState(false);

  // Check if URL has valid protocol
  const isMissingProtocol = url.trim().length > 0 && !/^https?:\/\//i.test(url.trim());

  const handleAddHttps = () => {
    if (url.trim().length > 0) {
      onChangeUrl(`https://${url.trim().replace(/^https?:\/\//i, '')}`);
    }
  };

  const handleApplyWa = () => {
    const cleanNum = customWaNumber.replace(/\D/g, '');
    if (cleanNum) {
      const encodedMsg = encodeURIComponent(customWaMsg.trim());
      const waUrl = encodedMsg 
        ? `https://wa.me/${cleanNum}?text=${encodedMsg}`
        : `https://wa.me/${cleanNum}`;
      onChangeUrl(waUrl);
      setShowWaBuilder(false);
      onGenerate();
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-none">Código QR para Enlace Web</h2>
            <p className="text-xs text-slate-500 mt-1">Genera un código QR directo a cualquier sitio web o URL</p>
          </div>
        </div>
      </div>

      {/* URL Input Form */}
      <div className="space-y-2">
        <label htmlFor="url-input" className="block text-xs font-semibold text-slate-700">
          Dirección web (URL) <span className="text-red-500">*</span>
        </label>
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <LinkIcon className="w-4 h-4" />
          </div>
          <input
            id="url-input"
            type="url"
            value={url}
            onChange={(e) => onChangeUrl(e.target.value)}
            placeholder="https://ejemplo.com o tu enlace"
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm text-slate-900 placeholder:text-slate-400 transition bg-slate-50/50 focus:bg-white"
          />
          {url && (
            <button
              id="clear-url-btn"
              type="button"
              onClick={() => onChangeUrl('')}
              className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 text-xs"
              title="Borrar"
            >
              ✕
            </button>
          )}
        </div>

        {/* Protocol warning helper */}
        {isMissingProtocol && (
          <div className="flex items-center justify-between text-xs bg-amber-50 text-amber-800 p-2.5 rounded-xl border border-amber-200">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Para compatibilidad móvil óptima, añade <strong>https://</strong></span>
            </div>
            <button
              type="button"
              onClick={handleAddHttps}
              className="font-medium text-blue-600 hover:text-blue-800 underline underline-offset-2 ml-2 shrink-0 cursor-pointer"
            >
              Añadir
            </button>
          </div>
        )}
      </div>

      {/* Protocol Quick Inserts */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium mr-1">Atajos:</span>
        <button
          type="button"
          onClick={() => onChangeUrl(`https://${url.replace(/^https?:\/\//i, '')}`)}
          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs transition"
        >
          https://
        </button>
        <button
          type="button"
          onClick={() => onChangeUrl(`https://www.`)}
          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs transition"
        >
          https://www.
        </button>
        <button
          type="button"
          onClick={() => setShowWaBuilder(!showWaBuilder)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium text-xs transition ${
            showWaBuilder ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          }`}
        >
          <MessageCircle className="w-3 h-3" />
          <span>Chat WhatsApp</span>
        </button>
      </div>

      {/* WhatsApp Quick Builder Sub-panel */}
      {showWaBuilder && (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-900">
            <span className="flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              Generador de Enlace Directo a WhatsApp
            </span>
            <button
              onClick={() => setShowWaBuilder(false)}
              className="text-emerald-700 hover:text-emerald-900 font-normal"
            >
              Cerrar
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Número con código de país (ej. 34600000000 o 52155...)
              </label>
              <input
                type="tel"
                value={customWaNumber}
                onChange={(e) => setCustomWaNumber(e.target.value)}
                placeholder="54911..."
                className="w-full px-3 py-1.5 rounded-lg border border-emerald-300 bg-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Mensaje predeterminado (opcional)
              </label>
              <input
                type="text"
                value={customWaMsg}
                onChange={(e) => setCustomWaMsg(e.target.value)}
                placeholder="¡Hola! Me gustaría información..."
                className="w-full px-3 py-1.5 rounded-lg border border-emerald-300 bg-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleApplyWa}
            disabled={!customWaNumber.trim()}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium text-xs transition"
          >
            <span>Generar enlace de WhatsApp</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Popular Templates */}
      <div className="space-y-2 pt-1 border-t border-slate-100">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Plantillas comunes
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => onChangeUrl('https://instagram.com/tu_usuario')}
            className="flex items-center gap-1.5 p-2 rounded-xl border border-slate-200 hover:border-pink-300 hover:bg-pink-50/50 text-slate-700 text-xs text-left transition"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-600 shrink-0" />
            <span className="truncate">Instagram</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeUrl('https://youtube.com/@tu_canal')}
            className="flex items-center gap-1.5 p-2 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50/50 text-slate-700 text-xs text-left transition"
          >
            <Youtube className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span className="truncate">YouTube</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeUrl('https://maps.google.com/?q=Mi+Negocio')}
            className="flex items-center gap-1.5 p-2 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-slate-700 text-xs text-left transition"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">Google Maps</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeUrl('https://linktr.ee/tu_perfil')}
            className="flex items-center gap-1.5 p-2 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-700 text-xs text-left transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">Biolink</span>
          </button>
        </div>
      </div>
    </div>
  );
};
