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
      { name: 'PROZIN' },
      { name: 'COACH BRN / PUTSGRILO', role: 'COACH' }
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
    name: 'PROJECT: LEGACY',
    themeColor: '#8b5cf6', // Violet
    summary: 'Experiência, Títulos e Visibilidade',
    roster: [
      { name: 'CAUAN' },
      { name: 'MOTOVEA' },
      { name: 'LOST' },
      { name: 'NODA' },
      { name: 'PROXX', role: 'POSSIBILIDADE' },
      { name: 'COACH PUTSGRILO', role: 'COACH' }
    ],
    characteristics: [
      'Experiência Comprovada',
      'Histórico de Títulos',
      'Alta Visibilidade de Mídia',
      'Controle de Jogo Absoluto',
      'Respeito dentro e fora do jogo'
    ],
    stats: {
      potential: 85,
      aggression: 65, // Mais controle, menos agressividade desenfreada
      experience: 98,
      costEfficiency: 60, // Jogadores renomados tendem a custar mais
      readiness: 95 // Prontos para jogar agora
    }
  },
  {
    id: 'team3',
    name: 'PROJECT: ASCENSION',
    themeColor: '#f97316', // Orange
    summary: 'Agressividade, Bala e Potencial Tático',
    roster: [
      { name: 'COACH BRN / PUTSGRILO', role: 'ESTATEGISTA', notes: 'Foco tático em treinos/camps' },
      { name: 'WLIU', role: 'CPT', notes: 'Liderança em progressão' },
      { name: 'PITBULL', role: 'VETERANO', notes: 'Experiência' },
      { name: 'THEUS7', notes: '6º Melhor Rush Split 2 / Quebra Call' },
      { name: 'HONEY', role: 'FLEX', notes: 'Sniper virando Rush' },
      { name: 'BYTE 33' }
    ],
    characteristics: [
      'Wliu e Brn: Fome de estrutura',
      'Time extremamente agressivo (Bala)',
      'Excelente em Quebras de Call',
      'Honey: Potencial de adaptação',
      'Brn: Perfil Estrategista (Treinos)',
      'Custo Baixo para Médio'
    ],
    stats: {
      potential: 92,
      aggression: 98,
      experience: 65,
      costEfficiency: 80,
      readiness: 82
    }
  }
];