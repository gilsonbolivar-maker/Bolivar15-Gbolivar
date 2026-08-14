import React from 'react';

interface MaleFaceModelProps {
  opacity?: number;
}

export const MaleFaceModel: React.FC<MaleFaceModelProps> = ({ opacity = 1 }) => {
  return (
    <g id="male-face-vector-model" style={{ opacity }}>
      <defs>
        {/* Male skin tone gradient */}
        <radialGradient id="mascSkinGrad" cx="50%" cy="46%" r="52%" fx="50%" fy="42%">
          <stop offset="0%" stopColor="#fff8f5" />
          <stop offset="45%" stopColor="#faebe3" />
          <stop offset="85%" stopColor="#eed0c2" />
          <stop offset="100%" stopColor="#dfb7a5" />
        </radialGradient>

        <linearGradient id="mascHairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2c221e" />
          <stop offset="40%" stopColor="#45352f" />
          <stop offset="80%" stopColor="#2c221e" />
          <stop offset="100%" stopColor="#1a1412" />
        </linearGradient>

        <linearGradient id="mascLipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f48482" />
          <stop offset="50%" stopColor="#e87070" />
          <stop offset="100%" stopColor="#d15555" />
        </linearGradient>

        <radialGradient id="mascEyeIris" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="60%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </radialGradient>

        {/* Stubble / 5 o'clock shadow pattern */}
        <pattern id="stubblePattern" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.4" fill="#382d27" opacity="0.35" />
          <circle cx="5" cy="5" r="0.35" fill="#382d27" opacity="0.25" />
        </pattern>
      </defs>

      {/* 1. Hair - Textured masculine modern volume hairstyle */}
      <path
        d="M 200 12 C 145 10, 80 50, 68 140 C 60 200, 64 250, 70 290 L 70 410 C 95 425, 120 450, 110 500 L 290 500 C 280 450, 305 425, 330 410 L 330 290 C 336 250, 340 200, 332 140 C 320 50, 255 10, 200 12 Z"
        fill="url(#mascHairGrad)"
      />

      {/* Hair Texture strands on top & sides */}
      <path d="M 200 12 Q 160 40 140 100" stroke="#604b42" strokeWidth="2.2" fill="none" />
      <path d="M 180 14 Q 130 55 110 120" stroke="#604b42" strokeWidth="2" fill="none" />
      <path d="M 220 14 Q 270 55 290 120" stroke="#604b42" strokeWidth="2" fill="none" />
      <path d="M 200 12 Q 240 40 260 100" stroke="#604b42" strokeWidth="2.2" fill="none" />
      <path d="M 140 30 Q 180 60 210 30" stroke="#604b42" strokeWidth="1.8" fill="none" />

      {/* 2. Wider Masculine Neck & Trapezius */}
      <path
        d="M 134 380 C 130 435, 115 470, 95 500 L 305 500 C 285 470, 270 435, 266 380 Z"
        fill="#e6c6b8"
        stroke="#c49d8f"
        strokeWidth="1.3"
      />
      {/* Adam's Apple & Neck Tension Lines */}
      <path d="M 194 438 L 200 445 L 206 438" stroke="#b48879" strokeWidth="1.5" fill="none" />
      <path d="M 142 410 Q 136 470 105 500" stroke="#cfa89a" strokeWidth="1.3" fill="none" />
      <path d="M 258 410 Q 264 470 295 500" stroke="#cfa89a" strokeWidth="1.3" fill="none" />

      {/* 3. Masculine Ears */}
      <path d="M 76 195 C 55 205, 54 275, 78 290" fill="#f2dbcf" stroke="#c49d8f" strokeWidth="1.5" />
      <path d="M 74 220 C 66 235, 66 265, 74 275" stroke="#cfa89a" strokeWidth="1" fill="none" />
      <path d="M 324 195 C 345 205, 346 275, 322 290" fill="#f2dbcf" stroke="#c49d8f" strokeWidth="1.5" />
      <path d="M 326 220 C 334 235, 334 265, 326 275" stroke="#cfa89a" strokeWidth="1" fill="none" />

      {/* 4. Chiseled Masculine Facial Contour (Squared Jaw & Gonial Angle) */}
      <path
        d="M 200 78 C 125 78, 78 145, 78 235 C 78 300, 92 345, 114 380 C 130 405, 160 424, 180 428 L 220 428 C 240 424, 270 405, 286 380 C 308 345, 322 300, 322 235 C 322 145, 275 78, 200 78 Z"
        fill="url(#mascSkinGrad)"
        stroke="#bfa094"
        strokeWidth="2"
      />

      {/* Hairline Boundary */}
      <path
        d="M 80 170 C 88 120, 130 92, 200 92 C 270 92, 312 120, 320 170 C 316 135, 275 102, 200 102 C 125 102, 84 135, 80 170 Z"
        fill="#2c221e"
        opacity="0.5"
      />

      {/* 5. Stubble & Shadow (Jawline & Chin) */}
      <path
        d="M 112 340 C 112 375, 135 415, 180 428 L 220 428 C 265 415, 288 375, 288 340 C 270 380, 240 405, 200 405 C 160 405, 130 380, 112 340 Z"
        fill="url(#stubblePattern)"
      />
      {/* Upper lip light stubble */}
      <path d="M 165 330 C 180 324, 220 324, 235 330 C 225 342, 175 342, 165 330 Z" fill="url(#stubblePattern)" />

      {/* 6. Masculine Eyebrows (Strong, Straight & Defined) */}
      {/* Left Eyebrow */}
      <path
        d="M 108 185 C 135 174, 165 174, 188 184 C 168 181, 135 181, 108 185 Z"
        fill="#2b201b"
        stroke="#1a1412"
        strokeWidth="1.2"
      />
      {/* Right Eyebrow */}
      <path
        d="M 292 185 C 265 174, 235 174, 212 184 C 232 181, 265 181, 292 185 Z"
        fill="#2b201b"
        stroke="#1a1412"
        strokeWidth="1.2"
      />

      {/* 7. Masculine Eyes */}
      {/* Left Eye */}
      <g id="masc-left-eye">
        <path d="M 120 206 C 136 195, 166 195, 180 206 C 166 218, 136 218, 120 206 Z" fill="#ffffff" stroke="#48362f" strokeWidth="1.5" />
        <circle cx="150" cy="206" r="9" fill="url(#mascEyeIris)" />
        <circle cx="150" cy="206" r="4.2" fill="#0f172a" />
        <circle cx="153" cy="203" r="1.6" fill="#ffffff" />
        {/* Brow Ridge Shadow */}
        <path d="M 115 198 Q 150 190 182 198" fill="none" stroke="#b48879" strokeWidth="1.3" />
      </g>

      {/* Right Eye */}
      <g id="masc-right-eye">
        <path d="M 220 206 C 234 195, 264 195, 280 206 C 264 218, 234 218, 220 206 Z" fill="#ffffff" stroke="#48362f" strokeWidth="1.5" />
        <circle cx="250" cy="206" r="9" fill="url(#mascEyeIris)" />
        <circle cx="250" cy="206" r="4.2" fill="#0f172a" />
        <circle cx="253" cy="203" r="1.6" fill="#ffffff" />
        {/* Brow Ridge Shadow */}
        <path d="M 218 198 Q 250 190 285 198" fill="none" stroke="#b48879" strokeWidth="1.3" />
      </g>

      {/* 8. Masculine Nose Bridge & Tip */}
      <path d="M 197 190 L 193 282 Q 200 290 207 282 L 203 190" fill="none" stroke="#c49d8f" strokeWidth="1.5" />
      <path d="M 182 280 C 176 284, 184 288, 192 286" fill="none" stroke="#b48879" strokeWidth="1.5" />
      <path d="M 218 280 C 224 284, 216 288, 208 286" fill="none" stroke="#b48879" strokeWidth="1.5" />
      <circle cx="200" cy="282" r="5" fill="#f4dfd4" stroke="#c49d8f" strokeWidth="0.8" />

      {/* Philtrum */}
      <line x1="197" y1="290" x2="195" y2="340" stroke="#cfa89a" strokeWidth="1" />
      <line x1="203" y1="290" x2="205" y2="340" stroke="#cfa89a" strokeWidth="1" />

      {/* 9. Masculine Lips */}
      {/* Upper Lip */}
      <path
        d="M 156 348 C 172 342, 192 336, 198 340 C 200 342, 202 342, 204 340 C 210 336, 228 342, 244 348 C 230 355, 212 353, 200 353 C 188 353, 170 355, 156 348 Z"
        fill="url(#mascLipGrad)"
        stroke="#b84343"
        strokeWidth="1.3"
      />
      {/* Lower Lip */}
      <path
        d="M 156 348 C 170 354, 190 354, 200 354 C 210 354, 230 354, 244 348 C 236 374, 164 374, 156 348 Z"
        fill="url(#mascLipGrad)"
        stroke="#b84343"
        strokeWidth="1.3"
      />

      {/* 10. Defined Gonial Angle & Squared Chin */}
      <path d="M 180 405 L 220 405" stroke="#b48879" strokeWidth="1.8" />
      <path d="M 112 360 L 126 385" stroke="#b48879" strokeWidth="1.5" />
      <path d="M 288 360 L 274 385" stroke="#b48879" strokeWidth="1.5" />
    </g>
  );
};
