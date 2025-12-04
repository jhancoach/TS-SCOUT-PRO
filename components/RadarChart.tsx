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
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 600 }} /> {/* Zinc-400 */}
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Stats"
            dataKey="A"
            stroke={color}
            strokeWidth={3}
            fill={color}
            fillOpacity={0.3}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff' }}
            itemStyle={{ color: color, fontWeight: 'bold', fontFamily: 'Rajdhani' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};