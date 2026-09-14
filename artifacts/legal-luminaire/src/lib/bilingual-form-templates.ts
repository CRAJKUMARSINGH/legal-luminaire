// Form templates for different document types in the bilingual generator

export interface FormField {
  name: string;
  label: string;
  labelHindi: string;
  type: "text" | "textarea" | "date" | "select" | "number";
  required: boolean;
  placeholder?: string;
  placeholderHindi?: string;
  options?: { value: string; label: string; labelHindi: string }[];
}

export interface DocumentFormTemplate {
  documentType: string;
  name: string;
  nameHindi: string;
  category: string;
  fields: FormField[];
}

export const DOCUMENT_FORM_TEMPLATES: DocumentFormTemplate[] = [
  // Discharge Applications
  {
    documentType: "discharge-building-collapse",
    name: "Discharge Application - Building Collapse",
    nameHindi: "डिस्चार्ज आवेदन - भवन ढहना",
    category: "Criminal",
    fields: [
      { name: "caseNumber", label: "Case Number", labelHindi: "केस नंबर", type: "text", required: true, placeholder: "Enter case number", placeholderHindi: "केस नंबर दर्ज करें" },
      { name: "courtName", label: "Court Name", labelHindi: "न्यायालय का नाम", type: "text", required: true, placeholder: "Enter court name", placeholderHindi: "न्यायालय का नाम दर्ज करें" },
      { name: "firNumber", label: "FIR Number", labelHindi: "FIR नंबर", type: "text", required: true, placeholder: "Enter FIR number", placeholderHindi: "FIR नंबर दर्ज करें" },
      { name: "incidentDate", label: "Incident Date", labelHindi: "घटना की तारीख", type: "date", required: true },
      { name: "petitioner", label: "Petitioner Name", labelHindi: "वादी का नाम", type: "text", required: true, placeholder: "Enter petitioner name", placeholderHindi: "वादी का नाम दर्ज करें" },
      { name: "respondent", label: "Respondent Name", labelHindi: "प्रतिवादी का नाम", type: "text", required: true, placeholder: "Enter respondent name", placeholderHindi: "प्रतिवादी का नाम दर्ज करें" },
      { name: "charges", label: "Charges", labelHindi: "आरोप", type: "textarea", required: true, placeholder: "Enter charges (IPC 304A + PCA)", placeholderHindi: "आरोप दर्ज करें (IPC 304A + PCA)" },
      { name: "facts", label: "Facts of the Case", labelHindi: "मामले के तथ्य", type: "textarea", required: true, placeholder: "Enter detailed facts of the building collapse case", placeholderHindi: "भवन ढहने के मामले के विस्तृत तथ्य दर्ज करें" },
      { name: "forensicIssues", label: "Forensic Evidence Issues", labelHindi: "फॉरेंसिक साक्ष्य समस्याएं", type: "textarea", required: false, placeholder: "IS standard violations, chain of custody issues", placeholderHindi: "IS मानक उल्लंघन, चेन ऑफ कस्टडी समस्याएं" },
      { name: "legalGrounds", label: "Legal Grounds", labelHindi: "कानूनी आधार", type: "textarea", required: true, placeholder: "Enter legal grounds for discharge", placeholderHindi: "डिस्चार्ज के लिए कानूनी आधार दर्ज करें" },
      { name: "prayer", label: "Prayer", labelHindi: "प्रार्थना", type: "textarea", required: true, placeholder: "Enter specific prayer/reliefs sought", placeholderHindi: "विशिष्ट प्रार्थना/राहत दर्ज करें" },
    ],
  },
  {
    documentType: "discharge-ni-act",
    name: "Discharge Application - NI Act §138",
    nameHindi: "डिस्चार्ज आवेदन - NI Act §138",
    category: "Criminal",
    fields: [
      { name: "caseNumber", label: "Case Number", labelHindi: "केस नंबर", type: "text", required: true, placeholder: "Enter case number", placeholderHindi: "केस नंबर दर्ज करें" },
      { name: "courtName", label: "Court Name", labelHindi: "न्यायालय का नाम", type: "text", required: true, placeholder: "Enter court name", placeholderHindi: "न्यायालय का नाम दर्ज करें" },
      { name: "chequeNumber", label: "Cheque Number", labelHindi: "चेक नंबर", type: "text", required: true, placeholder: "Enter cheque number", placeholderHindi: "चेक नंबर दर्ज करें" },
      { name: "chequeDate", label: "Cheque Date", labelHindi: "चेक की तारीख", type: "date", required: true },
      { name: "amount", label: "Cheque Amount", labelHindi: "चेक राशि", type: "text", required: true, placeholder: "Enter cheque amount", placeholderHindi: "चेक राशि दर्ज करें" },
      { name: "complainant", label: "Complainant Name", labelHindi: "शिकायतकर्ता का नाम", type: "text", required: true, placeholder: "Enter complainant name", placeholderHindi: "शिकायतकर्ता का नाम दर्ज करें" },
      { name: "accused", label: "Accused Name", labelHindi: "अभियुक्त का नाम", type: "text", required: true, placeholder: "Enter accused name", placeholderHindi: "अभियुक्त का नाम दर्ज करें" },
      { name: "facts", label: "Facts of the Case", labelHindi: "मामले के तथ्य", type: "textarea", required: true, placeholder: "Enter facts about the cheque transaction", placeholderHindi: "चेक लेनदेन के बारे में तथ्य दर्ज करें" },
      { name: "securityCheque", label: "Security Cheque Details", labelHindi: "सुरक्षा चेक विवरण", type: "textarea", required: false, placeholder: "Details about cheque being security, not payment", placeholderHindi: "चेक सुरक्षा होने के बारे में विवरण, भुगतान नहीं" },
      { name: "legalGrounds", label: "Legal Grounds", labelHindi: "कानूनी आधार", type: "textarea", required: true, placeholder: "Enter legal grounds (no legally enforceable debt)", placeholderHindi: "कानूनी आधार दर्ज करें (कोई कानूनी रूप से लागू ऋण नहीं)" },
      { name: "prayer", label: "Prayer", labelHindi: "प्रार्थना", type: "textarea", required: true, placeholder: "Enter prayer for discharge", placeholderHindi: "डिस्चार्ज के लिए प्रार्थना दर्ज करें" },
    ],
  },
  {
    documentType: "discharge-medical-negligence",
    name: "Discharge Application - Medical Negligence",
    nameHindi: "डिस्चार्ज आवेदन - चिकित्सा लापरवाही",
    category: "Criminal",
    fields: [
      { name: "caseNumber", label: "Case Number", labelHindi: "केस नंबर", type: "text", required: true, placeholder: "Enter case number", placeholderHindi: "केस नंबर दर्ज करें" },
      { name: "courtName", label: "Court Name", labelHindi: "न्यायालय का नाम", type: "text", required: true, placeholder: "Enter court name", placeholderHindi: "न्यायालय का नाम दर्ज करें" },
      { name: "hospitalName", label: "Hospital Name", labelHindi: "अस्पताल का नाम", type: "text", required: true, placeholder: "Enter hospital name", placeholderHindi: "अस्पताल का नाम दर्ज करें" },
      { name: "incidentDate", label: "Incident Date", labelHindi: "घटना की तारीख", type: "date", required: true },
      { name: "patientName", label: "Patient Name", labelHindi: "रोगी का नाम", type: "text", required: true, placeholder: "Enter patient name", placeholderHindi: "रोगी का नाम दर्ज करें" },
      { name: "doctorName", label: "Doctor Name", labelHindi: "डॉक्टर का नाम", type: "text", required: true, placeholder: "Enter doctor name", placeholderHindi: "डॉक्टर का नाम दर्ज करें" },
      { name: "charges", label: "Charges", labelHindi: "आरोप", type: "textarea", required: true, placeholder: "Enter charges (IPC 304A)", placeholderHindi: "आरोप दर्ज करें (IPC 304A)" },
      { name: "facts", label: "Facts of the Case", labelHindi: "मामले के तथ्य", type: "textarea", required: true, placeholder: "Enter facts about medical treatment and negligence", placeholderHindi: "चिकित्सा उपचार और लापरवाही के बारे में तथ्य दर्ज करें" },
      { name: "medicalRecords", label: "Medical Records Issues", labelHindi: "चिकित्सा रिकॉर्ड समस्याएं", type: "textarea", required: false, placeholder: "Issues with medical documentation", placeholderHindi: "चिकित्सा दस्तावेजीकरण में समस्याएं" },
      { name: "legalGrounds", label: "Legal Grounds", labelHindi: "कानूनी आधार", type: "textarea", required: true, placeholder: "Enter legal grounds for discharge", placeholderHindi: "डिस्चार्ज के लिए कानूनी आधार दर्ज करें" },
      { name: "prayer", label: "Prayer", labelHindi: "प्रार्थना", type: "textarea", required: true, placeholder: "Enter prayer for discharge", placeholderHindi: "डिस्चार्ज के लिए प्रार्थना दर्ज करें" },
    ],
  },
  // Bail Applications
  {
    documentType: "bail-ndps",
    name: "Bail Application - NDPS",
    nameHindi: "जमानत आवेदन - NDPS",
    category: "Criminal",
    fields: [
      { name: "caseNumber", label: "Case Number", labelHindi: "केस नंबर", type: "text", required: true, placeholder: "Enter case number", placeholderHindi: "केस नंबर दर्ज करें" },
      { name: "courtName", label: "Court Name", labelHindi: "न्यायालय का नाम", type: "text", required: true, placeholder: "Enter court name", placeholderHindi: "न्यायालय का नाम दर्ज करें" },
      { name: "firNumber", label: "FIR Number", labelHindi: "FIR नंबर", type: "text", required: true, placeholder: "Enter FIR number", placeholderHindi: "FIR नंबर दर्ज करें" },
      { name: "arrestDate", label: "Arrest Date", labelHindi: "गिरफ्तारी की तारीख", type: "date", required: true },
      { name: "accusedName", label: "Accused Name", labelHindi: "अभियुक्त का नाम", type: "text", required: true, placeholder: "Enter accused name", placeholderHindi: "अभियुक्त का नाम दर्ज करें" },
      { name: "age", label: "Age", labelHindi: "आयु", type: "number", required: true, placeholder: "Enter age", placeholderHindi: "आयु दर्ज करें" },
      { name: "charges", label: "Charges", labelHindi: "आरोप", type: "textarea", required: true, placeholder: "Enter charges (NDPS §20, §52A)", placeholderHindi: "आरोप दर्ज करें (NDPS §20, §52A)" },
      { name: "facts", label: "Facts of the Case", labelHindi: "मामले के तथ्य", type: "textarea", required: true, placeholder: "Enter facts about the NDPS case", placeholderHindi: "NDPS मामले के बारे में तथ्य दर्ज करें" },
      { name: "section52AViolation", label: "§52A Procedure Violation", labelHindi: "§52A प्रक्रिया उल्लंघन", type: "textarea", required: false, placeholder: "Details about §52A procedure violations", placeholderHindi: "§52A प्रक्रिया उल्लंघन के बारे में विवरण" },
      { name: "legalGrounds", label: "Legal Grounds", labelHindi: "कानूनी आधार", type: "textarea", required: true, placeholder: "Enter legal grounds for bail", placeholderHindi: "जमानत के लिए कानूनी आधार दर्ज करें" },
      { name: "prayer", label: "Prayer", labelHindi: "प्रार्थना", type: "textarea", required: true, placeholder: "Enter prayer for bail", placeholderHindi: "जमानत के लिए प्रार्थना दर्ज करें" },
    ],
  },
  {
    documentType: "bail-domestic-violence",
    name: "Bail Application - Domestic Violence",
    nameHindi: "जमानत आवेदन - घरेलू हिंसा",
    category: "Criminal",
    fields: [
      { name: "caseNumber", label: "Case Number", labelHindi: "केस नंबर", type: "text", required: true, placeholder: "Enter case number", placeholderHindi: "केस नंबर दर्ज करें" },
      { name: "courtName", label: "Court Name", labelHindi: "न्यायालय का नाम", type: "text", required: true, placeholder: "Enter court name", placeholderHindi: "न्यायालय का नाम दर्ज करें" },
      { name: "firNumber", label: "FIR Number", labelHindi: "FIR नंबर", type: "text", required: true, placeholder: "Enter FIR number", placeholderHindi: "FIR नंबर दर्ज करें" },
      { name: "incidentDate", label: "Incident Date", labelHindi: "घटना की तारीख", type: "date", required: true },
      { name: "accusedName", label: "Accused Name", labelHindi: "अभियुक्त का नाम", type: "text", required: true, placeholder: "Enter accused name", placeholderHindi: "अभियुक्त का नाम दर्ज करें" },
      { name: "complainant", label: "Complainant Name", labelHindi: "शिकायतकर्ता का नाम", type: "text", required: true, placeholder: "Enter complainant name", placeholderHindi: "शिकायतकर्ता का नाम दर्ज करें" },
      { name: "charges", label: "Charges", labelHindi: "आरोप", type: "textarea", required: true, placeholder: "Enter charges (IPC 498A + DV Act)", placeholderHindi: "आरोप दर्ज करें (IPC 498A + DV Act)" },
      { name: "facts", label: "Facts of the Case", labelHindi: "मामले के तथ्य", type: "textarea", required: true, placeholder: "Enter facts about the domestic violence incident", placeholderHindi: "घरेलू हिंसा की घटना के बारे में तथ्य दर्ज करें" },
      { name: "relationship", label: "Relationship Details", labelHindi: "रिश्ते का विवरण", type: "textarea", required: false, placeholder: "Details about relationship between parties", placeholderHindi: "पक्षों के बीच रिश्ते के बारे में विवरण" },
      { name: "legalGrounds", label: "Legal Grounds", labelHindi: "कानूनी आधार", type: "textarea", required: true, placeholder: "Enter legal grounds for bail", placeholderHindi: "जमानत के लिए कानूनी आधार दर्ज करें" },
      { name: "prayer", label: "Prayer", labelHindi: "प्रार्थना", type: "textarea", required: true, placeholder: "Enter prayer for bail", placeholderHindi: "जमानत के लिए प्रार्थना दर्ज करें" },
    ],
  },
  {
    documentType: "bail-murder",
    name: "Bail Application - Murder (IPC §302)",
    nameHindi: "जमानत आवेदन - हत्या (IPC §302)",
    category: "Criminal",
    fields: [
      { name: "caseNumber", label: "Case Number", labelHindi: "केस नंबर", type: "text", required: true, placeholder: "Enter case number", placeholderHindi: "केस नंबर दर्ज करें" },
      { name: "courtName", label: "Court Name", labelHindi: "न्यायालय का नाम", type: "text", required: true, placeholder: "Enter court name", placeholderHindi: "न्यायालय का नाम दर्ज करें" },
      { name: "firNumber", label: "FIR Number", labelHindi: "FIR नंबर", type: "text", required: true, placeholder: "Enter FIR number", placeholderHindi: "FIR नंबर दर्ज करें" },
      { name: "incidentDate", label: "Incident Date", labelHindi: "घटना की तारीख", type: "date", required: true },
      { name: "accusedName", label: "Accused Name", labelHindi: "अभियुक्त का नाम", type: "text", required: true, placeholder: "Enter accused name", placeholderHindi: "अभियुक्त का नाम दर्ज करें" },
      { name: "victimName", label: "Victim Name", labelHindi: "पीड़ित का नाम", type: "text", required: true, placeholder: "Enter victim name", placeholderHindi: "पीड़ित का नाम दर्ज करें" },
      { name: "charges", label: "Charges", labelHindi: "आरोप", type: "textarea", required: true, placeholder: "Enter charges (IPC §302 + §34)", placeholderHindi: "आरोप दर्ज करें (IPC §302 + §34)" },
      { name: "facts", label: "Facts of the Case", labelHindi: "मामले के तथ्य", type: "textarea", required: true, placeholder: "Enter facts about the murder case", placeholderHindi: "हत्या के मामले के बारे में तथ्य दर्ज करें" },
      { name: "circumstantialEvidence", label: "Circumstantial Evidence Issues", labelHindi: "परिस्थितिजन्य साक्ष्य समस्याएं", type: "textarea", required: false, placeholder: "Issues with circumstantial evidence chain", placeholderHindi: "परिस्थितिजन्य साक्ष्य श्रृंखला में समस्याएं" },
      { name: "legalGrounds", label: "Legal Grounds", labelHindi: "कानूनी आधार", type: "textarea", required: true, placeholder: "Enter legal grounds for bail", placeholderHindi: "जमानत के लिए कानूनी आधार दर्ज करें" },
      { name: "prayer", label: "Prayer", labelHindi: "प्रार्थना", type: "textarea", required: true, placeholder: "Enter prayer for bail", placeholderHindi: "जमानत के लिए प्रार्थना दर्ज करें" },
    ],
  },
];

export function getFormTemplate(documentType: string): DocumentFormTemplate | undefined {
  return DOCUMENT_FORM_TEMPLATES.find(template => template.documentType === documentType);
}

export function getAllDocumentTypes(): Array<{ value: string; label: string; labelHindi: string; category: string }> {
  return DOCUMENT_FORM_TEMPLATES.map(template => ({
    value: template.documentType,
    label: template.name,
    labelHindi: template.nameHindi,
    category: template.category,
  }));
}