'use client';

import { useEffect, useState, useRef } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

interface EntropyData {
  timestamp: string;
  entropy: number;
  complexity: number;
}

export function EntropyChart() {
  const [data, setData] = useState<EntropyData[]>([]);
  
  useEffect(() => {
    // Mock Data Generator for Entropy
    const interval = setInterval(() => {
      const now = new Date();
      const newPoint: EntropyData = {
        timestamp: now.toLocaleTimeString(),
        entropy: Math.random() * 0.5 + 0.2, // Random between 0.2 and 0.7
        complexity: Math.random() * 100
      };
      
      setData(prev => {
        const next = [...prev, newPoint];
        return next.length > 30 ? next.slice(-30) : next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis 
            dataKey="timestamp" 
            stroke="#666" 
            tick={{fontSize: 10}}
            interval="preserveStartEnd"
          />
          <YAxis stroke="#666" domain={[0, 1]} tick={{fontSize: 10}} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
            itemStyle={{ color: '#fff' }}
          />
          <Line 
            type="monotone" 
            dataKey="entropy" 
            stroke="#ec4899" 
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
