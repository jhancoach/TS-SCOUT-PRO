import { TeamData } from './types';

export const TEAMS: TeamData[] = [
  {
    id: 'team1',
    name: 'PROJECT: EVOLUTION',
    themeColor: '#10b981', // Emerald
    summary: 'Aposta de Alto Valor / Baixo Custo',
    roster: [
      { name: 'BLACK' },
      { name: 'FNX' },
      { name: 'GUIME' },
      { name: 'ERICKING' },
      { name: 'PROZIN' }
    ],
    characteristics: [
      'Top 6 (WB Split 2)',
      'Time Agressivo',
      'Margem de evolução GIGANTE',
      'Potencial de aprendizado',
      'Custo Baixo',
      'Subestimado pelo mercado'
    ],
    stats: {
      potential: 95,
      aggression: 90,
      experience: 40,
      costEfficiency: 95, // Very cheap relative to potential
      readiness: 70
    }
  },
  {
    id: 'team2',
    name: 'SQUAD: STRUCTURE',
    themeColor: '#3b82f6', // Blue
    summary: 'Experiência e Liderança',
    roster: [
      { name: 'WLIU', role: 'CPT / Bomba', notes: 'Controle de jogo, já jogou mundial' },
      { name: 'PITBULL', role: 'Rush 1', notes: 'Experiência, Agressividade' },
      { name: 'LUAN', role: 'Rush 2', notes: 'Talento, Quebra de Call' },
      { name: 'ERICKING', role: 'Sniper', notes: 'Posicionamento' },
      { name: 'BYTE33', role: 'Support/Flex' }
    ],
    characteristics: [
      'Alta Experiência',
      'Captain Promissor (Mundial)',
      'WLIU finalmente com estrutura',
      'Resultado Mediano Garantido',
      'Controle de Jogo'
    ],
    stats: {
      potential: 70,
      aggression: 75,
      experience: 90,
      costEfficiency: 60,
      readiness: 85
    }
  },
  {
    id: 'team3',
    name: 'INITIATIVE: SPARK',
    themeColor: '#f59e0b', // Amber
    summary: 'Longo Prazo / Desenvolvimento',
    roster: [
      { name: 'ISOPOR21' },
      { name: 'DENE' },
      { name: 'KAZUMA' },
      { name: 'GN9' },
      { name: 'TBA', role: 'Vaga Aberta' } 
    ],
    characteristics: [
      'Foco em Lapidar',
      'Necessidade de tempo',
      'Sem potencial de resultado rápido',
      'Margem de aprendizado'
    ],
    stats: {
      potential: 60,
      aggression: 50,
      experience: 30,
      costEfficiency: 80,
      readiness: 20
    }
  }
];