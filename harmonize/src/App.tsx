import React, { useState, useEffect } from 'react';
import {
  Patient, Appointment, InventoryItem, ProcedureCatalogItem,
  Professional, FinancialTransaction, FaceMapPoint, AppointmentStatus
} from './types';
import {
  INITIAL_PATIENTS, INITIAL_PROCEDURES, INITIAL_INVENTORY,
  INITIAL_APPOINTMENTS, INITIAL_PROFESSIONALS, INITIAL_TRANSACTIONS,
  initialFaceMapPoints
} from './data/mockData';
import { PatientsModule } from './components/PatientsModule';
import { AppointmentsModule } from './components/AppointmentsModule';
import { InventoryModule } from './components/InventoryModule';
import { ProceduresModule } from './components/ProceduresModule';
import { FinancialModule } from './components/FinancialModule';
import { AiAssistantModule } from './components/AiAssistantModule';
import { FaceMapStudio } from './components/FaceMapStudio';
import { BackupModal } from './components/BackupModal';
import { PwaBanners } from './components/PwaBanners';
import { usePwa } from './hooks/usePwa';
import type { BackupPayload } from './utils/backup';
import { isSameMonth, todayISO } from './utils/date';
import {
  isArrayOf, isPlainObject, readStored, writeStored, STORAGE_KEYS,
} from './utils/storage';

import {
  Sparkles, Users, Calendar as CalendarIcon, Package, FileText,
  DollarSign, SlidersHorizontal, Bell, Plus, Clock, CheckCircle2,
  AlertTriangle, ShieldCheck, ChevronRight, Menu, X, ArrowUpRight,
  TrendingUp, Syringe, HeartPulse, DatabaseBackup
} from 'lucide-react';
import confetti from 'canvas-confetti';

type NavModule =
  | 'dashboard'
  | 'patients'
  | 'appointments'
  | 'facemap'
  | 'inventory'
  | 'procedures'
  | 'financial'
  | 'ai_assistant';

const NAV_MODULES: NavModule[] = [
  'dashboard', 'patients', 'appointments', 'facemap',
  'inventory', 'procedures', 'financial', 'ai_assistant',
];

/**
 * Módulo inicial vindo de `?module=` — usado pelos atalhos do manifest
 * (pressionar e segurar o ícone do app instalado).
 */
function initialModuleFromUrl(): NavModule {
  if (typeof window === 'undefined') return 'dashboard';
  const requested = new URLSearchParams(window.location.search).get('module');
  return NAV_MODULES.includes(requested as NavModule) ? (requested as NavModule) : 'dashboard';
}

export default function App() {
  // Navigation State
  const [activeModule, setActiveModule] = useState<NavModule>(initialModuleFromUrl);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backupOpen, setBackupOpen] = useState(false);

  const pwa = usePwa();

  /** Avisa quando a gravação local falha (cota cheia / modo privativo). */
  const [storageError, setStorageError] = useState<string | null>(null);

  // Core Data States (with local persistence)
  const [patients, setPatients] = useState<Patient[]>(() =>
    readStored(STORAGE_KEYS.patients, INITIAL_PATIENTS, isArrayOf),
  );

  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    readStored(STORAGE_KEYS.appointments, INITIAL_APPOINTMENTS, isArrayOf),
  );

  const [inventory, setInventory] = useState<InventoryItem[]>(() =>
    readStored(STORAGE_KEYS.inventory, INITIAL_INVENTORY, isArrayOf),
  );

  const [procedures, setProcedures] = useState<ProcedureCatalogItem[]>(() =>
    readStored(STORAGE_KEYS.procedures, INITIAL_PROCEDURES, isArrayOf),
  );

  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() =>
    readStored(STORAGE_KEYS.transactions, INITIAL_TRANSACTIONS, isArrayOf),
  );

  const [professionals] = useState<Professional[]>(INITIAL_PROFESSIONALS);

  // Face Maps per Patient
  const [faceMaps, setFaceMaps] = useState<Record<string, FaceMapPoint[]>>(() => {
    const saved = readStored<Record<string, FaceMapPoint[]> | null>(
      STORAGE_KEYS.facemaps,
      null,
      isPlainObject,
    );
    // Os mapas de exemplo entram como base para não sumirem em instalações antigas.
    return saved ? { ...initialFaceMapPoints, ...saved } : initialFaceMapPoints;
  });

  // Active Selected Patient for standalone FaceMapStudio tab
  const [standalonePatientId, setStandalonePatientId] = useState<string>(patients[0]?.id || '');

  /** Grava e sinaliza na UI se o navegador recusar a escrita. */
  const persist = (key: string, value: unknown) => {
    const result = writeStored(key, value);
    if (result.ok) {
      setStorageError(null);
      return;
    }
    setStorageError(
      result.reason === 'quota'
        ? 'O armazenamento do navegador está cheio. Baixe um backup e remova registros antigos.'
        : 'Não foi possível salvar neste navegador. Baixe um backup para não perder os dados.',
    );
  };

  // Sync to LocalStorage
  useEffect(() => {
    persist(STORAGE_KEYS.patients, patients);
  }, [patients]);

  useEffect(() => {
    persist(STORAGE_KEYS.appointments, appointments);
  }, [appointments]);

  useEffect(() => {
    persist(STORAGE_KEYS.inventory, inventory);
  }, [inventory]);

  useEffect(() => {
    persist(STORAGE_KEYS.procedures, procedures);
  }, [procedures]);

  useEffect(() => {
    persist(STORAGE_KEYS.transactions, transactions);
  }, [transactions]);

  useEffect(() => {
    persist(STORAGE_KEYS.facemaps, faceMaps);
  }, [faceMaps]);

  // Mantém o paciente do studio válido quando a lista muda (exclusão/restauração).
  useEffect(() => {
    if (patients.length === 0) {
      if (standalonePatientId !== '') setStandalonePatientId('');
      return;
    }
    if (!patients.some(p => p.id === standalonePatientId)) {
      setStandalonePatientId(patients[0].id);
    }
  }, [patients, standalonePatientId]);

  // Handlers
  const handleSavePatient = (pat: Patient) => {
    setPatients(prev => {
      const exists = prev.some(p => p.id === pat.id);
      if (exists) {
        return prev.map(p => p.id === pat.id ? pat : p);
      }
      return [pat, ...prev];
    });
  };

  const handleDeletePatient = (id: string) => {
    if (confirm("Tem certeza que deseja excluir o prontuário deste paciente?")) {
      setPatients(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleUpdateFaceMap = (patientId: string, points: FaceMapPoint[]) => {
    setFaceMaps(prev => ({
      ...prev,
      [patientId]: points
    }));
  };

  const handleSaveAppointment = (apt: Appointment) => {
    setAppointments(prev => {
      const exists = prev.some(a => a.id === apt.id);
      if (exists) {
        return prev.map(a => a.id === apt.id ? apt : a);
      }
      return [apt, ...prev];
    });
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const handleUpdateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, status };
      }
      return a;
    }));
  };

  const handleSaveInventory = (item: InventoryItem) => {
    setInventory(prev => {
      const exists = prev.some(i => i.id === item.id);
      if (exists) {
        return prev.map(i => i.id === item.id ? item : i);
      }
      return [item, ...prev];
    });
  };

  const handleDeleteInventory = (id: string) => {
    setInventory(prev => prev.filter(i => i.id !== id));
  };

  const handleAdjustStock = (id: string, delta: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newStock = Math.max(0, item.currentStock + delta);
        return { ...item, currentStock: newStock };
      }
      return item;
    }));
  };

  const handleSaveProcedure = (proc: ProcedureCatalogItem) => {
    setProcedures(prev => {
      const exists = prev.some(p => p.id === proc.id);
      if (exists) {
        return prev.map(p => p.id === proc.id ? proc : p);
      }
      return [proc, ...prev];
    });
  };

  const handleSaveTransaction = (tx: FinancialTransaction) => {
    setTransactions(prev => [tx, ...prev]);
  };

  const handleOpenPatientRecord = (patientId: string) => {
    setStandalonePatientId(patientId);
    setActiveModule('patients');
  };

  /** Estado completo exposto ao backup. */
  const backupData: BackupPayload = {
    patients, appointments, inventory, procedures, transactions, faceMaps,
  };

  const handleRestoreBackup = (payload: BackupPayload) => {
    setPatients(payload.patients);
    setAppointments(payload.appointments);
    setInventory(payload.inventory);
    setProcedures(payload.procedures);
    setTransactions(payload.transactions);
    setFaceMaps(payload.faceMaps);
  };

  // Metrics for Dashboard
  const todayStr = todayISO();
  const todayAppointments = appointments.filter(a => a.date === todayStr);
  const pendingRetouchCount = appointments.filter(a => a.isBotoxRetouch && a.status !== 'concluido').length;
  const criticalStockItems = inventory.filter(i => i.currentStock <= i.minStock);
  // Só o mês corrente: o card é rotulado "Faturamento Mensal".
  const currentMonthRevenue = transactions
    .filter(t => t.type === 'receita' && t.status === 'pago' && isSameMonth(t.date))
    .reduce((sum, t) => sum + t.amount, 0);
  const completedThisMonth = appointments.filter(
    a => a.status === 'concluido' && isSameMonth(a.date),
  ).length;

  const selectedPatientForFaceMap = patients.find(p => p.id === standalonePatientId);

  interface NavItemConfig {
    id: NavModule;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    alertBadge?: boolean;
  }

  const navItems: NavItemConfig[] = [
    { id: 'dashboard', label: 'Visão Geral', sublabel: 'Dashboard clínico', icon: Sparkles },
    { id: 'patients', label: 'Pacientes', sublabel: `${patients.length} cadastrados`, icon: Users, badge: patients.length },
    { id: 'appointments', label: 'Agenda & Retoques', sublabel: `${todayAppointments.length} hoje • ${pendingRetouchCount} retoques`, icon: CalendarIcon, badge: todayAppointments.length > 0 ? `${todayAppointments.length}` : undefined },
    { id: 'facemap', label: 'Mapeamento Facial', sublabel: 'Marcação anatômica 2D', icon: SlidersHorizontal },
    { id: 'inventory', label: 'Estoque Injetáveis', sublabel: 'Frascos & ANVISA', icon: Package, alertBadge: criticalStockItems.length > 0 },
    { id: 'procedures', label: 'Procedimentos', sublabel: 'Protocolos & Tabela', icon: FileText },
    { id: 'financial', label: 'Financeiro', sublabel: 'Fluxo & Comissões', icon: DollarSign },
    { id: 'ai_assistant', label: 'IA Pós-Cuidado', sublabel: 'Auditoria & Recomendações', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-[#FFF4F7] flex flex-col md:flex-row font-sans text-[#0F172A] antialiased selection:bg-[#F472B6]/20 selection:text-[#DB2777]">
      {/* MOBILE TOP BAR (visible only on small screens) */}
      <div className="md:hidden bg-white border-b border-[#CBD5E1] p-4 flex items-center justify-between sticky top-0 z-50">
        <div
          onClick={() => setActiveModule('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-[#F1F5F9] border border-[#CBD5E1] flex items-center justify-center text-[#1E40AF] font-serif italic text-base font-bold">
            H
          </div>
          <div>
            <span className="font-serif text-lg text-[#1E40AF] font-medium leading-none">
              Harmonize
            </span>
            <span className="text-[8px] font-bold uppercase tracking-wider block text-[#334155]">
              Clinical HOF
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl text-[#334155] bg-[#F1F5F9] border border-[#CBD5E1]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* LEFT SIDEBAR NAVIGATION (ALWAYS VISIBLE ON DESKTOP/TABLET) */}
      <aside className={`
        ${mobileMenuOpen ? 'block' : 'hidden'} md:flex
        w-full md:w-64 lg:w-72 bg-white border-r border-[#CBD5E1] flex-col shrink-0
        md:sticky md:top-0 md:h-screen z-40 shadow-xs md:shadow-none
      `}>
        {/* Brand Header */}
        <div className="p-6 border-b border-[#F1F5F9] flex items-center justify-between">
          <div
            onClick={() => {
              setActiveModule('dashboard');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#F1F5F9] border border-[#CBD5E1] flex items-center justify-center text-[#1E40AF] shadow-xs group-hover:scale-105 transition-transform font-serif italic text-xl font-bold">
              H
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-2xl tracking-tight text-[#0F172A] font-semibold">
                  Harmonize
                </span>
              </div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-[#1E40AF] font-bold">
                Clinical • HOF
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="p-4 pb-2">
          <button
            type="button"
            onClick={() => {
              setActiveModule('appointments');
              setMobileMenuOpen(false);
            }}
            className="w-full py-2.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Agendamento</span>
          </button>
        </div>

        {/* Navigation Section Title */}
        <div className="px-5 pt-3 pb-1">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.2em]">
            Menu Principal
          </span>
        </div>

        {/* Always Visible Navigation Buttons */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto py-1">
          {navItems.map((tab) => {
            const isActive = activeModule === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                id={`nav-btn-${tab.id}`}
                onClick={() => {
                  setActiveModule(tab.id as NavModule);
                  setMobileMenuOpen(false);
                }}
                className={`w-full p-3 rounded-2xl transition-all flex items-center justify-between text-left group ${
                  isActive
                    ? 'bg-[#F1F5F9] text-[#1D4ED8] font-semibold border border-[#CBD5E1] shadow-2xs'
                    : 'text-[#334155] hover:bg-[#F8FAFC] hover:text-[#0F172A] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-xl transition-colors ${
                    isActive ? 'bg-[#2563EB] text-white' : 'bg-[#F1F5F9] text-[#334155] group-hover:text-[#1E40AF]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className={`text-xs truncate ${isActive ? 'font-bold text-[#0F172A]' : 'font-medium'}`}>
                      {tab.label}
                    </p>
                    <p className="text-[10px] text-[#64748B] font-light truncate">
                      {tab.sublabel}
                    </p>
                  </div>
                </div>

                {tab.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-[#2563EB] text-white' : 'bg-[#F1F5F9] text-[#334155]'
                  }`}>
                    {tab.badge}
                  </span>
                )}

                {tab.alertBadge && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Atenção no estoque" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Info */}
        <div className="p-4 border-t border-[#F1F5F9] bg-[#F8FAFC] rounded-b-3xl md:rounded-none">
          <button
            type="button"
            onClick={() => {
              setBackupOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full mb-3 py-2.5 px-4 bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#1D4ED8] rounded-2xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
          >
            <DatabaseBackup className="w-4 h-4" />
            <span>Backup dos dados</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs">
              DR
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#0F172A] truncate">
                Dra. Helena Vasconcelos
              </p>
              <p className="text-[10px] text-[#64748B] truncate">
                CRO-SP 102.894 • Responsável
              </p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#CBD5E1]/60 flex items-center justify-between text-[10px] text-[#334155]">
            <span>Data:</span>
            <span className="font-semibold text-[#0F172A]">
              {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
            </span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Main Content View */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Falha de gravação local: os dados na tela ainda estão certos, mas não
            sobrevivem a um recarregamento — o backup vira a saída imediata. */}
        {storageError && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] p-4"
          >
            <AlertTriangle className="w-4 h-4 text-[#B91C1C] shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#991B1B]">Não foi possível salvar no aparelho</p>
              <p className="text-[11px] text-[#991B1B]/90 leading-relaxed mt-0.5">{storageError}</p>
            </div>
            <button
              type="button"
              onClick={() => setBackupOpen(true)}
              className="shrink-0 px-3.5 py-1.5 rounded-xl bg-white border border-[#FECACA] text-[#B91C1C] text-xs font-bold hover:bg-[#FEF2F2] transition-colors"
            >
              Backup
            </button>
          </div>
        )}
        {/* MODULE 1: DASHBOARD / VISÃO GERAL */}
        {activeModule === 'dashboard' && (
          <div id="dashboard-view" className="space-y-8 animate-in fade-in">
            {/* Sleek Baby Blue Clinical Hero Banner */}
            <div className="bg-[#102438] text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#1E3B5A] relative overflow-hidden">
              <div className="max-w-2xl relative z-10 space-y-3.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#C5E1F5] text-[10px] font-semibold uppercase tracking-[0.2em] border border-white/10">
                  <Sparkles className="w-3 h-3 text-[#6BA4D8]" />
                  Gestão Clínica & Harmonização
                </span>
                <h2 className="font-serif italic text-2xl sm:text-3xl text-white tracking-tight">
                  Bem-vindo(a) à Harmonize Clinical
                </h2>
                <p className="text-[#BBD5E8] text-xs sm:text-sm leading-relaxed font-light">
                  Sistema integrado de prontuário com mapeamento facial anatômico 2D, controle de frascos de Toxina e Preenchedores, conformidade com a ANVISA e assistência de IA para protocolos de pós-cuidado.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModule('appointments')}
                    className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-xs rounded-full transition-all shadow-xs flex items-center gap-2"
                  >
                    <CalendarIcon className="w-3.5 h-3.5" />
                    Abrir Agenda de Hoje ({todayAppointments.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveModule('facemap')}
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-full border border-white/15 transition-all flex items-center gap-2"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5E1F5]" />
                    Iniciar Mapeamento Facial
                  </button>
                </div>
              </div>
            </div>

            {/* Quick KPI Cards in Baby Blue Theme */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div
                onClick={() => setActiveModule('appointments')}
                className="bg-white p-6 rounded-3xl border border-[#CBD5E1] shadow-xs hover:border-[#2563EB]/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-[#1E40AF] uppercase tracking-[0.18em]">
                    Atendimentos Hoje
                  </span>
                  <span className="p-2 bg-[#F1F5F9] text-[#1E40AF] rounded-xl group-hover:scale-105 transition-transform">
                    <CalendarIcon className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-3xl font-serif italic text-[#0F172A] font-normal">
                  {todayAppointments.length}
                </div>
                <span className="text-[11px] text-[#334155] mt-1.5 block">
                  {completedThisMonth} já concluídos no mês
                </span>
              </div>

              <div
                onClick={() => setActiveModule('appointments')}
                className="bg-white p-6 rounded-3xl border border-[#CBD5E1] shadow-xs hover:border-[#2563EB]/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-[#1E40AF] uppercase tracking-[0.18em]">
                    Retoques de Botox (15d)
                  </span>
                  <span className="p-2 bg-[#F1F5F9] text-[#1E40AF] rounded-xl group-hover:scale-105 transition-transform">
                    <Clock className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-3xl font-serif italic text-[#0F172A]">
                  {pendingRetouchCount} <span className="text-xs font-sans not-italic text-[#334155]">pendentes</span>
                </div>
                <span className="text-[11px] text-[#1E40AF] mt-1.5 block font-medium">
                  Janela ideal de retorno de toxina
                </span>
              </div>

              <div
                onClick={() => setActiveModule('inventory')}
                className="bg-white p-6 rounded-3xl border border-[#CBD5E1] shadow-xs hover:border-[#2563EB]/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-[#1E40AF] uppercase tracking-[0.18em]">
                    Estoque Injetáveis
                  </span>
                  <span className="p-2 bg-[#F1F5F9] text-[#1E40AF] rounded-xl group-hover:scale-105 transition-transform">
                    <Package className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-3xl font-serif italic text-[#0F172A]">
                  {inventory.length} <span className="text-xs font-sans not-italic text-[#334155]">lotes ativos</span>
                </div>
                <span className="text-[11px] text-[#B45309] mt-1.5 block font-medium">
                  {criticalStockItems.length} com alerta de reposição
                </span>
              </div>

              {/* Monthly Revenue Dark Marine Accent Card */}
              <div
                onClick={() => setActiveModule('financial')}
                className="bg-[#102438] p-6 rounded-3xl text-white shadow-xs hover:border-[#2563EB] border border-transparent transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#A2C7E5]">
                      Faturamento Mensal
                    </h3>
                    <p className="text-2xl sm:text-3xl font-serif italic text-white mt-1">
                      R$ {currentMonthRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-white/10 p-2 rounded-full">
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#C5E1F5]" />
                  </div>
                </div>

                <div className="mt-4 pt-2 flex items-end space-x-1.5 h-10">
                  <div className="flex-1 bg-white/10 h-[40%] rounded-t-sm"></div>
                  <div className="flex-1 bg-white/10 h-[60%] rounded-t-sm"></div>
                  <div className="flex-1 bg-white/10 h-[35%] rounded-t-sm"></div>
                  <div className="flex-1 bg-white/20 h-[75%] rounded-t-sm"></div>
                  <div className="flex-1 bg-[#2563EB] h-[95%] rounded-t-sm"></div>
                  <div className="flex-1 bg-white/20 h-[50%] rounded-t-sm"></div>
                </div>
                <p className="text-[10px] text-[#A2C7E5] mt-2">
                  +18% em relação ao mês anterior
                </p>
              </div>
            </div>

            {/* Two-column overview: Today Schedule (Left) & Quick Clinical Tools (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Today's Appointments List */}
              <div className="lg:col-span-8 bg-white rounded-3xl border border-[#CBD5E1] shadow-xs p-6 sm:p-7 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-[#CBD5E1]">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
                      Próximos Procedimentos
                    </h3>
                    <span className="text-[10px] bg-[#F1F5F9] text-[#1D4ED8] px-3 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Hoje
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModule('appointments')}
                    className="text-xs font-medium text-[#1E40AF] hover:text-[#2563EB] flex items-center gap-1"
                  >
                    Ver Agenda Completa <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {todayAppointments.length === 0 ? (
                    <div className="py-10 text-center text-[#334155] text-xs">
                      Nenhum paciente agendado para hoje.
                    </div>
                  ) : (
                    todayAppointments.map((apt, idx) => (
                      <div
                        key={apt.id}
                        className="p-4 bg-[#F8FAFC] rounded-2xl border border-transparent hover:border-[#CBD5E1] transition-all flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center space-x-4 min-w-0 flex-1">
                          <div
                            className={`w-1 h-10 rounded-full shrink-0 ${
                              idx % 2 === 0 ? 'bg-[#2563EB]' : 'bg-[#B8D3E5]'
                            }`}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-[#0F172A] truncate" title={apt.patientName}>
                              {apt.patientName}
                            </p>
                            <p className="text-[11px] text-[#334155] truncate" title={apt.procedureNames.join(' • ')}>
                              {apt.procedureNames.join(' • ')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                          <div className="text-right">
                            <p className="text-xs font-bold text-[#0F172A]">{apt.time}</p>
                            <span
                              className={`text-[10px] font-bold uppercase ${
                                apt.status === 'concluido'
                                  ? 'text-emerald-700'
                                  : apt.status === 'confirmado'
                                  ? 'text-sky-700'
                                  : 'text-amber-600'
                              }`}
                            >
                              {apt.status}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleOpenPatientRecord(apt.patientId)}
                            className="px-3.5 py-1.5 bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#1D4ED8] font-bold text-xs rounded-xl transition-all shadow-2xs shrink-0"
                          >
                            Prontuário
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Fast Clinical Shortcuts & Safety Protocols */}
              <div className="lg:col-span-4 space-y-5">
                {/* Follow-up / Touch-Up Card */}
                <div className="bg-[#F1F5F9] rounded-3xl p-6 border border-[#D0E3F0] space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#1D4ED8] uppercase tracking-[0.18em]">
                      Pós-Procedimento
                    </span>
                    <Clock className="w-4 h-4 text-[#1E40AF]" />
                  </div>
                  <h4 className="font-serif italic text-lg text-[#0F172A] font-medium">
                    Lembrete de Follow-up (48h / 15 dias)
                  </h4>
                  <p className="text-xs text-[#334155] leading-relaxed">
                    Acompanhe a cicatrização e evolução dos tratamentos de Harmonização e Toxina dos pacientes recentes.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveModule('ai_assistant')}
                    className="w-full bg-white text-[#1D4ED8] border border-[#1D4ED8]/25 px-5 py-2.5 rounded-2xl text-xs font-bold hover:bg-[#2563EB] hover:text-white transition-all shadow-2xs"
                  >
                    Iniciar Follow-up com IA
                  </button>
                </div>

                {/* Face Map Quick Access */}
                <div className="bg-white p-6 rounded-3xl border border-[#CBD5E1] shadow-xs space-y-3.5">
                  <div className="flex items-center gap-2 text-[#0F172A] font-serif text-base">
                    <SlidersHorizontal className="w-4 h-4 text-[#1E40AF]" />
                    <span>Mapeamento Anatômico 2D</span>
                  </div>
                  <p className="text-xs text-[#334155] leading-relaxed">
                    Marque os pontos exatos de injeção no mapa vetorial com dosagem (U / ml) e lote Anvisa.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveModule('facemap')}
                    className="w-full py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-xs rounded-full transition-all shadow-xs"
                  >
                    Acessar Studio de Harmonização
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 2: PATIENTS & PRONTUÁRIOS */}
        {activeModule === 'patients' && (
          <PatientsModule
            patients={patients}
            onSavePatient={handleSavePatient}
            onDeletePatient={handleDeletePatient}
            faceMapRecords={faceMaps}
            onUpdateFaceMap={handleUpdateFaceMap}
          />
        )}

        {/* MODULE 3: APPOINTMENTS & CALENDAR */}
        {activeModule === 'appointments' && (
          <AppointmentsModule
            appointments={appointments}
            patients={patients}
            procedures={procedures}
            professionals={professionals}
            onSaveAppointment={handleSaveAppointment}
            onUpdateStatus={handleUpdateAppointmentStatus}
            onOpenPatientRecord={handleOpenPatientRecord}
            onDeleteAppointment={handleDeleteAppointment}
          />
        )}

        {/* MODULE 4: STANDALONE FACIAL MAPPING STUDIO */}
        {activeModule === 'facemap' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white p-6 rounded-3xl border border-[#CBD5E1] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-[#1E40AF] uppercase tracking-[0.2em] block">
                  Studio Anatômico de Harmonização Facial
                </span>
                <h3 className="font-serif italic text-2xl text-[#0F172A]">
                  Prontuário Gráfico de Injetáveis
                </h3>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <label className="text-xs font-medium text-[#334155] shrink-0">Paciente:</label>
                <select
                  value={standalonePatientId}
                  onChange={(e) => setStandalonePatientId(e.target.value)}
                  disabled={patients.length === 0}
                  className="px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-xs font-semibold text-[#0F172A] outline-none w-full sm:w-64 focus:border-[#2563EB] disabled:opacity-60"
                >
                  {patients.length === 0 && <option value="">Nenhum paciente cadastrado</option>}
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sem paciente selecionado não há prontuário gráfico a montar. */}
            {selectedPatientForFaceMap ? (
              <FaceMapStudio
                points={faceMaps[standalonePatientId] || []}
                onChangePoints={(pts) => handleUpdateFaceMap(standalonePatientId, pts)}
                patientName={selectedPatientForFaceMap.name}
              />
            ) : (
              <div className="bg-white rounded-3xl border border-[#CBD5E1] shadow-xs p-10 text-center space-y-3">
                <Users className="w-8 h-8 text-[#94A3B8] mx-auto" />
                <p className="text-xs text-[#334155]">
                  Cadastre um paciente para iniciar o mapeamento facial.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveModule('patients')}
                  className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-xs rounded-full transition-all"
                >
                  Ir para Pacientes
                </button>
              </div>
            )}
          </div>
        )}

        {/* MODULE 5: INVENTORY */}
        {activeModule === 'inventory' && (
          <InventoryModule
            inventory={inventory}
            onSaveItem={handleSaveInventory}
            onDeleteItem={handleDeleteInventory}
            onAdjustStock={handleAdjustStock}
          />
        )}

        {/* MODULE 6: PROCEDURES & BUDGETS */}
        {activeModule === 'procedures' && (
          <ProceduresModule
            procedures={procedures}
            patients={patients}
            onSaveProcedure={handleSaveProcedure}
          />
        )}

        {/* MODULE 7: FINANCIAL */}
        {activeModule === 'financial' && (
          <FinancialModule
            transactions={transactions}
            professionals={professionals}
            onSaveTransaction={handleSaveTransaction}
          />
        )}

        {/* MODULE 8: AI ASSISTANT */}
        {activeModule === 'ai_assistant' && (
          <AiAssistantModule
            patients={patients}
            procedures={procedures}
          />
        )}
        </main>
      </div>

      {backupOpen && (
        <BackupModal
          data={backupData}
          onRestore={handleRestoreBackup}
          onClose={() => setBackupOpen(false)}
        />
      )}

      <PwaBanners pwa={pwa} />
    </div>
  );
}
