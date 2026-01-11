import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TypeCard from './components/TypeCard';
import UniversalClaimForm from './components/HealthcareForm';
import RiskAnalysis from './components/RiskAnalysis';
import ReportsList from './components/ReportsList';
import ApprovalStep from './components/ApprovalStep';
import DashboardOverview from './components/DashboardOverview';
import { TRANSACTION_TYPES } from './constants';
import { ViewState, ClaimData, RiskAnalysisResult, ReportEntry, AppNotification, ApprovalMetadata } from './types';
import { ArrowRight, Activity, Database, Lock, Search, CheckCircle2, FileSearch, RefreshCw, Sparkles, Building2, Terminal, Shield, UserCheck, LayoutDashboard } from 'lucide-react';
import { analyzeClaim } from './utils/apiClient';
import { SEED_HISTORY } from './data/seedData';

const APPROVAL_THRESHOLD = 3;

const App: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewState, setViewState] = useState<ViewState>('SELECTION');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [currentClaimData, setCurrentClaimData] = useState<ClaimData | null>(null);
  const [riskResult, setRiskResult] = useState<RiskAnalysisResult | null>(null);
  const [reports, setReports] = useState<ReportEntry[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [approvalHistory, setApprovalHistory] = useState<Record<string, number>>({});

  const handleSelect = (id: string) => {
    setSelectedId(id === selectedId ? null : id);
  };

  const handleNavigate = (view: ViewState) => {
      setViewState(view);
      if (view === 'SELECTION') {
          setSelectedId(null);
          setCurrentClaimData(null);
          setRiskResult(null);
      }
  };

  const addNotification = (type: AppNotification['type'], title: string, message: string) => {
    const newNotif: AppNotification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleGlobalSearch = (query: string) => {
    const targetId = query.toLowerCase().trim();
    const allReports = [...reports, ...SEED_HISTORY];
    const found = allReports.find(r => r.id.toLowerCase() === targetId);

    if (found) {
      setCurrentClaimData(found.input);
      setRiskResult(found.analysis);
      setViewState('ANALYSIS_RESULT');
      addNotification('INFO', 'Record Found', `Accessing audit trail for Transaction ID: ${query}`);
    } else {
      addNotification('WARNING', 'Invalid Audit ID', `The transaction ID "${query}" could not be located in the current Federal Registry.`);
    }
  };

  const handleProceed = () => {
    if (!selectedId) return;
    setViewState('INPUT_FORM');
  };

  const handleClaimSubmit = (data: ClaimData) => {
      setCurrentClaimData(data);
      setViewState('APPROVAL_STEP');
  };

  const handleApproveAndAnalyze = async (approval: ApprovalMetadata) => {
      if (!currentClaimData) return;
      setIsSimulating(true);
      setApprovalHistory(prev => ({
        ...prev,
        [approval.approverName]: (prev[approval.approverName] || 0) + 1
      }));

      if (approval.thresholdWarning) {
        addNotification(
          'CRITICAL',
          'Audit Compliance Breach',
          `Officer ${approval.approverName} has exceeded the approval threshold (${approval.approvalCount} actions). This incident has been logged for mandatory audit review.`
        );
      } else {
        addNotification(
          'INFO',
          'Approval Logged',
          `Transaction approved by ${approval.approverName} (${approval.approverDept}). Verification complete.`
        );
      }

      const fullContext = [...SEED_HISTORY, ...reports];
      const result = await analyzeClaim(currentClaimData, fullContext, approval.approverName);
      const newReport: ReportEntry = {
          id: Date.now().toString(),
          input: currentClaimData,
          analysis: result,
          date: new Date().toISOString(),
          status: 'ANALYZED',
          approval: approval
      };
      
      setReports(prev => [newReport, ...prev]);
      setRiskResult(result);

      if (result.score >= 50) {
        addNotification(
          result.score >= 75 ? 'CRITICAL' : 'WARNING',
          `${result.level} Risk Found: ${currentClaimData.entityName}`,
          `${result.factors.length} anomaly factors detected. Manual verification required following ${approval.approverName}'s approval.`
        );
      }
      setIsSimulating(false);
      setViewState('ANALYSIS_RESULT');
  };

  const handleViewReport = (report: ReportEntry) => {
      setCurrentClaimData(report.input);
      setRiskResult(report.analysis);
      setViewState('ANALYSIS_RESULT');
  };

  const handleBack = () => {
      setViewState('SELECTION');
      setSelectedId(null);
      setCurrentClaimData(null);
      setRiskResult(null);
  }

  const handleResetAudit = () => {
      setViewState('INPUT_FORM');
      setRiskResult(null);
  }

  const selectedCategory = TRANSACTION_TYPES.find(t => t.id === selectedId);

  return (
    <div className="relative min-h-screen flex flex-col bg-gov-bg text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden pt-20">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.4]"></div>
        <div className="absolute top-0 left-0 right-0 h-[800px] bg-gradient-to-b from-blue-50/50 to-transparent"></div>
        <div className="absolute top-[10%] -left-[10%] w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[20%] -right-[5%] w-[400px] h-[400px] bg-emerald-100/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>
      <Header 
        onNavigate={handleNavigate} 
        currentView={viewState} 
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onClearAll={handleClearAll}
        onSearch={handleGlobalSearch}
      />
      <main className="relative z-10 flex-1 flex flex-col">
        {viewState === 'SELECTION' && (
            <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-12">
                <div className="mb-24 text-center max-w-5xl mx-auto">
                    <div className="opacity-0 animate-fade-in-up flex justify-center mb-10" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
                        <div className="inline-flex items-center gap-2.5 rounded-full glass border border-blue-100 px-5 py-2 text-[11px] font-bold text-blue-700 uppercase tracking-[0.2em] shadow-sm">
                            <Terminal className="w-3.5 h-3.5" />
                            Security Protocol V3.0 Enabled
                        </div>
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl md:text-7xl mb-10 leading-[1.1] opacity-0 animate-fade-in-up" style={{ animationDelay: '150ms', animationFillMode: 'forwards' }}>
                        Fiscal Oversight & <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
                             Intelligence Registry
                        </span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-500 font-medium leading-relaxed opacity-0 animate-fade-in-up mb-12" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
                        Advanced AI-driven fraud detection platform with <span className="text-slate-900 font-bold underline decoration-blue-500 underline-offset-4">mandatory human oversight</span> for unified government expenditure auditing.
                    </p>
                    <div className="mt-12 max-w-2xl mx-auto relative group opacity-0 animate-fade-in-up" style={{ animationDelay: '450ms', animationFillMode: 'forwards' }}>
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Enter Department ID, Transaction Hash or Entity Name..." 
                            className="block w-full pl-14 pr-32 py-5 border-none rounded-2xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 sm:text-base transition-all shadow-2xl shadow-slate-200/60"
                        />
                        <div className="absolute inset-y-2 right-2 flex items-center">
                            <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg">
                                Search Records
                            </button>
                        </div>
                    </div>
                </div>
                {reports.length > 0 && (
                  <div className="mb-20 opacity-0 animate-fade-in-up" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
                      <div className="flex items-center gap-3 mb-8">
                          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                              <LayoutDashboard className="w-5 h-5" />
                          </div>
                          <div>
                              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Oversight Dashboard</h2>
                              <p className="text-slate-500 font-medium text-sm">Real-time fiscal health and threat intelligence</p>
                          </div>
                      </div>
                      <DashboardOverview reports={reports} />
                  </div>
                )}
                <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '750ms', animationFillMode: 'forwards' }}>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Departmental Registry</h2>
                        <p className="text-slate-500 font-medium text-sm mt-1">Select a critical sector to initiate audit protocols.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-32 perspective-1000">
                    {TRANSACTION_TYPES.map((type, index) => (
                    <TypeCard
                        key={type.id}
                        index={index}
                        type={type}
                        isSelected={selectedId === type.id}
                        onSelect={handleSelect}
                    />
                    ))}
                </div>
                <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-[110] transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) ${selectedId ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0 pointer-events-none'}`}>
                    <div className="bg-slate-900 border border-white/10 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.4)] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-8 ring-1 ring-white/20">
                        <div className="flex items-center gap-5 w-full sm:w-auto">
                            <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/30 overflow-hidden">
                                <div className="absolute inset-0 shimmer opacity-30"></div>
                                {selectedCategory && <selectedCategory.icon className="w-7 h-7 text-white" />} 
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></div>
                                    <p className="text-[10px] font-bold text-blue-300 uppercase tracking-[0.2em]">Ready for Verification</p>
                                </div>
                                <p className="text-xl font-bold text-white truncate leading-tight mt-1">{selectedCategory?.title}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <button onClick={handleBack} className="hidden md:flex px-6 py-4 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-colors">Cancel</button>
                            <button
                                onClick={handleProceed}
                                className="w-full sm:w-auto group flex items-center justify-center gap-3 rounded-xl bg-white px-10 py-4 font-bold text-slate-900 shadow-xl transition-all hover:scale-[1.02]"
                            >
                                <span>Initialize Data Entry</span>
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
        {viewState === 'INPUT_FORM' && selectedId && (
             <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[75vh] relative">
                <UniversalClaimForm 
                    category={selectedId as any}
                    onSubmit={handleClaimSubmit} 
                    onCancel={handleBack} 
                />
             </div>
        )}
        {viewState === 'APPROVAL_STEP' && currentClaimData && (
             <div className="container mx-auto px-4 py-16 min-h-[75vh] flex items-center justify-center">
                {isSimulating ? (
                    <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-xl animate-fade-in">
                        <div className="relative mb-10">
                            <div className="h-28 w-28 rounded-2xl border-4 border-white/10 border-t-blue-500 animate-spin relative z-10"></div>
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                <Shield className="h-10 w-10 text-white animate-pulse" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4">Securing Federal Session</h2>
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/20">
                                <Activity className="w-4 h-4 text-blue-400" />
                                <span className="text-sm font-bold text-white uppercase tracking-widest">Running AI Inferences...</span>
                            </div>
                            <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-1/2 animate-[shimmer_1.5s_infinite_linear]"></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <ApprovalStep 
                        data={currentClaimData}
                        onApprove={handleApproveAndAnalyze}
                        onCancel={() => setViewState('INPUT_FORM')}
                        approvalHistory={approvalHistory}
                        threshold={APPROVAL_THRESHOLD}
                    />
                )}
             </div>
        )}
        {viewState === 'ANALYSIS_RESULT' && riskResult && currentClaimData && (
            <div className="container mx-auto px-4 py-16">
                 <button onClick={() => handleNavigate('REPORTS_LIST')} className="mb-10 group flex items-center gap-3 text-slate-500 hover:text-blue-600 transition-all">
                    <div className="p-2 rounded-xl bg-white group-hover:bg-blue-50 transition-colors border border-slate-200 shadow-sm">
                        <ArrowRight className="rotate-180 w-5 h-5" /> 
                    </div>
                    <span className="font-bold tracking-tight">Back to Registry Records</span>
                 </button>
                 <RiskAnalysis 
                    result={riskResult} 
                    inputData={currentClaimData}
                    onReset={handleResetAudit}
                 />
            </div>
        )}
        {viewState === 'REPORTS_LIST' && (
             <div className="container mx-auto px-4 py-16 min-h-[75vh]">
                 <ReportsList reports={reports} onViewReport={handleViewReport} />
             </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;