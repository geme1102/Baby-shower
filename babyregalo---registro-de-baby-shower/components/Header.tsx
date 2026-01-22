
import React from 'react';
import { ViewMode } from '../types';

interface HeaderProps {
  babyName: string;
  viewMode: ViewMode;
  onToggleMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ babyName, viewMode, onToggleMode }) => {
  return (
    <header className="relative bg-gradient-to-b from-pink-100 to-white pt-12 pb-8 px-4 text-center overflow-hidden">
      {/* Blobs decorativos */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="relative z-10">
        <div className="inline-block p-2 bg-white rounded-full shadow-sm mb-4">
          <span className="text-3xl">🍼</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Baby Shower de {babyName}</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          {viewMode === ViewMode.ADMIN 
            ? 'Panel de control: Gestiona la lista de regalos.' 
            : '¡Gracias por acompañarnos! Elige un detalle para el nuevo integrante de la familia.'}
        </p>

        <button 
          onClick={onToggleMode}
          className={`mt-6 text-xs font-semibold uppercase tracking-widest transition-all border px-4 py-1.5 rounded-full shadow-sm flex items-center mx-auto gap-2 ${
            viewMode === ViewMode.ADMIN 
            ? 'text-gray-500 border-gray-200 bg-gray-50 hover:bg-gray-100' 
            : 'text-pink-400 border-pink-200 bg-white hover:text-pink-600'
          }`}
        >
          {viewMode === ViewMode.ADMIN ? (
            <><span>🔓</span> Salir de Edición</>
          ) : (
            <><span>🔒</span> Panel de Organizador</>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
