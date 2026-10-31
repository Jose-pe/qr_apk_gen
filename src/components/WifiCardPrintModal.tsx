import React, { useRef } from 'react';
import { Wifi, X, Printer, Download } from 'lucide-react';
import { WifiConfig, QRStyleConfig } from '../types';

interface WifiCardPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: WifiConfig;
  styleConfig: QRStyleConfig;
}

export const WifiCardPrintModal: React.FC<WifiCardPrintModalProps> = ({
  isOpen,
  onClose,
  config,
  styleConfig,
}) => {
  const printAreaRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        id="wifi-print-modal"
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto"
      >
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Printer className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-sm">Cartel Imprimible de Wi-Fi</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Print Preview Card */}
        <div className="p-6 bg-slate-100 flex justify-center">
          <div
            id="printable-wifi-card"
            ref={printAreaRef}
            className="w-full bg-white rounded-xl p-6 shadow-sm border border-slate-300 text-center space-y-4 print:border-none print:shadow-none print:p-0"
          >
            {/* Header Icon */}
            <div className="w-12 h-12 mx-auto rounded-full bg-indigo-600 text-white flex items-center justify-center">
              <Wifi className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Wi-Fi Gratis
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Escanea el código con tu cámara para conectarte
              </p>
            </div>

            {/* QR Canvas Clone container */}
            <div className="flex justify-center py-2">
              <div className="p-2 border-2 border-slate-900 rounded-xl inline-block bg-white">
                <canvas
                  id="print-qr-canvas"
                  ref={(canvas) => {
                    if (canvas && config.ssid) {
                      const qrPayload = `WIFI:T:${config.encryption};S:${config.ssid};P:${config.password};H:${config.hidden ? 'true' : 'false'};;`;
                      import('../utils/qrHelper').then(({ drawQRToCanvas }) => {
                        drawQRToCanvas(canvas, qrPayload, {
                          ...styleConfig,
                          width: 320,
                          centerIcon: 'wifi',
                        });
                      });
                    }
                  }}
                  className="w-44 h-44"
                />
              </div>
            </div>

            {/* WiFi Credential Details */}
            <div className="bg-slate-50 rounded-lg p-3 text-left border border-slate-200 text-xs space-y-1.5 font-sans">
              <div className="flex justify-between">
                <span className="text-slate-500">Red (SSID):</span>
                <span className="font-bold text-slate-900">{config.ssid}</span>
              </div>
              {config.encryption !== 'nopass' && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Contraseña:</span>
                  <span className="font-mono font-bold text-slate-900">{config.password || '(Sin clave)'}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Seguridad:</span>
                <span className="text-slate-700 font-medium">
                  {config.encryption === 'nopass' ? 'Red Abierta' : config.encryption}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-tight">
              Compatible con dispositivos Android y iPhone
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
          >
            Cerrar
          </button>
          <button
            id="print-card-action-btn"
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Cartel</span>
          </button>
        </div>
      </div>
    </div>
  );
};
