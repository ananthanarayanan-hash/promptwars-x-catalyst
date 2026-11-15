export const INITIAL_DATA = {
  patient: {
    name: "Ramesh Iyer",
    age: 74,
    gender: "Male",
    bloodGroup: "O+",
    location: "4th Main, Malleshwaram, Bengaluru, Karnataka 560003",
    conditions: ["Type-2 Diabetes", "Hypertension (Stage 1)", "Mild Knee Osteoarthritis"],
    allergies: ["Sulfa drugs (mild rash)"],
    dietaryNotes: "South Indian vegetarian, low sodium, diabetic friendly",
    emergencyContacts: [
      {
        id: "c1",
        name: "Priya Iyer",
        relation: "Daughter (Primary Caretaker)",
        phone: "+91 98450 12345",
        email: "priya.iyer@gmail.com",
        city: "Indiranagar, Bengaluru",
        isPrimary: true
      },
      {
        id: "c2",
        name: "Rahul Iyer",
        relation: "Son (Remote Family)",
        phone: "+1 425 555 0192",
        email: "rahul.iyer@techcorp.io",
        city: "Seattle, USA",
        isPrimary: false
      }
    ],
    doctors: [
      {
        name: "Dr. Arvind Swaminathan",
        specialty: "Senior Cardiologist",
        hospital: "Manipal Hospital, Old Airport Road, Bengaluru",
        phone: "+91 80 2502 4444"
      },
      {
        name: "Dr. Meenakshi Sundaram",
        specialty: "Consultant Endocrinologist",
        hospital: "Apollo Sugar Clinic, Malleshwaram, Bengaluru",
        phone: "+91 80 4111 2233"
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
      name: "Glycomet-GP 1 Forte",
      genericName: "Glimepiride (1mg) + Metformin (1000mg)",
      dosage: "1 Tablet",
      category: "Diabetes",
      timeSlot: "Morning",
      scheduledTime: "08:30 AM",
      mealRelation: "After breakfast",
      seniorInstructions: "Take 1 tablet after eating your breakfast (Idli/Dosa/Upma) with warm water. Do not skip morning breakfast.",
      prescribedBy: "Dr. Meenakshi Sundaram",
      stockLeft: 24,
      refillThreshold: 10,
      status: "taken", // 'taken' | 'upcoming' | 'missed'
      takenAt: "08:35 AM",
      colorTag: "emerald",
      shape: "Oblong White Tablet"
    },
    {
      id: "med-2",
      name: "Telmikind-AM",
      genericName: "Telmisartan (40mg) + Amlodipine (5mg)",
      dosage: "1 Tablet",
      category: "Blood Pressure",
      timeSlot: "Morning",
      scheduledTime: "09:00 AM",
      mealRelation: "After breakfast",
      seniorInstructions: "Take 1 tablet with a full glass of water. Controls your morning Blood Pressure. Avoid excess salt with pickle or papad.",
      prescribedBy: "Dr. Arvind Swaminathan",
      stockLeft: 18,
      refillThreshold: 8,
      status: "taken",
      takenAt: "09:05 AM",
      colorTag: "blue",
      shape: "Round Pinkish Tablet"
    },
    {
      id: "med-3",
      name: "Shelcal-HD",
      genericName: "Calcium (500mg) + Vitamin D3 (250 IU)",
      dosage: "1 Tablet",
      category: "Bones & Joint",
      timeSlot: "Afternoon",
      scheduledTime: "01:30 PM",
      mealRelation: "After lunch",
      seniorInstructions: "Take 1 tablet after lunch with buttermilk or water. Helps strengthen knee joints and bones.",
      prescribedBy: "Dr. Arvind Swaminathan",
      stockLeft: 28,
      refillThreshold: 10,
      status: "upcoming",
      takenAt: null,
      colorTag: "amber",
      shape: "Large Oval White Tablet"
    },
    {
      id: "med-4",
      name: "Rosuvas 10",
      genericName: "Rosuvastatin (10mg)",
      dosage: "1 Tablet",
      category: "Cholesterol / Heart",
      timeSlot: "Evening",
      scheduledTime: "08:00 PM",
      mealRelation: "After dinner",
      seniorInstructions: "Take 1 tablet after your dinner. Protects heart and keeps cholesterol in check. Avoid taking with antacid gels.",
      prescribedBy: "Dr. Arvind Swaminathan",
      stockLeft: 7, // triggers low stock warning
      refillThreshold: 10,
      status: "upcoming",
      takenAt: null,
      colorTag: "rose",
      shape: "Small Yellow Round Tablet"
    },
    {
      id: "med-5",
      name: "Trajenta 5mg",
      genericName: "Linagliptin (5mg)",
      dosage: "1 Tablet",
      category: "Diabetes",
      timeSlot: "Night",
      scheduledTime: "09:30 PM",
      mealRelation: "Before bedtime",
      seniorInstructions: "Take 1 tablet 15 minutes before sleeping with half a glass of plain water. Regulates overnight glucose levels.",
      prescribedBy: "Dr. Meenakshi Sundaram",
      stockLeft: 22,
      refillThreshold: 10,
      status: "upcoming",
      takenAt: null,
      colorTag: "purple",
      shape: "Round Light Peach Tablet"
    }
  ],

  appointments: [
    {
      id: "apt-1",
      doctorName: "Dr. Arvind Swaminathan",
      specialty: "Senior Cardiologist",
      hospital: "Manipal Hospital, HAL Old Airport Rd, Bengaluru",
      dateTime: "2026-11-20T10:30",
      purpose: "Semi-Annual Blood Pressure Review & 12-lead ECG",
      instructions: "Bring blood pressure home log book of past 14 days. 12-hour fasting required for Lipid Profile blood draw at hospital lab at 08:30 AM.",
      contactNumber: "+91 80 2502 4444",
      status: "Confirmed"
    },
    {
      id: "apt-2",
      doctorName: "Dr. Meenakshi Sundaram",
      specialty: "Consultant Endocrinologist",
      hospital: "Apollo Sugar Clinic, 8th Main, Malleshwaram",
      dateTime: "2026-12-05T16:30",
      purpose: "Quarterly HbA1c & Diabetic Peripheral Neuropathy Check",
      instructions: "Get HbA1c, Fasting Glucose, and Serum Creatinine done 2 days before consultation at Lal PathLabs Malleshwaram.",
      contactNumber: "+91 80 4111 2233",
      status: "Scheduled"
    }
  ],

  emailOutbox: [
    {
      id: "mail-1",
      recipient: "Priya Iyer <priya.iyer@gmail.com>",
      subject: "[AarogyaCare] Morning Dose Complete - Ramesh Iyer (8:35 AM)",
      timestamp: "Today at 08:35 AM",
      category: "DOSE_LOGGED",
      urgency: "SUCCESS",
      bodyHtml: "Ramesh Uncle logged morning medications (Glycomet-GP 1 Forte & Telmikind-AM) on schedule. Daily compliance for morning: 100%."
    },
    {
      id: "mail-2",
      recipient: "Priya Iyer <priya.iyer@gmail.com>, Rahul Iyer <rahul.iyer@techcorp.io>",
      subject: "[MISSED DOSE ALERT] Rosuvas 10mg not confirmed at 8:00 PM",
      timestamp: "14 Nov 2026, 08:45 PM",
      category: "MISSED_DOSE",
      urgency: "HIGH",
      bodyHtml: "Alert: Ramesh Uncle did not confirm his 08:00 PM evening dose of Rosuvas 10mg within 45 minutes of scheduled time. Please verify with him via phone call."
    },
    {
      id: "mail-3",
      recipient: "Rahul Iyer <rahul.iyer@techcorp.io>",
      subject: "[Weekly Caregiver Digest] Ramesh Iyer - 88% Weekly Adherence Score",
      timestamp: "10 Nov 2026, 09:00 AM",
      category: "REPORT",
      urgency: "INFO",
      bodyHtml: "Weekly Care Summary for Ramesh Iyer (74):\n• 31 of 35 doses taken on schedule\n• Overall Adherence: 88.5%\n• Evening doses show slight delay pattern (recommend dinner timing sync)\n• Current BP logged: 128/82 mmHg."
    }
  ],

  weeklyAdherenceHistory: [
    { day: "Mon", rate: 100, taken: 5, total: 5 },
    { day: "Tue", rate: 80, taken: 4, total: 5 },
    { day: "Wed", rate: 100, taken: 5, total: 5 },
    { day: "Thu", rate: 60, taken: 3, total: 5 }, // Evening missed
    { day: "Fri", rate: 100, taken: 5, total: 5 },
    { day: "Sat", rate: 80, taken: 4, total: 5 },
    { day: "Sun", rate: 100, taken: 2, total: 2 } // Active day so far
  ],

  aiInsights: [
    {
      id: "ins-1",
      type: "ROUTINE_OPTIMIZATION",
      title: "Evening Dose Delay Pattern Detected",
      severity: "warning",
      finding: "Evening doses (8:00 PM Rosuvas 10) were delayed or missed 3 times in the past 10 days.",
      recommendation: "Ramesh Uncle typically finishes dinner around 8:45 PM. Aligning Rosuvas to 8:45 PM with dessert/warm milk or shifting to 7:30 PM before evening pooja will increase adherence by ~25%.",
      actionLabel: "Reschedule Rosuvas to 8:45 PM",
      targetMedId: "med-4"
    },
    {
      id: "ins-2",
      type: "DRUG_SAFETY",
      title: "Calcium & Iron / Meal Timing Rule",
      severity: "info",
      finding: "Shelcal-HD (Calcium 500mg) is taken at 1:30 PM after lunch.",
      recommendation: "Ensure at least 2 hours separation between Calcium tablets and high-oxalate foods like spinach/palak or green tea, as they inhibit calcium bioavailability.",
      actionLabel: "View Dietary Absorption Guide",
      targetMedId: "med-3"
    },
    {
      id: "ins-3",
      type: "INVENTORY_PREDICTION",
      title: "Rosuvas 10mg Stock Depletion Warning",
      severity: "critical",
      finding: "Only 7 tablets remain in medicine box. At 1 tablet/day, supply will run out by 22 Nov 2026.",
      recommendation: "Upcoming Cardiology appointment is on 20 Nov. Request prescription refill from Dr. Arvind Swaminathan during the clinic visit.",
      actionLabel: "Order Refill via Apollo 24/7 / MedPlus",
      targetMedId: "med-4"
    }
  ]
};
