'use client';

import React, { useState } from 'react';

interface EmailInputProps {
  onVerify: (emails: string[]) => void;
}

const EmailInput: React.FC<EmailInputProps> = ({ onVerify }) => {
  const [emails, setEmails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailList = emails.split('\n').map(email => email.trim()).filter(email => email);
    onVerify(emailList);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <textarea
        value={emails}
        onChange={(e) => setEmails(e.target.value)}
        placeholder="Enter email addresses, one per line"
        className="w-full p-4 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 transition duration-150 ease-in-out"
        rows={8}
      />
      <button 
        type="submit" 
        className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out transform hover:scale-105"
      >
        Verify Emails
      </button>
    </form>
  );
};

export default EmailInput;