
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
        description: existing?.description || 'Un regalo lleno de amor para el bebé.',
        category: 'General',
        isClaimed: existing?.isClaimed || false,
        claimedBy: existing?.claimedBy
      };
    });
    onUpdateGifts(newGifts);
    alert('✅ Paso 1 y 2 completados. ¡Tu lista está lista para ser compartida!');
  };

  const generateShareLink = () => {
    if (gifts.length === 0) {
      alert('⚠️ Primero debes agregar regalos en el Paso 2 y darle a "Guardar".');
      return;
    }
    const data = btoa(JSON.stringify({ gifts, settings }));
    const url = `${window.location.origin}${window.location.pathname}?d=${data}`;
    
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const claimedGifts = gifts.filter(g => g.isClaimed);

  return (
    <div className="space-y-10 animate-fade-in max-w-2xl mx-auto">
      
      <div className="text-center mb-4">
        <h2 className="text-2xl font-black text-gray-800">Guía de Configuración</h2>
        <p className="text-gray-500 text-sm">Sigue estos 3 pasos para poner en marcha tu Baby Shower</p>
      </div>

      {/* PASO 1: DATOS */}
      <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative">
        <div className="absolute -top-4 -left-4 w-10 h-10 bg-pink-400 text-white rounded-full flex items-center justify-center font-black shadow-lg">1</div>
        <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
          Configura los Detalles
        </h2>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">¿Quién es el protagonista?</label>
            <input 
              type="text" 
              value={settings.babyName}
              onChange={(e) => onUpdateSettings({ ...settings, babyName: e.target.value })}
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none font-bold text-gray-700"
              placeholder="Ej: Baby Martina"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Tu WhatsApp (Donde recibirás los avisos)</label>
            <input 
              type="text" 
              value={settings.hostPhone}
              onChange={(e) => onUpdateSettings({ ...settings, hostPhone: e.target.value })}
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none font-bold text-gray-700"
              placeholder="Ej: 573001234567"
            />
            <p className="text-[10px] text-gray-400 mt-1 ml-1">Incluye el código de país sin el símbolo +</p>
          </div>
        </div>
      </section>

      {/* PASO 2: REGALOS */}
      <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative">
        <div className="absolute -top-4 -left-4 w-10 h-10 bg-pink-400 text-white rounded-full flex items-center justify-center font-black shadow-lg">2</div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">Crea tu Lista de Regalos</h2>
        <p className="text-xs text-gray-400 mb-6">Escribe un nombre por línea. No te preocupes por el orden.</p>
        <textarea 
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          rows={8}
          className="w-full px-6 py-6 bg-gray-50 border-none rounded-[2rem] focus:ring-2 focus:ring-pink-200 outline-none font-medium text-gray-700 leading-relaxed mb-4"
          placeholder="Ej:&#10;Pañales Etapa 1&#10;Bañera azul&#10;Set de teteros"
        />
        <button 
          onClick={handleSaveGifts} 
          className="w-full py-4 bg-gray-800 text-white font-black rounded-2xl hover:bg-gray-900 transition-all active:scale-95 shadow-xl shadow-gray-100"
        >
          Guardar Lista y Datos
        </button>
      </section>

      {/* PASO 3: COMPARTIR */}
      <section className="bg-blue-600 p-8 rounded-[2.5rem] shadow-2xl text-white relative">
        <div className="absolute -top-4 -left-4 w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center font-black shadow-lg border-4 border-blue-600">3</div>
        <div className="text-center">
          <h2 className="text-xl font-black mb-2">¡Lanzamiento!</h2>
          <p className="text-blue-100 text-sm mb-6">
            Presiona el botón para copiar el link. Luego ve a WhatsApp y pégalo en el grupo de invitados.
          </p>
          <button 
            onClick={generateShareLink} 
            className={`w-full py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-xl ${
              copied ? 'bg-green-400 scale-95' : 'bg-white text-blue-600 hover:bg-blue-50'
            }`}
          >
            {copied ? (
              <><span className="text-xl">✅</span> ¡Link Copiado!</>
            ) : (
              <><span className="text-xl">🔗</span> Obtener Link para Invitados</>
            )}
          </button>
          {copied && (
            <p className="mt-4 text-[10px] font-bold text-blue-200 animate-pulse uppercase tracking-widest">
              ¡Listo! Ahora ve a WhatsApp y pega el mensaje
            </p>
          )}
        </div>
      </section>

      {/* SECCIÓN DE CONTROL FINAL (DASHBOARD) */}
      <section className="bg-gray-50 p-8 rounded-[2.5rem] border border-dashed border-gray-200">
        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 text-center">Control de Reservas Actuales</h2>
        {claimedGifts.length > 0 ? (
          <div className="space-y-3">
            {claimedGifts.map(gift => (
              <div key={gift.id} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm">
                <div>
                  <p className="text-sm font-black text-gray-800">{gift.name}</p>
                  <p className="text-[10px] text-pink-500 font-bold uppercase">Reservado por: {gift.claimedBy}</p>
                </div>
                <button 
                  onClick={() => { if(confirm('¿Quieres liberar este regalo?')) onUpdateGifts(gifts.map(g => g.id === gift.id ? {...g, isClaimed: false, claimedBy: undefined} : g)) }}
                  className="text-[10px] font-black text-gray-300 hover:text-red-500 transition-colors"
                >
                  Liberar
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-300 text-xs italic">Aún no hay regalos reservados.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminView;
