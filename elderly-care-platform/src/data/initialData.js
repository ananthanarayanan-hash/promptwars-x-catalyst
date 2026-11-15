export const INITIAL_DATA = {
  patient: {
    name: "Arthur Pendelton",
    age: 74,
    gender: "Male",
    bloodGroup: "O+",
    location: "428 Elmwood Terrace, Boston, MA 02116",
    conditions: ["Hypertension", "Type-2 Diabetes", "Mild Osteoarthritis"],
    allergies: ["Sulfa antibiotics (mild skin rash)"],
    dietaryNotes: "Heart-healthy diabetic diet, low sodium, moderate carbohydrates",
    emergencyContacts: [
      {
        id: "c1",
        name: "Sarah Jenkins",
        relation: "Daughter (Primary Caretaker)",
        phone: "+1 (617) 555-0142",
        email: "sarah.jenkins@carenet.org",
        city: "Boston, MA",
        isPrimary: true
      },
      {
        id: "c2",
        name: "David Pendelton",
        relation: "Son (Remote Family Monitor)",
        phone: "+1 (206) 555-0189",
        email: "david.pendelton@techcorp.io",
        city: "Seattle, WA",
        isPrimary: false
      }
    ],
    doctors: [
      {
        name: "Dr. Arthur Vance",
        specialty: "Senior Cardiologist",
        hospital: "Massachusetts General Hospital, Boston",
        phone: "+1 (617) 726-2000"
      },
      {
        name: "Dr. Eleanor Bennett",
        specialty: "Consultant Endocrinologist",
        hospital: "Brigham and Women's Hospital, Boston",
        phone: "+1 (617) 732-5500"
      }
    ]
  },

  passcodes: {
    elderly: "1111",
    caretaker: "2222",
    family: "3333"
  },

  medications: [
    {
      id: "med-1",
      name: "Metformin Extended-Release (XR)",
      genericName: "Metformin Hydrochloride (1000mg)",
      dosage: "1 Tablet",
      category: "Diabetes",
      timeSlot: "Morning",
      scheduledTime: "08:30 AM",
      mealRelation: "With breakfast",
      seniorInstructions: "Take 1 tablet with breakfast and a tall glass of water. Swallow whole; do not chew or crush.",
      prescribedBy: "Dr. Eleanor Bennett",
      stockLeft: 28,
      refillThreshold: 10,
      status: "taken", // 'taken' | 'upcoming' | 'missed'
      takenAt: "08:35 AM",
      colorTag: "emerald",
      shape: "Oblong White Tablet (M-1000)"
    },
    {
      id: "med-2",
      name: "Lisinopril + Amlodipine",
      genericName: "Lisinopril (20mg) / Amlodipine (5mg)",
      dosage: "1 Tablet",
      category: "Blood Pressure",
      timeSlot: "Morning",
      scheduledTime: "09:00 AM",
      mealRelation: "After breakfast",
      seniorInstructions: "Take 1 tablet for blood pressure control. Sit upright for a moment before standing up.",
      prescribedBy: "Dr. Arthur Vance",
      stockLeft: 22,
      refillThreshold: 8,
      status: "taken",
      takenAt: "09:05 AM",
      colorTag: "blue",
      shape: "Round Peach Tablet (L-20)"
    },
    {
      id: "med-3",
      name: "Calcium Citrate + Vitamin D3",
      genericName: "Calcium Citrate (500mg) + D3 (400 IU)",
      dosage: "1 Tablet",
      category: "Bones & Joint Support",
      timeSlot: "Afternoon",
      scheduledTime: "01:30 PM",
      mealRelation: "After lunch",
      seniorInstructions: "Take 1 tablet after lunch with water. Helps maintain bone density and knee mobility.",
      prescribedBy: "Dr. Arthur Vance",
      stockLeft: 30,
      refillThreshold: 10,
      status: "upcoming",
      takenAt: null,
      colorTag: "amber",
      shape: "Large White Capsule-Shaped Caplet"
    },
    {
      id: "med-4",
      name: "Atorvastatin (Lipitor)",
      genericName: "Atorvastatin Calcium (20mg)",
      dosage: "1 Tablet",
      category: "Lipids / Cardiovascular",
      timeSlot: "Evening",
      scheduledTime: "08:00 PM",
      mealRelation: "After dinner",
      seniorInstructions: "Take 1 tablet in the evening after dinner. Protects arterial lining and keeps cholesterol in check.",
      prescribedBy: "Dr. Arthur Vance",
      stockLeft: 6, // Low stock warning
      refillThreshold: 10,
      status: "upcoming",
      takenAt: null,
      colorTag: "rose",
      shape: "Small Oval White Coated Tablet"
    },
    {
      id: "med-5",
      name: "Tradjenta (Linagliptin)",
      genericName: "Linagliptin (5mg)",
      dosage: "1 Tablet",
      category: "Diabetes",
      timeSlot: "Night",
      scheduledTime: "09:30 PM",
      mealRelation: "Before bedtime",
      seniorInstructions: "Take 1 tablet before sleeping with a few sips of water. Stabilizes overnight fasting glucose levels.",
      prescribedBy: "Dr. Eleanor Bennett",
      stockLeft: 24,
      refillThreshold: 10,
      status: "upcoming",
      takenAt: null,
      colorTag: "purple",
      shape: "Round Light Red Film-Coated Tablet"
    }
  ],

  appointments: [
    {
      id: "apt-1",
      doctorName: "Dr. Arthur Vance",
      specialty: "Senior Cardiologist",
      hospital: "Massachusetts General Hospital - Yawkey Center for Outpatient Care, Boston",
      dateTime: "2026-11-20T10:30",
      purpose: "Semi-Annual Blood Pressure Review & Resting 12-Lead ECG",
      instructions: "Bring home blood pressure log from past 14 days. Fasting lipid blood panel scheduled at lab 1 hour prior.",
      contactNumber: "+1 (617) 726-2000",
      status: "Confirmed"
    },
    {
      id: "apt-2",
      doctorName: "Dr. Eleanor Bennett",
      specialty: "Consultant Endocrinologist",
      hospital: "Brigham and Women's Hospital - Endocrine Care Center, Boston",
      dateTime: "2026-12-05T16:30",
      purpose: "Quarterly HbA1c & Diabetic Comprehensive Foot Exam",
      instructions: "Complete fasting blood glucose and comprehensive metabolic panel 48 hours prior at Quest Diagnostics.",
      contactNumber: "+1 (617) 732-5500",
      status: "Scheduled"
    }
  ],

  emailOutbox: [
    {
      id: "mail-1",
      recipient: "Sarah Jenkins <sarah.jenkins@carenet.org>",
      subject: "[Elder Care Form] Morning Regimen Logged - Arthur Pendelton",
      timestamp: "Today at 08:35 AM",
      category: "DOSE_LOGGED",
      urgency: "SUCCESS",
      bodyHtml: "Arthur Pendelton has logged both scheduled morning medications (Metformin XR & Lisinopril) on time. Daily adherence: 100%."
    },
    {
      id: "mail-2",
      recipient: "Sarah Jenkins <sarah.jenkins@carenet.org>, David Pendelton <david.pendelton@techcorp.io>",
      subject: "[CRITICAL ALERT] Evening Dose Not Confirmed - Atorvastatin 20mg",
      timestamp: "Yesterday at 08:45 PM",
      category: "MISSED_DOSE",
      urgency: "HIGH",
      bodyHtml: "Care Alert: Arthur Pendelton did not log the 08:00 PM evening dose of Atorvastatin 20mg within 45 minutes of scheduled time. Automated phone follow-up recommended."
    },
    {
      id: "mail-3",
      recipient: "David Pendelton <david.pendelton@techcorp.io>",
      subject: "[Weekly Caregiver Digest] Arthur Pendelton - 88.5% Adherence Score",
      timestamp: "10 Nov 2026, 09:00 AM",
      category: "REPORT",
      urgency: "INFO",
      bodyHtml: "Weekly Care Summary for Arthur Pendelton (74):\n• 31 of 35 doses confirmed on schedule\n• Overall Adherence: 88.5%\n• Active Diagnoses: Hypertension, Type-2 Diabetes\n• Blood Pressure Trend: Stable (126/80 mmHg average)."
    }
  ],

  weeklyAdherenceHistory: [
    { day: "Mon", rate: 100, taken: 5, total: 5 },
    { day: "Tue", rate: 80, taken: 4, total: 5 },
    { day: "Wed", rate: 100, taken: 5, total: 5 },
    { day: "Thu", rate: 60, taken: 3, total: 5 }, // Evening missed
    { day: "Fri", rate: 100, taken: 5, total: 5 },
    { day: "Sat", rate: 80, taken: 4, total: 5 },
    { day: "Sun", rate: 100, taken: 2, total: 2 } // Active day
  ],

  aiInsights: [
    {
      id: "ins-1",
      type: "ROUTINE_OPTIMIZATION",
      title: "Evening Dose Delay Pattern Detected",
      severity: "warning",
      finding: "Evening doses (8:00 PM Atorvastatin) were logged late or missed twice this week due to late dining.",
      recommendation: "Dinner typically concludes around 8:30 PM. Shifting Atorvastatin to 8:30 PM alongside dinner or dessert improves routine consistency by ~25%.",
      actionLabel: "Reschedule to 8:30 PM",
      targetMedId: "med-4"
    },
    {
      id: "ins-2",
      type: "DRUG_SAFETY",
      title: "Mineral Chelation & Absorption Buffer",
      severity: "info",
      finding: "Calcium Citrate + D3 is scheduled at 1:30 PM post-lunch.",
      recommendation: "Maintain at least 2 hours separation between Calcium supplements and iron-rich foods or high-fiber bran to ensure maximum calcium absorption.",
      actionLabel: "View Dietary Absorption Guide",
      targetMedId: "med-3"
    },
    {
      id: "ins-3",
      type: "INVENTORY_PREDICTION",
      title: "Atorvastatin 20mg Stock Depletion Warning",
      severity: "critical",
      finding: "Only 6 tablets remain in prescription organizer. At 1 tablet/day, supply will deplete in 6 days.",
      recommendation: "Cardiology follow-up with Dr. Arthur Vance is scheduled in 5 days. Request 90-day mail-order refill during clinic visit.",
      actionLabel: "Order Prescription Refill",
      targetMedId: "med-4"
    }
  ]
};
