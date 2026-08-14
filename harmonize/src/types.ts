export type ProductType = 'botox' | 'acido_hialuronico' | 'bioestimulador' | 'fios_pdo' | 'enzima';

export type InjectionDepth = 'intradermico' | 'subcutaneo' | 'supraperiosteal' | 'muscular';

export type InjectionTool = 'agulha_30g' | 'agulha_32g' | 'canula_22g' | 'canula_25g' | 'canula_18g';

export interface FaceMapPoint {
  id: string;
  zone: string;
  label: string;
  x: number; // 0 to 100 percentage
  y: number; // 0 to 100 percentage
  productType: ProductType;
  productName: string;
  doseValue: number;
  doseUnit: 'U' | 'ml' | 'fios' | 'mg';
  depth: InjectionDepth;
  tool: InjectionTool;
  lotNumber: string;
  notes?: string;
  createdAt?: string;
}

export interface AnamnesisData {
  skinType: 'Normal' | 'Seca' | 'Oleosa' | 'Mista' | 'Sensível';
  fitzpatrick: 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';
  allergies: string[];
  medicationsInUse: string[];
  chronicDiseases: string[];
  pregnantOrLactating: boolean;
  priorTreatments: string[];
  herpesHistory: boolean;
  keloidTendency: boolean;
  smoker: boolean;
  alcoholFrequency: 'Nunca' | 'Socialmente' | 'Frequente';
  sunExposure: 'Baixa' | 'Moderada' | 'Alta';
  waterIntakeLitersPerDay: number;
  mainConcerns: string[];
  aestheticGoals: string;
  lastBotoxDate?: string;
  lastFillerDate?: string;
  medicalClearanceNotes?: string;
}

export interface Patient {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  birthDate: string;
  gender: 'Feminino' | 'Masculino' | 'Outro';
  address?: string;
  city?: string;
  avatarUrl?: string;
  tag: 'vip' | 'frequente' | 'novo' | 'em_tratamento';
  createdAt: string;
  anamnesis: AnamnesisData;
  generalNotes?: string;
  consentSigned: boolean;
}

export interface ProcedureCatalogItem {
  id: string;
  name: string;
  category: 'harmonizacao' | 'botox' | 'bioestimuladores' | 'fios' | 'skincare_peeling' | 'corporal';
  defaultPrice: number;
  costPrice: number;
  durationMinutes: number;
  recommendedRetouchDays: number;
  description: string;
  defaultDoseUnit: 'U' | 'ml' | 'fios' | 'sessao';
  defaultDoseAmount: number;
  suggestedProducts: string[];
}

export type AppointmentStatus = 'agendado' | 'confirmado' | 'em_atendimento' | 'concluido' | 'retorno_pendente' | 'cancelado';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientAvatar?: string;
  professionalId: string;
  professionalName: string;
  procedureIds: string[];
  procedureNames: string[];
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMinutes: number;
  status: AppointmentStatus;
  notes?: string;
  totalPrice: number;
  paymentStatus: 'pago' | 'pendente' | 'parcial';
  paymentMethod?: 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro' | 'boleto' | 'transferencia';
  isBotoxRetouch?: boolean;
  parentAppointmentId?: string;
}

export interface PhotoRecord {
  id: string;
  url: string;
  type: 'antes' | 'depois';
  angle: 'frontal' | 'perfil_direito' | 'perfil_esquerdo' | 'obliquo_direito' | 'obliquo_esquerdo' | 'detalhe';
  date: string;
  notes?: string;
}

export interface ClinicalRecord {
  id: string;
  patientId: string;
  appointmentId?: string;
  date: string;
  professionalName: string;
  proceduresPerformed: string[];
  faceMapPoints: FaceMapPoint[];
  photos: PhotoRecord[];
  clinicalEvolutionNotes: string;
  anestheticUsed: string;
  tcleSigned: boolean;
  tcleSignatureUrl?: string;
  postCareSentDate?: string;
  nextRetouchDate?: string;
  totalUnitsBotoxUsed: number;
  totalMlFillerUsed: number;
  totalThreadsUsed: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  brand: string;
  category: 'toxina' | 'preenchedor' | 'bioestimulador' | 'fios' | 'anestesico' | 'descartavel' | 'dermocosmetico';
  currentStock: number;
  minStock: number;
  unit: 'frascos' | 'seringas' | 'ampolas' | 'unidades' | 'caixas' | 'tubetes';
  costPerUnit: number;
  sellPriceSuggested: number;
  lotNumber: string;
  expirationDate: string; // YYYY-MM-DD
  anvisaRegistry?: string;
}

export interface FinancialTransaction {
  id: string;
  type: 'receita' | 'despesa';
  category: string;
  description: string;
  amount: number;
  date: string;
  paymentMethod: 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro' | 'boleto' | 'transferencia';
  status: 'pago' | 'pendente';
  patientId?: string;
  patientName?: string;
  appointmentId?: string;
}

export interface Professional {
  id: string;
  name: string;
  role: string;
  council: 'CRM' | 'CRO' | 'CRBM' | 'CRF' | 'COFEN';
  councilNumber: string;
  phone: string;
  email: string;
  avatarUrl: string;
  color: string;
  commissionPercent: number;
}

export interface AIProtocolPlan {
  title: string;
  summary: string;
  stages: {
    phase: string;
    procedure: string;
    details: string;
    expectedResult: string;
    returnDays: number;
  }[];
  homeCare: string[];
  notes: string;
}
