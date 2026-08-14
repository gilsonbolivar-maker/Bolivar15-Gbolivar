import React, { useState, useRef, useEffect } from 'react';
import { FaceMapPoint, ProductType, InjectionDepth, InjectionTool } from '../types';
import { FemaleFaceModel } from './face-models/FemaleFaceModel';
import { MaleFaceModel } from './face-models/MaleFaceModel';
import { AnatomicalOverlay, LandmarkDot } from './face-models/AnatomicalOverlay';
import {
  Trash2,
  Shield,
  Sparkles,
  AlertCircle,
  RotateCcw,
  Sliders,
  Layers,
  Upload,
  User,
  CheckCircle2,
  Download,
  Info,
  Maximize2,
  Search,
  X,
  Check
} from 'lucide-react';

interface FaceMapStudioProps {
  points: FaceMapPoint[];
  onChangePoints: (points: FaceMapPoint[]) => void;
  patientName?: string;
  patientGender?: 'Feminino' | 'Masculino' | 'Outro' | string;
  readOnly?: boolean;
}

const PRODUCT_COLORS: Record<ProductType, { bg: string; border: string; text: string; label: string; pinBg: string }> = {
  botox: {
    bg: 'bg-purple-50',
    border: 'border-purple-300',
    text: 'text-purple-700',
    label: 'Toxina Botulínica (Botox)',
    pinBg: '#7c3aed'
  },
  acido_hialuronico: {
    bg: 'bg-rose-50',
    border: 'border-rose-300',
    text: 'text-rose-700',
    label: 'Ácido Hialurônico',
    pinBg: '#e11d48'
  },
  bioestimulador: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    text: 'text-emerald-700',
    label: 'Bioestimulador (PLLA/CaHA)',
    pinBg: '#059669'
  },
  fios_pdo: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-700',
    label: 'Fios PDO',
    pinBg: '#d97706'
  },
  enzima: {
    bg: 'bg-cyan-50',
    border: 'border-cyan-300',
    text: 'text-cyan-700',
    label: 'Enzima / Lipo de Papada',
    pinBg: '#0891b2'
  }
};

export const FaceMapStudio: React.FC<FaceMapStudioProps> = ({
  points = [],
  onChangePoints,
  patientName = "Paciente",
  patientGender = "Feminino",
  readOnly = false
}) => {
  const safePoints = Array.isArray(points) ? points : [];
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Model Selection & Overlays
  const [modelGender, setModelGender] = useState<'feminino' | 'masculino'>(
    patientGender?.toLowerCase().includes('masc') ? 'masculino' : 'feminino'
  );
  const [showGuidelines, setShowGuidelines] = useState<boolean>(true);
  const [showLandmarks, setShowLandmarks] = useState<boolean>(true);
  const [modelOpacity, setModelOpacity] = useState<number>(100);
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(null);

  // Point Selection & Active Tool Setup
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [hoveredLandmarkId, setHoveredLandmarkId] = useState<string | null>(null);
  const [filterProduct, setFilterProduct] = useState<ProductType | 'todos'>('todos');
  const [activeProductType, setActiveProductType] = useState<ProductType>('botox');
  const [activeDose, setActiveDose] = useState<number>(4);
  const [activeDepth, setActiveDepth] = useState<InjectionDepth>('intradermico');
  const [activeTool, setActiveTool] = useState<InjectionTool>('agulha_32g');
  const [activeLot, setActiveLot] = useState<string>('BTX-LOTE-2025');
  const [showPresets, setShowPresets] = useState<boolean>(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  useEffect(() => {
    if (patientGender) {
      setModelGender(patientGender.toLowerCase().includes('masc') ? 'masculino' : 'feminino');
    }
  }, [patientGender]);

  // Flash notification helper
  const notify = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  // Totals calculations
  const totalBotox = safePoints
    .filter(p => p.productType === 'botox')
    .reduce((sum, p) => sum + (p.doseValue || 0), 0);

  const totalFiller = safePoints
    .filter(p => p.productType === 'acido_hialuronico')
    .reduce((sum, p) => sum + (p.doseValue || 0), 0);

  const totalBio = safePoints
    .filter(p => p.productType === 'bioestimulador')
    .reduce((sum, p) => sum + (p.doseValue || 0), 0);

  const totalThreads = safePoints
    .filter(p => p.productType === 'fios_pdo')
    .reduce((sum, p) => sum + (p.doseValue || 0), 0);

  const addPointAtCoords = (clientX: number, clientY: number, targetSvg: SVGSVGElement) => {
    if (readOnly) return;
    const rect = targetSvg.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100)));
    const y = Math.max(0, Math.min(100, Math.round(((clientY - rect.top) / rect.height) * 100)));

    // Auto-detect approximate anatomical region name
    let zoneName = "Ponto Facial";
    if (y < 25) zoneName = "Músculo Frontal";
    else if (y < 35 && x > 40 && x < 60) zoneName = "Glabela / Prócero";
    else if (y < 42 && (x < 32 || x > 68)) zoneName = "Orbicular (Pés de Galinha)";
    else if (y >= 40 && y < 55 && (x < 38 || x > 62)) zoneName = "Malar / Zigomático";
    else if (y >= 45 && y < 65 && x >= 38 && x <= 62) zoneName = "Rinomodelação / Sulco";
    else if (y >= 68 && y <= 80 && x >= 38 && x <= 62) zoneName = "Lábios / Vermelhão";
    else if (y > 78 && x >= 40 && x <= 60) zoneName = "Mento / Queixo";
    else if (y >= 65 && (x < 35 || x > 65)) zoneName = "Masseter / Ângulo Mandibular";
    else if (y > 85) zoneName = "Submento / Platisma";

    const defaultProductName =
      activeProductType === 'botox' ? 'Botox® Allergan 100U' :
      activeProductType === 'acido_hialuronico' ? 'Juvederm® / Restylane® 1ml' :
      activeProductType === 'bioestimulador' ? 'Sculptra® PLLA' :
      activeProductType === 'fios_pdo' ? 'Fio PDO Moldado i-Thread' : 'Ácido Desoxicólico 10mg/ml';

    const defaultUnit =
      activeProductType === 'botox' ? 'U' :
      activeProductType === 'acido_hialuronico' ? 'ml' :
      activeProductType === 'bioestimulador' ? 'ml' :
      activeProductType === 'fios_pdo' ? 'fios' : 'mg';

    const newPoint: FaceMapPoint = {
      id: `pt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      zone: zoneName,
      label: `${zoneName} #${safePoints.length + 1}`,
      x,
      y,
      productType: activeProductType,
      productName: defaultProductName,
      doseValue: activeDose,
      doseUnit: defaultUnit,
      depth: activeDepth,
      tool: activeTool,
      lotNumber: activeLot,
      createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [...safePoints, newPoint];
    onChangePoints(updated);
    setSelectedPointId(newPoint.id);
    notify(`Ponto ${newPoint.label} marcado`);
  };

  // Convert an anatomical landmark into an active injection point with 1 click
  const handleSelectLandmark = (landmark: LandmarkDot) => {
    if (readOnly) return;
    const defaultProductName =
      activeProductType === 'botox' ? 'Botox® Allergan 100U' :
      activeProductType === 'acido_hialuronico' ? 'Juvederm® / Restylane® 1ml' :
      activeProductType === 'bioestimulador' ? 'Sculptra® PLLA' :
      activeProductType === 'fios_pdo' ? 'Fio PDO Moldado i-Thread' : 'Ácido Desoxicólico 10mg/ml';

    const defaultUnit =
      activeProductType === 'botox' ? 'U' :
      activeProductType === 'acido_hialuronico' ? 'ml' :
      activeProductType === 'bioestimulador' ? 'ml' :
      activeProductType === 'fios_pdo' ? 'fios' : 'mg';

    const newPoint: FaceMapPoint = {
      id: `pt-lm-${Date.now()}`,
      zone: landmark.name,
      label: landmark.name,
      x: landmark.x,
      y: landmark.y,
      productType: activeProductType,
      productName: defaultProductName,
      doseValue: activeDose,
      doseUnit: defaultUnit,
      depth: activeDepth,
      tool: activeTool,
      lotNumber: activeLot,
      notes: `Ponto anatômico padronizado: ${landmark.category}`,
      createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    onChangePoints([...safePoints, newPoint]);
    setSelectedPointId(newPoint.id);
    notify(`Injeção registrada em: ${landmark.name}`);
  };

  const handleFaceClick = (e: React.MouseEvent<SVGSVGElement>) => {
    addPointAtCoords(e.clientX, e.clientY, e.currentTarget);
  };

  const handleFaceTouch = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0];
      addPointAtCoords(touch.clientX, touch.clientY, e.currentTarget);
    }
  };

  const handleUpdatePoint = (id: string, updates: Partial<FaceMapPoint>) => {
    const updated = safePoints.map(p => p.id === id ? { ...p, ...updates } : p);
    onChangePoints(updated);
  };

  const handleDeletePoint = (id: string) => {
    const updated = safePoints.filter(p => p.id !== id);
    onChangePoints(updated);
    if (selectedPointId === id) setSelectedPointId(null);
    notify("Ponto removido.");
  };

  const handleClearPoints = () => {
    if (confirm("Tem certeza que deseja limpar todos os pontos marcados deste mapa facial?")) {
      onChangePoints([]);
      setSelectedPointId(null);
      notify("Mapa facial reinicializado.");
    }
  };

  // Upload patient real photo
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomPhotoUrl(event.target?.result as string);
        notify("Foto do paciente carregada no studio.");
      };
      reader.readAsDataURL(file);
    }
  };

  // Presets & Protocol Center
  const [showPresetsModal, setShowPresetsModal] = useState<boolean>(false);
  const [presetSearch, setPresetSearch] = useState<string>('');
  const [presetCategory, setPresetCategory] = useState<string>('todos');
  const [presetMode, setPresetMode] = useState<'replace' | 'append'>('append');

  type ClinicalPresetKey =
    | 'botox_full'
    | 'botox_masseter'
    | 'botox_nefertiti'
    | 'harmonizacao_full'
    | 'harmonizacao_masculina'
    | 'lip_filler'
    | 'bioestimulador_full'
    | 'fox_eyes'
    | 'rinomodelacao';

  interface ClinicalPresetDef {
    id: ClinicalPresetKey;
    title: string;
    category: 'botox' | 'acido_hialuronico' | 'bioestimulador' | 'fios_pdo' | 'combinado';
    pointsCount: number;
    doseSummary: string;
    description: string;
    targetAreas: string[];
    tag: string;
  }

  const PROTOCOL_CATALOG: ClinicalPresetDef[] = [
    {
      id: 'botox_full',
      title: 'Botox Full Face Tradicional',
      category: 'botox',
      pointsCount: 10,
      doseSummary: '34 U',
      description: 'Bloqueio dinâmico completo do terço superior: músculo frontal, complexo glabelar (prócero e corrugadores) e orbicular dos olhos bilateral.',
      targetAreas: ['Frontal', 'Glabela', 'Prócero', 'Pés de Galinha'],
      tag: 'Mais Utilizado'
    },
    {
      id: 'botox_masseter',
      title: 'Botox Masseter & Bruxismo',
      category: 'botox',
      pointsCount: 6,
      doseSummary: '60 U',
      description: 'Aplicação intramuscular profunda nos pontos de segurança do feixe superficial e profundo do masseter para afinamento e alívio do bruxismo.',
      targetAreas: ['Masseter Superior', 'Masseter Médio', 'Ângulo Mandibular'],
      tag: 'Terapêutico & Estético'
    },
    {
      id: 'botox_nefertiti',
      title: 'Nefertiti Lift / Platisma & Mandíbula',
      category: 'botox',
      pointsCount: 8,
      doseSummary: '24 U',
      description: 'Tratamento das bandas platismais e borda inferior mandibular para reposicionamento e relaxamento dos depressores cervicais.',
      targetAreas: ['Borda Mandibular', 'Bandas Platismais Mediais', 'Bandas Laterais'],
      tag: 'Efeito Lifting'
    },
    {
      id: 'harmonizacao_full',
      title: 'Harmonização Facial MD Codes Clássica',
      category: 'acido_hialuronico',
      pointsCount: 5,
      doseSummary: '3.6 ml',
      description: 'Pilares de sustentação zigomática (CK1/CK2), refinamento do sulco nasogeniano com cânula e projeção mentoniana anterior.',
      targetAreas: ['Malar Zigomático', 'Sulco Nasogeniano', 'Ápice do Mento'],
      tag: 'Estruturação'
    },
    {
      id: 'harmonizacao_masculina',
      title: 'Mandíbula & Mento Masculinização',
      category: 'acido_hialuronico',
      pointsCount: 6,
      doseSummary: '4.0 ml',
      description: 'Definição do contorno goníaco, ângulo mandibular de 90 graus e alargamento e projeção do queixo quadrado masculino.',
      targetAreas: ['Ângulos Mandibulares D/E', 'Ramo Mandibular', 'Mento Quadrado'],
      tag: 'Perfil Masculino'
    },
    {
      id: 'lip_filler',
      title: 'Preenchimento Labial Russo (Russian Lips)',
      category: 'acido_hialuronico',
      pointsCount: 4,
      doseSummary: '1.0 ml',
      description: 'Eversão e projeção vertical do vermelhão, definição das cristas do filtro/arco do cupido e volume harmônico dos tubérculos inferiores.',
      targetAreas: ['Arco do Cupido D/E', 'Tubérculo Inferior D/E'],
      tag: 'Lábios Naturais'
    },
    {
      id: 'bioestimulador_full',
      title: 'Bioestimulador PLLA / Sculptra em Leque',
      category: 'bioestimulador',
      pointsCount: 6,
      doseSummary: '16.0 ml (2 frascos)',
      description: 'Vetores subdérmicos em retroinjeção leque para neocolagênese tipo I/III, reposicionamento tecidual e espessamento dérmico.',
      targetAreas: ['Malar Lateral', 'Ângulo Pré-Auricular', 'Sulco Pré-Jowl'],
      tag: 'Colágeno & Firmeza'
    },
    {
      id: 'fox_eyes',
      title: 'Fox Eyes & Arquear Sobrancelhas',
      category: 'combinado',
      pointsCount: 4,
      doseSummary: '6 U + Fios',
      description: 'Paralisia suave da cauda lateral do orbicular superior combinada com ancoragem de fios de tração no polo temporal.',
      targetAreas: ['Cauda da Sobrancelha D/E', 'Fáscia Temporal D/E'],
      tag: 'Elevação do Olhar'
    },
    {
      id: 'rinomodelacao',
      title: 'Rinomodelação & Tip Lift (Ponta Nasal)',
      category: 'combinado',
      pointsCount: 4,
      doseSummary: '0.6 ml + 2 U',
      description: 'Retificação do dorso nasal com ácido hialurônico de alta viscosidade e relaxamento do depressor do septo nasal com toxina.',
      targetAreas: ['Dorso Nasal Médio', 'Ponta Nasal (Tip Lift)', 'Depressor do Septo'],
      tag: 'Harmonia do Perfil'
    }
  ];

  const applyPreset = (presetType: ClinicalPresetKey, mode: 'replace' | 'append' = presetMode) => {
    let presetPoints: FaceMapPoint[] = [];

    if (presetType === 'botox_full') {
      presetPoints = [
        { id: `p1-${Date.now()}`, zone: 'Frontal Superior Central', label: 'Frontal 1', x: 50, y: 12, productType: 'botox', productName: 'Botox® Allergan 100U', doseValue: 4, doseUnit: 'U', depth: 'intradermico', tool: 'agulha_32g', lotNumber: activeLot },
        { id: `p2-${Date.now()}`, zone: 'Frontal Paramediano D', label: 'Frontal 2', x: 38, y: 15, productType: 'botox', productName: 'Botox® Allergan 100U', doseValue: 3, doseUnit: 'U', depth: 'intradermico', tool: 'agulha_32g', lotNumber: activeLot },
        { id: `p3-${Date.now()}`, zone: 'Frontal Paramediano E', label: 'Frontal 3', x: 62, y: 15, productType: 'botox', productName: 'Botox® Allergan 100U', doseValue: 3, doseUnit: 'U', depth: 'intradermico', tool: 'agulha_32g', lotNumber: activeLot },
        { id: `p4-${Date.now()}`, zone: 'Prócero Central', label: 'Prócero', x: 50, y: 30, productType: 'botox', productName: 'Botox® Allergan 100U', doseValue: 4, doseUnit: 'U', depth: 'muscular', tool: 'agulha_32g', lotNumber: activeLot },
        { id: `p5-${Date.now()}`, zone: 'Corrugador Medial D', label: 'Corrugador D', x: 44, y: 34, productType: 'botox', productName: 'Botox® Allergan 100U', doseValue: 5, doseUnit: 'U', depth: 'muscular', tool: 'agulha_32g', lotNumber: activeLot },
        { id: `p6-${Date.now()}`, zone: 'Corrugador Medial E', label: 'Corrugador E', x: 56, y: 34, productType: 'botox', productName: 'Botox® Allergan 100U', doseValue: 5, doseUnit: 'U', depth: 'muscular', tool: 'agulha_32g', lotNumber: activeLot },
        { id: `p7-${Date.now()}`, zone: 'Orbicular Lateral D1', label: 'Orbicular D1', x: 20, y: 38, productType: 'botox', productName: 'Botox® Allergan 100U', doseValue: 3, doseUnit: 'U', depth: 'intradermico', tool: 'agulha_32g', lotNumber: activeLot },
        { id: `p8-${Date.now()}`, zone: 'Orbicular Lateral D2', label: 'Orbicular D2', x: 23, y: 44, productType: 'botox', productName: 'Botox® Allergan 100U', doseValue: 2, doseUnit: 'U', depth: 'intradermico', tool: 'agulha_32g', lotNumber: activeLot },
        { id: `p9-${Date.now()}`, zone: 'Orbicular Lateral E1', label: 'Orbicular E1', x: 80, y: 38, productType: 'botox', productName: 'Botox® Allergan 100U', doseValue: 3, doseUnit: 'U', depth: 'intradermico', tool: 'agulha_32g', lotNumber: activeLot },
        { id: `p10-${Date.now()}`, zone: 'Orbicular Lateral E2', label: 'Orbicular E2', x: 77, y: 44, productType: 'botox', productName: 'Botox® Allergan 100U', doseValue: 2, doseUnit: 'U', depth: 'intradermico', tool: 'agulha_32g', lotNumber: activeLot }
      ];
    } else if (presetType === 'botox_masseter') {
      presetPoints = [
        { id: `pm1-${Date.now()}`, zone: 'Masseter D Superior', label: 'Masseter D1', x: 26, y: 64, productType: 'botox', productName: 'Botox® Allergan 100U', doseValue: 10, doseUnit: 'U', depth: 'muscular', tool: 'agulha_30g', lotNumber: activeLot },
        { id: `pm2-${Date.now()}`, zone: 'Masseter D Médio', label: 'Masseter D2', x: 24, y: 70, productType: 'botox', productName: 'Botox® Allergan 100U', doseValue: 10, doseUnit: 'U', depth: 'muscular', tool: 'agulha_30g', lotNumber: activeLot },
        { id: `pm3-${Date.now()}`, zone: 'Masseter D Ângulo', label: 'Masseter D3', x: 28, y: 76, productType: 'botox', productName: 'Botox® Allergan 100U', doseValue: 10, doseUnit: 'U', depth: 'muscular', tool: 'agulha_30g', lotNumber: activeLot },
        { id: `pm4-${Date.now()}`, zone: 'Masseter E Superior', label: 'Masseter E1', x: 74, y: 64, productType: 'botox', productName: 'Botox® Allergan 100U', doseValue: 10, doseUnit: 'U', depth: 'muscular', tool: 'agulha_30g', lotNumber: activeLot },
        { id: `pm5-${Date.now()}`, zone: 'Masseter E Médio', label: 'Masseter E2', x: 76, y: 70, productType: 'botox', productName: 'Botox® Allergan 100U', doseValue: 10, doseUnit: 'U', depth: 'muscular', tool: 'agulha_30g', lotNumber: activeLot },
        { id: `pm6-${Date.now()}`, zone: 'Masseter E Ângulo', label: 'Masseter E3', x: 72, y: 76, productType: 'botox', productName: 'Botox® Allergan 100U', doseValue: 10, doseUnit: 'U', depth: 'muscular', tool: 'agulha_30g', lotNumber: activeLot }
      ];
    } else if (presetType === 'botox_nefertiti') {
      presetPoints = [
        { id: `pn1-${Date.now()}`, zone: 'Borda Mandibular D', label: 'Mandíbula D', x: 30, y: 78, productType: 'botox', productName: 'Botox® Allergan 100U', doseValue: 3, doseUnit: 'U', depth: 'intradermico', tool: 'agulha_32g', lotNumber: activeLot },
        { id: `pn2-${Date.now()}`, zone: 'Borda Mandibular E', label: 'Mandíbula E', x: 70, y: 78, productType: 'botox', productName: 'Botox® Allergan 100U', doseValue: 3, doseUnit: 'U', depth: 'intradermico', tool: 'agulha_32g', lotNumber: activeLot },
        { id: `pn3-${Date.now()}`, zone: 'Platisma Lateral D', label: 'Platisma Lat D', x: 33, y: 92, productType: 'botox', productName: 'Botox® Allergan 100U', doseValue: 3, doseUnit: 'U', depth: 'intradermico', tool: 'agulha_32g', lotNumber: activeLot },
        { id: `pn4-${Date.now()}`, zone: 'Platisma Medial D', label: 'Platisma Med D', x: 43, y: 94, productType: 'botox', productName: 'Botox® Allergan 100U', doseValue: 3, doseUnit: 'U', depth: 'intradermico', tool: 'agulha_32g', lotNumber: activeLot },
        { id: `pn5-${Date.now()}`, zone: 'Platisma Medial E', label: 'Platisma Med E', x: 57, y: 94, productType: 'botox', productName: 'Botox® Allergan 100U', doseValue: 3, doseUnit: 'U', depth: 'intradermico', tool: 'agulha_32g', lotNumber: activeLot },
        { id: `pn6-${Date.now()}`, zone: 'Platisma Lateral E', label: 'Platisma Lat E', x: 67, y: 92, productType: 'botox', productName: 'Botox® Allergan 100U', doseValue: 3, doseUnit: 'U', depth: 'intradermico', tool: 'agulha_32g', lotNumber: activeLot },
        { id: `pn7-${Date.now()}`, zone: 'DAO / Canto Labial D', label: 'DAO D', x: 35, y: 75, productType: 'botox', productName: 'Botox® Allergan 100U', doseValue: 3, doseUnit: 'U', depth: 'intradermico', tool: 'agulha_32g', lotNumber: activeLot },
        { id: `pn8-${Date.now()}`, zone: 'DAO / Canto Labial E', label: 'DAO E', x: 65, y: 75, productType: 'botox', productName: 'Botox® Allergan 100U', doseValue: 3, doseUnit: 'U', depth: 'intradermico', tool: 'agulha_32g', lotNumber: activeLot }
      ];
    } else if (presetType === 'harmonizacao_full') {
      presetPoints = [
        { id: `ph1-${Date.now()}`, zone: 'Malar D (CK1 Sustentação)', label: 'Malar D', x: 32, y: 59, productType: 'acido_hialuronico', productName: 'Juvederm® Voluma 1ml', doseValue: 0.8, doseUnit: 'ml', depth: 'supraperiosteal', tool: 'canula_22g', lotNumber: 'JUV-VOL-119' },
        { id: `ph2-${Date.now()}`, zone: 'Malar E (CK1 Sustentação)', label: 'Malar E', x: 68, y: 59, productType: 'acido_hialuronico', productName: 'Juvederm® Voluma 1ml', doseValue: 0.8, doseUnit: 'ml', depth: 'supraperiosteal', tool: 'canula_22g', lotNumber: 'JUV-VOL-119' },
        { id: `ph3-${Date.now()}`, zone: 'Sulco Nasogeniano D', label: 'Sulco D', x: 44, y: 57, productType: 'acido_hialuronico', productName: 'Restylane® Defyne 1ml', doseValue: 0.5, doseUnit: 'ml', depth: 'subcutaneo', tool: 'canula_25g', lotNumber: 'RES-DEF-12' },
        { id: `ph4-${Date.now()}`, zone: 'Sulco Nasogeniano E', label: 'Sulco E', x: 56, y: 57, productType: 'acido_hialuronico', productName: 'Restylane® Defyne 1ml', doseValue: 0.5, doseUnit: 'ml', depth: 'subcutaneo', tool: 'canula_25g', lotNumber: 'RES-DEF-12' },
        { id: `ph5-${Date.now()}`, zone: 'Ápice do Mento Projeção', label: 'Mento Projeção', x: 50, y: 88, productType: 'acido_hialuronico', productName: 'Juvederm® Volux 1ml', doseValue: 1.0, doseUnit: 'ml', depth: 'supraperiosteal', tool: 'canula_22g', lotNumber: 'JUV-VLX-88' }
      ];
    } else if (presetType === 'harmonizacao_masculina') {
      presetPoints = [
        { id: `phm1-${Date.now()}`, zone: 'Ângulo Mandibular D', label: 'Goníaco D', x: 24, y: 70, productType: 'acido_hialuronico', productName: 'Juvederm® Volux 1ml', doseValue: 1.0, doseUnit: 'ml', depth: 'supraperiosteal', tool: 'canula_22g', lotNumber: 'JUV-VLX-88' },
        { id: `phm2-${Date.now()}`, zone: 'Ângulo Mandibular E', label: 'Goníaco E', x: 76, y: 70, productType: 'acido_hialuronico', productName: 'Juvederm® Volux 1ml', doseValue: 1.0, doseUnit: 'ml', depth: 'supraperiosteal', tool: 'canula_22g', lotNumber: 'JUV-VLX-88' },
        { id: `phm3-${Date.now()}`, zone: 'Corpo Mandibular D', label: 'Corpo Mand D', x: 30, y: 78, productType: 'acido_hialuronico', productName: 'Juvederm® Volux 1ml', doseValue: 0.5, doseUnit: 'ml', depth: 'supraperiosteal', tool: 'canula_22g', lotNumber: 'JUV-VLX-88' },
        { id: `phm4-${Date.now()}`, zone: 'Corpo Mandibular E', label: 'Corpo Mand E', x: 70, y: 78, productType: 'acido_hialuronico', productName: 'Juvederm® Volux 1ml', doseValue: 0.5, doseUnit: 'ml', depth: 'supraperiosteal', tool: 'canula_22g', lotNumber: 'JUV-VLX-88' },
        { id: `phm5-${Date.now()}`, zone: 'Mento Quadrado Lateral D', label: 'Mento D', x: 44, y: 86, productType: 'acido_hialuronico', productName: 'Juvederm® Volux 1ml', doseValue: 0.5, doseUnit: 'ml', depth: 'supraperiosteal', tool: 'canula_22g', lotNumber: 'JUV-VLX-88' },
        { id: `phm6-${Date.now()}`, zone: 'Mento Quadrado Lateral E', label: 'Mento E', x: 56, y: 86, productType: 'acido_hialuronico', productName: 'Juvederm® Volux 1ml', doseValue: 0.5, doseUnit: 'ml', depth: 'supraperiosteal', tool: 'canula_22g', lotNumber: 'JUV-VLX-88' }
      ];
    } else if (presetType === 'lip_filler') {
      presetPoints = [
        { id: `pl1-${Date.now()}`, zone: 'Arco do Cupido D', label: 'Cupido D', x: 47, y: 69, productType: 'acido_hialuronico', productName: 'Restylane® Kysse 1ml', doseValue: 0.2, doseUnit: 'ml', depth: 'subcutaneo', tool: 'agulha_30g', lotNumber: 'RES-KYSS-44' },
        { id: `pl2-${Date.now()}`, zone: 'Arco do Cupido E', label: 'Cupido E', x: 53, y: 69, productType: 'acido_hialuronico', productName: 'Restylane® Kysse 1ml', doseValue: 0.2, doseUnit: 'ml', depth: 'subcutaneo', tool: 'agulha_30g', lotNumber: 'RES-KYSS-44' },
        { id: `pl3-${Date.now()}`, zone: 'Tubérculo Inferior D', label: 'Tubérculo Inf D', x: 45, y: 73, productType: 'acido_hialuronico', productName: 'Restylane® Kysse 1ml', doseValue: 0.3, doseUnit: 'ml', depth: 'subcutaneo', tool: 'agulha_30g', lotNumber: 'RES-KYSS-44' },
        { id: `pl4-${Date.now()}`, zone: 'Tubérculo Inferior E', label: 'Tubérculo Inf E', x: 55, y: 73, productType: 'acido_hialuronico', productName: 'Restylane® Kysse 1ml', doseValue: 0.3, doseUnit: 'ml', depth: 'subcutaneo', tool: 'agulha_30g', lotNumber: 'RES-KYSS-44' }
      ];
    } else if (presetType === 'bioestimulador_full') {
      presetPoints = [
        { id: `pb1-${Date.now()}`, zone: 'Malar Lateral D (Leque 1)', label: 'Malar Sup D', x: 28, y: 56, productType: 'bioestimulador', productName: 'Sculptra® PLLA', doseValue: 3.0, doseUnit: 'ml', depth: 'subcutaneo', tool: 'canula_22g', lotNumber: 'SCL-2025-88' },
        { id: `pb2-${Date.now()}`, zone: 'Malar Lateral E (Leque 1)', label: 'Malar Sup E', x: 72, y: 56, productType: 'bioestimulador', productName: 'Sculptra® PLLA', doseValue: 3.0, doseUnit: 'ml', depth: 'subcutaneo', tool: 'canula_22g', lotNumber: 'SCL-2025-88' },
        { id: `pb3-${Date.now()}`, zone: 'Ângulo Pré-Auricular D (Leque 2)', label: 'Pré-Auricular D', x: 25, y: 66, productType: 'bioestimulador', productName: 'Sculptra® PLLA', doseValue: 3.0, doseUnit: 'ml', depth: 'subcutaneo', tool: 'canula_22g', lotNumber: 'SCL-2025-88' },
        { id: `pb4-${Date.now()}`, zone: 'Ângulo Pré-Auricular E (Leque 2)', label: 'Pré-Auricular E', x: 75, y: 66, productType: 'bioestimulador', productName: 'Sculptra® PLLA', doseValue: 3.0, doseUnit: 'ml', depth: 'subcutaneo', tool: 'canula_22g', lotNumber: 'SCL-2025-88' },
        { id: `pb5-${Date.now()}`, zone: 'Pré-Jowl D (Leque 3)', label: 'Pré-Jowl D', x: 32, y: 78, productType: 'bioestimulador', productName: 'Sculptra® PLLA', doseValue: 2.0, doseUnit: 'ml', depth: 'subcutaneo', tool: 'canula_22g', lotNumber: 'SCL-2025-88' },
        { id: `pb6-${Date.now()}`, zone: 'Pré-Jowl E (Leque 3)', label: 'Pré-Jowl E', x: 68, y: 78, productType: 'bioestimulador', productName: 'Sculptra® PLLA', doseValue: 2.0, doseUnit: 'ml', depth: 'subcutaneo', tool: 'canula_22g', lotNumber: 'SCL-2025-88' }
      ];
    } else if (presetType === 'fox_eyes') {
      presetPoints = [
        { id: `pf1-${Date.now()}`, zone: 'Cauda da Sobrancelha D', label: 'Cauda Sobr D', x: 23, y: 27, productType: 'botox', productName: 'Botox® Allergan 100U', doseValue: 3, doseUnit: 'U', depth: 'intradermico', tool: 'agulha_32g', lotNumber: activeLot },
        { id: `pf2-${Date.now()}`, zone: 'Cauda da Sobrancelha E', label: 'Cauda Sobr E', x: 77, y: 27, productType: 'botox', productName: 'Botox® Allergan 100U', doseValue: 3, doseUnit: 'U', depth: 'intradermico', tool: 'agulha_32g', lotNumber: activeLot },
        { id: `pf3-${Date.now()}`, zone: 'Vetor Tração Temporal D', label: 'Fio Temporal D', x: 20, y: 20, productType: 'fios_pdo', productName: 'Fio PDO Moldado i-Thread', doseValue: 1, doseUnit: 'fios', depth: 'subcutaneo', tool: 'canula_18g', lotNumber: 'PDO-FOX-99' },
        { id: `pf4-${Date.now()}`, zone: 'Vetor Tração Temporal E', label: 'Fio Temporal E', x: 80, y: 20, productType: 'fios_pdo', productName: 'Fio PDO Moldado i-Thread', doseValue: 1, doseUnit: 'fios', depth: 'subcutaneo', tool: 'canula_18g', lotNumber: 'PDO-FOX-99' }
      ];
    } else if (presetType === 'rinomodelacao') {
      presetPoints = [
        { id: `pr1-${Date.now()}`, zone: 'Dorso Nasal Médio', label: 'Dorso Nasal', x: 50, y: 44, productType: 'acido_hialuronico', productName: 'Restylane® Lyft 1ml', doseValue: 0.3, doseUnit: 'ml', depth: 'supraperiosteal', tool: 'canula_25g', lotNumber: 'RES-LYFT-33' },
        { id: `pr2-${Date.now()}`, zone: 'Ponta Nasal (Tip Lift)', label: 'Ponta Nasal', x: 50, y: 50, productType: 'acido_hialuronico', productName: 'Restylane® Lyft 1ml', doseValue: 0.3, doseUnit: 'ml', depth: 'supraperiosteal', tool: 'canula_25g', lotNumber: 'RES-LYFT-33' },
        { id: `pr3-${Date.now()}`, zone: 'Depressor do Septo Nasal', label: 'Depressor Septo', x: 50, y: 54, productType: 'botox', productName: 'Botox® Allergan 100U', doseValue: 2, doseUnit: 'U', depth: 'muscular', tool: 'agulha_32g', lotNumber: activeLot },
        { id: `pr4-${Date.now()}`, zone: 'Ângulo Nasolabial', label: 'Espinha Nasal', x: 50, y: 58, productType: 'acido_hialuronico', productName: 'Restylane® Lyft 1ml', doseValue: 0.2, doseUnit: 'ml', depth: 'supraperiosteal', tool: 'canula_25g', lotNumber: 'RES-LYFT-33' }
      ];
    }

    const nextPoints = mode === 'replace' ? presetPoints : [...safePoints, ...presetPoints];
    onChangePoints(nextPoints);
    setShowPresetsModal(false);
    notify(`Protocolo aplicado (${mode === 'replace' ? 'Substituído' : 'Adicionado'}): ${presetPoints.length} pontos.`);
  };

  const filteredPresetCatalog = PROTOCOL_CATALOG.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(presetSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(presetSearch.toLowerCase()) ||
      p.targetAreas.some(a => a.toLowerCase().includes(presetSearch.toLowerCase()));
    const matchesCat = presetCategory === 'todos' || p.category === presetCategory;
    return matchesSearch && matchesCat;
  });

  const handleExportMap = () => {
    window.print();
  };

  const selectedPoint = safePoints.find(p => p.id === selectedPointId);
  const filteredPoints = filterProduct === 'todos' ? safePoints : safePoints.filter(p => p.productType === filterProduct);

  return (
    <div id="face-map-studio-container" className="bg-white rounded-3xl border border-[#CBD5E1] shadow-xs overflow-hidden flex flex-col xl:flex-row">
      {/* LEFT: Interactive Anatomical Facial Canvas */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col items-center justify-between border-b xl:border-b-0 xl:border-r border-[#CBD5E1] bg-[#F8FAFC]">
        {/* Header Bar */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center p-2 bg-[#F1F5F9] text-[#1E40AF] border border-[#CBD5E1] rounded-2xl">
                <Shield className="w-4 h-4" />
              </span>
              <div>
                <span className="text-[10px] font-bold text-[#1E40AF] uppercase tracking-[0.2em] block">
                  Studio Anatômico de Harmonização
                </span>
                <h3 className="font-serif italic text-xl text-[#0F172A]">
                  Mapeamento Facial Anatômico (Face Mapping)
                </h3>
              </div>
            </div>
            <p className="text-xs text-[#334155] mt-1 font-light break-words max-w-full">
              Mapeamento clínico de injetáveis para <strong className="font-semibold text-[#0F172A] break-words">{patientName}</strong>
            </p>
          </div>

          {/* Top Actions & Model Switches */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Model Gender Toggle */}
            <div className="flex items-center bg-[#F1F5F9] p-1 rounded-full border border-[#CBD5E1]">
              <button
                type="button"
                onClick={() => setModelGender('feminino')}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                  modelGender === 'feminino'
                    ? 'bg-white text-[#1E40AF] shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <span>👩</span> Feminino
              </button>
              <button
                type="button"
                onClick={() => setModelGender('masculino')}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                  modelGender === 'masculino'
                    ? 'bg-white text-[#1E40AF] shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <span>👨</span> Masculino
              </button>
            </div>

            {/* Presets & Actions */}
            {!readOnly && (
              <>
                <button
                  type="button"
                  onClick={() => setShowPresetsModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-[#2563EB] text-white rounded-full hover:bg-[#1D4ED8] transition-all shadow-xs active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Protocolos Prontos
                </button>

                <button
                  type="button"
                  onClick={handleClearPoints}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-[#334155] hover:text-red-700 hover:bg-red-50 rounded-full transition-colors border border-[#CBD5E1] bg-white"
                  title="Limpar todos os pontos"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Limpar
                </button>
              </>
            )}

            <button
              type="button"
              onClick={handleExportMap}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-[#1E40AF] hover:bg-[#F1F5F9] rounded-full transition-colors border border-[#CBD5E1] bg-white font-medium"
              title="Exportar Mapeamento"
            >
              <Download className="w-3.5 h-3.5" />
              Imprimir
            </button>
          </div>
        </div>

        {/* View Controls Toolbar (Guidelines, Reference Points, Photo Upload, Opacity) */}
        <div className="w-full flex flex-wrap items-center justify-between gap-2 p-2 bg-white rounded-2xl border border-[#CBD5E1] mb-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setShowGuidelines(!showGuidelines)}
              className={`px-2.5 py-1 rounded-xl font-medium transition-colors flex items-center gap-1.5 ${
                showGuidelines ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-[#F8FAFC] text-[#64748B] border border-transparent'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Linhas Anatômicas
            </button>

            <button
              type="button"
              onClick={() => setShowLandmarks(!showLandmarks)}
              className={`px-2.5 py-1 rounded-xl font-medium transition-colors flex items-center gap-1.5 ${
                showLandmarks ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-[#F8FAFC] text-[#64748B] border border-transparent'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Pontos de Referência
            </button>

            {/* Custom Photo Upload */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#334155] rounded-xl border border-[#CBD5E1] font-medium flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-[#2563EB]" />
              {customPhotoUrl ? 'Trocar Foto Real' : 'Foto do Paciente'}
            </button>
            {customPhotoUrl && (
              <button
                type="button"
                onClick={() => setCustomPhotoUrl(null)}
                className="text-[10px] text-red-600 hover:underline"
              >
                Remover Foto
              </button>
            )}
          </div>

          {/* Opacity Slider */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#64748B] font-light">Opacidade Modelo:</span>
            <input
              type="range"
              min="20"
              max="100"
              value={modelOpacity}
              onChange={(e) => setModelOpacity(parseInt(e.target.value))}
              className="w-20 accent-[#2563EB] cursor-pointer"
            />
            <span className="text-[10px] text-[#0F172A] font-bold w-7 text-right">{modelOpacity}%</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-1 mb-2 text-xs">
          <span className="text-[#64748B] font-medium whitespace-nowrap">Filtrar:</span>
          <button
            type="button"
            onClick={() => setFilterProduct('todos')}
            className={`px-3 py-1 rounded-full font-medium transition-all ${
              filterProduct === 'todos'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'bg-white text-[#334155] hover:bg-[#F1F5F9] border border-[#CBD5E1]'
            }`}
          >
            Todos ({safePoints.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterProduct('botox')}
            className={`px-3 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 ${
              filterProduct === 'botox'
                ? 'bg-purple-800 text-white shadow-xs'
                : 'bg-white text-purple-900 hover:bg-purple-50 border border-purple-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-500 inline-block"></span>
            Botox ({safePoints.filter(p => p.productType === 'botox').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterProduct('acido_hialuronico')}
            className={`px-3 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 ${
              filterProduct === 'acido_hialuronico'
                ? 'bg-rose-800 text-white shadow-xs'
                : 'bg-white text-rose-900 hover:bg-rose-50 border border-rose-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
            Preenchedor ({safePoints.filter(p => p.productType === 'acido_hialuronico').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterProduct('bioestimulador')}
            className={`px-3 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 ${
              filterProduct === 'bioestimulador'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-emerald-900 hover:bg-emerald-50 border border-emerald-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            Bioestimulador ({safePoints.filter(p => p.productType === 'bioestimulador').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterProduct('fios_pdo')}
            className={`px-3 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 ${
              filterProduct === 'fios_pdo'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'bg-white text-amber-900 hover:bg-amber-50 border border-amber-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
            Fios PDO ({safePoints.filter(p => p.productType === 'fios_pdo').length})
          </button>
        </div>

        {/* Anatomical Face SVG Canvas */}
        <div className="relative w-full max-w-[380px] sm:max-w-[440px] aspect-[4/5] bg-gradient-to-b from-white via-[#fbfdff] to-[#f8fafc] rounded-3xl shadow-inner border border-[#CBD5E1] p-2 sm:p-3 select-none flex items-center justify-center touch-manipulation overflow-hidden">
          {/* Custom Photo Underlay if present */}
          {customPhotoUrl && (
            <img
              src={customPhotoUrl}
              alt="Foto do Paciente"
              className="absolute inset-0 w-full h-full object-cover rounded-3xl opacity-90 pointer-events-none"
            />
          )}

          <svg
            viewBox="0 0 400 500"
            className={`w-full h-full ${readOnly ? 'cursor-default' : 'cursor-crosshair'}`}
            onClick={handleFaceClick}
            onTouchStart={handleFaceTouch}
          >
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.25" />
              </filter>
            </defs>

            {/* Background Medical Mesh Pattern */}
            <g opacity="0.15" stroke="#94a3b8" strokeWidth="0.5">
              <line x1="20" y1="50" x2="380" y2="50" strokeDasharray="3 3" />
              <line x1="20" y1="150" x2="380" y2="150" strokeDasharray="3 3" />
              <line x1="20" y1="250" x2="380" y2="250" strokeDasharray="3 3" />
              <line x1="20" y1="350" x2="380" y2="350" strokeDasharray="3 3" />
              <line x1="20" y1="450" x2="380" y2="450" strokeDasharray="3 3" />
              {/* Geometry polygons top-left & bottom-right */}
              <polygon points="30,30 60,15 80,45 50,60" fill="none" />
              <polygon points="370,470 340,485 320,455 350,440" fill="none" />
            </g>

            {/* 1. VECTOR PHYSIOGNOMY MODEL (FEMININO OU MASCULINO) */}
            {modelGender === 'feminino' ? (
              <FemaleFaceModel opacity={modelOpacity / 100} />
            ) : (
              <MaleFaceModel opacity={modelOpacity / 100} />
            )}

            {/* 2. ANATOMICAL OVERLAY (BUTTERFLY GUIDELINES & CLINICAL LANDMARKS) */}
            <AnatomicalOverlay
              showGuidelines={showGuidelines}
              showLandmarks={showLandmarks}
              onSelectLandmark={handleSelectLandmark}
              hoveredLandmarkId={hoveredLandmarkId}
              setHoveredLandmarkId={setHoveredLandmarkId}
            />

            {/* 3. ACTIVE INJECTION POINTS */}
            {filteredPoints.map((pt) => {
              const svgX = (pt.x / 100) * 400;
              const svgY = (pt.y / 100) * 500;
              const isSelected = selectedPointId === pt.id;
              const colorCfg = PRODUCT_COLORS[pt.productType] || PRODUCT_COLORS.botox;

              return (
                <g
                  key={pt.id}
                  id={`injection-pin-${pt.id}`}
                  className="cursor-pointer transition-transform duration-150 hover:scale-115"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPointId(pt.id);
                  }}
                >
                  {/* Outer pulse when selected */}
                  {isSelected && (
                    <circle
                      cx={svgX}
                      cy={svgY}
                      r="16"
                      fill={colorCfg.pinBg}
                      fillOpacity="0.25"
                      stroke={colorCfg.pinBg}
                      strokeWidth="1.5"
                    />
                  )}

                  {/* Main Pin Circle */}
                  <circle
                    cx={svgX}
                    cy={svgY}
                    r={isSelected ? "11" : "9"}
                    fill={colorCfg.pinBg}
                    stroke="#ffffff"
                    strokeWidth="2"
                    filter="url(#glow)"
                  />

                  {/* Pin label (Dose or Index) */}
                  <text
                    x={svgX}
                    y={svgY + 3.5}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize={isSelected ? "9" : "8"}
                    fontWeight="bold"
                    className="select-none pointer-events-none"
                  >
                    {pt.doseValue}{pt.doseUnit === 'U' ? 'U' : ''}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Flash Notification Toast */}
          {notificationMsg && (
            <div className="absolute bottom-4 left-4 right-4 bg-[#0F172A]/90 backdrop-blur-xs text-white text-xs py-2 px-3.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{notificationMsg}</span>
            </div>
          )}
        </div>

        {/* BOTTOM ACTIVE TOOLBAR (FOR ADDING NEW POINTS) */}
        {!readOnly && (
          <div className="w-full mt-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-[#CBD5E1] shadow-xs flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1E40AF]">
                Configuração do Próximo Ponto:
              </span>
              <span className="text-[11px] text-[#334155]">
                Lote: <strong className="text-[#0F172A]">{activeLot}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Product Selector */}
              <div>
                <label className="block text-[10px] text-[#334155] font-medium mb-1">Injetável / Produto</label>
                <select
                  value={activeProductType}
                  onChange={(e) => {
                    const newType = e.target.value as ProductType;
                    setActiveProductType(newType);
                    setActiveDose(newType === 'botox' ? 4 : newType === 'acido_hialuronico' ? 0.5 : 1);
                    setActiveDepth(newType === 'botox' ? 'intradermico' : 'subcutaneo');
                  }}
                  className="w-full text-xs font-medium px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-[#0F172A] focus:border-[#2563EB] outline-none"
                >
                  <option value="botox">🟣 Toxina Botulínica (U)</option>
                  <option value="acido_hialuronico">🔴 Ácido Hialurônico (ml)</option>
                  <option value="bioestimulador">🟢 Bioestimulador</option>
                  <option value="fios_pdo">🟠 Fios de Sustentação</option>
                  <option value="enzima">🔵 Enzima Lipolítica</option>
                </select>
              </div>

              {/* Dose */}
              <div>
                <label className="block text-[10px] text-[#334155] font-medium mb-1">
                  Dose ({activeProductType === 'botox' ? 'Unidades' : 'ml'})
                </label>
                <input
                  type="number"
                  step={activeProductType === 'botox' ? '1' : '0.1'}
                  value={activeDose}
                  onChange={(e) => setActiveDose(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs font-bold px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-[#0F172A] focus:border-[#2563EB] outline-none"
                />
              </div>

              {/* Plano / Profundidade */}
              <div>
                <label className="block text-[10px] text-[#334155] font-medium mb-1">Plano Anatômico</label>
                <select
                  value={activeDepth}
                  onChange={(e) => setActiveDepth(e.target.value as InjectionDepth)}
                  className="w-full text-xs px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-[#0F172A] focus:border-[#2563EB] outline-none"
                >
                  <option value="intradermico">Intradérmico / Pápula</option>
                  <option value="subcutaneo">Subcutâneo</option>
                  <option value="muscular">Intramuscular</option>
                  <option value="supraperiosteal">Supraperiosteal / Justaósseo</option>
                </select>
              </div>

              {/* Instrumento */}
              <div>
                <label className="block text-[10px] text-[#334155] font-medium mb-1">Agulha / Cânula</label>
                <select
                  value={activeTool}
                  onChange={(e) => setActiveTool(e.target.value as InjectionTool)}
                  className="w-full text-xs px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-[#0F172A] focus:border-[#2563EB] outline-none"
                >
                  <option value="agulha_32g">Agulha 32G (Ultra fina / Botox)</option>
                  <option value="agulha_30g">Agulha 30G 1/2</option>
                  <option value="canula_22g">Cânula 22G 50mm (Malar/Mento)</option>
                  <option value="canula_25g">Cânula 25G 50mm (Sulco/Lábio)</option>
                  <option value="canula_18g">Cânula 18G (Fios PDO)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: Point Inspector, Dose Summary & Protocol Details */}
      <div className="w-full xl:w-[380px] p-5 sm:p-6 flex flex-col justify-between bg-white">
        <div>
          {/* Header Summary Box */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-serif italic text-base text-[#0F172A]">
                Sumário de Injetáveis
              </h4>
              <span className="text-[11px] text-[#64748B] font-medium">
                Modelo: {modelGender === 'feminino' ? 'Feminino' : 'Masculino'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 bg-[#F8FAFC] border border-purple-200/70 rounded-2xl">
                <span className="text-[9px] font-bold text-purple-800 uppercase tracking-wider block">
                  Toxina Botulínica
                </span>
                <span className="text-xl font-serif italic font-bold text-purple-950 block mt-0.5">
                  {totalBotox} <span className="text-xs font-normal text-purple-800">U</span>
                </span>
              </div>

              <div className="p-3 bg-[#F8FAFC] border border-rose-200/70 rounded-2xl">
                <span className="text-[9px] font-bold text-rose-800 uppercase tracking-wider block">
                  Ácido Hialurônico
                </span>
                <span className="text-xl font-serif italic font-bold text-rose-950 block mt-0.5">
                  {totalFiller.toFixed(1)} <span className="text-xs font-normal text-rose-800">ml</span>
                </span>
              </div>

              <div className="p-3 bg-[#F8FAFC] border border-emerald-200/70 rounded-2xl">
                <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Bioestimulador
                </span>
                <span className="text-xl font-serif italic font-bold text-emerald-950 block mt-0.5">
                  {totalBio} <span className="text-xs font-normal text-emerald-800">ml/sessão</span>
                </span>
              </div>

              <div className="p-3 bg-[#F8FAFC] border border-amber-200/70 rounded-2xl">
                <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wider block">
                  Fios de PDO
                </span>
                <span className="text-xl font-serif italic font-bold text-amber-950 block mt-0.5">
                  {totalThreads} <span className="text-xs font-normal text-amber-800">fios</span>
                </span>
              </div>
            </div>
          </div>

          {/* Point Inspector or Points List */}
          {selectedPoint ? (
            <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#CBD5E1] mb-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-3 gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: PRODUCT_COLORS[selectedPoint.productType]?.pinBg || '#7c3aed' }}
                  />
                  <h5 className="font-serif italic text-base text-[#0F172A] truncate">
                    Detalhes ({selectedPoint.zone})
                  </h5>
                </div>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => handleDeletePoint(selectedPoint.id)}
                    className="p-1.5 text-[#334155] hover:text-red-700 rounded-full hover:bg-red-50 transition-colors shrink-0"
                    title="Excluir ponto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="text-[#334155] font-medium block mb-1">Identificação / Região:</label>
                  <input
                    type="text"
                    disabled={readOnly}
                    value={selectedPoint.label}
                    onChange={(e) => handleUpdatePoint(selectedPoint.id, { label: e.target.value })}
                    className="w-full font-medium px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-xl text-[#0F172A] focus:border-[#2563EB] outline-none disabled:bg-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[#334155] font-medium block mb-1">Dose ({selectedPoint.doseUnit}):</label>
                    <input
                      type="number"
                      disabled={readOnly}
                      step={selectedPoint.productType === 'botox' ? '1' : '0.1'}
                      value={selectedPoint.doseValue}
                      onChange={(e) => handleUpdatePoint(selectedPoint.id, { doseValue: parseFloat(e.target.value) || 0 })}
                      className="w-full font-bold px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-xl text-[#0F172A] focus:border-[#2563EB] outline-none disabled:bg-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[#334155] font-medium block mb-1">Produto:</label>
                    <input
                      type="text"
                      disabled={readOnly}
                      value={selectedPoint.productName}
                      onChange={(e) => handleUpdatePoint(selectedPoint.id, { productName: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-xl text-[#0F172A] focus:border-[#2563EB] outline-none disabled:bg-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[#334155] font-medium block mb-1">Plano:</label>
                    <select
                      disabled={readOnly}
                      value={selectedPoint.depth}
                      onChange={(e) => handleUpdatePoint(selectedPoint.id, { depth: e.target.value as InjectionDepth })}
                      className="w-full px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-xl text-[#0F172A] focus:border-[#2563EB] outline-none disabled:bg-slate-100"
                    >
                      <option value="intradermico">Intradérmico</option>
                      <option value="subcutaneo">Subcutâneo</option>
                      <option value="muscular">Intramuscular</option>
                      <option value="supraperiosteal">Supraperiosteal</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[#334155] font-medium block mb-1">Agulha/Cânula:</label>
                    <select
                      disabled={readOnly}
                      value={selectedPoint.tool}
                      onChange={(e) => handleUpdatePoint(selectedPoint.id, { tool: e.target.value as InjectionTool })}
                      className="w-full px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-xl text-[#0F172A] focus:border-[#2563EB] outline-none disabled:bg-slate-100"
                    >
                      <option value="agulha_32g">32G (Botox)</option>
                      <option value="agulha_30g">30G 1/2</option>
                      <option value="canula_22g">Cânula 22G</option>
                      <option value="canula_25g">Cânula 25G</option>
                      <option value="canula_18g">Cânula 18G</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[#334155] font-medium block mb-1">Lote do Produto (ANVISA):</label>
                  <input
                    type="text"
                    disabled={readOnly}
                    value={selectedPoint.lotNumber}
                    onChange={(e) => handleUpdatePoint(selectedPoint.id, { lotNumber: e.target.value })}
                    placeholder="Ex: BTX-2025-A1"
                    className="w-full px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-xl text-[#0F172A] focus:border-[#2563EB] outline-none disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="text-[#334155] font-medium block mb-1">Notas do Injetor:</label>
                  <input
                    type="text"
                    disabled={readOnly}
                    value={selectedPoint.notes || ''}
                    onChange={(e) => handleUpdatePoint(selectedPoint.id, { notes: e.target.value })}
                    placeholder="Ex: Injeção em leque, refluxo negativo..."
                    className="w-full px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-xl text-[#0F172A] focus:border-[#2563EB] outline-none disabled:bg-slate-100"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#0F172A]">
                  Pontos Registrados ({safePoints.length}):
                </span>
                <span className="text-[11px] text-[#64748B]">Clique para inspecionar</span>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                {safePoints.length === 0 ? (
                  <div className="p-6 bg-[#F8FAFC] rounded-2xl border border-dashed border-[#CBD5E1] text-center">
                    <p className="text-xs text-[#1E40AF] font-serif italic mb-1">
                      Nenhum ponto registrado no momento.
                    </p>
                    <p className="text-[11px] text-[#64748B] font-light">
                      Clique em qualquer área da face ou nos pontos de referência para registrar doses.
                    </p>
                  </div>
                ) : (
                  safePoints.map((pt) => {
                    const colorCfg = PRODUCT_COLORS[pt.productType] || PRODUCT_COLORS.botox;
                    return (
                      <div
                        key={pt.id}
                        onClick={() => setSelectedPointId(pt.id)}
                        className={`p-2.5 rounded-2xl border text-xs cursor-pointer flex items-center justify-between gap-3 transition-all hover:bg-[#F8FAFC] ${
                          selectedPointId === pt.id ? 'border-[#2563EB] bg-[#F1F5F9] ring-1 ring-[#2563EB]' : 'border-[#CBD5E1] bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: colorCfg.pinBg }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-[#0F172A] truncate">{pt.label || pt.zone}</p>
                            <p className="text-[10px] text-[#334155] truncate">
                              {pt.productName} • {pt.depth}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-serif italic font-bold text-sm text-[#0F172A] block">
                            {pt.doseValue} {pt.doseUnit}
                          </span>
                          <span className="block text-[10px] text-[#64748B]">{pt.tool.replace('_', ' ')}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Safety Badge & ANVISA Compliance */}
        <div className="p-3 bg-[#F1F5F9] rounded-2xl border border-[#D0E3F0] text-[11px] text-[#334155] flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-[#1E40AF] shrink-0 mt-0.5" />
          <p className="leading-relaxed font-light">
            <strong className="font-semibold text-[#0F172A]">Rastreabilidade ANVISA:</strong> As fisionomias padronizadas e pontos anatômicos garantem exata reprodutibilidade, segurança e histórico clínico por paciente.
          </p>
        </div>
      </div>

      {/* FULL CLINICAL PROTOCOLS MODAL - Never clipped by parent containers */}
      {showPresetsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
          {/* Backdrop Click */}
          <div
            className="absolute inset-0"
            onClick={() => setShowPresetsModal(false)}
          />

          <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-[#CBD5E1] flex flex-col overflow-hidden z-10 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif italic text-[#0F172A] font-bold">
                    Protocolos Prontos & Presets Clínicos
                  </h3>
                  <p className="text-xs text-[#64748B] font-light">
                    Selecione um plano padronizado para aplicar automaticamente as injeções no mapa facial
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPresetsModal(false)}
                className="p-2 rounded-full text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 sm:p-5 border-b border-[#E2E8F0] bg-white flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Search */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={presetSearch}
                  onChange={(e) => setPresetSearch(e.target.value)}
                  placeholder="Buscar protocolo ou região..."
                  className="w-full pl-9.5 pr-4 py-2 text-xs rounded-xl border border-[#CBD5E1] focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-[#F8FAFC]"
                />
                {presetSearch && (
                  <button
                    type="button"
                    onClick={() => setPresetSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8] hover:text-[#0F172A]"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'botox', label: 'Toxina' },
                  { id: 'acido_hialuronico', label: 'Preenchimento' },
                  { id: 'bioestimulador', label: 'Bioestimuladores' },
                  { id: 'combinado', label: 'Combinados' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setPresetCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      presetCategory === cat.id
                        ? 'bg-[#1E40AF] text-white shadow-xs'
                        : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Application Mode: Append or Replace */}
              <div className="flex items-center gap-2 text-xs border border-[#CBD5E1] rounded-full p-1 bg-[#F8FAFC] self-start md:self-auto shrink-0">
                <span className="text-[11px] text-[#64748B] pl-2 font-medium">Modo:</span>
                <button
                  type="button"
                  onClick={() => setPresetMode('append')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                    presetMode === 'append'
                      ? 'bg-blue-600 text-white'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                  title="Preserva os pontos já existentes e soma os novos"
                >
                  + Somar Pontos
                </button>
                <button
                  type="button"
                  onClick={() => setPresetMode('replace')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                    presetMode === 'replace'
                      ? 'bg-amber-600 text-white'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                  title="Substitui o mapa facial atual pelos pontos deste protocolo"
                >
                  Substituir Mapa
                </button>
              </div>
            </div>

            {/* Protocols Grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-[#F8FAFC]">
              {filteredPresetCatalog.length === 0 ? (
                <div className="col-span-full py-12 text-center">
                  <p className="text-sm font-semibold text-[#64748B]">Nenhum protocolo encontrado com esse termo.</p>
                  <button
                    type="button"
                    onClick={() => { setPresetSearch(''); setPresetCategory('todos'); }}
                    className="mt-2 text-xs text-blue-600 underline"
                  >
                    Limpar filtros
                  </button>
                </div>
              ) : (
                filteredPresetCatalog.map((preset) => {
                  const badgeColor =
                    preset.category === 'botox' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                    preset.category === 'acido_hialuronico' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                    preset.category === 'bioestimulador' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                    'bg-blue-100 text-blue-800 border-blue-200';

                  return (
                    <div
                      key={preset.id}
                      className="bg-white rounded-2xl border border-[#CBD5E1] p-4 flex flex-col justify-between hover:shadow-md hover:border-blue-300 transition-all group"
                    >
                      <div>
                        {/* Header card */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${badgeColor}`}>
                            {preset.tag}
                          </span>
                          <span className="text-[11px] font-semibold text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-md">
                            {preset.pointsCount} pontos
                          </span>
                        </div>

                        <h4 className="font-bold text-[#0F172A] text-sm group-hover:text-blue-600 transition-colors">
                          {preset.title}
                        </h4>

                        <div className="mt-1 flex items-baseline gap-1.5">
                          <span className="text-xs font-semibold text-blue-700">Dose Estimada:</span>
                          <span className="text-xs font-bold text-[#0F172A]">{preset.doseSummary}</span>
                        </div>

                        <p className="text-xs text-[#475569] mt-2 font-light leading-relaxed">
                          {preset.description}
                        </p>

                        {/* Target Areas */}
                        <div className="mt-3 flex flex-wrap gap-1">
                          {preset.targetAreas.map((area, idx) => (
                            <span key={idx} className="text-[10px] bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] px-1.5 py-0.5 rounded-md">
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Apply Button */}
                      <div className="mt-4 pt-3 border-t border-[#F1F5F9]">
                        <button
                          type="button"
                          onClick={() => applyPreset(preset.id)}
                          className="w-full py-2 px-3 rounded-xl bg-[#1E40AF] text-white text-xs font-semibold hover:bg-blue-700 active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          {presetMode === 'replace' ? 'Substituir e Aplicar' : 'Aplicar ao Mapa'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-[#E2E8F0] bg-white flex items-center justify-between text-xs text-[#64748B]">
              <span>💡 Dica: Após carregar um protocolo, você pode ajustar as doses e posições individualmente.</span>
              <button
                type="button"
                onClick={() => setShowPresetsModal(false)}
                className="px-4 py-1.5 rounded-xl border border-[#CBD5E1] text-[#334155] hover:bg-[#F1F5F9] font-medium"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
