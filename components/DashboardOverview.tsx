
import React from 'react';
import { TrendingUp, ShieldAlert, BarChart3, Map, Clock, IndianRupee, Activity, ArrowUpRight, ArrowDownRight, Globe } from 'lucide-react';
import { TRANSACTION_TYPES } from '../constants';
import { ReportEntry } from '../types';

interface DashboardOverviewProps {
  reports: ReportEntry[];
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ reports }) => {
  // Calculate dynamic stats based on current session reports
  const totalAudited = reports.reduce((acc, curr) => acc + (parseFloat(curr.input.amount) || 0), 0);
  const highRiskReports = reports.filter(r => r.analysis.level === 'HIGH' || r.analysis.level === 'CRITICAL');
  const highRiskAmount = highRiskReports.reduce((acc, curr) => acc + (parseFloat(curr.input.amount) || 0), 0);
  
  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    return `₹${val.toLocaleString()}`;
  };

  const stats = [
    { label: 'Total Audited Amount', value: formatCurrency(totalAudited), change: '+Session', trend: 'up', icon: IndianRupee, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'High Risk Flagged', value: formatCurrency(highRiskAmount), change: `${highRiskReports.length} cases`, trend: 'up', icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Active Reports', value: reports.length.toString(), change: 'Audit Trail', trend: 'up', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Network Integrity', value: '98.4%', change: 'Stable', trend: 'up', icon: Globe, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const regionalRisk = [
    { region: 'Northern Zone', risk: 85, color: 'bg-rose-500' },
    { region: 'Central Division', risk: 42, color: 'bg-amber-500' },
    { region: 'Western Sector', risk: 28, color: 'bg-emerald-500' },
    { region: 'Southern Command', risk: 64, color: 'bg-orange-500' },
    { region: 'Eastern Frontier', risk: 35, color: 'bg-blue-500' },
  ];

  // Map transaction types to risk data from real reports where possible
  const deptRisk = TRANSACTION_TYPES.map((t) => {
    const deptReports = reports.filter(r => r.input.category === t.id);
    let riskScore = 0;
    if (deptReports.length > 0) {
      riskScore = Math.round(deptReports.reduce((acc, curr) => acc + curr.analysis.score, 0) / deptReports.length);
    } else {
        // Placeholder for depts without reports yet
        riskScore = 0;
    }
    return {
      name: t.title,
      risk: riskScore,
      icon: t.icon,
      count: deptReports.length
    };
  });

  return (
    <div className="space-y-8 mb-20 animate-fade-in">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-5 group-hover:opacity-10 transition-opacity ${stat.bg}`}></div>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-slate-50 text-slate-500`}>
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk by Department (Simple Bar Chart) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">Sectoral Risk Indices</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Aggregated risk score per government department</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {deptRisk.map((dept, i) => (
              <div key={i} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <dept.icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <span className="text-sm font-bold text-slate-700">{dept.name}</span>
                    {dept.count > 0 && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 rounded-full font-bold">{dept.count} Audit(s)</span>}
                  </div>
                  <span className={`text-xs font-black ${dept.risk > 70 ? 'text-rose-600' : (dept.risk > 40 ? 'text-amber-600' : 'text-emerald-600')}`}>
                    {dept.risk > 0 ? `${dept.risk}%` : 'NO DATA'}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${dept.risk > 70 ? 'bg-rose-500' : (dept.risk > 40 ? 'bg-amber-500' : 'bg-emerald-500')}`}
                    style={{ width: `${dept.risk}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Heatmap Representative */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Map className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">Regional Variance</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Geospatial risk distribution</p>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            {regionalRisk.map((region, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all cursor-default">
                <div className={`w-3 h-3 rounded-full ${region.color} shadow-sm shadow-current/20`}></div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-800">{region.region}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Threat Level</p>
                  <p className={`text-sm font-black ${region.risk > 75 ? 'text-rose-600' : 'text-slate-600'}`}>{region.risk}/100</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Low Risk</span>
              <div className="flex-1 mx-4 h-1.5 rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500"></div>
              <span>Critical</span>
            </div>
          </div>
        </div>
      </div>

      {/* Temporal Trend Chart (SVG Line Chart) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-slate-100 rounded-lg">
            <Clock className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">Risk Volatility Timeline</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Session intensity overview</p>
          </div>
        </div>

        <div className="relative h-48 w-full group">
          {/* Simple SVG Line Chart */}
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 700 150">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Background Area */}
            <path 
              d="M0,150 L0,120 L100,100 L200,130 L300,60 L400,90 L500,40 L600,110 L700,70 L700,150 Z" 
              fill="url(#lineGradient)" 
            />
            {/* The Line */}
            <path 
              d="M0,120 L100,100 L200,130 L300,60 L400,90 L500,40 L600,110 L700,70" 
              fill="none" 
              stroke="#3B82F6" 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="animate-[shimmer_3s_infinite_linear]"
              style={{ strokeDasharray: 1000, strokeDashoffset: 1000, animation: 'draw 2s forwards ease-out' }}
            />
            {/* Data Points */}
            {[
              {x: 0, y: 120}, {x: 100, y: 100}, {x: 200, y: 130}, 
              {x: 300, y: 60}, {x: 400, y: 90}, {x: 500, y: 40}, 
              {x: 600, y: 110}, {x: 700, y: 70}
            ].map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="5" fill="#3B82F6" stroke="white" strokeWidth="2" />
            ))}
          </svg>
          
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
            {[1, 2, 3, 4].map(i => <div key={i} className="w-full h-px bg-slate-900"></div>)}
          </div>

          {/* Labels */}
          <div className="flex justify-between mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
            <span>Session Start</span>
            <span>Current Analysis Cycle</span>
            <span>Live Audit Stream</span>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
};

export default DashboardOverview;