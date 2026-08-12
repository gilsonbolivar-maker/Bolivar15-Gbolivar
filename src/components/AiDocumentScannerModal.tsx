import React, { useState, useRef } from "react";
import {
  X,
  Sparkles,
  Camera,
  Upload,
  CheckCircle2,
  FileText,
  Loader2,
  RefreshCw,
  AlertCircle,
  FileCheck,
  Copy,
  Check,
  Zap,
  AlignLeft,
  ZoomIn,
  Maximize2,
} from "lucide-react";
import Tesseract from "tesseract.js";

export interface ExtractedDocumentData {
  tipoDetectado?: string;
  resumoLeitura?: string;
  rawOcrText?: string;
  // Aluno
  nome?: string;
  nomeSocial?: string;
  cpf?: string;
  rg?: string;
  cartaoSus?: string;
  dataNascimento?: string;
  sexo?: "Masculino" | "Feminino" | "Outro" | string;
  telefone?: string;
  email?: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  nomeMae?: string;
  profissoes?: string;
  observacoesAlergias?: string;
  vulnerabilidades?: string[];
  beneficiosSociais?: string[];
  // Atendimento
  atendimentoDemanda?: string;
  atendimentoNotas?: string;
  atendimentoTipo?: string;
  atendimentoCid?: string;
  profissionalNome?: string;
  profissionalCargo?: string;
  // Grupo
  grupoNome?: string;
  grupoCategoria?: string;
  grupoDescricao?: string;
  grupoLocal?: string;
  grupoHorario?: string;
  // Encaminhamento
  encSetorOrigem?: string;
  encProfissional?: string;
  encSetorDestino?: string;
  encEspecialidade?: string;
  encPrioridade?: string;
  encMotivo?: string;
  encJustificativa?: string;
}

interface AiDocumentScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetFormName?: string;
  onDataExtracted: (data: ExtractedDocumentData) => void;
}

const SAMPLE_DOCUMENTS = [
  {
    label: "📄 Ficha RG / Aluno (Exemplo)",
    desc: "Simula foto de documento de identidade / RG e CPF de Maria Oliveira",
    svgText: `
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
        <rect width="600" height="400" rx="16" fill="#F8FAFC"/>
        <rect x="20" y="20" width="560" height="360" rx="12" fill="#FFFFFF" stroke="#0284C7" stroke-width="3"/>
        <rect x="20" y="20" width="560" height="60" fill="#0284C7"/>
        <text x="40" y="55" fill="#FFFFFF" font-family="sans-serif" font-weight="bold" font-size="22">REPÚBLICA FEDERATIVA DO BRASIL - REGISTRO GERAL</text>
        
        <rect x="50" y="100" width="120" height="150" fill="#E2E8F0" rx="8"/>
        <circle cx="110" cy="150" r="35" fill="#94A3B8"/>
        <path d="M70 230 C 70 190, 150 190, 150 230" fill="#94A3B8"/>
        
        <text x="200" y="125" fill="#1E293B" font-family="sans-serif" font-weight="bold" font-size="16">NOME: MARIA OLIVEIRA DA SILVA</text>
        <text x="200" y="155" fill="#475569" font-family="sans-serif" font-size="14">CPF: 123.456.789-00 | RG: 12.345.678-9</text>
        <text x="200" y="185" fill="#475569" font-family="sans-serif" font-size="14">NASCIMENTO: 15/08/1988 | SEXO: FEMININO</text>
        <text x="200" y="215" fill="#475569" font-family="sans-serif" font-size="14">MÃE: TEREZA DE OLIVEIRA SILVA</text>
        <text x="200" y="245" fill="#475569" font-family="sans-serif" font-size="14">ENDEREÇO: RUA DAS PALMEIRAS, 450 - JD. PRIMAVERA</text>
        <text x="200" y="275" fill="#475569" font-family="sans-serif" font-size="14">CIDADE: SÃO PAULO - SP | CARTÃO SUS: 701234567890123</text>
        <text x="200" y="305" fill="#475569" font-family="sans-serif" font-size="14">TELEFONE: (11) 98765-4321</text>
        <text x="50" y="350" fill="#0284C7" font-family="sans-serif" font-weight="bold" font-size="13">VULNERABILIDADES: Baixa Renda, Idoso(a), Desemprego</text>
      </svg>
    `,
  },
  {
    label: "📋 Prontuário de Atendimento (Exemplo)",
    desc: "Simula receita / formulário manuscrito de atendimento clínico",
    svgText: `
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
        <rect width="600" height="400" rx="16" fill="#FFFBEB"/>
        <rect x="20" y="20" width="560" height="360" rx="12" fill="#FFFFFF" stroke="#D97706" stroke-width="3"/>
        <text x="40" y="60" fill="#B45309" font-family="serif" font-weight="bold" font-size="20">CENTRO DE ATENÇÃO PSICOSSOCIAL - CAPS II</text>
        <text x="40" y="85" fill="#78350F" font-family="sans-serif" font-size="14">PACIENTE: Carlos Eduardo Santos | DATA: 12/08/2026</text>
        <line x1="40" y1="100" x2="560" y2="100" stroke="#E5E7EB" stroke-width="2"/>
        
        <text x="40" y="130" fill="#1E293B" font-family="sans-serif" font-weight="bold" font-size="15">TIPO: Consulta Terapêutica de Acolhimento</text>
        <text x="40" y="160" fill="#1E293B" font-family="sans-serif" font-weight="bold" font-size="15">DEMANDA / QUEIXA:</text>
        <text x="40" y="185" fill="#334155" font-family="sans-serif" font-size="14">Relata quadro intenso de ansiedade, insônia há 3 semanas e conflitos familiares.</text>

        <text x="40" y="220" fill="#1E293B" font-family="sans-serif" font-weight="bold" font-size="15">EVOLUÇÃO E CONDUTAS:</text>
        <text x="40" y="245" fill="#334155" font-family="sans-serif" font-size="14">Realizada escuta qualificada. Oferecidas técnicas de manejo de ansiedade.</text>
        <text x="40" y="270" fill="#334155" font-family="sans-serif" font-size="14">Encaminhado para grupo de apoio emocional e avaliação médica.</text>
        
        <text x="40" y="310" fill="#1E293B" font-family="sans-serif" font-size="14">CID-10: F41.1 (Transtorno de Ansiedade Generalizada)</text>
        <text x="40" y="340" fill="#B45309" font-family="sans-serif" font-weight="bold" font-size="14">PROFISSIONAL: Dra. Juliana Mendes - Psicóloga</text>
      </svg>
    `,
  },
];

function svgToBase64(svg: string): string {
  try {
    const base64 = btoa(unescape(encodeURIComponent(svg)));
    return `data:image/svg+xml;base64,${base64}`;
  } catch {
    const encoded = encodeURIComponent(svg)
      .replace(/'/g, "%27")
      .replace(/"/g, "%22");
    return `data:image/svg+xml;charset=utf-8,${encoded}`;
  }
}

export const AiDocumentScannerModal: React.FC<AiDocumentScannerModalProps> = ({
  isOpen,
  onClose,
  targetFormName,
  onDataExtracted,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("image/jpeg");
  const [loading, setLoading] = useState(false);
  const [ocrMode, setOcrMode] = useState<"ai_structured" | "raw_ocr">("ai_structured");
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const [ocrStatusText, setOcrStatusText] = useState<string>("");
  const [extractedData, setExtractedData] = useState<ExtractedDocumentData | null>(null);
  const [rawText, setRawText] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMimeType(file.type || "image/jpeg");
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setExtractedData(null);
      setRawText("");
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (svgText: string) => {
    const base64Svg = svgToBase64(svgText);
    setImagePreview(base64Svg);
    setMimeType("image/svg+xml");
    setExtractedData(null);
    setRawText("");
    setErrorMsg(null);
  };

  const convertSvgToJpegIfNeeded = async (imgUrl: string): Promise<string> => {
    if (imgUrl.startsWith("data:image/svg+xml")) {
      const img = new Image();
      img.src = imgUrl;
      await new Promise((resolve) => (img.onload = resolve));
      const canvas = document.createElement("canvas");
      canvas.width = 1000;
      canvas.height = 667;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL("image/jpeg", 0.9);
      }
    }
    return imgUrl;
  };

  const processOcrRawLocal = async () => {
    if (!imagePreview) return;
    setLoading(true);
    setErrorMsg(null);
    setOcrProgress(0);
    setOcrStatusText("Iniciando motor de OCR no navegador...");

    try {
      const imageToScan = await convertSvgToJpegIfNeeded(imagePreview);

      const result = await Tesseract.recognize(imageToScan, "por+eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setOcrProgress(Math.round(m.progress * 100));
            setOcrStatusText(`Reconhecendo caracteres... ${Math.round(m.progress * 100)}%`);
          } else if (m.status === "loading tesseract core") {
            setOcrStatusText("Carregando motor Tesseract OCR...");
          } else if (m.status === "initializing api") {
            setOcrStatusText("Inicializando dicionários...");
          }
        },
      });

      const extracted = result.data.text.trim();
      setRawText(extracted);

      // Simple heuristic parsing for quick auto-fill if available
      const parsedData: ExtractedDocumentData = {
        tipoDetectado: "Documento Lido via OCR Direct",
        resumoLeitura: `OCR concluído. ${(result.data as any).words?.length || 0} palavras extraídas com alta precisão.`,
        rawOcrText: extracted,
        atendimentoNotas: extracted,
        observacoesAlergias: extracted,
      };

      setExtractedData(parsedData);
    } catch (err: any) {
      console.error("Erro no OCR Tesseract:", err);
      setErrorMsg("Falha no OCR local: " + (err.message || "Não foi possível ler o texto da imagem."));
    } finally {
      setLoading(false);
    }
  };

  const processImageWithAi = async () => {
    if (!imagePreview) return;

    if (ocrMode === "raw_ocr") {
      await processOcrRawLocal();
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const finalBase64 = await convertSvgToJpegIfNeeded(imagePreview);
      const finalMime = finalBase64.startsWith("data:image/svg") ? "image/svg+xml" : "image/jpeg";

      const res = await fetch("/api/ai/ocr-documento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: finalBase64,
          mimeType: finalMime,
        }),
      });

      const resData = await res.json();
      if (resData.success && resData.data) {
        setExtractedData(resData.data);
        if (resData.data.atendimentoNotas || resData.data.atendimentoDemanda) {
          setRawText(
            resData.data.atendimentoNotas || resData.data.atendimentoDemanda || ""
          );
        }
      } else {
        setErrorMsg(resData.error || "Não foi possível extrair dados do documento.");
      }
    } catch (err: any) {
      setErrorMsg("Erro na comunicação com a IA: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToForm = () => {
    if (extractedData) {
      onDataExtracted(extractedData);
      onClose();
    }
  };

  const handleCopyText = () => {
    if (rawText) {
      navigator.clipboard.writeText(rawText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setImagePreview(null);
    setExtractedData(null);
    setRawText("");
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-emerald-500 text-white rounded-xl shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                Leitor Óptico de Documentos (OCR + IA)
              </h3>
              <p className="text-xs text-slate-300">
                {targetFormName
                  ? `Extração para: ${targetFormName}`
                  : "Leitura de papéis, RGs, CPFs e fichas com OCR"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 p-2 flex gap-2">
          <button
            type="button"
            onClick={() => setOcrMode("ai_structured")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              ocrMode === "ai_structured"
                ? "bg-white text-indigo-700 shadow-xs border border-indigo-200"
                : "text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Extração Estruturada por IA (Campos)</span>
          </button>

          <button
            type="button"
            onClick={() => setOcrMode("raw_ocr")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              ocrMode === "raw_ocr"
                ? "bg-white text-emerald-700 shadow-xs border border-emerald-200"
                : "text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            <Zap className="w-4 h-4 text-emerald-600" />
            <span>OCR de Texto Puro (Local Tesseract)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!imagePreview ? (
            /* Upload / Camera Selection Screen */
            <div className="space-y-6">
              <div className="p-6 border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 hover:bg-indigo-50/80 rounded-2xl text-center transition-all">
                <div className="mx-auto w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-3 shadow-inner">
                  <FileText className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-slate-800 text-base mb-1">
                  Selecione ou tire foto do documento
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-5 leading-relaxed">
                  {ocrMode === "ai_structured"
                    ? "A IA interpreta o documento físico (RG, CPF, SUS, Receita, Laudo) e preenche os campos do formulário automaticamente."
                    : "O motor de OCR local extrai o texto caractere por caractere em tempo real diretamente do papel."}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Escolher Arquivo / Imagem</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Tirar Foto com Câmera</span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>
              </div>

              {/* Sample Documents */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Teste rápido com documentos de exemplo
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SAMPLE_DOCUMENTS.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSample(sample.svgText)}
                      className="text-left p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50/60 hover:border-indigo-300 transition-all group"
                    >
                      <div className="font-bold text-slate-800 text-xs group-hover:text-indigo-600 flex items-center justify-between mb-1">
                        <span>{sample.label}</span>
                        <span className="text-[10px] bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                          Testar OCR
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{sample.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Document Preview & Extraction Results Screen */
            <div className="space-y-6">
              {/* Document Image Preview & Controls */}
              <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-400" /> Pré-visualização do Documento
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsZoomed(true)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded-lg flex items-center gap-1 border border-slate-700 transition-colors"
                    >
                      <ZoomIn className="w-3.5 h-3.5 text-indigo-400" /> Ampliar / Ver Imagem
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded-lg flex items-center gap-1 border border-slate-700 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-amber-400" /> Trocar Imagem
                    </button>
                  </div>
                </div>

                {/* Preview Frame */}
                <div
                  onClick={() => setIsZoomed(true)}
                  className="w-full h-56 sm:h-64 bg-slate-950/90 rounded-xl overflow-hidden relative border border-slate-800 flex items-center justify-center p-2 cursor-zoom-in group transition-all hover:border-indigo-500/50"
                >
                  <img
                    src={imagePreview}
                    alt="Documento para OCR"
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-full object-contain rounded-md shadow-md transition-transform group-hover:scale-[1.01]"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="px-3.5 py-1.5 bg-slate-900/90 text-white text-xs font-bold rounded-lg border border-slate-700 shadow-xl flex items-center gap-2">
                      <ZoomIn className="w-4 h-4 text-indigo-400" /> Clique para Expandir Imagem Completa
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                  <p className="text-slate-400 text-[11px]">
                    Modo ativo:{" "}
                    <strong className="text-indigo-300">
                      {ocrMode === "ai_structured"
                        ? "Extração Inteligente de Campos (IA)"
                        : "OCR de Texto Bruto (Tesseract Local)"}
                    </strong>
                  </p>

                  {!extractedData && !rawText && !loading && (
                    <button
                      type="button"
                      onClick={processImageWithAi}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg transition-all text-xs cursor-pointer"
                    >
                      {ocrMode === "ai_structured" ? (
                        <Sparkles className="w-4 h-4" />
                      ) : (
                        <Zap className="w-4 h-4" />
                      )}
                      <span>
                        {ocrMode === "ai_structured"
                          ? "Iniciar Leitura com IA"
                          : "Executar OCR no Texto"}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="p-6 bg-indigo-50/80 border border-indigo-200 rounded-2xl text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                  <h4 className="font-bold text-indigo-900 text-sm">
                    {ocrMode === "ai_structured"
                      ? "Analisando documento com Inteligência Artificial..."
                      : ocrStatusText || "Processando OCR óptico..."}
                  </h4>

                  {ocrMode === "raw_ocr" && ocrProgress > 0 && (
                    <div className="w-full max-w-md mx-auto bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-2.5 rounded-full transition-all duration-200"
                        style={{ width: `${ocrProgress}%` }}
                      ></div>
                    </div>
                  )}

                  <p className="text-xs text-indigo-700 max-w-sm mx-auto">
                    {ocrMode === "ai_structured"
                      ? "A IA está decifrando dados, nomes e termos técnicos do papel."
                      : "O motor OCR está escaneando a imagem caractere por caractere."}
                  </p>
                </div>
              )}

              {/* Error Message */}
              {errorMsg && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Falha no processamento:</span>
                    <p className="mt-0.5 text-rose-700">{errorMsg}</p>
                  </div>
                </div>
              )}

              {/* Raw Text OCR Result */}
              {rawText && (
                <div className="space-y-3 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <AlignLeft className="w-4 h-4 text-emerald-600" /> Texto Bruto Lido por OCR
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyText}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs text-slate-700 font-semibold shadow-2xs"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copiado!" : "Copiar Texto"}</span>
                    </button>
                  </div>

                  <textarea
                    readOnly
                    value={rawText}
                    rows={6}
                    className="w-full text-xs font-mono p-3 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden"
                  />
                </div>
              )}

              {/* Extracted Structured Data Result */}
              {extractedData && ocrMode === "ai_structured" && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="p-4 bg-emerald-50/90 border border-emerald-200 rounded-xl flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="flex-1 text-xs">
                      <span className="font-bold text-emerald-900 text-sm block mb-0.5">
                        Leitura OCR Concluída com Sucesso!
                      </span>
                      <p className="text-emerald-800 font-medium">
                        {extractedData.resumoLeitura ||
                          "A IA identificou com sucesso os dados contidos no documento."}
                      </p>
                    </div>
                  </div>

                  {/* Extracted Fields Grid */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 max-h-60 overflow-y-auto">
                    <h5 className="font-bold text-slate-700 text-xs uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center justify-between">
                      <span>Campos Mapeados do Documento:</span>
                      {extractedData.tipoDetectado && (
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-md font-bold text-[10px] uppercase">
                          Tipo: {extractedData.tipoDetectado}
                        </span>
                      )}
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {extractedData.nome && (
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-400 font-bold block">NOME</span>
                          <span className="font-semibold text-slate-800">{extractedData.nome}</span>
                        </div>
                      )}
                      {extractedData.cpf && (
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-400 font-bold block">CPF</span>
                          <span className="font-semibold text-slate-800">{extractedData.cpf}</span>
                        </div>
                      )}
                      {extractedData.rg && (
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-400 font-bold block">RG</span>
                          <span className="font-semibold text-slate-800">{extractedData.rg}</span>
                        </div>
                      )}
                      {extractedData.dataNascimento && (
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-400 font-bold block">DATA NASCIMENTO</span>
                          <span className="font-semibold text-slate-800">{extractedData.dataNascimento}</span>
                        </div>
                      )}
                      {extractedData.cartaoSus && (
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-400 font-bold block">CARTÃO SUS</span>
                          <span className="font-semibold text-slate-800">{extractedData.cartaoSus}</span>
                        </div>
                      )}
                      {extractedData.telefone && (
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-400 font-bold block">TELEFONE</span>
                          <span className="font-semibold text-slate-800">{extractedData.telefone}</span>
                        </div>
                      )}
                      {extractedData.endereco && (
                        <div className="bg-white p-2 rounded-lg border border-slate-200 sm:col-span-2">
                          <span className="text-[10px] text-slate-400 font-bold block">ENDEREÇO</span>
                          <span className="font-semibold text-slate-800">{extractedData.endereco}</span>
                        </div>
                      )}
                      {extractedData.atendimentoDemanda && (
                        <div className="bg-white p-2 rounded-lg border border-slate-200 sm:col-span-2">
                          <span className="text-[10px] text-slate-400 font-bold block">DEMANDA DO ATENDIMENTO</span>
                          <span className="font-semibold text-slate-800">{extractedData.atendimentoDemanda}</span>
                        </div>
                      )}
                      {extractedData.atendimentoNotas && (
                        <div className="bg-white p-2 rounded-lg border border-slate-200 sm:col-span-2">
                          <span className="text-[10px] text-slate-400 font-bold block">EVOLUÇÃO / PRONTUÁRIO</span>
                          <span className="font-semibold text-slate-800 line-clamp-2">{extractedData.atendimentoNotas}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            Fechar
          </button>

          {extractedData && (
            <button
              type="button"
              onClick={handleApplyToForm}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Preencher Cadastro com Dados do OCR</span>
            </button>
          )}
        </div>
        {/* Fullscreen Image Zoom Modal Overlay */}
        {isZoomed && imagePreview && (
          <div
            className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <div className="relative max-w-5xl max-h-[92vh] w-full h-full flex flex-col items-center justify-center p-2">
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="absolute top-4 right-4 p-2.5 bg-slate-800/90 text-white hover:bg-slate-700 rounded-xl z-20 shadow-xl border border-slate-700 flex items-center gap-1.5 text-xs font-bold"
              >
                <X className="w-5 h-5" />
                <span>Fechar Ampliação</span>
              </button>
              <img
                src={imagePreview}
                alt="Documento Ampliado"
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-contain rounded-xl border border-slate-700 shadow-2xl"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
