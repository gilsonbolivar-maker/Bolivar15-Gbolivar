import React, { useState } from 'react';
import { FinancialTransaction, Professional } from '../types';
import {
  DollarSign, TrendingUp, TrendingDown, CreditCard, Plus,
  Search, Calendar, Filter, ArrowUpRight, ArrowDownRight, UserCheck, X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { todayISO } from '../utils/date';

interface FinancialModuleProps {
  transactions: FinancialTransaction[];
  professionals: Professional[];
  onSaveTransaction: (tx: FinancialTransaction) => void;
}

export const FinancialModule: React.FC<FinancialModuleProps> = ({
  transactions,
  professionals,
  onSaveTransaction
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'todos' | 'receita' | 'despesa'>('todos');
  const [isCreating, setIsCreating] = useState(false);

  // New Transaction Form State
  const [formData, setFormData] = useState<Partial<FinancialTransaction>>({
    type: 'receita',
    category: 'Procedimento HOF',
    description: '',
    amount: 1800,
    date: todayISO(),
    paymentMethod: 'pix',
    status: 'pago'
  });

  const totalReceitas = transactions
    .filter(t => t.type === 'receita' && t.status === 'pago')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDespesas = transactions
    .filter(t => t.type === 'despesa' && t.status === 'pago')
    .reduce((sum, t) => sum + t.amount, 0);

  const saldoLiquido = totalReceitas - totalDespesas;

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'todos' || t.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    const txToSave: FinancialTransaction = {
      id: formData.id || `tx-${Date.now()}`,
      type: formData.type as any || 'receita',
      category: formData.category || 'Procedimento HOF',
      description: formData.description,
      amount: Number(formData.amount) || 0,
      date: formData.date || todayISO(),
      paymentMethod: formData.paymentMethod as any || 'pix',
      status: formData.status as any || 'pago'
    };

    onSaveTransaction(txToSave);
    setIsCreating(false);
    confetti({ particleCount: 30 });
  };

  return (
    <div id="financial-module-container" className="space-y-6">
      {/* Financial KPIs Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-[#CBD5E1] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-[0.2em] block">
              Receitas Realizadas
            </span>
            <span className="text-2xl font-serif italic text-[#0F172A] mt-1 block">
              R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <span className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl">
            <TrendingUp className="w-5 h-5" />
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#CBD5E1] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-[0.2em] block">
              Despesas & Insumos Pagos
            </span>
            <span className="text-2xl font-serif italic text-[#0F172A] mt-1 block">
              R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <span className="p-3 bg-[#F8FAFC] text-[#2563EB] border border-[#CBD5E1] rounded-2xl">
            <TrendingDown className="w-5 h-5" />
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#CBD5E1] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-[0.2em] block">
              Saldo Líquido em Caixa
            </span>
            <span className={`text-2xl font-serif italic mt-1 block ${
              saldoLiquido >= 0 ? 'text-[#0F172A]' : 'text-red-600'
            }`}>
              R$ {saldoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <span className="p-3 bg-[#112233] text-white rounded-2xl">
            <DollarSign className="w-5 h-5" />
          </span>
        </div>
      </div>

      {/* Filter and New Transaction Bar */}
      <div className="bg-white p-5 rounded-3xl border border-[#CBD5E1] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar lançamentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 text-xs">
            {(['todos', 'receita', 'despesa'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-full font-medium capitalize transition-all ${
                  selectedType === type
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-[#F8FAFC] text-[#334155] hover:bg-[#F1F5F9] border border-[#CBD5E1]'
                }`}
              >
                {type === 'todos' ? 'Todos' : type === 'receita' ? 'Receitas' : 'Despesas'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium rounded-full transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Novo Lançamento
          </button>
        </div>
      </div>

      {/* Transactions Table & Professional Commissions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cashflow Table (Left) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#CBD5E1] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#CBD5E1] flex items-center justify-between bg-[#F8FAFC]">
            <h3 className="font-serif italic text-base text-[#0F172A]">
              Fluxo de Caixa & Transações ({filteredTransactions.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#CBD5E1] text-[#334155] font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-5">Tipo</th>
                  <th className="py-4 px-5">Descrição & Paciente</th>
                  <th className="py-4 px-5">Forma</th>
                  <th className="py-4 px-5">Data</th>
                  <th className="py-4 px-5 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredTransactions.map((tx) => {
                  const isReceita = tx.type === 'receita';

                  return (
                    <tr key={tx.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-medium text-[9px] uppercase ${
                          isReceita
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                          {isReceita ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {tx.type}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <div className="font-semibold text-[#0F172A]">{tx.description}</div>
                        <div className="text-[11px] text-[#334155] font-medium">{tx.category}</div>
                      </td>

                      <td className="py-4 px-5">
                        <span className="font-medium text-[#1E293B] capitalize">
                          {tx.paymentMethod.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-[#334155] font-medium">
                        {tx.date.split('-').reverse().join('/')}
                      </td>

                      <td className={`py-4 px-5 text-right font-serif italic font-bold text-sm ${
                        isReceita ? 'text-emerald-800' : 'text-rose-800'
                      }`}>
                        {isReceita ? '+' : '-'} R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Professional Injectory Commissions Card (Right) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-[#CBD5E1] shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#CBD5E1]">
            <span className="p-2 bg-[#F8FAFC] text-[#2563EB] border border-[#CBD5E1] rounded-xl">
              <UserCheck className="w-4 h-4" />
            </span>
            <h4 className="font-serif italic text-base text-[#0F172A]">
              Comissões dos Profissionais
            </h4>
          </div>

          <div className="space-y-3">
            {professionals.map((prof) => {
              // Calculate rough commission based on total revenue
              const estimatedProfRevenue = totalReceitas * (prof.id === 'prof-1' ? 0.45 : prof.id === 'prof-2' ? 0.35 : 0.20);
              const estimatedCommission = estimatedProfRevenue * (prof.commissionPercent / 100);

              return (
                <div key={prof.id} className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#CBD5E1] text-xs">
                  <div className="flex items-center gap-3 mb-2.5">
                    <img
                      src={prof.avatarUrl}
                      alt={prof.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#CBD5E1]"
                    />
                    <div>
                      <h5 className="font-semibold text-[#0F172A]">{prof.name}</h5>
                      <p className="text-[11px] text-[#334155]">{prof.council} {prof.councilNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-[#CBD5E1]">
                    <span className="text-[#334155] font-medium">Comissão ({prof.commissionPercent}%):</span>
                    <span className="font-serif italic text-base font-bold text-[#0F172A]">
                      R$ {estimatedCommission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#CBD5E1] text-[11px] text-[#334155] leading-relaxed font-light">
            💡 As comissões são calculadas automaticamente com base no valor líquido dos procedimentos executados por cada profissional injetor.
          </div>
        </div>
      </div>

      {/* CREATE TRANSACTION MODAL */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#CBD5E1] overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-[#CBD5E1] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-[#F1F5F9] text-[#2563EB] border border-[#CBD5E1] rounded-2xl">
                  <DollarSign className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-[0.2em] block">Financeiro</span>
                  <h3 className="font-serif italic text-xl text-[#0F172A]">
                    Lançar Nova Transação
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
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'receita' })}
                  className={`p-3.5 rounded-2xl border font-medium text-center transition-all ${
                    formData.type === 'receita'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-[#F8FAFC] border-[#CBD5E1] text-[#334155]'
                  }`}
                >
                  + Receita (Entrada)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'despesa' })}
                  className={`p-3.5 rounded-2xl border font-medium text-center transition-all ${
                    formData.type === 'despesa'
                      ? 'bg-rose-50 border-rose-500 text-rose-800'
                      : 'bg-[#F8FAFC] border-[#CBD5E1] text-[#334155]'
                  }`}
                >
                  - Despesa (Saída)
                </button>
              </div>

              <div>
                <label className="block font-medium text-[#1E293B] mb-1.5">Descrição *</label>
                <input
                  type="text"
                  required
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ex: Pagamento Botox Full Face - Juliana Paes"
                  className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#1E293B] mb-1.5">Valor (R$) *</label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1E293B] mb-1.5">Forma de Pagamento</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none text-xs"
                  >
                    <option value="pix">Pix Instantâneo</option>
                    <option value="cartao_credito">Cartão de Crédito</option>
                    <option value="cartao_debito">Cartão de Débito</option>
                    <option value="dinheiro">Dinheiro em Espécie</option>
                    <option value="transferencia">TED / Transferência</option>
                    <option value="boleto">Boleto Bancário</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#1E293B] mb-1.5">Categoria</label>
                  <input
                    type="text"
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Ex: Procedimento HOF, Compra de Insumos..."
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1E293B] mb-1.5">Data</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none text-xs"
                  />
                </div>
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
                  Registrar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
