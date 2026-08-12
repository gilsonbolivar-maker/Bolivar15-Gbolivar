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

export type PrioridadeCaso = 'Alta' | 'Média' | 'Baixa';

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
  // Contexto escolar (origem: integração com o app PsicoEscolar do Lovable)
  escolaId?: string;
  serie?: string;
  professor?: string;
  origemEncaminhamento?: string;
  hipoteseDiagnostica?: string;
  frequenciaAtendimento?: 'Semanal' | 'Quinzenal' | 'Mensal';
  prioridade?: PrioridadeCaso;
  dataPrimeiraSessao?: string;
  // Foto 3x4 (base64 dataURL) tirada na câmera ou selecionada da galeria no cadastro
  foto?: string;
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
  // Evolução clínica detalhada (origem: integração com o app PsicoEscolar do Lovable)
  objetivos?: string;
  planoIntervencao?: string;
  tecnicasUtilizadas?: string[];
  respostaCrianca?: string;
  orientacoesFornecidas?: string;
  proximosPassos?: string;
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
  | 'relatorios'
  | 'escolas'
  | 'agenda'
  | 'casos-prioritarios'
  | 'checklist-diario'
  | 'banco-intervencoes'
  | 'banco-atividades'
  | 'areas-desenvolvimento'
  | 'planejamento-sessao'
  | 'orientacao-professores'
  | 'atendimento-familias'
  | 'relatorios-formais'
  | 'banco-materiais'
  | 'ideias-projetos'
  | 'metas-profissionais';

// ============================================================================
// Módulos adicionados a partir do app PsicoEscolar (versão Lovable)
// ============================================================================

export interface Escola {
  id: string;
  nome: string;
  diretor: string;
  coordenador: string;
  telefone: string;
  endereco: string;
  diasAtendimento: string[];
  horarioAtendimento: string;
  numeroAlunos: number;
  observacoes: string;
}

export type TipoCompromisso =
  | 'Atendimento'
  | 'Reunião'
  | 'Visita à Escola'
  | 'Formação'
  | 'Devolutiva'
  | 'Entrega de Relatório';

export interface Compromisso {
  id: string;
  titulo: string;
  tipo: TipoCompromisso;
  data: string;
  horaInicio: string;
  horaFim: string;
  escolaId?: string;
  pacienteId?: string;
  local: string;
  descricao: string;
  concluido: boolean;
}

export type NivelUrgencia = 'Crítico' | 'Urgente' | 'Atenção Continuada';

export interface CasoPrioritario {
  id: string;
  pacienteId: string;
  motivoRisco: string;
  nivelUrgencia: NivelUrgencia;
  acoesIntensivas: string[];
  pendencias: string[];
  atualizadoEm: string;
}

export interface ItemChecklist {
  id: string;
  texto: string;
  concluido: boolean;
  padrao?: boolean;
}

export type TemaIntervencao =
  | 'Ansiedade'
  | 'Autismo'
  | 'TDAH'
  | 'TOD'
  | 'Deficiência Intelectual'
  | 'Dificuldades de aprendizagem'
  | 'Habilidades sociais'
  | 'Autorregulação'
  | 'Bullying'
  | 'Emoções'
  | 'Regras e limites'
  | 'Inclusão'
  | 'Orientação para professores'
  | 'Orientação para famílias';

export interface Intervencao {
  id: string;
  titulo: string;
  tema: TemaIntervencao;
  descricao: string;
  objetivos: string[];
  passoAPasso: string[];
  materiaisSugeridos?: string[];
}

export type AreaDesenvolvimento =
  | 'Atenção'
  | 'Concentração'
  | 'Memória'
  | 'Linguagem'
  | 'Leitura'
  | 'Escrita'
  | 'Consciência fonológica'
  | 'Raciocínio lógico'
  | 'Planejamento'
  | 'Funções executivas'
  | 'Flexibilidade cognitiva'
  | 'Controle inibitório'
  | 'Coordenação motora fina'
  | 'Coordenação motora ampla'
  | 'Percepção visual'
  | 'Percepção auditiva'
  | 'Organização espacial'
  | 'Organização temporal'
  | 'Comunicação'
  | 'Interação social'
  | 'Autonomia'
  | 'Regulação emocional'
  | 'Autoestima'
  | 'Tolerância à frustração'
  | 'Resolução de problemas'
  | 'Habilidades adaptativas';

export interface PerfilDesenvolvimentoAluno {
  pacienteId: string;
  areasParaEstimular: AreaDesenvolvimento[];
  observacoesPorArea?: Partial<Record<AreaDesenvolvimento, string>>;
  atualizadoEm: string;
}

export interface Atividade {
  id: string;
  titulo: string;
  idadeMinima: number;
  idadeMaxima: number;
  objetivo: string;
  diagnosticoAlvo: string[];
  areasEstimuladas: AreaDesenvolvimento[];
  tempoAplicacaoMinutos: number;
  materiaisNecessarios: string[];
  instrucoes: string;
}

export interface PlanejamentoSessao {
  id: string;
  pacienteId: string;
  data: string;
  objetivo: string;
  materiais: string[];
  atividade: string;
  tecnica: string;
  tempoEstimadoMinutos: number;
  resultadoEsperado: string;
  status: 'Planejada' | 'Concluída' | 'Cancelada';
}

export interface OrientacaoProfessor {
  id: string;
  nomeProfessor: string;
  turma: string;
  escolaId: string;
  pacienteId?: string;
  dificuldadeObservada: string;
  estrategiasSugeridas: string[];
  dataOrientacao: string;
  retorno: string;
  status: 'Pendente' | 'Em Acompanhamento' | 'Concluído';
}

export interface AtendimentoFamilia {
  id: string;
  pacienteId: string;
  data: string;
  responsavelPresente: string;
  assunto: string;
  orientacoes: string;
  encaminhamentos: string;
  proximoContato?: string;
}

export type CategoriaMaterial =
  | 'Jogos'
  | 'Atividades'
  | 'PDFs'
  | 'Livros'
  | 'Testes Autorizados'
  | 'Recursos Visuais'
  | 'Histórias Sociais'
  | 'Cartões de Emoções';

export interface MaterialItem {
  id: string;
  titulo: string;
  categoria: CategoriaMaterial;
  descricao: string;
  localOuLink: string;
  faixaEtaria: string;
  disponivel: boolean;
}

export type TemaProjeto =
  | 'Educação emocional'
  | 'Setembro Amarelo'
  | 'Maio Laranja'
  | 'Bullying'
  | 'Inclusão'
  | 'Saúde mental'
  | 'Habilidades sociais'
  | 'Formação de professores';

export interface IdeiaProjeto {
  id: string;
  titulo: string;
  tema: TemaProjeto;
  publicoAlvo: string;
  objetivo: string;
  atividadesPropostas: string[];
  recursosNecessarios: string[];
  status: 'Ideia' | 'Em Planejamento' | 'Em Execução' | 'Concluído';
}

export type CategoriaMeta =
  | 'Metas do Mês'
  | 'Cursos Desejados'
  | 'Leituras Planejadas'
  | 'Organização Pessoal'
  | 'Projetos em Andamento';

export interface MetaProfissional {
  id: string;
  categoria: CategoriaMeta;
  titulo: string;
  descricao?: string;
  prazo: string;
  concluida: boolean;
  certificadoOuLink?: string;
}

export type TipoRelatorioFormal =
  | 'Relatório Psicológico'
  | 'Evolução'
  | 'Parecer'
  | 'Encaminhamento'
  | 'Devolutiva';

export interface RelatorioFormal {
  id: string;
  pacienteId: string;
  tipo: TipoRelatorioFormal;
  titulo: string;
  data: string;
  autor: string;
  conteudo: {
    identificacao: string;
    motivoEncaminhamento: string;
    procedimentos: string;
    analise: string;
    conclusaoRecomendacoes: string;
  };
  status: 'Rascunho' | 'Finalizado' | 'Entregue';
}
