import React from 'react';
import { ShieldCheck, Globe, Lock, Cpu } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative mt-20 border-t border-slate-200 bg-white py-20 overflow-hidden">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-60"></div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
               <ShieldCheck className="w-8 h-8 text-blue-600" />
               <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">GovAuditor</span>
            </div>
            <p className="text-slate-500 font-medium max-w-sm leading-relaxed mb-8">
                The official oversight and fraud detection registry. Leveraging advanced AI to protect the fiscal integrity of national assets and public funds.
            </p>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <Lock className="w-3 h-3" /> Encrypted
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <Cpu className="w-3 h-3" /> AI Engine v3.0
                </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-[0.15em] mb-6">Security & Policy</h4>
            <ul className="space-y-4">
              {['Privacy Protocol', 'Data Sovereignty', 'Compliance Hub', 'Ethics Framework'].map(item => (
                <li key={item}><a href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-[0.15em] mb-6">Department Support</h4>
            <ul className="space-y-4">
              {['Officer Helpdesk', 'IT Command Center', 'API Documentation', 'Audit Guides'].map(item => (
                <li key={item}><a href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-slate-100 gap-8">
          <div className="flex items-center gap-3 text-slate-400">
             <Globe className="w-4 h-4" />
             <span className="text-xs font-bold uppercase tracking-widest">Global Fiscal Intelligence Network</span>
          </div>
          
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} Ministry of Finance • Internal Oversight Unit
          </p>
          
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors"><ShieldCheck className="w-5 h-5" /></a>
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors"><Lock className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;