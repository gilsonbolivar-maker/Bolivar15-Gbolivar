import React from "react";
import {
  Users,
  UserCheck,
  Send,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Calendar,
  Building,
  UserPlus,
  FileText,
  Activity,
  ChevronRight,
  Plus,
  BarChart3,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import {
  Paciente,
  AtendimentoIndividual,
  GrupoAtendimento,
  SessaoGrupo,
  Encaminhamento,
  TabMenu,
} from "../types";

interface DashboardProps {
  pacientes: Paciente[];
  atendimentosIndiv?: AtendimentoIndividual[];
  atendimentos?: AtendimentoIndividual[];
  grupos: GrupoAtendimento[];
  sessoesGrupo: SessaoGrupo[];
  encaminhamentos: Encaminhamento[];
  setActiveTab?: (tab: TabMenu) => void;
  onOpenNovoAtendimentoIndiv?: () => void;
  onOpenNovoAtendimento?: () => void;
  onOpenNovoGrupo?: () => void;
  onOpenNovaSessao?: () => void;
  onOpenNovaSessaoGrupo?: () => void;
  onOpenNovoEncaminhamento?: () => void;
  onOpenNovoPaciente?: () => void;
  onSelectPacienteProntuario?: (paciente: Paciente) => void;
  onVerProntuario?: (paciente: Paciente) => void;
}

export const Dashboard: React.FC<DashboardProps> = (props) => {
  const {
    pacientes = [],
    atendimentosIndiv = props.atendimentos || [],
    grupos = [],
    sessoesGrupo = [],
    encaminhamentos = [],
    setActiveTab,
    onOpenNovoAtendimentoIndiv = props.onOpenNovoAtendimento,
    onOpenNovoGrupo,
    onOpenNovaSessao = props.onOpenNovaSessaoGrupo,
    onOpenNovoEncaminhamento,
    onOpenNovoPaciente,
    onSelectPacienteProntuario = props.onVerProntuario,
  } = props;

  const encaminhamentosPendentes = encaminhamentos.filter(
    (e) => e.status === "Pendente" || e.status === "Em Análise"
  );
  const encaminhamentosUrgentes = encaminhamentosPendentes.filter(
    (e) => e.prioridade === "Urgente"
  );
  const gruposAtivos = grupos.filter((g) => g.status === "Ativo");

  // Statistical calculations for current week
  const now = new Date();
  const startOfWeekDate = new Date(now);
  startOfWeekDate.setDate(now.getDate() - 6);
  const dateRangeStr = `${startOfWeekDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  })} a ${now.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  })}`;

  const isThisWeek = (dateStr?: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false;
    const diffTime = now.getTime() - d.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays >= -1 && diffDays <= 7;
  };

  const atendimentosIndivSemana = atendimentosIndiv.filter((a) => isThisWeek(a.dataHora));
  const sessoesGrupoSemana = sessoesGrupo.filter((s) => isThisWeek(s.dataHora));
  const totalAtendimentosSemanaCount =
    atendimentosIndivSemana.length + sessoesGrupoSemana.length > 0
      ? atendimentosIndivSemana.length + sessoesGrupoSemana.length
      : atendimentosIndiv.length + sessoesGrupo.length;

  const novosPacientesSemana = pacientes.filter((p) => isThisWeek(p.dataCadastro));
  const totalNovosPacientesCount =
    novosPacientesSemana.length > 0 ? novosPacientesSemana.length : pacientes.length;

  const todayStr = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const formattedToday = todayStr.charAt(0).toUpperCase() + todayStr.slice(1);

  return (
    <div className="space-y-6">
      {/* Header section matching Bento Grid Portal layout */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Portal de Atendimento Multidisciplinar
          </h1>
          <p className="text-sm text-slate-500 font-medium">{formattedToday}</p>
        </div>
        <div className="flex items-center gap-3">
          {onOpenNovoPaciente && (
            <button
              onClick={onOpenNovoPaciente}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm flex items-center gap-2 shadow-sm transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Novo Cadastro
            </button>
          )}
        </div>
      </header>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Top Metric Cards - 4 Columns */}
        <div
          onClick={() => setActiveTab && setActiveTab("atendimento-individual")}
          className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Atendimento Individual
            </span>
            <div className="p-2 rounded-xl group-hover:scale-105 transition-transform" style={{ backgroundColor: "#E8F5E9", color: "#2E7D32" }}>
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {atendimentosIndiv.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">consultas</span>
          </div>
          <p className="text-xs font-semibold mt-2 flex items-center gap-1" style={{ color: "#2E7D32" }}>
            Ver consultas <ChevronRight className="w-3.5 h-3.5" />
          </p>
        </div>

        <div
          onClick={() => setActiveTab && setActiveTab("atendimento-grupo")}
          className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Grupos de Atendimento
            </span>
            <div className="p-2 rounded-xl group-hover:scale-105 transition-transform" style={{ backgroundColor: "#E3F2FD", color: "#1565C0" }}>
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {gruposAtivos.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">grupos ativos</span>
          </div>
          <p className="text-xs font-semibold mt-2 flex items-center gap-1" style={{ color: "#1565C0" }}>
            {sessoesGrupo.length} sessões realizadas <ChevronRight className="w-3.5 h-3.5" />
          </p>
        </div>

        <div
          onClick={() => setActiveTab && setActiveTab("encaminhamento")}
          className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Encaminhamentos
            </span>
            <div className="p-2 rounded-xl group-hover:scale-105 transition-transform" style={{ backgroundColor: "#FFCDD2", color: "#C62828" }}>
              <Send className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black" style={{ color: "#C62828" }}>
              {encaminhamentosPendentes.length}
            </span>
            {encaminhamentosUrgentes.length > 0 && (
              <span className="text-xs px-2 py-0.5 font-bold rounded-full" style={{ backgroundColor: "#FFCDD2", color: "#C62828" }}>
                {encaminhamentosUrgentes.length} urgente
              </span>
            )}
          </div>
          <p className="text-xs font-semibold mt-2 flex items-center gap-1" style={{ color: "#C62828" }}>
            Gerenciar pendentes <ChevronRight className="w-3.5 h-3.5" />
          </p>
        </div>

        <div
          onClick={() => setActiveTab && setActiveTab("pacientes")}
          className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Cadastro de Alunos
            </span>
            <div className="p-2 rounded-xl group-hover:scale-105 transition-transform" style={{ backgroundColor: "#F3E5F5", color: "#6A1B9A" }}>
              <UserPlus className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {pacientes.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">prontuários</span>
          </div>
          <p className="text-xs font-semibold mt-2 flex items-center gap-1" style={{ color: "#6A1B9A" }}>
            Consultar base <ChevronRight className="w-3.5 h-3.5" />
          </p>
        </div>

        {/* Card: Resumo Estatístico dos Atendimentos da Semana */}
        <div className="col-span-12 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 relative overflow-hidden">
          {/* Ambient Blur */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-emerald-500 text-white rounded-xl shadow-lg shadow-indigo-500/20">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex flex-wrap items-center gap-2">
                  <span>Resumo Estatístico da Semana</span>
                  <span className="text-xs px-2.5 py-0.5 bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 rounded-full font-semibold">
                    {dateRangeStr}
                  </span>
                </h2>
                <p className="text-xs text-slate-300 font-medium">
                  Atendimentos, novos alunos cadastrados e encaminhamentos pendentes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800/60 px-3 py-1.5 rounded-xl">
                <TrendingUp className="w-3.5 h-3.5" />
                Dados da Semana
              </span>
            </div>
          </div>

          {/* 3 Main Highlighted Metric Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
            {/* Stat 1: Total de Atendimentos */}
            <div
              onClick={() => setActiveTab && setActiveTab("atendimento-individual")}
              className="bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/80 hover:border-emerald-500/50 rounded-xl p-4 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4" />
                    Total de Atendimentos
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                </div>
                <div className="flex items-baseline gap-2 my-1">
                  <span className="text-3xl font-black text-white">
                    {totalAtendimentosSemanaCount}
                  </span>
                  <span className="text-xs text-emerald-300 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                    na semana
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  <strong className="text-white">{atendimentosIndiv.length}</strong> individuais •{" "}
                  <strong className="text-white">{sessoesGrupo.length}</strong> em grupo
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-700/50 text-[11px] text-slate-400 font-medium flex items-center justify-between">
                <span>Atendimentos do Período</span>
                <span className="text-emerald-400 font-bold group-hover:underline">Ver Todos →</span>
              </div>
            </div>

            {/* Stat 2: Novos Pacientes */}
            <div
              onClick={() => setActiveTab && setActiveTab("pacientes")}
              className="bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/80 hover:border-indigo-500/50 rounded-xl p-4 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <UserPlus className="w-4 h-4" />
                    Novos Pacientes
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                </div>
                <div className="flex items-baseline gap-2 my-1">
                  <span className="text-3xl font-black text-white">
                    {totalNovosPacientesCount}
                  </span>
                  <span className="text-xs text-indigo-300 font-semibold bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-800/40">
                    novos cadastros
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Prontuários registrados na plataforma
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-700/50 text-[11px] text-slate-400 font-medium flex items-center justify-between">
                <span>Total cadastrados: {pacientes.length}</span>
                <span className="text-indigo-400 font-bold group-hover:underline">Acessar Alunos →</span>
              </div>
            </div>

            {/* Stat 3: Encaminhamentos Pendentes */}
            <div
              onClick={() => setActiveTab && setActiveTab("encaminhamento")}
              className="bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/80 hover:border-rose-500/50 rounded-xl p-4 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Send className="w-4 h-4" />
                    Encaminhamentos Pendentes
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-rose-400 transition-colors" />
                </div>
                <div className="flex items-baseline gap-2 my-1">
                  <span className="text-3xl font-black text-rose-400">
                    {encaminhamentosPendentes.length}
                  </span>
                  {encaminhamentosUrgentes.length > 0 && (
                    <span className="text-xs text-rose-200 font-bold bg-rose-950/80 px-2 py-0.5 rounded-md border border-rose-800/60 animate-pulse">
                      {encaminhamentosUrgentes.length} urgente(s)
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Aguardando recepção ou triagem na rede
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-700/50 text-[11px] text-slate-400 font-medium flex items-center justify-between">
                <span>Solicitações ativas</span>
                <span className="text-rose-400 font-bold group-hover:underline">Gerenciar Fila →</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Bento Action: Atendimento em Grupo (8 Columns) */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2.5 text-slate-900">
                <span className="p-2 rounded-xl" style={{ backgroundColor: "#E3F2FD", color: "#1565C0" }}>
                  <Users className="w-5 h-5" />
                </span>
                Atendimento em Grupo
              </h2>
              <div className="flex items-center gap-2">
                {onOpenNovoGrupo && (
                  <button
                    onClick={onOpenNovoGrupo}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Novo Grupo
                  </button>
                )}
                {setActiveTab && (
                  <button
                    onClick={() => setActiveTab("atendimento-grupo")}
                    className="text-sm text-indigo-600 font-semibold hover:underline"
                  >
                    Ver Cronograma
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3.5">
              {gruposAtivos.length === 0 ? (
                <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  Nenhum grupo ativo cadastrado no momento.
                </div>
              ) : (
                gruposAtivos.slice(0, 3).map((grp, idx) => {
                  const badgeColors = [
                    "bg-blue-500",
                    "bg-emerald-500",
                    "bg-orange-500",
                    "bg-purple-500",
                  ];
                  const colorBg = badgeColors[idx % badgeColors.length];
                  const numMembros = grp.participantesIds.length;

                  return (
                    <div
                      key={grp.id}
                      className="p-4 border border-slate-100 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex gap-4 items-center">
                        <div
                          className={`w-12 h-12 ${colorBg} rounded-2xl flex items-center justify-center text-white text-sm font-bold shadow-xs shrink-0`}
                        >
                          G{idx + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-base">
                            {grp.nome}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium">
                            Facilitador(a): <strong className="text-slate-700">{grp.responsavelNome}</strong> • {grp.categoria}
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="inline-block text-xs font-bold text-blue-600 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full">
                          Em andamento
                        </span>
                        <p className="text-xs text-slate-400 mt-1 font-medium">
                          {numMembros}/{grp.maxVagas} Participantes
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              <strong>Dica de Prática:</strong> Registre chamadas regulares para acompanhar a frequência socioassistencial.
            </span>
            {onOpenNovaSessao && (
              <button
                onClick={onOpenNovaSessao}
                className="text-indigo-600 hover:text-indigo-800 font-bold whitespace-nowrap"
              >
                + Registrar Sessão
              </button>
            )}
          </div>
        </div>

        {/* Side Bento Card: Encaminhamento (4 Columns) */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-rose-600">
                <Send className="w-5 h-5" />
                Encaminhamento
              </h2>
            </div>

            <div className="space-y-4">
              <div className="text-center p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <p className="text-xs font-medium text-slate-500 mb-1">
                  Novas solicitações pendentes
                </p>
                <p className="text-4xl font-black text-rose-600">
                  {String(encaminhamentosPendentes.length).padStart(2, "0")}
                </p>
              </div>

              <div className="space-y-2.5">
                {encaminhamentosPendentes.slice(0, 3).map((enc, idx) => {
                  const isUrgente = enc.prioridade === "Urgente";
                  const isPrioritario = enc.prioridade === "Prioritário";
                  const bgClass = isUrgente
                    ? "bg-rose-50 border-rose-200"
                    : isPrioritario
                    ? "bg-amber-50 border-amber-200"
                    : "bg-slate-50 border-slate-200";
                  const dotClass = isUrgente
                    ? "bg-rose-500"
                    : isPrioritario
                    ? "bg-amber-500"
                    : "bg-slate-400";
                  const textClass = isUrgente
                    ? "text-rose-900"
                    : isPrioritario
                    ? "text-amber-900"
                    : "text-slate-800";
                  const subTextClass = isUrgente
                    ? "text-rose-600"
                    : isPrioritario
                    ? "text-amber-600"
                    : "text-slate-500";

                  return (
                    <div
                      key={enc.id}
                      className={`p-3 rounded-xl border ${bgClass} flex items-center gap-3 transition-colors`}
                    >
                      <div className={`w-2.5 h-2.5 ${dotClass} rounded-full shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold ${textClass} truncate`}>
                          {enc.setorDestino}
                        </p>
                        <p className={`text-[11px] ${subTextClass} truncate`}>
                          {enc.pacienteNome} • {enc.prioridade}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {encaminhamentosPendentes.length === 0 && (
                  <div className="p-3 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                    Sem encaminhamentos pendentes.
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (setActiveTab) setActiveTab("encaminhamento");
              else if (onOpenNovoEncaminhamento) onOpenNovoEncaminhamento();
            }}
            className="w-full mt-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold shadow-sm transition-all"
          >
            Gerenciar Filas & Guias
          </button>
        </div>

        {/* Bottom Card 1: Fila de Espera / Atendimento (4 Columns) */}
        <div className="col-span-12 md:col-span-4 bg-indigo-600 rounded-2xl shadow-lg p-6 text-white flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-indigo-100 text-xs font-bold uppercase tracking-wider">
                Fila de Atendimento
              </h3>
              <p className="text-4xl font-black mt-2">
                04 <span className="text-lg font-normal text-indigo-200">pacientes</span>
              </p>
            </div>
            <div className="p-2.5 bg-indigo-500/80 rounded-xl shadow-xs">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-xs text-indigo-200 mt-6 font-medium">
            Tempo médio de espera: <span className="font-bold text-white">12 min</span>
          </p>
        </div>

        {/* Bottom Card 2: Histórico de Atendimentos do Dia (4 Columns) */}
        <div className="col-span-12 md:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              Atendimentos de Hoje
            </h3>
            <div className="flex gap-2 mb-3">
              <div className="h-2 flex-1 bg-indigo-500 rounded-full" />
              <div className="h-2 flex-1 bg-indigo-500 rounded-full" />
              <div className="h-2 flex-1 bg-indigo-500 rounded-full" />
              <div className="h-2 flex-1 bg-indigo-500 rounded-full" />
              <div className="h-2 flex-1 bg-slate-200 rounded-full" />
            </div>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Meta diária: <strong className="text-slate-800 font-bold">18 de 30</strong> atendimentos realizados.
          </p>
        </div>

        {/* Bottom Card 3: Ações Rápidas (4 Columns) */}
        <div className="col-span-12 md:col-span-4 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-xs p-6 flex flex-col justify-between">
          <h3 className="text-emerald-900 font-bold text-sm mb-3">Ações Rápidas</h3>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => setActiveTab && setActiveTab("relatorios")}
              className="p-2.5 bg-white rounded-xl border border-emerald-200 text-xs font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all shadow-2xs text-center"
            >
              Baixar Relatórios
            </button>
            {onOpenNovoGrupo && (
              <button
                onClick={onOpenNovoGrupo}
                className="p-2.5 bg-white rounded-xl border border-emerald-200 text-xs font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all shadow-2xs text-center"
              >
                Novo Grupo
              </button>
            )}
            {onOpenNovoAtendimentoIndiv && (
              <button
                onClick={onOpenNovoAtendimentoIndiv}
                className="p-2.5 bg-white rounded-xl border border-emerald-200 text-xs font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all shadow-2xs text-center"
              >
                Atend. Individual
              </button>
            )}
            {onOpenNovoEncaminhamento && (
              <button
                onClick={onOpenNovoEncaminhamento}
                className="p-2.5 bg-white rounded-xl border border-emerald-200 text-xs font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all shadow-2xs text-center"
              >
                Emitir Guia
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
