
import React from 'react';
import { ReportEntry } from '../types';
import { FileText, Eye, AlertTriangle, CheckCircle, Search, Calendar, GraduationCap, Stethoscope, Shield, Briefcase, Building, Coins, UserCheck, ShieldAlert } from 'lucide-react';

interface ReportsListProps {
  reports: ReportEntry[];
  onViewReport: (report: ReportEntry) => void;
}

const ReportsList: React.FC<ReportsListProps> = ({ reports, onViewReport }) => {
  const getScoreBadgeStyles = (score: number) => {
    if (score < 30) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score < 70) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const getCategoryIcon = (category: string) => {
      switch(category) {
          case 'healthcare': return <Stethoscope className="w-4 h-4 text-rose-500" />;
          case 'education': return <GraduationCap className="w-4 h-4 text-amber-500" />;
          case 'defence': return <Shield className="w-4 h-4 text-orange-500" />;
          case 'taxation': return <Briefcase className="w-4 h-4 text-violet-500" />;
          case 'tenders': return <Building className="w-4 h-4 text-blue-500" />;
          case 'payroll': return <Coins className="w-4 h-4 text-indigo-500" />;
          default: return <FileText className="w-4 h-4 text-slate-400" />;
      }
  };

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-bold text-gov-text tracking-tight">Audit Reports</h2>
          <p className="text-slate-500 mt-2 text-lg">Archive of verified transactions and human-approved oversight logs.</p>
        </div>
        
        <div className="relative group w-full md:w-auto">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-gov-primary transition-colors" />
            <input 
                type="text" 
                placeholder="Search reports by ID or Entity..." 
                className="bg-white border border-gov-accent rounded-lg py-3 pl-11 pr-4 text-sm text-gov-text focus:outline-none focus:border-gov-primary focus:ring-1 focus:ring-gov-primary w-full md:w-80 transition-all shadow-sm"
            />
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-dashed border-slate-300">
          <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 ring-1 ring-slate-200">
            <FileText className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-gov-text">No reports generated yet</h3>
          <p className="text-slate-500 max-w-sm text-center mt-2 leading-relaxed">
            Submit a transaction for approval to generate your first audit record.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gov-accent rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Audit Date</th>
                  <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Entity / Vendor</th>
                  <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Approver Detail</th>
                  <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Risk Level</th>
                  <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-wider text-[11px] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((report) => (
                  <tr key={report.id} className="group hover:bg-blue-50/30 transition-colors">
                    <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-slate-700 font-medium text-sm">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                {new Date(report.date).toLocaleDateString()}
                            </div>
                            <span className="text-xs text-slate-400 pl-6 mt-0.5 font-mono">{new Date(report.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                         <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 group-hover:border-blue-200 transition-colors">
                            {getCategoryIcon(report.input.category)}
                         </div>
                         <div>
                             <div className="font-semibold text-slate-900 text-sm">{report.input.entityName}</div>
                             <div className="text-xs text-slate-500 truncate max-w-[180px] mt-0.5">₹{parseInt(report.input.amount).toLocaleString()}</div>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       {report.approval ? (
                         <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                                <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                                {report.approval.approverName}
                                {report.approval.thresholdWarning && (
                                    /* Fix: Wrapped ShieldAlert in a span to correctly use 'title' attribute for tooltips as Lucide icons do not support 'title' */
                                    <span title="Threshold Alert">
                                      <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] text-slate-400 pl-5 uppercase font-bold tracking-wider">{report.approval.approverDept}</span>
                         </div>
                       ) : (
                         <span className="text-xs text-slate-400 italic">System Migration Entry</span>
                       )}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${getScoreBadgeStyles(report.analysis.score)}`}>
                        {report.analysis.score > 50 ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                        {report.analysis.level}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => onViewReport(report)}
                        className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-slate-400 hover:text-gov-primary hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsList;