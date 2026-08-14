import React from 'react';

export interface LandmarkDot {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  category: 'frontal' | 'glabela' | 'periorbital' | 'nasal' | 'malar_mandibula' | 'mento_pescoco';
  color: string;
  name: string;
  recommendedProduct: 'botox' | 'acido_hialuronico' | 'bioestimulador' | 'fios_pdo';
  defaultDose: number;
  doseUnit: 'U' | 'ml' | 'fios';
}

export const ANATOMICAL_LANDMARKS: LandmarkDot[] = [
  // Frontal / Temporal (Azul / Blue)
  { id: 'lm-f1', x: 26, y: 15, category: 'frontal', color: '#0284c7', name: 'Frontal Superior Lateral D', recommendedProduct: 'botox', defaultDose: 2, doseUnit: 'U' },
  { id: 'lm-f2', x: 34, y: 11, category: 'frontal', color: '#0284c7', name: 'Frontal Superior Médio D', recommendedProduct: 'botox', defaultDose: 2, doseUnit: 'U' },
  { id: 'lm-f3', x: 42, y: 9, category: 'frontal', color: '#0284c7', name: 'Frontal Superior Paramediano D', recommendedProduct: 'botox', defaultDose: 2, doseUnit: 'U' },
  { id: 'lm-f4', x: 50, y: 9, category: 'frontal', color: '#0284c7', name: 'Frontal Superior Central', recommendedProduct: 'botox', defaultDose: 3, doseUnit: 'U' },
  { id: 'lm-f5', x: 58, y: 9, category: 'frontal', color: '#0284c7', name: 'Frontal Superior Paramediano E', recommendedProduct: 'botox', defaultDose: 2, doseUnit: 'U' },
  { id: 'lm-f6', x: 66, y: 11, category: 'frontal', color: '#0284c7', name: 'Frontal Superior Médio E', recommendedProduct: 'botox', defaultDose: 2, doseUnit: 'U' },
  { id: 'lm-f7', x: 74, y: 15, category: 'frontal', color: '#0284c7', name: 'Frontal Superior Lateral E', recommendedProduct: 'botox', defaultDose: 2, doseUnit: 'U' },
  { id: 'lm-f8', x: 50, y: 18, category: 'frontal', color: '#0284c7', name: 'Frontal Médio Central', recommendedProduct: 'botox', defaultDose: 2, doseUnit: 'U' },
  { id: 'lm-f9', x: 26, y: 22, category: 'frontal', color: '#0284c7', name: 'Têmpora Superior D', recommendedProduct: 'botox', defaultDose: 1, doseUnit: 'U' },
  { id: 'lm-f10', x: 74, y: 22, category: 'frontal', color: '#0284c7', name: 'Têmpora Superior E', recommendedProduct: 'botox', defaultDose: 1, doseUnit: 'U' },
  { id: 'lm-f11', x: 23, y: 27, category: 'frontal', color: '#0284c7', name: 'Linha Temporal D', recommendedProduct: 'botox', defaultDose: 1, doseUnit: 'U' },
  { id: 'lm-f12', x: 77, y: 27, category: 'frontal', color: '#0284c7', name: 'Linha Temporal E', recommendedProduct: 'botox', defaultDose: 1, doseUnit: 'U' },

  // Glabela & Prócero & Dorso Superior (Amarelo / Yellow)
  { id: 'lm-g1', x: 50, y: 28, category: 'glabela', color: '#eab308', name: 'Prócero Superior', recommendedProduct: 'botox', defaultDose: 4, doseUnit: 'U' },
  { id: 'lm-g2', x: 50, y: 34, category: 'glabela', color: '#eab308', name: 'Prócero / Radix Central', recommendedProduct: 'botox', defaultDose: 4, doseUnit: 'U' },
  { id: 'lm-g3', x: 44, y: 34, category: 'glabela', color: '#eab308', name: 'Corrugador Medial D', recommendedProduct: 'botox', defaultDose: 4, doseUnit: 'U' },
  { id: 'lm-g4', x: 56, y: 34, category: 'glabela', color: '#eab308', name: 'Corrugador Medial E', recommendedProduct: 'botox', defaultDose: 4, doseUnit: 'U' },
  { id: 'lm-g5', x: 41, y: 27, category: 'glabela', color: '#eab308', name: 'Corrugador Cauda D', recommendedProduct: 'botox', defaultDose: 3, doseUnit: 'U' },
  { id: 'lm-g6', x: 59, y: 27, category: 'glabela', color: '#eab308', name: 'Corrugador Cauda E', recommendedProduct: 'botox', defaultDose: 3, doseUnit: 'U' },
  { id: 'lm-g7', x: 37, y: 26, category: 'glabela', color: '#eab308', name: 'Supraorbital Lateral D', recommendedProduct: 'botox', defaultDose: 2, doseUnit: 'U' },
  { id: 'lm-g8', x: 63, y: 26, category: 'glabela', color: '#eab308', name: 'Supraorbital Lateral E', recommendedProduct: 'botox', defaultDose: 2, doseUnit: 'U' },

  // Periorbital & Pés de Galinha (Rosa / Magenta)
  { id: 'lm-p1', x: 23, y: 31, category: 'periorbital', color: '#d946ef', name: 'Orbicular Superior Lateral D', recommendedProduct: 'botox', defaultDose: 2, doseUnit: 'U' },
  { id: 'lm-p2', x: 77, y: 31, category: 'periorbital', color: '#d946ef', name: 'Orbicular Superior Lateral E', recommendedProduct: 'botox', defaultDose: 2, doseUnit: 'U' },
  { id: 'lm-p3', x: 20, y: 38, category: 'periorbital', color: '#d946ef', name: 'Canto Lateral D1 (Pé de Galinha)', recommendedProduct: 'botox', defaultDose: 3, doseUnit: 'U' },
  { id: 'lm-p4', x: 80, y: 38, category: 'periorbital', color: '#d946ef', name: 'Canto Lateral E1 (Pé de Galinha)', recommendedProduct: 'botox', defaultDose: 3, doseUnit: 'U' },
  { id: 'lm-p5', x: 23, y: 44, category: 'periorbital', color: '#d946ef', name: 'Canto Lateral D2 (Pé de Galinha)', recommendedProduct: 'botox', defaultDose: 2, doseUnit: 'U' },
  { id: 'lm-p6', x: 77, y: 44, category: 'periorbital', color: '#d946ef', name: 'Canto Lateral E2 (Pé de Galinha)', recommendedProduct: 'botox', defaultDose: 2, doseUnit: 'U' },
  { id: 'lm-p7', x: 27, y: 46, category: 'periorbital', color: '#d946ef', name: 'Infraorbital Lateral D', recommendedProduct: 'botox', defaultDose: 2, doseUnit: 'U' },
  { id: 'lm-p8', x: 73, y: 46, category: 'periorbital', color: '#d946ef', name: 'Infraorbital Lateral E', recommendedProduct: 'botox', defaultDose: 2, doseUnit: 'U' },
  { id: 'lm-p9', x: 33, y: 43, category: 'periorbital', color: '#d946ef', name: 'Infraorbital / Olheira D', recommendedProduct: 'acido_hialuronico', defaultDose: 0.3, doseUnit: 'ml' },
  { id: 'lm-p10', x: 67, y: 43, category: 'periorbital', color: '#d946ef', name: 'Infraorbital / Olheira E', recommendedProduct: 'acido_hialuronico', defaultDose: 0.3, doseUnit: 'ml' },

  // Nasal, Ápice & Sulco (Verde / Green)
  { id: 'lm-n1', x: 46, y: 42, category: 'nasal', color: '#16a34a', name: 'Bunny Lines D', recommendedProduct: 'botox', defaultDose: 2, doseUnit: 'U' },
  { id: 'lm-n2', x: 54, y: 42, category: 'nasal', color: '#16a34a', name: 'Bunny Lines E', recommendedProduct: 'botox', defaultDose: 2, doseUnit: 'U' },
  { id: 'lm-n3', x: 50, y: 44, category: 'nasal', color: '#16a34a', name: 'Dorso Nasal Médio', recommendedProduct: 'acido_hialuronico', defaultDose: 0.3, doseUnit: 'ml' },
  { id: 'lm-n4', x: 44, y: 48, category: 'nasal', color: '#16a34a', name: 'Parede Nasal Lateral D', recommendedProduct: 'acido_hialuronico', defaultDose: 0.2, doseUnit: 'ml' },
  { id: 'lm-n5', x: 56, y: 48, category: 'nasal', color: '#16a34a', name: 'Parede Nasal Lateral E', recommendedProduct: 'acido_hialuronico', defaultDose: 0.2, doseUnit: 'ml' },
  { id: 'lm-n6', x: 50, y: 50, category: 'nasal', color: '#16a34a', name: 'Ponta Nasal (Tip Lift)', recommendedProduct: 'acido_hialuronico', defaultDose: 0.2, doseUnit: 'ml' },
  { id: 'lm-n7', x: 42, y: 52, category: 'nasal', color: '#16a34a', name: 'Asa Nasal / Sulco Superior D', recommendedProduct: 'acido_hialuronico', defaultDose: 0.4, doseUnit: 'ml' },
  { id: 'lm-n8', x: 58, y: 52, category: 'nasal', color: '#16a34a', name: 'Asa Nasal / Sulco Superior E', recommendedProduct: 'acido_hialuronico', defaultDose: 0.4, doseUnit: 'ml' },
  { id: 'lm-n9', x: 44, y: 57, category: 'nasal', color: '#16a34a', name: 'Sulco Nasogeniano Médio D', recommendedProduct: 'acido_hialuronico', defaultDose: 0.5, doseUnit: 'ml' },
  { id: 'lm-n10', x: 56, y: 57, category: 'nasal', color: '#16a34a', name: 'Sulco Nasogeniano Médio E', recommendedProduct: 'acido_hialuronico', defaultDose: 0.5, doseUnit: 'ml' },

  // Malar, Masseter & Mandíbula (Laranja / Orange)
  { id: 'lm-m1', x: 32, y: 59, category: 'malar_mandibula', color: '#ea580c', name: 'Malar / Ponto de Sustentação D', recommendedProduct: 'acido_hialuronico', defaultDose: 0.8, doseUnit: 'ml' },
  { id: 'lm-m2', x: 68, y: 59, category: 'malar_mandibula', color: '#ea580c', name: 'Malar / Ponto de Sustentação E', recommendedProduct: 'acido_hialuronico', defaultDose: 0.8, doseUnit: 'ml' },
  { id: 'lm-m3', x: 26, y: 64, category: 'malar_mandibula', color: '#ea580c', name: 'Masseter Superior D', recommendedProduct: 'botox', defaultDose: 10, doseUnit: 'U' },
  { id: 'lm-m4', x: 74, y: 64, category: 'malar_mandibula', color: '#ea580c', name: 'Masseter Superior E', recommendedProduct: 'botox', defaultDose: 10, doseUnit: 'U' },
  { id: 'lm-m5', x: 24, y: 70, category: 'malar_mandibula', color: '#ea580c', name: 'Ângulo Mandibular D', recommendedProduct: 'acido_hialuronico', defaultDose: 1.0, doseUnit: 'ml' },
  { id: 'lm-m6', x: 76, y: 70, category: 'malar_mandibula', color: '#ea580c', name: 'Ângulo Mandibular E', recommendedProduct: 'acido_hialuronico', defaultDose: 1.0, doseUnit: 'ml' },
  { id: 'lm-m7', x: 34, y: 69, category: 'malar_mandibula', color: '#ea580c', name: 'Modíolo / Canto Labial D', recommendedProduct: 'botox', defaultDose: 2, doseUnit: 'U' },
  { id: 'lm-m8', x: 66, y: 69, category: 'malar_mandibula', color: '#ea580c', name: 'Modíolo / Canto Labial E', recommendedProduct: 'botox', defaultDose: 2, doseUnit: 'U' },
  { id: 'lm-m9', x: 36, y: 75, category: 'malar_mandibula', color: '#ea580c', name: 'Sulco Marionete / DAO D', recommendedProduct: 'acido_hialuronico', defaultDose: 0.4, doseUnit: 'ml' },
  { id: 'lm-m10', x: 64, y: 75, category: 'malar_mandibula', color: '#ea580c', name: 'Sulco Marionete / DAO E', recommendedProduct: 'acido_hialuronico', defaultDose: 0.4, doseUnit: 'ml' },
  { id: 'lm-m11', x: 31, y: 80, category: 'malar_mandibula', color: '#ea580c', name: 'Pré-Jowl Sulcus D', recommendedProduct: 'bioestimulador', defaultDose: 2.0, doseUnit: 'ml' },
  { id: 'lm-m12', x: 69, y: 80, category: 'malar_mandibula', color: '#ea580c', name: 'Pré-Jowl Sulcus E', recommendedProduct: 'bioestimulador', defaultDose: 2.0, doseUnit: 'ml' },

  // Mento & Cervical / Platisma (Roxo / Violet)
  { id: 'lm-c1', x: 50, y: 81, category: 'mento_pescoco', color: '#7c3aed', name: 'Mento Superior Central', recommendedProduct: 'botox', defaultDose: 4, doseUnit: 'U' },
  { id: 'lm-c2', x: 44, y: 85, category: 'mento_pescoco', color: '#7c3aed', name: 'Mento Lateral D', recommendedProduct: 'acido_hialuronico', defaultDose: 0.5, doseUnit: 'ml' },
  { id: 'lm-c3', x: 56, y: 85, category: 'mento_pescoco', color: '#7c3aed', name: 'Mento Lateral E', recommendedProduct: 'acido_hialuronico', defaultDose: 0.5, doseUnit: 'ml' },
  { id: 'lm-c4', x: 50, y: 88, category: 'mento_pescoco', color: '#7c3aed', name: 'Ápice do Mento (Projeção)', recommendedProduct: 'acido_hialuronico', defaultDose: 1.0, doseUnit: 'ml' },
  { id: 'lm-c5', x: 40, y: 85, category: 'mento_pescoco', color: '#7c3aed', name: 'Borda Mentoniana Inferior D', recommendedProduct: 'acido_hialuronico', defaultDose: 0.5, doseUnit: 'ml' },
  { id: 'lm-c6', x: 60, y: 85, category: 'mento_pescoco', color: '#7c3aed', name: 'Borda Mentoniana Inferior E', recommendedProduct: 'acido_hialuronico', defaultDose: 0.5, doseUnit: 'ml' },
  { id: 'lm-c7', x: 33, y: 92, category: 'mento_pescoco', color: '#7c3aed', name: 'Platisma Banda Lateral D', recommendedProduct: 'botox', defaultDose: 3, doseUnit: 'U' },
  { id: 'lm-c8', x: 43, y: 94, category: 'mento_pescoco', color: '#7c3aed', name: 'Platisma Banda Medial D', recommendedProduct: 'botox', defaultDose: 3, doseUnit: 'U' },
  { id: 'lm-c9', x: 57, y: 94, category: 'mento_pescoco', color: '#7c3aed', name: 'Platisma Banda Medial E', recommendedProduct: 'botox', defaultDose: 3, doseUnit: 'U' },
  { id: 'lm-c10', x: 67, y: 92, category: 'mento_pescoco', color: '#7c3aed', name: 'Platisma Banda Lateral E', recommendedProduct: 'botox', defaultDose: 3, doseUnit: 'U' }
];

interface AnatomicalOverlayProps {
  showGuidelines: boolean;
  showLandmarks: boolean;
  onSelectLandmark?: (landmark: LandmarkDot) => void;
  hoveredLandmarkId?: string | null;
  setHoveredLandmarkId?: (id: string | null) => void;
}

export const AnatomicalOverlay: React.FC<AnatomicalOverlayProps> = ({
  showGuidelines,
  showLandmarks,
  onSelectLandmark,
  hoveredLandmarkId,
  setHoveredLandmarkId
}) => {
  return (
    <g id="anatomical-layer-group" className="pointer-events-auto">
      {/* 1. GEOMETRIC VECTORS & BUTTERFLY GUIDE LINES */}
      {showGuidelines && (
        <g id="facial-vectors" stroke="#3b82f6" strokeOpacity="0.45" strokeWidth="0.85" fill="none">
          {/* Superior Frontal Arch */}
          <path d="M 104 75 C 136 45, 264 45, 296 75" strokeDasharray="3 2" />
          <line x1="200" y1="45" x2="200" y2="475" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="0.75" />

          {/* Butterfly Glabella & Forehead Wings */}
          <path d="M 200 140 C 180 100, 120 75, 104 110 C 95 130, 110 160, 160 170 C 180 174, 200 165, 200 140 Z" />
          <path d="M 200 140 C 220 100, 280 75, 296 110 C 305 130, 290 160, 240 170 C 220 174, 200 165, 200 140 Z" />

          {/* Glabella to Corrugator Vectors */}
          <line x1="200" y1="140" x2="176" y2="170" />
          <line x1="200" y1="140" x2="224" y2="170" />
          <line x1="176" y1="170" x2="148" y2="135" />
          <line x1="224" y1="170" x2="252" y2="135" />

          {/* Concentric Orbicularis Oculi Arcs (Left Eye) */}
          <ellipse cx="132" cy="205" rx="55" ry="32" stroke="#d946ef" strokeOpacity="0.4" strokeDasharray="3 3" />
          <path d="M 80 190 C 72 215, 90 245, 132 250" stroke="#d946ef" strokeOpacity="0.5" />

          {/* Concentric Orbicularis Oculi Arcs (Right Eye) */}
          <ellipse cx="268" cy="205" rx="55" ry="32" stroke="#d946ef" strokeOpacity="0.4" strokeDasharray="3 3" />
          <path d="M 320 190 C 328 215, 310 245, 268 250" stroke="#d946ef" strokeOpacity="0.5" />

          {/* Paranasal & Nasolabial Diamond */}
          <polygon points="200,210 176,260 200,270 224,260" stroke="#16a34a" strokeOpacity="0.5" />
          <path d="M 168 260 C 150 295, 142 345, 138 375" stroke="#ea580c" strokeOpacity="0.5" />
          <path d="M 232 260 C 250 295, 258 345, 262 375" stroke="#ea580c" strokeOpacity="0.5" />

          {/* Zygomatic Traction Vectors (Malar) */}
          <line x1="96" y1="230" x2="168" y2="295" stroke="#ea580c" strokeOpacity="0.45" strokeDasharray="2 2" />
          <line x1="304" y1="230" x2="232" y2="295" stroke="#ea580c" strokeOpacity="0.45" strokeDasharray="2 2" />

          {/* Mandibular / Masseter / Marionette Lines */}
          <path d="M 136 345 C 136 380, 160 410, 200 410 C 240 410, 264 380, 264 345" stroke="#ea580c" strokeOpacity="0.4" />
          <circle cx="200" cy="425" r="28" stroke="#7c3aed" strokeOpacity="0.5" strokeDasharray="3 2" />
          <line x1="200" y1="397" x2="200" y2="453" stroke="#7c3aed" strokeOpacity="0.5" />
          <line x1="172" y1="425" x2="228" y2="425" stroke="#7c3aed" strokeOpacity="0.5" />

          {/* Neck / Platysmal Band Tension Lines */}
          <line x1="132" y1="455" x2="145" y2="495" stroke="#7c3aed" strokeOpacity="0.35" strokeDasharray="2 2" />
          <line x1="172" y1="465" x2="175" y2="495" stroke="#7c3aed" strokeOpacity="0.35" strokeDasharray="2 2" />
          <line x1="228" y1="465" x2="225" y2="495" stroke="#7c3aed" strokeOpacity="0.35" strokeDasharray="2 2" />
          <line x1="268" y1="455" x2="255" y2="495" stroke="#7c3aed" strokeOpacity="0.35" strokeDasharray="2 2" />
        </g>
      )}

      {/* 2. STANDARDIZED CLINICAL LANDMARKS FROM REFERENCE IMAGES */}
      {showLandmarks && (
        <g id="anatomical-dots">
          {ANATOMICAL_LANDMARKS.map((lm) => {
            const svgX = (lm.x / 100) * 400;
            const svgY = (lm.y / 100) * 500;
            const isHovered = hoveredLandmarkId === lm.id;

            return (
              <g
                key={lm.id}
                id={`ref-landmark-${lm.id}`}
                className="cursor-pointer transition-all duration-150 group"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLandmark?.(lm);
                }}
                onMouseEnter={() => setHoveredLandmarkId?.(lm.id)}
                onMouseLeave={() => setHoveredLandmarkId?.(null)}
              >
                {/* Glow ring on hover */}
                {isHovered && (
                  <circle
                    cx={svgX}
                    cy={svgY}
                    r="8"
                    fill={lm.color}
                    fillOpacity="0.3"
                    stroke={lm.color}
                    strokeWidth="1.5"
                    className="animate-ping"
                  />
                )}

                {/* Outer Ring */}
                <circle
                  cx={svgX}
                  cy={svgY}
                  r={isHovered ? "5.5" : "4"}
                  fill="#ffffff"
                  stroke={lm.color}
                  strokeWidth="1.8"
                />

                {/* Inner Core */}
                <circle
                  cx={svgX}
                  cy={svgY}
                  r={isHovered ? "3.2" : "2.2"}
                  fill={lm.color}
                />
              </g>
            );
          })}
        </g>
      )}
    </g>
  );
};
