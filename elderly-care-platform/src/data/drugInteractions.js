export const KNOWN_DRUG_DATABASE = [
  { id: "metformin", name: "Metformin / Glycomet", class: "Biguanide Antidiabetic" },
  { id: "telmisartan", name: "Telmisartan / Telmikind", class: "Angiotensin II Receptor Blocker (ARB)" },
  { id: "amlodipine", name: "Amlodipine", class: "Calcium Channel Blocker" },
  { id: "rosuvastatin", name: "Rosuvastatin / Rosuvas", class: "HMG-CoA Reductase Inhibitor (Statin)" },
  { id: "linagliptin", name: "Linagliptin / Trajenta", class: "DPP-4 Inhibitor" },
  { id: "calcium_vitd", name: "Shelcal-HD (Calcium + Vit D3)", class: "Mineral & Vitamin Supplement" },
  { id: "aspirin", name: "Ecosprin / Aspirin", class: "Antiplatelet / Blood Thinner" },
  { id: "ibuprofen", name: "Ibuprofen / Brufen", class: "NSAID Analgesic" },
  { id: "pantoprazole", name: "Pantoprazole / Pan-D", class: "Proton Pump Inhibitor (Antacid)" },
  { id: "warfarin", name: "Warfarin", class: "Anticoagulant" },
  { id: "spironolactone", name: "Spironolactone / Aldactone", class: "Potassium-Sparing Diuretic" }
];

export const INTERACTION_RULES = [
  {
    drugs: ["telmisartan", "spironolactone"],
    severity: "HIGH",
    title: "Severe Hyperkalemia Risk",
    clinical: "Combined ARB and potassium-sparing diuretic can cause dangerously high serum potassium levels.",
    plainLanguageAdvice: "DO NOT take together without regular blood electrolyte testing. Can cause heart rhythm disturbances in elderly individuals.",
    action: "Consult Dr. Arvind Swaminathan for kidney panel (serum potassium & creatinine)."
  },
  {
    drugs: ["aspirin", "ibuprofen"],
    severity: "HIGH",
    title: "Increased Gastrointestinal Bleeding Risk",
    clinical: "Co-administration of multiple NSAIDs/antiplatelets increases peptic ulceration and GI hemorrhage.",
    plainLanguageAdvice: "Avoid taking Brufen/Ibuprofen for joint pain if you take daily blood thinners like Ecosprin. Use paracetamol with warm compress instead.",
    action: "Substitute with Paracetamol 650mg for knee ache after doctor approval."
  },
  {
    drugs: ["rosuvastatin", "pantoprazole"],
    severity: "MODERATE",
    title: "Reduced Statin Bioavailability",
    clinical: "Antacids and PPIs can slightly alter gastric pH, interfering with optimal rosuvastatin absorption if taken simultaneously.",
    plainLanguageAdvice: "Take Pantocid/Pan-D in the morning before breakfast, and take Rosuvas in the evening after dinner. Keep them at least 10 hours apart.",
    action: "Schedule Pan-D at 7:30 AM (empty stomach) and Rosuvas at 8:00 PM."
  },
  {
    drugs: ["telmisartan", "amlodipine"],
    severity: "BENEFICIAL_SYNERGY",
    title: "Clinically Verified Synergistic BP Control",
    clinical: "Fixed-dose combination produces complementary vasodilation via ARB + CCB pathways with reduced peripheral edema.",
    plainLanguageAdvice: "This is a doctor-prescribed combination (Telmikind-AM). Safe and highly effective for maintaining blood pressure below 130/80 mmHg.",
    action: "Continue morning dose at 9:00 AM after breakfast."
  },
  {
    drugs: ["metformin", "linagliptin"],
    severity: "BENEFICIAL_SYNERGY",
    title: "Complementary Glycemic Management",
    clinical: "Metformin decreases hepatic glucose production while linagliptin increases insulin secretion in a glucose-dependent manner.",
    plainLanguageAdvice: "Excellent combination for blood sugar control with very low risk of sudden sugar drops (hypoglycemia).",
    action: "Maintain prescribed meal timings."
  },
  {
    drugs: ["calcium_vitd", "rosuvastatin"],
    severity: "LOW",
    title: "Absorption Buffer Window",
    clinical: "High calcium intake at identical minute can mildly compete with weak-acid drug absorption.",
    plainLanguageAdvice: "Take Shelcal-HD with afternoon lunch and Rosuvas at night after dinner. 6 hours separation is ideal.",
    action: "Already optimized in current schedule (1:30 PM vs 8:00 PM)."
  }
];

export function checkInteractionsForList(selectedDrugIds) {
  const found = [];
  for (let i = 0; i < selectedDrugIds.length; i++) {
    for (let j = i + 1; j < selectedDrugIds.length; j++) {
      const d1 = selectedDrugIds[i];
      const d2 = selectedDrugIds[j];
      const rule = INTERACTION_RULES.find(
        r => (r.drugs[0] === d1 && r.drugs[1] === d2) || (r.drugs[0] === d2 && r.drugs[1] === d1)
      );
      if (rule) {
        found.push(rule);
      }
    }
  }
  return found;
}
