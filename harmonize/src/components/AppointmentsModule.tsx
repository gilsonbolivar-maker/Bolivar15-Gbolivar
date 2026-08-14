import React, { useState } from 'react';
import { Appointment, Patient, ProcedureCatalogItem, Professional, AppointmentStatus } from '../types';
import {
  Calendar as CalendarIcon, Clock, Plus, Filter, CheckCircle, AlertCircle,
  Phone, MessageSquare, ChevronLeft, ChevronRight, User, DollarSign,
  Sparkles, Check, X, Shield, ArrowRight, Pencil, Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AppointmentsModuleProps {
  appointments: Appointment[];
  patients: Patient[];
  procedures: ProcedureCatalogItem[];
  professionals: Professional[];
  onSaveAppointment: (appointment: Appointment) => void;
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
  onOpenPatientRecord: (patientId: string) => void;
  onDeleteAppointment?: (id: string) => void;
}

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; bg: string; text: string; border: string }> = {
  agendado: { label: 'Agendado', bg: 'bg-[#F8FAFC]', text: 'text-[#334155]', border: 'border-[#CBD5E1]' },
  confirmado: { label: 'Confirmado', bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  em_atendimento: { label: 'Em Atendimento', bg: 'bg-[#F1F5F9]', text: 'text-[#2563EB]', border: 'border-[#CBD5E1]' },
  concluido: { label: 'Concluído', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  retorno_pendente: { label: 'Retoque / Retorno (15d)', bg: 'bg-[#F8FAFC]', text: 'text-[#2563EB]', border: 'border-[#CBD5E1]' },
  cancelado: { label: 'Cancelado', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' }
};

export const AppointmentsModule: React.FC<AppointmentsModuleProps> = ({
  appointments,
  patients,
  procedures,
  professionals,
  onSaveAppointment,
  onUpdateStatus,
  onOpenPatientRecord,
  onDeleteAppointment
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedProfessional, setSelectedProfessional] = useState<string>('todos');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('todos');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Appointment Form State
  const [formData, setFormData] = useState<Partial<Appointment>>({
    patientId: patients[0]?.id || '',
    professionalId: professionals[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    durationMinutes: 45,
    status: 'agendado',
    procedureIds: [procedures[0]?.id || ''],
    notes: '',
    paymentStatus: 'pendente',
    totalPrice: procedures[0]?.defaultPrice || 1800,
    isBotoxRetouch: false
  });

  const filteredAppointments = appointments.filter(apt => {
    const matchesDate = apt.date === selectedDate;
    const matchesProf = selectedProfessional === 'todos' || apt.professionalId === selectedProfessional;
    const matchesStatus = selectedStatusFilter === 'todos' || apt.status === selectedStatusFilter;
    return matchesDate && matchesProf && matchesStatus;
  });

  const handleOpenCreate = () => {
    const firstPat = patients[0];
    const firstProc = procedures[0];
    setIsEditing(false);
    setFormData({
      id: `apt-${Date.now()}`,
      patientId: firstPat?.id || '',
      patientName: firstPat?.name || '',
      patientPhone: firstPat?.phone || '',
      patientAvatar: firstPat?.avatarUrl || '',
      professionalId: professionals[0]?.id || '',
      professionalName: professionals[0]?.name || '',
      date: selectedDate,
      time: '11:00',
      durationMinutes: firstProc?.durationMinutes || 45,
      status: 'agendado',
      procedureIds: [firstProc?.id || ''],
      procedureNames: [firstProc?.name || ''],
      notes: '',
      paymentStatus: 'pendente',
      totalPrice: firstProc?.defaultPrice || 1800,
      isBotoxRetouch: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (apt: Appointment) => {
    setIsEditing(true);
    setFormData({
      id: apt.id,
      patientId: apt.patientId,
      patientName: apt.patientName,
      patientPhone: apt.patientPhone,
      patientAvatar: apt.patientAvatar,
      professionalId: apt.professionalId,
      professionalName: apt.professionalName,
      date: apt.date,
      time: apt.time,
      durationMinutes: apt.durationMinutes || 45,
      status: apt.status || 'agendado',
      procedureIds: apt.procedureIds && apt.procedureIds.length > 0 ? apt.procedureIds : [procedures[0]?.id || ''],
      procedureNames: apt.procedureNames || [],
      notes: apt.notes || '',
      paymentStatus: apt.paymentStatus || 'pendente',
      totalPrice: apt.totalPrice ?? (procedures.find(p => p.id === apt.procedureIds?.[0])?.defaultPrice || 0),
      isBotoxRetouch: !!apt.isBotoxRetouch
    });
    setIsModalOpen(true);
  };

  const handleDeleteCurrent = () => {
    if (!formData.id) return;
    if (confirm("Tem certeza que deseja excluir este agendamento?")) {
      if (onDeleteAppointment) {
        onDeleteAppointment(formData.id);
      } else {
        onUpdateStatus(formData.id, 'cancelado');
      }
      setIsModalOpen(false);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === formData.patientId);
    const prof = professionals.find(p => p.id === formData.professionalId);
    const selectedProcs = procedures.filter(p => formData.procedureIds?.includes(p.id));

    const total = selectedProcs.reduce((sum, p) => sum + p.defaultPrice, 0);

    const aptToSave: Appointment = {
      id: formData.id || `apt-${Date.now()}`,
      patientId: formData.patientId || '',
      patientName: pat?.name || formData.patientName || 'Paciente',
      patientPhone: pat?.phone || formData.patientPhone || '',
      patientAvatar: pat?.avatarUrl || formData.patientAvatar,
      professionalId: formData.professionalId || professionals[0].id,
      professionalName: prof?.name || professionals[0].name,
      procedureIds: selectedProcs.length > 0 ? selectedProcs.map(p => p.id) : (formData.procedureIds || []),
      procedureNames: selectedProcs.length > 0 ? selectedProcs.map(p => p.name) : (formData.procedureNames || []),
      date: formData.date || selectedDate,
      time: formData.time || '10:00',
      durationMinutes: Number(formData.durationMinutes) || 45,
      status: (formData.status as AppointmentStatus) || 'agendado',
      notes: formData.notes || '',
      totalPrice: formData.isBotoxRetouch ? 0 : (formData.totalPrice !== undefined ? Number(formData.totalPrice) : total),
      paymentStatus: (formData.paymentStatus as any) || 'pendente',
      isBotoxRetouch: formData.isBotoxRetouch
    };

    onSaveAppointment(aptToSave);
    setIsModalOpen(false);
    confetti({ particleCount: 40 });
  };

  const sendWhatsAppReminder = (apt: Appointment) => {
    const cleanPhone = apt.patientPhone.replace(/\D/g, '');
    const dateFormatted = apt.date.split('-').reverse().join('/');
    const msg = encodeURIComponent(
      `Olá ${apt.patientName}, tudo bem? Confirmamos o seu agendamento na *Harmonize Clinical* para o dia *${dateFormatted}* às *${apt.time}* com ${apt.professionalName} (${apt.procedureNames.join(', ')}).\n\nPodemos confirmar sua presença? ✨ Caso precise de anestésico tópico, pedimos que chegue 20 minutos antes.`
    );
    window.open(`https://wa.me/55${cleanPhone}?text=${msg}`, '_blank');
  };

  return (
    <div id="appointments-module-container" className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#CBD5E1] shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Date Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() - 1);
              setSelectedDate(d.toISOString().split('T')[0]);
            }}
            className="p-2.5 hover:bg-[#F8FAFC] rounded-2xl text-[#334155] border border-[#CBD5E1] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="relative flex-1 sm:flex-initial">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl font-semibold text-xs text-[#0F172A] focus:border-[#2563EB] outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() + 1);
              setSelectedDate(d.toISOString().split('T')[0]);
            }}
            className="p-2.5 hover:bg-[#F8FAFC] rounded-2xl text-[#334155] border border-[#CBD5E1] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="px-4 py-2 bg-[#F1F5F9] hover:bg-[#F8FAFC] text-[#1E293B] border border-[#CBD5E1] text-xs font-medium rounded-full transition-colors"
          >
            Hoje
          </button>
        </div>

        {/* Filters and New Appointment Button */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end">
          {/* Filter by Professional */}
          <select
            value={selectedProfessional}
            onChange={(e) => setSelectedProfessional(e.target.value)}
            className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-xs font-medium text-[#0F172A] outline-none focus:border-[#2563EB]"
          >
            <option value="todos">Todos Profissionais</option>
            {professionals.map((prof) => (
              <option key={prof.id} value={prof.id}>
                {prof.name}
              </option>
            ))}
          </select>

          {/* Filter by Status */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-xs font-medium text-[#0F172A] outline-none focus:border-[#2563EB]"
          >
            <option value="todos">Todos Status</option>
            <option value="agendado">Agendado</option>
            <option value="confirmado">Confirmado</option>
            <option value="em_atendimento">Em Atendimento</option>
            <option value="concluido">Concluído</option>
            <option value="retorno_pendente">Retoque / Retorno</option>
          </select>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium rounded-full transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Novo Agendamento
          </button>
        </div>
      </div>

      {/* Appointments List for the selected day */}
      <div className="bg-white rounded-3xl border border-[#CBD5E1] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#CBD5E1] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#2563EB]" />
            <h3 className="font-serif italic text-base text-[#0F172A]">
              Agenda do Dia • {selectedDate.split('-').reverse().join('/')} ({filteredAppointments.length} agendamentos)
            </h3>
          </div>
        </div>

        <div className="divide-y divide-[#F1F5F9]">
          {filteredAppointments.length === 0 ? (
            <div className="p-12 text-center text-[#2563EB] text-xs">
              <Clock className="w-10 h-10 text-[#90CDF4] mx-auto mb-2" />
              <p className="font-serif italic text-base text-[#0F172A]">Nenhum atendimento agendado para esta data.</p>
              <p className="text-xs text-[#334155] mt-1">Clique em "Novo Agendamento" para marcar um procedimento.</p>
            </div>
          ) : (
            filteredAppointments.map((apt) => {
              const statusCfg = STATUS_CONFIG[apt.status] || STATUS_CONFIG.agendado;

              return (
                <div
                  key={apt.id}
                  className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#F8FAFC] transition-colors"
                >
                  {/* Left: Time and Patient Info */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className="px-3.5 py-2.5 bg-[#112233] text-white font-serif font-bold text-base rounded-2xl text-center min-w-[72px] shrink-0">
                      {apt.time}
                      <span className="block text-[9px] font-sans font-normal text-[#64748B]">
                        {apt.durationMinutes} min
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold text-sm text-[#0F172A] break-words max-w-full" title={apt.patientName}>
                          {apt.patientName}
                        </h4>
                        {apt.isBotoxRetouch && (
                          <span className="px-2.5 py-0.5 bg-[#F1F5F9] text-[#2563EB] text-[9px] font-bold uppercase tracking-wider rounded-full border border-[#CBD5E1] shrink-0">
                            RETOQUE DE BOTOX
                          </span>
                        )}
                        <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border shrink-0 ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
                          {statusCfg.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#334155] mt-1 break-words">
                        <span className="font-semibold text-[#2563EB]">
                          {apt.procedureNames.join(' + ')}
                        </span>
                        <span>•</span>
                        <span>{apt.professionalName}</span>
                      </div>

                      {apt.notes && (
                        <p className="text-xs text-[#64748B] mt-1 italic break-words">
                          "{apt.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions & Status Change */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(apt)}
                      className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-2xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs"
                      title="Editar agendamento, horário, procedimentos ou observações"
                    >
                      <Pencil className="w-3.5 h-3.5 text-blue-600" />
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => sendWhatsAppReminder(apt)}
                      className="p-2 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-2xl border border-emerald-200 transition-colors text-xs font-medium flex items-center gap-1.5"
                      title="Enviar confirmação pelo WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Lembrete
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenPatientRecord(apt.patientId)}
                      className="px-3.5 py-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#1E293B] border border-[#CBD5E1] rounded-2xl text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <User className="w-3.5 h-3.5 text-[#2563EB]" />
                      Prontuário
                    </button>

                    {/* Status Toggle Quick Buttons */}
                    <select
                      value={apt.status}
                      onChange={(e) => onUpdateStatus(apt.id, e.target.value as AppointmentStatus)}
                      className="px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-xs font-semibold text-[#0F172A] outline-none focus:border-[#2563EB]"
                    >
                      <option value="agendado">Agendado</option>
                      <option value="confirmado">Confirmado</option>
                      <option value="em_atendimento">Em Atendimento</option>
                      <option value="concluido">Concluído</option>
                      <option value="retorno_pendente">Retorno / Retoque</option>
                      <option value="cancelado">Cancelado</option>
                    </select>

                    {apt.status !== 'concluido' && (
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateStatus(apt.id, 'concluido');
                          confetti({ particleCount: 35 });
                        }}
                        className="p-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl transition-colors shadow-2xs"
                        title="Finalizar atendimento"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* APPOINTMENT MODAL (CREATE / EDIT) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-[#CBD5E1] overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#CBD5E1] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-3">
                <span className={`p-2.5 border rounded-2xl ${
                  isEditing 
                    ? 'bg-blue-50 text-blue-800 border-blue-200' 
                    : 'bg-[#F1F5F9] text-[#2563EB] border-[#CBD5E1]'
                }`}>
                  {isEditing ? <Pencil className="w-4 h-4" /> : <CalendarIcon className="w-4 h-4" />}
                </span>
                <div>
                  <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-[0.2em] block">
                    {isEditing ? 'Gestão da Agenda' : 'Novo Agendamento'}
                  </span>
                  <h3 className="font-serif italic text-xl text-[#0F172A]">
                    {isEditing ? 'Editar Agendamento' : 'Novo Procedimento Estético'}
                  </h3>
                  {isEditing && formData.patientName && (
                    <p className="text-xs text-[#64748B] mt-0.5">
                      Paciente: <span className="font-semibold text-[#0F172A]">{formData.patientName}</span>
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-[#334155] hover:text-[#0F172A] rounded-full hover:bg-black/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveForm} className="p-6 space-y-4 overflow-y-auto text-xs">
              <div>
                <label className="block font-medium text-[#1E293B] mb-1.5">Paciente *</label>
                <select
                  required
                  value={formData.patientId}
                  onChange={(e) => {
                    const pat = patients.find(p => p.id === e.target.value);
                    setFormData({
                      ...formData,
                      patientId: e.target.value,
                      patientName: pat?.name || '',
                      patientPhone: pat?.phone || '',
                      patientAvatar: pat?.avatarUrl
                    });
                  }}
                  className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none text-xs"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {p.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#1E293B] mb-1.5">Profissional Injetor *</label>
                  <select
                    required
                    value={formData.professionalId}
                    onChange={(e) => {
                      const prof = professionals.find(p => p.id === e.target.value);
                      setFormData({
                        ...formData,
                        professionalId: e.target.value,
                        professionalName: prof?.name || ''
                      });
                    }}
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none text-xs"
                  >
                    {professionals.map(prof => (
                      <option key={prof.id} value={prof.id}>
                        {prof.name} ({prof.council})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#1E293B] mb-1.5">Procedimento Principal *</label>
                  <select
                    required
                    value={formData.procedureIds?.[0] || procedures[0]?.id}
                    onChange={(e) => {
                      const proc = procedures.find(p => p.id === e.target.value);
                      setFormData({
                        ...formData,
                        procedureIds: [e.target.value],
                        procedureNames: proc ? [proc.name] : [],
                        durationMinutes: proc?.durationMinutes || 45,
                        totalPrice: proc?.defaultPrice || 0
                      });
                    }}
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none text-xs"
                  >
                    {procedures.map(proc => (
                      <option key={proc.id} value={proc.id}>
                        {proc.name} (R$ {proc.defaultPrice})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#1E293B] mb-1.5">Data do Atendimento *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1E293B] mb-1.5">Horário *</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1E293B] mb-1.5">Duração (minutos)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={15}
                      max={360}
                      step={5}
                      value={formData.durationMinutes || 45}
                      onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none text-xs font-semibold"
                    />
                    <div className="flex gap-1">
                      {[30, 45, 60].map(mins => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => setFormData({ ...formData, durationMinutes: mins })}
                          className={`px-2 py-1 text-[10px] rounded-lg border font-semibold ${
                            formData.durationMinutes === mins
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-[#F8FAFC] text-[#64748B] border-[#CBD5E1]'
                          }`}
                        >
                          {mins}m
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-[#1E293B] mb-1.5">Status do Atendimento</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as AppointmentStatus })}
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none text-xs font-semibold"
                  >
                    <option value="agendado">Agendado</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="em_atendimento">Em Atendimento</option>
                    <option value="concluido">Concluído</option>
                    <option value="retorno_pendente">Retorno / Retoque</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#1E293B] mb-1.5">Valor do Procedimento (R$)</label>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    value={formData.isBotoxRetouch ? 0 : (formData.totalPrice ?? 0)}
                    disabled={formData.isBotoxRetouch}
                    onChange={(e) => setFormData({ ...formData, totalPrice: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none text-xs font-bold disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1E293B] mb-1.5">Status de Pagamento</label>
                  <select
                    value={formData.paymentStatus || 'pendente'}
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none text-xs font-semibold"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="pago">Pago Integralmente</option>
                    <option value="parcial">Sinal / Parcial</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-[#F1F5F9] rounded-2xl border border-[#CBD5E1] flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="isBotoxRetouch"
                  checked={formData.isBotoxRetouch}
                  onChange={(e) => setFormData({
                    ...formData,
                    isBotoxRetouch: e.target.checked,
                    totalPrice: e.target.checked ? 0 : formData.totalPrice
                  })}
                  className="rounded text-[#2563EB] focus:ring-[#2563EB] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="isBotoxRetouch" className="font-medium text-[#1E293B] cursor-pointer">
                  Este agendamento é um Retoque / Avaliação Gratuita de Botox (15 dias)?
                </label>
              </div>

              <div>
                <label className="block font-medium text-[#1E293B] mb-1.5">Observações Clínicas / Pré-atendimento</label>
                <textarea
                  rows={2}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ex: Anestésico tópico 20 min antes, verificar foto anterior..."
                  className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none text-xs"
                />
              </div>

              {/* Modal Footer with Actions */}
              <div className="flex items-center justify-between gap-3 pt-5 border-t border-[#CBD5E1]">
                {isEditing ? (
                  <button
                    type="button"
                    onClick={handleDeleteCurrent}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-rose-700 hover:text-rose-800 hover:bg-rose-50 font-medium rounded-full transition-colors text-xs border border-rose-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Excluir
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 text-[#334155] hover:text-[#0F172A] font-medium rounded-full transition-colors text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium rounded-full transition-colors shadow-xs text-xs active:scale-98"
                  >
                    <Check className="w-3.5 h-3.5" />
                    {isEditing ? 'Salvar Alterações' : 'Salvar Agendamento'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
