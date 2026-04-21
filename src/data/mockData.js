export const employees = [
  { id: 'EMP-001', name: 'Kwame Asante', title: 'Software Engineer', email: 'k.asante@dexwin.com', phone: '+233 24 123 4567', type: 'Full-time', status: 'Active', grossSalary: 8500, tin: 'C0012345678', ssnit: 'P000123456', bank: 'GCB Bank', accountNo: '1234567890', branch: 'Accra Main', startDate: '2023-01-15', tier1: 5.5, tier2: 5, tier3: 0, bonus: 500, allowances: 300, paye: 850 },
  { id: 'EMP-002', name: 'Abena Mensah', title: 'Product Manager', email: 'a.mensah@dexwin.com', phone: '+233 20 987 6543', type: 'Full-time', status: 'Active', grossSalary: 11000, tin: 'C0023456789', ssnit: 'P000234567', bank: 'Ecobank', accountNo: '9876543210', branch: 'Osu', startDate: '2022-06-01', tier1: 5.5, tier2: 5, tier3: 0, bonus: 1000, allowances: 500, paye: 1200 },
  { id: 'EMP-003', name: 'Kofi Boateng', title: 'UX Designer', email: 'k.boateng@dexwin.com', phone: '+233 55 456 7890', type: 'Contract', status: 'Active', grossSalary: 6200, tin: 'C0034567890', ssnit: null, bank: 'Fidelity Bank', accountNo: '5678901234', branch: 'Tema', startDate: '2023-09-01', tier1: 0, tier2: 0, tier3: 0, bonus: 0, allowances: 200, paye: 0 },
  { id: 'EMP-004', name: 'Efua Darko', title: 'HR Specialist', email: 'e.darko@dexwin.com', phone: '+233 26 789 0123', type: 'Full-time', status: 'Active', grossSalary: 7800, tin: 'C0045678901', ssnit: 'P000456789', bank: 'Stanbic Bank', accountNo: '3456789012', branch: 'Airport', startDate: '2023-03-20', tier1: 5.5, tier2: 5, tier3: 2, bonus: 300, allowances: 400, paye: 750 },
  { id: 'EMP-005', name: 'Nana Yaw Owusu', title: 'Finance Analyst', email: 'n.owusu@dexwin.com', phone: '+233 27 321 0987', type: 'Full-time', status: 'Pending', grossSalary: 9200, tin: 'C0056789012', ssnit: 'P000567890', bank: 'Cal Bank', accountNo: '7890123456', branch: 'Accra Central', startDate: '2024-01-08', tier1: 5.5, tier2: 5, tier3: 0, bonus: 0, allowances: 600, paye: 1000 },
  { id: 'EMP-006', name: 'Akosua Frimpong', title: 'Marketing Lead', email: 'a.frimpong@dexwin.com', phone: '+233 54 654 3210', type: 'Full-time', status: 'Active', grossSalary: 10500, tin: 'C0067890123', ssnit: 'P000678901', bank: 'Access Bank', accountNo: '2345678901', branch: 'Legon', startDate: '2022-11-14', tier1: 5.5, tier2: 5, tier3: 0, bonus: 800, allowances: 700, paye: 1100 },
];

export const transactions = [
  { id: 'TXN-2025-001', date: '2025-04-05', type: 'Payroll Disbursement', amount: 58200, wallet: 'Payroll Wallet', recipients: 6, status: 'Successful', ref: 'PR-APR-2025' },
  { id: 'TXN-2025-002', date: '2025-04-05', type: 'Wallet Top-up', amount: 80000, wallet: 'Main Account', recipients: null, status: 'Successful', ref: 'TOP-APR-2025' },
  { id: 'TXN-2025-003', date: '2025-04-05', type: 'Payroll Disbursement', amount: 9200, wallet: 'Payroll Wallet', recipients: 1, status: 'Failed', ref: 'PR-APR-2025-F' },
  { id: 'TXN-2025-004', date: '2025-03-05', type: 'Payroll Disbursement', amount: 55700, wallet: 'Payroll Wallet', recipients: 6, status: 'Successful', ref: 'PR-MAR-2025' },
  { id: 'TXN-2025-005', date: '2025-03-01', type: 'Wallet Top-up', amount: 75000, wallet: 'Main Account', recipients: null, status: 'Successful', ref: 'TOP-MAR-2025' },
  { id: 'TXN-2025-006', date: '2025-02-05', type: 'Payroll Disbursement', amount: 54100, wallet: 'Payroll Wallet', recipients: 5, status: 'Successful', ref: 'PR-FEB-2025' },
];

export const payrollRuns = [
  { period: 'April 2025', employees: 6, gross: 53200, deductions: 8460, net: 44740, status: 'Processed', date: '2025-04-05' },
  { period: 'March 2025', employees: 6, gross: 53200, deductions: 8460, net: 44740, status: 'Processed', date: '2025-03-05' },
];

export const teamMembers = [
  { id: 1, name: 'Adjoa Barimah', email: 'adjoa@dexwin.com', role: 'HR Manager', status: 'Accepted', since: '2023-02-01' },
  { id: 2, name: 'Yaw Acheampong', email: 'yaw.a@dexwin.com', role: 'Finance', status: 'Accepted', since: '2023-06-15' },
  { id: 3, name: 'Serwaa Asante', email: 's.asante@dexwin.com', role: 'HR Manager', status: 'Sent', since: '2025-04-10' },
  { id: 4, name: 'Kojo Mensah', email: 'kojo.m@dexwin.com', role: 'Finance', status: 'Expired', since: '2025-03-28' },
];

export const company = {
  name: 'Dexwin Technologies Ltd.',
  email: 'admin@dexwin.com',
  phone: '+233 30 123 4567',
  tin: 'C0098765432',
  ssnit: 'SS-0012345',
  affinity: 'AFF-789012',
  walletBalance: 21800,
  mainBalance: 21800,
  payrollWallet: 0,
  lowBalanceThreshold: 10000,
  kycStatus: 'Verified',
  onboardingComplete: true,
  tier2Partner: 'Enterprise Trustees',
  tier3Partner: 'Individual Cap',
};

export const clients = [
  {
    id: 'CLT-001',
    name: 'Volta River Authority',
    contactName: 'Kweku Mensah',
    email: 'kweku.mensah@vra.com.gh',
    phone: '+233 30 221 4567',
    tin: 'C0011223344',
    industry: 'Energy & Utilities',
    status: 'Active',
    kycStatus: 'Verified',
    walletName: 'Volta River Authority',
    walletBalance: 184500,
    employeeCount: 34,
    lastPayroll: { period: 'March 2026', amount: 142800, date: '2026-03-31' },
    createdAt: '2024-01-10',
  },
  {
    id: 'CLT-002',
    name: 'Accra Breweries Ltd.',
    contactName: 'Abena Darko',
    email: 'a.darko@accrabreweries.com',
    phone: '+233 24 876 5432',
    tin: 'C0022334455',
    industry: 'Manufacturing',
    status: 'Active',
    kycStatus: 'Verified',
    walletName: 'Accra Breweries Ltd.',
    walletBalance: 95200,
    employeeCount: 18,
    lastPayroll: { period: 'March 2026', amount: 68400, date: '2026-03-31' },
    createdAt: '2024-03-05',
  },
  {
    id: 'CLT-003',
    name: 'GreenPath Logistics',
    contactName: 'Yaw Boateng',
    email: 'y.boateng@greenpath.com.gh',
    phone: '+233 55 345 6789',
    tin: 'C0033445566',
    industry: 'Logistics & Supply Chain',
    status: 'Pending',
    kycStatus: 'Pending',
    walletName: 'GreenPath Logistics',
    walletBalance: 0,
    employeeCount: 9,
    lastPayroll: null,
    createdAt: '2026-03-20',
  },
  {
    id: 'CLT-004',
    name: 'Kumasi Tech Hub',
    contactName: 'Efua Asante',
    email: 'e.asante@kumasitechhub.com',
    phone: '+233 20 654 3210',
    tin: 'C0044556677',
    industry: 'Technology',
    status: 'Active',
    kycStatus: 'Verified',
    walletName: 'Kumasi Tech Hub',
    walletBalance: 52800,
    employeeCount: 12,
    lastPayroll: { period: 'March 2026', amount: 43600, date: '2026-03-31' },
    createdAt: '2024-07-15',
  },
];

export const clientEmployees = {
  'CLT-001': [
    { id: 'CE-001-1', name: 'Kwame Osei', title: 'Senior Engineer', type: 'Full-time', status: 'Active', grossSalary: 12000, bank: 'GCB Bank', accountNo: '1111222233', paye: 1400, tier1: 5.5, tier2: 5, tier3: 0, bonus: 800, allowances: 600 },
    { id: 'CE-001-2', name: 'Adwoa Frempong', title: 'Finance Officer', type: 'Full-time', status: 'Active', grossSalary: 8500, bank: 'Ecobank', accountNo: '2222333344', paye: 900, tier1: 5.5, tier2: 5, tier3: 0, bonus: 300, allowances: 400 },
    { id: 'CE-001-3', name: 'Kojo Agyei', title: 'HR Manager', type: 'Full-time', status: 'Active', grossSalary: 9800, bank: 'Fidelity Bank', accountNo: '3333444455', paye: 1050, tier1: 5.5, tier2: 5, tier3: 2, bonus: 500, allowances: 500 },
  ],
  'CLT-002': [
    { id: 'CE-002-1', name: 'Nana Ama Boateng', title: 'Production Manager', type: 'Full-time', status: 'Active', grossSalary: 10500, bank: 'Stanbic Bank', accountNo: '4444555566', paye: 1200, tier1: 5.5, tier2: 5, tier3: 0, bonus: 600, allowances: 500 },
    { id: 'CE-002-2', name: 'Kofi Atta', title: 'Quality Analyst', type: 'Full-time', status: 'Active', grossSalary: 7200, bank: 'Cal Bank', accountNo: '5555666677', paye: 750, tier1: 5.5, tier2: 5, tier3: 0, bonus: 0, allowances: 300 },
  ],
  'CLT-003': [
    { id: 'CE-003-1', name: 'Serwaa Mensah', title: 'Logistics Coordinator', type: 'Full-time', status: 'Active', grossSalary: 6800, bank: 'Access Bank', accountNo: '6666777788', paye: 700, tier1: 5.5, tier2: 5, tier3: 0, bonus: 0, allowances: 200 },
  ],
  'CLT-004': [
    { id: 'CE-004-1', name: 'Kwesi Owusu', title: 'Lead Developer', type: 'Full-time', status: 'Active', grossSalary: 13500, bank: 'GCB Bank', accountNo: '7777888899', paye: 1600, tier1: 5.5, tier2: 5, tier3: 0, bonus: 1000, allowances: 700 },
    { id: 'CE-004-2', name: 'Akua Boadu', title: 'UX Researcher', type: 'Contract', status: 'Active', grossSalary: 7500, bank: 'Ecobank', accountNo: '8888999900', paye: 0, tier1: 0, tier2: 0, tier3: 0, bonus: 0, allowances: 300 },
  ],
};

export const checklistSteps = [
  { id: 1, label: 'Complete Company Profile', status: 'Complete', path: '/settings/company' },
  { id: 2, label: 'Complete KYC & Submit to Affinity', status: 'Complete', path: '/settings/kyc' },
  { id: 3, label: 'Fund Company Account', status: 'Complete', path: '/wallet' },
  { id: 4, label: 'Invite Team Members', status: 'Complete', path: '/settings/roles' },
  { id: 5, label: 'Add Employees', status: 'In Progress', path: '/employees' },
  { id: 6, label: 'Configure Payroll Settings', status: 'Not Started', path: '/payroll' },
];
