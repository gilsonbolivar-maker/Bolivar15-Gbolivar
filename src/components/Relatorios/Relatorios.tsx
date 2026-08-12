import React, { useState } from "react";
import {
  BarChart3,
  Download,
  Loader2,
  UserCheck,
  Users,
  Send,
  UserPlus,
  ShieldAlert,
  TrendingUp,
  CalendarDays,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import {
  Paciente,
  AtendimentoIndividual,
  GrupoAtendimento,
  SessaoGrupo,
  Encaminhamento,
} from "../../types";

interface RelatoriosProps {
  pacientes: Paciente[];
  atendimentos: AtendimentoIndividual[];
  grupos: GrupoAtendimento[];
  sessoesGrupo: SessaoGrupo[];
  encaminhamentos: Encaminhamento[];
}

const countBy = <T,>(items: T[], getKey: (item: T) => string | undefined) => {
  const counts = new Map<string, number>();
  items.forEach((item) => {
    const key = getKey(item);
    if (!key) return;
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return Array.from(counts.entries())
    .map(([label, total]) => ({ label, total }))
    .sort((a, b) => b.total - a.total);
};

interface BarListProps {
  data: { label: string; total: number }[];
  colorClass?: string;
  emptyMessage: string;
  colorFor?: (label: string) => string;
}

const BarList: React.FC<BarListProps> = ({
  data,
  colorClass = "bg-azulc-500",
  emptyMessage,
  colorFor,
}) => {
  if (data.length === 0) {
    return (
      <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-sm">
        {emptyMessage}
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.total));

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.label}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-slate-700">{item.label}</span>
            <span className="font-bold text-slate-500">{item.total}</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${colorFor ? colorFor(item.label) : colorClass}`}
              style={{ width: `${max > 0 ? (item.total / max) * 100 : 0}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export const Relatorios: React.FC<RelatoriosProps> = ({
  pacientes,
  atendimentos,
  grupos,
  sessoesGrupo,
  encaminhamentos,
}) => {
  const [gerandoPdf, setGerandoPdf] = useState(false);

  const atendimentosPorTipo = countBy(
    atendimentos,
    (a: AtendimentoIndividual) => a.tipoAtendimento
  );
  const gruposPorCategoria = countBy(grupos, (g: GrupoAtendimento) => g.categoria);
  const encPorStatus = countBy(encaminhamentos, (e: Encaminhamento) => e.status);
  const encPorPrioridade = countBy(encaminhamentos, (e: Encaminhamento) => e.prioridade);

  const vulnerabilidades = countBy(
    pacientes.flatMap((p) => p.vulnerabilidades),
    (v: string) => v
  ).slice(0, 8);

  const statusColor = (status: string) => {
    if (status === "Concluido") return "bg-emerald-500";
    if (status === "Cancelado") return "bg-slate-400";
    return "bg-amber-500";
  };

  const prioridadeColor = (prioridade: string) => {
    if (prioridade === "Urgente") return "bg-rose-500";
    if (prioridade === "Prioritário") return "bg-amber-500";
    return "bg-slate-400";
  };

  // Atendimentos (individuais + sessões de grupo) nos últimos 7 dias
  const today = new Date();
  const last7Days = Array.from({ length: 7 }).map((_, idx) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (6 - idx));
    const dayStr = day.toISOString().split("T")[0];
    const label = day.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");

    const total =
      atendimentos.filter((a) => (a.dataHora || "").startsWith(dayStr)).length +
      sessoesGrupo.filter((s) => (s.dataHora || "").startsWith(dayStr)).length;

    return { label, dayStr, total };
  });
  const maxDia = Math.max(1, ...last7Days.map((d) => d.total));

  const totalEncaminhamentosConcluidos = encaminhamentos.filter(
    (e) => e.status === "Concluido"
  ).length;

  const handleDownloadPdf = async () => {
    const element = document.getElementById("relatorios-pdf-content");
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

      pdf.save(`Indicadores_PsicoEscolar_${today.toISOString().split("T")[0]}.pdf`);
    } catch (err) {
      console.error("Erro ao gerar PDF de indicadores:", err);
    } finally {
      setGerandoPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-azulc-600" />
            Indicadores e Relatórios
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Panorama consolidado de atendimentos, grupos, encaminhamentos e vulnerabilidades sociais
          </p>
        </div>

        <button
          onClick={handleDownloadPdf}
          disabled={gerandoPdf}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-azulc-600 hover:bg-azulc-500 disabled:opacity-60 text-white text-xs font-semibold rounded-xl shadow transition-colors"
        >
          {gerandoPdf ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{gerandoPdf ? "Gerando PDF..." : "Exportar PDF"}</span>
        </button>
      </div>

      <div id="relatorios-pdf-content" className="space-y-6 bg-slate-50 p-1">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="p-2 bg-azulc-100 text-azulc-700 rounded-xl w-fit mb-3">
              <UserPlus className="w-5 h-5" />
            </div>
            <p className="text-3xl font-black text-slate-900">{pacientes.length}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Alunos cadastrados</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl w-fit mb-3">
              <UserCheck className="w-5 h-5" />
            </div>
            <p className="text-3xl font-black text-slate-900">{atendimentos.length}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Atendimentos individuais</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl w-fit mb-3">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-3xl font-black text-slate-900">{sessoesGrupo.length}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Sessões em {grupos.length} grupo(s)
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-xl w-fit mb-3">
              <Send className="w-5 h-5" />
            </div>
            <p className="text-3xl font-black text-slate-900">{encaminhamentos.length}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Encaminhamentos • {totalEncaminhamentosConcluidos} concluído(s)
            </p>
          </div>
        </div>

        {/* Atendimentos nos últimos 7 dias */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-5">
            <CalendarDays className="w-4 h-4 text-azulc-600" />
            Atendimentos nos Últimos 7 Dias
          </h3>
          <div className="flex items-end justify-between gap-2 h-32">
            {last7Days.map((d) => (
              <div key={d.dayStr} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500">{d.total}</span>
                <div className="w-full flex-1 flex items-end bg-slate-50 rounded-md overflow-hidden">
                  <div
                    className="w-full bg-azulc-500 rounded-t-md transition-all"
                    style={{ height: `${(d.total / maxDia) * 100}%`, minHeight: d.total > 0 ? "6px" : "0" }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-slate-400 capitalize">
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Atendimentos por Tipo */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-5">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              Atendimentos Individuais por Tipo
            </h3>
            <BarList
              data={atendimentosPorTipo}
              colorClass="bg-emerald-500"
              emptyMessage="Nenhum atendimento individual registrado ainda."
            />
          </div>

          {/* Grupos por Categoria */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-5">
              <Users className="w-4 h-4 text-blue-600" />
              Grupos por Categoria
            </h3>
            <BarList
              data={gruposPorCategoria}
              colorClass="bg-blue-500"
              emptyMessage="Nenhum grupo cadastrado ainda."
            />
          </div>

          {/* Encaminhamentos por Status */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-5">
              <Send className="w-4 h-4 text-rose-600" />
              Encaminhamentos por Status
            </h3>
            <BarList
              data={encPorStatus}
              colorFor={statusColor}
              emptyMessage="Nenhum encaminhamento emitido ainda."
            />
          </div>

          {/* Encaminhamentos por Prioridade */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-5">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              Encaminhamentos por Prioridade
            </h3>
            <BarList
              data={encPorPrioridade}
              colorFor={prioridadeColor}
              emptyMessage="Nenhum encaminhamento emitido ainda."
            />
          </div>
        </div>

        {/* Vulnerabilidades sociais */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-5">
            <ShieldAlert className="w-4 h-4 text-orange-600" />
            Principais Vulnerabilidades Sociais Identificadas
          </h3>
          <BarList
            data={vulnerabilidades}
            colorClass="bg-orange-500"
            emptyMessage="Nenhuma vulnerabilidade registrada nos prontuários ainda."
          />
        </div>
      </div>
    </div>
  );
};
