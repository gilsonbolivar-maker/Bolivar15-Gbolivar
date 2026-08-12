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
} from "./types";
import { loadData, saveData } from "./storage";
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

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "pacientes" | "atendimentos" | "grupos" | "encaminhamentos"
  >("dashboard");

  // State entities
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [atendimentos, setAtendimentos] = useState<AtendimentoIndividual[]>([]);
  const [grupos, setGrupos] = useState<GrupoAtendimento[]>([]);
  const [sessoesGrupo, setSessoesGrupo] = useState<SessaoGrupo[]>([]);
  const [encaminhamentos, setEncaminhamentos] = useState<Encaminhamento[]>([]);

  // Modals state
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

  // Load state on start
  useEffect(() => {
    const data = loadData();
    setPacientes(data.pacientes);
    setAtendimentos(data.atendimentos);
    setGrupos(data.grupos);
    setSessoesGrupo(data.sessoesGrupo);
    setEncaminhamentos(data.encaminhamentos);
  }, []);

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

        {activeTab === "atendimentos" && (
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

        {activeTab === "grupos" && (
          <GestaoGrupos
            grupos={grupos}
            sessoesGrupo={sessoesGrupo}
            pacientes={pacientes}
            onOpenNovoGrupo={() => setIsNovoGrupoOpen(true)}
            onOpenNovaSessao={() => setIsNovaSessaoGrupoOpen(true)}
            onAdicionarPacienteAoGrupo={handleAdicionarPacienteAoGrupo}
          />
        )}

        {activeTab === "encaminhamentos" && (
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
            nome: extracted.nome || "Cidadão Lido via OCR",
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
          <span>Cidadãos</span>
        </button>

        <button
          onClick={() => setActiveTab("atendimentos")}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-colors ${
            activeTab === "atendimentos" ? "text-indigo-400 bg-slate-800" : "hover:text-slate-200"
          }`}
        >
          <UserCheck className="w-5 h-5" />
          <span>Indiv.</span>
        </button>

        <button
          onClick={() => setActiveTab("grupos")}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-colors ${
            activeTab === "grupos" ? "text-indigo-400 bg-slate-800" : "hover:text-slate-200"
          }`}
        >
          <Users2 className="w-5 h-5" />
          <span>Grupos</span>
        </button>

        <button
          onClick={() => setActiveTab("encaminhamentos")}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-colors ${
            activeTab === "encaminhamentos" ? "text-amber-400 bg-slate-800" : "hover:text-slate-200"
          }`}
        >
          <ArrowRightLeft className="w-5 h-5" />
          <span>Encaminh.</span>
        </button>
      </nav>
    </div>
  );
}
