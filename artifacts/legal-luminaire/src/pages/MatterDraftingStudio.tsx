import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Download,
  FileText,
  Languages,
  Save,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { useCaseContext } from "@/context/CaseContext";
import { getTemplateById, type DraftTemplate } from "@/data/draft-template-library";
import { fetchPublicText } from "@/lib/api-client";

type DraftLanguage = "en" | "hi" | "bilingual";
type Category = "Criminal" | "Civil & Commercial";
// Stage IDs match the Python backend catalog exactly (written_submissions / appeal_revision).
type StageKey = "initial" | "reply" | "rejoinder" | "supplementary" | "evidence" | "written" | "appeal" | "execution";
type TemplateId = string;

type Stage = { id: StageKey; english: string; hindi: string };
type MatterTemplate = { id: TemplateId; category: Category; family: string; english: string; hindi: string; description: string; stages: StageKey[] };

type UploadedSource = { name: string; type: string; size: number; extraction: "reviewed" | "manual-review" };
type SavedStudioState = { templateId: TemplateId; stageId: StageKey; language: DraftLanguage; applicant: string; opposingParty: string; keyDate: string; sourceText: string; extractedText: string; sources: UploadedSource[]; draft: string; draftReviewed: boolean };

const STAGES: Stage[] = [
  { id: "initial",             english: "Initial application / petition / claim",     hindi: "प्रारंभिक आवेदन / याचिका / दावा" },
  { id: "reply",               english: "Reply / objection / written statement",       hindi: "उत्तर / आपत्ति / लिखित बयान" },
  { id: "rejoinder",           english: "Rejoinder / replication",                     hindi: "प्रत्युत्तर / प्रतिउत्तर" },
  { id: "supplementary",       english: "Supplementary application / affidavit",       hindi: "पूरक आवेदन / शपथपत्र" },
  { id: "evidence",            english: "Evidence or document application",            hindi: "साक्ष्य या दस्तावेज आवेदन" },
  { id: "written", english: "Written submissions",                         hindi: "लिखित प्रस्तुतियाँ" },
  { id: "appeal",     english: "Appeal / revision",                           hindi: "अपील / पुनरीक्षण" },
  { id: "execution",           english: "Execution / compliance",                      hindi: "निष्पादन / अनुपालन" },
];

function stageFor(template: MatterTemplate, requestedStage: StageKey) {
  const id = template.stages.includes(requestedStage) ? requestedStage : template.stages[0];
  return STAGES.find((s) => s.id === id) ?? STAGES[0];
}

const TEMPLATES: MatterTemplate[] = [
  // Criminal — 15 matters
  { id: "regular-bail",                  category: "Criminal",          family: "Bail",                        english: "Regular Bail Application",                              hindi: "नियमित जमानत आवेदन",                              description: "Bail application with prosecution reply, rejoinder and written-submission stages.",           stages: ["initial","reply","rejoinder","written"] },
  { id: "anticipatory-bail",             category: "Criminal",          family: "Anticipatory bail",           english: "Anticipatory Bail Application",                          hindi: "अग्रिम जमानत आवेदन",                              description: "Anticipatory bail workflow with State/complainant objection and rejoinder.",                  stages: ["initial","reply","rejoinder"] },
  { id: "discharge",                     category: "Criminal",          family: "Discharge",                   english: "Discharge Application",                                  hindi: "आरोपमुक्ति आवेदन",                               description: "Discharge workflow with prosecution reply, rejoinder and written submissions.",                stages: ["initial","reply","rejoinder","written"] },
  { id: "criminal-complaint",            category: "Criminal",          family: "Criminal complaint",          english: "Criminal Complaint",                                     hindi: "आपराधिक शिकायत",                                 description: "Complaint, accused response or objection, and later response stages.",                        stages: ["initial","reply","rejoinder"] },
  { id: "reply-criminal-complaint",      category: "Criminal",          family: "Criminal complaint",          english: "Reply to Criminal Complaint",                            hindi: "आपराधिक शिकायत का उत्तर",                         description: "Response-stage document for a criminal complaint.",                                           stages: ["reply","rejoinder","written"] },
  { id: "reply-show-cause",              category: "Criminal",          family: "Show-cause proceeding",       english: "Reply to Show-Cause Notice",                             hindi: "कारण बताओ नोटिस का उत्तर",                        description: "Show-cause response with departmental or prosecution reply stages.",                          stages: ["reply","rejoinder","written"] },
  { id: "criminal-written-submissions",  category: "Criminal",          family: "Final defence",               english: "Criminal Written Submissions",                           hindi: "आपराधिक मामले में लिखित प्रस्तुतियाँ",            description: "Final written-submission workflow based on approved matter facts.",                           stages: ["written","reply","rejoinder"] },
  { id: "defence-brief",                 category: "Criminal",          family: "Final defence",               english: "Defence Brief",                                          hindi: "बचाव पक्ष का संक्षिप्त विवरण",                    description: "Structured defence brief with source-linked factual placeholders.",                           stages: ["written","reply","rejoinder"] },
  { id: "criminal-revision",             category: "Criminal",          family: "Criminal revision",           english: "Criminal Revision Petition",                             hindi: "आपराधिक पुनरीक्षण याचिका",                        description: "Revision petition with reply, rejoinder and written-submission stages.",                     stages: ["initial","reply","rejoinder","written","appeal"] },
  { id: "criminal-appeal",               category: "Criminal",          family: "Criminal appeal",             english: "Criminal Appeal",                                        hindi: "आपराधिक अपील",                                   description: "Criminal appeal with respondent reply and later submissions.",                                stages: ["appeal","reply","rejoinder","written"] },
  { id: "exemption-personal-appearance", category: "Criminal",          family: "Personal appearance",         english: "Application for Exemption from Personal Appearance",     hindi: "व्यक्तिगत उपस्थिति से छूट का आवेदन",             description: "Exemption application with objection and reply-to-objection stages.",                        stages: ["initial","reply","rejoinder"] },
  { id: "supply-documents",              category: "Criminal",          family: "Document supply",             english: "Application for Supply of Documents",                    hindi: "दस्तावेज उपलब्ध कराने का आवेदन",                  description: "Document supply or inspection application with response stages.",                             stages: ["evidence","reply","rejoinder"] },
  { id: "recall-witness",                category: "Criminal",          family: "Witness procedure",           english: "Application for Recall of Witness",                      hindi: "साक्षी को पुनः बुलाने का आवेदन",                  description: "Recall-witness application with objection and reply stages.",                                 stages: ["evidence","reply","rejoinder"] },
  { id: "modify-bail-conditions",        category: "Criminal",          family: "Bail conditions",             english: "Application to Modify Bail Conditions",                  hindi: "जमानत शर्तों में संशोधन का आवेदन",                description: "Modification or relaxation application with objection and rejoinder.",                        stages: ["initial","reply","rejoinder"] },
  { id: "cheque-bounce-complaint",       category: "Criminal",          family: "Cheque dishonour",            english: "Negotiable Instruments / Cheque-Bounce Complaint",       hindi: "परक्राम्य लिखत / चेक बाउंस शिकायत",              description: "Cheque-dishonour complaint with defence and written-submission stages.",                     stages: ["initial","reply","rejoinder","written"] },
  // Civil & Commercial — 15 matters
  { id: "legal-notice",                  category: "Civil & Commercial", family: "Legal notice",               english: "Legal Notice",                                           hindi: "कानूनी नोटिस",                                   description: "Notice, reply and rejoinder-notice stages.",                                                  stages: ["initial","reply","rejoinder"] },
  { id: "reply-legal-notice",            category: "Civil & Commercial", family: "Legal notice",               english: "Reply to Legal Notice",                                  hindi: "कानूनी नोटिस का उत्तर",                           description: "Reply-stage correspondence with source-linked factual review.",                              stages: ["reply","rejoinder"] },
  { id: "plaint-civil-suit",             category: "Civil & Commercial", family: "Civil suit",                 english: "Plaint / Civil Suit",                                    hindi: "वादपत्र / दीवानी वाद",                            description: "Plaint workflow with written statement, replication and evidence stages.",                   stages: ["initial","reply","rejoinder","evidence","written"] },
  { id: "written-statement",             category: "Civil & Commercial", family: "Civil suit",                 english: "Written Statement",                                      hindi: "लिखित बयान",                                     description: "Defence-stage civil pleading with replication and document review.",                          stages: ["reply","rejoinder","evidence","written"] },
  { id: "replication-rejoinder",         category: "Civil & Commercial", family: "Civil suit",                 english: "Replication / Rejoinder",                                hindi: "प्रत्युत्तर / प्रतिउत्तर",                        description: "Replication-stage civil pleading based on approved pleadings.",                              stages: ["reply","rejoinder","written"] },
  { id: "interim-injunction",            category: "Civil & Commercial", family: "Interim injunction",         english: "Interim Injunction Application",                         hindi: "अंतरिम निषेधाज्ञा आवेदन",                         description: "Injunction application with objection and rejoinder stages.",                                stages: ["initial","reply","rejoinder"] },
  { id: "permanent-injunction",          category: "Civil & Commercial", family: "Civil suit",                 english: "Permanent Injunction Suit",                              hindi: "स्थायी निषेधाज्ञा वाद",                           description: "Permanent-injunction suit with pleadings and evidence stages.",                              stages: ["initial","reply","rejoinder","evidence","written"] },
  { id: "declaratory-suit",              category: "Civil & Commercial", family: "Declaration",                english: "Declaratory Suit",                                       hindi: "घोषणा वाद",                                      description: "Declaratory suit with written statement and replication.",                                   stages: ["initial","reply","rejoinder","written"] },
  { id: "specific-performance",          category: "Civil & Commercial", family: "Specific performance",       english: "Specific Performance Suit",                              hindi: "विशिष्ट निष्पादन वाद",                            description: "Specific-performance claim with defence, replication and evidence.",                         stages: ["initial","reply","rejoinder","evidence","written"] },
  { id: "money-recovery",                category: "Civil & Commercial", family: "Money recovery",             english: "Money Recovery Suit",                                    hindi: "धन वसूली वाद",                                   description: "Recovery claim with written statement/set-off and replication.",                              stages: ["initial","reply","rejoinder","evidence","written"] },
  { id: "property-partition",            category: "Civil & Commercial", family: "Property dispute / partition",english: "Property or Partition Suit",                            hindi: "संपत्ति / विभाजन वाद",                            description: "Property or partition workflow with pleadings and document applications.",                   stages: ["initial","reply","rejoinder","evidence","written"] },
  { id: "rent-eviction",                 category: "Civil & Commercial", family: "Rent and eviction",          english: "Rent and Eviction Proceeding",                           hindi: "किराया और बेदखली कार्यवाही",                       description: "Rent or eviction proceeding with reply and rejoinder.",                                      stages: ["initial","reply","rejoinder","evidence"] },
  { id: "consumer-complaint",            category: "Civil & Commercial", family: "Consumer dispute",           english: "Consumer Complaint",                                     hindi: "उपभोक्ता शिकायत",                                description: "Consumer complaint with written version and rejoinder.",                                      stages: ["initial","reply","rejoinder","written"] },
  { id: "arbitration-claim",             category: "Civil & Commercial", family: "Arbitration",                english: "Arbitration Notice / Statement of Claim",                hindi: "मध्यस्थता नोटिस / दावा विवरण",                    description: "Arbitration claim with defence and counterclaim-reply stages.",                              stages: ["initial","reply","rejoinder","written"] },
  { id: "civil-appeal",                  category: "Civil & Commercial", family: "Civil appeal",               english: "Civil Appeal",                                           hindi: "दीवानी अपील",                                    description: "Civil appeal with respondent reply, rejoinder and written submissions.",                      stages: ["appeal","reply","rejoinder","written"] },
];

const LANGUAGE_OPTIONS: Array<{ value: DraftLanguage; label: string; hindi: string }> = [
  { value: "en",         label: "English",         hindi: "अंग्रेज़ी" },
  { value: "hi",         label: "Hindi",           hindi: "हिंदी" },
  { value: "bilingual",  label: "Bilingual paired", hindi: "द्विभाषी" },
];

function fieldOrPlaceholder(value: string, label: string) {
  return value.trim() || `[${label.toUpperCase()} TO BE CONFIRMED]`;
}

type DraftBlueprint = { english: string[]; hindi: string[] };

const FAMILY_BLUEPRINTS: Record<string, DraftBlueprint> = {
  "Bail":                        { english: ["Maintainability and custody posture","Arrest, remand and investigation status","Cooperation, antecedents and risk assessment","Parity, medical, family or other supported grounds","Proposed safeguards and undertaking"],                                                                                                                hindi: ["विचारणीयता और अभिरक्षा की स्थिति","गिरफ्तारी, रिमांड और जाँच की स्थिति","सहयोग, पूर्ववृत्त और जोखिम का आकलन","समता, स्वास्थ्य, परिवार या अन्य प्रमाणित आधार","प्रस्तावित शर्तें और अनुपालन वचन"] },
  "Anticipatory bail":           { english: ["Apprehension of arrest and factual foundation","Notice, cooperation and investigation history","Custodial-interrogation position, if supported by the record","Risk, parity and protective conditions","Undertaking for cooperation and attendance"],                                                                                   hindi: ["गिरफ्तारी की आशंका और तथ्यात्मक आधार","नोटिस, सहयोग और जाँच का इतिहास","अभिलेख से समर्थित होने पर अभिरक्षा में पूछताछ की स्थिति","जोखिम, समता और संरक्षणात्मक शर्तें","सहयोग और उपस्थिति का वचन"] },
  "Discharge":                   { english: ["Ingredients of the alleged offence","Material on record and evidentiary gaps","Prima-facie threshold and charge-specific analysis","Unproved assumptions or contradictions requiring judicial scrutiny","Relief limited to the approved record"],                                                                                      hindi: ["कथित अपराध के आवश्यक तत्व","अभिलेख की सामग्री और साक्ष्यगत कमियाँ","प्रथमदृष्टया मानक और आरोप-विशिष्ट विश्लेषण","न्यायिक परीक्षण योग्य अप्रमाणित धारणाएँ या विरोधाभास","अनुमोदित अभिलेख तक सीमित राहत"] },
  "Criminal complaint":          { english: ["Territorial jurisdiction, limitation and complainant locus","Facts constituting each alleged offence","Supporting witnesses and documents","Process and relief sought","Verification of complaint particulars"],                                                                                                                        hindi: ["क्षेत्राधिकार, परिसीमा और शिकायतकर्ता की स्थिति","प्रत्येक कथित अपराध बनाने वाले तथ्य","समर्थक साक्षी और दस्तावेज","प्रक्रिया और माँगी गई राहत","शिकायत के विवरण का सत्यापन"] },
  "Show-cause proceeding":       { english: ["Notice particulars and procedural authority","Charge-wise response and factual admissions/denials","Procedural fairness and opportunity to respond","Mitigation and proportionality, if supported","Specific relief or closure requested"],                                                                                            hindi: ["नोटिस के विवरण और प्रक्रियात्मक अधिकारिता","आरोप-वार उत्तर और तथ्यात्मक स्वीकार/इन्कार","प्रक्रियात्मक निष्पक्षता और उत्तर का अवसर","समर्थित होने पर शमन और आनुपातिकता","माँगी गई विशिष्ट राहत या कार्यवाही समाप्ति"] },
  "Final defence":               { english: ["Issues for determination","Chronology and defence theory","Evidence-wise submissions","Authority and citation placeholders for verification","Final defence and relief"],                                                                                                                                                            hindi: ["निर्धारण के लिए मुद्दे","घटनाक्रम और बचाव का सिद्धांत","साक्ष्य-वार प्रस्तुतियाँ","सत्यापन हेतु विधिक प्राधिकार और उद्धरण स्थान","अंतिम बचाव और राहत"] },
  "Criminal revision":           { english: ["Impugned order and procedural history","Jurisdiction and maintainability","Errors of law, fact or jurisdiction","Prejudice and consequence","Revisionary relief and interim protection"],                                                                                                                                            hindi: ["आक्षेपित आदेश और प्रक्रियात्मक इतिहास","क्षेत्राधिकार और विचारणीयता","विधि, तथ्य या अधिकारिता की त्रुटियाँ","हानि और उसका परिणाम","पुनरीक्षण राहत और अंतरिम संरक्षण"] },
  "Criminal appeal":             { english: ["Impugned judgment/order and grounds of challenge","Evidence and findings requiring appellate review","Errors, perversity or procedural prejudice, if supported","Suspension/interim relief position","Appellate relief sought"],                                                                                                    hindi: ["आक्षेपित निर्णय/आदेश और चुनौती के आधार","अपील न्यायालय द्वारा पुनरवलोकन योग्य साक्ष्य और निष्कर्ष","समर्थित होने पर त्रुटि, विकृति या प्रक्रियात्मक हानि","दंड/अंतरिम राहत की स्थिति","माँगी गई अपीलीय राहत"] },
  "Personal appearance":         { english: ["Case and hearing particulars","Specific ground for exemption","Medical, distance, employment or other supporting material","Undertaking to appear when directed","Limited exemption relief"],                                                                                                                                       hindi: ["वाद और सुनवाई का विवरण","उपस्थिति से छूट का विशिष्ट आधार","चिकित्सा, दूरी, रोजगार या अन्य समर्थित सामग्री","निर्देश पर उपस्थित होने का वचन","सीमित छूट की राहत"] },
  "Document supply":             { english: ["Documents or inspection sought","Relevance and procedural basis","Documents already received and documents missing","Prejudice caused by non-supply","Direction and timeline requested"],                                                                                                                                            hindi: ["माँगे गए दस्तावेज या निरीक्षण","प्रासंगिकता और प्रक्रियात्मक आधार","प्राप्त और अप्राप्त दस्तावेज","दस्तावेज न मिलने से हुई हानि","माँगा गया निर्देश और समयसीमा"] },
  "Witness procedure":           { english: ["Witness and prior testimony particulars","Necessity of recall and precise purpose","New material or clarification sought","Prejudice and safeguards against delay","Limited recall relief"],                                                                                                                                        hindi: ["साक्षी और पूर्व गवाही का विवरण","पुनः बुलाने की आवश्यकता और सटीक उद्देश्य","माँगी गई नई सामग्री या स्पष्टीकरण","विलंब के विरुद्ध हानि और सुरक्षा उपाय","सीमित पुनः बुलाने की राहत"] },
  "Bail conditions":             { english: ["Existing condition and compliance history","Changed circumstance or practical difficulty","Proposed modified condition","No-prejudice and cooperation safeguards","Specific relaxation or modification sought"],                                                                                                                    hindi: ["वर्तमान शर्त और अनुपालन का इतिहास","परिवर्तित परिस्थिति या व्यावहारिक कठिनाई","प्रस्तावित संशोधित शर्त","हानि-रहितता और सहयोग की सुरक्षा","माँगा गया विशिष्ट शिथिलीकरण या संशोधन"] },
  "Cheque dishonour":            { english: ["Instrument, authority and transaction particulars","Presentation, dishonour and notice chronology","Payment, liability and statutory-ingredient matrix","Documents and witnesses","Complaint relief and verification"],                                                                                                            hindi: ["लिखत, अधिकारिता और लेन-देन का विवरण","प्रस्तुतीकरण, अनादरण और नोटिस का घटनाक्रम","भुगतान, दायित्व और वैधानिक तत्वों की सारणी","दस्तावेज और साक्षी","शिकायत की राहत और सत्यापन"] },
  "Legal notice":                { english: ["Authority and relationship of the parties","Material facts and chronology","Contractual/statutory obligation and breach","Demand, cure period and consequences","Documents, reservation of rights and service"],                                                                                                                    hindi: ["पक्षकारों का संबंध और अधिकार","महत्वपूर्ण तथ्य और घटनाक्रम","संविदात्मक/वैधानिक दायित्व और उल्लंघन","माँग, अनुपालन अवधि और परिणाम","दस्तावेज, अधिकार सुरक्षित रखना और तामील"] },
  "Civil suit":                  { english: ["Parties, jurisdiction and valuation","Cause of action and limitation","Material pleadings and issue-wise facts","Documents and evidence plan","Reliefs, costs and consequential directions"],                                                                                                                                        hindi: ["पक्षकार, क्षेत्राधिकार और मूल्यांकन","वाद-कारण और परिसीमा","महत्वपूर्ण अभिवचन और मुद्दे-वार तथ्य","दस्तावेज और साक्ष्य योजना","राहत, खर्च और परिणामी निर्देश"] },
  "Interim injunction":          { english: ["Prima-facie right and supporting record","Urgency and threatened injury","Balance of convenience","Irreparable harm and undertaking","Precise interim restraint requested"],                                                                                                                                                        hindi: ["प्रथमदृष्टया अधिकार और समर्थक अभिलेख","तात्कालिकता और आसन्न हानि","सुविधा का संतुलन","अपूरणीय हानि और वचन","माँगी गई सटीक अंतरिम रोक"] },
  "Declaration":                 { english: ["Legal character or right requiring declaration","Adverse claim or denial","Jurisdiction, limitation and necessary parties","Evidence supporting the declaration","Declaration and consequential relief"],                                                                                                                            hindi: ["घोषणा योग्य विधिक स्थिति या अधिकार","विरोधी दावा या इन्कार","क्षेत्राधिकार, परिसीमा और आवश्यक पक्षकार","घोषणा के समर्थक साक्ष्य","घोषणा और परिणामी राहत"] },
  "Specific performance":        { english: ["Contract and enforceable obligations","Readiness, willingness and performance record","Breach, notice and response chronology","Equitable considerations and alternative relief","Specific performance and consequential relief"],                                                                                                  hindi: ["संविदा और प्रवर्तनीय दायित्व","तत्परता, इच्छा और पालन का अभिलेख","उल्लंघन, नोटिस और उत्तर का घटनाक्रम","साम्यिक विचार और वैकल्पिक राहत","विशिष्ट निष्पादन और परिणामी राहत"] },
  "Money recovery":              { english: ["Transaction, invoices and account statement","Accrual of liability and limitation","Demand, acknowledgment and payment history","Interest and computation schedule","Recovery, costs and other relief"],                                                                                                                           hindi: ["लेन-देन, चालान और खाता विवरण","दायित्व और परिसीमा","माँग, स्वीकृति और भुगतान का इतिहास","ब्याज और गणना सारणी","वसूली, खर्च और अन्य राहत"] },
  "Property dispute / partition": { english: ["Title, possession and property description","Boundaries, shares and chain of documents","Adverse claim, interference or dispossession","Site/document evidence plan","Declaration, partition, possession or injunction relief"],                                                                                              hindi: ["स्वत्व, कब्जा और संपत्ति का विवरण","सीमाएँ, हिस्से और दस्तावेजों की श्रृंखला","विरोधी दावा, हस्तक्षेप या बेदखली","स्थल/दस्तावेज साक्ष्य योजना","घोषणा, विभाजन, कब्जा या निषेधाज्ञा की राहत"] },
  "Rent and eviction":           { english: ["Tenancy, premises and relationship","Rent, default and notice chronology","Defences and supporting documents","Compliance, arrears and possession issues","Eviction, arrears or other relief"],                                                                                                                                    hindi: ["किरायेदारी, परिसर और पक्षकारों का संबंध","किराया, चूक और नोटिस का घटनाक्रम","बचाव और समर्थक दस्तावेज","अनुपालन, बकाया और कब्जे के मुद्दे","बेदखली, बकाया या अन्य राहत"] },
  "Consumer dispute":            { english: ["Consumer status and maintainability","Goods/service, deficiency or unfair practice","Complaint chronology and supporting record","Compensation and quantified relief","Documents, limitation and verification"],                                                                                                                  hindi: ["उपभोक्ता की स्थिति और विचारणीयता","वस्तु/सेवा, कमी या अनुचित व्यवहार","शिकायत का घटनाक्रम और समर्थक अभिलेख","क्षतिपूर्ति और परिमाणित राहत","दस्तावेज, परिसीमा और सत्यापन"] },
  "Arbitration":                 { english: ["Arbitration agreement and jurisdiction","Notice, dispute and reference chronology","Claim-wise liability and computation","Defence, set-off or counterclaim if supported","Reliefs, costs and interest"],                                                                                                                         hindi: ["मध्यस्थता समझौता और अधिकारिता","नोटिस, विवाद और संदर्भ का घटनाक्रम","दावा-वार दायित्व और गणना","समर्थित होने पर बचाव, समायोजन या प्रतिदावा","राहत, खर्च और ब्याज"] },
  "Civil appeal":                { english: ["Impugned judgment/order and appellate jurisdiction","Grounds on pleadings, evidence and law","Findings requiring interference","Interim protection or stay position","Appellate relief, costs and consequential directions"],                                                                                                      hindi: ["आक्षेपित निर्णय/आदेश और अपीलीय अधिकारिता","अभिवचन, साक्ष्य और विधि पर आधारित आधार","हस्तक्षेप योग्य निष्कर्ष","अंतरिम संरक्षण या स्थगन की स्थिति","अपीलीय राहत, खर्च और परिणामी निर्देश"] },
};

const STAGE_DIRECTIVES: Record<StageKey, { english: string; hindi: string }> = {
  initial:       { english: "Set out the jurisdiction, maintainability, material facts, cause or defence and precise relief without adding unsupported facts.",                         hindi: "क्षेत्राधिकार, विचारणीयता, महत्वपूर्ण तथ्य, वाद-कारण या बचाव और सटीक राहत रखें; असमर्थित तथ्य न जोड़ें।" },
  reply:         { english: "Answer the opposing document paragraph by paragraph, separating admissions, denials, lack of knowledge and objections.",                                    hindi: "विपक्षी दस्तावेज का पैराग्राफ-वार उत्तर दें और स्वीकार, इन्कार, जानकारी के अभाव तथा आपत्ति अलग रखें।" },
  rejoinder:     { english: "Respond only to new matters raised in the reply and identify any issue requiring evidence or clarification.",                                               hindi: "उत्तर में उठाए गए नए विषयों तक सीमित प्रत्युत्तर दें और साक्ष्य या स्पष्टीकरण वाले मुद्दे पहचानें।" },
  supplementary: { english: "Identify the reason for the supplementary material, its source, relevance and effect on the pending record.",                                              hindi: "पूरक सामग्री का कारण, स्रोत, प्रासंगिकता और लंबित अभिलेख पर प्रभाव स्पष्ट करें।" },
  evidence:      { english: "Map each requested document or witness to the fact it is intended to prove and preserve objections.",                                                       hindi: "प्रत्येक माँगे गए दस्तावेज या साक्षी को सिद्ध किए जाने वाले तथ्य से जोड़ें और आपत्तियाँ सुरक्षित रखें।" },
  written:       { english: "Present issue-wise submissions with record references, verified authorities and a concise final prayer.",                                                   hindi: "अभिलेख-संदर्भ, सत्यापित प्राधिकार और संक्षिप्त अंतिम प्रार्थना के साथ मुद्दे-वार प्रस्तुतियाँ दें।" },
  appeal:        { english: "Identify the impugned order, the exact error, prejudice, record reference and appellate relief.",                                                          hindi: "आक्षेपित आदेश, सटीक त्रुटि, हानि, अभिलेख-संदर्भ और अपीलीय राहत स्पष्ट करें।" },
  execution:     { english: "Identify the executable order, default, compliance history, mode of execution and quantified relief.",                                                     hindi: "प्रवर्तनीय आदेश, चूक, अनुपालन इतिहास, निष्पादन का तरीका और परिमाणित राहत स्पष्ट करें।" },
};

type DraftStageStructure = { objections: string; facts: string; issues: string };

const STAGE_STRUCTURE: Record<"en" | "hi", Record<StageKey, DraftStageStructure>> = {
  en: {
    initial:       { objections: "C. PRELIMINARY OBJECTIONS / MAINTAINABILITY",                    facts: "D. FACTUAL BACKGROUND AND CHRONOLOGY",                          issues: "E. ISSUES AND GROUNDS" },
    reply:         { objections: "C. PRELIMINARY OBJECTIONS TO THE REPLY / OBJECTION",             facts: "D. PARAGRAPH-WISE RESPONSE: ADMIT / DENY / NO KNOWLEDGE",      issues: "E. AFFIRMATIVE DEFENCE, DOCUMENTS AND RELIEF" },
    rejoinder:     { objections: "C. SCOPE OF REJOINDER AND PRELIMINARY OBJECTIONS",               facts: "D. RESPONSE TO NEW MATTERS ONLY",                               issues: "E. UNANSWERED ISSUES, EVIDENCE AND RELIEF" },
    supplementary: { objections: "C. BASIS AND PERMISSION FOR SUPPLEMENTARY MATERIAL",             facts: "D. NEW FACTS, SOURCE AND EFFECT ON RECORD",                    issues: "E. RESULTING ISSUES AND RELIEF" },
    evidence:      { objections: "C. NECESSITY AND PROCEDURAL BASIS",                              facts: "D. FACT-TO-DOCUMENT / WITNESS MAPPING",                        issues: "E. OBJECTIONS, SAFEGUARDS AND RELIEF" },
    written:       { objections: "C. ISSUES FOR DETERMINATION",                                    facts: "D. RECORD-BASED SUBMISSIONS",                                  issues: "E. AUTHORITIES, APPLICATION OF LAW AND RELIEF" },
    appeal:        { objections: "C. APPELLATE JURISDICTION AND MAINTAINABILITY",                  facts: "D. IMPUGNED FINDINGS AND RECORD REFERENCES",                   issues: "E. GROUNDS OF APPEAL / REVISION AND RELIEF" },
    execution:     { objections: "C. EXECUTABILITY AND OBJECTIONS",                                facts: "D. DEFAULT, COMPLIANCE HISTORY AND COMPUTATION",               issues: "E. MODE OF EXECUTION AND RELIEF" },
  },
  hi: {
    initial:       { objections: "C. प्रारंभिक आपत्तियाँ / विचारणीयता",                          facts: "D. तथ्यात्मक पृष्ठभूमि और घटनाक्रम",                          issues: "E. मुद्दे और आधार" },
    reply:         { objections: "C. उत्तर / आपत्ति पर प्रारंभिक आपत्तियाँ",                     facts: "D. पैराग्राफ-वार उत्तर: स्वीकार / इन्कार / जानकारी का अभाव",  issues: "E. सकारात्मक बचाव, दस्तावेज और राहत" },
    rejoinder:     { objections: "C. प्रत्युत्तर की सीमा और प्रारंभिक आपत्तियाँ",               facts: "D. केवल नए विषयों का उत्तर",                                   issues: "E. अनुत्तरित मुद्दे, साक्ष्य और राहत" },
    supplementary: { objections: "C. पूरक सामग्री का आधार और अनुमति",                            facts: "D. नए तथ्य, स्रोत और अभिलेख पर प्रभाव",                       issues: "E. परिणामी मुद्दे और राहत" },
    evidence:      { objections: "C. आवश्यकता और प्रक्रियात्मक आधार",                            facts: "D. तथ्य से दस्तावेज / साक्षी का संबंध",                        issues: "E. आपत्तियाँ, सुरक्षा और राहत" },
    written:       { objections: "C. निर्धारण योग्य मुद्दे",                                     facts: "D. अभिलेख-आधारित प्रस्तुतियाँ",                               issues: "E. प्राधिकार, विधि का प्रयोग और राहत" },
    appeal:        { objections: "C. अपीलीय अधिकारिता और विचारणीयता",                            facts: "D. आक्षेपित निष्कर्ष और अभिलेख-संदर्भ",                       issues: "E. अपील / पुनरीक्षण के आधार और राहत" },
    execution:     { objections: "C. प्रवर्तनीयता और आपत्तियाँ",                                 facts: "D. चूक, अनुपालन इतिहास और गणना",                              issues: "E. निष्पादन का तरीका और राहत" },
  },
};

type MatterPlanStage = Partial<Record<StageKey, string[]>> & { later: string[] };
type MatterPlan = { en: MatterPlanStage; hi: MatterPlanStage };

const MATTER_PLANS: Record<TemplateId, MatterPlan> = {
  "regular-bail": {
    en: { initial: ["Custody, remand and investigation status","Role attributed, offence ingredients and maximum exposure","Roots in society, antecedents, cooperation and proposed safeguards"], reply: ["Test the prosecution's custody, flight-risk and tampering objections","Separate general allegations from material specifically attributable to the applicant","Answer parity, antecedents, recovery and investigation-completion assertions"], rejoinder: ["Answer only new facts in the prosecution reply","Identify unsupported objections and record-based contradictions","Restate workable conditions and the limited relief sought"], later: ["Issue-wise bail submissions tied to the remand and case diary record","Risk analysis, proportionality and custody credit","Precise release conditions and undertaking"] },
    hi: { initial: ["अभिरक्षा, रिमांड और जाँच की स्थिति","आवेदक की भूमिका, अपराध के तत्व और संभावित अधिकतम दंड","समाज में जड़ें, पूर्ववृत्त, सहयोग और प्रस्तावित सुरक्षा शर्तें"], reply: ["अभियोजन की अभिरक्षा, फरारी और साक्ष्य-प्रभावित करने वाली आपत्तियों की जाँच","सामान्य आरोपों को आवेदक से विशेष रूप से जुड़े तथ्यों से अलग करना","समता, पूर्ववृत्त, बरामदगी और जाँच पूर्ण होने के दावों का उत्तर"], rejoinder: ["अभियोजन के उत्तर में आए केवल नए तथ्यों का जवाब","असमर्थित आपत्तियों और अभिलेख-आधारित विरोधाभासों की पहचान","व्यवहार्य शर्तों और सीमित माँगी गई राहत को दोहराना"], later: ["रिमांड और केस डायरी के अभिलेख से जुड़े मुद्दे-वार जमानत तर्क","जोखिम, आनुपातिकता और बिताई गई अभिरक्षा का विश्लेषण","सटीक रिहाई शर्तें और अनुपालन वचन"] },
  },
  "anticipatory-bail": {
    en: { initial: ["Specific and credible apprehension of arrest","Notice, cooperation and investigation chronology","Custodial interrogation, flight risk and protective conditions"], reply: ["Dissect the State or complainant's claim of custodial necessity","Answer allegations of non-cooperation, concealment or threat with record references","Address parity, delay and the scope of any proposed protection"], rejoinder: ["Confine the rejoinder to new assertions in the objection","Point out admissions, missing particulars and contradictions","Offer attendance, cooperation and non-interference safeguards"], later: ["Arrest apprehension and statutory threshold","Why protection can coexist with a fair investigation","Narrow interim or final anticipatory protection sought"] },
    hi: { initial: ["गिरफ्तारी की विशिष्ट और विश्वसनीय आशंका","नोटिस, सहयोग और जाँच का घटनाक्रम","अभिरक्षा में पूछताछ, फरारी का जोखिम और संरक्षणात्मक शर्तें"], reply: ["राज्य या शिकायतकर्ता की अभिरक्षा में पूछताछ की आवश्यकता के दावे का विश्लेषण","असहयोग, तथ्य छिपाने या धमकी के आरोपों का अभिलेख-संदर्भ सहित उत्तर","समता, विलंब और प्रस्तावित संरक्षण की सीमा पर उत्तर"], rejoinder: ["आपत्ति में आए नए कथनों तक प्रत्युत्तर सीमित रखना","स्वीकारोक्ति, अनुपस्थित विवरण और विरोधाभास दिखाना","उपस्थिति, सहयोग और गैर-हस्तक्षेप की सुरक्षा देना"], later: ["गिरफ्तारी की आशंका और वैधानिक मानक","निष्पक्ष जाँच के साथ संरक्षण क्यों संभव है","सीमित अंतरिम या अंतिम अग्रिम जमानत राहत"] },
  },
  "discharge": {
    en: { initial: ["Ingredient-by-ingredient comparison between alleged offences and record material","Charge-sheet, statements and documents: what is present, absent or legally insufficient","Prima-facie threshold, contradictions and relief limited to the record"], reply: ["Answer the prosecution's attempt to convert suspicion into prima-facie material","Separate admissible material from hearsay, assumptions and unexplained documents","Address each proposed charge and the statutory element allegedly satisfied"], rejoinder: ["Respond to new material or interpretation introduced in the reply","Identify admissions and evidentiary gaps that remain unanswered","Seek charge-specific discharge without arguing the full trial prematurely"], later: ["Charge-wise legal submissions","Record references for every alleged ingredient","Precise discharge prayer and alternative relief"] },
    hi: { initial: ["कथित अपराधों के तत्वों और अभिलेख की सामग्री की तत्व-वार तुलना","चार्जशीट, बयान और दस्तावेज: उपलब्ध, अनुपस्थित या विधि में अपर्याप्त सामग्री","प्रथमदृष्टया मानक, विरोधाभास और अभिलेख तक सीमित राहत"], reply: ["संदेह को प्रथमदृष्टया सामग्री में बदलने के अभियोजन के प्रयास का उत्तर","स्वीकार्य सामग्री को सुनी-सुनाई बात, धारणा और अस्पष्ट दस्तावेज से अलग करना","प्रत्येक प्रस्तावित आरोप और पूरे हुए बताए गए वैधानिक तत्व का उत्तर"], rejoinder: ["उत्तर में जोड़ी गई नई सामग्री या व्याख्या का जवाब","अनुत्तरित स्वीकारोक्ति और साक्ष्यगत कमियाँ पहचानना","पूरे विचारण पर समयपूर्व बहस किए बिना आरोप-विशिष्ट आरोपमुक्ति माँगना"], later: ["आरोप-वार विधिक प्रस्तुतियाँ","प्रत्येक कथित तत्व के लिए अभिलेख-संदर्भ","सटीक आरोपमुक्ति प्रार्थना और वैकल्पिक राहत"] },
  },
  "criminal-complaint": {
    en: { initial: ["Locus, territorial jurisdiction, limitation and statutory cognizance","Actus reus, mens rea and facts constituting each alleged offence","Witness, document and process plan with verification"], reply: ["Answer the accused's preliminary objection and version paragraph by paragraph","Distinguish admissions from disputed facts requiring evidence","Protect complaint particulars while addressing maintainability and process"], rejoinder: ["Answer only new defence facts or documents","Identify contradictions between the defence version and admitted record","Clarify the exact offence, witness and document still requiring consideration"], later: ["Issue-wise complaint submissions","Evidence-to-ingredient matrix","Process, compensation or other precise relief"] },
    hi: { initial: ["शिकायतकर्ता की स्थिति, क्षेत्राधिकार, परिसीमा और संज्ञान की वैधानिकता","प्रत्येक कथित अपराध बनाने वाले कृत्य, मानसिक तत्व और तथ्य","साक्षी, दस्तावेज और प्रक्रिया की सत्यापित योजना"], reply: ["आरोपी की प्रारंभिक आपत्ति और कथन का पैराग्राफ-वार उत्तर","स्वीकार तथ्यों को साक्ष्य माँगने वाले विवादित तथ्यों से अलग करना","विचारणीयता और प्रक्रिया पर उत्तर देते हुए शिकायत के विवरण सुरक्षित रखना"], rejoinder: ["बचाव में आए केवल नए तथ्य या दस्तावेजों का उत्तर","बचाव कथन और स्वीकार अभिलेख के बीच विरोधाभास पहचानना","विचार योग्य अपराध, साक्षी और दस्तावेज स्पष्ट करना"], later: ["शिकायत पर मुद्दे-वार प्रस्तुतियाँ","साक्ष्य और अपराध-तत्वों की सारणी","प्रक्रिया, प्रतिकर या अन्य सटीक राहत"] },
  },
  "reply-criminal-complaint":    { en: { later: ["Authority to answer, procedural posture and paragraph mapping","Specific admissions, denials and lack of knowledge","Maintainability, jurisdiction, limitation and defence documents"] }, hi: { later: ["उत्तर देने का अधिकार, प्रक्रियात्मक स्थिति और पैराग्राफ मानचित्र","विशिष्ट स्वीकार, इन्कार और जानकारी का अभाव","विचारणीयता, क्षेत्राधिकार, परिसीमा और बचाव दस्तावेज"] } },
  "reply-show-cause":            { en: { later: ["Notice authority, charge particulars and response deadline","Charge-wise admission, denial and factual explanation","Procedural fairness, supporting record and proportionate relief"] }, hi: { later: ["नोटिस की अधिकारिता, आरोप का विवरण और उत्तर की समयसीमा","आरोप-वार स्वीकार, इन्कार और तथ्यात्मक स्पष्टीकरण","प्रक्रियात्मक निष्पक्षता, समर्थक अभिलेख और आनुपातिक राहत"] } },
  "criminal-written-submissions": { en: { later: ["Issues for determination and burden on each issue","Evidence-wise treatment of prosecution and defence material","Proposition-to-record citation map and final relief"] }, hi: { later: ["निर्धारण योग्य मुद्दे और प्रत्येक मुद्दे पर भार","अभियोजन और बचाव सामग्री का साक्ष्य-वार विश्लेषण","प्रस्ताव से अभिलेख तक उद्धरण-सारणी और अंतिम राहत"] } },
  "defence-brief":               { en: { later: ["Defence theory, admitted facts and facts requiring strict proof","Chronology tested against each witness and document","Risk, remedy and settlement or trial posture"] }, hi: { later: ["बचाव का सिद्धांत, स्वीकार तथ्य और कड़े प्रमाण वाले तथ्य","प्रत्येक साक्षी और दस्तावेज के विरुद्ध घटनाक्रम की जाँच","जोखिम, उपाय और समझौता या विचारण की स्थिति"] } },
  "criminal-revision":           { en: { later: ["Impugned order, procedural history and revision jurisdiction","Error of law, jurisdiction, material irregularity or perversity","Prejudice, record references and limited revisionary relief"] }, hi: { later: ["आक्षेपित आदेश, प्रक्रियात्मक इतिहास और पुनरीक्षण अधिकारिता","विधि, अधिकारिता, महत्वपूर्ण अनियमितता या विकृति की त्रुटि","हानि, अभिलेख-संदर्भ और सीमित पुनरीक्षण राहत"] } },
  "criminal-appeal":             { en: { later: ["Judgment, conviction/acquittal, sentence and appellate jurisdiction","Finding-wise challenge tied to depositions, exhibits and reasons","Suspension, limitation and precise appellate relief"] }, hi: { later: ["निर्णय, दोषसिद्धि/दोषमुक्ति, दंड और अपीलीय अधिकारिता","बयान, प्रदर्श और कारणों से जुड़े निष्कर्ष-वार आधार","स्थगन, परिसीमा और सटीक अपीलीय राहत"] } },
  "exemption-personal-appearance":{ en: { later: ["Hearing date, stage and specific reason for non-appearance","Supporting medical, distance, employment or unavoidable-cause material","Undertaking, representation and limits of exemption"] }, hi: { later: ["सुनवाई की तारीख, चरण और अनुपस्थिति का विशिष्ट कारण","चिकित्सा, दूरी, रोजगार या अपरिहार्य कारण की समर्थक सामग्री","वचन, प्रतिनिधित्व और छूट की सीमा"] } },
  "supply-documents":            { en: { later: ["Exact documents, pages, inspection or certified-copy relief sought","Relevance to defence, disclosure duty and procedural entitlement","Existing supply, missing items and prejudice from non-supply"] }, hi: { later: ["माँगे गए सटीक दस्तावेज, पृष्ठ, निरीक्षण या प्रमाणित प्रति की राहत","बचाव, प्रकटीकरण दायित्व और प्रक्रियात्मक अधिकार से प्रासंगिकता","प्राप्त दस्तावेज, अप्राप्त सामग्री और न मिलने से हानि"] } },
  "recall-witness":              { en: { later: ["Witness identity, earlier testimony and exact portion to be recalled","Specific necessity: clarification, new document or material omission","Delay, prejudice and safeguards against a fishing exercise"] }, hi: { later: ["साक्षी की पहचान, पूर्व गवाही और पुनः बुलाए जाने वाला सटीक भाग","विशिष्ट आवश्यकता: स्पष्टीकरण, नया दस्तावेज या महत्वपूर्ण चूक","विलंब, हानि और खोजपरक प्रयास के विरुद्ध सुरक्षा"] } },
  "modify-bail-conditions":      { en: { later: ["Existing condition, compliance history and order imposing it","Changed circumstance or practical impossibility","Narrow modification with equivalent non-interference safeguards"] }, hi: { later: ["वर्तमान शर्त, अनुपालन इतिहास और शर्त लगाने वाला आदेश","परिवर्तित परिस्थिति या व्यावहारिक असंभवता","समकक्ष गैर-हस्तक्षेप सुरक्षा के साथ सीमित संशोधन"] } },
  "cheque-bounce-complaint":     { en: { later: ["Authority, instrument, signature/issuance and legally enforceable liability","Presentation, dishonour, statutory notice and service chronology","Payment, limitation, witnesses, exhibits and quantified prayer"] }, hi: { later: ["अधिकारिता, लिखत, हस्ताक्षर/जारीकरण और विधि से प्रवर्तनीय दायित्व","प्रस्तुतीकरण, अनादरण, वैधानिक नोटिस और तामील का घटनाक्रम","भुगतान, परिसीमा, साक्षी, प्रदर्श और परिमाणित प्रार्थना"] } },
  "legal-notice":                { en: { later: ["Authority, relationship and addresses for valid service","Chronology of obligation, breach, demand and cure period","Contractual/statutory remedy, documents and reservation of rights"] }, hi: { later: ["वैध तामील के लिए अधिकार, पक्षकार संबंध और पते","दायित्व, उल्लंघन, माँग और अनुपालन अवधि का घटनाक्रम","संविदात्मक/वैधानिक उपाय, दस्तावेज और अधिकार सुरक्षित रखना"] } },
  "reply-legal-notice":          { en: { later: ["Notice paragraph map, authority to respond and response objective","Specific admissions, denials, alternative facts and documents","Counter-demand, reservation and settlement posture"] }, hi: { later: ["नोटिस का पैराग्राफ मानचित्र, उत्तर देने का अधिकार और उद्देश्य","विशिष्ट स्वीकार, इन्कार, वैकल्पिक तथ्य और दस्तावेज","प्रतिदावा, अधिकार सुरक्षित रखना और समझौता स्थिति"] } },
  "plaint-civil-suit":           { en: { later: ["Parties, cause of action, territorial/pecuniary jurisdiction and valuation","Material facts, limitation and relief-specific pleadings","Document, witness and interim-relief plan"] }, hi: { later: ["पक्षकार, वाद-कारण, क्षेत्रीय/आर्थिक अधिकारिता और मूल्यांकन","महत्वपूर्ण तथ्य, परिसीमा और राहत-विशिष्ट अभिवचन","दस्तावेज, साक्षी और अंतरिम राहत की योजना"] } },
  "written-statement":           { en: { later: ["Preliminary objections, limitation, jurisdiction and non-joinder","Paragraph-wise admissions, denials and lack of knowledge","Affirmative defence, set-off/counterclaim and document schedule"] }, hi: { later: ["प्रारंभिक आपत्ति, परिसीमा, क्षेत्राधिकार और आवश्यक पक्षकार न होना","पैराग्राफ-वार स्वीकार, इन्कार और जानकारी का अभाव","सकारात्मक बचाव, समायोजन/प्रतिदावा और दस्तावेज सारणी"] } },
  "replication-rejoinder":       { en: { later: ["Plaint and written-statement paragraph map","New facts, inconsistent denials and admissions requiring response","No departure from cause of action; issues and proof clarified"] }, hi: { later: ["वादपत्र और लिखित बयान का पैराग्राफ मानचित्र","उत्तर योग्य नए तथ्य, असंगत इन्कार और स्वीकारोक्ति","वाद-कारण से हटे बिना मुद्दे और प्रमाण स्पष्ट करना"] } },
  "interim-injunction":          { en: { later: ["Prima-facie right, threatened act and urgency","Balance of convenience, irreparable injury and clean hands","Undertaking, notice/service and precise restraint"] }, hi: { later: ["प्रथमदृष्टया अधिकार, आसन्न कृत्य और तात्कालिकता","सुविधा का संतुलन, अपूरणीय हानि और स्वच्छ हाथ","वचन, नोटिस/तामील और सटीक रोक"] } },
  "permanent-injunction":        { en: { later: ["Right, possession or threatened interference requiring permanent restraint","Cause of action, limitation, parties and evidence","Permanent and consequential relief with boundaries"] }, hi: { later: ["स्थायी रोक के लिए अधिकार, कब्जा या आसन्न हस्तक्षेप","वाद-कारण, परिसीमा, पक्षकार और साक्ष्य","सीमाओं सहित स्थायी और परिणामी राहत"] } },
  "declaratory-suit":            { en: { later: ["Legal character, status or right requiring declaration","Adverse claim, instrument and necessary parties","Limitation, consequential relief and proof of entitlement"] }, hi: { later: ["घोषणा योग्य विधिक स्थिति, हैसियत या अधिकार","विरोधी दावा, लिखत और आवश्यक पक्षकार","परिसीमा, परिणामी राहत और अधिकार का प्रमाण"] } },
  "specific-performance":        { en: { later: ["Contract formation, essential terms and enforceability","Readiness, willingness, performance and breach chronology","Notice, equitable factors, alternative relief and proof"] }, hi: { later: ["संविदा का गठन, आवश्यक शर्तें और प्रवर्तनीयता","तत्परता, इच्छा, पालन और उल्लंघन का घटनाक्रम","नोटिस, साम्यिक विचार, वैकल्पिक राहत और प्रमाण"] } },
  "money-recovery":              { en: { later: ["Transaction, invoices, account statement and admitted amount","Accrual, acknowledgment, limitation and demand","Interest calculation, payment credits and recovery relief"] }, hi: { later: ["लेन-देन, चालान, खाता विवरण और स्वीकार राशि","दायित्व, स्वीकृति, परिसीमा और माँग का उद्भव","ब्याज गणना, भुगतान समायोजन और वसूली राहत"] } },
  "property-partition":          { en: { later: ["Title, possession, property identity, boundaries and chain of documents","Shares, genealogy, co-ownership and exclusion/interference","Partition, declaration, possession, accounts and injunction relief"] }, hi: { later: ["स्वत्व, कब्जा, संपत्ति की पहचान, सीमाएँ और दस्तावेज श्रृंखला","हिस्से, वंशावली, सह-स्वामित्व और बहिष्कार/हस्तक्षेप","विभाजन, घोषणा, कब्जा, हिसाब और निषेधाज्ञा राहत"] } },
  "rent-eviction":               { en: { later: ["Tenancy, premises, rent, default and statutory ground","Notice, service, arrears and compliance chronology","Possession, arrears, mesne profits and supporting documents"] }, hi: { later: ["किरायेदारी, परिसर, किराया, चूक और वैधानिक आधार","नोटिस, तामील, बकाया और अनुपालन का घटनाक्रम","कब्जा, बकाया, मध्यवर्ती लाभ और समर्थक दस्तावेज"] } },
  "consumer-complaint":          { en: { later: ["Consumer status, maintainability, limitation and jurisdiction","Goods/service, deficiency, unfair practice and causation","Invoices, correspondence, loss and quantified compensation"] }, hi: { later: ["उपभोक्ता की स्थिति, विचारणीयता, परिसीमा और अधिकारिता","वस्तु/सेवा, कमी, अनुचित व्यवहार और कारण-संबंध","चालान, पत्राचार, हानि और परिमाणित क्षतिपूर्ति"] } },
  "arbitration-claim":           { en: { later: ["Arbitration agreement, seat, jurisdiction and notice of dispute","Claim-wise breach, liability, chronology and computation","Relief, interest, costs and document/witness schedule"] }, hi: { later: ["मध्यस्थता समझौता, सीट, अधिकारिता और विवाद का नोटिस","दावा-वार उल्लंघन, दायित्व, घटनाक्रम और गणना","राहत, ब्याज, खर्च और दस्तावेज/साक्षी अनुसूची"] } },
  "civil-appeal":                { en: { later: ["Impugned judgment/decree, appellate jurisdiction and limitation","Finding-wise grounds tied to pleadings, exhibits and reasons","Stay, interim protection, court fee and precise appellate relief"] }, hi: { later: ["आक्षेपित निर्णय/डिक्री, अपीलीय अधिकारिता और परिसीमा","अभिवचन, प्रदर्श और कारणों से जुड़े निष्कर्ष-वार आधार","स्थगन, अंतरिम संरक्षण, न्याय शुल्क और सटीक अपीलीय राहत"] } },
};

function buildDraft({ template, stageId, language, caseTitle, court, caseNumber, applicant, opposingParty, keyDate, sourceText }: {
  template: MatterTemplate; stageId: StageKey; language: "en" | "hi";
  caseTitle: string; court: string; caseNumber: string; applicant: string;
  opposingParty: string; keyDate: string; sourceText: string;
}) {
  const matterTitle   = fieldOrPlaceholder(caseTitle,     "Matter title");
  const courtName     = fieldOrPlaceholder(court,         "Court / authority");
  const number        = fieldOrPlaceholder(caseNumber,    "Case number");
  const applicantName = fieldOrPlaceholder(applicant,     "Applicant / sender");
  const otherParty    = fieldOrPlaceholder(opposingParty, "Opposite party / recipient");
  const date          = fieldOrPlaceholder(keyDate,       "Key date");
  const stage         = stageFor(template, stageId);
  const directive     = STAGE_DIRECTIVES[stage.id];
  const blueprint     = FAMILY_BLUEPRINTS[template.family] ?? FAMILY_BLUEPRINTS["Civil suit"];
  const sectionHeadings = language === "hi" ? blueprint.hindi : blueprint.english;
  const matterPlan    = MATTER_PLANS[template.id];
  const plannedHeadings = matterPlan?.[language]?.[stage.id] ?? matterPlan?.[language]?.later ?? sectionHeadings;
  const stageStructure  = STAGE_STRUCTURE[language][stage.id];
  const draftingSections = plannedHeadings
    .map((heading, index) => `${index + 1}. ${heading}\n[Insert the approved facts, source reference and legal position here. Do not infer or create a fact.]`)
    .join("\n\n");
  const approvedFacts = sourceText.trim() || "[APPROVED FACTS TO BE ADDED]";

  if (language === "hi") {
    return `न्यायालय / प्राधिकरण: ${courtName}

वाद / प्रकरण संख्या: ${number}

${applicantName} बनाम ${otherParty}

${template.hindi}
दस्तावेज चरण: ${stage.hindi}

विषय / मामला: ${matterTitle}

उन्नत कार्यशील मसौदा — अधिवक्ता समीक्षा अनिवार्य

A. प्रारंभिक विवरण
पक्षकार: ${applicantName} बनाम ${otherParty}
प्रमुख दिनांक: ${date}
मामला परिवार: ${template.family}

B. चरण-विशिष्ट निर्देश
${directive.hindi}

${stageStructure.objections}
[क्षेत्राधिकार, परिसीमा, विचारणीयता, आवश्यक पक्षकार और अन्य आपत्तियाँ केवल अनुमोदित अभिलेख के आधार पर लिखें। उत्तर चरण में प्रत्येक पैराग्राफ का वर्गीकरण करें; प्रत्युत्तर चरण में केवल नए विषयों का उत्तर दें।]

${stageStructure.facts}
[क्रमांकित तथ्य/उत्तर लिखें। प्रत्येक तथ्य के साथ स्रोत दस्तावेज, पृष्ठ/पैराग्राफ और सत्यापन स्थिति दें।]

${stageStructure.issues}: ${template.hindi} के लिए
${draftingSections}

F. साक्ष्य, दस्तावेज और अनुलग्नक-सारणी
क्रम | दस्तावेज / साक्षी | सिद्ध किया जाने वाला तथ्य | स्रोत / पृष्ठ | स्थिति
[1] | [विवरण] | [तथ्य] | [स्रोत] | [लंबित / सत्यापित]

G. विधिक प्राधिकार और उद्धरण नियंत्रण — कठोर नियम
─────────────────────────────────────────────────────────────────────────
नियम 1 — केवल अनुमत सूची: केवल सत्यापित case-law matrix के उद्धरण जोड़ें।
matrix में पुष्टि न हुए उद्धरण को [PENDING] लिखें — VERIFIED न मानें।

नियम 2 — शब्दशः उद्धरण: matrix के "useForDraft" फ़ील्ड का सटीक पाठ कॉपी करें।
किसी भी holding को paraphrase/summarise/reword न करें।

नियम 3 — पैराग्राफ उद्धरण: केवल तभी पैरा संख्या लिखें जब matrix entry में
"para" फ़ील्ड भरा हो। खाली हो तो पैरा संख्या मत लिखें।

नियम 4 — प्रारूप: मानक भारतीय न्यायालय उद्धरण प्रारूप:
  पक्ष बनाम पक्ष (वर्ष) खण्ड रिपोर्टर पृष्ठ[, पैरा N यदि सत्यापित हो]

नियम 5 — SECONDARY उद्धरण: "[SECONDARY — दाखिल से पहले सत्यापन आवश्यक]"

नियम 6 — PENDING उद्धरण: इस प्रारूप में नहीं आ सकते। लिखें:
[उद्धरण आवश्यक — सत्यापित प्रति प्राप्त करें: <मामले का नाम>]

[केवल अनुमत सूची के सत्यापित प्राधिकार नीचे जोड़ें।]

H. प्रार्थना / माँगी गई राहत
[इस ${stage.hindi} के लिए सटीक, क्रमांकित और तथ्य-समर्थित राहत लिखें। वैकल्पिक राहत को अलग दिखाएँ।]

I. सत्यापन
मैं/हम सत्यापित करते हैं कि ऊपर दिए गए तथ्य उपलब्ध और अधिवक्ता द्वारा अनुमोदित सामग्री पर आधारित हैं तथा कोई अज्ञात तथ्य जानबूझकर नहीं जोड़ा गया है।

अनुमोदित तथ्य-सार:
${approvedFacts}

स्थान: [स्थान की पुष्टि करें]
दिनांक: [दिनांक की पुष्टि करें]
हस्ताक्षर: ${applicantName}

स्रोत और समीक्षा नियंत्रण: मूल फाइलें सुरक्षित रखें। नाम, तारीख, रकम, धाराएँ, उद्धरण, अनुलग्नक और राहत दाखिल/प्रेषण से पहले पुनः जाँचें।`;
  }

  return `IN THE COURT / BEFORE THE AUTHORITY OF: ${courtName}

CASE / MATTER NO.: ${number}

${applicantName} v. ${otherParty}

${template.english}
Document stage: ${stage.english}

MATTER: ${matterTitle}

ADVANCED WORKING DRAFT — COUNSEL REVIEW REQUIRED

A. PRELIMINARY PARTICULARS
Parties: ${applicantName} v. ${otherParty}
Key date: ${date}
Matter family: ${template.family}

B. STAGE-SPECIFIC DIRECTION
${directive.english}

${stageStructure.objections}
[Set out jurisdiction, limitation, maintainability, necessary parties and other objections only from approved material. In a reply, classify each paragraph as admit, deny, no knowledge or objection; in a rejoinder, answer only new matters.]

${stageStructure.facts}
[Set out numbered facts or responses. Add the source document, page/paragraph and verification status for every material proposition.]

${stageStructure.issues} FOR ${template.english.toUpperCase()}
${draftingSections}

F. EVIDENCE, DOCUMENTS AND ANNEXURE SCHEDULE
Item | Document / witness | Fact to be proved | Source / page | Status
[1] | [Description] | [Fact] | [Source] | [Pending / Verified]

G. AUTHORITIES AND CITATION CONTROL — STRICT RULES
─────────────────────────────────────────────────────────────────────────
RULE 1 — ALLOWLIST ONLY: Insert ONLY citations from the verified case-law
matrix. Any citation not confirmed in the matrix must be marked [PENDING]
and MUST NOT be treated as VERIFIED in this document.

RULE 2 — VERBATIM PROPOSITIONS: Copy the exact holding/proposition text
from the matrix field "useForDraft". DO NOT paraphrase, summarise, or
reword any holding. If you cannot use the exact text, do not cite the case.

RULE 3 — PARA CITATIONS: Cite a specific paragraph number ONLY if the
matrix entry has a confirmed "para" field. If para is blank/unverified,
write the case name and citation WITHOUT any para reference.

RULE 4 — FORMAT: Use the standard Indian court citation format:
  Party v. Party (Year) Volume Reporter Page[, Para N if verified]
  Example: Union of India v. Prafulla Kumar Samal (1979) 3 SCC 4, Para 10

RULE 5 — SECONDARY citations: If you must include a SECONDARY citation,
add the qualification: "[SECONDARY — verify before filing]"

RULE 6 — PENDING citations: Must NOT appear in this draft. If you believe
a citation supports your argument but it is PENDING, write:
[CITATION REQUIRED — obtain verified copy of: <case name>]

[Insert only allowlist-verified authorities below. Confirm court, year,
 paragraph (if verified), proposition (verbatim), and source for each.]

H. PRAYER / RELIEF SOUGHT
[Set out precise, numbered and fact-supported relief for this ${stage.english}. Separate alternative relief clearly.]

I. VERIFICATION
I/We verify that the factual statements above are based on available counsel-approved material and that no unknown fact has been knowingly added.

APPROVED FACT SUMMARY
${approvedFacts}

PLACE: [Confirm place]
DATE: [Confirm date]
SIGNATURE: ${applicantName}

SOURCE AND REVIEW CONTROL: Preserve original files. Re-check every name, date, amount, section, authority, annexure and relief before filing or sending.`;
}

export default function MatterDraftingStudio() {
  const { selectedCase } = useCaseContext();
  const storageKey = `matter-drafting-studio-${selectedCase.id}`;
  const defaultApplicant     = selectedCase.parties?.find((p) => p.role === "accused"     || p.role === "petitioner")?.name  || "";
  const defaultOpposingParty = selectedCase.parties?.find((p) => p.role === "complainant" || p.role === "respondent")?.name || "";
  const defaultMatterFacts = [
    selectedCase.brief,
    selectedCase.timeline?.length
      ? `Timeline:\n${selectedCase.timeline.map((e) => `- ${e.date || "[DATE TO BE CONFIRMED]"}: ${e.title} — ${e.description}`).join("\n")}`
      : "",
    selectedCase.charges &&
      (Array.isArray(selectedCase.charges)
        ? `Charges / sections: ${selectedCase.charges.join(", ")}`
        : `Charges / sections: ${selectedCase.charges}`),
  ].filter(Boolean).join("\n\n");

  const [templateId,          setTemplateId]          = useState<TemplateId>("regular-bail");
  const [stageId,             setStageId]             = useState<StageKey>("initial");
  const [categoryFilter,      setCategoryFilter]      = useState<"All" | Category>("All");
  const [language,            setLanguage]            = useState<DraftLanguage>("en");
  const [applicant,           setApplicant]           = useState(defaultApplicant);
  const [opposingParty,       setOpposingParty]       = useState(defaultOpposingParty);
  const [keyDate,             setKeyDate]             = useState("");
  const [sourceText,          setSourceText]          = useState(defaultMatterFacts);
  const [extractedText,       setExtractedText]       = useState("");
  const [sources,             setSources]             = useState<UploadedSource[]>([]);
  const [extractionReviewed,  setExtractionReviewed]  = useState(false);
  const [draft,               setDraft]               = useState("");
  const [draftReviewed,       setDraftReviewed]       = useState(false);
  const [savedAt,             setSavedAt]             = useState("");
  const [message,             setMessage]             = useState("");

  // ── Template Library: pre-load source text when navigating from the library ──
  const [loadedTemplate, setLoadedTemplate] = useState<{
    id: string; title: string; repoPath: string; matterFamily: string;
  } | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("draft-template-library:selected");
    if (!raw) return;
    try {
      const tpl = JSON.parse(raw) as {
        id: string; title: string; description: string;
        publicPath: string; repoPath: string; matterFamily: string;
        language: string; tags: string[];
      };
      sessionStorage.removeItem("draft-template-library:selected");
      setLoadedTemplate({ id: tpl.id, title: tpl.title, repoPath: tpl.repoPath, matterFamily: tpl.matterFamily });

      // If the template has a publicly served file, fetch its text
      if (tpl.publicPath) {
        fetchPublicText(tpl.publicPath)
          .then((text: string) => {
            setSourceText(
              `=== TEMPLATE: ${tpl.title} ===\n` +
              `Source: ${tpl.repoPath}\n` +
              `Replace ALL party names, dates, amounts, sections and case numbers before filing.\n\n` +
              text
            );
            setExtractionReviewed(false);
            setMessage(`Template "${tpl.title}" loaded. Review and adapt the source text before generating.`);
          })
          .catch(() => {
            // File not served — insert a reference note instead
            setSourceText(
              (prev) =>
                `=== TEMPLATE REFERENCE: ${tpl.title} ===\n` +
                `Repo path: ${tpl.repoPath}\n` +
                `${tpl.description ?? ""}\n\n` +
                `[Paste the template text here from the repo file above, then adapt it to this matter.]\n\n` +
                prev
            );
            setExtractionReviewed(false);
            setMessage(`Template "${tpl.title}" referenced. Paste its text from ${tpl.repoPath} into the source box to begin.`);
          });
      } else {
        setSourceText(
          (prev) =>
            `=== TEMPLATE REFERENCE: ${tpl.title} ===\n` +
            `Repo path: ${tpl.repoPath}\n` +
            `[Paste the template text here, then adapt it to this matter.]\n\n` +
            prev
        );
        setExtractionReviewed(false);
        setMessage(`Template "${tpl.title}" referenced. Paste its text from the repo path shown above.`);
      }
    } catch {
      // malformed sessionStorage entry — ignore
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Restore saved studio state from localStorage on mount ──
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) {
        setTemplateId("regular-bail"); setStageId("initial"); setLanguage("en");
        setCategoryFilter("All"); setApplicant(defaultApplicant);
        setOpposingParty(defaultOpposingParty); setKeyDate("");
        setSourceText(defaultMatterFacts); setExtractedText("");
        setSources([]); setExtractionReviewed(false); setDraft(""); setDraftReviewed(false);
        return;
      }
      const state = JSON.parse(saved) as Partial<SavedStudioState>;
      if (state.templateId)                             setTemplateId(state.templateId);
      if (state.stageId)                               setStageId(state.stageId);
      if (state.language)                              setLanguage(state.language);
      if (typeof state.applicant      === "string")    setApplicant(state.applicant);
      if (typeof state.opposingParty  === "string")    setOpposingParty(state.opposingParty);
      if (typeof state.keyDate        === "string")    setKeyDate(state.keyDate);
      if (typeof state.sourceText     === "string")    setSourceText(state.sourceText);
      if (typeof state.extractedText  === "string")    setExtractedText(state.extractedText);
      if (Array.isArray(state.sources))                setSources(state.sources);
      if (typeof state.draft          === "string")    setDraft(state.draft);
      if (typeof state.draftReviewed  === "boolean")   setDraftReviewed(state.draftReviewed);
      setMessage("Saved studio state restored locally.");
    } catch {
      setMessage("A saved studio state could not be restored; the current matter is unchanged.");
    }
  }, [storageKey, defaultMatterFacts, defaultApplicant, defaultOpposingParty]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedTemplate  = TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0];
  const visibleTemplates  = TEMPLATES.filter((t) => categoryFilter === "All" || t.category === categoryFilter);

  const detectedDateCount = useMemo(() => {
    const matches = `${sourceText}\n${extractedText}`.match(/\b(?:\d{1,2}[/-]){2}\d{2,4}\b|\b\d{4}-\d{2}-\d{2}\b/g) ?? [];
    return new Set(matches).size;
  }, [sourceText, extractedText]);

  const warnings = useMemo(() => {
    const next: string[] = [];
    if (!applicant.trim())      next.push("Applicant / sender is missing.");
    if (!opposingParty.trim())  next.push("Opposite party / notice recipient is missing.");
    if (!sourceText.trim() && !extractedText.trim()) next.push("No case material has been entered.");
    if (sources.some((s) => s.extraction === "manual-review"))
      next.push("One or more PDF/image sources need visible extraction review or manual transcription.");
    if (detectedDateCount > 1)  next.push("Multiple dates were detected; confirm which date belongs in each field.");
    if (!extractionReviewed)    next.push("Approve the visible source text before generating a draft.");
    return next;
  }, [applicant, opposingParty, sourceText, extractedText, sources, detectedDateCount, extractionReviewed]);

  const handleFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    const nextSources: UploadedSource[] = [];
    let textFromFiles = "";
    for (const file of files) {
      const isText = file.type.startsWith("text/") || /\.(txt|md|csv|json)$/i.test(file.name);
      nextSources.push({ name: file.name, type: file.type || "unknown", size: file.size, extraction: isText ? "reviewed" : "manual-review" });
      if (isText) textFromFiles += `\n\n--- ${file.name} ---\n${await file.text()}`;
    }
    setSources((cur) => [...cur, ...nextSources]);
    if (textFromFiles) setExtractedText((cur) => `${cur}${textFromFiles}`.trim());
    setExtractionReviewed(false);
    setMessage("Source files added. Review the visible extraction before drafting.");
    event.target.value = "";
  };

  const saveState = () => {
    const state: SavedStudioState = { templateId, stageId, language, applicant, opposingParty, keyDate, sourceText, extractedText, sources, draft, draftReviewed };
    localStorage.setItem(storageKey, JSON.stringify(state));
    setSavedAt(new Date().toLocaleTimeString());
    setMessage("Studio state saved in this browser for the active matter.");
  };

  const generateDraft = () => {
    if (!extractionReviewed) { setMessage("Review and approve the visible source text before generating."); return; }
    const common = {
      caseTitle: selectedCase.title, court: selectedCase.court, caseNumber: selectedCase.caseNo,
      applicant, opposingParty, keyDate,
      sourceText: [sourceText, extractedText].filter(Boolean).join("\n\n"),
    };
    const generated = language === "bilingual"
      ? `ENGLISH VERSION\n\n${buildDraft({ ...common, template: selectedTemplate, stageId, language: "en" })}\n\n${"=".repeat(72)}\n\nहिंदी संस्करण\n\n${buildDraft({ ...common, template: selectedTemplate, stageId, language: "hi" })}`
      : buildDraft({ ...common, template: selectedTemplate, stageId, language });
    setDraft(generated);
    setDraftReviewed(false);
    setMessage("Draft prepared from the approved visible matter context. Review it before export.");
  };

  const exportDraft = () => {
    if (!draft || !draftReviewed) return;
    const blob   = new Blob([draft], { type: "text/plain;charset=utf-8" });
    const url    = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href     = url;
    anchor.download = `matter-draft-${templateId.toLowerCase()}-${selectedCase.id}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-full bg-background p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* ── Header ── */}
        <header className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="h-4 w-4" /> Drafting <ChevronRight className="h-3 w-3" /> Matter Drafting Studio
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Matter Drafting Studio</h1>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              Choose the matter, add the evidence, draft in Hindi, English or both, then review before filing.
            </p>
            <p className="mt-3 text-xs font-medium text-amber-700">
              Working drafts require advocate review. This studio does not make legal facts, citations or filing decisions for you.
            </p>
          </div>
          <div className="rounded-xl border bg-muted/30 px-4 py-3 text-sm md:min-w-64">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active matter</p>
            <p className="mt-1 font-semibold">{selectedCase.title}</p>
            <p className="text-xs text-muted-foreground">{selectedCase.caseNo || "Case number to be confirmed"}</p>
          </div>
        </header>

        {/* ── Loaded template banner ── */}
        {loadedTemplate && (
          <div className="flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <div className="flex items-start gap-2">
              <BookOpen className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-semibold">Template loaded: {loadedTemplate.title}</p>
                <p className="text-xs mt-0.5 text-emerald-700 font-mono">{loadedTemplate.repoPath}</p>
                <p className="text-xs mt-1 text-emerald-800">
                  Replace every party name, date, amount, section and case number with your verified facts before generating.
                </p>
              </div>
            </div>
            <button type="button" onClick={() => setLoadedTemplate(null)} aria-label="Dismiss"><X className="h-4 w-4 shrink-0" /></button>
          </div>
        )}

        {/* ── Toast message ── */}
        {message && (
          <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
            <span>{message}</span>
            <button type="button" onClick={() => setMessage("")} aria-label="Dismiss message"><X className="h-4 w-4" /></button>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">

          {/* ── LEFT COLUMN ── */}
          <section className="space-y-6">

            {/* 1. Template + stage + language */}
            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="font-semibold">1. Choose matter and language</h2>
                  <p className="text-xs text-muted-foreground">Complete 30-template catalog. Choose a matter family, procedural stage and language.</p>
                </div>
              </div>

              {/* Category filter */}
              <div className="mb-3 grid gap-2 sm:grid-cols-3">
                {(["All", "Criminal", "Civil & Commercial"] as const).map((cat) => (
                  <button
                    type="button" key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`rounded-lg border px-3 py-2 text-xs font-semibold ${categoryFilter === cat ? "border-primary bg-primary/5" : "hover:bg-muted"}`}
                  >
                    {cat === "All" ? "All 30 matters" : cat}
                  </button>
                ))}
              </div>

              {/* Template list */}
              <div className="max-h-[34rem] space-y-3 overflow-y-auto pr-1">
                {visibleTemplates.map((tmpl) => (
                  <button
                    type="button" key={tmpl.id}
                    onClick={() => { setTemplateId(tmpl.id); setStageId(tmpl.stages[0]); setDraft(""); setDraftReviewed(false); }}
                    className={`w-full rounded-xl border p-4 text-left transition ${templateId === tmpl.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:border-primary/50"}`}
                    aria-pressed={templateId === tmpl.id}
                  >
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">{tmpl.category}</span>
                      {templateId === tmpl.id && <CheckCircle2 className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="font-semibold">{tmpl.english}</p>
                    <p className="text-sm text-muted-foreground">{tmpl.hindi}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{tmpl.description}</p>
                  </button>
                ))}
              </div>

              {/* Stage select */}
              <label className="mt-4 block text-sm font-medium">Document stage
                <select
                  value={stageId}
                  onChange={(e) => { setStageId(e.target.value as StageKey); setDraft(""); setDraftReviewed(false); }}
                  className="mt-1.5 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal"
                >
                  {selectedTemplate.stages.map((s) => {
                    const st = stageFor(selectedTemplate, s);
                    return <option key={st.id} value={st.id}>{st.english} · {st.hindi}</option>;
                  })}
                </select>
              </label>

              {/* Language */}
              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                {LANGUAGE_OPTIONS.map((opt) => (
                  <label key={opt.value} className={`cursor-pointer rounded-lg border px-3 py-2 text-center text-xs ${language === opt.value ? "border-primary bg-primary/5 font-semibold" : ""}`}>
                    <input className="sr-only" type="radio" name="draft-language" value={opt.value} checked={language === opt.value} onChange={() => { setLanguage(opt.value); setDraft(""); setDraftReviewed(false); }} />
                    <Languages className="mx-auto mb-1 h-4 w-4" />
                    <span className="block">{opt.label}</span>
                    <span className="block text-muted-foreground">{opt.hindi}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 2. Matter facts */}
            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="font-semibold">2. Add matter facts</h2>
                  <p className="text-xs text-muted-foreground">These fields stay editable and are never silently filled with invented facts.</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium">Applicant / sender
                  <input value={applicant} onChange={(e) => setApplicant(e.target.value)} className="mt-1.5 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal" placeholder="Name as it appears in the record" />
                </label>
                <label className="text-sm font-medium">Opposite party / recipient
                  <input value={opposingParty} onChange={(e) => setOpposingParty(e.target.value)} className="mt-1.5 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal" placeholder="Name as it appears in the record" />
                </label>
                <label className="text-sm font-medium sm:col-span-2">Key date
                  <input value={keyDate} onChange={(e) => setKeyDate(e.target.value)} className="mt-1.5 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal" placeholder="DD/MM/YYYY — confirm against sources" />
                </label>
              </div>
              <label className="mt-4 block text-sm font-medium">Typed or pasted case material
                <textarea value={sourceText} onChange={(e) => { setSourceText(e.target.value); setExtractionReviewed(false); }} className="mt-1.5 min-h-28 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal" placeholder="Paste or type facts, allegations, dates, amounts and requested relief." />
              </label>
            </div>

            {/* 3. Source extraction */}
            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="font-semibold">3. Review source extraction</h2>
                  <p className="text-xs text-muted-foreground">Text files are read locally. PDFs and images remain marked for manual/OCR review until approved.</p>
                </div>
              </div>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed p-4 text-sm font-semibold hover:bg-muted/40">
                <Upload className="h-4 w-4" /> Add PDF, image or text source
                <input type="file" accept=".pdf,.png,.jpg,.jpeg,.txt,.md,.csv,.json" multiple className="sr-only" onChange={handleFiles} />
              </label>
              {sources.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {sources.map((src, idx) => (
                    <li key={`${src.name}-${idx}`} className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-xs">
                      <span className="truncate pr-3">{src.name} · {(src.size / 1024).toFixed(1)} KB</span>
                      <span className={src.extraction === "reviewed" ? "text-emerald-700" : "text-amber-700"}>
                        {src.extraction === "reviewed" ? "Text loaded" : "Manual review"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <label className="mt-4 block text-sm font-medium">Visible extracted text / OCR correction
                <textarea value={extractedText} onChange={(e) => { setExtractedText(e.target.value); setExtractionReviewed(false); }} className="mt-1.5 min-h-32 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal" placeholder="Review, correct or paste the extracted text here before approving it." />
              </label>
              <label className="mt-4 flex items-start gap-2 text-sm">
                <input type="checkbox" className="mt-1" checked={extractionReviewed} onChange={(e) => setExtractionReviewed(e.target.checked)} />
                <span>I reviewed and approved the visible source text for use in this draft.</span>
              </label>
            </div>
          </section>

          {/* ── RIGHT COLUMN ── */}
          <section className="space-y-6">

            {/* Safety checks + generate */}
            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold">Safety checks before drafting</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Warnings are intentionally visible; they do not block editing, but they block unsafe generation/export steps.</p>
                </div>
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="mt-4 space-y-2">
                {warnings.length === 0
                  ? <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800"><CheckCircle2 className="h-4 w-4" /> Required review gates passed.</div>
                  : warnings.map((w) => (
                    <div key={w} className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> <span>{w}</span>
                    </div>
                  ))
                }
              </div>
              <button
                type="button" onClick={generateDraft} disabled={!extractionReviewed}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" /> Create a Matter-Specific Draft
              </button>
            </div>

            {/* Editable draft */}
            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">Editable draft</h2>
                  <p className="text-xs text-muted-foreground">{selectedTemplate.english} · {LANGUAGE_OPTIONS.find((o) => o.value === language)?.label}</p>
                </div>
                <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800">Review required</span>
              </div>
              <textarea
                value={draft}
                onChange={(e) => { setDraft(e.target.value); setDraftReviewed(false); }}
                className="min-h-[34rem] w-full rounded-lg border bg-background px-3 py-3 font-mono text-xs leading-6"
                placeholder="Your reviewed, editable matter-specific draft will appear here."
              />
              <label className="mt-4 flex items-start gap-2 text-sm">
                <input type="checkbox" className="mt-1" checked={draftReviewed} onChange={(e) => setDraftReviewed(e.target.checked)} disabled={!draft} />
                <span>I reviewed the editable draft and confirm it is ready for my next professional review step.</span>
              </label>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={saveState} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-muted">
                  <Save className="h-4 w-4" /> Save &amp; resume {savedAt && `(${savedAt})`}
                </button>
                <button type="button" onClick={exportDraft} disabled={!draft || !draftReviewed} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50">
                  <Download className="h-4 w-4" /> Export reviewed text
                </button>
              </div>
            </div>

          </section>
        </div>
      </div>
    </div>
  );
}
