import { createContext, useContext, useState } from 'react';
import { employees as seedEmployees } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [employees, setEmployees] = useState([]);

  const register = (companyData) => {
    setCompany({
      ...companyData,
      accountType: companyData.accountType || 'company',
      kycStatus: 'Pending',
      onboardingComplete: false,
      companyProfileSaved: false,
      inviteCompleted: false,
      kycApplicationSubmitted: false,
    });
    setUser({ name: companyData.name, email: companyData.email, role: 'Super Admin' });
    setEmployees([]);
  };

  const login = (email, password) => {
    setCompany({
      name: 'Dexwin Technologies Ltd.',
      accountType: 'agency',
      kycStatus: 'Verified',
      onboardingComplete: true,
      companyProfileSaved: true,
      inviteCompleted: true,
      kycApplicationSubmitted: false,
    });
    setUser({ name: 'Super Admin', email, role: 'Super Admin' });
    setEmployees(seedEmployees.map((e) => ({ ...e })));
  };

  const completeCompanyProfile = () => {
    setCompany((c) => (c ? { ...c, companyProfileSaved: true } : c));
  };

  const completeInviteEmployees = () => {
    setCompany((c) => (c ? { ...c, inviteCompleted: true } : c));
  };

  const submitKycApplication = () => {
    setCompany((c) =>
      c ? { ...c, kycApplicationSubmitted: true, kycStatus: c.kycStatus === 'Verified' ? 'Verified' : 'Submitted' } : c
    );
  };

  /** Demo only: treat KYC as approved by Affinity without a backend. */
  const simulateKycVerified = () => {
    setCompany((c) => (c ? { ...c, kycStatus: 'Verified' } : c));
  };

  const logout = () => {
    setUser(null);
    setCompany(null);
    setEmployees([]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        company,
        employees,
        setEmployees,
        register,
        login,
        logout,
        completeCompanyProfile,
        completeInviteEmployees,
        submitKycApplication,
        simulateKycVerified,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
