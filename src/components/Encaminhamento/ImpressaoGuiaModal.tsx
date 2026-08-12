import React, { useState } from "react";
import { X, Printer, HeartHandshake, Download, CheckCircle2, Stamp } from "lucide-react";
import { Encaminhamento, Paciente } from "../../types";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ImpressaoGuiaModalProps {
  isOpen: boolean;
  onClose: () => void;
  encaminhamento: Encaminhamento | null;
  paciente: Paciente | null;
}

export const ImpressaoGuiaModal: React.FC<ImpressaoGuiaModalProps> = ({
  isOpen,
  onClose,
  encaminhamento,
  paciente,
}) => {
  const [gerandoPdf, setGerandoPdf] = useState(false);

  if (!isOpen || !encaminhamento) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    const element = document.getElementById("guia-encaminhamento-pdf-content");
    if (!element) return;

    setGerandoPdf(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
      pdf.save(`Encaminhamento_DeboraCosta_${encaminhamento.pacienteNome.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("Erro ao gerar arquivo PDF:", err);
      window.print();
    } finally {
      setGerandoPdf(false);
    }
  };

  const isDeboraCosta =
    encaminhamento.profissionalEmissor.toLowerCase().includes("débora") ||
    encaminhamento.profissionalEmissor.toLowerCase().includes("debora");

  const emissorNome = isDeboraCosta ? "Débora Costa" : encaminhamento.profissionalEmissor;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto print:shadow-none print:border-none print:max-w-none print:w-full print:h-auto">
        {/* Modal Controls (Hidden when printing) */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2.5">
            <Printer className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-base">Guia Oficial de Encaminhamento</h3>
              <p className="text-xs text-slate-400">Com espaço para carimbo e assinatura de Débora Costa</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={gerandoPdf}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{gerandoPdf ? "Gerando PDF..." : "Baixar PDF"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div
          id="guia-encaminhamento-pdf-content"
          className="p-8 space-y-6 overflow-y-auto font-sans text-slate-900 bg-white print:p-8 print:overflow-visible text-xs"
        >
          {/* Official Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-900 text-white rounded-xl">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-base font-extrabold uppercase tracking-wide text-slate-900">
                  REDE DE ATENDIMENTO INTEGRADO • SAÚDE E ASSISTÊNCIA SOCIAL
                </h1>
                <h2 className="text-sm font-bold text-slate-700">
                  GUIA OFICIAL DE ENCAMINHAMENTO INTERSETORIAL
                </h2>
                <p className="text-[11px] text-slate-500">
                  Documento Técnico de Referência e Contra-Referência
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-slate-100 text-slate-900 border border-slate-300 font-mono font-bold text-xs rounded">
                GUIA Nº {encaminhamento.id.toUpperCase()}
              </span>
              <p className="text-[10px] text-slate-500 mt-1">
                Data de Emissão: {encaminhamento.dataEmissao}
              </p>
            </div>
          </div>

          {/* Seção 1: Identificação do Cidadão */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-300 space-y-2">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-200 pb-1">
              1. Dados do Usuário / Paciente
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div>
                <span className="text-slate-500 block">Nome Completo:</span>
                <strong className="text-slate-900 font-bold">{encaminhamento.pacienteNome}</strong>
              </div>

              <div>
                <span className="text-slate-500 block">CPF:</span>
                <strong className="font-mono">{encaminhamento.pacienteCpf}</strong>
              </div>

              <div>
                <span className="text-slate-500 block">Cartão SUS:</span>
                <strong className="font-mono">{paciente?.cartaoSus || "Não informado"}</strong>
              </div>

              <div>
                <span className="text-slate-500 block">Data de Nascimento:</span>
                <strong>{paciente ? new Date(paciente.dataNascimento).toLocaleDateString("pt-BR") : "N/I"}</strong>
              </div>

              <div>
                <span className="text-slate-500 block">Telefone:</span>
                <strong>{paciente?.telefone || "N/I"}</strong>
              </div>

              <div>
                <span className="text-slate-500 block">Bairro / Cidade:</span>
                <strong>{paciente ? `${paciente.bairro}, ${paciente.cidade}` : "N/I"}</strong>
              </div>
            </div>
          </div>

          {/* Seção 2: Origem & Destino */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-300 space-y-1">
              <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                ORIGEM DA SOLICITAÇÃO
              </h4>
              <p><strong>Serviço:</strong> {encaminhamento.setorOrigem}</p>
              <p>
                <strong>Profissional Responsável:</strong> {emissorNome} (
                {encaminhamento.cargoEmissor || "Assistente Social"})
              </p>
            </div>

            <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-300 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-amber-900 text-[11px] uppercase tracking-wider">
                  DESTINO SOLICITADO
                </h4>
                <span className="font-extrabold px-2 py-0.5 bg-amber-200 text-amber-900 rounded text-[10px]">
                  PRIORIDADE: {encaminhamento.prioridade.toUpperCase()}
                </span>
              </div>
              <p><strong>Setor/Unidade:</strong> {encaminhamento.setorDestino}</p>
              <p><strong>Especialidade:</strong> {encaminhamento.especialidadeDestino}</p>
            </div>
          </div>

          {/* Seção 3: Justificativa Técnica */}
          <div className="p-4 bg-white rounded-xl border border-slate-300 space-y-2">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-200 pb-1">
              2. Motivo e Justificativa Técnica do Encaminhamento
            </h3>

            <p className="font-semibold text-slate-900">
              <strong>Demanda Principal:</strong> {encaminhamento.motivoEncaminhamento}
            </p>

            {encaminhamento.hipoteseDiagnostica && (
              <p className="font-mono text-slate-700 bg-slate-100 p-1.5 rounded inline-block">
                Hipótese Diagnóstica / CID: {encaminhamento.hipoteseDiagnostica}
              </p>
            )}

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 whitespace-pre-line text-slate-800 leading-relaxed">
              {encaminhamento.justificativaTecnica}
            </div>
          </div>

          {/* Seção 4: Parecer de Contra-Encaminhamento (se houver) */}
          {encaminhamento.contraEncaminhamento && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-300 space-y-2">
              <h3 className="font-bold text-emerald-900 text-xs uppercase tracking-wider border-b border-emerald-200 pb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                3. Resposta de Contra-Encaminhamento (Devolvida pelo Destino)
              </h3>
              <p>
                <strong>Data de Atendimento:</strong> {encaminhamento.contraEncaminhamento.dataParecer} •{" "}
                <strong>Profissional:</strong> {encaminhamento.contraEncaminhamento.profissionalDestino} ({encaminhamento.contraEncaminhamento.cargoDestino})
              </p>
              <div className="p-3 bg-white rounded-lg border border-emerald-200 whitespace-pre-line text-slate-800">
                {encaminhamento.contraEncaminhamento.parecerTecnico}
              </div>
            </div>
          )}

          {/* Bloco Oficial de Carimbo e Assinatura de Débora Costa */}
          <div className="pt-6 border-t-2 border-slate-900 space-y-4">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Stamp className="w-4 h-4 text-slate-700" />
              Campos Oficiais para Validação, Carimbo e Assinatura
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
              {/* Box de Carimbo e Assinatura de Débora Costa */}
              <div className="p-4 border-2 border-slate-300 rounded-xl bg-slate-50/80 flex flex-col justify-between items-center text-center space-y-3">
                <div className="w-full h-24 border-2 border-dashed border-slate-400 rounded-lg bg-white flex flex-col items-center justify-center p-2 text-slate-400">
                  <span className="font-extrabold text-[11px] text-slate-600 uppercase tracking-widest">
                    ESPAÇO RESERVADO PARA CARIMBO
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold mt-1">
                    DÉBORA COSTA • CRP 03/24682
                  </span>
                </div>

                <div className="w-full pt-4">
                  <div className="border-b-2 border-slate-800 w-full mb-1"></div>
                  <p className="font-black text-slate-900 text-sm tracking-wide">
                    Débora Costa
                  </p>
                  <p className="text-xs font-semibold text-slate-700">
                    {encaminhamento.cargoEmissor || "Psicóloga - CRP 03/24682"}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Assinatura e Registro Profissional
                  </p>
                </div>
              </div>

              {/* Box de Carimbo do Serviço de Destino */}
              <div className="p-4 border-2 border-slate-300 rounded-xl bg-slate-50/80 flex flex-col justify-between items-center text-center space-y-3">
                <div className="w-full h-24 border-2 border-dashed border-slate-400 rounded-lg bg-white flex flex-col items-center justify-center p-2 text-slate-400">
                  <span className="font-extrabold text-[11px] text-slate-500 uppercase tracking-widest">
                    CARIMBO DE RECEBIMENTO
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">
                    {encaminhamento.setorDestino}
                  </span>
                </div>

                <div className="w-full pt-4">
                  <div className="border-b-2 border-slate-800 w-full mb-1"></div>
                  <p className="font-extrabold text-slate-900 text-xs uppercase tracking-wide">
                    Assinatura do Profissional Receptor
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Data de Recebimento: ____ / ____ / ________
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
