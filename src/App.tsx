/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Globe, Wifi, History, Sparkles, Smartphone, Download, QrCode } from 'lucide-react';
import { QRType, WifiConfig, QRStyleConfig, QRHistoryItem } from './types';
import { formatWifiPayload } from './utils/qrHelper';
import { Navbar } from './components/Navbar';
import { UrlQrForm } from './components/UrlQrForm';
import { WifiQrForm } from './components/WifiQrForm';
import { QRPreviewCard } from './components/QRPreviewCard';
import { WifiCardPrintModal } from './components/WifiCardPrintModal';
import { QRHistoryList } from './components/QRHistoryList';
import { OfflineBanner } from './components/OfflineBanner';
import { usePWAInstall } from './hooks/usePWAInstall';

const LOCAL_STORAGE_KEY = 'qr_apk_history_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'url' | 'wifi' | 'history'>('url');
  
  // URL Form state
  const [urlInput, setUrlInput] = useState('https://google.com');

  // WiFi Form state
  const [wifiConfig, setWifiConfig] = useState<WifiConfig>({
    ssid: 'MiRed_WiFi',
    password: '',
    encryption: 'WPA',
    hidden: false,
  });

  // QR Style configuration
  const [styleConfig, setStyleConfig] = useState<QRStyleConfig>({
    fgColor: '#0f172a',
    bgColor: '#ffffff',
    margin: 2,
    errorCorrectionLevel: 'M',
    centerIcon: 'none',
    width: 250,
  });

  // History state
  const [history, setHistory] = useState<QRHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Print modal state for Wi-Fi card
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const { isInstallable, isInstalled, install } = usePWAInstall();

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to persist history', e);
    }
  }, [history]);

  // Compute current active payload
  const currentPayload = React.useMemo(() => {
    if (activeTab === 'wifi') {
      return wifiConfig.ssid.trim() ? formatWifiPayload(wifiConfig) : '';
    }
    return urlInput.trim();
  }, [activeTab, wifiConfig, urlInput]);

  // Compute current title
  const currentTitle = React.useMemo(() => {
    if (activeTab === 'wifi') {
      return wifiConfig.ssid.trim() ? `Wi-Fi: ${wifiConfig.ssid}` : 'Red Wi-Fi';
    }
    return urlInput.trim() ? urlInput.trim() : 'Enlace Web';
  }, [activeTab, wifiConfig, urlInput]);

  // Auto-switch center icon suggestion when switching tabs
  const handleTabChange = (newTab: 'url' | 'wifi' | 'history') => {
    setActiveTab(newTab);
    if (newTab === 'wifi' && styleConfig.centerIcon === 'link') {
      setStyleConfig((prev) => ({ ...prev, centerIcon: 'wifi' }));
    } else if (newTab === 'url' && styleConfig.centerIcon === 'wifi') {
      setStyleConfig((prev) => ({ ...prev, centerIcon: 'link' }));
    }
  };

  const handleSaveToHistory = () => {
    if (!currentPayload) return;

    const newItem: QRHistoryItem = {
      id: Date.now().toString(),
      type: activeTab === 'wifi' ? 'wifi' : 'url',
      title: currentTitle,
      payload: currentPayload,
      createdAt: Date.now(),
      fgColor: styleConfig.fgColor,
      bgColor: styleConfig.bgColor,
      wifiDetails:
        activeTab === 'wifi'
          ? {
              ssid: wifiConfig.ssid,
              encryption: wifiConfig.encryption,
            }
          : undefined,
    };

    setHistory((prev) => [newItem, ...prev.filter((i) => i.payload !== currentPayload)].slice(0, 30));
  };

  const handleSelectHistoryItem = (item: QRHistoryItem) => {
    if (item.type === 'wifi') {
      setActiveTab('wifi');
      if (item.wifiDetails) {
        setWifiConfig((prev) => ({
          ...prev,
          ssid: item.wifiDetails!.ssid,
          encryption: item.wifiDetails!.encryption,
        }));
      }
    } else {
      setActiveTab('url');
      setUrlInput(item.payload);
    }
    setStyleConfig((prev) => ({
      ...prev,
      fgColor: item.fgColor || prev.fgColor,
      bgColor: item.bgColor || prev.bgColor,
    }));
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 pb-20 md:pb-8">
      {/* Offline Connectivity Banner */}
      <OfflineBanner />

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onChangeTab={handleTabChange}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 space-y-6">
        
        {/* Mobile Tab Selector */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/70 rounded-2xl md:hidden">
          <button
            onClick={() => handleTabChange('url')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'url'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Enlaces</span>
          </button>
          <button
            onClick={() => handleTabChange('wifi')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'wifi'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wifi className="w-4 h-4" />
            <span>Wi-Fi</span>
          </button>
          <button
            onClick={() => handleTabChange('history')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'history'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Historial ({history.length})</span>
          </button>
        </div>

        {/* APK Promo Banner if installable */}
        {isInstallable && !isInstalled && (
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-2xl p-4 sm:p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/15 rounded-xl backdrop-blur-xs shrink-0">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base leading-tight">
                  Instala esta aplicación como APK en tu móvil
                </h3>
                <p className="text-blue-100 text-xs mt-0.5">
                  Genera códigos QR de enlaces y Wi-Fi sin conexión a internet y desde la pantalla de inicio.
                </p>
              </div>
            </div>
            <button
              onClick={install}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs shadow-xs transition active:scale-95 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Instalar APK / App</span>
            </button>
          </div>
        )}

        {/* View Switcher */}
        {activeTab === 'history' ? (
          <QRHistoryList
            items={history}
            onSelect={handleSelectHistoryItem}
            onDelete={handleDeleteHistoryItem}
            onClearAll={handleClearHistory}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Form: URL or Wi-Fi */}
            <div className="lg:col-span-7 space-y-4">
              {activeTab === 'url' ? (
                <UrlQrForm
                  url={urlInput}
                  onChangeUrl={setUrlInput}
                  onGenerate={() => {}}
                />
              ) : (
                <WifiQrForm
                  config={wifiConfig}
                  onChangeConfig={setWifiConfig}
                  onOpenPrintModal={() => setIsPrintModalOpen(true)}
                />
              )}
            </div>

            {/* Right Preview & Actions */}
            <div className="lg:col-span-5">
              <div className="sticky top-20">
                <QRPreviewCard
                  type={activeTab}
                  title={currentTitle}
                  payload={currentPayload}
                  styleConfig={styleConfig}
                  onChangeStyle={setStyleConfig}
                  onSaveToHistory={handleSaveToHistory}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* WiFi Card Print Modal */}
      <WifiCardPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        config={wifiConfig}
        styleConfig={styleConfig}
      />

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-6 flex items-center justify-around md:hidden shadow-lg">
        <button
          onClick={() => handleTabChange('url')}
          className={`flex flex-col items-center gap-1 py-1 px-3 text-[11px] font-medium transition ${
            activeTab === 'url' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Globe className="w-5 h-5" />
          <span>Enlaces</span>
        </button>

        <button
          onClick={() => handleTabChange('wifi')}
          className={`flex flex-col items-center gap-1 py-1 px-3 text-[11px] font-medium transition ${
            activeTab === 'wifi' ? 'text-indigo-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Wifi className="w-5 h-5" />
          <span>Wi-Fi</span>
        </button>

        <button
          onClick={() => handleTabChange('history')}
          className={`flex flex-col items-center gap-1 py-1 px-3 text-[11px] font-medium transition relative ${
            activeTab === 'history' ? 'text-slate-900 font-bold' : 'text-slate-500'
          }`}
        >
          <History className="w-5 h-5" />
          <span>Historial</span>
          {history.length > 0 && (
            <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-blue-600" />
          )}
        </button>
      </nav>
    </div>
  );
}
