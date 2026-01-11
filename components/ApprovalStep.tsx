
import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Building, AlertTriangle, ArrowRight, ShieldAlert, History } from 'lucide-react';
import { ClaimData, ApprovalMetadata } from '../types';

interface ApprovalStepProps {
  data: ClaimData;
  onApprove: (approval: ApprovalMetadata) => void;
  onCancel: () => void;
  approvalHistory: Record<string, number>;
  threshold: number;
}

const ApprovalStep: React.FC<ApprovalStepProps> = ({ data, onApprove, onCancel, approvalHistory, threshold }) => {
  const [approverName, setApproverName] = useState('');
  const [approverDept, setApproverDept] = useState('Audit Oversight Unit');

  const currentCount = approvalHistory[approverName] || 0;
  const isNearThreshold = currentCount >= threshold - 1;
  const isOverThreshold = currentCount >= threshold;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApprove({
      approverName,
      approverDept,
      timestamp: new Date().toISOString(),
      approvalCount: currentCount + 1,
      thresholdWarning: isOverThreshold
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in-up">
      <div className="bg-white border-2 border-slate-900 rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-slate-900 p-8 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <ShieldCheck className="w-24 h-24" />
          </div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <UserCheck className="text-blue-400" />
            Mandatory Verification
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Section 4-B Protocol: All federal data uploads require human officer approval before algorithmic analysis.
          </p>
        </div>

        <div className="p-8 space-y-8">
          {/* Summary of Transaction */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Transaction Preview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 font-medium">Entity</p>
                <p className="text-sm font-bold text-slate-900">{data.entityName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Amount</p>
                <p className="text-sm font-bold text-emerald-600">₹{parseInt(data.amount).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Officer Name</label>
                <div className="relative group">
                  <UserCheck className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10" />
                  <input
                    required
                    value={approverName}
                    onChange={(e) => setApproverName(e.target.value)}
                    placeholder="Enter Full Name"
                    className="w-full bg-white border border-slate-300 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Department</label>
                <div className="relative group">
                  <Building className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10" />
                  <select
                    value={approverDept}
                    onChange={(e) => setApproverDept(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl py-3.5 pl-12 pr-10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                  >
                    <option>Audit Oversight Unit</option>
                    <option>Fiscal Intelligence Dept</option>
                    <option>Internal Revenue Service</option>
                    <option>Defence Procurement Board</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Threshold Warning */}
            {approverName && (isNearThreshold || isOverThreshold) && (
              <div className={`flex items-start gap-4 p-5 rounded-2xl border ${isOverThreshold ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                <div className={`p-2 rounded-lg ${isOverThreshold ? 'bg-rose-100' : 'bg-amber-100'}`}>
                  {isOverThreshold ? <ShieldAlert className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-tight">
                    {isOverThreshold ? 'Audit Conflict Warning' : 'Approval Threshold Warning'}
                  </h4>
                  <p className="text-xs mt-1 leading-relaxed opacity-80">
                    Officer <span className="font-bold underline">{approverName}</span> has performed <span className="font-bold">{currentCount}</span> approvals. 
                    {isOverThreshold 
                      ? " This exceeds the safety threshold and will be logged as a potential conflict of interest for manual review." 
                      : " Approaching the mandatory review limit (Threshold: " + threshold + ")."}
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 flex gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-4 px-6 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold hover:bg-slate-50 transition-all"
              >
                Back to Data Entry
              </button>
              <button
                type="submit"
                disabled={!approverName}
                className="flex-[2] py-4 px-6 rounded-xl bg-slate-900 text-white font-bold shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
              >
                <span>Approve & Finalize Audit</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
        
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-2">
                <History className="w-3.5 h-3.5" />
                Session History: {currentCount} Approvals logged for this entity
            </div>
            <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Secure Protocol Active
            </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalStep;