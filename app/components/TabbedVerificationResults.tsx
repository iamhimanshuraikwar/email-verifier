import React, { useState, useMemo } from 'react';
import VerificationResults from './VerificationResults';

interface Result {
  email: string;
  isValid: boolean;
  reason: string;
  isCatchAll?: boolean;
  isDisposable?: boolean;
  isFreeProvider?: boolean;
  isRole?: boolean;
  suggestedCorrection?: string;
}

interface TabbedVerificationResultsProps {
  results: Result[];
}

const TabbedVerificationResults: React.FC<TabbedVerificationResultsProps> = ({ results }) => {
  const [activeTab, setActiveTab] = useState('valid');

  const tabs = [
    { id: 'valid', label: 'Valid Emails', description: 'Safe to send email' },
    { id: 'risky', label: 'Risky Emails', description: 'Catch-all domains, may bounce back' },
    { id: 'unknown', label: 'Unknown Emails', description: "Couldn't determine if these exist" },
    { id: 'invalid', label: 'Invalid Emails', description: "Don't exist, don't email them" },
    { id: 'disposable', label: 'Disposable Emails', description: 'Temporary emails, short-lived' },
  ];

  const filteredResults = useMemo(() => {
    return results.filter(result => {
      switch (activeTab) {
        case 'valid':
          return result.isValid && !result.isCatchAll;
        case 'risky':
          return result.isCatchAll;
        case 'unknown':
          return result.reason === "Couldn't verify";
        case 'invalid':
          return !result.isValid && !result.isDisposable;
        case 'disposable':
          return result.isDisposable;
        default:
          return false;
      }
    });
  }, [results, activeTab]);

  return (
    <div className="mt-12">
      <div className="bg-indigo-100 rounded-t-lg">
        <nav className="flex" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 py-4 px-1 text-center font-medium text-sm rounded-t-lg transition duration-150 ease-in-out
                ${activeTab === tab.id
                  ? 'bg-white text-indigo-700 shadow-inner'
                  : 'text-indigo-600 hover:bg-indigo-200'}
              `}
            >
              <span className="block text-base mb-1">{tab.label}</span>
              <span className="block text-xs">{tab.description}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="bg-white rounded-b-lg shadow-md">
        <VerificationResults results={filteredResults} />
      </div>
    </div>
  );
};

export default TabbedVerificationResults;