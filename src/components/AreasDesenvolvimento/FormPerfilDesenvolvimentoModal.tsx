import React, { useEffect, useState } from "react";
import { X, Brain, Save } from "lucide-react";
import { Paciente, PerfilDesenvolvimentoAluno, AreaDesenvolvimento } from "../../types";

interface FormPerfilDesenvolvimentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  paciente: Paciente | null;
  perfilAtual?: PerfilDesenvolvimentoAluno | null;
  onSalvarPerfil: (perfil: PerfilDesenvolvimentoAluno) => void;
}

const AREAS: AreaDesenvolvimento[] = [
  "Atenção", "Concentração", "Memória", "Linguagem", "Leitura", "Escrita",
  "Consciência fonológica", "Raciocínio lógico", "Planejamento", "Funções executivas",
  "Flexibilidade cognitiva", "Controle inibitório", "Coordenação motora fina",
  "Coordenação motora ampla", "Percepção visual", "Percepção auditiva",
  "Organização espacial", "Organização temporal", "Comunicação", "Interação social",
  "Autonomia", "Regulação emocional", "Autoestima", "Tolerância à frustração",
  "Resolução de problemas", "Habilidades adaptativas",
];

export const FormPerfilDesenvolvimentoModal: React.FC<FormPerfilDesenvolvimentoModalProps> = ({
  isOpen,
  onClose,
  paciente,
  perfilAtual,
  onSalvarPerfil,
}) => {
  const [areasParaEstimular, setAreasParaEstimular] = useState<AreaDesenvolvimento[]>([]);
  const [notas, setNotas] = useState<Partial<Record<AreaDesenvolvimento, string>>>({});

  useEffect(() => {
    setAreasParaEstimular(perfilAtual?.areasParaEstimular || []);
    setNotas(perfilAtual?.observacoesPorArea || {});
  }, [perfilAtual, isOpen]);

  if (!isOpen || !paciente) return null;

  const toggleArea = (area: AreaDesenvolvimento) => {
    setAreasParaEstimular((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const perfil: PerfilDesenvolvimentoAluno = {
      pacienteId: paciente.id,
      areasParaEstimular,
      observacoesPorArea: notas,
      atualizadoEm: new Date().toISOString().split("T")[0],
    };
    onSalvarPerfil(perfil);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Perfil de Desenvolvimento</h3>
              <p className="text-xs text-slate-400">{paciente.nome}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Áreas que precisam de estimulação
            </label>
            <div className="flex flex-wrap gap-1.5">
              {AREAS.map((area) => {
                const selected = areasParaEstimular.includes(area);
                return (
                  <button
                    type="button"
                    key={area}
                    onClick={() => toggleArea(area)}
                    className={`px-2 py-1 text-[11px] font-medium rounded-lg border transition-colors ${
                      selected
                        ? "bg-blue-50 text-blue-700 border-blue-300 font-semibold"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {selected ? "✓ " : "+ "}
                    {area}
                  </button>
                );
              })}
            </div>
          </div>

          {areasParaEstimular.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700">
                Observações por área (opcional)
              </label>
              {areasParaEstimular.map((area) => (
                <div key={area}>
                  <span className="text-[11px] font-semibold text-slate-500">{area}</span>
                  <input
                    type="text"
                    value={notas[area] || ""}
                    onChange={(e) => setNotas((prev) => ({ ...prev, [area]: e.target.value }))}
                    placeholder={`Observação sobre ${area.toLowerCase()}...`}
                    className="w-full mt-0.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors">
              Cancelar
            </button>
            <button type="submit" className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow transition-colors">
              <Save className="w-4 h-4" />
              <span>Salvar Perfil</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
