import React, { useState } from 'react';
import { ProcedureCatalogItem, Patient } from '../types';
import {
  Sparkles, Plus, Search, DollarSign, Clock, Check,
  Calculator, FileText, MessageSquare, Copy, ChevronRight, X, Eye, Send, CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { copyTextToClipboard } from '../utils/clipboard';

interface ProceduresModuleProps {
  procedures: ProcedureCatalogItem[];
  patients: Patient[];
  onSaveProcedure: (proc: ProcedureCatalogItem) => void;
}

export const ProceduresModule: React.FC<ProceduresModuleProps> = ({
  procedures,
  patients,
  onSaveProcedure
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [isCreating, setIsCreating] = useState(false);

  // Budget Builder State
  const [budgetPatientId, setBudgetPatientId] = useState<string>(patients[0]?.id || '');
  const [selectedBudgetProcs, setSelectedBudgetProcs] = useState<{ procId: string; qty: number }[]>([
    { procId: 'proc-botox-full', qty: 1 },
    { procId: 'proc-preench-labial', qty: 1 }
  ]);
  const [discountPercent, setDiscountPercent] = useState<number>(10);
  const [installments, setInstallments] = useState<number>(6);

  // Copy & WhatsApp UI Feedback States
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [customProposalText, setCustomProposalText] = useState<string>('');

  // New Procedure Form
  const [formData, setFormData] = useState<Partial<ProcedureCatalogItem>>({
    name: '',
    category: 'harmonizacao',
    defaultPrice: 1800,
    costPrice: 500,
    durationMinutes: 45,
    recommendedRetouchDays: 15,
    description: '',
    defaultDoseUnit: 'U',
    defaultDoseAmount: 50,
    suggestedProducts: []
  });

  const filteredProcedures = procedures.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'todos' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Calculate Budget
  const budgetSubtotal = selectedBudgetProcs.reduce((sum, item) => {
    const proc = procedures.find(p => p.id === item.procId);
    return sum + (proc ? proc.defaultPrice * item.qty : 0);
  }, 0);

  const discountAmount = (budgetSubtotal * discountPercent) / 100;
  const budgetFinalTotal = budgetSubtotal - discountAmount;
  const installmentValue = installments > 0 ? budgetFinalTotal / installments : budgetFinalTotal;

  const handleToggleProcInBudget = (procId: string) => {
    const existing = selectedBudgetProcs.find(item => item.procId === procId);
    if (existing) {
      setSelectedBudgetProcs(selectedBudgetProcs.filter(item => item.procId !== procId));
    } else {
      setSelectedBudgetProcs([...selectedBudgetProcs, { procId, qty: 1 }]);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const procToSave: ProcedureCatalogItem = {
      id: formData.id || `proc-${Date.now()}`,
      name: formData.name,
      category: formData.category as any || 'harmonizacao',
      defaultPrice: Number(formData.defaultPrice) || 0,
      costPrice: Number(formData.costPrice) || 0,
      durationMinutes: Number(formData.durationMinutes) || 30,
      recommendedRetouchDays: Number(formData.recommendedRetouchDays) || 15,
      description: formData.description || '',
      defaultDoseUnit: formData.defaultDoseUnit as any || 'ml',
      defaultDoseAmount: Number(formData.defaultDoseAmount) || 1,
      suggestedProducts: formData.suggestedProducts || []
    };

    onSaveProcedure(procToSave);
    setIsCreating(false);
    confetti({ particleCount: 30 });
  };

  const generateProposalMessage = (): string => {
    const pat = patients.find(p => p.id === budgetPatientId);
    const procListText = selectedBudgetProcs.map(item => {
      const proc = procedures.find(p => p.id === item.procId);
      return `• ${item.qty}x ${proc?.name || 'Procedimento'} - R$ ${(proc?.defaultPrice || 0) * item.qty}`;
    }).join('\n');

    return `✨ *Plano de Tratamento Personalizado de Harmonização Facial* ✨\n\nOlá, *${pat?.name || 'Querida(o) Paciente'}*!\nConforme nossa avaliação clínica, preparamos uma proposta exclusiva para alcançar seus objetivos com naturalidade e segurança:\n\n📋 *Procedimentos Inclusos:*\n${procListText || '• Avaliação e Planejamento Facial Individualizado'}\n\n💵 *Subtotal:* R$ ${budgetSubtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n🎁 *Condição Especial (${discountPercent}% OFF no Pacote):* R$ ${budgetFinalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n💳 *Facilidade:* Em até ${installments}x sem juros de *R$ ${installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}*\n\n🗓️ *Todos os retoques de 15 dias e pós-atendimento estão inclusos.*\n\nFicamos à disposição para agendarmos sua transformação! 💜\n*Harmonize Clinical*`;
  };

  const handleCopyBudgetWhatsApp = async (textToCopy?: string) => {
    const text = textToCopy || generateProposalMessage();
    const success = await copyTextToClipboard(text);

    if (success) {
      setCopyStatus('copied');
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
      setTimeout(() => {
        setCopyStatus('idle');
      }, 3500);
    } else {
      setCopyStatus('error');
      // If direct copy fails, open the modal with selectable text
      setCustomProposalText(text);
      setShowPreviewModal(true);
    }
  };

  const handleDirectWhatsAppSend = () => {
    const pat = patients.find(p => p.id === budgetPatientId);
    const text = customProposalText || generateProposalMessage();
    const cleanPhone = (pat?.phone || '').replace(/\D/g, '');
    const encoded = encodeURIComponent(text);
    
    if (cleanPhone) {
      window.open(`https://wa.me/55${cleanPhone}?text=${encoded}`, '_blank');
    } else {
      window.open(`https://wa.me/?text=${encoded}`, '_blank');
    }
  };

  const handleOpenPreview = () => {
    setCustomProposalText(generateProposalMessage());
    setShowPreviewModal(true);
  };

  return (
    <div id="procedures-module-container" className="space-y-6">
      {/* Top Banner: Treatment Plan & Budget Builder */}
      <div className="bg-[#112233] text-white p-7 rounded-3xl shadow-sm border border-[#CBD5E1]/20">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-[#64748B] text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
              <Calculator className="w-3.5 h-3.5 text-[#2563EB]" />
              Simulador de Planos de Harmonização Facial
            </div>
            <h3 className="font-serif italic text-2xl text-white">
              Orçamento de Harmonização & Combos Full Face
            </h3>
            <p className="text-xs text-[#64748B] mt-1 font-light">
              Selecione os procedimentos abaixo para calcular pacotes com desconto, parcelamento e gerar proposta direta para WhatsApp.
            </p>
          </div>

          <div className="w-full lg:w-auto flex flex-wrap items-center gap-3 bg-white/5 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-white/10">
            <div>
              <span className="text-[10px] text-[#94A3B8] font-semibold uppercase tracking-wider block">Valor Final do Pacote</span>
              <span className="text-2xl font-serif italic text-white font-bold">
                R$ {budgetFinalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="h-8 w-px bg-white/20 hidden sm:block mx-1" />

            <div>
              <span className="text-[10px] text-[#94A3B8] font-semibold uppercase tracking-wider block">Condição de Pagamento</span>
              <span className="text-xs font-semibold text-white">
                {installments}x de R$ {installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 sm:ml-auto">
              <button
                type="button"
                onClick={handleOpenPreview}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-full transition-all border border-white/20"
                title="Pré-visualizar e editar mensagem antes de enviar"
              >
                <Eye className="w-3.5 h-3.5" />
                Ver Proposta
              </button>

              <button
                type="button"
                onClick={() => handleCopyBudgetWhatsApp()}
                className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-full transition-all shadow-md active:scale-98 ${
                  copyStatus === 'copied'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse'
                    : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white'
                }`}
              >
                {copyStatus === 'copied' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>Proposta Copiada! ✨</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Proposta WhatsApp</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDirectWhatsAppSend}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-full transition-all shadow-md active:scale-98"
                title="Abrir diretamente no WhatsApp do paciente"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Enviar WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Copy Feedback Success Banner */}
        {copyStatus === 'copied' && (
          <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl flex items-center justify-between text-xs text-emerald-200 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Texto da proposta copiado com sucesso! Você já pode colar (Ctrl+V) no WhatsApp do paciente.</span>
            </div>
            <button
              type="button"
              onClick={handleDirectWhatsAppSend}
              className="underline text-white font-bold ml-3 shrink-0 hover:text-emerald-100"
            >
              Abrir WhatsApp Web →
            </button>
          </div>
        )}

        {/* Budget Config Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-white/10 text-xs">
          <div>
            <label className="text-[#64748B] block mb-1.5 font-medium">Paciente Destinatário:</label>
            <select
              value={budgetPatientId}
              onChange={(e) => setBudgetPatientId(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-2xl text-white outline-none focus:border-[#2563EB]"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id} className="text-[#0F172A]">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[#64748B] block mb-1.5 font-medium">Desconto de Pacote (%):</label>
            <input
              type="number"
              min="0"
              max="40"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Number(e.target.value))}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-2xl text-white font-semibold outline-none focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="text-[#64748B] block mb-1.5 font-medium">Parcelas no Cartão (sem juros):</label>
            <select
              value={installments}
              onChange={(e) => setInstallments(Number(e.target.value))}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-2xl text-white outline-none focus:border-[#2563EB]"
            >
              {[1, 2, 3, 4, 5, 6, 10, 12].map(n => (
                <option key={n} value={n} className="text-[#0F172A]">
                  {n}x {n === 1 ? '(À vista / Pix)' : 'sem juros'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Catalog Search & Add Procedure */}
      <div className="bg-white p-5 rounded-3xl border border-[#CBD5E1] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por procedimento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-xs font-medium text-[#0F172A] outline-none focus:border-[#2563EB]"
          >
            <option value="todos">Todas as Categorias</option>
            <option value="botox">Toxina Botulínica (Botox)</option>
            <option value="harmonizacao">Harmonização & Preenchedores</option>
            <option value="bioestimuladores">Bioestimuladores de Colágeno</option>
            <option value="fios">Fios de Sustentação</option>
            <option value="skincare_peeling">Peeling & Skincare</option>
          </select>

          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium rounded-full transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Novo Procedimento
          </button>
        </div>
      </div>

      {/* Procedures Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProcedures.map((proc) => {
          const isSelectedInBudget = selectedBudgetProcs.some(item => item.procId === proc.id);
          const margin = proc.defaultPrice - proc.costPrice;
          const marginPercent = Math.round((margin / proc.defaultPrice) * 100);

          return (
            <div
              key={proc.id}
              className={`bg-white rounded-3xl border p-6 shadow-xs transition-all flex flex-col justify-between ${
                isSelectedInBudget ? 'border-[#2563EB] ring-2 ring-[#2563EB]/20 bg-[#F8FAFC]/60' : 'border-[#CBD5E1] hover:border-[#90CDF4]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <span className="px-3 py-1 rounded-full font-medium uppercase text-[9px] bg-[#F8FAFC] text-[#2563EB] border border-[#CBD5E1]">
                    {proc.category.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-[#334155] font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                    {proc.durationMinutes} min
                  </div>
                </div>

                <h4 className="font-serif italic text-lg text-[#0F172A]">
                  {proc.name}
                </h4>

                <p className="text-xs text-[#334155] mt-1.5 line-clamp-2 leading-relaxed">
                  {proc.description}
                </p>

                <div className="mt-4 p-4 bg-[#F8FAFC] rounded-2xl border border-[#CBD5E1] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#334155] font-medium">Preço ao Paciente:</span>
                    <span className="font-serif italic text-base font-bold text-[#0F172A]">
                      R$ {proc.defaultPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#64748B]">Custo Estimado de Insumos:</span>
                    <span className="text-[#1E293B] font-medium">R$ {proc.costPrice}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-emerald-800 font-medium">Margem Bruta Clínica:</span>
                    <span className="text-emerald-800 font-semibold">{marginPercent}% (R$ {margin})</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="mt-5 pt-4 border-t border-[#CBD5E1] flex items-center justify-between">
                <span className="text-[11px] text-[#64748B]">
                  Retoque: {proc.recommendedRetouchDays} dias
                </span>

                <button
                  type="button"
                  onClick={() => handleToggleProcInBudget(proc.id)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isSelectedInBudget
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#1E293B]'
                  }`}
                >
                  {isSelectedInBudget ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  {isSelectedInBudget ? 'No Orçamento' : 'Adicionar ao Pacote'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE PROCEDURE MODAL */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-[#CBD5E1] overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-[#CBD5E1] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-[#F1F5F9] text-[#2563EB] border border-[#CBD5E1] rounded-2xl">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-[0.2em] block">Catálogo</span>
                  <h3 className="font-serif italic text-xl text-[#0F172A]">
                    Adicionar Novo Procedimento
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="p-2 text-[#334155] hover:text-[#0F172A] rounded-full hover:bg-black/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4 overflow-y-auto text-xs">
              <div>
                <label className="block font-medium text-[#1E293B] mb-1.5">Nome do Procedimento *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Rinomodelação Avançada com Ácido Hialurônico"
                  className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#1E293B] mb-1.5">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none text-xs"
                  >
                    <option value="harmonizacao">Harmonização Facial</option>
                    <option value="botox">Toxina Botulínica</option>
                    <option value="bioestimuladores">Bioestimuladores de Colágeno</option>
                    <option value="fios">Fios de Sustentação</option>
                    <option value="skincare_peeling">Peeling & Skincare</option>
                    <option value="corporal">Corporal & Papada</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#1E293B] mb-1.5">Tempo de Cabine (min)</label>
                  <input
                    type="number"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1E293B] mb-1.5">Preço Sugerido (R$)</label>
                  <input
                    type="number"
                    value={formData.defaultPrice}
                    onChange={(e) => setFormData({ ...formData, defaultPrice: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1E293B] mb-1.5">Custo Estimado de Insumos (R$)</label>
                  <input
                    type="number"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#1E293B] mb-1.5">Descrição e Benefícios</label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Indicações, técnica utilizada e resultados esperados..."
                  className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-5 border-t border-[#CBD5E1]">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-5 py-2.5 text-[#334155] hover:text-[#0F172A] font-medium rounded-full transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium rounded-full transition-colors shadow-xs"
                >
                  Salvar Procedimento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROPOSAL PREVIEW & WHATSAPP MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#CBD5E1] overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#CBD5E1] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-2xl">
                  <MessageSquare className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-[0.2em] block">
                    Proposta WhatsApp
                  </span>
                  <h3 className="font-serif italic text-xl text-[#0F172A]">
                    Pré-visualizar & Enviar Proposta
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-2 text-[#64748B] hover:text-[#0F172A] rounded-full hover:bg-black/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto text-xs bg-[#F8FAFC]">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-[#0F172A]">
                  Mensagem Formatada (você pode editar o texto antes de enviar):
                </label>
                <button
                  type="button"
                  onClick={() => setCustomProposalText(generateProposalMessage())}
                  className="text-xs text-[#2563EB] hover:underline font-medium"
                >
                  Restaurar Texto Padrão
                </button>
              </div>

              <textarea
                rows={12}
                value={customProposalText}
                onChange={(e) => setCustomProposalText(e.target.value)}
                className="w-full p-4 bg-white border border-[#CBD5E1] rounded-2xl text-[#0F172A] font-mono text-xs focus:ring-2 focus:ring-[#2563EB] outline-none shadow-inner leading-relaxed"
                placeholder="Texto da proposta..."
              />

              {/* Patient Info Summary */}
              {patients.find(p => p.id === budgetPatientId) && (
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs text-blue-900">
                  <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
                    <span className="font-bold shrink-0">Destinatário:</span>
                    <span className="font-semibold break-words">{patients.find(p => p.id === budgetPatientId)?.name}</span>
                    <span className="text-blue-600 font-mono shrink-0">({patients.find(p => p.id === budgetPatientId)?.phone})</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 bg-white border-t border-[#CBD5E1] flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 text-[#64748B] hover:text-[#0F172A] font-medium rounded-full text-xs"
              >
                Fechar
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyBudgetWhatsApp(customProposalText)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold transition-all ${
                    copyStatus === 'copied'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#F1F5F9] text-[#1E293B] hover:bg-[#E2E8F0] border border-[#CBD5E1]'
                  }`}
                >
                  {copyStatus === 'copied' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copyStatus === 'copied' ? 'Copiado!' : 'Copiar Texto'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleDirectWhatsAppSend();
                    setShowPreviewModal(false);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full text-xs transition-all shadow-md active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  Abrir e Enviar no WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
