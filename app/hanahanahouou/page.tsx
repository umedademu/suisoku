"use client";

import { useEffect, useState } from "react";

const settings = [
  {
    setting: "設定1",
    bb: "1/297",
    rb: "1/496",
    bell: "1/7.50",
    topBlue: "3.70%",
    topYellow: "2.91%",
    topGreen: "1.96%",
    topRed: "1.25%",
    topRainbow: "0.01%",
    topTotal: "9.82%",
    sideBlue: "36.04%",
    sideYellow: "24.20%",
    sideGreen: "23.84%",
    sideRed: "15.90%",
    sideRainbow: "0.02%",
    soundRetro: "6.24%",
    bigSuika: "1/48.13",
    bigHazure: "1/63908",
    payout: "97%"
  },
  {
    setting: "設定2",
    bb: "1/284",
    rb: "1/458",
    bell: "1/7.44",
    topBlue: "3.98%",
    topYellow: "3.24%",
    topGreen: "2.05%",
    topRed: "1.30%",
    topRainbow: "0.02%",
    topTotal: "10.59%",
    sideBlue: "23.32%",
    sideYellow: "34.78%",
    sideGreen: "16.73%",
    sideRed: "25.14%",
    sideRainbow: "0.04%",
    soundRetro: "7.08%",
    bigSuika: "1/44.36",
    bigHazure: "1/35254",
    payout: "99%"
  },
  {
    setting: "設定3",
    bb: "1/273",
    rb: "1/425",
    bell: "1/7.40",
    topBlue: "4.30%",
    topYellow: "3.52%",
    topGreen: "2.35%",
    topRed: "1.49%",
    topRainbow: "0.07%",
    topTotal: "11.73%",
    sideBlue: "33.70%",
    sideYellow: "22.18%",
    sideGreen: "26.56%",
    sideRed: "17.45%",
    sideRainbow: "0.11%",
    soundRetro: "7.72%",
    bigSuika: "1/41.05",
    bigHazure: "1/21162",
    payout: "101%"
  },
  {
    setting: "設定4",
    bb: "1/262",
    rb: "1/397",
    bell: "1/7.33",
    topBlue: "4.76%",
    topYellow: "3.79%",
    topGreen: "2.60%",
    topRed: "1.58%",
    topRainbow: "0.11%",
    topTotal: "12.85%",
    sideBlue: "21.29%",
    sideYellow: "32.46%",
    sideGreen: "18.25%",
    sideRed: "27.81%",
    sideRainbow: "0.18%",
    soundRetro: "10.27%",
    bigSuika: "1/37.40",
    bigHazure: "1/17578",
    payout: "103%"
  },
  {
    setting: "設定5",
    bb: "1/249",
    rb: "1/366",
    bell: "1/7.29",
    topBlue: "5.17%",
    topYellow: "4.18%",
    topGreen: "2.84%",
    topRed: "1.73%",
    topRainbow: "0.20%",
    topTotal: "14.12%",
    sideBlue: "31.11%",
    sideYellow: "20.57%",
    sideGreen: "28.67%",
    sideRed: "19.25%",
    sideRainbow: "0.40%",
    soundRetro: "10.93%",
    bigSuika: "1/34.76",
    bigHazure: "1/12417",
    payout: "106%"
  },
  {
    setting: "設定6",
    bb: "1/236",
    rb: "1/337",
    bell: "1/7.24",
    topBlue: "5.77%",
    topYellow: "4.49%",
    topGreen: "3.00%",
    topRed: "1.88%",
    topRainbow: "0.42%",
    topTotal: "15.57%",
    sideBlue: "24.90%",
    sideYellow: "24.77%",
    sideGreen: "24.68%",
    sideRed: "24.89%",
    sideRainbow: "0.76%",
    soundRetro: "12.68%",
    bigSuika: "1/31.93",
    bigHazure: "1/10439",
    payout: "109%"
  }
];

type InputField = {
  key: string;
  label: string;
  unit?: string;
  widthClass?: string;
};

type StandardInputGroup = {
  title: string;
  note?: string;
  rowClass?: string;
  fields: InputField[];
};

type PieceInputRow = {
  label: string;
  trialKey: string;
  occurrenceKey: string;
};

type PieceInputGroup = {
  title: string;
  rowClass?: string;
  inputWidthClass?: string;
  rows: PieceInputRow[];
};

type InputGroup = StandardInputGroup | PieceInputGroup;

const inputGroups: InputGroup[] = [
  {
    title: "開始前",
    fields: [
      { key: "beforeGames", label: "G数" },
      { key: "beforeBig", label: "BIG" },
      { key: "beforeReg", label: "REG" }
    ]
  },
  {
    title: "現在",
    fields: [
      { key: "currentGames", label: "G数" },
      { key: "currentBig", label: "BIG" },
      { key: "currentReg", label: "REG" }
    ]
  },
  {
    title: "通常時小役",
    fields: [{ key: "bell", label: "ベル", widthClass: "number-input-bell-wide" }]
  },
  {
    title: "BIG中小役",
    note: "分母はBIG回数×24Gで自動計算",
    fields: [
      { key: "bigSuika", label: "スイカ", widthClass: "number-input-big-role" },
      { key: "bigHazure", label: "ハズレ", widthClass: "number-input-big-role" }
    ]
  },
  {
    title: "BIG後トップランプ",
    rowClass: "input-row-lamp",
    fields: [
      { key: "topBlue", label: "青", widthClass: "number-input-lamp" },
      { key: "topYellow", label: "黄", widthClass: "number-input-lamp" },
      { key: "topGreen", label: "緑", widthClass: "number-input-lamp" },
      { key: "topRed", label: "赤", widthClass: "number-input-lamp" },
      { key: "topRainbow", label: "虹", widthClass: "number-input-lamp" }
    ]
  },
  {
    title: "REG中サイドランプ",
    rowClass: "input-row-lamp",
    fields: [
      { key: "sideBlue", label: "青", widthClass: "number-input-lamp" },
      { key: "sideYellow", label: "黄", widthClass: "number-input-lamp" },
      { key: "sideGreen", label: "緑", widthClass: "number-input-lamp" },
      { key: "sideRed", label: "赤", widthClass: "number-input-lamp" },
      { key: "sideRainbow", label: "虹", widthClass: "number-input-lamp" }
    ]
  },
  {
    title: "連チャンサウンド選択率",
    rowClass: "piece-input-row-tight",
    inputWidthClass: "number-input-piece-tight",
    rows: [
      {
        label: "レトロ",
        trialKey: "soundRetroTrials",
        occurrenceKey: "soundRetroHits"
      }
    ]
  },
  {
    title: "店情報",
    fields: [
      {
        key: "medalRent",
        label: "貸枚数",
        unit: "枚",
        widthClass: "number-input-short"
      },
      {
        key: "exchangeRate",
        label: "交換率",
        unit: "枚",
        widthClass: "number-input-short"
      },
      {
        key: "cashInvestment",
        label: "現金投資",
        unit: "円",
        widthClass: "number-input-medium"
      }
    ]
  }
];

const initialValues = {
  ...Object.fromEntries(
    inputGroups.flatMap((group) =>
      "fields" in group
        ? group.fields.map((field) => [field.key, ""] as const)
        : group.rows.flatMap((row) => [
            [row.trialKey, ""] as const,
            [row.occurrenceKey, ""] as const
          ])
    )
  ),
  medalRent: "46",
  exchangeRate: "5.0"
};

const STORAGE_KEY = "suisoku-hanahanahouou-inputs";

const specGroups = [
  {
    title: "基本スペック",
    columns: [
      { label: "BIG", key: "bb" },
      { label: "REG", key: "rb" },
      { label: "ボーナス合算", key: "bonusTotal" },
      { label: "機械割", key: "payout" }
    ]
  },
  {
    title: "通常時小役",
    columns: [{ label: "ベル", key: "bell" }]
  },
  {
    title: "BIG中小役",
    columns: [
      { label: "スイカ", key: "bigSuika" },
      { label: "ハズレ", key: "bigHazure" }
    ]
  },
  {
    title: "BIG後トップランプ",
    columns: [
      { label: "青", key: "topBlue" },
      { label: "黄", key: "topYellow" },
      { label: "緑", key: "topGreen" },
      { label: "赤", key: "topRed" },
      { label: "虹", key: "topRainbow" },
      { label: "計", key: "topTotal" }
    ]
  },
  {
    title: "REG中サイドランプ",
    columns: [
      { label: "青", key: "sideBlue" },
      { label: "黄", key: "sideYellow" },
      { label: "緑", key: "sideGreen" },
      { label: "赤", key: "sideRed" },
      { label: "虹", key: "sideRainbow" }
    ]
  },
  {
    title: "連チャンサウンド選択率",
    columns: [{ label: "レトロ", key: "soundRetro" }]
  }
] as const;

const probabilityDisplayGroups = [
  {
    title: "ボーナス",
    headerSuffix: "G",
    items: [
      { title: "BIG", key: "bb" as const },
      { title: "REG", key: "rb" as const },
      { title: "合算", key: "sum" as const }
    ]
  },
  {
    title: "通常時小役",
    headerSuffix: "G",
    items: [{ title: "ベル", key: "bell" as const }]
  },
  {
    title: "BIG中小役",
    headerSuffix: "G",
    items: [
      { title: "スイカ", key: "bigSuika" as const },
      { title: "ハズレ", key: "bigHazure" as const }
    ]
  },
  {
    title: "BIG後トップランプ",
    headerSuffix: "回",
    items: [
      { title: "青", key: "topBlue" as const },
      { title: "黄", key: "topYellow" as const },
      { title: "緑", key: "topGreen" as const },
      { title: "赤", key: "topRed" as const },
      { title: "虹", key: "topRainbow" as const },
      { title: "計", key: "topTotal" as const }
    ]
  },
  {
    title: "REG中サイドランプ",
    headerSuffix: "回",
    items: [
      { title: "青", key: "sideBlue" as const },
      { title: "黄", key: "sideYellow" as const },
      { title: "緑", key: "sideGreen" as const },
      { title: "赤", key: "sideRed" as const },
      { title: "虹", key: "sideRainbow" as const }
    ]
  },
  {
    title: "連チャンサウンド",
    headerSuffix: "回",
    items: [{ title: "レトロ", key: "soundRetro" as const }]
  }
] as const;

type RateKey =
  | "bb"
  | "rb"
  | "sum"
  | "bell"
  | "topBlue"
  | "topYellow"
  | "topGreen"
  | "topRed"
  | "topRainbow"
  | "topTotal"
  | "sideBlue"
  | "sideYellow"
  | "sideGreen"
  | "sideRed"
  | "sideRainbow"
  | "soundRetro"
  | "bigSuika"
  | "bigHazure";

type ProbabilityDefinition = {
  key: RateKey;
  count: number;
  base: number;
  summaryStyle?: "frequency" | "percent";
};

function parseRate(value: string) {
  const trimmed = value.replace("1/", "");
  const denominator = Number(trimmed);

  if (!Number.isFinite(denominator) || denominator <= 0) {
    return 0;
  }

  return 1 / denominator;
}

function parsePayoutRate(value: string) {
  const trimmed = value.replace("%", "");
  const percent = Number(trimmed);

  if (!Number.isFinite(percent)) {
    return 0;
  }

  return percent / 100;
}

const settingRates = settings.map((setting) => ({
  label: setting.setting,
  bb: parseRate(setting.bb),
  rb: parseRate(setting.rb),
  sum: parseRate(setting.bb) + parseRate(setting.rb),
  bell: parseRate(setting.bell),
  topBlue: parsePayoutRate(setting.topBlue),
  topYellow: parsePayoutRate(setting.topYellow),
  topGreen: parsePayoutRate(setting.topGreen),
  topRed: parsePayoutRate(setting.topRed),
  topRainbow: parsePayoutRate(setting.topRainbow),
  topTotal: parsePayoutRate(setting.topTotal),
  sideBlue: parsePayoutRate(setting.sideBlue),
  sideYellow: parsePayoutRate(setting.sideYellow),
  sideGreen: parsePayoutRate(setting.sideGreen),
  sideRed: parsePayoutRate(setting.sideRed),
  sideRainbow: parsePayoutRate(setting.sideRainbow),
  soundRetro: parsePayoutRate(setting.soundRetro),
  bigSuika: parseRate(setting.bigSuika),
  bigHazure: parseRate(setting.bigHazure)
}));

const settingsDisplay = settings.map((setting) => ({
  setting: setting.setting,
  bb: formatRateFromProbability(parseRate(setting.bb)),
  rb: formatRateFromProbability(parseRate(setting.rb)),
  bonusTotal: formatRateFromProbability(parseRate(setting.bb) + parseRate(setting.rb)),
  bell: formatRateFromProbability(parseRate(setting.bell)),
  topBlue: formatOccurrenceRate(parsePayoutRate(setting.topBlue)),
  topYellow: formatOccurrenceRate(parsePayoutRate(setting.topYellow)),
  topGreen: formatOccurrenceRate(parsePayoutRate(setting.topGreen)),
  topRed: formatOccurrenceRate(parsePayoutRate(setting.topRed)),
  topRainbow: formatOccurrenceRate(parsePayoutRate(setting.topRainbow)),
  topTotal: formatOccurrenceRate(parsePayoutRate(setting.topTotal)),
  sideBlue: formatOccurrenceRate(parsePayoutRate(setting.sideBlue)),
  sideYellow: formatOccurrenceRate(parsePayoutRate(setting.sideYellow)),
  sideGreen: formatOccurrenceRate(parsePayoutRate(setting.sideGreen)),
  sideRed: formatOccurrenceRate(parsePayoutRate(setting.sideRed)),
  sideRainbow: formatOccurrenceRate(parsePayoutRate(setting.sideRainbow)),
  soundRetro: formatOccurrenceRate(parsePayoutRate(setting.soundRetro)),
  bigSuika: formatRateFromProbability(parseRate(setting.bigSuika)),
  bigHazure: formatRateFromProbability(parseRate(setting.bigHazure)),
  payout: setting.payout
}));

function toNumber(value: string) {
  if (!value) {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatDenominator(value: number) {
  const rounded = Math.round(value * 100) / 100;

  if (Number.isInteger(rounded)) {
    return rounded.toFixed(1);
  }

  return rounded.toFixed(2);
}

function formatProbability(count: number, base: number) {
  if (count <= 0 || base <= 0) {
    return "-";
  }

  return `1/${formatDenominator(base / count)}`;
}

function formatRateFromProbability(probability: number) {
  if (probability <= 0) {
    return "-";
  }

  return `1/${formatDenominator(1 / probability)}`;
}

function formatOccurrenceRate(probability: number) {
  if (probability <= 0) {
    return "-";
  }

  return `${(probability * 100).toFixed(2)}%`;
}

function formatOccurrencePercent(count: number, base: number) {
  if (count < 0 || base <= 0 || count > base) {
    return "-";
  }

  return `${((count / base) * 100).toFixed(2)}%`;
}

function formatYen(value: number) {
  const rounded = Math.round(value);
  const sign = rounded > 0 ? "+" : rounded < 0 ? "-" : "";

  return `${sign}${Math.abs(rounded).toLocaleString("ja-JP")}円`;
}

function formatHourlyYen(value: number) {
  const rounded = Math.round(value * 10) / 10;
  const sign = rounded > 0 ? "+" : rounded < 0 ? "-" : "";

  return `${sign}${Math.abs(rounded).toLocaleString("ja-JP", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  })}円 / h`;
}

function formatTruncatedYen(value: number) {
  const truncated = Math.trunc(value * 100) / 100;
  return `${truncated.toFixed(2)}円`;
}

function formatLossYen(value: number) {
  const truncated = Math.trunc(value);
  const sign = truncated > 0 ? "-" : truncated < 0 ? "+" : "";

  return `${sign}${Math.abs(truncated).toLocaleString("ja-JP")}円`;
}

function formatPayout(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function calculateLogBinomialProbability(
  successCount: number,
  totalCount: number,
  probability: number
) {
  if (
    totalCount < 0 ||
    successCount < 0 ||
    successCount > totalCount ||
    probability < 0 ||
    probability > 1
  ) {
    return Number.NEGATIVE_INFINITY;
  }

  if (totalCount === 0) {
    return successCount === 0 ? 0 : Number.NEGATIVE_INFINITY;
  }

  if (probability === 0) {
    return successCount === 0 ? 0 : Number.NEGATIVE_INFINITY;
  }

  if (probability === 1) {
    return successCount === totalCount ? 0 : Number.NEGATIVE_INFINITY;
  }

  const smallerSide = Math.min(successCount, totalCount - successCount);
  let logCombination = 0;

  for (let count = 1; count <= smallerSide; count += 1) {
    logCombination += Math.log(totalCount - smallerSide + count) - Math.log(count);
  }

  const logProbability =
    logCombination +
    successCount * Math.log(probability) +
    (totalCount - successCount) * Math.log(1 - probability);

  return logProbability;
}

function calculateBinomialProbability(successCount: number, totalCount: number, probability: number) {
  const logProbability = calculateLogBinomialProbability(
    successCount,
    totalCount,
    probability
  );

  if (!Number.isFinite(logProbability)) {
    return 0;
  }

  return Math.exp(logProbability);
}

function formatPercent(probability: number) {
  const percent = probability * 100;

  if (percent >= 1) {
    return `${percent.toFixed(2)}%`;
  }

  if (percent >= 0.01) {
    return `${percent.toFixed(3)}%`;
  }

  if (percent > 0) {
    return `${percent.toFixed(5)}%`;
  }

  return "0%";
}

export default function HanaHanaHououPage() {
  const [inputValues, setInputValues] = useState<Record<string, string>>(initialValues);
  const [settingExpectationTable, setSettingExpectationTable] = useState<
    | {
        headerText: string;
        payoutHeaderText: string;
        hourlyText: string;
        rows: Array<{
          label: string;
          payoutText: string;
          expectationText: string;
          probabilityText: string;
          weightedText: string;
        }>;
        totalText: string;
      }
    | null
  >(null);
  const [overallSettingRows, setOverallSettingRows] = useState<
    Array<{ label: string; value: string }> | null
  >(null);
  const [probabilityGroups, setProbabilityGroups] = useState<
    Array<{
      title: string;
      headerText: string;
      columns: Array<{
        label: string;
        summaryText: string;
        values: Array<{ label: string; value: string }>;
      }>;
    }> | null
  >(null);
  const [hasLoadedSavedValues, setHasLoadedSavedValues] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);

      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        const nextValues: Record<string, string> = { ...initialValues };

        Object.entries(parsed).forEach(([key, value]) => {
          if (typeof value === "string" && key in nextValues) {
            nextValues[key] = value;
          }
        });

        setInputValues(nextValues);
      }
    } catch {
      // 端末内保存の読込に失敗した場合は初期値を使う
    }

    setHasLoadedSavedValues(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedSavedValues) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(inputValues));
  }, [hasLoadedSavedValues, inputValues]);

  const medalRentValue = toNumber(inputValues.medalRent);
  const exchangeRateValue = toNumber(inputValues.exchangeRate);
  const cashInvestmentValue = Math.max(0, toNumber(inputValues.cashInvestment));
  const currentBigValue = toNumber(inputValues.currentBig);
  const beforeBigValue = toNumber(inputValues.beforeBig);
  const practiceBigCount = Math.max(0, currentBigValue - beforeBigValue);
  const bigRoleBaseGames = practiceBigCount * 24;
  const liveYenPerMedal = medalRentValue > 0 ? 1000 / medalRentValue : 0;
  const liveExchangeYen = exchangeRateValue > 0 ? 100 / exchangeRateValue : 0;
  const liveCashGapLoss =
    medalRentValue > 0 && exchangeRateValue > 0
      ? cashInvestmentValue * (1 - (medalRentValue * liveExchangeYen) / 1000)
      : 0;
  const liveFieldTexts: Record<string, string> = {
    medalRent: medalRentValue > 0 ? formatTruncatedYen(liveYenPerMedal) : "",
    exchangeRate: exchangeRateValue > 0 ? formatTruncatedYen(liveExchangeYen) : "",
    cashInvestment:
      cashInvestmentValue > 0 && liveCashGapLoss > 0 ? formatLossYen(liveCashGapLoss) : ""
  };
  const bigRoleNote = `${practiceBigCount}回×24G = ${bigRoleBaseGames}G`;

  const handleClear = () => {
    setInputValues({ ...initialValues });
    setSettingExpectationTable(null);
    setOverallSettingRows(null);
    setProbabilityGroups(null);
  };

  const handleEstimate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const beforeGames = toNumber(inputValues.beforeGames);
    const beforeBig = toNumber(inputValues.beforeBig);
    const beforeReg = toNumber(inputValues.beforeReg);
    const currentGames = toNumber(inputValues.currentGames);
    const currentBig = toNumber(inputValues.currentBig);
    const currentReg = toNumber(inputValues.currentReg);
    const bell = toNumber(inputValues.bell);
    const topBlue = toNumber(inputValues.topBlue);
    const topYellow = toNumber(inputValues.topYellow);
    const topGreen = toNumber(inputValues.topGreen);
    const topRed = toNumber(inputValues.topRed);
    const topRainbow = toNumber(inputValues.topRainbow);
    const sideBlue = toNumber(inputValues.sideBlue);
    const sideYellow = toNumber(inputValues.sideYellow);
    const sideGreen = toNumber(inputValues.sideGreen);
    const sideRed = toNumber(inputValues.sideRed);
    const sideRainbow = toNumber(inputValues.sideRainbow);
    const soundRetroTrials = toNumber(inputValues.soundRetroTrials);
    const soundRetroHits = toNumber(inputValues.soundRetroHits);
    const bigSuika = toNumber(inputValues.bigSuika);
    const bigHazure = toNumber(inputValues.bigHazure);
    const medalRent = toNumber(inputValues.medalRent);
    const exchangeRate = toNumber(inputValues.exchangeRate);
    const cashInvestment = Math.max(0, toNumber(inputValues.cashInvestment));
    const yenPerMedal = exchangeRate > 0 ? 100 / exchangeRate : 0;
    const cashGapLoss =
      medalRent > 0 && exchangeRate > 0
        ? cashInvestment * (1 - (medalRent * yenPerMedal) / 1000)
        : 0;

    const practiceGames = currentGames - beforeGames;
    const practiceBig = currentBig - beforeBig;
    const practiceReg = currentReg - beforeReg;
    const totalBonus = currentBig + currentReg;
    const topTotal = topBlue + topYellow + topGreen + topRed + topRainbow;
    const settingExpectationValues = settings.map((setting) => {
      const payoutRate = parsePayoutRate(setting.payout);

      return {
        label: setting.setting,
        payoutRate,
        expectedYen: practiceGames * 3 * yenPerMedal * (payoutRate - 1) - cashGapLoss
      };
    });

    const probabilityDefinitions: ProbabilityDefinition[] = [
      {
        key: "bb",
        count: currentBig,
        base: currentGames
      },
      {
        key: "rb",
        count: currentReg,
        base: currentGames
      },
      {
        key: "sum",
        count: totalBonus,
        base: currentGames
      },
      {
        key: "bell",
        count: bell,
        base: practiceGames
      },
      {
        key: "topBlue",
        count: topBlue,
        base: practiceBig,
        summaryStyle: "percent"
      },
      {
        key: "topYellow",
        count: topYellow,
        base: practiceBig,
        summaryStyle: "percent"
      },
      {
        key: "topGreen",
        count: topGreen,
        base: practiceBig,
        summaryStyle: "percent"
      },
      {
        key: "topRed",
        count: topRed,
        base: practiceBig,
        summaryStyle: "percent"
      },
      {
        key: "topRainbow",
        count: topRainbow,
        base: practiceBig,
        summaryStyle: "percent"
      },
      {
        key: "topTotal",
        count: topTotal,
        base: practiceBig,
        summaryStyle: "percent"
      },
      {
        key: "sideBlue",
        count: sideBlue,
        base: practiceReg,
        summaryStyle: "percent"
      },
      {
        key: "sideYellow",
        count: sideYellow,
        base: practiceReg,
        summaryStyle: "percent"
      },
      {
        key: "sideGreen",
        count: sideGreen,
        base: practiceReg,
        summaryStyle: "percent"
      },
      {
        key: "sideRed",
        count: sideRed,
        base: practiceReg,
        summaryStyle: "percent"
      },
      {
        key: "sideRainbow",
        count: sideRainbow,
        base: practiceReg,
        summaryStyle: "percent"
      },
      {
        key: "soundRetro",
        count: soundRetroHits,
        base: soundRetroTrials,
        summaryStyle: "percent"
      },
      {
        key: "bigSuika",
        count: bigSuika,
        base: practiceBig * 24
      },
      {
        key: "bigHazure",
        count: bigHazure,
        base: practiceBig * 24
      }
    ];

    const probabilityDefinitionMap = Object.fromEntries(
      probabilityDefinitions.map((definition) => [definition.key, definition])
    ) as Record<RateKey, (typeof probabilityDefinitions)[number]>;

    const validProbabilityDefinitions = probabilityDefinitions.filter(
      (definition) =>
        definition.key !== "sum" &&
        definition.key !== "topTotal" &&
        definition.base > 0 &&
        definition.count >= 0 &&
        definition.count <= definition.base
    );

    setProbabilityGroups(
      probabilityDisplayGroups.map((group) => ({
        title: group.title,
        headerText: `${probabilityDefinitionMap[group.items[0].key].base}${group.headerSuffix}`,
        columns: group.items.map((item) => {
          const definition = probabilityDefinitionMap[item.key];

          const weights = settingRates.map((setting) => ({
            label: setting.label,
            weight: calculateBinomialProbability(
              definition.count,
              definition.base,
              setting[item.key]
            )
          }));
          const totalWeight = weights.reduce((sum, row) => sum + row.weight, 0);

          return {
            label: item.title,
            summaryText:
              definition.summaryStyle === "percent"
                ? `${definition.base}回中${definition.count}回 (${formatOccurrencePercent(
                    definition.count,
                    definition.base
                  )})`
                : `${definition.count} (${formatProbability(definition.count, definition.base)})`,
            values: weights.map((row) => ({
              label: row.label,
              value: totalWeight > 0 ? formatPercent(row.weight / totalWeight) : "0%"
            }))
          };
        })
      }))
    );

    if (validProbabilityDefinitions.length === 0) {
      setOverallSettingRows(null);
      setSettingExpectationTable({
        headerText: `${practiceGames}G`,
        payoutHeaderText: "公表値",
        hourlyText: "-",
        rows: settingExpectationValues.map((row) => ({
          label: row.label,
          payoutText: formatPayout(row.payoutRate),
          expectationText: formatYen(row.expectedYen),
          probabilityText: "-",
          weightedText: "-"
        })),
        totalText: "-"
      });
      return;
    }

    const totalLogRows = settingRates.map((setting) => ({
      label: setting.label,
      logValue: validProbabilityDefinitions.reduce(
        (sum, definition) =>
          sum +
          calculateLogBinomialProbability(
            definition.count,
            definition.base,
            setting[definition.key]
          ),
        0
      )
    }));

    const maxLogValue = Math.max(...totalLogRows.map((row) => row.logValue));
    const scaledRows = totalLogRows.map((row) => ({
      label: row.label,
      weight: Math.exp(row.logValue - maxLogValue)
    }));
    const totalWeight = scaledRows.reduce((sum, row) => sum + row.weight, 0);

    setOverallSettingRows(
      scaledRows.map((row) => ({
        label: row.label,
        value: totalWeight > 0 ? formatPercent(row.weight / totalWeight) : "0%"
      }))
    );

    const expectationRows = settingExpectationValues.map((row, index) => {
      const probability = totalWeight > 0 ? scaledRows[index].weight / totalWeight : 0;
      const weightedYen = row.expectedYen * probability;

      return {
        label: row.label,
        payoutText: formatPayout(row.payoutRate),
        expectationText: formatYen(row.expectedYen),
        probabilityText: totalWeight > 0 ? formatPercent(probability) : "0%",
        weightedText: formatYen(weightedYen)
      };
    });

    const totalExpectedYen = expectationRows.reduce((sum, row, index) => {
      const probability = totalWeight > 0 ? scaledRows[index].weight / totalWeight : 0;
      return sum + settingExpectationValues[index].expectedYen * probability;
    }, 0);
    const hourlyExpectedYen =
      practiceGames > 0 ? (totalExpectedYen * 700) / practiceGames : null;

    setSettingExpectationTable({
      headerText: `${practiceGames}G`,
      payoutHeaderText: "公表値",
      hourlyText: hourlyExpectedYen !== null ? formatHourlyYen(hourlyExpectedYen) : "-",
      rows: expectationRows,
      totalText: formatYen(totalExpectedYen)
    });
  };

  return (
    <main className="page-shell">
      <div className="card card-wide">
        <h1 className="title">ハナハナホウオウ ～天翔～</h1>
        <form className="input-form" onSubmit={handleEstimate}>
          {inputGroups.map((group, index) => (
            <section className="input-group" key={`${group.title}-${index}`}>
              <div className="group-title-row">
                <p className="group-title">【{group.title}】</p>
                {"fields" in group && group.title === "BIG中小役" ? (
                  <p className="group-note">{bigRoleNote}</p>
                ) : "note" in group && group.note ? (
                  <p className="group-note">{group.note}</p>
                ) : null}
              </div>
              {"fields" in group ? (
                <div
                  className={`input-row input-row-${Math.min(group.fields.length, 3)}${
                    group.rowClass ? ` ${group.rowClass}` : ""
                  }`}
                >
                  {group.fields.map((field) => (
                    <div className="input-field-wrap" key={field.key}>
                      <label className="input-field">
                        <span className="input-label">{field.label}</span>
                        <span className="input-control">
                          <input
                            className={`number-input${field.widthClass ? ` ${field.widthClass}` : ""}`}
                            type="number"
                            inputMode="numeric"
                            value={inputValues[field.key]}
                            onChange={(event) =>
                              setInputValues((current) => ({
                                ...current,
                                [field.key]: event.target.value
                              }))
                            }
                          />
                          {field.unit ? <span className="input-unit">{field.unit}</span> : null}
                          {liveFieldTexts[field.key] ? (
                            <span className="input-live-text">{liveFieldTexts[field.key]}</span>
                          ) : null}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="piece-input-group">
                  {group.rows.map((row) => (
                    <div
                      className={`piece-input-row${group.rowClass ? ` ${group.rowClass}` : ""}`}
                      key={row.label}
                    >
                      <p className="piece-input-label">{row.label}</p>
                      <label className="input-field">
                        <span className="input-label">試行</span>
                        <span className="input-control">
                          <input
                            className={`number-input number-input-piece${
                              group.inputWidthClass ? ` ${group.inputWidthClass}` : ""
                            }`}
                            type="number"
                            inputMode="numeric"
                            value={inputValues[row.trialKey]}
                            onChange={(event) =>
                              setInputValues((current) => ({
                                ...current,
                                [row.trialKey]: event.target.value
                              }))
                            }
                          />
                          <span className="input-unit">回</span>
                        </span>
                      </label>
                      <label className="input-field">
                        <span className="input-label">発生</span>
                        <span className="input-control">
                          <input
                            className={`number-input number-input-piece${
                              group.inputWidthClass ? ` ${group.inputWidthClass}` : ""
                            }`}
                            type="number"
                            inputMode="numeric"
                            value={inputValues[row.occurrenceKey]}
                            onChange={(event) =>
                              setInputValues((current) => ({
                                ...current,
                                [row.occurrenceKey]: event.target.value
                              }))
                            }
                          />
                          <span className="input-unit">回</span>
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
          <div className="action-row">
            <button className="clear-button" type="button" onClick={handleClear}>
              クリア
            </button>
            <button className="estimate-button" type="submit">
              推測
            </button>
          </div>
        </form>
        <section className="result-group">
          <h2 className="result-title">推測結果</h2>
          {settingExpectationTable ? (
            <>
              {overallSettingRows ? (
                <div className="result-list">
                  {overallSettingRows.map((row) => (
                    <div className="result-item" key={`overall-${row.label}`}>
                      <p className="result-label">{row.label}</p>
                      <p className="result-value">{row.value}</p>
                    </div>
                  ))}
                </div>
              ) : null}
              <div className="result-subgroup">
                <div className="table-wrap table-wrap-tight">
                  <table className="data-table data-table-compact">
                    <thead>
                      <tr>
                        <th>
                          <div className="table-head-main">実践期待値</div>
                          <div className="table-head-sub">{settingExpectationTable.headerText}</div>
                        </th>
                        <th>
                          <div className="table-head-main">機械割</div>
                          <div className="table-head-sub">{settingExpectationTable.payoutHeaderText}</div>
                        </th>
                        <th>設定別期待値</th>
                        <th>推測割合</th>
                        <th>推測期待値</th>
                      </tr>
                    </thead>
                    <tbody>
                      {settingExpectationTable.rows.map((row) => (
                        <tr key={`expectation-${row.label}`}>
                          <th scope="row">{row.label}</th>
                          <td>{row.payoutText}</td>
                          <td>{row.expectationText}</td>
                          <td>{row.probabilityText}</td>
                          <td>{row.weightedText}</td>
                        </tr>
                      ))}
                      <tr>
                        <th scope="row">合計</th>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>{settingExpectationTable.totalText}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="result-list">
                  <div className="result-item result-item-inline">
                    <p className="result-label">期待時給</p>
                    <p className="result-value">{settingExpectationTable.hourlyText}</p>
                  </div>
                </div>
              </div>
              {probabilityGroups ? (
                <div className="result-subgroup">
                  <h3 className="result-section-title">各項目ごとの推測値</h3>
                  {probabilityGroups.map((group) => (
                    <section className="result-metric-group" key={group.title}>
                      <div className="table-wrap table-wrap-tight">
                        <table className="data-table data-table-compact">
                          <thead>
                            <tr>
                              <th>
                                <div className="table-head-main">{group.title}</div>
                                <div className="table-head-sub">{group.headerText}</div>
                              </th>
                              {group.columns.map((column) => (
                                <th key={`${group.title}-${column.label}`}>
                                  <div className="table-head-main">{column.label}</div>
                                  <div className="table-head-sub">{column.summaryText}</div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {settings.map((setting, index) => (
                              <tr key={`${group.title}-${setting.setting}`}>
                                <th scope="row">{setting.setting}</th>
                                {group.columns.map((column) => (
                                  <td key={`${setting.setting}-${column.label}`}>
                                    {column.values[index].value}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <p className="result-placeholder">推測ボタンを押すとここに結果が出ます。</p>
          )}
        </section>
        <section className="spec-group-wrap">
          {specGroups.map((group) => (
            <section className="spec-group" key={group.title}>
              <h2 className="spec-title">【{group.title}】</h2>
              <div className="table-wrap">
                <table className="data-table data-table-compact">
                  <thead>
                    <tr>
                      <th>設定</th>
                      {group.columns.map((column) => (
                        <th key={`${group.title}-${column.key}`}>{column.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {settingsDisplay.map((row) => (
                      <tr key={`${group.title}-${row.setting}`}>
                        <th scope="row">{row.setting}</th>
                        {group.columns.map((column) => (
                          <td key={`${row.setting}-${column.key}`}>{row[column.key]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </section>
      </div>
    </main>
  );
}
