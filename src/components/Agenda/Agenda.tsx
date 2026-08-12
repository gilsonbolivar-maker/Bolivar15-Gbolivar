import React, { useState } from "react";
import {
  Calendar,
  Plus,
  Clock,
  MapPin,
  CheckCircle2,
  Circle,
  Edit3,
  Trash2,
} from "lucide-react";
import { Compromisso, Paciente, Escola, TipoCompromisso } from "../../types";

interface AgendaProps {
  compromissos: Compromisso[];
  pacientes: Paciente[];
  escolas: Escola[];
  onOpenNovoCompromisso: () => void;
  onEditarCompromisso: (compromisso: Compromisso) => void;
  onDeletarCompromisso: (id: string) => void;
  onAlternarConcluido: (id: string) => void;
}

const tipoCores: Record<TipoCompromisso, string> = {
  Atendimento: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Reunião: "bg-blue-100 text-blue-700 border-blue-200",
  "Visita à Escola": "bg-teal-100 text-teal-700 border-teal-200",
  Formação: "bg-purple-100 text-purple-700 border-purple-200",
  Devolutiva: "bg-amber-100 text-amber-700 border-amber-200",
  "Entrega de Relatório": "bg-slate-200 text-slate-700 border-slate-300",
};

export const Agenda: React.FC<AgendaProps> = ({
  compromissos,
  pacientes,
  escolas,
  onOpenNovoCompromisso,
  onEditarCompromisso,
  onDeletarCompromisso,
  onAlternarConcluido,
}) => {
  const [filtroTipo, setFiltroTipo] = useState<string>("TODOS");

  const nomePaciente = (id?: string) =>
    id ? pacientes.find((p) => p.id === id)?.nome : undefined;
  const nomeEscola = (id?: string) =>
    id ? escolas.find((e) => e.id === id)?.nome : undefined;

  const compromissosFiltrados = compromissos
    .filter((c) => filtroTipo === "TODOS" || c.tipo === filtroTipo)
    .sort((a, b) => (a.data + a.horaInicio).localeCompare(b.data + b.horaInicio));

  const tipos: TipoCompromisso[] = [
    "Atendimento",
    "Reunião",
    "Visita à Escola",
    "Formação",
    "Devolutiva",
    "Entrega de Relatório",
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-lilas-600" />
            Agenda de Compromissos
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Atendimentos, reuniões, visitas, formações e entregas agendadas
          </p>
        </div>

        <button
          onClick={onOpenNovoCompromisso}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-lilas-600 hover:bg-lilas-500 text-white text-xs font-semibold rounded-xl shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Compromisso</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFiltroTipo("TODOS")}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
            filtroTipo === "TODOS"
              ? "bg-slate-900 text-white border-slate-900"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
          }`}
        >
          Todos
        </button>
        {tipos.map((tipo) => (
          <button
            key={tipo}
            onClick={() => setFiltroTipo(tipo)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
              filtroTipo === tipo
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {tipo}
          </button>
        ))}
      </div>

      {compromissosFiltrados.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
          Nenhum compromisso agendado com os filtros aplicados.
        </div>
      ) : (
        <div className="space-y-2.5">
          {compromissosFiltrados.map((c) => (
            <div
              key={c.id}
              className={`bg-white rounded-2xl border shadow-sm p-4 flex items-start gap-3.5 transition-opacity ${
                c.concluido ? "opacity-60 border-slate-200" : "border-slate-200"
              }`}
            >
              <button onClick={() => onAlternarConcluido(c.id)} className="mt-0.5 shrink-0">
                {c.concluido ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3
                    className={`font-bold text-slate-900 text-sm ${
                      c.concluido ? "line-through text-slate-400" : ""
                    }`}
                  >
                    {c.titulo}
                  </h3>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${tipoCores[c.tipo]}`}
                  >
                    {c.tipo}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(c.data + "T00:00:00").toLocaleDateString("pt-BR", {
                      weekday: "short",
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {c.horaInicio} - {c.horaFim}
                  </span>
                  {c.local && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {c.local}
                    </span>
                  )}
                </div>

                {(nomePaciente(c.pacienteId) || nomeEscola(c.escolaId)) && (
                  <p className="text-xs text-slate-500 mt-1">
                    {nomePaciente(c.pacienteId) && (
                      <>
                        Aluno: <strong className="text-slate-700">{nomePaciente(c.pacienteId)}</strong>
                      </>
                    )}
                    {nomePaciente(c.pacienteId) && nomeEscola(c.escolaId) && " • "}
                    {nomeEscola(c.escolaId) && (
                      <>
                        Escola: <strong className="text-slate-700">{nomeEscola(c.escolaId)}</strong>
                      </>
                    )}
                  </p>
                )}

                {c.descricao && <p className="text-xs text-slate-500 mt-1">{c.descricao}</p>}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onEditarCompromisso(c)}
                  title="Editar Compromisso"
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Remover o compromisso "${c.titulo}"?`)) {
                      onDeletarCompromisso(c.id);
                    }
                  }}
                  title="Excluir Compromisso"
                  className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
