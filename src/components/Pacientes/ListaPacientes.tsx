import React, { useState } from "react";
import {
  Search,
  Filter,
  UserPlus,
  User,
  Phone,
  MapPin,
  ShieldAlert,
  FileText,
  UserCheck,
  Send,
  Edit3,
  Trash2,
  ChevronRight,
  Heart,
  Sparkles,
  UserCircle2,
} from "lucide-react";
import { Paciente } from "../../types";

interface ListaPacientesProps {
  pacientes: Paciente[];
  onOpenNovoPaciente: () => void;
  onOpenOcrScanner?: () => void;
  onEditarPaciente: (paciente: Paciente) => void;
  onDeletarPaciente: (id: string) => void;
  onVerProntuario: (paciente: Paciente) => void;
  onNovoAtendimento: (paciente: Paciente) => void;
  onNovoEncaminhamento: (paciente: Paciente) => void;
}

export const ListaPacientes: React.FC<ListaPacientesProps> = ({
  pacientes,
  onOpenNovoPaciente,
  onOpenOcrScanner,
  onEditarPaciente,
  onDeletarPaciente,
  onVerProntuario,
  onNovoAtendimento,
  onNovoEncaminhamento,
}) => {
  const [busca, setBusca] = useState("");
  const [vulnerabilidadeFiltro, setVulnerabilidadeFiltro] = useState("TODAS");

  const pacientesFiltrados = pacientes.filter((p) => {
    const termo = busca.toLowerCase().trim();
    const bateNomeOuCpf =
      p.nome.toLowerCase().includes(termo) ||
      p.cpf.toLowerCase().includes(termo) ||
      (p.nomeSocial && p.nomeSocial.toLowerCase().includes(termo)) ||
      p.bairro.toLowerCase().includes(termo);

    const bateVuln =
      vulnerabilidadeFiltro === "TODAS" ||
      p.vulnerabilidades.includes(vulnerabilidadeFiltro);

    return bateNomeOuCpf && bateVuln;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-verdep-600" />
            Cadastro Unificado de Alunos / Pacientes
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Prontuário único, mapa de vulnerabilidades sociais e histórico de acolhimentos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenOcrScanner || onOpenNovoPaciente}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>📷 Escanear Documento (IA)</span>
          </button>

          <button
            onClick={onOpenNovoPaciente}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-verdep-600 hover:bg-verdep-500 text-white text-xs font-semibold rounded-xl shadow transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar Aluno</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, CPF, nome social ou bairro..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-verdep-500 focus:border-verdep-500 outline-none"
          />
        </div>

        <div className="relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <select
            value={vulnerabilidadeFiltro}
            onChange={(e) => setVulnerabilidadeFiltro(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-verdep-500 focus:border-verdep-500 outline-none font-medium text-slate-700"
          >
            <option value="TODAS">Todas Vulnerabilidades</option>
            <option value="Baixa Renda">Baixa Renda</option>
            <option value="Idoso(a)">Idoso(a)</option>
            <option value="Gestante">Gestante</option>
            <option value="PCD (Pessoa com Deficiência)">PCD</option>
            <option value="Desemprego">Desemprego</option>
            <option value="Isolamento Social">Isolamento Social</option>
          </select>
        </div>
      </div>

      {/* Patients Table / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Aluno / Paciente</th>
                <th className="py-3.5 px-4">CPF & Cartão SUS</th>
                <th className="py-3.5 px-4">Contato & Bairro</th>
                <th className="py-3.5 px-4">Vulnerabilidades</th>
                <th className="py-3.5 px-4 text-right">Ações Rápida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {pacientesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Nenhum aluno localizado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                pacientesFiltrados.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="shrink-0 w-8 h-[42px] rounded-md overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                          {p.foto ? (
                            <img src={p.foto} alt={`Foto de ${p.nome}`} className="w-full h-full object-cover" />
                          ) : (
                            <UserCircle2 className="w-5 h-5 text-slate-300" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{p.nome}</div>
                          {p.nomeSocial && (
                            <span className="text-[11px] text-slate-500">
                              Nome social: {p.nomeSocial}
                            </span>
                          )}
                          <div className="text-[11px] text-slate-400">
                            Nasc: {new Date(p.dataNascimento).toLocaleDateString("pt-BR")} ({p.sexo})
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      <div>CPF: {p.cpf}</div>
                      <div className="text-[11px] text-slate-400">
                        SUS: {p.cartaoSus || "Não informado"}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1 font-medium text-slate-800">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {p.telefone}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {p.bairro}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {p.vulnerabilidades.map((v) => (
                          <span
                            key={v}
                            className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200/80 text-[10px] font-semibold rounded-md"
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onVerProntuario(p)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-verdep-50 hover:bg-verdep-100 text-verdep-700 text-xs font-semibold rounded-lg transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" /> Prontuário
                        </button>

                        <button
                          onClick={() => onNovoAtendimento(p)}
                          title="Iniciar Atendimento Individual"
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onNovoEncaminhamento(p)}
                          title="Emitir Encaminhamento"
                          className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onEditarPaciente(p)}
                          title="Editar Cadastro"
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (
                              confirm(
                                `Tem certeza que deseja remover o cadastro de ${p.nome}?`
                              )
                            ) {
                              onDeletarPaciente(p.id);
                            }
                          }}
                          title="Excluir Aluno"
                          className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
