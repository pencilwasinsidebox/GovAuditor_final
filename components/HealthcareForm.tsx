
import React, { useState, useEffect, useRef } from 'react';
import { ClaimData } from '../types';
import { 
  Building, MapPin, IndianRupee, FileText, Calendar, Hash, 
  ScanLine, GraduationCap, Shield, ChevronDown, Landmark, 
  Briefcase, BarChart3, HardHat, Gavel, User, Coins, 
  CreditCard, Banknote, X, Globe2, Plane, HandCoins, 
  Upload, FileUp, CheckCircle2, Loader2, Info, Download, 
  ShieldCheck, Database 
} from 'lucide-react';

interface ClaimFormProps {
  category: 'healthcare' | 'education' | 'defence' | 'taxation' | 'tenders' | 'payroll' | 'foreign-aid' | 'welfare';
  onSubmit: (data: ClaimData) => void;
  onCancel: () => void;
}

const UniversalClaimForm: React.FC<ClaimFormProps> = ({ category, onSubmit, onCancel }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showFormatGuide, setShowFormatGuide] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ClaimData>({
    category: category,
    subCategory: '',
    entityName: '',
    entityId: '',
    location: '',
    amount: '',
    reason: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const config = getConfig();
    setFormData(prev => ({
        ...prev,
        category: category,
        subCategory: config.defaultSub || '',
        entityName: '',
        entityId: '',
        location: '',
        amount: '',
        reason: config.defaultReason || '',
        date: new Date().toISOString().split('T')[0],
    }));
  }, [category]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      
      // AI Parsing Mock Logic
      const mockParsedData: Partial<ClaimData> = {
        entityId: `REG-${Math.floor(1000 + Math.random() * 9000)}`,
        location: "Central Division",
        date: new Date().toISOString().split('T')[0],
      };

      // Ensure some parsed amounts trigger outliers occasionally
      const randomHigh = Math.random() > 0.5 ? 12500 : 8400;

      if (category === 'healthcare') {
        mockParsedData.entityName = "St. Marys General";
        mockParsedData.amount = randomHigh.toString();
        mockParsedData.reason = "Diagnostic Equipment Lease";
      } else if (category === 'defence') {
        mockParsedData.entityName = "National Arms Corp";
        mockParsedData.amount = "15500";
        mockParsedData.reason = "Logistics Support Contract";
      } else if (category === 'taxation') {
        mockParsedData.entityName = "Enterprise Solutions Ltd";
        mockParsedData.amount = "22000";
        mockParsedData.reason = "Corporate Tax Assessment";
      } else {
        mockParsedData.entityName = "Validated Vendor 09";
        mockParsedData.amount = randomHigh.toString();
        mockParsedData.reason = "Imported from " + file.name;
      }

      setFormData(prev => ({ ...prev, ...mockParsedData }));
      setTimeout(() => setUploadSuccess(false), 3000);
    }, 2000);
  };

  const getConfig = () => {
    switch(category) {
      case 'education': return { 
        title: 'Education Audit', 
        subtitle: 'Verify scholarships, grants, and institutional funding.', 
        entityNameLabel: 'Institute Name', 
        entityNamePlaceholder: 'e.g. National Institute of Tech', 
        entityIdLabel: 'Institute ID', 
        entityIdPlaceholder: 'e.g. AISHE-9920', 
        reasonLabel: 'Grant Purpose', 
        csvFormat: 'institute_name, institute_id, location, amount, date, grant_purpose', 
        icon: GraduationCap,
        defaultReason: 'Scholarship Disbursement'
      };
      case 'defence': return { 
        title: 'Defence Procurement', 
        subtitle: 'Analyze vendor contracts and maintenance logs.', 
        entityNameLabel: 'Vendor Name', 
        entityNamePlaceholder: 'e.g. Bharat Dynamics', 
        entityIdLabel: 'Vendor Reg ID', 
        entityIdPlaceholder: 'e.g. V-DEF-001', 
        reasonLabel: 'Contract Desc', 
        csvFormat: 'vendor_name, vendor_id, location, amount, date, contract_desc, sub_category', 
        icon: Shield,
        defaultSub: 'Equipment Maintenance'
      };
      case 'taxation': return { 
        title: 'Taxation Analysis', 
        subtitle: 'Detect evasion patterns and filing anomalies.', 
        entityNameLabel: 'Payer Name', 
        entityNamePlaceholder: 'e.g. ABC Pvt Ltd', 
        entityIdLabel: 'PAN/GSTIN', 
        entityIdPlaceholder: 'e.g. GST-29AA...', 
        reasonLabel: 'Tax Category', 
        csvFormat: 'payer_name, payer_id, location, amount, date, payer_type, period', 
        icon: Landmark,
        defaultReason: 'Income Tax Filing'
      };
      case 'tenders': return { 
        title: 'Tender Audit', 
        subtitle: 'Analyze bid rigging and vendor qualifications.', 
        entityNameLabel: 'Vendor Name', 
        entityNamePlaceholder: 'e.g. InfraCorp Ltd', 
        entityIdLabel: 'Vendor ID', 
        entityIdPlaceholder: 'e.g. VEN-992', 
        reasonLabel: 'Project Title', 
        csvFormat: 'vendor_name, vendor_id, location, amount, date, tender_id, project_name', 
        icon: Gavel,
        defaultSub: 'Public Infrastructure'
      };
      case 'payroll': return { 
        title: 'Payroll Audit', 
        subtitle: 'Detect ghost employees and salary padding.', 
        entityNameLabel: 'Employee Name', 
        entityNamePlaceholder: 'e.g. Arjun Mehta', 
        entityIdLabel: 'Employee ID', 
        entityIdPlaceholder: 'e.g. EMP-2024', 
        reasonLabel: 'Designation', 
        csvFormat: 'employee_name, employee_id, location, amount, date, designation, basic_salary', 
        icon: Coins,
        defaultReason: 'Monthly Remuneration'
      };
      case 'foreign-aid': return { 
        title: 'Foreign Aid Audit', 
        subtitle: 'Audit aid allocation and disbursement delays.', 
        entityNameLabel: 'Aid Agency', 
        entityNamePlaceholder: 'e.g. UN Relief Fund', 
        entityIdLabel: 'Agency ID', 
        entityIdPlaceholder: 'e.g. AID-X-01', 
        reasonLabel: 'Relief Reason', 
        csvFormat: 'agency_name, agency_id, location, amount, date, relief_reason', 
        icon: Globe2,
        defaultReason: 'Disaster Relief Support'
      };
      case 'welfare': return { 
        title: 'Welfare Audit', 
        subtitle: 'Monitor beneficiary payouts and subsidy leakage.', 
        entityNameLabel: 'Agency Name', 
        entityNamePlaceholder: 'e.g. Dept of Social Welfare', 
        entityIdLabel: 'Agency ID', 
        entityIdPlaceholder: 'e.g. WELF-001', 
        reasonLabel: 'Scheme Name', 
        csvFormat: 'agency_name, agency_id, location, amount, date, scheme_name, welfare_type', 
        icon: HandCoins,
        defaultReason: 'Direct Benefit Transfer'
      };
      default: return { 
        title: 'Healthcare Audit', 
        subtitle: 'Enter medical claim details for AI risk assessment.', 
        entityNameLabel: 'Hospital Name', 
        entityNamePlaceholder: 'e.g. Apollo Hospital', 
        entityIdLabel: 'Hospital ID', 
        entityIdPlaceholder: 'e.g. HID-9920', 
        reasonLabel: 'Medical Reason', 
        csvFormat: 'hospital_name, hospital_id, location, amount, date, medical_reason', 
        icon: ScanLine,
        defaultReason: 'Medical Procurement'
      };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  const renderInput = (label: string, name: keyof ClaimData, IconComponent: any, placeholder: string, type: string = 'text') => (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        <IconComponent className="absolute left-4 top-3.5 h-4 w-4 text-slate-300 group-focus-within:text-blue-500 transition-colors z-10" />
        <input
          required
          name={name}
          value={formData[name] as string || ''}
          onChange={handleChange}
          type={type}
          placeholder={placeholder}
          className="relative w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-300 hover:border-slate-300 shadow-sm"
        />
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in-up">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-900 text-white shadow-xl">
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{config.title}</h2>
                    <p className="text-slate-400 text-xs mt-0.5 font-medium">{config.subtitle}</p>
                </div>
            </div>
            <button onClick={onCancel} className="p-2 rounded-full hover:bg-slate-100 text-slate-300 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Data Ingestion Module */}
        <div className="mb-10 space-y-4">
            <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-blue-500" />
                    Automated Data Ingestion
                </span>
                <button 
                  onClick={() => setShowFormatGuide(!showFormatGuide)}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 underline underline-offset-4 flex items-center gap-1.5 transition-all"
                >
                  <Info className="w-3.5 h-3.5" />
                  Expected CSV Mapping
                </button>
            </div>

            {showFormatGuide && (
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 animate-fade-in mb-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-2">
                        <Download className="w-3.5 h-3.5" />
                        Required CSV Headers:
                    </div>
                    <code className="block bg-white p-3 rounded-lg border border-blue-200 font-mono text-[11px] text-blue-700 overflow-x-auto whitespace-nowrap shadow-inner">
                        {config.csvFormat}
                    </code>
                    <p className="text-[10px] text-blue-600 mt-2 font-medium">
                        * Note: High-value entries will trigger automated risk assessment protocols based on sectoral baselines.
                    </p>
                </div>
            )}

            <div 
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer group relative border-2 border-dashed rounded-2xl p-8 transition-all duration-500 flex flex-col items-center justify-center gap-2 bg-slate-50/50 hover:bg-white 
                  ${isUploading ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-blue-400'} 
                  ${uploadSuccess ? 'border-emerald-400 bg-emerald-50' : ''}`}
            >
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".csv" />
                
                {isUploading ? (
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                ) : uploadSuccess ? (
                    <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg animate-bounce">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                ) : (
                    <div className="h-12 w-12 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                        <FileUp className="w-6 h-6 text-slate-400 group-hover:text-blue-600" />
                    </div>
                )}
                
                <div className="text-center mt-2">
                    <p className={`text-sm font-bold ${isUploading ? 'text-blue-600' : (uploadSuccess ? 'text-emerald-700' : 'text-slate-700')}`}>
                        {isUploading ? 'Parsing Report Schema...' : (uploadSuccess ? 'Ingestion Successful' : 'Upload Sector Report')}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-[0.15em] group-hover:text-slate-500">
                        Supports standard CSV exports
                    </p>
                </div>
                
                {isUploading && (
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-100 rounded-b-2xl overflow-hidden">
                    <div className="h-full bg-blue-500 w-1/3 animate-[shimmer_1.5s_infinite_linear]"></div>
                  </div>
                )}
            </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {renderInput(config.entityNameLabel, "entityName", Building, config.entityNamePlaceholder)}
              {renderInput(config.entityIdLabel, "entityId", Hash, config.entityIdPlaceholder)}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {renderInput("Amount (INR)", "amount", IndianRupee, "0.00", "number")}
              {renderInput("Location", "location", MapPin, "e.g. Zone-4 North")}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {renderInput(config.reasonLabel || "Purpose", "reason", FileText, "Enter details")}
              {renderInput("Audit Date", "date", Calendar, "", "date")}
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-4 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] py-4 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-xl hover:bg-slate-800 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 group"
            >
              <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Analyze Submission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UniversalClaimForm;