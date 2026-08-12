import React, { useState, useEffect } from "react";
import { X, User, Phone, MapPin, ShieldAlert, Heart, Save, Sparkles, Camera } from "lucide-react";
import { Paciente } from "../../types";
import { AiDocumentScannerModal, ExtractedDocumentData } from "../AiDocumentScannerModal";

interface FormPacienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (paciente: Paciente) => void;
  pacienteEditar?: Paciente | null;
}

const VULNERABILIDADES_OPCOES = [
  "Baixa Renda",
  "Idoso(a)",
  "Gestante",
  "PCD (Pessoa com Deficiência)",
  "Isolamento Social",
  "Desemprego",
  "Pessoa em Situação de Rua",
  "Violência Doméstica / Ameaça",
  "Uso de Substâncias Psicoativas",
  "Sobrecarga Emocional",
];

const BENEFICIOS_OPCOES = [
  "Bolsa Família",
  "BPC / LOAS",
  "Tarifa Social de Energia",
  "Auxílio Gás",
  "Aluguel Social",
];

export const FormPacienteModal: React.FC<FormPacienteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  pacienteEditar,
}) => {
  const [nome, setNome] = useState("");
  const [nomeSocial, setNomeSocial] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [cartaoSus, setCartaoSus] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState<"Masculino" | "Feminino" | "Outro">("Feminino");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("São Paulo - SP");
  const [nomeMae, setNomeMae] = useState("");
  const [profissoes, setProfissoes] = useState("");
  const [observacoesAlergias, setObservacoesAlergias] = useState("");
  const [vulnerabilidades, setVulnerabilidades] = useState<string[]>([]);
  const [beneficiosSociais, setBeneficiosSociais] = useState<string[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleDataExtracted = (data: ExtractedDocumentData) => {
    if (data.nome) setNome(data.nome);
    if (data.nomeSocial) setNomeSocial(data.nomeSocial);
    if (data.cpf) setCpf(data.cpf);
    if (data.rg) setRg(data.rg);
    if (data.cartaoSus) setCartaoSus(data.cartaoSus);
    if (data.dataNascimento) setDataNascimento(data.dataNascimento);
    if (data.sexo && ["Masculino", "Feminino", "Outro"].includes(data.sexo)) {
      setSexo(data.sexo as any);
    }
    if (data.telefone) setTelefone(data.telefone);
    if (data.email) setEmail(data.email);
    if (data.endereco) setEndereco(data.endereco);
    if (data.bairro) setBairro(data.bairro);
    if (data.cidade) setCidade(data.cidade);
    if (data.nomeMae) setNomeMae(data.nomeMae);
    if (data.profissoes) setProfissoes(data.profissoes);
    if (data.observacoesAlergias) setObservacoesAlergias(data.observacoesAlergias);

    if (data.vulnerabilidades && data.vulnerabilidades.length > 0) {
      // Merge unique
      setVulnerabilidades((prev) => Array.from(new Set([...prev, ...data.vulnerabilidades!])));
    }
    if (data.beneficiosSociais && data.beneficiosSociais.length > 0) {
      setBeneficiosSociais((prev) => Array.from(new Set([...prev, ...data.beneficiosSociais!])));
    }
  };

  useEffect(() => {
    if (pacienteEditar) {
      setNome(pacienteEditar.nome);
      setNomeSocial(pacienteEditar.nomeSocial || "");
      setCpf(pacienteEditar.cpf);
      setRg(pacienteEditar.rg || "");
      setCartaoSus(pacienteEditar.cartaoSus || "");
      setDataNascimento(pacienteEditar.dataNascimento);
      setSexo(pacienteEditar.sexo);
      setTelefone(pacienteEditar.telefone);
      setEmail(pacienteEditar.email || "");
      setEndereco(pacienteEditar.endereco);
      setBairro(pacienteEditar.bairro);
      setCidade(pacienteEditar.cidade);
      setNomeMae(pacienteEditar.nomeMae || "");
      setProfissoes(pacienteEditar.profissoes || "");
      setObservacoesAlergias(pacienteEditar.observacoesAlergias || "");
      setVulnerabilidades(pacienteEditar.vulnerabilidades || []);
      setBeneficiosSociais(pacienteEditar.beneficiosSociais || []);
    } else {
      setNome("");
      setNomeSocial("");
      setCpf("");
      setRg("");
      setCartaoSus("");
      setDataNascimento("");
      setSexo("Feminino");
      setTelefone("");
      setEmail("");
      setEndereco("");
      setBairro("");
      setCidade("São Paulo - SP");
      setNomeMae("");
      setProfissoes("");
      setObservacoesAlergias("");
      setVulnerabilidades([]);
      setBeneficiosSociais([]);
    }
  }, [pacienteEditar, isOpen]);

  if (!isOpen) return null;

  const toggleVulnerabilidade = (item: string) => {
    setVulnerabilidades((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleBeneficio = (item: string) => {
    setBeneficiosSociais((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !cpf.trim()) {
      alert("Por favor, informe pelo menos o Nome e o CPF do cidadão.");
      return;
    }

    const novoPaciente: Paciente = {
      id: pacienteEditar ? pacienteEditar.id : `pac-${Date.now()}`,
      nome: nome.trim(),
      nomeSocial: nomeSocial.trim() || undefined,
      cpf: cpf.trim(),
      rg: rg.trim() || undefined,
      cartaoSus: cartaoSus.trim() || undefined,
      dataNascimento: dataNascimento || "1990-01-01",
      sexo,
      telefone: telefone.trim(),
      email: email.trim() || undefined,
      endereco: endereco.trim(),
      bairro: bairro.trim(),
      cidade: cidade.trim(),
      nomeMae: nomeMae.trim() || undefined,
      profissoes: profissoes.trim() || undefined,
      observacoesAlergias: observacoesAlergias.trim() || undefined,
      vulnerabilidades,
      beneficiosSociais,
      dataCadastro: pacienteEditar
        ? pacienteEditar.dataCadastro
        : new Date().toISOString().split("T")[0],
    };

    onSave(novoPaciente);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">
                {pacienteEditar ? "Editar Ficha de Cidadão" : "Cadastrar Novo Cidadão / Paciente"}
              </h3>
              <p className="text-xs text-slate-400">
                Acolhimento de dados pessoais, vulnerabilidades e benefícios
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Banner de Preenchimento com IA */}
          <div className="p-3.5 bg-gradient-to-r from-indigo-50 via-emerald-50 to-indigo-50 border border-indigo-200/80 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-xs block">
                  Preencher Ficha com Leitura de IA
                </span>
                <p className="text-[11px] text-slate-600">
                  Tire foto de RG, CPF, Cartão SUS ou papel e a IA preenche os campos.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5 shrink-0"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Escanear Papel</span>
            </button>
          </div>

          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Identificação e Contato
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Maria Oliveira da Silva"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome Social (se houver)
                </label>
                <input
                  type="text"
                  value={nomeSocial}
                  onChange={(e) => setNomeSocial(e.target.value)}
                  placeholder="Ex: Maria Silva"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CPF *
                </label>
                <input
                  type="text"
                  required
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cartão SUS
                </label>
                <input
                  type="text"
                  value={cartaoSus}
                  onChange={(e) => setCartaoSus(e.target.value)}
                  placeholder="700000000000000"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sexo / Gênero
                </label>
                <select
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                >
                  <option value="Feminino">Feminino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Telefone / WhatsApp
                </label>
                <input
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(11) 90000-0000"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome da Mãe
                </label>
                <input
                  type="text"
                  value={nomeMae}
                  onChange={(e) => setNomeMae(e.target.value)}
                  placeholder="Nome completo da mãe"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4 pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Endereço e Localização
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Endereço (Rua, Número, Apto)
                </label>
                <input
                  type="text"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Ex: Rua das Flores, 123"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bairro
                </label>
                <input
                  type="text"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  placeholder="Ex: Jardim Primavera"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Vulnerabilidades e Benefícios */}
          <div className="space-y-4 pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" /> Vulnerabilidades e Condições Sociais
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Selecione as vulnerabilidades identificadas:
              </label>
              <div className="flex flex-wrap gap-2">
                {VULNERABILIDADES_OPCOES.map((vuln) => {
                  const selected = vulnerabilidades.includes(vuln);
                  return (
                    <button
                      type="button"
                      key={vuln}
                      onClick={() => toggleVulnerabilidade(vuln)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
                        selected
                          ? "bg-rose-50 text-rose-700 border-rose-300 font-semibold"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {selected ? "✓ " : "+ "}
                      {vuln}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Benefícios Sociais Ativos:
              </label>
              <div className="flex flex-wrap gap-2">
                {BENEFICIOS_OPCOES.map((ben) => {
                  const selected = beneficiosSociais.includes(ben);
                  return (
                    <button
                      type="button"
                      key={ben}
                      onClick={() => toggleBeneficio(ben)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
                        selected
                          ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {selected ? "✓ " : "+ "}
                      {ben}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Observações Clínicas / Alergias / Medicamentos
              </label>
              <textarea
                rows={2}
                value={observacoesAlergias}
                onChange={(e) => setObservacoesAlergias(e.target.value)}
                placeholder="Ex: Hipertensa em uso de Captopril. Alergia a Penicilina."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Buttons */}
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
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{pacienteEditar ? "Salvar Alterações" : "Cadastrar Cidadão"}</span>
            </button>
          </div>
        </form>
      </div>

      <AiDocumentScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        targetFormName="Ficha do Cidadão / Paciente"
        onDataExtracted={handleDataExtracted}
      />
    </div>
  );
};
