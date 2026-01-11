import { ClaimData, ReportEntry } from '../types';

// Helper to generate random dates within last 30 days
const getRandomDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  return date.toISOString().split('T')[0];
};

const generateMockHistory = (): ReportEntry[] => {
  const entries: ReportEntry[] = [];
  
  // 1. HEALTHCARE BASELINE (Normal distribution around 50k - 200k)
  for (let i = 0; i < 40; i++) {
    // Fix: Added missing status property
    entries.push({
      id: `hist-hc-${i}`,
      date: new Date().toISOString(),
      status: 'ANALYZED',
      analysis: { score: 10, level: 'LOW', factors: [], timestamp: new Date().toISOString() },
      input: {
        category: 'healthcare',
        entityName: i % 2 === 0 ? 'City General Hospital' : 'Apollo Clinics',
        entityId: i % 2 === 0 ? 'HID-9920-X' : 'HID-8840-Y',
        location: 'Metro Zone 1',
        amount: (Math.floor(Math.random() * 150000) + 20000).toString(), // 20k to 170k
        reason: 'General Consultation',
        date: getRandomDate(),
      }
    });
  }

  // 2. DEFENCE BASELINE (Higher amounts, 500k - 5M)
  for (let i = 0; i < 30; i++) {
    // Fix: Added missing status property
    entries.push({
      id: `hist-def-${i}`,
      date: new Date().toISOString(),
      status: 'ANALYZED',
      analysis: { score: 15, level: 'LOW', factors: [], timestamp: new Date().toISOString() },
      input: {
        category: 'defence',
        subCategory: 'Equipment Repair & Maintenance',
        entityName: 'Bharat Dynamics Ltd',
        entityId: 'V-9902-DEF',
        location: 'Northern Command',
        amount: (Math.floor(Math.random() * 4500000) + 500000).toString(), // 500k to 5M
        reason: 'Routine Maintenance',
        date: getRandomDate(),
      }
    });
  }

  // 3. EDUCATION BASELINE (Scholarships 10k - 50k)
  for (let i = 0; i < 30; i++) {
    // Fix: Added missing status property
    entries.push({
      id: `hist-edu-${i}`,
      date: new Date().toISOString(),
      status: 'ANALYZED',
      analysis: { score: 5, level: 'LOW', factors: [], timestamp: new Date().toISOString() },
      input: {
        category: 'education',
        entityName: 'National Institute of Technology',
        entityId: 'U-0234-X',
        location: 'District A',
        amount: (Math.floor(Math.random() * 40000) + 10000).toString(), // 10k to 50k
        reason: 'Semester Grant',
        date: getRandomDate(),
      }
    });
  }

  // 4. TAXATION BASELINE
  for (let i = 0; i < 40; i++) {
      const isLate = i % 10 === 0; // 10% late
      const date = getRandomDate();
      const dueDate = new Date(date);
      dueDate.setDate(dueDate.getDate() + (isLate ? -5 : 5));

      // Fix: Added missing status property
      entries.push({
        id: `hist-tax-${i}`,
        date: new Date().toISOString(),
        status: 'ANALYZED',
        analysis: { score: isLate ? 30 : 5, level: 'LOW', factors: [], timestamp: new Date().toISOString() },
        input: {
            category: 'taxation',
            entityName: i % 3 === 0 ? 'ABC Pvt Ltd' : (i % 3 === 1 ? 'XYZ Corp' : 'John Doe'),
            entityId: i % 3 === 0 ? 'GSTIN-ABC' : (i % 3 === 1 ? 'GSTIN-XYZ' : 'PAN-JOHN'),
            location: 'Zone 1',
            amount: (Math.floor(Math.random() * 500000) + 50000).toString(),
            taxPayerType: i % 3 === 2 ? 'Individual' : 'Company',
            taxPeriod: 'Quarter',
            dueDate: dueDate.toISOString().split('T')[0],
            date: date,
            reason: 'Quarterly Tax Return'
        }
      });
  }

  // 5. TENDERS BASELINE
  // Create a vendor who appears often (InfraTech - ID: VEN-INFRA-01)
  for (let i = 0; i < 20; i++) {
      const isMonopolyVendor = i % 2 === 0; 
      // Fix: Added missing status property
      entries.push({
          id: `hist-tender-${i}`,
          date: new Date().toISOString(),
          status: 'ANALYZED',
          analysis: { score: isMonopolyVendor ? 40 : 10, level: 'LOW', factors: [], timestamp: new Date().toISOString() },
          input: {
              category: 'tenders',
              subCategory: 'Infrastructure',
              entityName: isMonopolyVendor ? 'InfraTech Ltd' : 'BuildWell Corp',
              entityId: isMonopolyVendor ? 'VEN-INFRA-01' : `VEN-BW-${i}`,
              location: 'State Highway Zone',
              amount: (Math.floor(Math.random() * 20000000) + 5000000).toString(), // 50L - 2.5Cr
              estimatedCost: (Math.floor(Math.random() * 20000000) + 6000000).toString(),
              tenderId: `TND-2023-${i}`,
              tenderReleaseDate: getRandomDate(),
              tenderClosingDate: getRandomDate(), // Dates not logical here but just for structure
              vendorLocation: 'Hyderabad',
              pastProjectsCount: isMonopolyVendor ? '15' : '5',
              reason: 'Road Construction Phase ' + i,
              date: getRandomDate()
          }
      });
  }

  // 6. PAYROLL BASELINE
  // Generate some employees with standard salaries
  const designations = ['Senior Manager', 'Developer', 'Analyst', 'Clerk'];
  const baseSalaries = {'Senior Manager': 150000, 'Developer': 80000, 'Analyst': 60000, 'Clerk': 30000};
  
  for (let i = 0; i < 30; i++) {
      const role = designations[i % designations.length];
      const base = baseSalaries[role as keyof typeof baseSalaries];
      const basic = Math.floor(base * 0.6); // Basic is ~60%
      const allow = Math.floor(base * 0.3); // Allow is ~30%
      const deduct = Math.floor(base * 0.1);
      const net = basic + allow - deduct;

      // Fix: Added missing status property
      entries.push({
          id: `hist-pay-${i}`,
          date: getRandomDate(), // Random date in last 30 days
          status: 'ANALYZED',
          analysis: { score: 5, level: 'LOW', factors: [], timestamp: new Date().toISOString() },
          input: {
              category: 'payroll',
              subCategory: 'Operations',
              entityName: `Employee ${i}`,
              entityId: `EMP-2024-${i}`,
              location: 'Headquarters',
              amount: net.toString(),
              basicSalary: basic.toString(),
              allowances: allow.toString(),
              deductions: deduct.toString(),
              designation: role,
              reason: 'Monthly Salary',
              date: getRandomDate()
          }
      });
  }

  return entries;
};

export const SEED_HISTORY = generateMockHistory();