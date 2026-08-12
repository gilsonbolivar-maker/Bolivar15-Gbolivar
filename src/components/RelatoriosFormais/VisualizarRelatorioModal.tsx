import React, { useState } from "react";
import { X, Printer, Download, BookOpen } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import { RelatorioFormal, Paciente } from "../../types";

interface VisualizarRelatorioModalProps {
  isOpen: boolean;
  onClose: () => void;
  relatorio: RelatorioFormal | null;
  paciente: Paciente | null;
}

export const VisualizarRelatorioModal: React.FC<VisualizarRelatorioModalProps> = ({
  isOpen,
  onClose,
  relatorio,
  paciente,
}) => {
  const [gerandoPdf, setGerandoPdf] = useState(false);

  if (!isOpen || !relatorio) return null;

  const handlePrint = () => window.print();

  const handleDownloadPdf = async () => {
    const element = document.getElementById("relatorio-formal-pdf-content");
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
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${relatorio.titulo.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("Erro ao gerar PDF do relatório:", err);
      window.print();
    } finally {
      setGerandoPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto print:shadow-none print:border-none print:max-w-none print:w-full print:h-auto">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-bold text-base">{relatorio.tipo}</h3>
              <p className="text-xs text-slate-400">{relatorio.titulo}</p>
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
              <span>Imprimir</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          id="relatorio-formal-pdf-content"
          className="p-8 space-y-6 overflow-y-auto font-sans text-slate-900 bg-white print:p-8 print:overflow-visible text-xs"
        >
          <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
            <div>
              <h1 className="text-base font-extrabold uppercase tracking-wide text-slate-900">
                {relatorio.tipo}
              </h1>
              <h2 className="text-sm font-bold text-slate-700">{relatorio.titulo}</h2>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-slate-100 text-slate-900 border border-slate-300 font-mono font-bold text-xs rounded">
                Nº {relatorio.id.toUpperCase()}
              </span>
              <p className="text-[10px] text-slate-500 mt-1">
                Data: {new Date(relatorio.data + "T00:00:00").toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>

          {paciente && (
            <p className="text-xs text-slate-700">
              <strong>Aluno / Paciente:</strong> {paciente.nome}
            </p>
          )}

          <div className="space-y-4">
            <section>
              <h3 className="text-xs font-extrabold uppercase tracking-wide text-slate-500 border-b border-slate-200 pb-1 mb-1.5">
                1. Identificação
              </h3>
              <p className="text-xs text-slate-700 whitespace-pre-line">{relatorio.conteudo.identificacao || "—"}</p>
            </section>
            <section>
              <h3 className="text-xs font-extrabold uppercase tracking-wide text-slate-500 border-b border-slate-200 pb-1 mb-1.5">
                2. Motivo do Encaminhamento
              </h3>
              <p className="text-xs text-slate-700 whitespace-pre-line">{relatorio.conteudo.motivoEncaminhamento || "—"}</p>
            </section>
            <section>
              <h3 className="text-xs font-extrabold uppercase tracking-wide text-slate-500 border-b border-slate-200 pb-1 mb-1.5">
                3. Procedimentos
              </h3>
              <p className="text-xs text-slate-700 whitespace-pre-line">{relatorio.conteudo.procedimentos || "—"}</p>
            </section>
            <section>
              <h3 className="text-xs font-extrabold uppercase tracking-wide text-slate-500 border-b border-slate-200 pb-1 mb-1.5">
                4. Análise
              </h3>
              <p className="text-xs text-slate-700 whitespace-pre-line">{relatorio.conteudo.analise || "—"}</p>
            </section>
            <section>
              <h3 className="text-xs font-extrabold uppercase tracking-wide text-slate-500 border-b border-slate-200 pb-1 mb-1.5">
                5. Conclusão e Recomendações
              </h3>
              <p className="text-xs text-slate-700 whitespace-pre-line">{relatorio.conteudo.conclusaoRecomendacoes || "—"}</p>
            </section>
          </div>

          <div className="pt-10 flex flex-col items-center gap-1">
            <div className="w-64 border-t border-slate-400" />
            <p className="text-xs font-semibold text-slate-700">{relatorio.autor}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
