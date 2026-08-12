import React, { useState } from "react";
import {
  Users,
  UserCheck,
  Send,
  LayoutDashboard,
  BarChart3,
  UserPlus,
  Sparkles,
  RefreshCw,
  HeartHandshake,
  Menu,
  X,
  ChevronDown,
  Camera,
  Smartphone,
  CloudUpload,
  Building2,
  AlertTriangle,
  CheckSquare,
  CalendarDays,
  Layers,
  Brain,
  GraduationCap,
  BookOpen,
  Package,
  FolderKanban,
  Target,
} from "lucide-react";
import { TabMenu } from "../types";

interface HeaderProps {
  activeTab: TabMenu;
  setActiveTab: (tab: TabMenu) => void;
  onOpenNovoPaciente: () => void;
  onOpenNovoAtendimentoIndiv: () => void;
  onOpenNovoGrupo: () => void;
  onOpenNovoEncaminhamento: () => void;
  onResetData: () => void;
  onOpenOcrScanner?: () => void;
  onOpenApkDownload?: () => void;
  onOpenBackupDrive?: () => void;
}

const TAB_LABELS: Record<TabMenu, string> = {
  dashboard: "Visão Geral",
  "atendimento-individual": "Atend. Individual",
  "atendimento-grupo": "Atend. Grupo",
  encaminhamento: "Encaminhamentos",
  pacientes: "Alunos / Pacientes",
  relatorios: "Indicadores",
  escolas: "Escolas",
  agenda: "Agenda",
  "casos-prioritarios": "Casos Prioritários",
  "checklist-diario": "Checklist Diário",
  "banco-intervencoes": "Banco de Intervenções",
  "banco-atividades": "Banco de Atividades",
  "areas-desenvolvimento": "Áreas do Desenvolvimento",
  "planejamento-sessao": "Planejamento de Sessão",
  "orientacao-professores": "Orientação a Professores",
  "atendimento-familias": "Atendimento a Famílias",
  "relatorios-formais": "Relatórios Formais",
  "banco-materiais": "Banco de Materiais",
  "ideias-projetos": "Ideias de Projetos",
  "metas-profissionais": "Metas Profissionais",
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenNovoPaciente,
  onOpenNovoAtendimentoIndiv,
  onOpenNovoGrupo,
  onOpenNovoEncaminhamento,
  onResetData,
  onOpenOcrScanner,
  onOpenApkDownload,
  onOpenBackupDrive,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSelectTab = (tab: TabMenu) => {
    setActiveTab(tab);
    // Optionally auto-collapse on small screens when selected
    if (window.innerWidth < 768) {
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="bg-[#082a2c] border-b border-[#0d3538] text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-5">
        {/* Top bar with Branding and Menu Toggle */}
        <div className="flex items-center justify-between py-2 text-xs">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs">
              <HeartHandshake className="w-4 h-4 text-white" />
            </div>

            <div className="min-w-0 flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight text-white truncate">
                PsicoEscolar 2.0
              </h1>
              <span className="text-indigo-300 hidden md:inline text-[11px] font-normal truncate">
                Atendimento & Gestão Psicoescolar
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                <Sparkles className="w-2.5 h-2.5 text-indigo-300" /> IA
              </span>
              <span className="hidden lg:inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                <span>Débora Costa (Psicóloga • CRP 03/24682)</span>
              </span>
              <span className="text-xs font-semibold text-amber-300 bg-[#0d3538]/80 px-2 py-0.5 rounded-md border border-[#124247]/80 truncate">
                {TAB_LABELS[activeTab]}
              </span>
            </div>
          </div>

          {/* Retractable Toggle Button */}
          <div className="flex items-center gap-2">
            {onOpenOcrScanner && (
              <button
                type="button"
                onClick={onOpenOcrScanner}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer"
                title="Escanear e ler documentos com OCR"
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Leitura OCR</span>
              </button>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0d3538]/90 hover:bg-[#124247] text-white text-xs font-semibold rounded-lg border border-[#1a5257]/80 shadow-xs transition-all"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <>
                  <X className="w-4 h-4 text-rose-300" />
                  <span>Fechar Menu</span>
                </>
              ) : (
                <>
                  <Menu className="w-4 h-4 text-indigo-300" />
                  <span>Menu</span>
                  <ChevronDown className="w-3.5 h-3.5 text-indigo-300" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Retractable Menu Drawer / Dropdown Panel */}
        {isMenuOpen && (
          <div className="py-3 border-t border-[#0d3538]/80 space-y-3 animate-fadeIn">
            {/* Navigation Tabs */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1.5">
                Navegação Principal
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5 text-xs">
                <button
                  onClick={() => handleSelectTab("dashboard")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    activeTab === "dashboard"
                      ? "bg-indigo-600 text-white font-bold shadow-sm"
                      : "bg-[#0d3538]/50 text-indigo-200 hover:bg-[#124247] hover:text-white"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Visão Geral</span>
                </button>

                <button
                  onClick={() => handleSelectTab("atendimento-individual")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    activeTab === "atendimento-individual"
                      ? "bg-indigo-600 text-white font-bold shadow-sm"
                      : "bg-[#0d3538]/50 text-indigo-200 hover:bg-[#124247] hover:text-white"
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Atend. Individual</span>
                </button>

                <button
                  onClick={() => handleSelectTab("atendimento-grupo")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    activeTab === "atendimento-grupo"
                      ? "bg-indigo-600 text-white font-bold shadow-sm"
                      : "bg-[#0d3538]/50 text-indigo-200 hover:bg-[#124247] hover:text-white"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Atend. Grupo</span>
                </button>

                <button
                  onClick={() => handleSelectTab("encaminhamento")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    activeTab === "encaminhamento"
                      ? "bg-indigo-600 text-white font-bold shadow-sm"
                      : "bg-[#0d3538]/50 text-indigo-200 hover:bg-[#124247] hover:text-white"
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>Encaminhamentos</span>
                </button>

                <button
                  onClick={() => handleSelectTab("pacientes")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    activeTab === "pacientes"
                      ? "bg-indigo-600 text-white font-bold shadow-sm"
                      : "bg-[#0d3538]/50 text-indigo-200 hover:bg-[#124247] hover:text-white"
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Alunos</span>
                </button>

                <button
                  onClick={() => handleSelectTab("escolas")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    activeTab === "escolas"
                      ? "bg-indigo-600 text-white font-bold shadow-sm"
                      : "bg-[#0d3538]/50 text-indigo-200 hover:bg-[#124247] hover:text-white"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Escolas</span>
                </button>

                <button
                  onClick={() => handleSelectTab("casos-prioritarios")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    activeTab === "casos-prioritarios"
                      ? "bg-indigo-600 text-white font-bold shadow-sm"
                      : "bg-[#0d3538]/50 text-indigo-200 hover:bg-[#124247] hover:text-white"
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Casos Prioritários</span>
                </button>

                <button
                  onClick={() => handleSelectTab("checklist-diario")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    activeTab === "checklist-diario"
                      ? "bg-indigo-600 text-white font-bold shadow-sm"
                      : "bg-[#0d3538]/50 text-indigo-200 hover:bg-[#124247] hover:text-white"
                  }`}
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>Checklist Diário</span>
                </button>

                <button
                  onClick={() => handleSelectTab("agenda")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    activeTab === "agenda"
                      ? "bg-indigo-600 text-white font-bold shadow-sm"
                      : "bg-[#0d3538]/50 text-indigo-200 hover:bg-[#124247] hover:text-white"
                  }`}
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>Agenda</span>
                </button>

                <button
                  onClick={() => handleSelectTab("banco-intervencoes")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    activeTab === "banco-intervencoes"
                      ? "bg-indigo-600 text-white font-bold shadow-sm"
                      : "bg-[#0d3538]/50 text-indigo-200 hover:bg-[#124247] hover:text-white"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Banco de Intervenções</span>
                </button>

                <button
                  onClick={() => handleSelectTab("banco-atividades")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    activeTab === "banco-atividades"
                      ? "bg-indigo-600 text-white font-bold shadow-sm"
                      : "bg-[#0d3538]/50 text-indigo-200 hover:bg-[#124247] hover:text-white"
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Banco de Atividades</span>
                </button>

                <button
                  onClick={() => handleSelectTab("areas-desenvolvimento")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    activeTab === "areas-desenvolvimento"
                      ? "bg-indigo-600 text-white font-bold shadow-sm"
                      : "bg-[#0d3538]/50 text-indigo-200 hover:bg-[#124247] hover:text-white"
                  }`}
                >
                  <Brain className="w-4 h-4" />
                  <span>Áreas do Desenvolvimento</span>
                </button>

                <button
                  onClick={() => handleSelectTab("planejamento-sessao")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    activeTab === "planejamento-sessao"
                      ? "bg-indigo-600 text-white font-bold shadow-sm"
                      : "bg-[#0d3538]/50 text-indigo-200 hover:bg-[#124247] hover:text-white"
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Planejamento de Sessão</span>
                </button>

                <button
                  onClick={() => handleSelectTab("orientacao-professores")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    activeTab === "orientacao-professores"
                      ? "bg-indigo-600 text-white font-bold shadow-sm"
                      : "bg-[#0d3538]/50 text-indigo-200 hover:bg-[#124247] hover:text-white"
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Orientação Professores</span>
                </button>

                <button
                  onClick={() => handleSelectTab("atendimento-familias")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    activeTab === "atendimento-familias"
                      ? "bg-indigo-600 text-white font-bold shadow-sm"
                      : "bg-[#0d3538]/50 text-indigo-200 hover:bg-[#124247] hover:text-white"
                  }`}
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>Atendimento Famílias</span>
                </button>

                <button
                  onClick={() => handleSelectTab("relatorios-formais")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    activeTab === "relatorios-formais"
                      ? "bg-indigo-600 text-white font-bold shadow-sm"
                      : "bg-[#0d3538]/50 text-indigo-200 hover:bg-[#124247] hover:text-white"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Relatórios Formais</span>
                </button>

                <button
                  onClick={() => handleSelectTab("banco-materiais")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    activeTab === "banco-materiais"
                      ? "bg-indigo-600 text-white font-bold shadow-sm"
                      : "bg-[#0d3538]/50 text-indigo-200 hover:bg-[#124247] hover:text-white"
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Banco de Materiais</span>
                </button>

                <button
                  onClick={() => handleSelectTab("ideias-projetos")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    activeTab === "ideias-projetos"
                      ? "bg-indigo-600 text-white font-bold shadow-sm"
                      : "bg-[#0d3538]/50 text-indigo-200 hover:bg-[#124247] hover:text-white"
                  }`}
                >
                  <FolderKanban className="w-4 h-4" />
                  <span>Ideias de Projetos</span>
                </button>

                <button
                  onClick={() => handleSelectTab("metas-profissionais")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    activeTab === "metas-profissionais"
                      ? "bg-indigo-600 text-white font-bold shadow-sm"
                      : "bg-[#0d3538]/50 text-indigo-200 hover:bg-[#124247] hover:text-white"
                  }`}
                >
                  <Target className="w-4 h-4" />
                  <span>Metas Profissionais</span>
                </button>

                <button
                  onClick={() => handleSelectTab("relatorios")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    activeTab === "relatorios"
                      ? "bg-indigo-600 text-white font-bold shadow-sm"
                      : "bg-[#0d3538]/50 text-indigo-200 hover:bg-[#124247] hover:text-white"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Indicadores</span>
                </button>
              </div>
            </div>

            {/* Quick Actions Bar inside Retractable Menu */}
            <div className="pt-2 border-t border-[#0d3538]/50">
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1.5">
                Ações Rápidas
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    onOpenNovoAtendimentoIndiv();
                    setIsMenuOpen(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-all"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Novo Atendimento Individual</span>
                </button>

                <button
                  onClick={() => {
                    onOpenNovoGrupo();
                    setIsMenuOpen(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-all"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Novo Atendimento em Grupo</span>
                </button>

                <button
                  onClick={() => {
                    onOpenNovoEncaminhamento();
                    setIsMenuOpen(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Novo Encaminhamento</span>
                </button>

                <button
                  onClick={() => {
                    onOpenNovoPaciente();
                    setIsMenuOpen(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0d3538]/80 hover:bg-[#124247] text-indigo-100 text-xs font-medium rounded-lg border border-[#124247] transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Cadastrar Novo Aluno</span>
                </button>

                {onOpenApkDownload && (
                  <button
                    onClick={() => {
                      onOpenApkDownload();
                      setIsMenuOpen(false);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700/90 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg shadow-xs transition-all"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Instalar App / Gerar APK</span>
                  </button>
                )}

                {onOpenBackupDrive && (
                  <button
                    onClick={() => {
                      onOpenBackupDrive();
                      setIsMenuOpen(false);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-700/90 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-xs transition-all"
                  >
                    <CloudUpload className="w-3.5 h-3.5" />
                    <span>Backup no Google Drive</span>
                  </button>
                )}

                <button
                  onClick={onResetData}
                  title="Restaurar dados de demonstração"
                  className="p-1.5 bg-[#0d3538]/60 hover:bg-[#124247] text-indigo-300 hover:text-white rounded-lg border border-[#124247]/80 transition-all ml-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

