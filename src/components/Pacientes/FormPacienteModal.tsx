import React, { useState, useEffect, useRef } from "react";
import { X, User, Phone, MapPin, ShieldAlert, Heart, Save, Sparkles, Camera, Image as ImageIcon, UserCircle2, Trash2 } from "lucide-react";
import { Paciente } from "../../types";
import { AiDocumentScannerModal, ExtractedDocumentData } from "../AiDocumentScannerModal";

/** Redimensiona/recorta a imagem para o formato retrato 3x4 e comprime em JPEG. */
function processarFoto3x4(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Falha ao ler o arquivo de imagem."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Arquivo não é uma imagem válida."));
      img.onload = () => {
        // Formato 3x4 (proporção 0.75 largura/altura), recorte central
        const targetRatio = 3 / 4;
        let sx = 0, sy = 0, sw = img.width, sh = img.height;
        const currentRatio = sw / sh;
        if (currentRatio > targetRatio) {
          sw = sh * targetRatio;
          sx = (img.width - sw) / 2;
        } else {
          sh = sw / targetRatio;
          sy = (img.height - sh) / 2;
        }
        const outW = 300;
        const outH = 400;
        const canvas = document.createElement("canvas");
        canvas.width = outW;
        canvas.height = outH;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Não foi possível processar a imagem."));
          return;
        }
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

interface FormPacienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePaciente: (paciente: Paciente) => void;
  pacienteParaEditar?: Paciente | null;
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
  onSavePaciente,
  pacienteParaEditar,
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
  const [foto, setFoto] = useState<string | undefined>(undefined);
  const [fotoErro, setFotoErro] = useState<string | null>(null);
  const fotoCameraInputRef = useRef<HTMLInputElement>(null);
  const fotoGaleriaInputRef = useRef<HTMLInputElement>(null);

  const handleFotoSelecionada = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setFotoErro(null);
    try {
      const dataUrl = await processarFoto3x4(file);
      setFoto(dataUrl);
    } catch (err) {
      setFotoErro(err instanceof Error ? err.message : "Não foi possível processar a foto.");
    }
  };

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
    if (pacienteParaEditar) {
      setNome(pacienteParaEditar.nome);
      setNomeSocial(pacienteParaEditar.nomeSocial || "");
      setCpf(pacienteParaEditar.cpf);
      setRg(pacienteParaEditar.rg || "");
      setCartaoSus(pacienteParaEditar.cartaoSus || "");
      setDataNascimento(pacienteParaEditar.dataNascimento);
      setSexo(pacienteParaEditar.sexo);
      setTelefone(pacienteParaEditar.telefone);
      setEmail(pacienteParaEditar.email || "");
      setEndereco(pacienteParaEditar.endereco);
      setBairro(pacienteParaEditar.bairro);
      setCidade(pacienteParaEditar.cidade);
      setNomeMae(pacienteParaEditar.nomeMae || "");
      setProfissoes(pacienteParaEditar.profissoes || "");
      setObservacoesAlergias(pacienteParaEditar.observacoesAlergias || "");
      setVulnerabilidades(pacienteParaEditar.vulnerabilidades || []);
      setBeneficiosSociais(pacienteParaEditar.beneficiosSociais || []);
      setFoto(pacienteParaEditar.foto);
      setFotoErro(null);
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
      setFoto(undefined);
      setFotoErro(null);
    }
  }, [pacienteParaEditar, isOpen]);

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
      alert("Por favor, informe pelo menos o Nome e o CPF do aluno.");
      return;
    }

    const novoPaciente: Paciente = {
      id: pacienteParaEditar ? pacienteParaEditar.id : `pac-${Date.now()}`,
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
      foto,
      dataCadastro: pacienteParaEditar
        ? pacienteParaEditar.dataCadastro
        : new Date().toISOString().split("T")[0],
    };

    onSavePaciente(novoPaciente);
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
                {pacienteParaEditar ? "Editar Ficha de Aluno" : "Cadastrar Novo Aluno / Paciente"}
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

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {/* Foto 3x4 */}
              <div className="shrink-0 flex flex-col items-center gap-2">
                <div className="relative w-[90px] h-[120px] rounded-lg overflow-hidden border-2 border-slate-300 bg-slate-50 flex items-center justify-center shadow-xs">
                  {foto ? (
                    <img src={foto} alt="Foto 3x4 do aluno" className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle2 className="w-12 h-12 text-slate-300" />
                  )}
                  {foto && (
                    <button
                      type="button"
                      onClick={() => setFoto(undefined)}
                      title="Remover foto"
                      className="absolute top-1 right-1 p-1 bg-rose-600/90 hover:bg-rose-600 text-white rounded-md shadow"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 w-[90px]">
                  <button
                    type="button"
                    onClick={() => fotoCameraInputRef.current?.click()}
                    className="inline-flex items-center justify-center gap-1 px-1.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-lg shadow-xs transition-colors"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Tirar Foto</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fotoGaleriaInputRef.current?.click()}
                    className="inline-flex items-center justify-center gap-1 px-1.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg shadow-xs transition-colors"
                  >
                    <ImageIcon className="w-3 h-3" />
                    <span>Galeria</span>
                  </button>
                  <input
                    ref={fotoCameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="user"
                    className="hidden"
                    onChange={handleFotoSelecionada}
                  />
                  <input
                    ref={fotoGaleriaInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFotoSelecionada}
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Tire uma foto 3x4 do aluno (ou selecione da galeria) para identificação na ficha.
                  A imagem é recortada automaticamente no formato retrato.
                </p>
                {fotoErro && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">{fotoErro}</p>
                )}
              </div>
            </div>

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
              <span>{pacienteParaEditar ? "Salvar Alterações" : "Cadastrar Aluno"}</span>
            </button>
          </div>
        </form>
      </div>

      <AiDocumentScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        targetFormName="Ficha do Aluno / Paciente"
        onDataExtracted={handleDataExtracted}
      />
    </div>
  );
};
