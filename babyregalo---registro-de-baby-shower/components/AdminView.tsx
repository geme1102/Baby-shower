
import React, { useState } from 'react';
import { Gift, AppSettings } from '../types';

interface AdminViewProps {
  gifts: Gift[];
  onUpdateGifts: (gifts: Gift[]) => void;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
}

// Función para codificar Base64 con soporte para caracteres especiales (UTF-8)
const safeBtoa = (str: string) => {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
    return String.fromCharCode(parseInt(p1, 16));
  }));
};

const AdminView: React.FC<AdminViewProps> = ({ gifts, onUpdateGifts, settings, onUpdateSettings }) => {
  const [rawInput, setRawInput] = useState(gifts.map(g => g.name).join('\n'));
  const [copied, setCopied] = useState(false);

  const handleSaveGifts = () => {
    const lines = rawInput.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) {
      alert('⚠️ Por favor, escribe al menos un regalo.');
      return;
    }
    const newGifts: Gift[] = lines.map((name, index) => {
      // Intentamos mantener el estado de reserva si el nombre es igual
      const existing = gifts.find(g => g.name.toLowerCase() === name.toLowerCase().trim());
      return {
        id: existing?.id || `gift-${Date.now()}-${index}`,
        name: name.trim(),
        description: existing?.description || 'Un regalo lleno de amor para el bebé.',
        category: 'General',
        isClaimed: existing?.isClaimed || false,
        claimedBy: existing?.claimedBy
      };
    });
    onUpdateGifts(newGifts);
    alert('✅ Cambios guardados localmente. ¡IMPORTANTE: Ahora debes volver a copiar el link en el Paso 3 para que los invitados vean estos cambios!');
  };

  const generateShareLink = () => {
    if (gifts.length === 0) {
      alert('⚠️ Primero escribe los regalos en el Paso 2 y dale a "Guardar".');
      return;
    }
    
    // Codificar datos de forma segura para UTF-8
    const dataStr = JSON.stringify({ gifts, settings });
    const encodedData = safeBtoa(dataStr);
    
    const url = `${window.location.origin}${window.location.pathname}?d=${encodedData}`;
    
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const claimedGifts = gifts.filter(g => g.isClaimed);

  return (
    <div className="space-y-10 animate-fade-in max-w-2xl mx-auto">
      
      <div className="text-center mb-4">
        <h2 className="text-2xl font-black text-gray-800">Panel de Organizador</h2>
        <p className="text-gray-500 text-sm">Gestiona tu lista y obtén el link compartido.</p>
      </div>

      {/* PASO 1: DATOS */}
      <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative">
        <div className="absolute -top-4 -left-4 w-10 h-10 bg-pink-400 text-white rounded-full flex items-center justify-center font-black shadow-lg">1</div>
        <h2 className="text-lg font-bold text-gray-800 mb-6">Información Básica</h2>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nombre del Bebé</label>
            <input 
              type="text" 
              value={settings.babyName}
              onChange={(e) => onUpdateSettings({ ...settings, babyName: e.target.value })}
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none font-bold text-gray-700"
              placeholder="Ej: Baby Martina"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Tu WhatsApp (Sin símbolos)</label>
            <input 
              type="text" 
              value={settings.hostPhone}
              onChange={(e) => onUpdateSettings({ ...settings, hostPhone: e.target.value })}
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none font-bold text-gray-700"
              placeholder="Ej: 573001234567"
            />
          </div>
        </div>
      </section>

      {/* PASO 2: REGALOS */}
      <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative">
        <div className="absolute -top-4 -left-4 w-10 h-10 bg-pink-400 text-white rounded-full flex items-center justify-center font-black shadow-lg">2</div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">Lista de Regalos</h2>
        <p className="text-xs text-gray-400 mb-6 italic">Escribe un nombre por línea (admite ñ, tildes y emojis).</p>
        <textarea 
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          rows={10}
          className="w-full px-6 py-6 bg-pink-50/30 border-2 border-dashed border-pink-100 rounded-[2rem] focus:ring-2 focus:ring-pink-200 focus:bg-white outline-none font-medium text-gray-700 mb-4 transition-all"
          placeholder="Pañales Etapa 1&#10;Bañera para bebé&#10;Kit de aseo"
        />
        <button 
          onClick={handleSaveGifts} 
          className="w-full py-4 bg-pink-500 text-white font-black rounded-2xl hover:bg-pink-600 transition-all active:scale-95 shadow-xl shadow-pink-100"
        >
          Guardar Cambios en la Lista
        </button>
      </section>

      {/* PASO 3: COMPARTIR */}
      <section className="bg-blue-600 p-8 rounded-[2.5rem] shadow-2xl text-white relative">
        <div className="absolute -top-4 -left-4 w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center font-black shadow-lg border-4 border-blue-600">3</div>
        <div className="text-center">
          <h2 className="text-xl font-black mb-2">¡Compartir con Invitados!</h2>
          <p className="text-blue-100 text-sm mb-6">
            Este link lleva toda la información de tus regalos guardados.
          </p>
          <button 
            onClick={generateShareLink} 
            className={`w-full py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-xl ${
              copied ? 'bg-green-400 scale-95' : 'bg-white text-blue-600 hover:bg-blue-50'
            }`}
          >
            {copied ? '✅ ¡Link Copiado Correctamente!' : '🔗 Copiar Link de Invitados'}
          </button>
          {copied && (
            <p className="mt-4 text-xs text-blue-200 animate-pulse font-bold">
              ¡Listo! Pégalo ahora en WhatsApp para tus invitados.
            </p>
          )}
        </div>
      </section>

      {/* PANEL DE CONTROL */}
      <section className="bg-gray-50 p-8 rounded-[2.5rem] border border-dashed border-gray-200">
        <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 text-center">Gestión de Reservas</h2>
        {claimedGifts.length > 0 ? (
          <div className="space-y-3">
            {claimedGifts.map(gift => (
              <div key={gift.id} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm">
                <div>
                  <p className="text-sm font-black text-gray-800">{gift.name}</p>
                  <p className="text-[10px] text-pink-500 font-bold uppercase">De: {gift.claimedBy}</p>
                </div>
                <button 
                  onClick={() => onUpdateGifts(gifts.map(g => g.id === gift.id ? {...g, isClaimed: false, claimedBy: undefined} : g))}
                  className="text-[10px] font-black text-red-300 hover:text-red-500 transition-colors"
                >
                  Liberar
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-300 text-xs italic">Nadie ha reservado regalos todavía.</p>
        )}
      </section>
    </div>
  );
};

export default AdminView;
