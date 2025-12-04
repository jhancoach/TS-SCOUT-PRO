import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { TeamStats } from '../types';

interface StatsChartProps {
  stats: TeamStats;
  color: string;
}

export const StatsChart: React.FC<StatsChartProps> = ({ stats, color }) => {
  const data = [
    { subject: 'Potencial', A: stats.potential, fullMark: 100 },
    { subject: 'Agressividade', A: stats.aggression, fullMark: 100 },
    { subject: 'Experiência', A: stats.experience, fullMark: 100 },
    { subject: 'Custo-Benefício', A: stats.costEfficiency, fullMark: 100 },
    { subject: 'Prontidão', A: stats.readiness, fullMark: 100 },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#3f3f46" /> {/* Zinc-700 */}
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 700, fontFamily: 'Rajdhani' }} 
          /> {/* Zinc-400 */}
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Stats"
            dataKey="A"
            stroke={color}
            strokeWidth={3}
            fill={color}
            fillOpacity={0.3}
            activeDot={{ r: 6, fill: color, stroke: '#fff', strokeWidth: 2 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#09090b', 
              borderColor: '#27272a', 
              color: '#fff',
              borderRadius: '4px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
            }}
            itemStyle={{ color: color, fontWeight: 'bold', fontFamily: 'Rajdhani' }}
            cursor={{ stroke: '#52525b', strokeWidth: 1 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};