import {
  HandCoins,
  Building2,
  Users,
  Globe2,
  GraduationCap,
  Landmark,
  Stethoscope,
  Shield
} from 'lucide-react';
import { TransactionType } from './types';

export const TRANSACTION_TYPES: TransactionType[] = [
  {
    id: 'healthcare',
    title: 'Public Healthcare',
    description: 'Audit medical procurement, insurance claims (e.g., Ayushman Bharat), and hospital infrastructure spending.',
    icon: Stethoscope,
    color: 'text-rose-400',
  },
  {
    id: 'education',
    title: 'Education & Scholarships',
    description: 'Monitor scholarship disbursements, grant usage, and institutional funding flows.',
    icon: GraduationCap,
    color: 'text-amber-400',
  },
  {
    id: 'defence',
    title: 'Defence & National Security',
    description: 'Analyze defence procurement contracts, equipment maintenance, and strategic logistics expenditure.',
    icon: Shield,
    color: 'text-orange-400',
  },
  {
    id: 'taxation',
    title: 'Taxation & Revenue',
    description: 'Identify tax evasion patterns, GST discrepancies, and revenue leakage in collection systems.',
    icon: Landmark,
    color: 'text-violet-400',
  },
  {
    id: 'tenders',
    title: 'Govt Projects & Tenders',
    description: 'Audit public infrastructure bids, vendor contracts, and material procurement costs.',
    icon: Building2,
    color: 'text-blue-400',
  },
  {
    id: 'payroll',
    title: 'Employee Salaries & Payroll',
    description: 'Detect ghost employees, unauthorized bonuses, and overtime irregularities in department rosters.',
    icon: Users,
    color: 'text-indigo-400',
  },
  {
    id: 'foreign-aid',
    title: 'Foreign Aid & Disaster Relief',
    description: 'Track international funds for medical emergencies, disaster relief, and humanitarian support.',
    icon: Globe2,
    color: 'text-cyan-400',
  },
  {
    id: 'welfare',
    title: 'Government Welfare Schemes',
    description: 'Analyze beneficiary payouts, subsidy distribution, and direct benefit transfers for anomalies.',
    icon: HandCoins,
    color: 'text-emerald-400',
  },
];