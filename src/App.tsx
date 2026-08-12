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
  Compromisso,
  Intervencao,
  Atividade,
  PerfilDesenvolvimentoAluno,
  PlanejamentoSessao as PlanejamentoSessaoTipo,
  OrientacaoProfessor,
  AtendimentoFamilia,
  RelatorioFormal,
  MaterialItem,
  IdeiaProjeto,
  MetaProfissional,
} from "./types";
import {
  loadData,
  saveData,
  saveAllData,
  resetAllData,
  escolasStorage,
  casosPrioritariosStorage,
  checklistDiarioStorage,
  compromissosStorage,
  intervencoesStorage,
  atividadesStorage,
  perfisDesenvolvimentoStorage,
  planejamentosSessaoStorage,
  orientacoesProfessoresStorage,
  atendimentosFamiliaStorage,
  relatoriosFormaisStorage,
  materiaisStorage,
  projetosStorage,
  metasProfissionaisStorage,
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
import { BackupDriveModal, PartialBackupPayload } from "./components/BackupDriveModal";
import { GestaoEscolas } from "./components/Escolas/GestaoEscolas";
import { FormEscolaModal } from "./components/Escolas/FormEscolaModal";
import { GestaoCasosPrioritarios } from "./components/CasosPrioritarios/GestaoCasosPrioritarios";
import { FormCasoPrioritarioModal } from "./components/CasosPrioritarios/FormCasoPrioritarioModal";
import { ChecklistDiario } from "./components/ChecklistDiario/ChecklistDiario";
import { Agenda } from "./components/Agenda/Agenda";
import { FormCompromissoModal } from "./components/Agenda/FormCompromissoModal";
import { BancoIntervencoes } from "./components/BancoIntervencoes/BancoIntervencoes";
import { FormIntervencaoModal } from "./components/BancoIntervencoes/FormIntervencaoModal";
import { BancoAtividades } from "./components/BancoAtividades/BancoAtividades";
import { FormAtividadeModal } from "./components/BancoAtividades/FormAtividadeModal";
import { AreasDesenvolvimento } from "./components/AreasDesenvolvimento/AreasDesenvolvimento";
import { FormPerfilDesenvolvimentoModal } from "./components/AreasDesenvolvimento/FormPerfilDesenvolvimentoModal";
import { PlanejamentoSessao } from "./components/PlanejamentoSessao/PlanejamentoSessao";
import { FormPlanejamentoSessaoModal } from "./components/PlanejamentoSessao/FormPlanejamentoSessaoModal";
import { GestaoOrientacoesProfessores } from "./components/OrientacaoProfessores/GestaoOrientacoesProfessores";
import { FormOrientacaoProfessorModal } from "./components/OrientacaoProfessores/FormOrientacaoProfessorModal";
import { GestaoAtendimentosFamilia } from "./components/AtendimentoFamilias/GestaoAtendimentosFamilia";
import { FormAtendimentoFamiliaModal } from "./components/AtendimentoFamilias/FormAtendimentoFamiliaModal";
import { GestaoRelatoriosFormais } from "./components/RelatoriosFormais/GestaoRelatoriosFormais";
import { FormRelatorioFormalModal } from "./components/RelatoriosFormais/FormRelatorioFormalModal";
import { VisualizarRelatorioModal } from "./components/RelatoriosFormais/VisualizarRelatorioModal";
import { BancoMateriais } from "./components/BancoMateriais/BancoMateriais";
import { FormMaterialModal } from "./components/BancoMateriais/FormMaterialModal";
import { IdeiasProjetos } from "./components/IdeiasProjetos/IdeiasProjetos";
import { FormIdeiaProjetoModal } from "./components/IdeiasProjetos/FormIdeiaProjetoModal";
import { MetasProfissionais } from "./components/MetasProfissionais/MetasProfissionais";
import { FormMetaProfissionalModal } from "./components/MetasProfissionais/FormMetaProfissionalModal";

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
  const [compromissos, setCompromissos] = useState<Compromisso[]>([]);
  const [intervencoes, setIntervencoes] = useState<Intervencao[]>([]);
  const [atividadesBanco, setAtividadesBanco] = useState<Atividade[]>([]);
  const [perfisDesenvolvimento, setPerfisDesenvolvimento] = useState<PerfilDesenvolvimentoAluno[]>([]);
  const [planejamentosSessao, setPlanejamentosSessao] = useState<PlanejamentoSessaoTipo[]>([]);
  const [orientacoesProfessores, setOrientacoesProfessores] = useState<OrientacaoProfessor[]>([]);
  const [atendimentosFamilia, setAtendimentosFamilia] = useState<AtendimentoFamilia[]>([]);
  const [relatoriosFormais, setRelatoriosFormais] = useState<RelatorioFormal[]>([]);
  const [materiais, setMateriais] = useState<MaterialItem[]>([]);
  const [projetos, setProjetos] = useState<IdeiaProjeto[]>([]);
  const [metasProfissionais, setMetasProfissionais] = useState<MetaProfissional[]>([]);

  // Modals state
  const [isFormEscolaOpen, setIsFormEscolaOpen] = useState(false);
  const [escolaParaEditar, setEscolaParaEditar] = useState<Escola | null>(null);

  const [isFormCasoPrioritarioOpen, setIsFormCasoPrioritarioOpen] = useState(false);
  const [casoPrioritarioParaEditar, setCasoPrioritarioParaEditar] = useState<CasoPrioritario | null>(null);

  const [isFormCompromissoOpen, setIsFormCompromissoOpen] = useState(false);
  const [compromissoParaEditar, setCompromissoParaEditar] = useState<Compromisso | null>(null);

  const [isFormIntervencaoOpen, setIsFormIntervencaoOpen] = useState(false);
  const [intervencaoParaEditar, setIntervencaoParaEditar] = useState<Intervencao | null>(null);

  const [isFormAtividadeOpen, setIsFormAtividadeOpen] = useState(false);
  const [atividadeParaEditar, setAtividadeParaEditar] = useState<Atividade | null>(null);

  const [isFormPerfilDesenvolvimentoOpen, setIsFormPerfilDesenvolvimentoOpen] = useState(false);
  const [pacienteParaPerfil, setPacienteParaPerfil] = useState<Paciente | null>(null);

  const [isFormPlanejamentoOpen, setIsFormPlanejamentoOpen] = useState(false);
  const [planejamentoParaEditar, setPlanejamentoParaEditar] = useState<PlanejamentoSessaoTipo | null>(null);

  const [isFormOrientacaoOpen, setIsFormOrientacaoOpen] = useState(false);
  const [orientacaoParaEditar, setOrientacaoParaEditar] = useState<OrientacaoProfessor | null>(null);

  const [isFormAtendimentoFamiliaOpen, setIsFormAtendimentoFamiliaOpen] = useState(false);
  const [atendimentoFamiliaParaEditar, setAtendimentoFamiliaParaEditar] = useState<AtendimentoFamilia | null>(null);

  const [isFormRelatorioFormalOpen, setIsFormRelatorioFormalOpen] = useState(false);
  const [relatorioFormalParaEditar, setRelatorioFormalParaEditar] = useState<RelatorioFormal | null>(null);

  const [isVisualizarRelatorioOpen, setIsVisualizarRelatorioOpen] = useState(false);
  const [relatorioParaVisualizar, setRelatorioParaVisualizar] = useState<RelatorioFormal | null>(null);

  const [isFormMaterialOpen, setIsFormMaterialOpen] = useState(false);
  const [materialParaEditar, setMaterialParaEditar] = useState<MaterialItem | null>(null);

  const [isFormProjetoOpen, setIsFormProjetoOpen] = useState(false);
  const [projetoParaEditar, setProjetoParaEditar] = useState<IdeiaProjeto | null>(null);

  const [isFormMetaOpen, setIsFormMetaOpen] = useState(false);
  const [metaParaEditar, setMetaParaEditar] = useState<MetaProfissional | null>(null);
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
    setCompromissos(data.compromissos);
    setIntervencoes(data.intervencoes);
    setAtividadesBanco(data.atividades);
    setPerfisDesenvolvimento(data.perfisDesenvolvimento);
    setPlanejamentosSessao(data.planejamentosSessao);
    setOrientacoesProfessores(data.orientacoesProfessores);
    setAtendimentosFamilia(data.atendimentosFamilia);
    setRelatoriosFormais(data.relatoriosFormais);
    setMateriais(data.materiais);
    setProjetos(data.projetos);
    setMetasProfissionais(data.metasProfissionais);
  }, []);

  // Handlers for Banco de Materiais
  const handleSalvarMaterial = (m: MaterialItem) => {
    const index = materiais.findIndex((x) => x.id === m.id);
    const updated = index >= 0 ? materiais.map((x) => (x.id === m.id ? m : x)) : [m, ...materiais];
    setMateriais(updated);
    materiaisStorage.save(updated);
  };

  const handleDeletarMaterial = (id: string) => {
    const updated = materiais.filter((x) => x.id !== id);
    setMateriais(updated);
    materiaisStorage.save(updated);
  };

  // Handlers for Ideias de Projetos
  const handleSalvarProjeto = (p: IdeiaProjeto) => {
    const index = projetos.findIndex((x) => x.id === p.id);
    const updated = index >= 0 ? projetos.map((x) => (x.id === p.id ? p : x)) : [p, ...projetos];
    setProjetos(updated);
    projetosStorage.save(updated);
  };

  const handleDeletarProjeto = (id: string) => {
    const updated = projetos.filter((x) => x.id !== id);
    setProjetos(updated);
    projetosStorage.save(updated);
  };

  // Handlers for Metas Profissionais
  const handleSalvarMeta = (m: MetaProfissional) => {
    const index = metasProfissionais.findIndex((x) => x.id === m.id);
    const updated =
      index >= 0 ? metasProfissionais.map((x) => (x.id === m.id ? m : x)) : [m, ...metasProfissionais];
    setMetasProfissionais(updated);
    metasProfissionaisStorage.save(updated);
  };

  const handleDeletarMeta = (id: string) => {
    const updated = metasProfissionais.filter((x) => x.id !== id);
    setMetasProfissionais(updated);
    metasProfissionaisStorage.save(updated);
  };

  const handleAlternarMetaConcluida = (id: string) => {
    const updated = metasProfissionais.map((m) =>
      m.id === id ? { ...m, concluida: !m.concluida } : m
    );
    setMetasProfissionais(updated);
    metasProfissionaisStorage.save(updated);
  };

  // Handlers for Relatorios Formais
  const handleSalvarRelatorioFormal = (r: RelatorioFormal) => {
    const index = relatoriosFormais.findIndex((x) => x.id === r.id);
    const updated =
      index >= 0
        ? relatoriosFormais.map((x) => (x.id === r.id ? r : x))
        : [r, ...relatoriosFormais];
    setRelatoriosFormais(updated);
    relatoriosFormaisStorage.save(updated);
  };

  const handleDeletarRelatorioFormal = (id: string) => {
    const updated = relatoriosFormais.filter((x) => x.id !== id);
    setRelatoriosFormais(updated);
    relatoriosFormaisStorage.save(updated);
  };

  // Handlers for Orientacao a Professores
  const handleSalvarOrientacao = (o: OrientacaoProfessor) => {
    const index = orientacoesProfessores.findIndex((x) => x.id === o.id);
    const updated =
      index >= 0
        ? orientacoesProfessores.map((x) => (x.id === o.id ? o : x))
        : [o, ...orientacoesProfessores];
    setOrientacoesProfessores(updated);
    orientacoesProfessoresStorage.save(updated);
  };

  const handleDeletarOrientacao = (id: string) => {
    const updated = orientacoesProfessores.filter((x) => x.id !== id);
    setOrientacoesProfessores(updated);
    orientacoesProfessoresStorage.save(updated);
  };

  // Handlers for Atendimento a Familias
  const handleSalvarAtendimentoFamilia = (a: AtendimentoFamilia) => {
    const index = atendimentosFamilia.findIndex((x) => x.id === a.id);
    const updated =
      index >= 0
        ? atendimentosFamilia.map((x) => (x.id === a.id ? a : x))
        : [a, ...atendimentosFamilia];
    setAtendimentosFamilia(updated);
    atendimentosFamiliaStorage.save(updated);
  };

  const handleDeletarAtendimentoFamilia = (id: string) => {
    const updated = atendimentosFamilia.filter((x) => x.id !== id);
    setAtendimentosFamilia(updated);
    atendimentosFamiliaStorage.save(updated);
  };

  // Handlers for Planejamento de Sessao
  const handleSalvarPlanejamento = (planejamento: PlanejamentoSessaoTipo) => {
    const index = planejamentosSessao.findIndex((p) => p.id === planejamento.id);
    const updated =
      index >= 0
        ? planejamentosSessao.map((p) => (p.id === planejamento.id ? planejamento : p))
        : [planejamento, ...planejamentosSessao];
    setPlanejamentosSessao(updated);
    planejamentosSessaoStorage.save(updated);
  };

  const handleDeletarPlanejamento = (id: string) => {
    const updated = planejamentosSessao.filter((p) => p.id !== id);
    setPlanejamentosSessao(updated);
    planejamentosSessaoStorage.save(updated);
  };

  // Handlers for Banco de Intervencoes
  const handleSalvarIntervencao = (intervencao: Intervencao) => {
    const index = intervencoes.findIndex((i) => i.id === intervencao.id);
    const updated =
      index >= 0
        ? intervencoes.map((i) => (i.id === intervencao.id ? intervencao : i))
        : [intervencao, ...intervencoes];
    setIntervencoes(updated);
    intervencoesStorage.save(updated);
  };

  const handleDeletarIntervencao = (id: string) => {
    const updated = intervencoes.filter((i) => i.id !== id);
    setIntervencoes(updated);
    intervencoesStorage.save(updated);
  };

  // Handlers for Banco de Atividades
  const handleSalvarAtividade = (atividade: Atividade) => {
    const index = atividadesBanco.findIndex((a) => a.id === atividade.id);
    const updated =
      index >= 0
        ? atividadesBanco.map((a) => (a.id === atividade.id ? atividade : a))
        : [atividade, ...atividadesBanco];
    setAtividadesBanco(updated);
    atividadesStorage.save(updated);
  };

  const handleDeletarAtividade = (id: string) => {
    const updated = atividadesBanco.filter((a) => a.id !== id);
    setAtividadesBanco(updated);
    atividadesStorage.save(updated);
  };

  // Handlers for Perfis de Desenvolvimento
  const handleSalvarPerfilDesenvolvimento = (perfil: PerfilDesenvolvimentoAluno) => {
    const index = perfisDesenvolvimento.findIndex((p) => p.pacienteId === perfil.pacienteId);
    const updated =
      index >= 0
        ? perfisDesenvolvimento.map((p) => (p.pacienteId === perfil.pacienteId ? perfil : p))
        : [perfil, ...perfisDesenvolvimento];
    setPerfisDesenvolvimento(updated);
    perfisDesenvolvimentoStorage.save(updated);
  };

  // Handlers for Agenda (Compromissos)
  const handleSalvarCompromisso = (compromisso: Compromisso) => {
    const index = compromissos.findIndex((c) => c.id === compromisso.id);
    const updated =
      index >= 0
        ? compromissos.map((c) => (c.id === compromisso.id ? compromisso : c))
        : [compromisso, ...compromissos];
    setCompromissos(updated);
    compromissosStorage.save(updated);
  };

  const handleDeletarCompromisso = (id: string) => {
    const updated = compromissos.filter((c) => c.id !== id);
    setCompromissos(updated);
    compromissosStorage.save(updated);
  };

  const handleAlternarCompromissoConcluido = (id: string) => {
    const updated = compromissos.map((c) =>
      c.id === id ? { ...c, concluido: !c.concluido } : c
    );
    setCompromissos(updated);
    compromissosStorage.save(updated);
  };

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

  const handleRestoreBackup = (restored: PartialBackupPayload) => {
    // Campos ausentes no backup (ex: arquivo antigo/parcial) mantêm o valor atual,
    // em vez de apagar dados que aquele backup nem conhecia.
    const next = {
      pacientes: restored.pacientes ?? pacientes,
      atendimentos: restored.atendimentos ?? atendimentos,
      grupos: restored.grupos ?? grupos,
      sessoesGrupo: restored.sessoesGrupo ?? sessoesGrupo,
      encaminhamentos: restored.encaminhamentos ?? encaminhamentos,
      escolas: restored.escolas ?? escolas,
      compromissos: restored.compromissos ?? compromissos,
      casosPrioritarios: restored.casosPrioritarios ?? casosPrioritarios,
      checklistDiario: restored.checklistDiario ?? checklistDiario,
      intervencoes: restored.intervencoes ?? intervencoes,
      atividades: restored.atividades ?? atividadesBanco,
      perfisDesenvolvimento: restored.perfisDesenvolvimento ?? perfisDesenvolvimento,
      planejamentosSessao: restored.planejamentosSessao ?? planejamentosSessao,
      orientacoesProfessores: restored.orientacoesProfessores ?? orientacoesProfessores,
      atendimentosFamilia: restored.atendimentosFamilia ?? atendimentosFamilia,
      materiais: restored.materiais ?? materiais,
      projetos: restored.projetos ?? projetos,
      metasProfissionais: restored.metasProfissionais ?? metasProfissionais,
      relatoriosFormais: restored.relatoriosFormais ?? relatoriosFormais,
    };

    setPacientes(next.pacientes);
    setAtendimentos(next.atendimentos);
    setGrupos(next.grupos);
    setSessoesGrupo(next.sessoesGrupo);
    setEncaminhamentos(next.encaminhamentos);
    setEscolas(next.escolas);
    setCompromissos(next.compromissos);
    setCasosPrioritarios(next.casosPrioritarios);
    setChecklistDiario(next.checklistDiario);
    setIntervencoes(next.intervencoes);
    setAtividadesBanco(next.atividades);
    setPerfisDesenvolvimento(next.perfisDesenvolvimento);
    setPlanejamentosSessao(next.planejamentosSessao);
    setOrientacoesProfessores(next.orientacoesProfessores);
    setAtendimentosFamilia(next.atendimentosFamilia);
    setMateriais(next.materiais);
    setProjetos(next.projetos);
    setMetasProfissionais(next.metasProfissionais);
    setRelatoriosFormais(next.relatoriosFormais);

    saveAllData(next);
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
    setCompromissos(data.compromissos);
    setIntervencoes(data.intervencoes);
    setAtividadesBanco(data.atividades);
    setPerfisDesenvolvimento(data.perfisDesenvolvimento);
    setPlanejamentosSessao(data.planejamentosSessao);
    setOrientacoesProfessores(data.orientacoesProfessores);
    setAtendimentosFamilia(data.atendimentosFamilia);
    setRelatoriosFormais(data.relatoriosFormais);
    setMateriais(data.materiais);
    setProjetos(data.projetos);
    setMetasProfissionais(data.metasProfissionais);
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

        {activeTab === "agenda" && (
          <Agenda
            compromissos={compromissos}
            pacientes={pacientes}
            escolas={escolas}
            onOpenNovoCompromisso={() => {
              setCompromissoParaEditar(null);
              setIsFormCompromissoOpen(true);
            }}
            onEditarCompromisso={(c) => {
              setCompromissoParaEditar(c);
              setIsFormCompromissoOpen(true);
            }}
            onDeletarCompromisso={handleDeletarCompromisso}
            onAlternarConcluido={handleAlternarCompromissoConcluido}
          />
        )}

        {activeTab === "banco-intervencoes" && (
          <BancoIntervencoes
            intervencoes={intervencoes}
            onOpenNovaIntervencao={() => {
              setIntervencaoParaEditar(null);
              setIsFormIntervencaoOpen(true);
            }}
            onEditarIntervencao={(i) => {
              setIntervencaoParaEditar(i);
              setIsFormIntervencaoOpen(true);
            }}
            onDeletarIntervencao={handleDeletarIntervencao}
          />
        )}

        {activeTab === "banco-atividades" && (
          <BancoAtividades
            atividades={atividadesBanco}
            onOpenNovaAtividade={() => {
              setAtividadeParaEditar(null);
              setIsFormAtividadeOpen(true);
            }}
            onEditarAtividade={(a) => {
              setAtividadeParaEditar(a);
              setIsFormAtividadeOpen(true);
            }}
            onDeletarAtividade={handleDeletarAtividade}
          />
        )}

        {activeTab === "areas-desenvolvimento" && (
          <AreasDesenvolvimento
            pacientes={pacientes}
            perfis={perfisDesenvolvimento}
            onEditarPerfil={(p) => {
              setPacienteParaPerfil(p);
              setIsFormPerfilDesenvolvimentoOpen(true);
            }}
          />
        )}

        {activeTab === "planejamento-sessao" && (
          <PlanejamentoSessao
            planejamentos={planejamentosSessao}
            pacientes={pacientes}
            onOpenNovoPlanejamento={() => {
              setPlanejamentoParaEditar(null);
              setIsFormPlanejamentoOpen(true);
            }}
            onEditarPlanejamento={(p) => {
              setPlanejamentoParaEditar(p);
              setIsFormPlanejamentoOpen(true);
            }}
            onDeletarPlanejamento={handleDeletarPlanejamento}
          />
        )}

        {activeTab === "orientacao-professores" && (
          <GestaoOrientacoesProfessores
            orientacoes={orientacoesProfessores}
            pacientes={pacientes}
            escolas={escolas}
            onOpenNovaOrientacao={() => {
              setOrientacaoParaEditar(null);
              setIsFormOrientacaoOpen(true);
            }}
            onEditarOrientacao={(o) => {
              setOrientacaoParaEditar(o);
              setIsFormOrientacaoOpen(true);
            }}
            onDeletarOrientacao={handleDeletarOrientacao}
          />
        )}

        {activeTab === "atendimento-familias" && (
          <GestaoAtendimentosFamilia
            atendimentos={atendimentosFamilia}
            pacientes={pacientes}
            onOpenNovoAtendimento={() => {
              setAtendimentoFamiliaParaEditar(null);
              setIsFormAtendimentoFamiliaOpen(true);
            }}
            onEditarAtendimento={(a) => {
              setAtendimentoFamiliaParaEditar(a);
              setIsFormAtendimentoFamiliaOpen(true);
            }}
            onDeletarAtendimento={handleDeletarAtendimentoFamilia}
          />
        )}

        {activeTab === "relatorios-formais" && (
          <GestaoRelatoriosFormais
            relatorios={relatoriosFormais}
            pacientes={pacientes}
            onOpenNovoRelatorio={() => {
              setRelatorioFormalParaEditar(null);
              setIsFormRelatorioFormalOpen(true);
            }}
            onEditarRelatorio={(r) => {
              setRelatorioFormalParaEditar(r);
              setIsFormRelatorioFormalOpen(true);
            }}
            onDeletarRelatorio={handleDeletarRelatorioFormal}
            onVisualizarRelatorio={(r) => {
              setRelatorioParaVisualizar(r);
              setIsVisualizarRelatorioOpen(true);
            }}
          />
        )}

        {activeTab === "banco-materiais" && (
          <BancoMateriais
            materiais={materiais}
            onOpenNovoMaterial={() => {
              setMaterialParaEditar(null);
              setIsFormMaterialOpen(true);
            }}
            onEditarMaterial={(m) => {
              setMaterialParaEditar(m);
              setIsFormMaterialOpen(true);
            }}
            onDeletarMaterial={handleDeletarMaterial}
          />
        )}

        {activeTab === "ideias-projetos" && (
          <IdeiasProjetos
            projetos={projetos}
            onOpenNovoProjeto={() => {
              setProjetoParaEditar(null);
              setIsFormProjetoOpen(true);
            }}
            onEditarProjeto={(p) => {
              setProjetoParaEditar(p);
              setIsFormProjetoOpen(true);
            }}
            onDeletarProjeto={handleDeletarProjeto}
          />
        )}

        {activeTab === "metas-profissionais" && (
          <MetasProfissionais
            metas={metasProfissionais}
            onOpenNovaMeta={() => {
              setMetaParaEditar(null);
              setIsFormMetaOpen(true);
            }}
            onEditarMeta={(m) => {
              setMetaParaEditar(m);
              setIsFormMetaOpen(true);
            }}
            onDeletarMeta={handleDeletarMeta}
            onAlternarConcluida={handleAlternarMetaConcluida}
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
        data={{
          pacientes,
          atendimentos,
          grupos,
          sessoesGrupo,
          encaminhamentos,
          escolas,
          compromissos,
          casosPrioritarios,
          checklistDiario,
          intervencoes,
          atividades: atividadesBanco,
          perfisDesenvolvimento,
          planejamentosSessao,
          orientacoesProfessores,
          atendimentosFamilia,
          materiais,
          projetos,
          metasProfissionais,
          relatoriosFormais,
        }}
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

      <FormCompromissoModal
        isOpen={isFormCompromissoOpen}
        onClose={() => setIsFormCompromissoOpen(false)}
        pacientes={pacientes}
        escolas={escolas}
        onSalvarCompromisso={handleSalvarCompromisso}
        compromissoParaEditar={compromissoParaEditar}
      />

      <FormIntervencaoModal
        isOpen={isFormIntervencaoOpen}
        onClose={() => setIsFormIntervencaoOpen(false)}
        onSalvarIntervencao={handleSalvarIntervencao}
        intervencaoParaEditar={intervencaoParaEditar}
      />

      <FormAtividadeModal
        isOpen={isFormAtividadeOpen}
        onClose={() => setIsFormAtividadeOpen(false)}
        onSalvarAtividade={handleSalvarAtividade}
        atividadeParaEditar={atividadeParaEditar}
      />

      <FormPerfilDesenvolvimentoModal
        isOpen={isFormPerfilDesenvolvimentoOpen}
        onClose={() => setIsFormPerfilDesenvolvimentoOpen(false)}
        paciente={pacienteParaPerfil}
        perfilAtual={perfisDesenvolvimento.find((p) => p.pacienteId === pacienteParaPerfil?.id)}
        onSalvarPerfil={handleSalvarPerfilDesenvolvimento}
      />

      <FormPlanejamentoSessaoModal
        isOpen={isFormPlanejamentoOpen}
        onClose={() => setIsFormPlanejamentoOpen(false)}
        pacientes={pacientes}
        onSalvarPlanejamento={handleSalvarPlanejamento}
        planejamentoParaEditar={planejamentoParaEditar}
      />

      <FormOrientacaoProfessorModal
        isOpen={isFormOrientacaoOpen}
        onClose={() => setIsFormOrientacaoOpen(false)}
        pacientes={pacientes}
        escolas={escolas}
        onSalvarOrientacao={handleSalvarOrientacao}
        orientacaoParaEditar={orientacaoParaEditar}
      />

      <FormAtendimentoFamiliaModal
        isOpen={isFormAtendimentoFamiliaOpen}
        onClose={() => setIsFormAtendimentoFamiliaOpen(false)}
        pacientes={pacientes}
        onSalvarAtendimento={handleSalvarAtendimentoFamilia}
        atendimentoParaEditar={atendimentoFamiliaParaEditar}
      />

      <FormRelatorioFormalModal
        isOpen={isFormRelatorioFormalOpen}
        onClose={() => setIsFormRelatorioFormalOpen(false)}
        pacientes={pacientes}
        onSalvarRelatorio={handleSalvarRelatorioFormal}
        relatorioParaEditar={relatorioFormalParaEditar}
      />

      <VisualizarRelatorioModal
        isOpen={isVisualizarRelatorioOpen}
        onClose={() => setIsVisualizarRelatorioOpen(false)}
        relatorio={relatorioParaVisualizar}
        paciente={pacientes.find((p) => p.id === relatorioParaVisualizar?.pacienteId) || null}
      />

      <FormMaterialModal
        isOpen={isFormMaterialOpen}
        onClose={() => setIsFormMaterialOpen(false)}
        onSalvarMaterial={handleSalvarMaterial}
        materialParaEditar={materialParaEditar}
      />

      <FormIdeiaProjetoModal
        isOpen={isFormProjetoOpen}
        onClose={() => setIsFormProjetoOpen(false)}
        onSalvarProjeto={handleSalvarProjeto}
        projetoParaEditar={projetoParaEditar}
      />

      <FormMetaProfissionalModal
        isOpen={isFormMetaOpen}
        onClose={() => setIsFormMetaOpen(false)}
        onSalvarMeta={handleSalvarMeta}
        metaParaEditar={metaParaEditar}
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
