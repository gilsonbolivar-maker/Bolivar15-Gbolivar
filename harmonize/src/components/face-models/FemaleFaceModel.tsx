import React from 'react';

interface FemaleFaceModelProps {
  opacity?: number;
}

export const FemaleFaceModel: React.FC<FemaleFaceModelProps> = ({ opacity = 1 }) => {
  return (
    <g id="female-face-vector-model" style={{ opacity }}>
      <defs>
        {/* Soft feminine skin tone gradient */}
        <radialGradient id="femSkinGrad" cx="50%" cy="46%" r="52%" fx="50%" fy="42%">
          <stop offset="0%" stopColor="#fff8f5" />
          <stop offset="45%" stopColor="#faece6" />
          <stop offset="85%" stopColor="#f3d7cc" />
          <stop offset="100%" stopColor="#e8c2b3" />
        </radialGradient>

        <linearGradient id="femHairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3d332f" />
          <stop offset="35%" stopColor="#574640" />
          <stop offset="70%" stopColor="#3d332f" />
          <stop offset="100%" stopColor="#29211e" />
        </linearGradient>

        <linearGradient id="femLipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="50%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>

        <radialGradient id="femEyeIrisL" cx="48%" cy="48%" r="50%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="60%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </radialGradient>

        <radialGradient id="femEyeIrisR" cx="52%" cy="48%" r="50%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="60%" stopColor="#475569" />
          <stop offset="100%" stopColor="#334155" />
        </radialGradient>
      </defs>

      {/* 1. Hair Background & Sleek Ponytail/Bun Silhouette */}
      <path
        d="M 200 20 C 110 20, 60 90, 60 210 C 60 270, 72 320, 76 340 L 76 430 C 95 440, 115 470, 115 500 L 285 500 C 285 470, 305 440, 324 430 L 324 340 C 328 320, 340 270, 340 210 C 340 90, 290 20, 200 20 Z"
        fill="url(#femHairGrad)"
      />

      {/* Hair Texture strands */}
      <path d="M 200 20 Q 150 70 120 140" stroke="#71584f" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M 200 20 Q 250 70 280 140" stroke="#71584f" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M 180 22 Q 130 80 100 160" stroke="#71584f" strokeWidth="1.2" fill="none" opacity="0.5" />
      <path d="M 220 22 Q 270 80 300 160" stroke="#71584f" strokeWidth="1.2" fill="none" opacity="0.5" />

      {/* 2. Neck & Shoulders (Delicate feminine curves) */}
      <path
        d="M 148 390 C 145 440, 130 475, 110 500 L 290 500 C 270 475, 255 440, 252 390 Z"
        fill="#edd1c4"
        stroke="#cfaba0"
        strokeWidth="1.2"
      />
      {/* Clavicle / Sternocleidomastoid subtle shadows */}
      <path d="M 152 420 Q 148 480 120 500" stroke="#dfb6a5" strokeWidth="1.2" fill="none" />
      <path d="M 248 420 Q 252 480 280 500" stroke="#dfb6a5" strokeWidth="1.2" fill="none" />
      <path d="M 175 490 Q 200 498 225 490" stroke="#d5a593" strokeWidth="1.2" fill="none" />

      {/* 3. Ears */}
      <path d="M 82 205 C 65 215, 66 270, 84 285" fill="#f6e1d7" stroke="#cfaba0" strokeWidth="1.5" />
      <path d="M 80 230 C 74 240, 74 260, 80 270" stroke="#dfb6a5" strokeWidth="1" fill="none" />
      <path d="M 318 205 C 335 215, 334 270, 316 285" fill="#f6e1d7" stroke="#cfaba0" strokeWidth="1.5" />
      <path d="M 320 230 C 326 240, 326 260, 320 270" stroke="#dfb6a5" strokeWidth="1" fill="none" />

      {/* 4. Feminine Facial Contour (Smooth Oval) */}
      <path
        d="M 200 68 C 118 68, 82 145, 82 245 C 82 320, 116 395, 162 432 C 182 444, 200 446, 218 444 C 264 412, 318 320, 318 245 C 318 145, 282 68, 200 68 Z"
        fill="url(#femSkinGrad)"
        stroke="#cfaba0"
        strokeWidth="1.8"
      />

      {/* Hairline framing (Forehead curve) */}
      <path
        d="M 84 185 C 92 115, 140 78, 200 78 C 260 78, 308 115, 316 185 C 314 140, 275 88, 200 88 C 125 88, 86 140, 84 185 Z"
        fill="#3d332f"
        opacity="0.4"
      />

      {/* 5. Malar / Cheek Highlights (Soft Blush) */}
      <ellipse cx="130" cy="275" rx="32" ry="20" fill="#f43f5e" fillOpacity="0.08" />
      <ellipse cx="270" cy="275" rx="32" ry="20" fill="#f43f5e" fillOpacity="0.08" />

      {/* 6. Feminine Eyebrows (Arched & Elegant) */}
      {/* Left Eyebrow */}
      <path
        d="M 115 186 C 135 170, 165 168, 185 180 C 165 174, 138 177, 115 186 Z"
        fill="#3d2c25"
      />
      {/* Right Eyebrow */}
      <path
        d="M 285 186 C 265 170, 235 168, 215 180 C 235 174, 262 177, 285 186 Z"
        fill="#3d2c25"
      />

      {/* 7. Eyes (Expressive Feminine Eyes with Lashes & Iris) */}
      {/* Left Eye */}
      <g id="fem-left-eye">
        <path d="M 122 205 C 138 190, 168 190, 182 206 C 168 220, 138 220, 122 205 Z" fill="#ffffff" stroke="#523e37" strokeWidth="1.4" />
        <circle cx="152" cy="205" r="9.5" fill="url(#femEyeIrisL)" />
        <circle cx="152" cy="205" r="4.5" fill="#0f172a" />
        <circle cx="155" cy="202" r="1.8" fill="#ffffff" />
        {/* Upper eyelid crease */}
        <path d="M 122 196 Q 152 187 180 198" fill="none" stroke="#cfaba0" strokeWidth="1.2" />
        {/* Lashes */}
        <path d="M 122 205 Q 152 188 184 204" fill="none" stroke="#29211e" strokeWidth="1.6" />
      </g>

      {/* Right Eye */}
      <g id="fem-right-eye">
        <path d="M 218 206 C 232 190, 262 190, 278 205 C 262 220, 232 220, 218 206 Z" fill="#ffffff" stroke="#523e37" strokeWidth="1.4" />
        <circle cx="248" cy="205" r="9.5" fill="url(#femEyeIrisR)" />
        <circle cx="248" cy="205" r="4.5" fill="#0f172a" />
        <circle cx="251" cy="202" r="1.8" fill="#ffffff" />
        {/* Upper eyelid crease */}
        <path d="M 220 198 Q 248 187 278 196" fill="none" stroke="#cfaba0" strokeWidth="1.2" />
        {/* Lashes */}
        <path d="M 216 204 Q 248 188 278 205" fill="none" stroke="#29211e" strokeWidth="1.6" />
      </g>

      {/* 8. Delicate Nose */}
      <path d="M 197 195 Q 194 260 188 285 Q 200 293 212 285 Q 206 260 203 195" fill="none" stroke="#d5b0a3" strokeWidth="1.3" />
      {/* Nostril curves & tip */}
      <path d="M 183 283 C 178 286, 185 291, 192 288" fill="none" stroke="#bfa094" strokeWidth="1.4" />
      <path d="M 217 283 C 222 286, 215 291, 208 288" fill="none" stroke="#bfa094" strokeWidth="1.4" />
      <circle cx="200" cy="284" r="4.5" fill="#f8e5dc" stroke="#cfaba0" strokeWidth="0.8" />

      {/* Philtrum */}
      <line x1="197" y1="293" x2="195" y2="340" stroke="#dfb6a5" strokeWidth="0.9" />
      <line x1="203" y1="293" x2="205" y2="340" stroke="#dfb6a5" strokeWidth="0.9" />

      {/* 9. Feminine Full Lips (Cupid's Bow) */}
      {/* Upper Lip */}
      <path
        d="M 158 352 C 174 345, 192 338, 198 343 C 200 345, 202 345, 204 343 C 210 338, 228 345, 244 352 C 230 361, 212 358, 200 358 C 188 358, 170 361, 158 352 Z"
        fill="url(#femLipGrad)"
        stroke="#be123c"
        strokeWidth="1.2"
      />
      {/* Lower Lip */}
      <path
        d="M 158 352 C 172 360, 190 360, 200 360 C 210 360, 228 360, 244 352 C 234 380, 168 380, 158 352 Z"
        fill="url(#femLipGrad)"
        stroke="#be123c"
        strokeWidth="1.2"
      />
      {/* Lip Highlight */}
      <ellipse cx="200" cy="364" rx="14" ry="4" fill="#ffffff" fillOpacity="0.3" />

      {/* 10. Chin & Jawline Definition */}
      <path d="M 184 405 Q 200 414 216 405" fill="none" stroke="#cfaba0" strokeWidth="1.2" />
    </g>
  );
};
