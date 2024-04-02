import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';

const LineCharts = ({ randomData, fastingData }) => {
  return (
    <ResponsiveContainer width={800} height={400} style={{backgroundColor:"white"}}>
      <LineChart>
        <defs>
          <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="green" stopOpacity={0.8} />
            <stop offset="100%" stopColor="green" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="yellowGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="yellow" stopOpacity={0.8} />
            <stop offset="100%" stopColor="yellow" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="red" stopOpacity={0.8} />
            <stop offset="100%" stopColor="red" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="blue" stopOpacity={0.8} />
            <stop offset="100%" stopColor="blue" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" />
        <YAxis domain={[0, 400]} />
        <Tooltip />
        <Legend />
        <ReferenceLine y={90} stroke="green" label="0-90" />
        <ReferenceLine y={140} stroke="yellow" label="90-140" />
        <ReferenceLine y={400} stroke="red" label="140+" />

        {/* Line for random blood count */}
        <Line
          type="monotone"
          dataKey="sugarcount"
          data={randomData}
          name="Random Blood Count"
          stroke="brown"
          strokeWidth={2}
          fill="url(#greenGradient)"
          fillOpacity={0.8}
          activeDot={{ r: 8 }}
        />

        {/* Line for fasting blood count */}
        <Line
          type="monotone"
          dataKey="sugarcount"
          data={fastingData}
          name="Fasting Blood Count"
          stroke="blue"
          strokeWidth={2}
          fill="url(#blueGradient)"
          fillOpacity={0.8}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineCharts;
