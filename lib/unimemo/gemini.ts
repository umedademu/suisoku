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

type GeminiRequestPart =
  | {
      text: string;
    }
  | {
      inline_data: {
        mime_type: string;
        data: string;
      };
    };

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_IMAGE_COUNT = 8;
const MAX_TOTAL_IMAGE_SIZE = 20 * 1024 * 1024;
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

function buildPrompt(config: UnimemoMachineConfig, imageCount: number) {
  const layoutGuide = config.layoutGuide?.trim();
  const sharedGuide = `
画像の扱い:
- ユニメモ公式アプリが生成した縦長1枚画像と、ユーザーが画面を分けて撮った複数画像のどちらもあり得ます。
- 入力画像は${imageCount}枚です。複数画像の場合は画像1、画像2の順に、上から下へ続く画面である可能性が高いです。
- 複数画像で同じ部分が重なって写っている場合は、同じ項目として扱い、回数を足さないでください。
- 同じ項目名が複数の区分に出る場合は、直近の黄色い見出し、前後の項目、下の表示順を使って区分を判別してください。
- 見出しも前後の項目もなく、どの区分か判別できない項目はnullにしてください。推測で別区分へ入れないでください。
- 右側にある「回」「G」「枚」「P」の数値を回数や値として読み取り、その下にある「1/12.3」のような表示は確率として読み取ってください。
`.trim();

  return [config.prompt.trim(), layoutGuide ? `ユニメモ画面の表示順:\n${layoutGuide}` : "", sharedGuide]
    .filter(Boolean)
    .join("\n\n");
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

function readImagesFromFormData(formData: FormData) {
  return formData.getAll("image").filter((item): item is File => item instanceof File);
}

function validateImages(images: File[]) {
  if (images.length === 0) {
    throw new UnimemoImageError("画像を選択してください。", 400);
  }

  if (images.length > MAX_IMAGE_COUNT) {
    throw new UnimemoImageError(`画像は${MAX_IMAGE_COUNT}枚以内にしてください。`, 400);
  }

  const totalSize = images.reduce((sum, image) => sum + image.size, 0);

  if (totalSize > MAX_TOTAL_IMAGE_SIZE) {
    throw new UnimemoImageError("画像サイズの合計は20MB以内にしてください。", 400);
  }

  images.forEach((image) => {
    if (!ACCEPTED_IMAGE_TYPES.has(image.type)) {
      throw new UnimemoImageError("JPEG、PNG、WebPの画像を選択してください。", 400);
    }

    if (image.size > MAX_IMAGE_SIZE) {
      throw new UnimemoImageError("画像サイズは1枚10MB以内にしてください。", 400);
    }
  });
}

async function buildImageParts(images: File[]) {
  const parts: GeminiRequestPart[] = [];

  for (const [index, image] of images.entries()) {
    const imageBase64 = Buffer.from(await image.arrayBuffer()).toString("base64");

    parts.push({ text: `画像${index + 1}` });
    parts.push({
      inline_data: {
        mime_type: image.type,
        data: imageBase64
      }
    });
  }

  return parts;
}

export async function analyzeUnimemoImage(request: Request, config: UnimemoMachineConfig) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new UnimemoImageError("GEMINI_API_KEYが設定されていません。", 500);
  }

  const formData = await request.formData();
  const images = readImagesFromFormData(formData);
  validateImages(images);

  const model = getGeminiModel();
  const imageParts = await buildImageParts(images);
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
              { text: buildPrompt(config, images.length) },
              ...imageParts
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
