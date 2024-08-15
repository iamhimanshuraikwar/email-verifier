import React, { useState, useEffect } from 'react';

interface EmailVerificationLoaderProps {
  totalEmails: number;
}

const EmailVerificationLoader: React.FC<EmailVerificationLoaderProps> = ({ totalEmails }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [progress, setProgress] = useState(0);

  // Assume 5 emails per second (as per our rate limit)
  const estimatedTotalTime = Math.ceil(totalEmails / 5);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prevTime) => {
        const newTime = prevTime + 1;
        if (newTime >= estimatedTotalTime) {
          clearInterval(timer);
          return estimatedTotalTime;
        }
        return newTime;
      });

      setProgress((prevProgress) => {
        const newProgress = (elapsedTime / estimatedTotalTime) * 100;
        return Math.min(newProgress, 100);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [estimatedTotalTime, elapsedTime]);

  return (
    <div className="mt-12 text-center">
      <div className="mb-6">
        <svg className="w-16 h-16 inline-block animate-spin text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <p className="text-2xl font-bold mb-4 text-indigo-700">Verifying Emails</p>
      <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
        <div 
          className="bg-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-lg text-gray-700 mb-2">
        Estimated time remaining: <span className="font-semibold">{Math.max(0, estimatedTotalTime - elapsedTime)} seconds</span>
      </p>
      <p className="text-lg text-gray-700">
        Processed <span className="font-semibold">{Math.min(totalEmails, elapsedTime * 5)}</span> out of <span className="font-semibold">{totalEmails}</span> emails
      </p>
    </div>
  );
};

export default EmailVerificationLoader;