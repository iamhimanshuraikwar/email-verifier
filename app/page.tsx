'use client';

import { useState } from 'react';
import EmailInput from './components/EmailInput';
import EmailVerificationLoader from './components/EmailVerificationLoader';
import TabbedVerificationResults from './components/TabbedVerificationResults';

export default function Home() {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [emailsToVerify, setEmailsToVerify] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleVerify = async (emails: string[]) => {
    setIsLoading(true);
    setEmailsToVerify(emails.length);
    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails }),
      });
      const data = await response.json();
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Verification failed:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Valid,Reason,Details\n"
      + results.map(r => 
        `${r.email},${r.isValid},${r.reason},${r.isCatchAll ? 'Catch-all' : ''}${r.isDisposable ? 'Disposable' : ''}${r.isFreeProvider ? 'Free Provider' : ''}${r.isRole ? 'Role Account' : ''}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "verified_emails.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center text-indigo-900 mb-8">Email Verifier</h1>
        <div className="bg-white shadow-xl rounded-xl p-8">
          {!showResults ? (
            <>
              <EmailInput onVerify={handleVerify} />
              {isLoading && <EmailVerificationLoader totalEmails={emailsToVerify} />}
            </>
          ) : (
            <>
              <TabbedVerificationResults results={results} />
              <div className="mt-8 text-center">
                <button 
                  onClick={handleDownload}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out mr-4"
                >
                  Download Results
                </button>
                <button 
                  onClick={() => setShowResults(false)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
                >
                  Verify More Emails
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}