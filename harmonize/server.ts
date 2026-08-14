import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

/**
 * Modelo usado nas rotas de IA. Configurável para não precisar editar o código
 * quando o Google publicar/aposentar uma versão.
 */
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

let aiClient: GoogleGenAI | null = null;
function getAI() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Health Check
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", service: "Harmonize Clinical API" });
  });

  // AI Protocol Suggestion for Facial Harmonization & Botox
  app.post("/api/ai/protocol-suggestion", async (req: Request, res: Response) => {
    try {
      const { patientData, complaints, desiredBudget } = req.body;
      const ai = getAI();

      if (!ai) {
        // Fallback realistic clinical recommendation if no API key is provided
        return res.json({
          success: true,
          isMock: true,
          plan: {
            title: "Protocolo Personalizado de Harmonização & Rejuvenescimento",
            summary: `Plano estruturado para ${patientData?.name || "Paciente"} com foco nas queixas informadas: ${complaints || "Harmonização e Linhas de Expressão"}.`,
            stages: [
              {
                phase: "Etapa 1 - Relaxamento Muscular Dinâmico",
                procedure: "Aplicação de Toxina Botulínica (Botox Full Face)",
                details: "Tratamento de terço superior: Frontal (12U), Glabela (16U) e Orbicular dos olhos (12U). Total aprox: 40-50U.",
                expectedResult: "Suavização de rugas de expressão e arqueamento sutil da cauda das sobrancelhas.",
                returnDays: 15
              },
              {
                phase: "Etapa 2 - Sustentação & Estruturação",
                procedure: "Preenchimento com Ácido Hialurônico (Malar e Mento)",
                details: "Ácido hialurônico de alto G' prime (1ml em cada malar para efeito lifting e 1ml em mento para projeção do terço inferior).",
                expectedResult: "Restauração do triângulo da juventude e definição do contorno facial.",
                returnDays: 30
              },
              {
                phase: "Etapa 3 - Banco de Colágeno & Firmeza",
                procedure: "Bioestimulador de Colágeno (Ácido Poli-L-Láctico ou Hidroxiapatita)",
                details: "1 frasco diluído em vetorização na região lateral da face e ângulo de mandíbula.",
                expectedResult: "Aumento da densidade dérmica e combate à flacidez a partir do 60º dia.",
                returnDays: 60
              }
            ],
            homeCare: [
              "Uso rigoroso de Protetor Solar FPS 50+ com cor (proteção contra luz visível).",
              "Sérum antioxidante com Vitamina C tópica e Ácido Hialurônico pela manhã.",
              "Hidratação oral intensificada (mínimo 2,5L de água por dia para potencializar o preenchimento)."
            ],
            notes: "Avaliação presencial mandatória para palpação muscular e análise de proporção facial."
          }
        });
      }

      const prompt = `Você é um médico/biomédico especialista sênior em Harmonização Orofacial e Dermatologia Estética.
Gere um protocolo clínico profissional, seguro e realista com base nas informações:
- Paciente: ${patientData?.name || "Paciente"}, Idade: ${patientData?.age || "35"}, Sexo: ${patientData?.gender || "Feminino"}
- Queixas principais e desejos: ${complaints}
- Faixa orçamentária / expectativa: ${desiredBudget || "Equilibrado / Completo"}
- Histórico clínico relevante: ${patientData?.clinicalNotes || "Nenhum histórico grave"}

Retorne APENAS um JSON estrito no seguinte formato:
{
  "title": "Nome profissional do protocolo",
  "summary": "Resumo do raciocínio clínico em 2-3 frases",
  "stages": [
    {
      "phase": "Nome da Etapa (Ex: Etapa 1 - Terço Superior)",
      "procedure": "Procedimento (Ex: Toxina Botulínica, Preenchimento Malar, etc)",
      "details": "Detalhes técnicos (unidades, ml, cânula/agulha, plano anatômico)",
      "expectedResult": "Resultado estético esperado",
      "returnDays": 15
    }
  ],
  "homeCare": [
    "Recomendação de cuidados em casa 1",
    "Recomendação 2",
    "Recomendação 3"
  ],
  "notes": "Avisos clínicos e contraindicações específicas"
}`;

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const text = response.text || "{}";
      const plan = JSON.parse(text);
      res.json({ success: true, plan });
    } catch (err: any) {
      console.error("AI Protocol Error:", err);
      res.status(500).json({ success: false, error: err?.message || "Erro ao gerar protocolo de IA" });
    }
  });

  // AI Post-Procedure Care Guidance Generator (WhatsApp ready)
  app.post("/api/ai/post-care", async (req: Request, res: Response) => {
    try {
      const { patientName, procedures, applicationDate } = req.body;
      const ai = getAI();

      if (!ai) {
        return res.json({
          success: true,
          isMock: true,
          message: `✨ *Olá, ${patientName || "Querida(o) Paciente"}!* ✨\n\nEsperamos que esteja se sentindo bem após o seu procedimento de *${procedures?.join(", ") || "Harmonização Facial / Botox"}*!\n\n📌 *Orientações importantes para as primeiras horas/dias:*\n1️⃣ Não massageie ou pressione as áreas tratadas.\n2️⃣ Não pratique exercícios físicos intensos nas próximas 24h a 48h.\n3️⃣ Evite deitar ou abaixar a cabeça nas primeiras 4 horas (essencial para o Botox).\n4️⃣ Evite exposição solar direta e calor excessivo (sauna/banhos muito quentes).\n5️⃣ Hidrate bem a pele e use protetor solar FPS 50+.\n\n⚠️ Pequenos hematomas ou inchaços são comuns e melhoram com compressas frias locais.\n\n🗓️ *Seu retorno para avaliação de retoque está previsto para daqui a 15 dias.*\n\nQualquer dúvida, estamos à sua inteira disposição! Com carinho, *Equipe Harmonize Clinical* 💜`
        });
      }

      const prompt = `Você é a coordenadora clínica de uma clínica de estética de alto padrão.
Escreva uma mensagem acolhedora, clara e altamente profissional em Português do Brasil para enviar via WhatsApp para o(a) paciente:
- Nome do Paciente: ${patientName}
- Procedimentos realizados: ${Array.isArray(procedures) ? procedures.join(", ") : procedures}
- Data de realização: ${applicationDate || "Hoje"}

A mensagem deve conter:
- Tom acolhedor e seguro
- Regras imediatas de pós-procedimento (ex: tempo sem deitar para botox, sem esforço físico, sem massagem, sem sol)
- Sinais normais esperados (edema leve, hematoma pontual) vs quando avisar a clínica
- Lembrete da data de retorno e retoque
- Formatação bonita com bullet points e emojis adequados para WhatsApp.`;

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt
      });

      res.json({ success: true, message: response.text });
    } catch (err: any) {
      console.error("AI Post Care Error:", err);
      res.status(500).json({ success: false, error: err?.message || "Erro ao gerar orientações" });
    }
  });

  // AI Anamnesis Risk & Contraindication Analyzer
  app.post("/api/ai/anamnesis-risk", async (req: Request, res: Response) => {
    try {
      const { anamnesis, intendedProcedures } = req.body;
      const ai = getAI();

      if (!ai) {
        return res.json({
          success: true,
          isMock: true,
          riskLevel: "MODERATE",
          analysis: "Anamnese analisada: Paciente apto para realização dos procedimentos com monitoramento padrão. Certificar-se da ausência de processos inflamatórios ativos na face.",
          alerts: [
            "Verificar se há histórico de herpes labial caso haja preenchimento em lábios (profilaxia com aciclovir recomendada se positivo).",
            "Suspender aspirina ou anticoagulantes (se autorizado pelo médico assistente) para minimizar risco de hematomas.",
            "Confirmar que o paciente não está em período de gestação ou amamentação (contraindicação absoluta para toxina botulínica)."
          ]
        });
      }

      const prompt = `Você é um auditor médico especialista em segurança do paciente em procedimentos estéticos injetáveis (Toxina Botulínica, Ácido Hialurônico, Bioestimuladores, Fios PDO).
Analise os dados da Anamnese:
${JSON.stringify(anamnesis, null, 2)}
Procedimentos planejados: ${JSON.stringify(intendedProcedures, null, 2)}

Avalie riscos de reações adversas, contraindicações absolutas e relativas, e retorne APENAS um JSON no formato:
{
  "riskLevel": "LOW" | "MODERATE" | "HIGH" | "CRITICAL",
  "summary": "Resumo clínico de segurança em 2 frases",
  "alerts": [
    "Alerta clínico 1",
    "Alerta clínico 2"
  ],
  "precautions": [
    "Conduta preventiva recomendada 1",
    "Conduta 2"
  ],
  "eligibleForTreatment": true | false
}`;

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json({ success: true, ...parsed });
    } catch (err: any) {
      console.error("AI Anamnesis Risk Error:", err);
      res.status(500).json({ success: false, error: err?.message || "Erro na análise de anamnese" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');

    // O service worker nunca pode ser servido de cache: é ele quem controla a
    // atualização de todo o resto. Um sw.js preso no cache trava o app numa
    // versão antiga indefinidamente.
    app.get('/sw.js', (_req: Request, res: Response) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Service-Worker-Allowed', '/');
      res.sendFile(path.join(distPath, 'sw.js'));
    });

    app.use(
      express.static(distPath, {
        setHeaders: (res, filePath) => {
          if (filePath.includes(`${path.sep}assets${path.sep}`)) {
            // Bundles do Vite têm hash no nome — seguro cachear para sempre.
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          } else if (filePath.endsWith('index.html') || filePath.endsWith('.webmanifest')) {
            res.setHeader('Cache-Control', 'no-cache');
          }
        },
      }),
    );

    app.get('*', (_req: Request, res: Response) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Harmonize Clinical Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
