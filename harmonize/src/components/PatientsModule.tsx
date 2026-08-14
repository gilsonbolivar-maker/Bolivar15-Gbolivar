import React, { useState } from 'react';
import { Patient, FaceMapPoint, AnamnesisData, ClinicalRecord } from '../types';
import { FaceMapStudio } from './FaceMapStudio';
import {
  Search, Plus, User, Phone, Mail, Calendar, MapPin, AlertTriangle,
  FileCheck, ShieldAlert, Sparkles, Check, ChevronRight, MessageSquare,
  Camera, SlidersHorizontal, Trash2, Edit3, X, Download, HeartHandshake, Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PatientsModuleProps {
  patients: Patient[];
  onSavePatient: (patient: Patient) => void;
  onDeletePatient: (patientId: string) => void;
  faceMapRecords: Record<string, FaceMapPoint[]>;
  onUpdateFaceMap: (patientId: string, points: FaceMapPoint[]) => void;
}

export const PatientsModule: React.FC<PatientsModuleProps> = ({
  patients,
  onSavePatient,
  onDeletePatient,
  faceMapRecords,
  onUpdateFaceMap,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('todos');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(patients[0] || null);
  const [activeTab, setActiveTab] = useState<'anamnese' | 'mapa' | 'fotos' | 'tcle'>('anamnese');
  const [isCreatingPatient, setIsCreatingPatient] = useState(false);
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [analyzingRisk, setAnalyzingRisk] = useState(false);
  const [aiRiskResult, setAiRiskResult] = useState<any>(null);
  const [splitSliderPos, setSplitSliderPos] = useState<number>(50);

  // New Patient Form State
  const [formData, setFormData] = useState<Partial<Patient>>({
    name: '',
    cpf: '',
    phone: '',
    email: '',
    birthDate: '1990-01-01',
    gender: 'Feminino',
    tag: 'novo',
    consentSigned: true,
    anamnesis: {
      skinType: 'Mista',
      fitzpatrick: 'III',
      allergies: [],
      medicationsInUse: [],
      chronicDiseases: [],
      pregnantOrLactating: false,
      priorTreatments: [],
      herpesHistory: false,
      keloidTendency: false,
      smoker: false,
      alcoholFrequency: 'Socialmente',
      sunExposure: 'Moderada',
      waterIntakeLitersPerDay: 2.0,
      mainConcerns: [],
      aestheticGoals: ''
    }
  });

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cpf.includes(searchTerm) ||
      p.phone.includes(searchTerm);
    const matchesTag = selectedTag === 'todos' || p.tag === selectedTag;
    return matchesSearch && matchesTag;
  });

  const handleOpenCreate = () => {
    setFormData({
      id: `pat-${Date.now()}`,
      name: '',
      cpf: '',
      phone: '',
      email: '',
      birthDate: '1992-05-15',
      gender: 'Feminino',
      tag: 'novo',
      createdAt: new Date().toISOString().split('T')[0],
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      consentSigned: false,
      anamnesis: {
        skinType: 'Mista',
        fitzpatrick: 'III',
        allergies: [],
        medicationsInUse: [],
        chronicDiseases: [],
        pregnantOrLactating: false,
        priorTreatments: [],
        herpesHistory: false,
        keloidTendency: false,
        smoker: false,
        alcoholFrequency: 'Socialmente',
        sunExposure: 'Moderada',
        waterIntakeLitersPerDay: 2.0,
        mainConcerns: ['Harmonização Facial e Linhas de Expressão'],
        aestheticGoals: 'Rejuvenescimento e contorno natural'
      }
    });
    setIsCreatingPatient(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Por favor, preencha ao menos Nome e Telefone.");
      return;
    }

    const patientToSave: Patient = {
      ...(formData as Patient),
      id: formData.id || `pat-${Date.now()}`,
      createdAt: formData.createdAt || new Date().toISOString().split('T')[0],
    };

    onSavePatient(patientToSave);
    setSelectedPatient(patientToSave);
    setIsCreatingPatient(false);
    setIsEditingPatient(false);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  const handleRunAiRiskAnalysis = async () => {
    if (!selectedPatient) return;
    setAnalyzingRisk(true);
    setAiRiskResult(null);

    try {
      const res = await fetch('/api/ai/anamnesis-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anamnesis: selectedPatient.anamnesis,
          intendedProcedures: ['Toxina Botulínica (Botox)', 'Preenchimento com Ácido Hialurônico']
        })
      });
      const data = await res.json();
      setAiRiskResult(data);
    } catch (err) {
      console.error(err);
      alert("Não foi possível processar a análise no momento.");
    } finally {
      setAnalyzingRisk(false);
    }
  };

  const openWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Olá ${name}, tudo bem? Aqui é da Clínica Harmonize. Estamos entrando em contato sobre o seu agendamento de estética! ✨`);
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div id="patients-module-container" className="space-y-6">
      {/* Top Bar: Search, Tags & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#CBD5E1] shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-lg">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#1E40AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome, telefone ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl focus:bg-white focus:border-[#2563EB] text-[#0F172A] placeholder-[#64748B] outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {['todos', 'vip', 'frequente', 'em_tratamento', 'novo'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium transition-all ${
                  selectedTag === tag
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-[#F1F5F9] text-[#334155] hover:bg-[#F8FAFC] border border-[#CBD5E1]'
                }`}
              >
                {tag === 'todos' ? 'Todos' : tag.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium rounded-full transition-all shadow-xs shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Novo Paciente
          </button>
        </div>
      </div>

      {/* Main Grid: Patient List (Left) and Detail/Prontuário (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Patients Sidebar List */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-[#CBD5E1] shadow-xs overflow-hidden flex flex-col h-[280px] sm:h-[360px] lg:h-[750px]">
          <div className="p-4 sm:p-5 border-b border-[#CBD5E1] flex items-center justify-between bg-[#F8FAFC]">
            <span className="text-[10px] font-bold text-[#1E40AF] uppercase tracking-[0.2em]">
              Pacientes Cadastrados ({filteredPatients.length})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#F1F5F9]">
            {filteredPatients.length === 0 ? (
              <div className="p-8 text-center text-[#334155] text-xs">
                Nenhum paciente encontrado com estes filtros.
              </div>
            ) : (
              filteredPatients.map((p) => {
                const isSelected = selectedPatient?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedPatient(p);
                      setAiRiskResult(null);
                    }}
                    className={`p-4 cursor-pointer transition-all flex items-start gap-3 hover:bg-[#F8FAFC] ${
                      isSelected ? 'bg-[#F1F5F9] border-l-4 border-l-[#2563EB]' : ''
                    }`}
                  >
                    <img
                      src={p.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={p.name}
                      className="w-11 h-11 rounded-full object-cover border border-[#CBD5E1] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1.5">
                        <h4 className="font-semibold text-[#0F172A] text-xs truncate min-w-0" title={p.name}>
                          {p.name}
                        </h4>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                          p.tag === 'vip' ? 'bg-[#F1F5F9] text-[#1D4ED8] border border-[#CBD5E1]' :
                          p.tag === 'frequente' ? 'bg-[#F8FAFC] text-[#334155] border border-[#CBD5E1]' :
                          p.tag === 'em_tratamento' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                          'bg-[#F8FAFC] text-[#334155] border border-[#CBD5E1]'
                        }`}>
                          {p.tag.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#334155] mt-0.5 flex items-center gap-1 truncate">
                        <Phone className="w-3 h-3 text-[#1E40AF] shrink-0" />
                        <span className="truncate">{p.phone}</span>
                      </p>
                      <p className="text-[11px] text-[#64748B] mt-1 truncate">
                        {p.anamnesis.mainConcerns?.[0] || 'Harmonização & Botox'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Patient Full Record / Prontuário Detail */}
        {selectedPatient ? (
          <div className="lg:col-span-8 space-y-6">
            {/* Top Profile Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#CBD5E1] shadow-xs">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#CBD5E1]">
                <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1 w-full md:w-auto">
                  <img
                    src={selectedPatient.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={selectedPatient.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-[#CBD5E1] shadow-2xs shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif italic text-xl sm:text-2xl text-[#0F172A] break-words hyphens-auto font-bold max-w-full">
                        {selectedPatient.name}
                      </h3>
                      <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F1F5F9] text-[#1E40AF] border border-[#CBD5E1] shrink-0">
                        {selectedPatient.gender}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#334155] mt-1.5 break-words">
                      <span>CPF: <strong className="text-[#0F172A]">{selectedPatient.cpf || 'Não informado'}</strong></span>
                      <span className="hidden sm:inline">•</span>
                      <span>Nascimento: <strong className="text-[#0F172A]">{selectedPatient.birthDate}</strong></span>
                      <span className="hidden sm:inline">•</span>
                      <span>Fototipo: <strong className="text-[#0F172A]">Fitzpatrick {selectedPatient.anamnesis.fitzpatrick}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-start md:justify-end shrink-0 pt-2 md:pt-0">
                  <button
                    type="button"
                    onClick={() => openWhatsApp(selectedPatient.phone, selectedPatient.name)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium rounded-full transition-colors shadow-2xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(selectedPatient);
                      setIsEditingPatient(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1] text-xs font-medium rounded-full transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Editar
                  </button>
                </div>
              </div>

              {/* Sub-tabs Navigation */}
              <div className="flex items-center gap-2 pt-4 overflow-x-auto text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('anamnese')}
                  className={`px-4 py-2 rounded-2xl font-medium transition-all flex items-center gap-2 ${
                    activeTab === 'anamnese'
                      ? 'bg-[#F1F5F9] text-[#1D4ED8] font-semibold border border-[#CBD5E1]'
                      : 'text-[#334155] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  Anamnese Estética
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('mapa')}
                  className={`px-4 py-2 rounded-2xl font-medium transition-all flex items-center gap-2 ${
                    activeTab === 'mapa'
                      ? 'bg-[#F1F5F9] text-[#1D4ED8] font-semibold border border-[#CBD5E1]'
                      : 'text-[#334155] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Mapa Facial & Injetáveis (
                  {(faceMapRecords[selectedPatient.id] || []).length} pts)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('fotos')}
                  className={`px-4 py-2 rounded-2xl font-medium transition-all flex items-center gap-2 ${
                    activeTab === 'fotos'
                      ? 'bg-[#0F172A] text-white'
                      : 'text-[#334155] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  Galeria Antes & Depois
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('tcle')}
                  className={`px-4 py-2 rounded-2xl font-medium transition-all flex items-center gap-2 ${
                    activeTab === 'tcle'
                      ? 'bg-[#F1F5F9] text-[#1D4ED8] font-semibold border border-[#CBD5E1]'
                      : 'text-[#334155] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  TCLE & Consentimento
                </button>
              </div>
            </div>

            {/* TAB CONTENT: Anamnese */}
            {activeTab === 'anamnese' && (
              <div className="space-y-6">
                {/* AI Risk Safety Checker Card in Sleek Dark Accent */}
                <div className="bg-[#112233] text-white p-6 rounded-3xl shadow-xs border border-[#20364F]">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-[#90CDF4] text-[10px] font-bold uppercase tracking-[0.2em]">
                        <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                        Auditoria de Segurança & Contraindicações (IA)
                      </div>
                      <h4 className="font-serif italic text-xl text-white mt-1">
                        Avaliação Clínica de Injetáveis
                      </h4>
                      <p className="text-xs text-[#CBD5E1] max-w-xl mt-0.5 font-light">
                        Analisa alergias, histórico de herpes, uso de anticoagulantes e gestação para prevenir intercorrências.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleRunAiRiskAnalysis}
                      disabled={analyzingRisk}
                      className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium rounded-full transition-all shadow-xs shrink-0 disabled:opacity-50"
                    >
                      {analyzingRisk ? 'Auditando...' : 'Auditar com IA'}
                    </button>
                  </div>

                  {aiRiskResult && (
                    <div className="mt-4 pt-4 border-t border-white/10 text-xs space-y-2.5 animate-in fade-in">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          aiRiskResult.riskLevel === 'LOW' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                          aiRiskResult.riskLevel === 'MODERATE' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                          'bg-red-500/20 text-red-300 border border-red-500/40'
                        }`}>
                          Nível de Risco: {aiRiskResult.riskLevel || 'MODERADO'}
                        </span>
                        <span className="text-[#E2E8F0]">{aiRiskResult.summary}</span>
                      </div>

                      {aiRiskResult.alerts?.length > 0 && (
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1.5">
                          <p className="font-semibold text-[#90CDF4]">Alertas Clínicos Identificados:</p>
                          <ul className="list-disc list-inside space-y-1 text-[#E2E8F0]">
                            {aiRiskResult.alerts.map((al: string, idx: number) => (
                              <li key={idx}>{al}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Anamnesis Fields Grid */}
                <div className="bg-white p-6 rounded-3xl border border-[#CBD5E1] shadow-xs space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Health & Clinical Conditions */}
                    <div className="space-y-4">
                      <h4 className="font-serif italic text-base text-[#0F172A] border-b border-[#CBD5E1] pb-2">
                        Condições de Saúde & Alergias
                      </h4>

                      <div className="space-y-2.5 text-xs">
                        <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#CBD5E1] flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                          <span className="font-medium text-[#334155] shrink-0">Alergias Conhecidas:</span>
                          <span className="font-bold text-[#0F172A] sm:text-right break-words min-w-0">
                            {selectedPatient.anamnesis.allergies?.length > 0
                              ? selectedPatient.anamnesis.allergies.join(', ')
                              : 'Nenhuma relatada'}
                          </span>
                        </div>

                        <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#CBD5E1] flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                          <span className="font-medium text-[#334155] shrink-0">Medicamentos em Uso:</span>
                          <span className="font-bold text-[#0F172A] sm:text-right break-words min-w-0">
                            {selectedPatient.anamnesis.medicationsInUse?.length > 0
                              ? selectedPatient.anamnesis.medicationsInUse.join(', ')
                              : 'Nenhum medicamento'}
                          </span>
                        </div>

                        <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#CBD5E1] flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                          <span className="font-medium text-[#334155] shrink-0">Histórico Herpes Labial:</span>
                          <span className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase shrink-0 self-start sm:self-auto ${
                            selectedPatient.anamnesis.herpesHistory
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}>
                            {selectedPatient.anamnesis.herpesHistory ? 'SIM (Profilaxia recomendada)' : 'NÃO'}
                          </span>
                        </div>

                        <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#CBD5E1] flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                          <span className="font-medium text-[#334155] shrink-0">Tendência a Queloides:</span>
                          <span className="font-bold text-[#0F172A] sm:text-right shrink-0">
                            {selectedPatient.anamnesis.keloidTendency ? 'SIM' : 'NÃO'}
                          </span>
                        </div>

                        <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#CBD5E1] flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                          <span className="font-medium text-[#334155] shrink-0">Gestante ou Lactante:</span>
                          <span className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase shrink-0 self-start sm:self-auto ${
                            selectedPatient.anamnesis.pregnantOrLactating
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}>
                            {selectedPatient.anamnesis.pregnantOrLactating ? 'SIM (Contraindicação)' : 'NÃO'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Aesthetic Concerns & Goals */}
                    <div className="space-y-4">
                      <h4 className="font-serif italic text-base text-[#0F172A] border-b border-[#CBD5E1] pb-2">
                        Queixas Principais & Objetivos
                      </h4>

                      <div className="space-y-2.5 text-xs">
                        <div className="p-3.5 bg-[#F1F5F9] rounded-2xl border border-[#CBD5E1]">
                          <span className="font-semibold text-[#1D4ED8] block mb-1">Queixas Relatadas:</span>
                          <ul className="list-disc list-inside text-[#0F172A] space-y-1">
                            {selectedPatient.anamnesis.mainConcerns?.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#CBD5E1]">
                          <span className="font-semibold text-[#0F172A] block mb-1">Objetivo Estético:</span>
                          <p className="text-[#334155]">{selectedPatient.anamnesis.aestheticGoals}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#CBD5E1]">
                            <span className="text-[10px] uppercase tracking-wider text-[#1E40AF] font-semibold block">Último Botox:</span>
                            <span className="font-semibold text-[#0F172A]">
                              {selectedPatient.anamnesis.lastBotoxDate || 'Nunca realizou'}
                            </span>
                          </div>
                          <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#CBD5E1]">
                            <span className="text-[10px] uppercase tracking-wider text-[#1E40AF] font-semibold block">Último Preenchedor:</span>
                            <span className="font-semibold text-[#0F172A]">
                              {selectedPatient.anamnesis.lastFillerDate || 'Nunca realizou'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lifestyle & Habits */}
                  <div className="pt-4 border-t border-[#CBD5E1]">
                    <h4 className="text-[10px] font-bold text-[#1E40AF] uppercase tracking-[0.2em] mb-3">
                      Estilo de Vida & Hábitos
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#CBD5E1]">
                        <span className="text-[#334155] block text-[11px]">Tipo de Pele:</span>
                        <span className="font-bold text-[#0F172A]">{selectedPatient.anamnesis.skinType}</span>
                      </div>
                      <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#CBD5E1]">
                        <span className="text-[#334155] block text-[11px]">Ingestão de Água:</span>
                        <span className="font-bold text-[#0F172A]">{selectedPatient.anamnesis.waterIntakeLitersPerDay}L / dia</span>
                      </div>
                      <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#CBD5E1]">
                        <span className="text-[#334155] block text-[11px]">Exposição Solar:</span>
                        <span className="font-bold text-[#0F172A]">{selectedPatient.anamnesis.sunExposure}</span>
                      </div>
                      <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#CBD5E1]">
                        <span className="text-[#334155] block text-[11px]">Tabagismo:</span>
                        <span className="font-bold text-[#0F172A]">{selectedPatient.anamnesis.smoker ? 'Sim' : 'Não fumante'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Mapa Facial */}
            {activeTab === 'mapa' && (
              <div>
                <FaceMapStudio
                  points={faceMapRecords[selectedPatient.id] || []}
                  onChangePoints={(pts) => onUpdateFaceMap(selectedPatient.id, pts)}
                  patientName={selectedPatient.name}
                />
              </div>
            )}

            {/* TAB CONTENT: Fotos Antes & Depois */}
            {activeTab === 'fotos' && (
              <div className="bg-white p-6 rounded-3xl border border-[#CBD5E1] shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif italic text-xl text-[#0F172A]">
                      Comparador Interativo Antes & Depois
                    </h4>
                    <p className="text-xs text-[#334155]">
                      Arraste o divisor central para verificar a evolução e simetria do tratamento.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert("Upload de foto habilitado. Selecione arquivos PNG/JPEG da câmera ou galeria.")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F172A] hover:bg-[#20364F] text-white text-xs font-medium rounded-full transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Adicionar Foto
                  </button>
                </div>

                {/* Split Slider Comparison */}
                <div className="relative w-full aspect-[16/9] max-h-[420px] rounded-3xl overflow-hidden shadow-inner border border-[#CBD5E1] select-none bg-[#112233]">
                  {/* Before Image (Left Base) */}
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80"
                    alt="Antes do Procedimento"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xs text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    ANTES (Pré-Procedimento)
                  </div>

                  {/* After Image (Right Clipped) */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 0 0 ${splitSliderPos}%)` }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"
                      alt="Depois do Procedimento"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-[#2563EB]/90 backdrop-blur-xs text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      DEPOIS (Pós-Harmonização)
                    </div>
                  </div>

                  {/* Split Handle Bar */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize flex items-center justify-center"
                    style={{ left: `${splitSliderPos}%` }}
                  >
                    <div className="w-8 h-8 rounded-full bg-white shadow-lg border-2 border-[#2563EB] flex items-center justify-center text-[#2563EB] text-xs font-bold">
                      ↔
                    </div>
                  </div>

                  {/* Range Input for slider control */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={splitSliderPos}
                    onChange={(e) => setSplitSliderPos(Number(e.target.value))}
                    className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
                  />
                </div>

                <p className="text-center text-xs text-[#64748B]">
                  Deslize para a esquerda e direita para comparar o alinhamento da linha de mandíbula, malar e sustentação.
                </p>
              </div>
            )}

            {/* TAB CONTENT: TCLE (Termo de Consentimento) */}
            {activeTab === 'tcle' && (
              <div className="bg-white p-6 rounded-3xl border border-[#CBD5E1] shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#CBD5E1]">
                  <div>
                    <h4 className="font-serif italic text-xl text-[#0F172A]">
                      Termo de Consentimento Livre e Esclarecido (TCLE)
                    </h4>
                    <p className="text-xs text-[#334155]">
                      Documento legal obrigatório para procedimentos injetáveis em estética médica e odontológica.
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1 rounded-full ${
                    selectedPatient.consentSigned
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {selectedPatient.consentSigned ? <Check className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    {selectedPatient.consentSigned ? 'Termo Assinado Digitalmente' : 'Pendente de Assinatura'}
                  </span>
                </div>

                <div className="p-5 bg-[#F8FAFC] rounded-2xl border border-[#CBD5E1] text-xs text-[#0F172A] space-y-3 leading-relaxed max-h-60 overflow-y-auto">
                  <p className="font-bold text-[#0F172A]">
                    TERMO DE ESCLARECIMENTO E CONSENTIMENTO PARA PROCEDIMENTOS ESTÉTICOS INJETÁVEIS (TOXINA BOTULÍNICA, ÁCIDO HIALURÔNICO E BIOESTIMULADORES)
                  </p>
                  <p>
                    Eu, <strong>{selectedPatient.name}</strong>, portador(a) do CPF nº <strong>{selectedPatient.cpf || 'Cadastrado'}</strong>, declaro que fui devidamente informado(a) sobre a natureza, objetivos, riscos e cuidados pós-procedimento dos tratamentos de Harmonização Facial.
                  </p>
                  <p>
                    Fui esclarecido(a) de que a Toxina Botulínica atua no bloqueio temporário da contração muscular por um período médio de 3 a 6 meses, e que o preenchimento com ácido hialurônico visa restaurar volume e sustentação com absorção progressiva pelo organismo.
                  </p>
                  <p>
                    Estou ciente de que podem ocorrer pequenos hematomas (equimoses), inchaço transitório e sensibilidade leve nos pontos de puntura, e comprometo-me a seguir todas as orientações pós-procedimento.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="text-xs text-[#334155]">
                    Data do aceite: <strong className="text-[#0F172A]">{selectedPatient.createdAt}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1] text-xs font-medium rounded-full transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Imprimir TCLE
                    </button>
                    {!selectedPatient.consentSigned && (
                      <button
                        type="button"
                        onClick={() => {
                          onSavePatient({ ...selectedPatient, consentSigned: true });
                          setSelectedPatient({ ...selectedPatient, consentSigned: true });
                          confetti({ particleCount: 30 });
                        }}
                        className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium rounded-full transition-colors shadow-2xs"
                      >
                        <Check className="w-4 h-4" />
                        Registrar Assinatura Digital
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-8 bg-white p-12 rounded-3xl border border-[#CBD5E1] text-center flex flex-col items-center justify-center">
            <User className="w-12 h-12 text-[#64748B] mb-3" />
            <h4 className="font-serif italic text-xl text-[#0F172A]">
              Nenhum paciente selecionado
            </h4>
            <p className="text-xs text-[#334155] mt-1 max-w-sm">
              Selecione um paciente na barra lateral ou clique em "Novo Paciente" para cadastrar.
            </p>
          </div>
        )}
      </div>

      {/* CREATE / EDIT PATIENT MODAL */}
      {(isCreatingPatient || isEditingPatient) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#CBD5E1] overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-[#CBD5E1] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-[#F1F5F9] text-[#1E40AF] border border-[#CBD5E1] rounded-2xl">
                  <User className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[10px] font-bold text-[#1E40AF] uppercase tracking-[0.2em] block">Prontuário Digital</span>
                  <h3 className="font-serif italic text-xl text-[#0F172A]">
                    {isCreatingPatient ? 'Cadastrar Novo Paciente' : 'Editar Dados do Paciente'}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreatingPatient(false);
                  setIsEditingPatient(false);
                }}
                className="p-2 text-[#334155] hover:text-[#0F172A] rounded-full hover:bg-black/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4 overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#0F172A] mb-1.5">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Gabriela Santos"
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#0F172A] mb-1.5">Telefone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(11) 98765-4321"
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#0F172A] mb-1.5">CPF</label>
                  <input
                    type="text"
                    value={formData.cpf || ''}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#0F172A] mb-1.5">E-mail</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="paciente@email.com"
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#0F172A] mb-1.5">Data de Nascimento</label>
                  <input
                    type="date"
                    value={formData.birthDate || '1990-01-01'}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#0F172A] mb-1.5">Tag / Categoria</label>
                  <select
                    value={formData.tag || 'novo'}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none"
                  >
                    <option value="novo">Novo Paciente</option>
                    <option value="frequente">Paciente Frequente</option>
                    <option value="vip">Paciente VIP</option>
                    <option value="em_tratamento">Em Tratamento Ativo</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-[#CBD5E1]">
                <h4 className="font-serif italic text-base text-[#0F172A] mb-2">
                  Queixas Principais e Objetivos
                </h4>
                <div>
                  <label className="block font-medium text-[#0F172A] mb-1.5">Queixas Estéticas (separadas por vírgula)</label>
                  <input
                    type="text"
                    value={formData.anamnesis?.mainConcerns?.join(', ') || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      anamnesis: {
                        ...(formData.anamnesis as AnamnesisData),
                        mainConcerns: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      }
                    })}
                    placeholder="Ex: Rugas na testa, Bigode chinês, Lábios finos"
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-5 border-t border-[#CBD5E1]">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingPatient(false);
                    setIsEditingPatient(false);
                  }}
                  className="px-5 py-2.5 text-[#334155] hover:text-[#0F172A] font-medium rounded-full transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium rounded-full transition-colors shadow-xs"
                >
                  Salvar Paciente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
