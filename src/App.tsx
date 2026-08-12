import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Users2,
  ArrowRightLeft,
} from "lucide-react";
import {
  Paciente,
  AtendimentoIndividual,
  GrupoAtendimento,
  SessaoGrupo,
  Encaminhamento,
  StatusEncaminhamento,
  ContraEncaminhamento,
  TabMenu,
  Escola,
  CasoPrioritario,
  ItemChecklist,
} from "./types";
import {
  loadData,
  saveData,
  resetAllData,
  escolasStorage,
  casosPrioritariosStorage,
  checklistDiarioStorage,
} from "./storage";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { ListaPacientes } from "./components/Pacientes/ListaPacientes";
import { FormPacienteModal } from "./components/Pacientes/FormPacienteModal";
import { ProntuarioModal } from "./components/Pacientes/ProntuarioModal";
import { ListaAtendimentos } from "./components/AtendimentoIndividual/ListaAtendimentos";
import { NovoAtendimentoModal } from "./components/AtendimentoIndividual/NovoAtendimentoModal";
import { GestaoGrupos } from "./components/AtendimentoGrupo/GestaoGrupos";
import { NovoGrupoModal } from "./components/AtendimentoGrupo/NovoGrupoModal";
import { SessaoGrupoModal } from "./components/AtendimentoGrupo/SessaoGrupoModal";
import { GestaoEncaminhamentos } from "./components/Encaminhamento/GestaoEncaminhamentos";
import { NovoEncaminhamentoModal } from "./components/Encaminhamento/NovoEncaminhamentoModal";
import { ContraEncaminhamentoModal } from "./components/Encaminhamento/ContraEncaminhamentoModal";
import { ImpressaoGuiaModal } from "./components/Encaminhamento/ImpressaoGuiaModal";
import { AiDocumentScannerModal } from "./components/AiDocumentScannerModal";
import { Relatorios } from "./components/Relatorios/Relatorios";
import { ApkDownloadModal } from "./components/ApkDownloadModal";
import { BackupDriveModal, BackupPayload } from "./components/BackupDriveModal";
import { GestaoEscolas } from "./components/Escolas/GestaoEscolas";
import { FormEscolaModal } from "./components/Escolas/FormEscolaModal";
import { GestaoCasosPrioritarios } from "./components/CasosPrioritarios/GestaoCasosPrioritarios";
import { FormCasoPrioritarioModal } from "./components/CasosPrioritarios/FormCasoPrioritarioModal";
import { ChecklistDiario } from "./components/ChecklistDiario/ChecklistDiario";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabMenu>("dashboard");

  // State entities
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [atendimentos, setAtendimentos] = useState<AtendimentoIndividual[]>([]);
  const [grupos, setGrupos] = useState<GrupoAtendimento[]>([]);
  const [sessoesGrupo, setSessoesGrupo] = useState<SessaoGrupo[]>([]);
  const [encaminhamentos, setEncaminhamentos] = useState<Encaminhamento[]>([]);
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [casosPrioritarios, setCasosPrioritarios] = useState<CasoPrioritario[]>([]);
  const [checklistDiario, setChecklistDiario] = useState<ItemChecklist[]>([]);

  // Modals state
  const [isFormEscolaOpen, setIsFormEscolaOpen] = useState(false);
  const [escolaParaEditar, setEscolaParaEditar] = useState<Escola | null>(null);

  const [isFormCasoPrioritarioOpen, setIsFormCasoPrioritarioOpen] = useState(false);
  const [casoPrioritarioParaEditar, setCasoPrioritarioParaEditar] = useState<CasoPrioritario | null>(null);
  const [isFormPacienteOpen, setIsFormPacienteOpen] = useState(false);
  const [pacienteParaEditar, setPacienteParaEditar] = useState<Paciente | null>(null);

  const [isProntuarioOpen, setIsProntuarioOpen] = useState(false);
  const [pacienteProntuario, setPacienteProntuario] = useState<Paciente | null>(null);

  const [isNovoAtendimentoOpen, setIsNovoAtendimentoOpen] = useState(false);
  const [pacientePreAtendimento, setPacientePreAtendimento] = useState<Paciente | null>(null);

  const [isNovoGrupoOpen, setIsNovoGrupoOpen] = useState(false);

  const [isNovaSessaoGrupoOpen, setIsNovaSessaoGrupoOpen] = useState(false);

  const [isNovoEncaminhamentoOpen, setIsNovoEncaminhamentoOpen] = useState(false);
  const [pacientePreEncaminhamento, setPacientePreEncaminhamento] = useState<Paciente | null>(null);

  const [isContraEncaminhamentoOpen, setIsContraEncaminhamentoOpen] = useState(false);
  const [encaminhamentoContra, setEncaminhamentoContra] = useState<Encaminhamento | null>(null);

  const [isImpressaoGuiaOpen, setIsImpressaoGuiaOpen] = useState(false);
  const [encaminhamentoImpressao, setEncaminhamentoImpressao] = useState<Encaminhamento | null>(null);

  const [isGlobalOcrOpen, setIsGlobalOcrOpen] = useState(false);
  const [isApkDownloadOpen, setIsApkDownloadOpen] = useState(false);
  const [isBackupDriveOpen, setIsBackupDriveOpen] = useState(false);

  // Load state on start
  useEffect(() => {
    const data = loadData();
    setPacientes(data.pacientes);
    setAtendimentos(data.atendimentos);
    setGrupos(data.grupos);
    setSessoesGrupo(data.sessoesGrupo);
    setEncaminhamentos(data.encaminhamentos);
    setEscolas(data.escolas);
    setCasosPrioritarios(data.casosPrioritarios);
    setChecklistDiario(data.checklistDiario);
  }, []);

  // Handlers for Escolas
  const handleSalvarEscola = (escola: Escola) => {
    const index = escolas.findIndex((e) => e.id === escola.id);
    const updated =
      index >= 0
        ? escolas.map((e) => (e.id === escola.id ? escola : e))
        : [escola, ...escolas];
    setEscolas(updated);
    escolasStorage.save(updated);
  };

  const handleDeletarEscola = (id: string) => {
    const updated = escolas.filter((e) => e.id !== id);
    setEscolas(updated);
    escolasStorage.save(updated);
  };

  // Handlers for Casos Prioritarios
  const handleSalvarCasoPrioritario = (caso: CasoPrioritario) => {
    const index = casosPrioritarios.findIndex((c) => c.id === caso.id);
    const updated =
      index >= 0
        ? casosPrioritarios.map((c) => (c.id === caso.id ? caso : c))
        : [caso, ...casosPrioritarios];
    setCasosPrioritarios(updated);
    casosPrioritariosStorage.save(updated);
  };

  const handleDeletarCasoPrioritario = (id: string) => {
    const updated = casosPrioritarios.filter((c) => c.id !== id);
    setCasosPrioritarios(updated);
    casosPrioritariosStorage.save(updated);
  };

  // Handlers for Checklist Diario
  const handleAlternarItemChecklist = (id: string) => {
    const updated = checklistDiario.map((item) =>
      item.id === id ? { ...item, concluido: !item.concluido } : item
    );
    setChecklistDiario(updated);
    checklistDiarioStorage.save(updated);
  };

  const handleAdicionarItemChecklist = (texto: string) => {
    const updated = [...checklistDiario, { id: `chk-${Date.now()}`, texto, concluido: false }];
    setChecklistDiario(updated);
    checklistDiarioStorage.save(updated);
  };

  const handleRemoverItemChecklist = (id: string) => {
    const updated = checklistDiario.filter((item) => item.id !== id);
    setChecklistDiario(updated);
    checklistDiarioStorage.save(updated);
  };

  const handleRestoreBackup = (restored: BackupPayload) => {
    setPacientes(restored.pacientes);
    setAtendimentos(restored.atendimentos);
    setGrupos(restored.grupos);
    setSessoesGrupo(restored.sessoesGrupo);
    setEncaminhamentos(restored.encaminhamentos);
    persistState(
      restored.pacientes,
      restored.atendimentos,
      restored.grupos,
      restored.sessoesGrupo,
      restored.encaminhamentos
    );
  };

  const handleResetData = () => {
    resetAllData();
    const data = loadData();
    setPacientes(data.pacientes);
    setAtendimentos(data.atendimentos);
    setGrupos(data.grupos);
    setSessoesGrupo(data.sessoesGrupo);
    setEncaminhamentos(data.encaminhamentos);
    setEscolas(data.escolas);
    setCasosPrioritarios(data.casosPrioritarios);
    setChecklistDiario(data.checklistDiario);
    setActiveTab("dashboard");
  };

  // Save state on any update
  const persistState = (
    newPacientes = pacientes,
    newAtendimentos = atendimentos,
    newGrupos = grupos,
    newSessoes = sessoesGrupo,
    newEncaminhamentos = encaminhamentos
  ) => {
    saveData({
      pacientes: newPacientes,
      atendimentos: newAtendimentos,
      grupos: newGrupos,
      sessoesGrupo: newSessoes,
      encaminhamentos: newEncaminhamentos,
    });
  };

  // Handlers for Pacientes
  const handleSavePaciente = (pacienteData: Paciente) => {
    let updated: Paciente[];
    const index = pacientes.findIndex((p) => p.id === pacienteData.id);
    if (index >= 0) {
      updated = [...pacientes];
      updated[index] = pacienteData;
    } else {
      updated = [pacienteData, ...pacientes];
    }
    setPacientes(updated);
    persistState(updated);
  };

  const handleDeletePaciente = (id: string) => {
    const updated = pacientes.filter((p) => p.id !== id);
    setPacientes(updated);
    persistState(updated);
  };

  // Handlers for Atendimento Individual
  const handleSaveAtendimento = (
    novoAtendimento: AtendimentoIndividual,
    encaminhamentoAuto?: Encaminhamento
  ) => {
    const updatedAtend = [novoAtendimento, ...atendimentos];
    let updatedEnc = encaminhamentos;

    if (encaminhamentoAuto) {
      updatedEnc = [encaminhamentoAuto, ...encaminhamentos];
      setEncaminhamentos(updatedEnc);
    }

    setAtendimentos(updatedAtend);
    persistState(pacientes, updatedAtend, grupos, sessoesGrupo, updatedEnc);
  };

  // Handlers for Grupos
  const handleSaveGrupo = (novoGrupo: GrupoAtendimento) => {
    const updated = [novoGrupo, ...grupos];
    setGrupos(updated);
    persistState(pacientes, atendimentos, updated);
  };

  const handleAdicionarPacienteAoGrupo = (grupoId: string, pacienteId: string) => {
    const updatedGrupos = grupos.map((g) => {
      if (g.id === grupoId && !g.participantesIds.includes(pacienteId)) {
        return {
          ...g,
          participantesIds: [...g.participantesIds, pacienteId],
        };
      }
      return g;
    });

    setGrupos(updatedGrupos);
    persistState(pacientes, atendimentos, updatedGrupos);
  };

  const handleSaveSessaoGrupo = (novaSessao: SessaoGrupo) => {
    const updated = [novaSessao, ...sessoesGrupo];
    setSessoesGrupo(updated);
    persistState(pacientes, atendimentos, grupos, updated);
  };

  // Handlers for Encaminhamentos
  const handleSaveEncaminhamento = (novoEnc: Encaminhamento) => {
    const updated = [novoEnc, ...encaminhamentos];
    setEncaminhamentos(updated);
    persistState(pacientes, atendimentos, grupos, sessoesGrupo, updated);
    // Gerar e abrir o PDF/Guia de Encaminhamento automaticamente após o envio
    setEncaminhamentoImpressao(novoEnc);
    setIsImpressaoGuiaOpen(true);
  };

  const handleSaveContraEncaminhamento = (
    encaminhamentoId: string,
    contraEnc: ContraEncaminhamento
  ) => {
    const updated = encaminhamentos.map((e) => {
      if (e.id === encaminhamentoId) {
        return {
          ...e,
          status: "Concluido" as StatusEncaminhamento,
          contraEncaminhamento: contraEnc,
        };
      }
      return e;
    });

    setEncaminhamentos(updated);
    persistState(pacientes, atendimentos, grupos, sessoesGrupo, updated);
  };

  const handleAtualizarStatusEncaminhamento = (
    id: string,
    novoStatus: StatusEncaminhamento
  ) => {
    const updated = encaminhamentos.map((e) => {
      if (e.id === id) {
        return { ...e, status: novoStatus };
      }
      return e;
    });

    setEncaminhamentos(updated);
    persistState(pacientes, atendimentos, grupos, sessoesGrupo, updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col">
      {/* App Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNovoPaciente={() => {
          setPacienteParaEditar(null);
          setIsFormPacienteOpen(true);
        }}
        onOpenNovoAtendimentoIndiv={() => {
          setPacientePreAtendimento(null);
          setIsNovoAtendimentoOpen(true);
        }}
        onOpenNovoGrupo={() => setIsNovoGrupoOpen(true)}
        onOpenNovoEncaminhamento={() => {
          setPacientePreEncaminhamento(null);
          setIsNovoEncaminhamentoOpen(true);
        }}
        onOpenNovaSessaoGrupo={() => {
          setIsNovaSessaoGrupoOpen(true);
        }}
        onOpenOcrScanner={() => {
          setIsGlobalOcrOpen(true);
        }}
        onOpenApkDownload={() => setIsApkDownloadOpen(true)}
        onOpenBackupDrive={() => setIsBackupDriveOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
        {activeTab === "dashboard" && (
          <Dashboard
            pacientes={pacientes}
            atendimentos={atendimentos}
            grupos={grupos}
            sessoesGrupo={sessoesGrupo}
            encaminhamentos={encaminhamentos}
            setActiveTab={setActiveTab}
            onOpenNovoPaciente={() => {
              setPacienteParaEditar(null);
              setIsFormPacienteOpen(true);
            }}
            onOpenNovoAtendimento={() => {
              setPacientePreAtendimento(null);
              setIsNovoAtendimentoOpen(true);
            }}
            onOpenNovoEncaminhamento={() => {
              setPacientePreEncaminhamento(null);
              setIsNovoEncaminhamentoOpen(true);
            }}
            onOpenNovaSessaoGrupo={() => {
              setIsNovaSessaoGrupoOpen(true);
            }}
            onVerProntuario={(p) => {
              setPacienteProntuario(p);
              setIsProntuarioOpen(true);
            }}
          />
        )}

        {activeTab === "pacientes" && (
          <ListaPacientes
            pacientes={pacientes}
            onOpenNovoPaciente={() => {
              setPacienteParaEditar(null);
              setIsFormPacienteOpen(true);
            }}
            onOpenOcrScanner={() => setIsGlobalOcrOpen(true)}
            onEditarPaciente={(p) => {
              setPacienteParaEditar(p);
              setIsFormPacienteOpen(true);
            }}
            onDeletarPaciente={handleDeletePaciente}
            onVerProntuario={(p) => {
              setPacienteProntuario(p);
              setIsProntuarioOpen(true);
            }}
            onNovoAtendimento={(p) => {
              setPacientePreAtendimento(p);
              setIsNovoAtendimentoOpen(true);
            }}
            onNovoEncaminhamento={(p) => {
              setPacientePreEncaminhamento(p);
              setIsNovoEncaminhamentoOpen(true);
            }}
          />
        )}

        {activeTab === "atendimento-individual" && (
          <ListaAtendimentos
            atendimentos={atendimentos}
            pacientes={pacientes}
            onOpenNovoAtendimento={() => {
              setPacientePreAtendimento(null);
              setIsNovoAtendimentoOpen(true);
            }}
            onVerProntuario={(p) => {
              setPacienteProntuario(p);
              setIsProntuarioOpen(true);
            }}
          />
        )}

        {activeTab === "atendimento-grupo" && (
          <GestaoGrupos
            grupos={grupos}
            sessoesGrupo={sessoesGrupo}
            pacientes={pacientes}
            onOpenNovoGrupo={() => setIsNovoGrupoOpen(true)}
            onOpenNovaSessao={() => setIsNovaSessaoGrupoOpen(true)}
            onAdicionarPacienteAoGrupo={handleAdicionarPacienteAoGrupo}
          />
        )}

        {activeTab === "encaminhamento" && (
          <GestaoEncaminhamentos
            encaminhamentos={encaminhamentos}
            pacientes={pacientes}
            onOpenNovoEncaminhamento={() => {
              setPacientePreEncaminhamento(null);
              setIsNovoEncaminhamentoOpen(true);
            }}
            onOpenContraEncaminhamento={(enc) => {
              setEncaminhamentoContra(enc);
              setIsContraEncaminhamentoOpen(true);
            }}
            onImprimirGuia={(enc) => {
              setEncaminhamentoImpressao(enc);
              setIsImpressaoGuiaOpen(true);
            }}
            onAtualizarStatus={handleAtualizarStatusEncaminhamento}
          />
        )}

        {activeTab === "relatorios" && (
          <Relatorios
            pacientes={pacientes}
            atendimentos={atendimentos}
            grupos={grupos}
            sessoesGrupo={sessoesGrupo}
            encaminhamentos={encaminhamentos}
          />
        )}

        {activeTab === "escolas" && (
          <GestaoEscolas
            escolas={escolas}
            pacientes={pacientes}
            onOpenNovaEscola={() => {
              setEscolaParaEditar(null);
              setIsFormEscolaOpen(true);
            }}
            onEditarEscola={(escola) => {
              setEscolaParaEditar(escola);
              setIsFormEscolaOpen(true);
            }}
            onDeletarEscola={handleDeletarEscola}
          />
        )}

        {activeTab === "casos-prioritarios" && (
          <GestaoCasosPrioritarios
            casos={casosPrioritarios}
            pacientes={pacientes}
            onOpenNovoCaso={() => {
              setCasoPrioritarioParaEditar(null);
              setIsFormCasoPrioritarioOpen(true);
            }}
            onEditarCaso={(caso) => {
              setCasoPrioritarioParaEditar(caso);
              setIsFormCasoPrioritarioOpen(true);
            }}
            onDeletarCaso={handleDeletarCasoPrioritario}
          />
        )}

        {activeTab === "checklist-diario" && (
          <ChecklistDiario
            itens={checklistDiario}
            onAlternarItem={handleAlternarItemChecklist}
            onAdicionarItem={handleAdicionarItemChecklist}
            onRemoverItem={handleRemoverItemChecklist}
          />
        )}
      </main>

      {/* MODALS */}
      <FormPacienteModal
        isOpen={isFormPacienteOpen}
        onClose={() => setIsFormPacienteOpen(false)}
        pacienteParaEditar={pacienteParaEditar}
        onSavePaciente={handleSavePaciente}
      />

      <ProntuarioModal
        isOpen={isProntuarioOpen}
        onClose={() => setIsProntuarioOpen(false)}
        paciente={pacienteProntuario}
        atendimentos={atendimentos}
        grupos={grupos}
        sessoesGrupo={sessoesGrupo}
        encaminhamentos={encaminhamentos}
        onOpenNovoAtendimento={(p) => {
          setPacientePreAtendimento(p);
          setIsNovoAtendimentoOpen(true);
        }}
        onOpenNovoEncaminhamento={(p) => {
          setPacientePreEncaminhamento(p);
          setIsNovoEncaminhamentoOpen(true);
        }}
      />

      <NovoAtendimentoModal
        isOpen={isNovoAtendimentoOpen}
        onClose={() => setIsNovoAtendimentoOpen(false)}
        pacientes={pacientes}
        pacientePreSelecionado={pacientePreAtendimento}
        onSaveAtendimento={handleSaveAtendimento}
      />

      <NovoGrupoModal
        isOpen={isNovoGrupoOpen}
        onClose={() => setIsNovoGrupoOpen(false)}
        onSaveGrupo={handleSaveGrupo}
      />

      <SessaoGrupoModal
        isOpen={isNovaSessaoGrupoOpen}
        onClose={() => setIsNovaSessaoGrupoOpen(false)}
        grupos={grupos}
        pacientes={pacientes}
        onSaveSessao={handleSaveSessaoGrupo}
      />

      <NovoEncaminhamentoModal
        isOpen={isNovoEncaminhamentoOpen}
        onClose={() => setIsNovoEncaminhamentoOpen(false)}
        pacientes={pacientes}
        pacientePreSelecionado={pacientePreEncaminhamento}
        onSaveEncaminhamento={handleSaveEncaminhamento}
      />

      <ContraEncaminhamentoModal
        isOpen={isContraEncaminhamentoOpen}
        onClose={() => setIsContraEncaminhamentoOpen(false)}
        encaminhamento={encaminhamentoContra}
        onSaveContraEncaminhamento={handleSaveContraEncaminhamento}
      />

      <ImpressaoGuiaModal
        isOpen={isImpressaoGuiaOpen}
        onClose={() => setIsImpressaoGuiaOpen(false)}
        encaminhamento={encaminhamentoImpressao}
        paciente={
          encaminhamentoImpressao
            ? pacientes.find((p) => p.id === encaminhamentoImpressao.pacienteId) ||
              null
            : null
        }
      />

      <AiDocumentScannerModal
        isOpen={isGlobalOcrOpen}
        onClose={() => setIsGlobalOcrOpen(false)}
        targetFormName="Leitor de Documentos OCR"
        onDataExtracted={(extracted) => {
          // Open new patient modal prefilled with extracted OCR data
          const novoPac: Paciente = {
            id: `pac-${Date.now()}`,
            nome: extracted.nome || "Aluno Lido via OCR",
            cpf: extracted.cpf || "",
            rg: extracted.rg || "",
            cartaoSus: extracted.cartaoSus || "",
            dataNascimento: extracted.dataNascimento || "",
            sexo: (extracted.sexo as any) || "Outro",
            telefone: extracted.telefone || "",
            email: extracted.email || "",
            endereco: extracted.endereco || "",
            nomeMae: extracted.nomeMae || "",
            observacoesAlergias: extracted.observacoesAlergias || "",
            vulnerabilidades: extracted.vulnerabilidades || [],
            status: "Ativo",
            dataCadastro: new Date().toISOString().split("T")[0],
          };
          setPacienteParaEditar(novoPac);
          setIsFormPacienteOpen(true);
        }}
      />

      <ApkDownloadModal
        isOpen={isApkDownloadOpen}
        onClose={() => setIsApkDownloadOpen(false)}
      />

      <BackupDriveModal
        isOpen={isBackupDriveOpen}
        onClose={() => setIsBackupDriveOpen(false)}
        data={{ pacientes, atendimentos, grupos, sessoesGrupo, encaminhamentos }}
        onRestore={handleRestoreBackup}
      />

      <FormEscolaModal
        isOpen={isFormEscolaOpen}
        onClose={() => setIsFormEscolaOpen(false)}
        onSalvarEscola={handleSalvarEscola}
        escolaParaEditar={escolaParaEditar}
      />

      <FormCasoPrioritarioModal
        isOpen={isFormCasoPrioritarioOpen}
        onClose={() => setIsFormCasoPrioritarioOpen(false)}
        pacientes={pacientes}
        onSalvarCaso={handleSalvarCasoPrioritario}
        casoParaEditar={casoPrioritarioParaEditar}
      />

      {/* Mobile Android Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-slate-900 border-t border-slate-800 text-slate-400 z-40 shadow-lg px-2 py-1 flex items-center justify-around">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-colors ${
            activeTab === "dashboard" ? "text-amber-400 bg-slate-800" : "hover:text-slate-200"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Início</span>
        </button>

        <button
          onClick={() => setActiveTab("pacientes")}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-colors ${
            activeTab === "pacientes" ? "text-indigo-400 bg-slate-800" : "hover:text-slate-200"
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Alunos</span>
        </button>

        <button
          onClick={() => setActiveTab("atendimento-individual")}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-colors ${
            activeTab === "atendimento-individual" ? "text-indigo-400 bg-slate-800" : "hover:text-slate-200"
          }`}
        >
          <UserCheck className="w-5 h-5" />
          <span>Indiv.</span>
        </button>

        <button
          onClick={() => setActiveTab("atendimento-grupo")}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-colors ${
            activeTab === "atendimento-grupo" ? "text-indigo-400 bg-slate-800" : "hover:text-slate-200"
          }`}
        >
          <Users2 className="w-5 h-5" />
          <span>Grupos</span>
        </button>

        <button
          onClick={() => setActiveTab("encaminhamento")}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-colors ${
            activeTab === "encaminhamento" ? "text-amber-400 bg-slate-800" : "hover:text-slate-200"
          }`}
        >
          <ArrowRightLeft className="w-5 h-5" />
          <span>Encaminh.</span>
        </button>
      </nav>
    </div>
  );
}
