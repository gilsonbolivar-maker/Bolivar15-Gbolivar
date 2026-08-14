import React, { useState } from 'react';
import { InventoryItem } from '../types';
import {
  Package, AlertTriangle, Plus, Search, ShieldCheck, Check,
  Trash2, Edit3, ArrowDownRight, ArrowUpRight, DollarSign, Calendar, X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface InventoryModuleProps {
  inventory: InventoryItem[];
  onSaveItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
  onAdjustStock: (id: string, delta: number) => void;
}

export const InventoryModule: React.FC<InventoryModuleProps> = ({
  inventory,
  onSaveItem,
  onDeleteItem,
  onAdjustStock
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: '',
    brand: '',
    category: 'toxina',
    currentStock: 10,
    minStock: 4,
    unit: 'frascos',
    costPerUnit: 500,
    sellPriceSuggested: 1800,
    lotNumber: 'LOTE-2025',
    expirationDate: '2026-12-31'
  });

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lotNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'todos' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalStockValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0);
  const lowStockCount = inventory.filter(item => item.currentStock <= item.minStock).length;

  const handleOpenCreate = () => {
    setFormData({
      id: `inv-${Date.now()}`,
      name: '',
      brand: '',
      category: 'toxina',
      currentStock: 10,
      minStock: 4,
      unit: 'frascos',
      costPerUnit: 520,
      sellPriceSuggested: 1800,
      lotNumber: `LOTE-${new Date().getFullYear()}`,
      expirationDate: '2027-01-01'
    });
    setIsCreating(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const itemToSave: InventoryItem = {
      id: formData.id || `inv-${Date.now()}`,
      name: formData.name,
      brand: formData.brand || 'Fabricante',
      category: formData.category as any || 'toxina',
      currentStock: Number(formData.currentStock) || 0,
      minStock: Number(formData.minStock) || 2,
      unit: formData.unit as any || 'frascos',
      costPerUnit: Number(formData.costPerUnit) || 0,
      sellPriceSuggested: Number(formData.sellPriceSuggested) || 0,
      lotNumber: formData.lotNumber || 'LOTE-PADRAO',
      expirationDate: formData.expirationDate || '2026-12-31',
      anvisaRegistry: formData.anvisaRegistry || ''
    };

    onSaveItem(itemToSave);
    setIsCreating(false);
    confetti({ particleCount: 30 });
  };

  return (
    <div id="inventory-module-container" className="space-y-6">
      {/* Top Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-[#CBD5E1] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-[0.2em] block">
              Insumos & Injetáveis Cadastrados
            </span>
            <span className="text-2xl font-serif italic text-[#0F172A] mt-1 block">
              {inventory.length} <span className="text-xs font-sans not-italic text-[#334155]">itens ativos</span>
            </span>
          </div>
          <span className="p-3 bg-[#F8FAFC] text-[#2563EB] border border-[#CBD5E1] rounded-2xl">
            <Package className="w-5 h-5" />
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#CBD5E1] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-[0.2em] block">
              Patrimônio em Estoque (Custo)
            </span>
            <span className="text-2xl font-serif italic text-[#0F172A] mt-1 block">
              R$ {totalStockValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <span className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl">
            <DollarSign className="w-5 h-5" />
          </span>
        </div>

        <div className={`p-6 rounded-3xl border shadow-xs flex items-center justify-between ${
          lowStockCount > 0 ? 'bg-amber-50/70 border-amber-200' : 'bg-white border-[#CBD5E1]'
        }`}>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] block text-amber-900">
              Alertas de Estoque Mínimo
            </span>
            <span className="text-2xl font-serif italic text-amber-950 mt-1 block">
              {lowStockCount} {lowStockCount === 1 ? 'item crítico' : 'itens críticos'}
            </span>
          </div>
          <span className="p-3 bg-amber-100 text-amber-900 rounded-2xl">
            <AlertTriangle className="w-5 h-5" />
          </span>
        </div>
      </div>

      {/* Filter and Add Item Bar */}
      <div className="bg-white p-5 rounded-3xl border border-[#CBD5E1] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por produto, lote ou marca..."
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
            <option value="toxina">Toxina Botulínica (Botox)</option>
            <option value="preenchedor">Ácido Hialurônico (Preenchedor)</option>
            <option value="bioestimulador">Bioestimuladores de Colágeno</option>
            <option value="fios">Fios PDO de Tração</option>
            <option value="anestesico">Anestésicos</option>
            <option value="descartavel">Cânulas e Descartáveis</option>
          </select>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium rounded-full transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Novo Insumo / Lote
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-[#CBD5E1] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#CBD5E1] text-[#334155] font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-4 px-5">Produto & Fabricante</th>
                <th className="py-4 px-5">Categoria</th>
                <th className="py-4 px-5">Lote & Validade</th>
                <th className="py-4 px-5">Estoque Atual</th>
                <th className="py-4 px-5">Custo / Venda</th>
                <th className="py-4 px-5 text-right">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#2563EB] font-serif italic text-sm">
                    Nenhum item encontrado no estoque.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const isLow = item.currentStock <= item.minStock;

                  return (
                    <tr key={item.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-semibold text-[#0F172A] text-sm">{item.name}</div>
                        <div className="text-[11px] text-[#334155] font-medium">{item.brand}</div>
                      </td>

                      <td className="py-4 px-5">
                        <span className="px-2.5 py-1 rounded-full font-medium uppercase text-[9px] bg-[#F8FAFC] text-[#2563EB] border border-[#CBD5E1]">
                          {item.category}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <div className="font-semibold text-[#0F172A]">{item.lotNumber}</div>
                        <div className="text-[11px] text-[#334155] flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-[#64748B]" />
                          Val: {item.expirationDate}
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span className={`font-serif italic font-bold text-base ${isLow ? 'text-amber-800' : 'text-[#0F172A]'}`}>
                            {item.currentStock} <span className="text-xs font-sans not-italic text-[#334155] font-normal">{item.unit}</span>
                          </span>
                          {isLow && (
                            <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold rounded-full">
                              Mín: {item.minStock}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <div className="text-[#0F172A] font-medium">
                          Custo: R$ {item.costPerUnit}
                        </div>
                        {item.sellPriceSuggested > 0 && (
                          <div className="text-[11px] text-emerald-800 font-semibold">
                            Venda: R$ {item.sellPriceSuggested}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Stock Decrement (Baixa de 1 unidade) */}
                          <button
                            type="button"
                            onClick={() => onAdjustStock(item.id, -1)}
                            disabled={item.currentStock <= 0}
                            className="px-3 py-1.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#1E293B] rounded-xl text-xs font-medium transition-colors disabled:opacity-40"
                            title="Dar baixa de 1 unidade (usado em procedimento)"
                          >
                            -1 Baixa
                          </button>

                          {/* Quick Stock Increment (+1 Entrada) */}
                          <button
                            type="button"
                            onClick={() => onAdjustStock(item.id, 1)}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium transition-colors"
                            title="Adicionar 1 unidade recebida"
                          >
                            +1 Entrada
                          </button>

                          <button
                            type="button"
                            onClick={() => onDeleteItem(item.id)}
                            className="p-1.5 text-[#64748B] hover:text-red-600 transition-colors rounded-lg"
                            title="Excluir item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-[#CBD5E1] overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-[#CBD5E1] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-[#F1F5F9] text-[#2563EB] border border-[#CBD5E1] rounded-2xl">
                  <Package className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-[0.2em] block">Inventário</span>
                  <h3 className="font-serif italic text-xl text-[#0F172A]">
                    Adicionar Insumo ao Estoque
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-medium text-[#1E293B] mb-1.5">Nome do Insumo / Produto *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Botox® Allergan 100U / Restylane Kysse 1ml"
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1E293B] mb-1.5">Marca / Laboratório</label>
                  <input
                    type="text"
                    value={formData.brand || ''}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Ex: Allergan, Galderma, Merz"
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1E293B] mb-1.5">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none text-xs"
                  >
                    <option value="toxina">Toxina Botulínica</option>
                    <option value="preenchedor">Preenchedor Ácido Hialurônico</option>
                    <option value="bioestimulador">Bioestimulador de Colágeno</option>
                    <option value="fios">Fios PDO de Tração</option>
                    <option value="anestesico">Anestésico Tópico / Injetável</option>
                    <option value="descartavel">Cânula / Agulha / Descartável</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#1E293B] mb-1.5">Lote (Rastreabilidade)</label>
                  <input
                    type="text"
                    value={formData.lotNumber || ''}
                    onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })}
                    placeholder="Ex: BTX-2025-09"
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1E293B] mb-1.5">Data de Validade</label>
                  <input
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1E293B] mb-1.5">Quantidade Inicial</label>
                  <input
                    type="number"
                    value={formData.currentStock}
                    onChange={(e) => setFormData({ ...formData, currentStock: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1E293B] mb-1.5">Estoque Mínimo (Alerta)</label>
                  <input
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1E293B] mb-1.5">Custo Unitário (R$)</label>
                  <input
                    type="number"
                    value={formData.costPerUnit}
                    onChange={(e) => setFormData({ ...formData, costPerUnit: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1E293B] mb-1.5">Preço Sugerido ao Paciente (R$)</label>
                  <input
                    type="number"
                    value={formData.sellPriceSuggested}
                    onChange={(e) => setFormData({ ...formData, sellPriceSuggested: Number(e.target.value) })}
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
                  Cadastrar Insumo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
