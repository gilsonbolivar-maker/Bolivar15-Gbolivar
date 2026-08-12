import {
  Paciente,
  AtendimentoIndividual,
  GrupoAtendimento,
  SessaoGrupo,
  Encaminhamento,
} from "./types";
import {
  INITIAL_PACIENTES,
  INITIAL_ATENDIMENTOS_INDIVIDUAIS,
  INITIAL_GRUPOS,
  INITIAL_SESSOES_GRUPO,
  INITIAL_ENCAMINHAMENTOS,
} from "./mockData";

const KEYS = {
  PACIENTES: "app_atendimento_pacientes_v1",
  ATENDIMENTOS: "app_atendimento_individuais_v1",
  GRUPOS: "app_atendimento_grupos_v1",
  SESSOES: "app_atendimento_sessoes_v1",
  ENCAMINHAMENTOS: "app_atendimento_encaminhamentos_v1",
};

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

export const loadData = () => {
  return {
    pacientes: loadPacientes(),
    atendimentos: loadAtendimentosIndividuais(),
    grupos: loadGrupos(),
    sessoesGrupo: loadSessoesGrupo(),
    encaminhamentos: loadEncaminhamentos(),
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
};
