
import React, { useState } from 'react';
import { Gift } from '../types';
import GiftCard from './GiftCard';

interface GuestViewProps {
  gifts: Gift[];
  hostPhone: string;
  onClaimGift: (id: string, name: string) => void;
  onReleaseGift: (id: string) => void;
}

const GuestView: React.FC<GuestViewProps> = ({ gifts, hostPhone, onClaimGift, onReleaseGift }) => {
  const [filter, setFilter] = useState<'all' | 'available' | 'claimed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGifts = gifts.filter(gift => {
    const matchesSearch = gift.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'available') return matchesSearch && !gift.isClaimed;
    if (filter === 'claimed') return matchesSearch && gift.isClaimed;
    return matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-3xl shadow-sm border border-gray-50">
        <div className="flex space-x-1">
          {['all', 'available', 'claimed'].map((f) => (
            <button 
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === f ? 'bg-pink-400 text-white' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              {f === 'all' ? 'Todos' : f === 'available' ? 'Libres' : 'Elegidos'}
            </button>
          ))}
        </div>
        
        <div className="relative">
          <input 
            type="text" 
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-48 pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-100 outline-none"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGifts.map(gift => (
          <GiftCard 
            key={gift.id} 
            gift={gift} 
            hostPhone={hostPhone}
            onClaim={(name) => onClaimGift(gift.id, name)} 
            onRelease={() => onReleaseGift(gift.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default GuestView;
