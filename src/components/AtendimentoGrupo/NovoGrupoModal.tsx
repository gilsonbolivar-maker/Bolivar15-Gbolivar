import React, { useState } from "react";
import { X, Users, Save, Sparkles, Camera } from "lucide-react";
import { GrupoAtendimento, CategoriaGrupo } from "../../types";
import { AiDocumentScannerModal, ExtractedDocumentData } from "../AiDocumentScannerModal";

interface NovoGrupoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveGrupo: (grupo: GrupoAtendimento) => void;
}

const CATEGORIAS_GRUPO: CategoriaGrupo[] = [
  "Grupo Terapêutico",
  "Socioeducativo",
  "Apoio Psicológico",
  "Grupo de Convivência",
  "Prevenção do Tabagismo",
  "Grupo de Gestantes",
  "Oficina de Artes e Habilidades",
];

export const NovoGrupoModal: React.FC<NovoGrupoModalProps> = ({
  isOpen,
  onClose,
  onSaveGrupo,
}) => {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState<CategoriaGrupo>("Grupo Terapêutico");
  const [descricao, setDescricao] = useState("");
  const [responsavelNome, setResponsavelNome] = useState("Dra. Débora Costa");
  const [responsavelCargo, setResponsavelCargo] = useState("Psicóloga - CRP 03/24682");
  const [coResponsavel, setCoResponsavel] = useState("");
  const [localSala, setLocalSala] = useState("Sala Multiuso A - CRAS / UBS");
  const [frequencia, setFrequencia] = useState<"Semanal" | "Quinzenal" | "Mensal">("Semanal");
  const [horarioPadrao, setHorarioPadrao] = useState("Toda Quarta-feira às 14:00");
  const [maxVagas, setMaxVagas] = useState(15);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleDataExtracted = (data: ExtractedDocumentData) => {
    if (data.grupoNome) setNome(data.grupoNome);
    if (data.grupoCategoria && CATEGORIAS_GRUPO.includes(data.grupoCategoria as any)) {
      setCategoria(data.grupoCategoria as any);
    }
    if (data.grupoDescricao) setDescricao(data.grupoDescricao);
    if (data.grupoLocal) setLocalSala(data.grupoLocal);
    if (data.grupoHorario) setHorarioPadrao(data.grupoHorario);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !descricao.trim()) {
      alert("Por favor, preencha o nome e a descrição do grupo.");
      return;
    }

    const novoGrupo: GrupoAtendimento = {
      id: `grp-${Date.now()}`,
      nome: nome.trim(),
      categoria,
      descricao: descricao.trim(),
      responsavelNome: responsavelNome.trim(),
      responsavelCargo: responsavelCargo.trim(),
      coResponsavel: coResponsavel.trim() || undefined,
      localSala: localSala.trim(),
      frequencia,
      horarioPadrao: horarioPadrao.trim(),
      maxVagas: Number(maxVagas) || 15,
      participantesIds: [],
      status: "Ativo",
      dataCriacao: new Date().toISOString().split("T")[0],
    };

    onSaveGrupo(novoGrupo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Criar Novo Grupo de Atendimento</h3>
              <p className="text-xs text-slate-400">
                Acompanhamento coletivo, oficinas socioeducativas e terapêuticas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Banner de Preenchimento com IA */}
          <div className="p-3 bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border border-indigo-200/80 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-xs block">
                  Ler Ficha de Grupo com IA
                </span>
                <p className="text-[11px] text-slate-600">
                  Fotografe proposta de grupo ou projeto de oficina.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5 shrink-0"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Escanear Projeto</span>
            </button>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nome do Grupo *
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Grupo Viver Bem - Terceira Idade"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Categoria / Modalidade
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as CategoriaGrupo)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {CATEGORIAS_GRUPO.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Capacidade Máxima de Vagas
              </label>
              <input
                type="number"
                min={2}
                max={100}
                value={maxVagas}
                onChange={(e) => setMaxVagas(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Facilitador / Profissional Responsável *
              </label>
              <input
                type="text"
                required
                value={responsavelNome}
                onChange={(e) => setResponsavelNome(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Cargo do Responsável
              </label>
              <input
                type="text"
                required
                value={responsavelCargo}
                onChange={(e) => setResponsavelCargo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Frequência dos Encontros
              </label>
              <select
                value={frequencia}
                onChange={(e) => setFrequencia(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none"
              >
                <option value="Semanal">Semanal</option>
                <option value="Quinzenal">Quinzenal</option>
                <option value="Mensal">Mensal</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Dia e Horário Padrão
              </label>
              <input
                type="text"
                value={horarioPadrao}
                onChange={(e) => setHorarioPadrao(e.target.value)}
                placeholder="Ex: Quarta-feira às 14:00"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Local / Sala de Encontro
            </label>
            <input
              type="text"
              value={localSala}
              onChange={(e) => setLocalSala(e.target.value)}
              placeholder="Ex: Sala Multiuso A ou Auditório"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Descrição e Objetivos do Grupo *
            </label>
            <textarea
              rows={3}
              required
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o público-alvo, metas terapêuticas ou objetivos sociais do grupo..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Criar Grupo</span>
            </button>
          </div>
        </form>
      </div>

      <AiDocumentScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        targetFormName="Ficha de Grupo / Projeto"
        onDataExtracted={handleDataExtracted}
      />
    </div>
  );
};
