import { GoogleGenAI } from "@google/genai";
import { TeamData } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateTeamPitch = async (team: TeamData): Promise<string> => {
  try {
    const ai = getClient();
    
    const prompt = `
      Você é um especialista em E-sports e Scout de alto nível.
      
      Crie um "Pitch de Venda" (discurso persuasivo) para apresentar o seguinte time a investidores.
      O tom deve ser profissional, estratégico e focado nos pontos fortes listados.
      
      Nome do Projeto: ${team.name}
      Resumo: ${team.summary}
      Elenco: ${team.roster.map(p => `${p.name} ${p.role ? `(${p.role})` : ''}`).join(', ')}
      Características Chave:
      ${team.characteristics.map(c => `- ${c}`).join('\n')}
      
      Estatísticas (0-100):
      - Potencial: ${team.stats.potential}
      - Custo-Benefício: ${team.stats.costEfficiency}
      - Prontidão para Vencer: ${team.stats.readiness}
      
      Instruções Específicas:
      1. Comece com um "Hook" (Gancho) atraente.
      2. Destaque por que este time é uma oportunidade única no mercado atual.
      3. Seja honesto sobre os desafios (ex: se precisa ser lapidado), mas enquadre como oportunidade.
      4. Use formatação Markdown (negrito, tópicos) para facilitar a leitura.
      5. Escreva em Português do Brasil.
      6. Máximo de 200 palavras.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Low latency preferred for UI
      }
    });

    return response.text || "Não foi possível gerar a análise no momento.";
  } catch (error) {
    console.error("Error generating pitch:", error);
    return "Erro ao conectar com a IA de Scout. Verifique a chave de API.";
  }
};