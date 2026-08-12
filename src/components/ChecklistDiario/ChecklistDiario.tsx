import React, { useState } from "react";
import { CheckSquare, Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import { ItemChecklist } from "../../types";

interface ChecklistDiarioProps {
  itens: ItemChecklist[];
  onAlternarItem: (id: string) => void;
  onAdicionarItem: (texto: string) => void;
  onRemoverItem: (id: string) => void;
}

export const ChecklistDiario: React.FC<ChecklistDiarioProps> = ({
  itens,
  onAlternarItem,
  onAdicionarItem,
  onRemoverItem,
}) => {
  const [novoTexto, setNovoTexto] = useState("");

  const concluidos = itens.filter((i) => i.concluido).length;
  const total = itens.length;
  const percentual = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  const handleAdicionar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoTexto.trim()) return;
    onAdicionarItem(novoTexto.trim());
    setNovoTexto("");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-azulc-600" />
          Checklist Diário
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Rotina de tarefas do dia — {concluidos} de {total} concluída(s)
        </p>

        <div className="mt-4 h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-azulc-500 rounded-full transition-all"
            style={{ width: `${percentual}%` }}
          />
        </div>
      </div>

      <form
        onSubmit={handleAdicionar}
        className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs"
      >
        <input
          type="text"
          value={novoTexto}
          onChange={(e) => setNovoTexto(e.target.value)}
          placeholder="Adicionar nova tarefa..."
          className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-azulc-500 focus:border-azulc-500"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-azulc-600 hover:bg-azulc-500 text-white text-xs font-bold rounded-xl shadow transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar</span>
        </button>
      </form>

      {itens.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
          Nenhuma tarefa na lista. Adicione a primeira acima.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
          {itens.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-4 group"
            >
              <button
                onClick={() => onAlternarItem(item.id)}
                className="shrink-0"
              >
                {item.concluido ? (
                  <CheckCircle2 className="w-5 h-5 text-azulc-500" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                )}
              </button>
              <span
                className={`flex-1 text-sm ${
                  item.concluido ? "text-slate-400 line-through" : "text-slate-800 font-medium"
                }`}
              >
                {item.texto}
              </span>
              <button
                onClick={() => onRemoverItem(item.id)}
                className="p-1 text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                title="Remover tarefa"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
