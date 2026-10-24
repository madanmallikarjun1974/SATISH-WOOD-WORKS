/* ==========================================================================
   PRICE LIST for the Instant Quote Estimator  (English + Kannada)
   --------------------------------------------------------------------------
   ➜ The shop owner edits ONLY this file to change prices.
   ➜ Every "rate" is in Rupees per SQUARE FOOT of the item (width x height, or length x breadth).
   ➜ Add-ons: type 'sqft' = rupees per sq ft, type 'flat' = rupees per item.
   ➜ !! The numbers below are SAMPLE rates so the tool can be shown. Put your real rates in
        and then change   sample: true   to   sample: false   (this hides the "sample rates" badge).
   ========================================================================== */
window.SWW_RATES = {
  sample: true,
  gstPercent: 18,      // GST added only when the customer ticks "Include GST"
  rangePercent: 10,    // the customer sees "approx. total" and a range of +/- this percent
  validDays: 7,        // how many days the quotation PDF stays valid

  categories: [
    {
      id: 'kitchen', name: { en: 'Modular Kitchen', kn: 'ಮಾಡ್ಯುಲರ್ ಕಿಚನ್' },
      d1: { en: 'Kitchen run length', kn: 'ಕಿಚನ್ ಉದ್ದ', def: 10 }, d2: { en: 'Height (base + wall units)', kn: 'ಎತ್ತರ (ಕೆಳಗಿನ + ಮೇಲಿನ ಕಪಾಟು)', def: 7 },
      materials: [
        { id: 'lam', name: { en: 'Laminate on BWP plywood', kn: 'ಲ್ಯಾಮಿನೇಟ್ (ಬಿಡಬ್ಲ್ಯೂಪಿ ಪ್ಲೈವುಡ್)' }, rate: 1400 },
        { id: 'acr', name: { en: 'Acrylic finish', kn: 'ಅಕ್ರಿಲಿಕ್ ಫಿನಿಶ್' }, rate: 1900 },
        { id: 'pu', name: { en: 'PU / Duco paint finish', kn: 'ಪಿಯು / ಡ್ಯುಕೋ ಪೇಂಟ್ ಫಿನಿಶ್' }, rate: 2300 }
      ],
      addons: [
        { id: 'soft', name: { en: 'Soft-close channels & hinges', kn: 'ಸಾಫ್ಟ್-ಕ್ಲೋಸ್ ಚಾನೆಲ್ ಮತ್ತು ಹಿಂಜ್' }, type: 'sqft', rate: 100 },
        { id: 'led', name: { en: 'Under-cabinet LED lighting', kn: 'ಕಪಾಟಿನ ಕೆಳಗೆ ಎಲ್ಇಡಿ ದೀಪ' }, type: 'sqft', rate: 60 },
        { id: 'pantry', name: { en: 'Pantry pull-out unit', kn: 'ಪ್ಯಾಂಟ್ರಿ ಪುಲ್-ಔಟ್ ಯೂನಿಟ್' }, type: 'flat', rate: 9000 }
      ]
    },
    {
      id: 'wardrobe', name: { en: 'Wardrobe', kn: 'ವಾರ್ಡ್‌ರೋಬ್ (ಬಟ್ಟೆ ಕಪಾಟು)' },
      d1: { en: 'Width', kn: 'ಅಗಲ', def: 6 }, d2: { en: 'Height', kn: 'ಎತ್ತರ', def: 7 },
      materials: [
        { id: 'lam', name: { en: 'Laminate on MR plywood', kn: 'ಲ್ಯಾಮಿನೇಟ್ (ಎಂಆರ್ ಪ್ಲೈವುಡ್)' }, rate: 950 },
        { id: 'bwp', name: { en: 'Laminate on BWP plywood', kn: 'ಲ್ಯಾಮಿನೇಟ್ (ಬಿಡಬ್ಲ್ಯೂಪಿ ಪ್ಲೈವುಡ್)' }, rate: 1250 },
        { id: 'acr', name: { en: 'Acrylic / PU finish', kn: 'ಅಕ್ರಿಲಿಕ್ / ಪಿಯು ಫಿನಿಶ್' }, rate: 1700 },
        { id: 'ven', name: { en: 'Teak veneer', kn: 'ತೇಗದ ವೆನೀರ್' }, rate: 2100 },
        { id: 'teak', name: { en: 'Solid teak wood', kn: 'ಶುದ್ಧ ತೇಗದ ಮರ' }, rate: 3200 }
      ],
      addons: [
        { id: 'slide', name: { en: 'Sliding shutters', kn: 'ಸ್ಲೈಡಿಂಗ್ ಶಟರ್' }, type: 'sqft', rate: 250 },
        { id: 'mirror', name: { en: 'Full-length mirror', kn: 'ಪೂರ್ಣ ಉದ್ದದ ಕನ್ನಡಿ' }, type: 'flat', rate: 3500 },
        { id: 'light', name: { en: 'Inside LED lights', kn: 'ಒಳಗೆ ಎಲ್ಇಡಿ ದೀಪ' }, type: 'sqft', rate: 50 }
      ]
    },
    {
      id: 'ceiling', name: { en: 'False Ceiling', kn: 'ಫಾಲ್ಸ್ ಸೀಲಿಂಗ್' },
      d1: { en: 'Room length', kn: 'ಕೋಣೆಯ ಉದ್ದ', def: 12 }, d2: { en: 'Room breadth', kn: 'ಕೋಣೆಯ ಅಗಲ', def: 10 },
      materials: [
        { id: 'pop', name: { en: 'POP (plaster of Paris)', kn: 'ಪಿಒಪಿ' }, rate: 70 },
        { id: 'gyp', name: { en: 'Gypsum board', kn: 'ಜಿಪ್ಸಮ್ ಬೋರ್ಡ್' }, rate: 95 },
        { id: 'pvc', name: { en: 'PVC panels', kn: 'ಪಿವಿಸಿ ಪ್ಯಾನೆಲ್' }, rate: 85 },
        { id: 'wood', name: { en: 'Wooden panel ceiling', kn: 'ಮರದ ಪ್ಯಾನೆಲ್ ಸೀಲಿಂಗ್' }, rate: 380 }
      ],
      addons: [
        { id: 'cove', name: { en: 'Cove with LED strip', kn: 'ಕೋವ್ ಜೊತೆ ಎಲ್ಇಡಿ ಸ್ಟ್ರಿಪ್' }, type: 'sqft', rate: 45 },
        { id: 'paint', name: { en: 'Paint finish', kn: 'ಪೇಂಟ್ ಫಿನಿಶ್' }, type: 'sqft', rate: 25 }
      ]
    },
    {
      id: 'tv', name: { en: 'TV Unit', kn: 'ಟಿವಿ ಯೂನಿಟ್' },
      d1: { en: 'Width', kn: 'ಅಗಲ', def: 7 }, d2: { en: 'Height', kn: 'ಎತ್ತರ', def: 5 },
      materials: [
        { id: 'lam', name: { en: 'Laminate finish', kn: 'ಲ್ಯಾಮಿನೇಟ್ ಫಿನಿಶ್' }, rate: 950 },
        { id: 'flute', name: { en: 'Fluted / louvered wood panelling', kn: 'ಫ್ಲೂಟೆಡ್ / ಲೌವರ್ ಮರದ ಪ್ಯಾನೆಲಿಂಗ್' }, rate: 1800 },
        { id: 'ven', name: { en: 'Veneer finish', kn: 'ವೆನೀರ್ ಫಿನಿಶ್' }, rate: 1450 },
        { id: 'teak', name: { en: 'Solid wood', kn: 'ಶುದ್ಧ ಮರ' }, rate: 2300 }
      ],
      addons: [
        { id: 'back', name: { en: 'Backlit LED panel', kn: 'ಬ್ಯಾಕ್‌ಲಿಟ್ ಎಲ್ಇಡಿ ಪ್ಯಾನೆಲ್' }, type: 'sqft', rate: 70 },
        { id: 'draw', name: { en: 'Storage drawers', kn: 'ಸ್ಟೋರೇಜ್ ಡ್ರಾಯರ್' }, type: 'sqft', rate: 150 }
      ]
    },
    {
      id: 'window', name: { en: 'Windows', kn: 'ಕಿಟಕಿಗಳು' },
      d1: { en: 'Width', kn: 'ಅಗಲ', def: 4 }, d2: { en: 'Height', kn: 'ಎತ್ತರ', def: 4 },
      materials: [
        { id: 'alu', name: { en: 'Aluminium', kn: 'ಅಲ್ಯೂಮಿನಿಯಂ' }, rate: 450 },
        { id: 'upvc', name: { en: 'UPVC', kn: 'ಯುಪಿವಿಸಿ' }, rate: 650 },
        { id: 'sal', name: { en: 'Sal wood', kn: 'ಸಾಲ್ ಮರ' }, rate: 900 },
        { id: 'teak', name: { en: 'Teak wood', kn: 'ತೇಗದ ಮರ' }, rate: 1500 }
      ],
      addons: [
        { id: 'mesh', name: { en: 'Mosquito mesh', kn: 'ಸೊಳ್ಳೆ ಜಾಲರಿ' }, type: 'sqft', rate: 60 },
        { id: 'grill', name: { en: 'MS safety grill', kn: 'ಎಂಎಸ್ ಸುರಕ್ಷತಾ ಗ್ರಿಲ್' }, type: 'sqft', rate: 120 }
      ]
    },
    {
      id: 'door', name: { en: 'Doors', kn: 'ಬಾಗಿಲುಗಳು' },
      d1: { en: 'Width', kn: 'ಅಗಲ', def: 3 }, d2: { en: 'Height', kn: 'ಎತ್ತರ', def: 7 },
      materials: [
        { id: 'flush', name: { en: 'Flush door', kn: 'ಫ್ಲಶ್ ಡೋರ್' }, rate: 350 },
        { id: 'sal', name: { en: 'Sal wood panel door', kn: 'ಸಾಲ್ ಮರದ ಪ್ಯಾನೆಲ್ ಬಾಗಿಲು' }, rate: 900 },
        { id: 'teak', name: { en: 'Teak panel door', kn: 'ತೇಗದ ಪ್ಯಾನೆಲ್ ಬಾಗಿಲು' }, rate: 1800 },
        { id: 'carved', name: { en: 'Hand-carved teak door', kn: 'ಕೈಯಿಂದ ಕೆತ್ತಿದ ತೇಗದ ಬಾಗಿಲು' }, rate: 3200 }
      ],
      addons: [
        { id: 'frame', name: { en: 'Wooden door frame', kn: 'ಮರದ ಬಾಗಿಲು ಚೌಕಟ್ಟು' }, type: 'flat', rate: 6500 },
        { id: 'lock', name: { en: 'Lock & handle fitting', kn: 'ಲಾಕ್ ಮತ್ತು ಹ್ಯಾಂಡಲ್ ಅಳವಡಿಕೆ' }, type: 'flat', rate: 800 }
      ]
    },
    {
      id: 'pooja', name: { en: 'Pooja Unit', kn: 'ಪೂಜಾ ಮಂಟಪ' },
      d1: { en: 'Width', kn: 'ಅಗಲ', def: 3 }, d2: { en: 'Height', kn: 'ಎತ್ತರ', def: 4 },
      materials: [
        { id: 'lam', name: { en: 'Laminate finish', kn: 'ಲ್ಯಾಮಿನೇಟ್ ಫಿನಿಶ್' }, rate: 1250 },
        { id: 'mdf', name: { en: 'Carved MDF', kn: 'ಕೆತ್ತನೆಯ ಎಂಡಿಎಫ್' }, rate: 2000 },
        { id: 'teak', name: { en: 'Carved teak wood', kn: 'ಕೆತ್ತನೆಯ ತೇಗದ ಮರ' }, rate: 3500 }
      ],
      addons: [
        { id: 'led', name: { en: 'LED backlight', kn: 'ಎಲ್ಇಡಿ ಬ್ಯಾಕ್‌ಲೈಟ್' }, type: 'sqft', rate: 100 },
        { id: 'jaali', name: { en: 'Jaali doors', kn: 'ಜಾಲಿ ಬಾಗಿಲು' }, type: 'sqft', rate: 200 }
      ]
    }
  ]
};
