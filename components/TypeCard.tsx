import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { TransactionType } from '../types';

interface TypeCardProps {
  type: TransactionType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  index: number;
}

const TypeCard: React.FC<TypeCardProps> = ({ type, isSelected, onSelect, index }) => {
  const Icon = type.icon;

  return (
    <button
      onClick={() => onSelect(type.id)}
      style={{ 
        animationDelay: `${index * 80}ms`, 
        animationFillMode: 'forwards' 
      }}
      className={`group relative flex flex-col h-full overflow-hidden rounded-2xl p-7 text-left transition-all duration-500 focus:outline-none opacity-0 animate-fade-in-up border shadow-sm
        ${
          isSelected
            ? 'bg-slate-900 border-slate-900 ring-2 ring-slate-900 ring-offset-2'
            : 'bg-white/80 border-slate-200 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 glass'
        }
      `}
    >
      {/* Decorative Background Element */}
      <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full blur-3xl transition-opacity duration-500 ${isSelected ? 'bg-blue-500/20 opacity-100' : 'bg-blue-100 opacity-0 group-hover:opacity-100'}`}></div>

      <div className="relative z-10 w-full flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-500 transform group-hover:scale-110
            ${isSelected 
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40' 
                : 'bg-blue-50 text-blue-600 border border-blue-100'
            }`}
          >
            <Icon className="h-7 w-7" />
          </div>

          <div className={`rounded-full p-2 transition-all duration-300 ${isSelected ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50'}`}>
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
        
        <h3 className={`text-xl font-bold tracking-tight mb-3 transition-colors duration-300 ${isSelected ? 'text-white' : 'text-slate-900 group-hover:text-blue-600'}`}>
          {type.title}
        </h3>
        
        <p className={`text-sm leading-relaxed transition-colors duration-300 line-clamp-3 mb-6 flex-grow ${isSelected ? 'text-blue-100/80' : 'text-slate-500 group-hover:text-slate-600'}`}>
          {type.description}
        </p>

        <div className={`flex items-center gap-2 mt-auto pt-5 border-t transition-colors duration-500 ${isSelected ? 'border-white/10' : 'border-slate-100 group-hover:border-blue-100'}`}>
          <div className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-blue-400 animate-pulse' : 'bg-slate-300 group-hover:bg-blue-500'}`}></div>
          <span className={`text-[10px] font-bold uppercase tracking-[0.15em] transition-colors duration-300 ${isSelected ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-600'}`}>
            {isSelected ? 'Active Selection' : 'Access Dashboard'}
          </span>
        </div>
      </div>
    </button>
  );
};

export default TypeCard;