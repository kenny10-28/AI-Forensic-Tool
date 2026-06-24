import React, { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';

const EvidenceTable = ({ data = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(entry => 
    Object.values(entry).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="bg-forensic-gray rounded-lg p-6 border border-forensic-slate">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-security-blue" />
          <h3 className="text-xl font-semibold">Evidence Log Entries</h3>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-forensic-dark border border-forensic-slate rounded-lg focus:outline-none focus:border-security-blue"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredData.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-forensic-slate">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                {Object.keys(filteredData[0])
                  .filter(key => !['threat_score', 'explanation'].includes(key))
                  .map(key => (
                    <th key={key} className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                      {key.replace(/_/g, ' ').toUpperCase()}
                    </th>
                  ))}
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Explanation</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((entry, index) => {
                const isAnomaly = entry.threat_score !== undefined;
                return (
                  <tr 
                    key={index} 
                    className={`border-b border-forensic-slate hover:bg-forensic-slate transition-colors ${
                      isAnomaly ? '' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      {isAnomaly ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-threat-red bg-opacity-20 text-threat-red rounded text-xs font-semibold">
                          <AlertCircle className="w-3 h-3" />
                          FLAGGED
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 bg-safe-green bg-opacity-20 text-safe-green rounded text-xs font-semibold">
                          NORMAL
                        </span>
                      )}
                    </td>
                    {Object.entries(entry)
                      .filter(([key]) => !['threat_score', 'explanation'].includes(key))
                      .map(([key, value]) => (
                        <td key={key} className="py-3 px-4 text-sm">
                          {String(value)}
                        </td>
                      ))}
                    <td className="py-3 px-4 text-sm text-gray-400">
                      {entry.explanation || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-400">
            {searchTerm ? 'No matching entries found' : 'No evidence data available'}
          </div>
        )}
      </div>
    </div>
  );
};

export default EvidenceTable;
