export type Prioridade = 'Rotina' | 'Prioritário' | 'Urgente';

export type StatusEncaminhamento = 'Pendente' | 'Em Análise' | 'Agendado' | 'Concluido' | 'Cancelado';

export type TipoAtendimentoIndividual =
  | 'Acolhimento'
  | 'Consulta Terapêutica'
  | 'Atendimento Social'
  | 'Visita Domiciliar'
  | 'Teleatendimento'
  | 'Retorno';

export type CategoriaGrupo =
  | 'Grupo Terapêutico'
  | 'Socioeducativo'
  | 'Apoio Psicológico'
  | 'Grupo de Convivência'
  | 'Prevenção do Tabagismo'
  | 'Grupo de Gestantes'
  | 'Oficina de Artes e Habilidades';

export interface Paciente {
  id: string;
  nome: string;
  nomeSocial?: string;
  cpf: string;
  rg?: string;
  cartaoSus?: string;
  dataNascimento: string;
  sexo: 'Masculino' | 'Feminino' | 'Outro';
  telefone: string;
  email?: string;
  endereco: string;
  bairro?: string;
  cidade?: string;
  status?: string;
  nomeMae?: string;
  vulnerabilidades: string[];
  beneficiosSociais?: string[];
  profissoes?: string;
  observacoesAlergias?: string;
  dataCadastro: string;
}

export interface AtendimentoIndividual {
  id: string;
  pacienteId: string;
  pacienteNome: string;
  profissionalNome: string;
  profissionalCargo: string;
  dataHora: string;
  tipoAtendimento: TipoAtendimentoIndividual;
  demandaMotivo: string;
  prontuarioNotas: string;
  diagnosticoCid?: string;
  status: 'Agendado' | 'Em Andamento' | 'Concluido' | 'Cancelado';
  encaminhadoNaSessao?: boolean;
  encaminhamentoIdGerado?: string;
}

export interface GrupoAtendimento {
  id: string;
  nome: string;
  categoria: CategoriaGrupo;
  descricao: string;
  responsavelNome: string;
  responsavelCargo: string;
  coResponsavel?: string;
  localSala: string;
  frequencia: 'Semanal' | 'Quinzenal' | 'Mensal';
  horarioPadrao: string;
  maxVagas: number;
  participantesIds: string[];
  status: 'Ativo' | 'Pausado' | 'Encerrado';
  dataCriacao: string;
}

export interface PresencaParticipante {
  presente: boolean;
  observacaoIndividual?: string;
}

export interface SessaoGrupo {
  id: string;
  grupoId: string;
  grupoNome: string;
  dataHora: string;
  temaSessao: string;
  pautaDetalhada: string;
  sinteseRelato: string;
  facilitadorNome: string;
  presencas: Record<string, PresencaParticipante>;
  totalPresentes: number;
  totalAusentes: number;
}

export interface ContraEncaminhamento {
  id: string;
  dataParecer: string;
  profissionalDestino: string;
  cargoDestino: string;
  parecerTecnico: string;
  condutaAdotada: string;
  retornoNecessario: boolean;
}

export interface Encaminhamento {
  id: string;
  pacienteId: string;
  pacienteNome: string;
  pacienteCpf: string;
  setorOrigem: string;
  profissionalEmissor: string;
  cargoEmissor: string;
  setorDestino: string;
  especialidadeDestino: string;
  prioridade: Prioridade;
  motivoEncaminhamento: string;
  justificativaTecnica: string;
  hipoteseDiagnostica?: string;
  dataEmissao: string;
  status: StatusEncaminhamento;
  contraEncaminhamento?: ContraEncaminhamento;
  atendimentoOrigemId?: string;
}

export type TabMenu =
  | 'dashboard'
  | 'pacientes'
  | 'atendimento-individual'
  | 'atendimento-grupo'
  | 'encaminhamento'
  | 'relatorios';
