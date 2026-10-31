import React from 'react';
import { History, Globe, Wifi, Trash2, ArrowUpRight, Copy } from 'lucide-react';
import { QRHistoryItem } from '../types';

interface QRHistoryListProps {
  items: QRHistoryItem[];
  onSelect: (item: QRHistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export const QRHistoryList: React.FC<QRHistoryListProps> = ({
  items,
  onSelect,
  onDelete,
  onClearAll,
}) => {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200/80 text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <History className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">Historial vacío</h3>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Los códigos QR que generes y guardes aparecerán aquí para reutilizarlos en cualquier momento.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-slate-600" />
          <h3 className="text-sm font-bold text-slate-900">Historial de Códigos Guardados</h3>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {items.length}
          </span>
        </div>
        <button
          onClick={onClearAll}
          className="text-xs text-red-600 hover:text-red-700 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Borrar todo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl border border-slate-200/80 hover:border-blue-400 hover:bg-blue-50/20 transition group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-lg ${
                      item.type === 'wifi'
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'bg-blue-50 text-blue-600'
                    }`}
                  >
                    {item.type === 'wifi' ? (
                      <Wifi className="w-4 h-4" />
                    ) : (
                      <Globe className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {item.type === 'wifi' ? 'Red Wi-Fi' : 'Enlace Web'}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-900 truncate max-w-[140px] sm:max-w-[170px]">
                      {item.title}
                    </h4>
                  </div>
                </div>

                <button
                  onClick={() => onDelete(item.id)}
                  className="text-slate-300 hover:text-red-500 p-1 rounded-md transition opacity-0 group-hover:opacity-100"
                  title="Eliminar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[11px] font-mono text-slate-500 truncate mt-2 bg-slate-50 p-1.5 rounded-md">
                {item.payload}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-400">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => onSelect(item)}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                <span>Cargar</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
