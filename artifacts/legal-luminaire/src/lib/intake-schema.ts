import { z } from "zod";

/** Bilingual validation message: "हिन्दी / English". */
export const msg = (hi: string, en: string) => `${hi} / ${en}`;

const DDMMYYYY = /^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

const optionalDate = z
  .string()
  .trim()
  .refine((v) => v === "" || DDMMYYYY.test(v), {
    message: msg("तिथि DD-MM-YYYY प्रारूप में दें", "Use DD-MM-YYYY date format"),
  });

export const CASE_TYPES = ["discharge", "bail", "writ", "notice-reply", "appeal", "revision", "other"] as const;

export const caseIntakeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, msg("केस शीर्षक आवश्यक है", "Case title is required"))
    .max(200, msg("शीर्षक 200 अक्षरों से कम रखें", "Keep the title under 200 characters")),
  caseNo: z.string().trim().max(80, msg("केस संख्या बहुत लंबी है", "Case number is too long")),
  court: z
    .string()
    .trim()
    .min(1, msg("न्यायालय का नाम आवश्यक है", "Court name is required")),
  caseType: z.enum(CASE_TYPES, {
    error: msg("मामले का प्रकार चुनें", "Select a case type"),
  }),
  accusedName: z.string().trim().max(160, msg("नाम बहुत लंबा है", "Name is too long")),
  incidentDate: optionalDate,
  firDate: optionalDate,
  arrestDate: optionalDate,
  remandDate: optionalDate,
  chargeSheetDate: optionalDate,
  brief: z
    .string()
    .trim()
    .min(1, msg("संक्षिप्त विवरण आवश्यक है", "Brief statement is required"))
    .min(40, msg("कम से कम 40 अक्षरों का विवरण दें — तथ्य, आरोप, वर्तमान चरण", "Give at least 40 characters — facts, allegations, current stage")),
});

export type CaseIntakeInput = z.input<typeof caseIntakeSchema>;
export type CaseIntakeField = keyof CaseIntakeInput;
export type FieldErrors = Partial<Record<CaseIntakeField, string>>;

/** Returns first error message per field (bilingual), or {} when valid. */
export function validateIntake(input: CaseIntakeInput): FieldErrors {
  const res = caseIntakeSchema.safeParse(input);
  if (res.success) return {};
  const out: FieldErrors = {};
  for (const issue of res.error.issues) {
    const key = issue.path[0] as CaseIntakeField | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
