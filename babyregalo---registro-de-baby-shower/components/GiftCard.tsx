
import React, { useState } from 'react';
import { Gift } from '../types';

interface GiftCardProps {
  gift: Gift;
  hostPhone: string;
  onClaim: (guestName: string) => void;
  onRelease: () => void;
}

const GiftCard: React.FC<GiftCardProps> = ({ gift, hostPhone, onClaim, onRelease }) => {
  const [isModaling, setIsModaling] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    onClaim(guestName.trim());
    setIsModaling(false);
    setShowConfirmation(true);
  };

  const sendWhatsApp = () => {
    const message = `¡Hola! Soy ${guestName}, acabo de reservar el regalo "${gift.name}" para el Baby Shower. ¡Cuenta con ello! 🍼`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${hostPhone}?text=${encoded}`, '_blank');
    setShowConfirmation(false);
  };

  return (
    <>
      <div className={`p-6 rounded-[2.5rem] transition-all border-2 ${gift.isClaimed ? 'bg-gray-50 border-gray-100' : 'bg-white border-white shadow-sm hover:shadow-xl hover:-translate-y-1'}`}>
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start mb-6">
            <div className={`w-14 h-14 flex items-center justify-center rounded-3xl text-3xl ${gift.isClaimed ? 'bg-gray-200' : 'bg-pink-50 text-pink-400'}`}>
              {gift.isClaimed ? '🧸' : '🎁'}
            </div>
            {gift.isClaimed && (
              <span className="bg-gray-200 text-gray-500 text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full">
                No disponible
              </span>
            )}
          </div>

          <h3 className={`text-xl font-black mb-2 ${gift.isClaimed ? 'text-gray-300' : 'text-gray-800'}`}>
            {gift.name}
          </h3>
          <p className={`text-sm mb-8 leading-relaxed ${gift.isClaimed ? 'text-gray-300' : 'text-gray-500'}`}>
            {gift.description}
          </p>

          <div className="mt-auto">
            {gift.isClaimed ? (
              <div className="bg-white/50 p-3 rounded-2xl border border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 italic">Este regalo ya fue elegido</span>
                <button onClick={onRelease} className="text-[10px] font-bold text-pink-200 hover:text-pink-400 uppercase">¿Fui yo?</button>
              </div>
            ) : (
              <button 
                onClick={() => setIsModaling(true)}
                className="w-full py-4 bg-pink-400 text-white rounded-[1.5rem] font-black text-sm hover:bg-pink-500 transition-all shadow-lg shadow-pink-100 active:scale-95"
              >
                ¡Yo lo quiero dar!
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Reserva */}
      {isModaling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-900/10 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm p-10 rounded-[3rem] shadow-2xl animate-pop-in border border-pink-50">
            <h3 className="text-2xl font-black text-gray-800 mb-2">¡Excelente!</h3>
            <p className="text-sm text-gray-500 mb-8">Escribe tu nombre para reservarlo:</p>
            <form onSubmit={handleClaimSubmit}>
              <input 
                autoFocus
                type="text" 
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Tu nombre aquí"
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-pink-100 outline-none mb-6 text-center font-bold"
                required
              />
              <div className="flex flex-col gap-3">
                <button type="submit" className="w-full py-4 bg-pink-400 text-white font-black rounded-2xl hover:bg-pink-500 shadow-lg shadow-pink-100">
                  Confirmar Reserva
                </button>
                <button type="button" onClick={() => setIsModaling(false)} className="w-full py-2 text-gray-300 text-xs font-bold">
                  Cerrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Notificación WhatsApp */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-green-900/20 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm p-10 rounded-[3rem] shadow-2xl animate-pop-in text-center">
            <div className="text-5xl mb-4">📱</div>
            <h3 className="text-2xl font-black text-gray-800 mb-4">¡Casi listo!</h3>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              Para que el organizador sepa que tú darás este regalo, presiona el botón para enviarle un aviso por WhatsApp.
            </p>
            <button 
              onClick={sendWhatsApp}
              className="w-full py-4 bg-green-500 text-white font-black rounded-2xl hover:bg-green-600 shadow-lg shadow-green-100 flex items-center justify-center gap-2"
            >
              <span>Avisar por WhatsApp</span>
            </button>
            <button onClick={() => setShowConfirmation(false)} className="mt-4 text-xs font-bold text-gray-300">
              Lo haré después
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GiftCard;
