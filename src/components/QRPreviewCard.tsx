import React, { useRef, useEffect, useState } from 'react';
import { Download, Copy, Share2, Palette, Sliders, Check, Sparkles, Image as ImageIcon, FileCode, CheckCircle2 } from 'lucide-react';
import { QRStyleConfig, QRType } from '../types';
import { drawQRToCanvas, downloadCanvasAsPng, generateQRSvg, downloadSvg, copyCanvasToClipboard } from '../utils/qrHelper';

interface QRPreviewCardProps {
  type: QRType;
  title: string;
  payload: string;
  styleConfig: QRStyleConfig;
  onChangeStyle: (newStyle: QRStyleConfig) => void;
  onSaveToHistory: () => void;
}

const COLOR_PRESETS = [
  { name: 'Clásico', fg: '#0f172a', bg: '#ffffff' },
  { name: 'Azul Real', fg: '#1d4ed8', bg: '#ffffff' },
  { name: 'Índigo', fg: '#4338ca', bg: '#ffffff' },
  { name: 'Esmeralda', fg: '#047857', bg: '#ffffff' },
  { name: 'Violeta', fg: '#7e22ce', bg: '#ffffff' },
  { name: 'Naranja', fg: '#c2410c', bg: '#ffffff' },
];

export const QRPreviewCard: React.FC<QRPreviewCardProps> = ({
  type,
  title,
  payload,
  styleConfig,
  onChangeStyle,
  onSaveToHistory,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeCustomTab, setActiveCustomTab] = useState<'colors' | 'style'>('colors');
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  // Re-render canvas whenever payload or style changes
  useEffect(() => {
    if (!payload.trim() || !canvasRef.current) return;
    drawQRToCanvas(canvasRef.current, payload, styleConfig);
  }, [payload, styleConfig]);

  const handleDownloadPng = () => {
    if (!canvasRef.current) return;
    const safeTitle = (title || 'codigo-qr').toLowerCase().replace(/[^a-z0-9]/g, '-');
    downloadCanvasAsPng(canvasRef.current, `qr-${safeTitle}.png`);
  };

  const handleDownloadSvg = async () => {
    if (!payload.trim()) return;
    const svgStr = await generateQRSvg(payload, styleConfig);
    const safeTitle = (title || 'codigo-qr').toLowerCase().replace(/[^a-z0-9]/g, '-');
    downloadSvg(svgStr, `qr-${safeTitle}.svg`);
  };

  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    const success = await copyCanvasToClipboard(canvasRef.current);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (!canvasRef.current || !navigator.share) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'codigo-qr.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Código QR: ${title}`,
            text: `Escanea este código QR generado para ${title}`,
            files: [file],
          });
        } else {
          await navigator.share({
            title: `Código QR: ${title}`,
            text: payload,
          });
        }
      });
    } catch {
      // User cancelled share
    }
  };

  const handleSave = () => {
    onSaveToHistory();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const hasPayload = payload.trim().length > 0;

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between">
      {/* Header info */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Vista Previa en Vivo
          </span>
          {hasPayload && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              Listo para escanear
            </span>
          )}
        </div>

        {/* Canvas Display */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50/80 rounded-2xl border border-slate-100 min-h-[290px] relative">
          {hasPayload ? (
            <div className="relative group p-3 bg-white rounded-2xl shadow-sm border border-slate-200/60 transition-transform duration-200 hover:scale-[1.02]">
              <canvas
                id="qr-canvas"
                ref={canvasRef}
                className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-xl"
              />
            </div>
          ) : (
            <div className="text-center p-6 space-y-2 text-slate-400">
              <div className="w-16 h-16 mx-auto rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-300">
                <ImageIcon className="w-8 h-8" />
              </div>
              <p className="text-xs font-medium text-slate-500">Ingresa los datos para generar el código QR</p>
              <p className="text-[11px] text-slate-400">Se actualizará instantáneamente</p>
            </div>
          )}

          {/* Quick Payload Caption */}
          {hasPayload && (
            <div className="mt-3 text-center max-w-xs truncate">
              <p className="text-xs font-semibold text-slate-800 truncate">{title}</p>
              <p className="text-[10px] font-mono text-slate-400 truncate mt-0.5">{payload}</p>
            </div>
          )}
        </div>

        {/* Customization Options Bar */}
        <div className="pt-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveCustomTab('colors')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeCustomTab === 'colors'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Colores</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCustomTab('style')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeCustomTab === 'style'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Ícono & Estilo</span>
              </button>
            </div>
          </div>

          {activeCustomTab === 'colors' ? (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="flex flex-wrap items-center gap-2">
                {COLOR_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => onChangeStyle({ ...styleConfig, fgColor: p.fg, bgColor: p.bg })}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition ${
                      styleConfig.fgColor === p.fg
                        ? 'border-blue-500 bg-blue-50/50 text-blue-900 font-semibold ring-1 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: p.fg }}
                    />
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>

              {/* Custom Color Input */}
              <div className="flex items-center gap-3 pt-1 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <span className="text-slate-600 font-medium">Color QR:</span>
                  <input
                    type="color"
                    value={styleConfig.fgColor}
                    onChange={(e) => onChangeStyle({ ...styleConfig, fgColor: e.target.value })}
                    className="w-6 h-6 rounded-md border border-slate-300 cursor-pointer p-0.5"
                  />
                  <span className="font-mono text-[11px] text-slate-500 uppercase">{styleConfig.fgColor}</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <span className="text-slate-600 font-medium">Fondo:</span>
                  <input
                    type="color"
                    value={styleConfig.bgColor}
                    onChange={(e) => onChangeStyle({ ...styleConfig, bgColor: e.target.value })}
                    className="w-6 h-6 rounded-md border border-slate-300 cursor-pointer p-0.5"
                  />
                  <span className="font-mono text-[11px] text-slate-500 uppercase">{styleConfig.bgColor}</span>
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-3 animate-in fade-in duration-150">
              {/* Center icon selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                  Ícono decorativo central
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => onChangeStyle({ ...styleConfig, centerIcon: 'none' })}
                    className={`py-1.5 px-2 rounded-lg border text-center transition ${
                      styleConfig.centerIcon === 'none'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Sin ícono
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeStyle({ ...styleConfig, centerIcon: 'link' })}
                    className={`py-1.5 px-2 rounded-lg border text-center transition ${
                      styleConfig.centerIcon === 'link'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    🔗 Enlace
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeStyle({ ...styleConfig, centerIcon: 'wifi' })}
                    className={`py-1.5 px-2 rounded-lg border text-center transition ${
                      styleConfig.centerIcon === 'wifi'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    📶 Wi-Fi
                  </button>
                </div>
              </div>

              {/* Error correction level */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Corrección de errores: <span className="font-normal text-slate-400">(Mayor nivel permite lectura con logo o daños)</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
                  {(['L', 'M', 'Q', 'H'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => onChangeStyle({ ...styleConfig, errorCorrectionLevel: lvl })}
                      className={`py-1 rounded-md border text-center transition ${
                        styleConfig.errorCorrectionLevel === lvl
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {lvl} {lvl === 'H' ? '(30%)' : lvl === 'Q' ? '(25%)' : lvl === 'M' ? '(15%)' : '(7%)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-5 border-t border-slate-100 space-y-2 mt-4">
        {/* Main download PNG & SVG buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            id="download-png-btn"
            type="button"
            disabled={!hasPayload}
            onClick={handleDownloadPng}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:pointer-events-none text-white font-semibold text-xs shadow-xs transition active:scale-98"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar PNG</span>
          </button>
          <button
            id="download-svg-btn"
            type="button"
            disabled={!hasPayload}
            onClick={handleDownloadSvg}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-700 font-semibold text-xs transition active:scale-98"
          >
            <FileCode className="w-3.5 h-3.5 text-slate-500" />
            <span>Descargar SVG</span>
          </button>
        </div>

        {/* Secondary share & copy buttons */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <button
            id="copy-qr-btn"
            type="button"
            disabled={!hasPayload}
            onClick={handleCopyImage}
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition disabled:opacity-40"
            title="Copiar imagen al portapapeles"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copiar</span>
              </>
            )}
          </button>

          {canShare ? (
            <button
              id="share-qr-btn"
              type="button"
              disabled={!hasPayload}
              onClick={handleShare}
              className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition disabled:opacity-40"
              title="Compartir mediante aplicaciones nativas"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Compartir</span>
            </button>
          ) : (
            <button
              id="share-qr-alt-btn"
              type="button"
              disabled={!hasPayload}
              onClick={() => {
                navigator.clipboard.writeText(payload);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition disabled:opacity-40"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copiar Texto</span>
            </button>
          )}

          <button
            id="save-history-btn"
            type="button"
            disabled={!hasPayload}
            onClick={handleSave}
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition disabled:opacity-40"
            title="Guardar en historial de esta app"
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-blue-700 font-semibold">Guardado</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                <span>Guardar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
