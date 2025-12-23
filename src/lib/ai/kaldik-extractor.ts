import OpenAI from 'openai';

export interface Holiday {
  name: string;
  startDate: string;
  endDate: string;
  duration: number;
}

export interface ExtractedKaldikData {
  academicYear: string;
  semester: '1' | '2';
  startDate: string;
  endDate: string;
  effectiveWeeks: number;
  holidays: Holiday[];
  structuralDays?: string[];
  notes?: string;
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function extractKaldikData(
  fileBuffer: Buffer,
  mimeType: string
): Promise<ExtractedKaldikData> {
  console.log('[Kaldik] Starting extraction...');
  console.log('[Kaldik] File size:', fileBuffer.length, 'bytes');
  console.log('[Kaldik] MIME type:', mimeType);

  const base64Data = fileBuffer.toString('base64');

  let mediaType: 'image/jpeg' | 'image/png' | 'application/pdf';
  if (mimeType === 'image/png') {
    mediaType = 'image/png';
  } else if (mimeType === 'application/pdf') {
    mediaType = 'application/pdf';
  } else {
    mediaType = 'image/jpeg';
  }

  console.log('[Kaldik] Using mediaType:', mediaType);

  try {
    console.log('[Kaldik] Calling OpenAI API...');

    const response = await client.responses.create({
      model: 'gpt-4o',
      input: 'Ekstrak data kalender akademik dari gambar ini. Kembalikan HANYA JSON (tanpa markdown) dengan struktur: { academicYear, semester, startDate, endDate, effectiveWeeks, holidays: [{ name, startDate, endDate, duration }], structuralDays, notes }',
    } as any);

    console.log('[Kaldik] OpenAI response received');

    let responseText = '';
if (response.output && Array.isArray(response.output)) {
  for (const item of response.output) {
    const maybeText = (item as any).text;
    if (typeof maybeText === 'string' && maybeText.length > 0) {
      responseText = maybeText;
      break;
    }
  }
}


    console.log('[Kaldik] Response text length:', responseText.length);

    const jsonString = extractJsonFromResponse(responseText);

    console.log('[Kaldik] JSON extracted, length:', jsonString.length);

    const parsed = JSON.parse(jsonString) as Record<string, unknown>;

    console.log('[Kaldik] JSON parsed successfully');
    console.log('[Kaldik] Extraction completed');

    const extracted = validateAndTransformData(parsed);
    return extracted;
  } catch (error) {
    console.error('[Kaldik] Extraction error:', error);
    if (error instanceof Error) {
      console.error('[Kaldik] Error message:', error.message);
      throw new Error(`Failed to extract Kaldik data: ${error.message}`);
    }
    throw new Error('Failed to extract Kaldik data: Unknown error');
  }
}

function extractJsonFromResponse(responseText: string): string {
  console.log('[JSON Parser] Input length:', responseText.length);

  const trimmed = responseText.trim();

  const startIndex = trimmed.indexOf('{');
  const endIndex = trimmed.lastIndexOf('}');

  if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
    console.error('[JSON Parser] No JSON found');
    throw new Error('No JSON object found in response');
  }

  const jsonString = trimmed.substring(startIndex, endIndex + 1);

  console.log('[JSON Parser] Extracted JSON length:', jsonString.length);

  try {
    JSON.parse(jsonString);
    console.log('[JSON Parser] Validation passed');
    return jsonString;
  } catch (parseError) {
    console.error('[JSON Parser] Parse failed:', parseError);
    throw new Error('Invalid JSON in response');
  }
}

function validateAndTransformData(
  data: Record<string, unknown>
): ExtractedKaldikData {
  console.log('[Validator] Validating data');

  const academicYear = String(data.academicYear || '').trim();
  if (!academicYear) {
    throw new Error('academicYear required');
  }

  const semesterRaw = String(data.semester || '1').trim();
  const semester: '1' | '2' = semesterRaw === '2' ? '2' : '1';

  const startDate = String(data.startDate || '').trim();
  const endDate = String(data.endDate || '').trim();

  const effectiveWeeksRaw = data.effectiveWeeks;
  let effectiveWeeks = 0;
  if (typeof effectiveWeeksRaw === 'number') {
    effectiveWeeks = effectiveWeeksRaw;
  } else if (typeof effectiveWeeksRaw === 'string') {
    const parsed = parseInt(effectiveWeeksRaw, 10);
    effectiveWeeks = Number.isNaN(parsed) ? 0 : parsed;
  }

  const holidaysRaw = Array.isArray(data.holidays) ? data.holidays : [];
  const holidays: Holiday[] = holidaysRaw
    .map((h: any) => ({
      name: String(h.name || '').trim(),
      startDate: String(h.startDate || '').trim(),
      endDate: String(h.endDate || '').trim(),
      duration: typeof h.duration === 'number' ? h.duration : parseInt(String(h.duration), 10) || 0,
    }))
    .filter((h: Holiday) => h.name && h.startDate && h.endDate && h.duration > 0);

  const structuralDaysRaw = Array.isArray(data.structuralDays) ? data.structuralDays : [];
  const structuralDays: string[] = structuralDaysRaw
    .map((d: any) => String(d || '').trim())
    .filter((d: string) => d.length > 0);

  const notes = String(data.notes || '').trim();

  console.log('[Validator] Validation complete');

  return {
    academicYear,
    semester,
    startDate,
    endDate,
    effectiveWeeks,
    holidays,
    structuralDays: structuralDays.length > 0 ? structuralDays : undefined,
    notes: notes.length > 0 ? notes : undefined,
  };
}
