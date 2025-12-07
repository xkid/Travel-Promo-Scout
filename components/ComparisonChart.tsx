import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Promotion } from '../types';

interface ComparisonChartProps {
  promotions: Promotion[];
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ promotions }) => {
  // Extract numeric value from discount string for visualization (e.g. "50% OFF" -> 50)
  const data = promotions.map(p => {
    const match = p.discount.match(/(\d+)/);
    const value = match ? parseInt(match[0], 10) : 0;
    return {
      name: p.platform,
      discount: value,
      fullDiscount: p.discount,
      title: p.title
    };
  }).filter(d => d.discount > 0).slice(0, 10); // Show top 10 relevant deals

  const getBarColor = (platform: string) => {
    switch (platform) {
      case 'Traveloka': return '#3b82f6';
      case 'Trip.com': return '#2563eb';
      case 'Agoda': return '#9333ea';
      case 'Booking.com': return '#1e3a8a';
      case 'AirAsia': return '#dc2626';
      default: return '#64748b';
    }
  };

  if (data.length === 0) return null;

  return (
    <div className="h-64 w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Max Discount Comparison (%)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis 
            dataKey="name" 
            tick={{fontSize: 10}} 
            interval={0} 
            tickFormatter={(val) => val.split('.')[0]} // Shorten names
          />
          <YAxis hide />
          <Tooltip 
            cursor={{fill: '#f3f4f6'}}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number, name: string, props: any) => [`${props.payload.fullDiscount}`, 'Discount']}
          />
          <Bar dataKey="discount" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.name)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};