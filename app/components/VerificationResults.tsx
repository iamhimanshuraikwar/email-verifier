import React from 'react';

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

interface VerificationResultsProps {
  results: Result[];
}

const VerificationResults: React.FC<VerificationResultsProps> = ({ results }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {results.map((result, index) => (
            <tr key={index} className="hover:bg-gray-50 transition duration-150 ease-in-out">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${result.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {result.isValid ? 'Valid' : 'Invalid'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.reason}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {result.isCatchAll && <p className="text-yellow-600">Catch-all domain</p>}
                {result.isDisposable && <p className="text-orange-600">Disposable email</p>}
                {result.isFreeProvider && <p className="text-blue-600">Free email provider</p>}
                {result.isRole && <p className="text-purple-600">Role account</p>}
                {result.suggestedCorrection && <p className="text-indigo-600">Suggested: {result.suggestedCorrection}</p>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VerificationResults;