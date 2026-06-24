import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { AlertTriangle } from 'lucide-react';

const ThreatMeter = ({ threatScore = 0 }) => {
  const getColor = () => {
    if (threatScore < 30) return '#10b981'; // safe-green
    if (threatScore < 70) return '#f59e0b'; // warning-yellow
    return '#ef4444'; // threat-red
  };

  const data = [
    { name: 'Threat', value: threatScore },
    { name: 'Safe', value: 100 - threatScore }
  ];

  const COLORS = [getColor(), '#2a3142'];

  return (
    <div className="bg-forensic-gray rounded-lg p-6 border border-forensic-slate">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-security-blue" />
        <h3 className="text-xl font-semibold">Threat Level</h3>
      </div>
      
      <div className="flex items-center justify-center">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-4xl font-bold" style={{ color: getColor() }}>
          {threatScore.toFixed(1)}%
        </p>
        <p className="text-sm text-gray-400 mt-2">
          {threatScore < 30 ? 'Low Risk' : threatScore < 70 ? 'Medium Risk' : 'High Risk'}
        </p>
      </div>
    </div>
  );
};

export default ThreatMeter;
