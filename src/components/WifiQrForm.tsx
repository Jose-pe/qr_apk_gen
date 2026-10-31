import React, { useState } from 'react';
import { Wifi, Eye, EyeOff, Shield, Lock, Printer, HelpCircle, AlertTriangle } from 'lucide-react';
import { WifiConfig, WifiEncryption } from '../types';

interface WifiQrFormProps {
  config: WifiConfig;
  onChangeConfig: (newConfig: WifiConfig) => void;
  onOpenPrintModal: () => void;
}

export const WifiQrForm: React.FC<WifiQrFormProps> = ({
  config,
  onChangeConfig,
  onOpenPrintModal,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleEncryptionChange = (encryption: WifiEncryption) => {
    onChangeConfig({
      ...config,
      encryption,
      password: encryption === 'nopass' ? '' : config.password,
    });
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-none">Código QR para Red Wi-Fi</h2>
            <p className="text-xs text-slate-500 mt-1">
              Permite conectarse al instante escaneando con la cámara del móvil
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenPrintModal}
          disabled={!config.ssid.trim()}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 text-xs font-medium transition disabled:opacity-40 disabled:pointer-events-none"
          title="Generar cartel imprimible para el negocio o el hogar"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Cartel para mesa</span>
        </button>
      </div>

      {/* Network Name (SSID) */}
      <div className="space-y-1.5">
        <label htmlFor="wifi-ssid" className="block text-xs font-semibold text-slate-700">
          Nombre de la red Wi-Fi (SSID) <span className="text-red-500">*</span>
        </label>
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <Wifi className="w-4 h-4" />
          </div>
          <input
            id="wifi-ssid"
            type="text"
            value={config.ssid}
            onChange={(e) => onChangeConfig({ ...config, ssid: e.target.value })}
            placeholder="Ej. MiWiFi_Casa o Cafe_Clientes"
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm text-slate-900 placeholder:text-slate-400 transition bg-slate-50/50 focus:bg-white"
          />
          {config.ssid && (
            <button
              id="clear-ssid-btn"
              type="button"
              onClick={() => onChangeConfig({ ...config, ssid: '' })}
              className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 text-xs"
              title="Borrar"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Security Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700">
          Tipo de Seguridad
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            id="sec-wpa"
            onClick={() => handleEncryptionChange('WPA')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition ${
              config.encryption === 'WPA'
                ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 font-semibold shadow-xs'
                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-600'
            }`}
          >
            <Shield className="w-4 h-4 mb-1 text-indigo-600" />
            <span>WPA / WPA2 / WPA3</span>
            <span className="text-[10px] text-slate-400 font-normal mt-0.5">Estándar común</span>
          </button>

          <button
            type="button"
            id="sec-wep"
            onClick={() => handleEncryptionChange('WEP')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition ${
              config.encryption === 'WEP'
                ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 font-semibold shadow-xs'
                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-600'
            }`}
          >
            <Lock className="w-4 h-4 mb-1 text-indigo-600" />
            <span>WEP</span>
            <span className="text-[10px] text-slate-400 font-normal mt-0.5">Redes antiguas</span>
          </button>

          <button
            type="button"
            id="sec-nopass"
            onClick={() => handleEncryptionChange('nopass')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition ${
              config.encryption === 'nopass'
                ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 font-semibold shadow-xs'
                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-600'
            }`}
          >
            <span className="text-base mb-0.5">🔓</span>
            <span>Abierta</span>
            <span className="text-[10px] text-slate-400 font-normal mt-0.5">Sin contraseña</span>
          </button>
        </div>
      </div>

      {/* Password (if not open) */}
      {config.encryption !== 'nopass' && (
        <div className="space-y-1.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <label htmlFor="wifi-password" className="block text-xs font-semibold text-slate-700">
              Contraseña de la red Wi-Fi <span className="text-red-500">*</span>
            </label>
            {config.password.length > 0 && config.password.length < 8 && config.encryption === 'WPA' && (
              <span className="text-[11px] text-amber-600 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Mínimo 8 caracteres recomendado
              </span>
            )}
          </div>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-slate-400 pointer-events-none">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="wifi-password"
              type={showPassword ? 'text' : 'password'}
              value={config.password}
              onChange={(e) => onChangeConfig({ ...config, password: e.target.value })}
              placeholder="Contraseña del router"
              className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm text-slate-900 placeholder:text-slate-400 transition bg-slate-50/50 focus:bg-white"
            />
            <button
              id="toggle-wifi-pass-btn"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
              title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Hidden Network Checkbox */}
      <div className="pt-1">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            id="wifi-hidden-checkbox"
            type="checkbox"
            checked={config.hidden}
            onChange={(e) => onChangeConfig({ ...config, hidden: e.target.checked })}
            className="w-4 h-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <div className="text-xs">
            <span className="font-medium text-slate-700">Esta es una red oculta</span>
            <span className="text-slate-400 block sm:inline sm:ml-1.5">(El router no emite el SSID públicamente)</span>
          </div>
        </label>
      </div>

      {/* How it works banner */}
      <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3.5 flex gap-2.5 text-xs text-indigo-900">
        <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Al escanear este código QR con la cámara de un móvil (Android o iPhone), aparecerá el mensaje: 
          <strong> «¿Conectarse a la red {config.ssid || 'Wi-Fi'}?»</strong> sin necesidad de escribir la contraseña manualmente.
        </p>
      </div>

      {/* Mobile only trigger for print modal */}
      <button
        type="button"
        onClick={onOpenPrintModal}
        disabled={!config.ssid.trim()}
        className="w-full sm:hidden flex items-center justify-center gap-2 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 text-xs font-semibold transition disabled:opacity-40 disabled:pointer-events-none"
      >
        <Printer className="w-4 h-4" />
        <span>Crear cartel imprimible para mesa</span>
      </button>
    </div>
  );
};
