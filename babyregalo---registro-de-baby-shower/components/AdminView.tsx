
import React, { useState } from 'react';
import { Gift, AppSettings } from '../types';

interface AdminViewProps {
  gifts: Gift[];
  onUpdateGifts: (gifts: Gift[]) => void;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ gifts, onUpdateGifts, settings, onUpdateSettings }) => {
  const [rawInput, setRawInput] = useState(gifts.map(g => g.name).join('\n'));
  const [copied, setCopied] = useState(false);

  const handleSaveGifts = () => {
    const lines = rawInput.split('\n').filter(line => line.trim() !== '');
    const newGifts: Gift[] = lines.map((name, index) => {
      const existing = gifts.find(g => g.name.toLowerCase() === name.toLowerCase().trim());
      return {
        id: existing?.id || `gift-${Date.now()}-${index}`,
        name: name.trim(),
        description: existing?.description || 'Detalle especial para el bebé',
        category: 'General',
        isClaimed: existing?.isClaimed || false,
        claimedBy: existing?.claimedBy
      };
    });
    onUpdateGifts(newGifts);
    alert('¡Lista guardada correctamente! Ahora puedes copiar el link para tus invitados.');
  };

  const generateShareLink = () => {
    // Empaquetamos todo el estado actual en el link
    const data = btoa(JSON.stringify({ gifts, settings }));
    const url = `${window.location.origin}${window.location.pathname}?d=${data}`;
    
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const claimedGifts = gifts.filter(g => g.isClaimed);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* SECCIÓN DE COMPARTIR - AHORA MÁS ARRIBA Y LLAMATIVA */}
      <section className="bg-blue-600 p-8 rounded-[2.5rem] shadow-xl text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-black mb-2">🚀 ¡Todo listo para compartir!</h2>
            <p className="text-blue-100 text-sm max-w-sm">
              Una vez que hayas guardado tus regalos, presiona el botón para obtener el link que enviarás a tus invitados.
            </p>
          </div>
          <button 
            onClick={generateShareLink} 
            className={`w-full md:w-auto px-8 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-lg ${
              copied ? 'bg-green-400 scale-95' : 'bg-white text-blue-600 hover:bg-blue-50'
            }`}
          >
            {copied ? (
              <><span className="text-xl">✅</span> ¡Link Copiado!</>
            ) : (
              <><span className="text-xl">🔗</span> Copiar Link Invitados</>
            )}
          </button>
        </div>
        {copied && (
          <p className="text-center mt-4 text-xs font-bold text-blue-200 animate-pulse">
            ¡Ya puedes pegarlo en WhatsApp!
          </p>
        )}
      </section>

      {/* Configuración */}
      <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-2">⚙️</span> Datos del Evento
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nombre del Bebé</label>
            <input 
              type="text" 
              value={settings.babyName}
              onChange={(e) => onUpdateSettings({ ...settings, babyName: e.target.value })}
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none font-bold"
              placeholder="Ej: Baby Martina"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Tu WhatsApp (Con código de país)</label>
            <input 
              type="text" 
              value={settings.hostPhone}
              onChange={(e) => onUpdateSettings({ ...settings, hostPhone: e.target.value })}
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none font-bold"
              placeholder="Ej: 573001234567"
            />
          </div>
        </div>
      </section>

      {/* Editor de Lista */}
      <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
          <span className="mr-2">📝</span> Lista de Regalos
        </h2>
        <p className="text-xs text-gray-400 mb-6 italic">Escribe un regalo por línea. Ejemplo: Pañales Etapa 1</p>
        <textarea 
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          rows={10}
          className="w-full px-6 py-6 bg-gray-50 border-none rounded-[2rem] focus:ring-2 focus:ring-pink-200 outline-none font-mono text-sm leading-relaxed"
          placeholder="Escribe aquí tus regalos..."
        />
        <button 
          onClick={handleSaveGifts} 
          className="w-full mt-6 py-4 bg-pink-400 text-white font-black rounded-2xl shadow-lg shadow-pink-100 hover:bg-pink-500 transition-all active:scale-95"
        >
          Guardar Cambios en la Lista
        </button>
      </section>

      {/* Resumen de Reservas */}
      <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-2">📊</span> Control de Reservas ({claimedGifts.length})
        </h2>
        {claimedGifts.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {claimedGifts.map(gift => (
              <div key={gift.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div>
                  <p className="text-sm font-black text-gray-800">{gift.name}</p>
                  <p className="text-xs text-pink-500 font-bold">Elegido por: {gift.claimedBy}</p>
                </div>
                <button 
                  onClick={() => { if(confirm('¿Quieres que este regalo vuelva a estar disponible?')) onUpdateGifts(gifts.map(g => g.id === gift.id ? {...g, isClaimed: false, claimedBy: undefined} : g)) }}
                  className="px-4 py-2 text-[10px] font-black uppercase text-gray-300 hover:text-red-500 transition-colors"
                >
                  Liberar
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-300 text-sm italic">Aquí aparecerá quién eligió cada regalo.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminView;
