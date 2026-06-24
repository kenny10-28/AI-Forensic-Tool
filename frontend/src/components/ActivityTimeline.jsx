import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { Activity } from 'lucide-react';

const ActivityTimeline = ({ data = [] }) => {
  // Transform data for timeline visualization
  const timelineData = data.map((entry, index) => ({
    index,
    activity: 1,
    isAnomaly: entry.threat_score > 0.7
  }));

  return (
    <div className="bg-forensic-gray rounded-lg p-6 border border-forensic-slate">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-security-blue" />
        <h3 className="text-xl font-semibold">Activity Timeline</h3>
      </div>
      
      {timelineData.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3142" />
            <XAxis 
              dataKey="index" 
              stroke="#6b7280"
              label={{ value: 'Log Entry Index', position: 'insideBottom', offset: -5 }}
            />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a1f2e', 
                border: '1px solid #2a3142',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="activity" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={(props) => {
                const { cx, cy, payload } = props;
                return payload.isAnomaly ? (
                  <circle cx={cx} cy={cy} r={4} fill="#ef4444" />
                ) : null;
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-64 flex items-center justify-center text-gray-400">
          No activity data available
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;
