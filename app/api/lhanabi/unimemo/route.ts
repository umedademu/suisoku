import { NextResponse } from "next/server";

export const runtime = "nodejs";

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

const integerKeys = [
  "currentGames",
  "currentBig",
  "currentReg",
  "furinA",
  "furinB",
  "cherryA2",
  "challengeHazure",
  "gameHazure",
  "bigFurinB",
  "bigBarake",
  "regOneRole",
  "regBarake"
] as const;

const rateKeys = [
  "challengeHazureRate",
  "gameHazureRate",
  "bigFurinBRate",
  "regOneRoleRate"
] as const;

const extractSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentGames: {
      type: ["integer", "null"],
      description: "総プレイ数。例: 7710"
    },
    currentBig: {
      type: ["integer", "null"],
      description: "総BB回数。例: 31"
    },
    currentReg: {
      type: ["integer", "null"],
      description: "総RB回数。例: 26"
    },
    furinA: {
      type: ["integer", "null"],
      description: "通常時小役の風鈴A回数。例: 647"
    },
    furinB: {
      type: ["integer", "null"],
      description: "通常時小役の風鈴B回数。例: 235"
    },
    cherryA2: {
      type: ["integer", "null"],
      description: "通常時小役のチェリーA2回数。例: 397"
    },
    challengeHazure: {
      type: ["integer", "null"],
      description: "RT中小役の花火チャレンジはずれ回数。例: 113"
    },
    challengeHazureRate: {
      type: ["number", "null"],
      description: "花火チャレンジはずれ確率の分母。1/3.8なら3.8"
    },
    gameHazure: {
      type: ["integer", "null"],
      description: "RT中小役の花火GAMEはずれ回数。例: 103"
    },
    gameHazureRate: {
      type: ["number", "null"],
      description: "花火GAMEはずれ確率の分母。1/5.0なら5.0"
    },
    bigFurinB: {
      type: ["integer", "null"],
      description: "BB中小役の風鈴B回数。例: 100"
    },
    bigFurinBRate: {
      type: ["number", "null"],
      description: "BB中小役の風鈴B確率の分母。1/6.2なら6.2"
    },
    bigBarake: {
      type: ["integer", "null"],
      description: "BB中小役のハズレ目またはバラケ目回数。例: 1"
    },
    regOneRole: {
      type: ["integer", "null"],
      description: "RB中小役の1枚役回数。例: 35"
    },
    regOneRoleRate: {
      type: ["number", "null"],
      description: "RB中小役の1枚役確率の分母。1/6.9なら6.9"
    },
    regBarake: {
      type: ["integer", "null"],
      description: "RB中小役のハズレ目またはバラケ目回数。見当たらない場合はnull"
    }
  },
  required: [
    "currentGames",
    "currentBig",
    "currentReg",
    "furinA",
    "furinB",
    "cherryA2",
    "challengeHazure",
    "challengeHazureRate",
    "gameHazure",
    "gameHazureRate",
    "bigFurinB",
    "bigFurinBRate",
    "bigBarake",
    "regOneRole",
    "regOneRoleRate",
    "regBarake"
  ]
};

const extractPrompt = `
スマスロ Lハナビのユニメモ遊技履歴画像から、推測入力に必要な数値だけを読み取ってください。

読み取り対象:
- 本情報: 総プレイ数、総BB回数、総RB回数
- 通常時小役: 風鈴A回数、風鈴B回数、チェリーA2回数
- RT中小役: 花火チャレンジはずれ回数と確率、花火GAMEはずれ回数と確率
- BB中小役: 風鈴B回数と確率、ハズレ目またはバラケ目回数
- RB中小役: 1枚役回数と確率、ハズレ目またはバラケ目回数

確率は「1/3.8」のように表示されている場合、分母だけを数値にしてください。
「チェリー合算」「風鈴合算」「氷」「BGM」「リーチ目スコア」「最大獲得枚数」は使わないでください。
見当たらない項目はnullにしてください。
`;

function getGeminiModel() {
  return (process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash-lite").replace(/^models\//, "");
}

function createErrorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
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
    const ratioMatch = normalized.match(/1\s*\/\s*(\d+(?:\.\d+)?)/);

    if (ratioMatch) {
      return Number(ratioMatch[1]);
    }
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

  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function buildInputValues(parsed: unknown) {
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return null;
  }

  const source = parsed as Record<string, unknown>;
  const values: Record<string, string> = {};

  integerKeys.forEach((key) => {
    const parsedValue = parseNumericValue(source[key], false);
    const formattedValue =
      parsedValue === null ? null : formatNumberForInput(parsedValue, false);

    if (formattedValue !== null) {
      values[key] = formattedValue;
    }
  });

  rateKeys.forEach((key) => {
    const parsedValue = parseNumericValue(source[key], true);
    const formattedValue =
      parsedValue === null ? null : formatNumberForInput(parsedValue, true);

    if (formattedValue !== null && formattedValue !== "0") {
      values[key] = formattedValue;
    }
  });

  if (Object.keys(values).length === 0) {
    return null;
  }

  values.beforeGames = "0";
  values.beforeBig = "0";
  values.beforeReg = "0";

  return values;
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    return createErrorResponse("GEMINI_API_KEYが設定されていません。", 500);
  }

  const formData = await request.formData();
  const image = formData.get("image");

  if (!(image instanceof File)) {
    return createErrorResponse("画像を選択してください。", 400);
  }

  if (!ACCEPTED_IMAGE_TYPES.has(image.type)) {
    return createErrorResponse("JPEG、PNG、WebPの画像を選択してください。", 400);
  }

  if (image.size > MAX_IMAGE_SIZE) {
    return createErrorResponse("画像サイズは10MB以内にしてください。", 400);
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
              { text: extractPrompt },
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
          responseJsonSchema: extractSchema
        }
      })
    }
  );
  const data = (await response.json()) as GeminiResponse;

  if (!response.ok) {
    return createErrorResponse(
      data.error?.message ? `Gemini APIの解析に失敗しました。${data.error.message}` : "Gemini APIの解析に失敗しました。",
      response.status
    );
  }

  const text = readTextFromGeminiResponse(data);

  if (!text) {
    return createErrorResponse("画像から数値を読み取れませんでした。", 422);
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    return createErrorResponse("画像の解析結果を読み取れませんでした。", 422);
  }

  const values = buildInputValues(parsed);

  if (!values) {
    return createErrorResponse("入力できる数値を読み取れませんでした。", 422);
  }

  return NextResponse.json({
    values,
    message: "ユニメモ画像から入力しました。"
  });
}
