import { UnimemoMachineConfig } from "./types";

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message?: string;
  };
};

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export class UnimemoImageError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function getGeminiModel() {
  return (process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash-lite").replace(/^models\//, "");
}

function buildSchema(config: UnimemoMachineConfig) {
  return {
    type: "object",
    additionalProperties: false,
    properties: Object.fromEntries(
      config.fields.map((field) => [
        field.key,
        {
          type: [field.kind === "integer" ? "integer" : "number", "null"],
          description: field.description
        }
      ])
    ),
    required: config.fields.map((field) => field.key)
  };
}

function readTextFromGeminiResponse(data: GeminiResponse) {
  return data.candidates?.[0]?.content?.parts
    ?.map((part) => (typeof part.text === "string" ? part.text : ""))
    .join("")
    .trim();
}

function parseNumericValue(value: unknown, useRateDenominator: boolean) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.replace(/[,，]/g, "");

  if (useRateDenominator) {
    if (normalized.includes("/")) {
      const ratioMatch = normalized.match(/1\s*\/\s*(\d+(?:\.\d+)?)/);
      return ratioMatch ? Number(ratioMatch[1]) : null;
    }

    const rateMatch = normalized.match(/\d+(?:\.\d+)?/);
    return rateMatch ? Number(rateMatch[0]) : null;
  }

  const numberMatch = normalized.match(/\d+(?:\.\d+)?/);
  return numberMatch ? Number(numberMatch[0]) : null;
}

function formatNumberForInput(value: number, allowDecimal: boolean) {
  if (!Number.isFinite(value) || value < 0) {
    return null;
  }

  if (!allowDecimal) {
    return String(Math.trunc(value));
  }

  if (value === 0) {
    return null;
  }

  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function buildInputValues(parsed: unknown, config: UnimemoMachineConfig) {
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return null;
  }

  const source = parsed as Record<string, unknown>;
  const values: Record<string, string> = { ...(config.defaults ?? {}) };
  let extractedCount = 0;

  config.fields.forEach((field) => {
    const parsedValue = parseNumericValue(source[field.key], field.kind === "rate");
    const formattedValue =
      parsedValue === null ? null : formatNumberForInput(parsedValue, field.kind === "rate");

    if (formattedValue !== null) {
      values[field.key] = formattedValue;
      extractedCount += 1;
    }
  });

  return extractedCount > 0 ? values : null;
}

async function readGeminiResponse(response: Response) {
  try {
    return (await response.json()) as GeminiResponse;
  } catch {
    return {} as GeminiResponse;
  }
}

export async function analyzeUnimemoImage(request: Request, config: UnimemoMachineConfig) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new UnimemoImageError("GEMINI_API_KEYが設定されていません。", 500);
  }

  const formData = await request.formData();
  const image = formData.get("image");

  if (!(image instanceof File)) {
    throw new UnimemoImageError("画像を選択してください。", 400);
  }

  if (!ACCEPTED_IMAGE_TYPES.has(image.type)) {
    throw new UnimemoImageError("JPEG、PNG、WebPの画像を選択してください。", 400);
  }

  if (image.size > MAX_IMAGE_SIZE) {
    throw new UnimemoImageError("画像サイズは10MB以内にしてください。", 400);
  }

  const imageBase64 = Buffer.from(await image.arrayBuffer()).toString("base64");
  const model = getGeminiModel();
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: config.prompt },
              {
                inline_data: {
                  mime_type: image.type,
                  data: imageBase64
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0,
          responseMimeType: "application/json",
          responseJsonSchema: buildSchema(config)
        }
      })
    }
  );
  const data = await readGeminiResponse(response);

  if (!response.ok) {
    throw new UnimemoImageError(
      data.error?.message ? `Gemini APIの解析に失敗しました。${data.error.message}` : "Gemini APIの解析に失敗しました。",
      response.status
    );
  }

  const text = readTextFromGeminiResponse(data);

  if (!text) {
    throw new UnimemoImageError("画像から数値を読み取れませんでした。", 422);
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new UnimemoImageError("画像の解析結果を読み取れませんでした。", 422);
  }

  const values = buildInputValues(parsed, config);

  if (!values) {
    throw new UnimemoImageError("入力できる数値を読み取れませんでした。", 422);
  }

  return {
    values,
    message: config.successMessage
  };
}
