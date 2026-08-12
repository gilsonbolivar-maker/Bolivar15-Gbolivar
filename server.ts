import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ limit: "25mb", extended: true }));

  // Initialize Gemini AI client lazily/safely
  const getAi = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("A chave GEMINI_API_KEY não está configurada nos segredos.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Route: Gerar Guia/Texto de Encaminhamento Técnico com IA
  app.post("/api/ai/encaminhamento", async (req, res) => {
    try {
      const { pacienteNome, motivo, setorOrigem, setorDestino, prioridade, observacoes } = req.body;
      const ai = getAi();

      const prompt = `Você é um assistente técnico especializado para serviços de Saúde e Assistência Social (CRAS, CREAS, UBS, CAPS, Clínicas).
Elabore um texto formal de Encaminhamento Institucional para o usuário/paciente.

Dados:
- Nome do Usuário: ${pacienteNome || "Paciente"}
- Setor de Origem: ${setorOrigem || "Serviço de Acolhimento"}
- Setor/Especialidade de Destino: ${setorDestino || "Especialidade Médica/Psicossocial"}
- Nível de Prioridade: ${prioridade || "Rotina"}
- Motivo Principal / Demanda: ${motivo}
- Observações / Contexto: ${observacoes || "Nenhuma observação adicional"}

Gere a justificativa técnica estruturada contendo:
1. Resumo da Demanda / Hipótese Diagnóstica ou Necessidade Social
2. Justificativa do Encaminhamento para o setor solicitado
3. Recomendações e orientações iniciais para a equipe receptora.

Responda em português formal, claro, humanizado e direto ao ponto (cerca de 2 a 3 parágrafos curtos).`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      res.json({ textoEncaminhamento: response.text });
    } catch (error: any) {
      console.error("Erro na API de Encaminhamento:", error);
      res.status(500).json({ error: error.message || "Falha ao gerar texto de encaminhamento com IA." });
    }
  });

  // API Route: Gerar Pauta/Plano de Sessão de Grupo
  app.post("/api/ai/pauta-grupo", async (req, res) => {
    try {
      const { nomeGrupo, categoria, temaSessao, objetivo, duracaoMinutos } = req.body;
      const ai = getAi();

      const prompt = `Você é um facilitador de grupos terapêuticos e socioeducativos no âmbito da Saúde e Assistência Social.
Crie um roteiro/pauta estruturada para a próxima sessão de atendimento em grupo.

Dados do Grupo:
- Nome do Grupo: ${nomeGrupo}
- Categoria: ${categoria || "Socioeducativo / Terapêutico"}
- Tema da Sessão: ${temaSessao}
- Objetivo Principal: ${objetivo || "Acolhimento e troca de experiências"}
- Duração Estimada: ${duracaoMinutos || 60} minutos

Estruture a pauta em formato estruturado em texto com os seguintes tópicos:
1. Acolhimento e Quebra-Gelo (10 min)
2. Atividade Central / Dinâmica de Grupo (30 min)
3. Roda de Conversa e Compartilhamento (15 min)
4. Fechamento e Tarefa para Casa / Reflexão Final (5 min)
5. Recomendações para o Facilitador.

Escreva em português claro, acolhedor e com orientações práticas.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      res.json({ pautaGrupo: response.text });
    } catch (error: any) {
      console.error("Erro na API de Pauta de Grupo:", error);
      res.status(500).json({ error: error.message || "Falha ao gerar pauta de grupo com IA." });
    }
  });

  // API Route: Síntese de Prontuário / Histórico do Usuário
  app.post("/api/ai/sintese-prontuario", async (req, res) => {
    try {
      const { pacienteNome, historicoAtendimentos, encaminhamentos, grupos } = req.body;
      const ai = getAi();

      const prompt = `Você é um parecerista técnico em atendimento multidisciplinar.
Analise o histórico e elabore um resumo conciso da trajetória do usuário no serviço.

Usuário: ${pacienteNome}

Atendimentos Individuais (${historicoAtendimentos?.length || 0}):
${JSON.stringify(historicoAtendimentos || [], null, 2)}

Participação em Grupos (${grupos?.length || 0}):
${JSON.stringify(grupos || [], null, 2)}

Encaminhamentos (${encaminhamentos?.length || 0}):
${JSON.stringify(encaminhamentos || [], null, 2)}

Forneça um resumo executivo com:
- Panorama Geral do Usuário
- Principais Demandas Identificadas
- Evolução no Serviço e Recomendações Futuras

Formate em linguagem clínica/técnica adequada, em tópicos legíveis.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      res.json({ sintese: response.text });
    } catch (error: any) {
      console.error("Erro na API de Síntese:", error);
      res.status(500).json({ error: error.message || "Falha ao sintetizar prontuário com IA." });
    }
  });

  // API Route: Leitura de Papéis e Documentos por IA (OCR + Extração Estruturada)
  app.post("/api/ai/ocr-documento", async (req, res) => {
    try {
      const { imageBase64, mimeType = "image/jpeg" } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: "A imagem ou documento é obrigatório." });
      }

      const ai = getAi();
      const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, "");

      const prompt = `Você é um leitor óptico e especialista em processamento de documentos para o sistema PsicoEscolar 2.0 (Saúde, Psicologia e Assistência Social / SUAS / SUS / CRAS / CREAS / UBS / CAPS / Clínicas).

Analise atentamente o documento fornecido na imagem (pode ser RG, CNH, CPF, Cartão SUS, Ficha de Anamnese, Prontuário manuscrito ou impresso, Receita, Laudo Médico, Guia de Encaminhamento, Ficha de Acolhimento, etc).

Sua tarefa é extrair e estruturar com alta precisão todos os dados identificados no formulário:

Campos para Aluno / Paciente:
- nome (nome completo)
- nomeSocial (nome social se houver)
- cpf (número do CPF)
- rg (número do RG)
- cartaoSus (número do Cartão SUS)
- dataNascimento (no formato YYYY-MM-DD se possível, ou ex: 1990-05-20)
- sexo ("Masculino", "Feminino" ou "Outro")
- telefone (telefone ou celular com DDD)
- email (e-mail)
- endereco (rua, número, complemento)
- bairro (bairro)
- cidade (cidade e estado)
- nomeMae (nome da mãe)
- profissoes (profissão ou ocupação)
- observacoesAlergias (observações clínicas, alergias, medicações de uso contínuo)
- vulnerabilidades (lista de vulnerabilidades identificadas, como: "Baixa Renda", "Idoso(a)", "Gestante", "PCD (Pessoa com Deficiência)", "Isolamento Social", "Desemprego", "Pessoa em Situação de Rua", "Violência Doméstica / Ameaça", "Uso de Substâncias Psicoativas", "Sobrecarga Emocional")
- beneficiosSociais (lista de benefícios sociais identificados, como: "Bolsa Família", "BPC / LOAS", "Tarifa Social de Energia", "Auxílio Gás", "Aluguel Social")

Campos para Atendimento Individual:
- atendimentoDemanda (queixa principal, motivo da consulta ou demanda do aluno)
- atendimentoNotas (evolução no prontuário, anotações técnicas, escuta qualificada, condutas)
- atendimentoTipo ("Acolhimento", "Consulta Terapêutica", "Atendimento Social", "Visita Domiciliar", "Teleatendimento", "Retorno")
- atendimentoCid (hipótese diagnóstica ou CID-10, ex: F41.1)
- profissionalNome (nome do profissional)
- profissionalCargo (cargo ou especialidade)

Campos para Grupo de Atendimento:
- grupoNome (nome do grupo)
- grupoCategoria ("Grupo Terapêutico", "Socioeducativo", "Apoio Psicológico", "Grupo de Convivência", "Prevenção do Tabagismo", "Grupo de Gestantes", "Oficina de Artes e Habilidades")
- grupoDescricao (objetivo e público-alvo do grupo)
- grupoLocal (sala, auditório ou local)
- grupoHorario (dia e horário das reuniões)

Campos para Encaminhamento Intersetorial:
- encSetorOrigem (serviço de origem)
- encProfissional (profissional emissor)
- encSetorDestino (serviço/setor de destino, ex: CAPS, CREAS, UBS, Hospital)
- encEspecialidade (especialidade solicitada, ex: Psiquiatria, Neurologia)
- encPrioridade ("Rotina", "Prioritário" ou "Urgente")
- encMotivo (motivo principal do encaminhamento)
- encJustificativa (justificativa técnica detalhada)

Defina também em 'tipoDetectado' a categoria principal do documento: "paciente", "atendimento", "grupo" ou "encaminhamento".
Escreva em 'resumoLeitura' um resumo amigável de 1 a 2 frases destacando os principais dados identificados.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: {
          parts: [
            {
              inlineData: {
                mimeType,
                data: cleanBase64,
              },
            },
            {
              text: prompt,
            },
          ],
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              tipoDetectado: { type: Type.STRING },
              resumoLeitura: { type: Type.STRING },
              // Aluno / Paciente
              nome: { type: Type.STRING },
              nomeSocial: { type: Type.STRING },
              cpf: { type: Type.STRING },
              rg: { type: Type.STRING },
              cartaoSus: { type: Type.STRING },
              dataNascimento: { type: Type.STRING },
              sexo: { type: Type.STRING },
              telefone: { type: Type.STRING },
              email: { type: Type.STRING },
              endereco: { type: Type.STRING },
              bairro: { type: Type.STRING },
              cidade: { type: Type.STRING },
              nomeMae: { type: Type.STRING },
              profissoes: { type: Type.STRING },
              observacoesAlergias: { type: Type.STRING },
              vulnerabilidades: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              beneficiosSociais: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              // Atendimento
              atendimentoDemanda: { type: Type.STRING },
              atendimentoNotas: { type: Type.STRING },
              atendimentoTipo: { type: Type.STRING },
              atendimentoCid: { type: Type.STRING },
              profissionalNome: { type: Type.STRING },
              profissionalCargo: { type: Type.STRING },
              // Grupo
              grupoNome: { type: Type.STRING },
              grupoCategoria: { type: Type.STRING },
              grupoDescricao: { type: Type.STRING },
              grupoLocal: { type: Type.STRING },
              grupoHorario: { type: Type.STRING },
              // Encaminhamento
              encSetorOrigem: { type: Type.STRING },
              encProfissional: { type: Type.STRING },
              encSetorDestino: { type: Type.STRING },
              encEspecialidade: { type: Type.STRING },
              encPrioridade: { type: Type.STRING },
              encMotivo: { type: Type.STRING },
              encJustificativa: { type: Type.STRING },
            },
          },
        },
      });

      const parsedData = JSON.parse(response.text || "{}");
      res.json({ success: true, data: parsedData });
    } catch (error: any) {
      console.error("Erro na leitura de documento por IA:", error);
      res.status(500).json({ error: error.message || "Falha ao escanear documento com IA." });
    }
  });

  // Serve Vite in development, static build in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server rodando na porta ${PORT}`);
  });
}

startServer();
