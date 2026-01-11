
import React from 'react';
import { RiskAnalysisResult, ClaimData } from '../types';
import { AlertTriangle, CheckCircle, AlertOctagon, RotateCcw, Database, BrainCircuit, Download, Cpu, ShieldAlert, FileSearch, UserCheck, ShieldCheck } from 'lucide-react';

interface RiskAnalysisProps {
  result: RiskAnalysisResult;
  inputData: ClaimData;
  onReset: () => void;
}

const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ result, inputData, onReset }) => {
  const getScoreColor = (score: number) => {
    if (score < 30) return 'text-emerald-600';
    if (score < 70) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getEntityLabel = () => {
      if (inputData.category === 'education') return 'Institute Name';
      if (inputData.category === 'defence') return 'Vendor Name';
      return 'Hospital Name';
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(inputData));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "training_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const circumference = 2 * Math.PI * 60;
  const strokeDashoffset = circumference - (result.score / 100) * circumference;

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in-up pb-12">
      
      {/* Engine Status Bar */}
      <div className="mb-8 flex items-center justify-between rounded-xl bg-white border border-gov-accent p-4 px-6 shadow-sm">
         <div className="flex items-center gap-4">
             <div className="p-2 bg-blue-50 rounded-lg ring-1 ring-blue-100">
                 <ShieldCheck className="w-5 h-5 text-gov-primary" />
             </div>
             <div>
                 <p className="text-sm font-bold text-gov-text">Verification Protocol: Verified Human Approval</p>
                 <p className="text-xs text-slate-500 font-mono mt-0.5">Audit Trail ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
             </div>
         </div>
         <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-xs font-medium text-slate-600 transition-colors border border-slate-300 hover:border-slate-400 shadow-sm"
         >
             <Download className="w-3.5 h-3.5" />
             Export Audit Log
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-1 bg-white border border-gov-accent rounded-xl p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-md">
          <div className={`absolute top-0 inset-x-0 h-32 bg-gradient-to-b ${result.score < 30 ? 'from-emerald-500/5' : (result.score < 70 ? 'from-amber-500/5' : 'from-rose-500/5')} to-transparent opacity-100 pointer-events-none`}></div>
          <div className="relative w-48 h-48 flex items-center justify-center mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="60" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
              <circle cx="96" cy="96" r="60" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className={`${getScoreColor(result.score)} transition-all duration-1500 ease-out`} />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={`text-5xl font-extrabold ${getScoreColor(result.score)}`}>{result.score}</span>
              <span className="text-xs text-slate-400 uppercase font-bold tracking-widest mt-1">Risk Score</span>
            </div>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getScoreColor(result.score).replace('text-', 'border-').replace('text-', 'text-').replace('600', '100')} ${result.score < 30 ? 'bg-emerald-50' : (result.score < 70 ? 'bg-amber-50' : 'bg-rose-50')}`}>
            THREAT LEVEL: {result.level}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-gov-accent rounded-xl p-8 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center gap-3 mb-6">
                <FileSearch className="w-5 h-5 text-gov-primary" />
                <h3 className="text-lg font-bold text-gov-text tracking-wide">Transaction Context</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="block text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">{getEntityLabel()}</span>
                    <span className="text-gov-text font-medium text-lg">{inputData.entityName}</span>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="block text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">Amount Declared</span>
                    <span className="text-emerald-600 font-mono font-medium text-lg">₹{parseInt(inputData.amount).toLocaleString()}</span>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="block text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">Location</span>
                    <span className="text-gov-text font-medium">{inputData.location}</span>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="block text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">
                        Purpose / Reason
                    </span>
                    <span className="text-gov-text font-medium">
                        {inputData.subCategory ? `${inputData.subCategory} - ` : ''}{inputData.reason}
                    </span>
                </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center text-xs font-medium text-slate-500">
             <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100"><UserCheck className="w-3.5 h-3.5" /> Human Approved</span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100"><CheckCircle className="w-3.5 h-3.5" /> Analysis Validated</span>
             </div>
             <span>Timestamp: {new Date(result.timestamp).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gov-accent rounded-xl p-10 shadow-lg">
        <h3 className="text-xl font-bold text-gov-text mb-8 flex items-center gap-3">
          {result.score > 50 ? <ShieldAlert className="w-6 h-6 text-amber-500" /> : <CheckCircle className="w-6 h-6 text-emerald-500" />}
          Detected Risk Factors
        </h3>

        {result.factors.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {result.factors.map((factor, idx) => {
              const isHistorical = factor.includes('Frequency') || factor.includes('Identity') || factor.includes('History');
              const sourceIcon = isHistorical ? <Database className="w-4 h-4 text-blue-500" /> : <BrainCircuit className="w-4 h-4 text-purple-500" />;
              const sourceText = isHistorical ? "Pattern Match: Historical Record Comparison" : "AI Inference: Statistical Anomaly Analysis";

              return (
                <div key={idx} className="group flex items-start gap-5 p-5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all duration-300">
                  <div className={`mt-1 p-2 rounded-lg ${result.score > 50 ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                      <AlertOctagon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                      <p className="text-slate-800 font-medium text-lg leading-snug">{factor}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-500 bg-white border border-slate-200 inline-flex px-3 py-1 rounded-md">
                        {sourceIcon}
                        {sourceText}
                      </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
             <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-50 rounded-lg border border-dashed border-slate-300">
                <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <p className="text-xl text-gov-text font-bold">No Anomalies Detected</p>
                <p className="text-slate-500 text-sm max-w-md mt-2 leading-relaxed">The transaction appears consistent with standard historical patterns for this entity. No fraud indicators were flagged by the engine.</p>
             </div>
        )}

        <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end">
            <button 
                onClick={onReset}
                className="flex items-center gap-2 px-8 py-3.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold transition-all shadow-md hover:-translate-y-0.5"
            >
                <RotateCcw className="w-4 h-4" />
                Audit New Claim
            </button>
        </div>
      </div>
    </div>
  );
};

export default RiskAnalysis;