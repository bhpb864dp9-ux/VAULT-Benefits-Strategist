/**
 * VAULT DEM Engine — Body Systems Database
 * Complete 15 systems with 93+ conditions per 38 CFR Part 4
 */

import type { BodySystem } from '../types';

export const BODY_SYSTEMS: BodySystem[] = [
  {
    id: 'mental',
    name: 'Mental Health',
    icon: 'brain',
    cfrSection: '§ 4.130',
    conditions: [
      { id: 'ptsd', name: 'PTSD', dbq: '21-0960A-1', ratings: [0, 10, 30, 50, 70, 100], presumptive: ['Combat'], keywords: ['trauma', 'nightmares', 'flashbacks', 'hypervigilance'], icd10: ['F43.10', 'F43.11', 'F43.12'] },
      { id: 'mdd', name: 'Major Depressive Disorder', dbq: '21-0960A-1', ratings: [0, 10, 30, 50, 70, 100], secondary: ['PTSD', 'Chronic Pain'], keywords: ['depression', 'sad', 'hopeless', 'suicidal'], icd10: ['F32', 'F33'] },
      { id: 'gad', name: 'Generalized Anxiety Disorder', dbq: '21-0960A-1', ratings: [0, 10, 30, 50, 70, 100], secondary: ['PTSD'], keywords: ['anxiety', 'worry', 'panic', 'nervous'], icd10: ['F41.1'] },
      { id: 'bipolar', name: 'Bipolar Disorder', dbq: '21-0960A-1', ratings: [0, 10, 30, 50, 70, 100], keywords: ['mania', 'mood swings', 'bipolar'], icd10: ['F31'] },
      { id: 'insomnia', name: 'Insomnia / Sleep Disorder', dbq: '21-0960A-1', ratings: [0, 10, 30, 50], secondary: ['PTSD', 'Chronic Pain', 'Sleep Apnea'], keywords: ['sleep', 'insomnia', 'cant sleep'] },
      { id: 'mst', name: 'Military Sexual Trauma (MST)', dbq: '21-0960A-1', ratings: [0, 10, 30, 50, 70, 100], keywords: ['sexual trauma', 'assault', 'harassment', 'mst'] },
      { id: 'adjustment', name: 'Adjustment Disorder', dbq: '21-0960A-1', ratings: [0, 10, 30, 50], keywords: ['adjustment', 'stress'] },
      { id: 'ocd', name: 'Obsessive-Compulsive Disorder', dbq: '21-0960A-1', ratings: [0, 10, 30, 50, 70, 100], keywords: ['ocd', 'obsessive', 'compulsive'] }
    ]
  },
  {
    id: 'musculoskeletal',
    name: 'Musculoskeletal',
    icon: 'bone',
    cfrSection: '§ 4.71a',
    conditions: [
      { id: 'lumbar', name: 'Lumbar Spine (Lower Back)', dbq: '21-0960M-14', ratings: [0, 10, 20, 40, 50, 100], keywords: ['back', 'lower back', 'spine', 'lumbar', 'degenerative'], icd10: ['M54.5', 'M51'] },
      { id: 'cervical', name: 'Cervical Spine (Neck)', dbq: '21-0960M-13', ratings: [0, 10, 20, 30, 40, 100], keywords: ['neck', 'cervical', 'whiplash'], icd10: ['M54.2'] },
      { id: 'thoracic', name: 'Thoracic Spine (Mid-Back)', dbq: '21-0960M-14', ratings: [0, 10, 20, 40], keywords: ['thoracic', 'mid back', 'upper back'] },
      { id: 'knee', name: 'Knee Condition', dbq: '21-0960M-9', ratings: [0, 10, 20, 30, 40, 50, 60], bilateralEligible: true, limbType: 'knee', keywords: ['knee', 'acl', 'meniscus', 'patella'], icd10: ['M17', 'S83'] },
      { id: 'hip', name: 'Hip Condition', dbq: '21-0960M-5', ratings: [0, 10, 20, 30, 40, 90], bilateralEligible: true, limbType: 'hip', keywords: ['hip', 'groin', 'labrum'] },
      { id: 'shoulder', name: 'Shoulder Condition', dbq: '21-0960M-12', ratings: [0, 10, 20, 30, 40], bilateralEligible: true, limbType: 'shoulder', keywords: ['shoulder', 'rotator cuff', 'impingement'] },
      { id: 'ankle', name: 'Ankle Condition', dbq: '21-0960M-2', ratings: [0, 10, 20, 40], bilateralEligible: true, limbType: 'ankle', keywords: ['ankle', 'sprain', 'instability'] },
      { id: 'wrist', name: 'Wrist Condition', dbq: '21-0960M-15', ratings: [0, 10, 20, 30], bilateralEligible: true, limbType: 'wrist', keywords: ['wrist', 'carpal'] },
      { id: 'elbow', name: 'Elbow Condition', dbq: '21-0960M-3', ratings: [0, 10, 20, 30, 40, 50], bilateralEligible: true, limbType: 'elbow', keywords: ['elbow', 'tennis elbow', 'golfer elbow'] },
      { id: 'fibro', name: 'Fibromyalgia', dbq: '21-0960M-3', ratings: [10, 20, 40], keywords: ['fibromyalgia', 'widespread pain', 'chronic fatigue'] },
      { id: 'flatfeet', name: 'Flat Feet (Pes Planus)', dbq: '21-0960M-4', ratings: [0, 10, 20, 30, 50], bilateralEligible: true, limbType: 'foot', keywords: ['flat feet', 'fallen arches', 'pes planus'] },
      { id: 'plantar', name: 'Plantar Fasciitis', dbq: '21-0960M-4', ratings: [0, 10, 20], bilateralEligible: true, limbType: 'foot', keywords: ['plantar fasciitis', 'heel pain', 'foot pain'] },
      { id: 'arthritis', name: 'Degenerative Arthritis', dbq: '21-0960M-1', ratings: [10, 20, 40], keywords: ['arthritis', 'degenerative', 'osteoarthritis'] },
      { id: 'gout', name: 'Gout', dbq: '21-0960M-8', ratings: [20, 40, 60], keywords: ['gout', 'uric acid'] }
    ]
  },
  {
    id: 'respiratory',
    name: 'Respiratory',
    icon: 'wind',
    cfrSection: '§ 4.97',
    conditions: [
      { id: 'sleepapnea', name: 'Sleep Apnea', dbq: '21-0960C-1', ratings: [0, 30, 50, 100], keywords: ['sleep apnea', 'cpap', 'snoring', 'ahi'], icd10: ['G47.33'] },
      { id: 'asthma', name: 'Asthma', dbq: '21-0960C-2', ratings: [10, 30, 60, 100], keywords: ['asthma', 'breathing', 'inhaler', 'wheezing'], icd10: ['J45'] },
      { id: 'copd', name: 'COPD', dbq: '21-0960C-3', ratings: [10, 30, 60, 100], presumptive: ['Burn Pits', 'Toxic Exposure'], keywords: ['copd', 'emphysema', 'chronic bronchitis'], icd10: ['J44'] },
      { id: 'sinusitis', name: 'Chronic Sinusitis', dbq: '21-0960C-4', ratings: [0, 10, 30, 50], keywords: ['sinus', 'sinusitis', 'nasal'], icd10: ['J32'] },
      { id: 'rhinitis', name: 'Allergic Rhinitis', dbq: '21-0960C-5', ratings: [0, 10, 30], keywords: ['rhinitis', 'allergies', 'nasal congestion'], icd10: ['J30'] },
      { id: 'bronchitis', name: 'Chronic Bronchitis', dbq: '21-0960C-3', ratings: [10, 30, 60], presumptive: ['Burn Pits'], keywords: ['bronchitis', 'cough'] },
      { id: 'pulmonary', name: 'Pulmonary Fibrosis', dbq: '21-0960C-6', ratings: [30, 60, 100], presumptive: ['Burn Pits'], keywords: ['pulmonary fibrosis', 'lung scarring'] }
    ]
  },
  {
    id: 'neurological',
    name: 'Neurological',
    icon: 'zap',
    cfrSection: '§ 4.124a',
    conditions: [
      { id: 'tbi', name: 'Traumatic Brain Injury (TBI)', dbq: '21-0960C-7', ratings: [0, 10, 40, 70, 100], keywords: ['tbi', 'concussion', 'head injury', 'brain'], icd10: ['S06'] },
      { id: 'migraines', name: 'Migraine Headaches', dbq: '21-0960C-8', ratings: [0, 10, 30, 50], secondary: ['TBI'], keywords: ['migraine', 'headache', 'prostrating'], icd10: ['G43'] },
      { id: 'neuropathy', name: 'Peripheral Neuropathy', dbq: '21-0960C-9', ratings: [0, 10, 20, 40, 60, 80], bilateralEligible: true, secondary: ['Diabetes'], keywords: ['neuropathy', 'numbness', 'tingling'], icd10: ['G62'] },
      { id: 'radiculopathy', name: 'Radiculopathy', dbq: '21-0960C-9', ratings: [0, 10, 20, 40, 60], bilateralEligible: true, secondary: ['Lumbar Spine', 'Cervical Spine'], keywords: ['radiculopathy', 'nerve', 'shooting pain', 'radiating'] },
      { id: 'carpal', name: 'Carpal Tunnel Syndrome', dbq: '21-0960C-10', ratings: [10, 20, 30, 40, 50, 60, 70], bilateralEligible: true, limbType: 'wrist', keywords: ['carpal tunnel', 'wrist', 'hand numbness'] },
      { id: 'sciatica', name: 'Sciatica', dbq: '21-0960C-9', ratings: [10, 20, 40, 60, 80], secondary: ['Lumbar Spine'], keywords: ['sciatica', 'leg pain', 'sciatic nerve'] },
      { id: 'vertigo', name: 'Vertigo / Dizziness', dbq: '21-0960C-11', ratings: [0, 10, 30, 60, 100], keywords: ['vertigo', 'dizzy', 'balance', 'spinning'] },
      { id: 'seizures', name: 'Seizure Disorder / Epilepsy', dbq: '21-0960C-12', ratings: [10, 20, 40, 60, 80, 100], keywords: ['seizure', 'epilepsy', 'convulsion'] },
      { id: 'parkinsons', name: "Parkinson's Disease", dbq: '21-0960C-13', ratings: [30, 50, 70, 100], presumptive: ['Agent Orange'], keywords: ['parkinsons', 'tremor', 'movement'] },
      { id: 'ms', name: 'Multiple Sclerosis', dbq: '21-0960C-14', ratings: [30, 50, 70, 100], keywords: ['ms', 'multiple sclerosis'] }
    ]
  },
  {
    id: 'auditory',
    name: 'Auditory',
    icon: 'ear',
    cfrSection: '§ 4.85-4.87',
    conditions: [
      { id: 'tinnitus', name: 'Tinnitus', dbq: '21-0960J-1', ratings: [10], presumptive: ['Combat', 'Noise Exposure'], keywords: ['tinnitus', 'ringing', 'ears', 'buzzing'], icd10: ['H93.1'] },
      { id: 'hearing', name: 'Hearing Loss (Bilateral)', dbq: '21-0960J-2', ratings: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100], bilateralEligible: true, keywords: ['hearing loss', 'deaf', 'cant hear'], icd10: ['H90', 'H91'] },
      { id: 'menieres', name: "Meniere's Disease", dbq: '21-0960J-3', ratings: [0, 30, 60, 100], keywords: ['menieres', 'vertigo', 'hearing', 'ear pressure'] }
    ]
  },
  {
    id: 'cardiovascular',
    name: 'Cardiovascular',
    icon: 'heart',
    cfrSection: '§ 4.104',
    conditions: [
      { id: 'hypertension', name: 'Hypertension', dbq: '21-0960A-2', ratings: [0, 10, 20, 40, 60], keywords: ['high blood pressure', 'hypertension', 'bp'], icd10: ['I10'] },
      { id: 'cad', name: 'Coronary Artery Disease', dbq: '21-0960A-3', ratings: [10, 30, 60, 100], presumptive: ['Agent Orange'], keywords: ['heart disease', 'coronary', 'cad', 'stent'], icd10: ['I25'] },
      { id: 'arrhythmia', name: 'Heart Arrhythmia / AFib', dbq: '21-0960A-4', ratings: [10, 30, 60, 100], keywords: ['arrhythmia', 'irregular heartbeat', 'afib', 'palpitations'] },
      { id: 'chf', name: 'Congestive Heart Failure', dbq: '21-0960A-5', ratings: [30, 60, 100], keywords: ['heart failure', 'chf', 'ejection fraction'] },
      { id: 'heartvalve', name: 'Heart Valve Disease', dbq: '21-0960A-6', ratings: [10, 30, 60, 100], keywords: ['valve', 'mitral', 'aortic'] }
    ]
  },
  {
    id: 'digestive',
    name: 'Digestive',
    icon: 'utensils',
    cfrSection: '§ 4.114',
    conditions: [
      { id: 'gerd', name: 'GERD / Acid Reflux', dbq: '21-0960B-1', ratings: [0, 10, 30, 60], keywords: ['gerd', 'acid reflux', 'heartburn', 'esophagus'], icd10: ['K21'] },
      { id: 'ibs', name: 'Irritable Bowel Syndrome (IBS)', dbq: '21-0960B-2', ratings: [0, 10, 30], presumptive: ['Gulf War'], keywords: ['ibs', 'bowel', 'diarrhea', 'constipation'], icd10: ['K58'] },
      { id: 'hernia', name: 'Hiatal Hernia', dbq: '21-0960B-3', ratings: [10, 30, 60], keywords: ['hernia', 'hiatal'] },
      { id: 'hemorrhoids', name: 'Hemorrhoids', dbq: '21-0960B-4', ratings: [0, 10, 20], keywords: ['hemorrhoids', 'rectal'] },
      { id: 'crohns', name: "Crohn's Disease", dbq: '21-0960B-5', ratings: [10, 30, 60, 100], keywords: ['crohns', 'inflammatory bowel'] },
      { id: 'ulcer', name: 'Peptic Ulcer Disease', dbq: '21-0960B-6', ratings: [10, 20, 40, 60], keywords: ['ulcer', 'peptic', 'stomach'] },
      { id: 'gallbladder', name: 'Gallbladder Removal', dbq: '21-0960B-7', ratings: [0, 10, 30], keywords: ['gallbladder', 'cholecystectomy'] }
    ]
  },
  {
    id: 'genitourinary',
    name: 'Genitourinary',
    icon: 'droplet',
    cfrSection: '§ 4.115a-b',
    conditions: [
      { id: 'ed', name: 'Erectile Dysfunction', dbq: '21-0960N-1', ratings: [0], secondary: ['Diabetes', 'PTSD', 'Hypertension', 'Medications'], keywords: ['erectile dysfunction', 'ed', 'impotence'] },
      { id: 'kidney', name: 'Kidney Disease', dbq: '21-0960N-2', ratings: [0, 30, 60, 80, 100], keywords: ['kidney', 'renal', 'ckd'], icd10: ['N18'] },
      { id: 'incontinence', name: 'Urinary Incontinence', dbq: '21-0960N-3', ratings: [20, 40, 60], keywords: ['incontinence', 'bladder', 'leakage'] },
      { id: 'bph', name: 'Benign Prostatic Hyperplasia', dbq: '21-0960N-4', ratings: [0, 10, 20, 40], keywords: ['prostate', 'bph', 'enlarged prostate', 'urinary'] },
      { id: 'prostatecancer', name: 'Prostate Cancer', dbq: '21-0960N-5', ratings: [0, 20, 40, 60, 100], presumptive: ['Agent Orange'], keywords: ['prostate cancer'] },
      { id: 'kidneystones', name: 'Kidney Stones', dbq: '21-0960N-6', ratings: [0, 10, 20, 30], keywords: ['kidney stones', 'renal calculi'] }
    ]
  },
  {
    id: 'endocrine',
    name: 'Endocrine',
    icon: 'activity',
    cfrSection: '§ 4.119',
    conditions: [
      { id: 'diabetes2', name: 'Diabetes Mellitus Type II', dbq: '21-0960C-11', ratings: [10, 20, 40, 60, 100], presumptive: ['Agent Orange'], keywords: ['diabetes', 'blood sugar', 'type 2', 'a1c'], icd10: ['E11'] },
      { id: 'diabetes1', name: 'Diabetes Mellitus Type I', dbq: '21-0960C-11', ratings: [20, 40, 60, 100], keywords: ['diabetes', 'type 1', 'insulin'], icd10: ['E10'] },
      { id: 'hypothyroid', name: 'Hypothyroidism', dbq: '21-0960C-12', ratings: [0, 10, 30, 60, 100], keywords: ['thyroid', 'hypothyroid', 'underactive thyroid'] },
      { id: 'hyperthyroid', name: 'Hyperthyroidism', dbq: '21-0960C-12', ratings: [10, 30, 60, 100], keywords: ['thyroid', 'hyperthyroid', 'overactive thyroid'] },
      { id: 'thyroidcancer', name: 'Thyroid Cancer', dbq: '21-0960C-13', ratings: [0, 30, 60, 100], keywords: ['thyroid cancer', 'thyroidectomy'] }
    ]
  },
  {
    id: 'skin',
    name: 'Skin',
    icon: 'circle',
    cfrSection: '§ 4.118',
    conditions: [
      { id: 'eczema', name: 'Eczema / Dermatitis', dbq: '21-0960F-1', ratings: [0, 10, 30, 60], keywords: ['eczema', 'rash', 'skin', 'dermatitis'] },
      { id: 'psoriasis', name: 'Psoriasis', dbq: '21-0960F-1', ratings: [0, 10, 30, 60], keywords: ['psoriasis', 'skin patches', 'plaques'] },
      { id: 'scarsdisfig', name: 'Scars (Disfiguring)', dbq: '21-0960F-2', ratings: [10, 30, 50, 80], keywords: ['scar', 'disfigurement', 'burn', 'facial scar'] },
      { id: 'scarspain', name: 'Scars (Painful/Unstable)', dbq: '21-0960F-3', ratings: [10, 20, 30], keywords: ['painful scar', 'tender scar', 'unstable scar'] },
      { id: 'acne', name: 'Severe Acne / Chloracne', dbq: '21-0960F-4', ratings: [0, 10, 30, 60], presumptive: ['Agent Orange'], keywords: ['acne', 'chloracne'] },
      { id: 'skincancer', name: 'Skin Cancer', dbq: '21-0960F-5', ratings: [0, 10, 30, 60, 100], keywords: ['skin cancer', 'melanoma', 'basal cell', 'squamous'] }
    ]
  },
  {
    id: 'vision',
    name: 'Vision',
    icon: 'eye',
    cfrSection: '§ 4.75-4.84',
    conditions: [
      { id: 'visual', name: 'Visual Impairment', dbq: '21-0960I-1', ratings: [0, 10, 20, 30, 40, 50, 70, 100], bilateralEligible: true, keywords: ['vision', 'blind', 'eyes', 'visual acuity'] },
      { id: 'glaucoma', name: 'Glaucoma', dbq: '21-0960I-2', ratings: [10, 20, 30, 60, 100], keywords: ['glaucoma', 'eye pressure', 'optic nerve'] },
      { id: 'retinopathy', name: 'Diabetic Retinopathy', dbq: '21-0960I-3', ratings: [10, 20, 30, 60, 100], secondary: ['Diabetes'], keywords: ['retinopathy', 'diabetic eyes'] },
      { id: 'cataracts', name: 'Cataracts', dbq: '21-0960I-4', ratings: [0, 10, 20, 30], keywords: ['cataracts', 'cloudy vision'] },
      { id: 'dryeye', name: 'Dry Eye Syndrome', dbq: '21-0960I-5', ratings: [0, 10, 20], keywords: ['dry eye', 'keratitis'] }
    ]
  },
  {
    id: 'dental',
    name: 'Dental / Oral',
    icon: 'smile',
    cfrSection: '§ 4.150',
    conditions: [
      { id: 'tmj', name: 'TMJ Disorder', dbq: '21-0960D-1', ratings: [0, 10, 20, 30, 40], bilateralEligible: true, keywords: ['tmj', 'jaw', 'jaw pain', 'temporomandibular'] },
      { id: 'dental', name: 'Dental Trauma', dbq: '21-0960D-2', ratings: [0, 10, 20], keywords: ['dental', 'teeth', 'tooth'] }
    ]
  },
  {
    id: 'infectious',
    name: 'Infectious Disease',
    icon: 'shield',
    cfrSection: '§ 4.88b',
    conditions: [
      { id: 'hepc', name: 'Hepatitis C', dbq: '21-0960K-1', ratings: [0, 10, 20, 40, 60, 100], keywords: ['hepatitis', 'hep c', 'liver', 'hcv'] },
      { id: 'hiv', name: 'HIV / AIDS', dbq: '21-0960K-2', ratings: [0, 10, 30, 60, 100], keywords: ['hiv', 'aids', 'immunodeficiency'] },
      { id: 'hepb', name: 'Hepatitis B', dbq: '21-0960K-3', ratings: [0, 10, 20, 40, 60], keywords: ['hepatitis b', 'hbv'] },
      { id: 'lyme', name: 'Lyme Disease', dbq: '21-0960K-4', ratings: [0, 10, 20, 40], keywords: ['lyme', 'tick', 'borrelia'] }
    ]
  },
  {
    id: 'hematologic',
    name: 'Hematologic',
    icon: 'droplets',
    cfrSection: '§ 4.117',
    conditions: [
      { id: 'anemia', name: 'Anemia', dbq: '21-0960E-1', ratings: [0, 10, 30, 70, 100], keywords: ['anemia', 'low blood', 'iron', 'hemoglobin'] },
      { id: 'leukemia', name: 'Leukemia', dbq: '21-0960E-2', ratings: [0, 30, 60, 100], presumptive: ['Agent Orange', 'Radiation'], keywords: ['leukemia', 'blood cancer'] },
      { id: 'lymphoma', name: 'Non-Hodgkin Lymphoma', dbq: '21-0960E-3', ratings: [0, 30, 60, 100], presumptive: ['Agent Orange'], keywords: ['lymphoma', 'nhl'] }
    ]
  },
  {
    id: 'gynecological',
    name: 'Gynecological',
    icon: 'heart',
    cfrSection: '§ 4.116',
    conditions: [
      { id: 'endometriosis', name: 'Endometriosis', dbq: '21-0960G-1', ratings: [0, 10, 30, 50], keywords: ['endometriosis', 'pelvic pain', 'endo'] },
      { id: 'pcos', name: 'Polycystic Ovary Syndrome', dbq: '21-0960G-2', ratings: [0, 10, 30], keywords: ['pcos', 'ovarian', 'polycystic'] },
      { id: 'breastcancer', name: 'Breast Cancer', dbq: '21-0960G-3', ratings: [0, 30, 60, 100], keywords: ['breast cancer', 'mastectomy'] },
      { id: 'hysterectomy', name: 'Hysterectomy Complications', dbq: '21-0960G-4', ratings: [0, 10, 30, 50], keywords: ['hysterectomy', 'uterus'] }
    ]
  }
];

export const getAllConditions = () => 
  BODY_SYSTEMS.flatMap(system => 
    system.conditions.map(c => ({ ...c, system: system.id }))
  );

export const getSystemById = (id: string) => 
  BODY_SYSTEMS.find(s => s.id === id);

export const getConditionById = (id: string) => {
  for (const system of BODY_SYSTEMS) {
    const condition = system.conditions.find(c => c.id === id);
    if (condition) return { ...condition, system: system.id };
  }
  return undefined;
};

function normalizeQuery(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[_/]+/g, ' ')
    .replace(/[^\w\s.-]+/g, '')
    .replace(/\s+/g, ' ');
}

function scoreMatch(query: string, c: { name: string; keywords?: string[]; icd10?: string[] }): number {
  const q = normalizeQuery(query);
  if (!q) return 0;

  const name = normalizeQuery(c.name);
  const kws = (c.keywords || []).map(normalizeQuery);
  const icd = (c.icd10 || []).map((x) => x.toLowerCase());

  // Highest confidence: exact name or acronym match.
  if (name === q) return 100;
  if (name.startsWith(q)) return 92;

  // Keyword signals (this is what users mean by “ping”).
  for (const k of kws) {
    if (!k) continue;
    if (k === q) return 90;
    if (k.startsWith(q)) return 82;
    if (k.includes(q)) return 74;
    if (q.includes(k) && k.length >= 4) return 70;
  }

  // Name contains (lower confidence).
  if (name.includes(q)) return 66;

  // ICD-10 code contains.
  for (const code of icd) {
    if (code && code.includes(q.replace(/\s+/g, ''))) return 58;
  }

  return 0;
}

export const searchConditions = (query: string) => {
  const q = normalizeQuery(query);
  if (!q) return [];

  const scored = getAllConditions()
    .map((c) => ({ c, score: scoreMatch(q, c) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.c.name.localeCompare(b.c.name));

  return scored.map((x) => x.c);
};

export const getBestConditionMatch = (query: string) => {
  const q = normalizeQuery(query);
  if (!q) return undefined;
  const all = getAllConditions();
  let best: { c: (typeof all)[number]; score: number } | undefined;
  for (const c of all) {
    const score = scoreMatch(q, c);
    if (!best || score > best.score) best = { c, score };
  }
  return best && best.score > 0 ? best : undefined;
};

export default BODY_SYSTEMS;


