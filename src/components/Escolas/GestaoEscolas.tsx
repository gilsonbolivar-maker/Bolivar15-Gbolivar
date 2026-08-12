import React, { useState } from "react";
import {
  Building2,
  Plus,
  Search,
  Phone,
  MapPin,
  Calendar,
  Users,
  Edit3,
  Trash2,
} from "lucide-react";
import { Escola, Paciente } from "../../types";

interface GestaoEscolasProps {
  escolas: Escola[];
  pacientes: Paciente[];
  onOpenNovaEscola: () => void;
  onEditarEscola: (escola: Escola) => void;
  onDeletarEscola: (id: string) => void;
}

export const GestaoEscolas: React.FC<GestaoEscolasProps> = ({
  escolas,
  pacientes,
  onOpenNovaEscola,
  onEditarEscola,
  onDeletarEscola,
}) => {
  const [busca, setBusca] = useState("");

  const escolasFiltradas = escolas.filter((e) => {
    const termo = busca.toLowerCase().trim();
    return (
      e.nome.toLowerCase().includes(termo) ||
      e.diretor.toLowerCase().includes(termo) ||
      e.coordenador.toLowerCase().includes(termo)
    );
  });

  const alunosPorEscola = (escolaId: string) =>
    pacientes.filter((p) => p.escolaId === escolaId).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-600" />
            Escolas Atendidas
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Cadastro das escolas, dias/horários de atendimento e alunos vinculados
          </p>
        </div>

        <button
          onClick={onOpenNovaEscola}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Escola</span>
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome da escola, diretor ou coordenador..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none"
        />
      </div>

      {escolasFiltradas.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
          Nenhuma escola cadastrada com os filtros aplicados.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {escolasFiltradas.map((escola) => (
            <div
              key={escola.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2.5 bg-teal-100 text-teal-700 rounded-xl shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-base truncate">
                      {escola.nome}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Diretor(a): <strong className="text-slate-700">{escola.diretor}</strong>
                    </p>
                    <p className="text-xs text-slate-500">
                      Coordenador(a): <strong className="text-slate-700">{escola.coordenador}</strong>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onEditarEscola(escola)}
                    title="Editar Escola"
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remover a escola "${escola.nome}"?`)) {
                        onDeletarEscola(escola.id);
                      }
                    }}
                    title="Excluir Escola"
                    className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{escola.telefone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {alunosPorEscola(escola.id)} aluno(s) em atendimento • {escola.numeroAlunos} matriculados
                  </span>
                </div>
                <div className="flex items-start gap-1.5 col-span-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <span>{escola.endereco}</span>
                </div>
                <div className="flex items-start gap-1.5 col-span-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <span>
                    {escola.diasAtendimento.join(", ")} • {escola.horarioAtendimento}
                  </span>
                </div>
              </div>

              {escola.observacoes && (
                <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                  {escola.observacoes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
