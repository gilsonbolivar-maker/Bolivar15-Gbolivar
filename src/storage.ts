import {
  Paciente,
  AtendimentoIndividual,
  GrupoAtendimento,
  SessaoGrupo,
  Encaminhamento,
  Escola,
  Compromisso,
  CasoPrioritario,
  ItemChecklist,
  Intervencao,
  Atividade,
  PerfilDesenvolvimentoAluno,
  PlanejamentoSessao,
  OrientacaoProfessor,
  AtendimentoFamilia,
  MaterialItem,
  IdeiaProjeto,
  MetaProfissional,
  RelatorioFormal,
} from "./types";
import {
  INITIAL_PACIENTES,
  INITIAL_ATENDIMENTOS_INDIVIDUAIS,
  INITIAL_GRUPOS,
  INITIAL_SESSOES_GRUPO,
  INITIAL_ENCAMINHAMENTOS,
  INITIAL_ESCOLAS,
  INITIAL_COMPROMISSOS,
  INITIAL_CASOS_PRIORITARIOS,
  INITIAL_CHECKLIST_DIARIO,
  INITIAL_INTERVENCOES,
  INITIAL_ATIVIDADES,
  INITIAL_PERFIS_DESENVOLVIMENTO,
  INITIAL_PLANEJAMENTOS_SESSAO,
  INITIAL_ORIENTACOES_PROFESSORES,
  INITIAL_ATENDIMENTOS_FAMILIA,
  INITIAL_MATERIAIS,
  INITIAL_PROJETOS,
  INITIAL_METAS_PROFISSIONAIS,
  INITIAL_RELATORIOS_FORMAIS,
} from "./mockData";

const KEYS = {
  PACIENTES: "app_atendimento_pacientes_v1",
  ATENDIMENTOS: "app_atendimento_individuais_v1",
  GRUPOS: "app_atendimento_grupos_v1",
  SESSOES: "app_atendimento_sessoes_v1",
  ENCAMINHAMENTOS: "app_atendimento_encaminhamentos_v1",
  ESCOLAS: "app_atendimento_escolas_v1",
  COMPROMISSOS: "app_atendimento_compromissos_v1",
  CASOS_PRIORITARIOS: "app_atendimento_casos_prioritarios_v1",
  CHECKLIST_DIARIO: "app_atendimento_checklist_diario_v1",
  INTERVENCOES: "app_atendimento_intervencoes_v1",
  ATIVIDADES: "app_atendimento_atividades_v1",
  PERFIS_DESENVOLVIMENTO: "app_atendimento_perfis_desenvolvimento_v1",
  PLANEJAMENTOS_SESSAO: "app_atendimento_planejamentos_sessao_v1",
  ORIENTACOES_PROFESSORES: "app_atendimento_orientacoes_professores_v1",
  ATENDIMENTOS_FAMILIA: "app_atendimento_atendimentos_familia_v1",
  MATERIAIS: "app_atendimento_materiais_v1",
  PROJETOS: "app_atendimento_projetos_v1",
  METAS_PROFISSIONAIS: "app_atendimento_metas_profissionais_v1",
  RELATORIOS_FORMAIS: "app_atendimento_relatorios_formais_v1",
};

// Helper genérico de load/save para os módulos incorporados do PsicoEscolar
// (evita repetir o mesmo boilerplate try/catch de get/set no localStorage).
function createLoadSave<T>(key: string, initial: T[]) {
  const load = (): T[] => {
    try {
      const data = localStorage.getItem(key);
      if (!data) {
        localStorage.setItem(key, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch {
      return initial;
    }
  };

  const save = (items: T[]) => {
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch (err) {
      console.error(`Erro ao salvar ${key} no localStorage`, err);
    }
  };

  return { load, save };
}

export const loadPacientes = (): Paciente[] => {
  try {
    const data = localStorage.getItem(KEYS.PACIENTES);
    if (!data) {
      localStorage.setItem(KEYS.PACIENTES, JSON.stringify(INITIAL_PACIENTES));
      return INITIAL_PACIENTES;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_PACIENTES;
  }
};

export const savePacientes = (pacientes: Paciente[]) => {
  try {
    localStorage.setItem(KEYS.PACIENTES, JSON.stringify(pacientes));
  } catch (err) {
    console.error("Erro ao salvar pacientes no localStorage", err);
  }
};

export const loadAtendimentosIndividuais = (): AtendimentoIndividual[] => {
  try {
    const data = localStorage.getItem(KEYS.ATENDIMENTOS);
    if (!data) {
      localStorage.setItem(
        KEYS.ATENDIMENTOS,
        JSON.stringify(INITIAL_ATENDIMENTOS_INDIVIDUAIS)
      );
      return INITIAL_ATENDIMENTOS_INDIVIDUAIS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_ATENDIMENTOS_INDIVIDUAIS;
  }
};

export const saveAtendimentosIndividuais = (
  atendimentos: AtendimentoIndividual[]
) => {
  try {
    localStorage.setItem(KEYS.ATENDIMENTOS, JSON.stringify(atendimentos));
  } catch (err) {
    console.error("Erro ao salvar atendimentos no localStorage", err);
  }
};

export const loadGrupos = (): GrupoAtendimento[] => {
  try {
    const data = localStorage.getItem(KEYS.GRUPOS);
    if (!data) {
      localStorage.setItem(KEYS.GRUPOS, JSON.stringify(INITIAL_GRUPOS));
      return INITIAL_GRUPOS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_GRUPOS;
  }
};

export const saveGrupos = (grupos: GrupoAtendimento[]) => {
  try {
    localStorage.setItem(KEYS.GRUPOS, JSON.stringify(grupos));
  } catch (err) {
    console.error("Erro ao salvar grupos no localStorage", err);
  }
};

export const loadSessoesGrupo = (): SessaoGrupo[] => {
  try {
    const data = localStorage.getItem(KEYS.SESSOES);
    if (!data) {
      localStorage.setItem(
        KEYS.SESSOES,
        JSON.stringify(INITIAL_SESSOES_GRUPO)
      );
      return INITIAL_SESSOES_GRUPO;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_SESSOES_GRUPO;
  }
};

export const saveSessoesGrupo = (sessoes: SessaoGrupo[]) => {
  try {
    localStorage.setItem(KEYS.SESSOES, JSON.stringify(sessoes));
  } catch (err) {
    console.error("Erro ao salvar sessoes no localStorage", err);
  }
};

export const loadEncaminhamentos = (): Encaminhamento[] => {
  try {
    const data = localStorage.getItem(KEYS.ENCAMINHAMENTOS);
    if (!data) {
      localStorage.setItem(
        KEYS.ENCAMINHAMENTOS,
        JSON.stringify(INITIAL_ENCAMINHAMENTOS)
      );
      return INITIAL_ENCAMINHAMENTOS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_ENCAMINHAMENTOS;
  }
};

export const saveEncaminhamentos = (encaminhamentos: Encaminhamento[]) => {
  try {
    localStorage.setItem(KEYS.ENCAMINHAMENTOS, JSON.stringify(encaminhamentos));
  } catch (err) {
    console.error("Erro ao salvar encaminhamentos no localStorage", err);
  }
};

// Módulos incorporados do app PsicoEscolar (versão Lovable)
export const escolasStorage = createLoadSave<Escola>(KEYS.ESCOLAS, INITIAL_ESCOLAS);
export const compromissosStorage = createLoadSave<Compromisso>(KEYS.COMPROMISSOS, INITIAL_COMPROMISSOS);
export const casosPrioritariosStorage = createLoadSave<CasoPrioritario>(KEYS.CASOS_PRIORITARIOS, INITIAL_CASOS_PRIORITARIOS);
export const checklistDiarioStorage = createLoadSave<ItemChecklist>(KEYS.CHECKLIST_DIARIO, INITIAL_CHECKLIST_DIARIO);
export const intervencoesStorage = createLoadSave<Intervencao>(KEYS.INTERVENCOES, INITIAL_INTERVENCOES);
export const atividadesStorage = createLoadSave<Atividade>(KEYS.ATIVIDADES, INITIAL_ATIVIDADES);
export const perfisDesenvolvimentoStorage = createLoadSave<PerfilDesenvolvimentoAluno>(KEYS.PERFIS_DESENVOLVIMENTO, INITIAL_PERFIS_DESENVOLVIMENTO);
export const planejamentosSessaoStorage = createLoadSave<PlanejamentoSessao>(KEYS.PLANEJAMENTOS_SESSAO, INITIAL_PLANEJAMENTOS_SESSAO);
export const orientacoesProfessoresStorage = createLoadSave<OrientacaoProfessor>(KEYS.ORIENTACOES_PROFESSORES, INITIAL_ORIENTACOES_PROFESSORES);
export const atendimentosFamiliaStorage = createLoadSave<AtendimentoFamilia>(KEYS.ATENDIMENTOS_FAMILIA, INITIAL_ATENDIMENTOS_FAMILIA);
export const materiaisStorage = createLoadSave<MaterialItem>(KEYS.MATERIAIS, INITIAL_MATERIAIS);
export const projetosStorage = createLoadSave<IdeiaProjeto>(KEYS.PROJETOS, INITIAL_PROJETOS);
export const metasProfissionaisStorage = createLoadSave<MetaProfissional>(KEYS.METAS_PROFISSIONAIS, INITIAL_METAS_PROFISSIONAIS);
export const relatoriosFormaisStorage = createLoadSave<RelatorioFormal>(KEYS.RELATORIOS_FORMAIS, INITIAL_RELATORIOS_FORMAIS);

export const loadData = () => {
  return {
    pacientes: loadPacientes(),
    atendimentos: loadAtendimentosIndividuais(),
    grupos: loadGrupos(),
    sessoesGrupo: loadSessoesGrupo(),
    encaminhamentos: loadEncaminhamentos(),
    escolas: escolasStorage.load(),
    compromissos: compromissosStorage.load(),
    casosPrioritarios: casosPrioritariosStorage.load(),
    checklistDiario: checklistDiarioStorage.load(),
    intervencoes: intervencoesStorage.load(),
    atividades: atividadesStorage.load(),
    perfisDesenvolvimento: perfisDesenvolvimentoStorage.load(),
    planejamentosSessao: planejamentosSessaoStorage.load(),
    orientacoesProfessores: orientacoesProfessoresStorage.load(),
    atendimentosFamilia: atendimentosFamiliaStorage.load(),
    materiais: materiaisStorage.load(),
    projetos: projetosStorage.load(),
    metasProfissionais: metasProfissionaisStorage.load(),
    relatoriosFormais: relatoriosFormaisStorage.load(),
  };
};

export const saveData = (data: {
  pacientes: Paciente[];
  atendimentos: AtendimentoIndividual[];
  grupos: GrupoAtendimento[];
  sessoesGrupo: SessaoGrupo[];
  encaminhamentos: Encaminhamento[];
}) => {
  savePacientes(data.pacientes);
  saveAtendimentosIndividuais(data.atendimentos);
  saveGrupos(data.grupos);
  saveSessoesGrupo(data.sessoesGrupo);
  saveEncaminhamentos(data.encaminhamentos);
};

/** Tipo completo de backup: todas as entidades do app (usado no export/import em JSON e no backup do Drive). */
export type FullBackupPayload = ReturnType<typeof loadData>;

/** Persiste TODAS as entidades do app de uma vez (usado ao restaurar um backup completo). */
export const saveAllData = (data: FullBackupPayload) => {
  savePacientes(data.pacientes);
  saveAtendimentosIndividuais(data.atendimentos);
  saveGrupos(data.grupos);
  saveSessoesGrupo(data.sessoesGrupo);
  saveEncaminhamentos(data.encaminhamentos);
  escolasStorage.save(data.escolas);
  compromissosStorage.save(data.compromissos);
  casosPrioritariosStorage.save(data.casosPrioritarios);
  checklistDiarioStorage.save(data.checklistDiario);
  intervencoesStorage.save(data.intervencoes);
  atividadesStorage.save(data.atividades);
  perfisDesenvolvimentoStorage.save(data.perfisDesenvolvimento);
  planejamentosSessaoStorage.save(data.planejamentosSessao);
  orientacoesProfessoresStorage.save(data.orientacoesProfessores);
  atendimentosFamiliaStorage.save(data.atendimentosFamilia);
  materiaisStorage.save(data.materiais);
  projetosStorage.save(data.projetos);
  metasProfissionaisStorage.save(data.metasProfissionais);
  relatoriosFormaisStorage.save(data.relatoriosFormais);
};

export const resetAllData = () => {
  localStorage.setItem(KEYS.PACIENTES, JSON.stringify(INITIAL_PACIENTES));
  localStorage.setItem(
    KEYS.ATENDIMENTOS,
    JSON.stringify(INITIAL_ATENDIMENTOS_INDIVIDUAIS)
  );
  localStorage.setItem(KEYS.GRUPOS, JSON.stringify(INITIAL_GRUPOS));
  localStorage.setItem(KEYS.SESSOES, JSON.stringify(INITIAL_SESSOES_GRUPO));
  localStorage.setItem(
    KEYS.ENCAMINHAMENTOS,
    JSON.stringify(INITIAL_ENCAMINHAMENTOS)
  );
  localStorage.setItem(KEYS.ESCOLAS, JSON.stringify(INITIAL_ESCOLAS));
  localStorage.setItem(KEYS.COMPROMISSOS, JSON.stringify(INITIAL_COMPROMISSOS));
  localStorage.setItem(KEYS.CASOS_PRIORITARIOS, JSON.stringify(INITIAL_CASOS_PRIORITARIOS));
  localStorage.setItem(KEYS.CHECKLIST_DIARIO, JSON.stringify(INITIAL_CHECKLIST_DIARIO));
  localStorage.setItem(KEYS.INTERVENCOES, JSON.stringify(INITIAL_INTERVENCOES));
  localStorage.setItem(KEYS.ATIVIDADES, JSON.stringify(INITIAL_ATIVIDADES));
  localStorage.setItem(KEYS.PERFIS_DESENVOLVIMENTO, JSON.stringify(INITIAL_PERFIS_DESENVOLVIMENTO));
  localStorage.setItem(KEYS.PLANEJAMENTOS_SESSAO, JSON.stringify(INITIAL_PLANEJAMENTOS_SESSAO));
  localStorage.setItem(KEYS.ORIENTACOES_PROFESSORES, JSON.stringify(INITIAL_ORIENTACOES_PROFESSORES));
  localStorage.setItem(KEYS.ATENDIMENTOS_FAMILIA, JSON.stringify(INITIAL_ATENDIMENTOS_FAMILIA));
  localStorage.setItem(KEYS.MATERIAIS, JSON.stringify(INITIAL_MATERIAIS));
  localStorage.setItem(KEYS.PROJETOS, JSON.stringify(INITIAL_PROJETOS));
  localStorage.setItem(KEYS.METAS_PROFISSIONAIS, JSON.stringify(INITIAL_METAS_PROFISSIONAIS));
  localStorage.setItem(KEYS.RELATORIOS_FORMAIS, JSON.stringify(INITIAL_RELATORIOS_FORMAIS));
};
