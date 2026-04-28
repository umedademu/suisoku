"use client";

import { useEffect, useState } from "react";
import { JugglerBudoCounterButton } from "../juggler-budo-counter-button";
import { SaveSlotControls, useSaveSlots } from "../save-slots";

const settings = [
  {
    setting: "設定1",
    bb: "1/299",
    rb: "1/496",
    bell: "1/7.628",
    bigFrontSuika: "1/29.79",
    bigFrontHazure: "1/65536.0",
    btSideBlue: "1/2.778",
    btSideYellow: "1/4.168",
    btSideGreen: "1/4.168",
    btSideRed: "1/6.249",
    btSideRainbow: "1/4681.143",
    bigAfterBlue: "1/27.22",
    bigAfterYellow: "1/34.86",
    bigAfterGreen: "1/52.01",
    bigAfterPurple: "1/78.02",
    bigAfterRainbow: "1/8192.00",
    retroSound: "1/16.155",
    regSuika: "1/102.40",
    payout: "97%"
  },
  {
    setting: "設定2",
    bb: "1/291",
    rb: "1/471",
    bell: "1/7.502",
    bigFrontSuika: "1/27.31",
    bigFrontHazure: "1/32768.0",
    btSideBlue: "1/4.312",
    btSideYellow: "1/2.875",
    btSideGreen: "1/5.956",
    btSideRed: "1/3.970",
    btSideRainbow: "1/2048.000",
    bigAfterBlue: "1/24.63",
    bigAfterYellow: "1/33.22",
    bigAfterGreen: "1/48.33",
    bigAfterPurple: "1/72.98",
    bigAfterRainbow: "1/2520.62",
    retroSound: "1/13.495",
    regSuika: "1/78.96",
    payout: "99%"
  },
  {
    setting: "設定3",
    bb: "1/281",
    rb: "1/442",
    bell: "1/7.474",
    bigFrontSuika: "1/24.27",
    bigFrontHazure: "1/21845.3",
    btSideBlue: "1/2.979",
    btSideYellow: "1/4.468",
    btSideGreen: "1/3.792",
    btSideRed: "1/5.688",
    btSideRainbow: "1/992.970",
    bigAfterBlue: "1/23.26",
    bigAfterYellow: "1/28.35",
    bigAfterGreen: "1/42.92",
    bigAfterPurple: "1/66.67",
    bigAfterRainbow: "1/1638.40",
    retroSound: "1/12.469",
    regSuika: "1/54.80",
    payout: "101%"
  },
  {
    setting: "設定4",
    bb: "1/268",
    rb: "1/409",
    bell: "1/7.379",
    bigFrontSuika: "1/20.81",
    bigFrontHazure: "1/16384.0",
    btSideBlue: "1/4.639",
    btSideYellow: "1/3.092",
    btSideGreen: "1/5.445",
    btSideRed: "1/3.630",
    btSideRainbow: "1/508.031",
    bigAfterBlue: "1/20.48",
    bigAfterYellow: "1/26.01",
    bigAfterGreen: "1/39.67",
    bigAfterPurple: "1/63.69",
    bigAfterRainbow: "1/1424.70",
    retroSound: "1/10.707",
    regSuika: "1/54.80",
    payout: "104%"
  },
  {
    setting: "設定V",
    bb: "1/253",
    rb: "1/372",
    bell: "1/7.266",
    bigFrontSuika: "1/18.89",
    bigFrontHazure: "1/13107.2",
    btSideBlue: "1/3.218",
    btSideYellow: "1/4.827",
    btSideGreen: "1/3.485",
    btSideRed: "1/5.229",
    btSideRainbow: "1/256.000",
    bigAfterBlue: "1/18.67",
    bigAfterYellow: "1/24.36",
    bigAfterGreen: "1/37.45",
    bigAfterPurple: "1/57.49",
    bigAfterRainbow: "1/504.12",
    retroSound: "1/9.506",
    regSuika: "1/54.80",
    payout: "108%"
  }
];

type InputField = {
  key: string;
  label: string;
  unit?: string;
  widthClass?: string;
};

type StandardInputGroup = {
  kind: "fields";
  title: string;
  note?: string;
  rowClass?: string;
  fields: InputField[];
};

type TrialInputGroup = {
  kind: "trial";
  title: string;
  note?: string;
  trialField: InputField;
  fields: InputField[];
  fieldsRowClass?: string;
};

type InputGroup = StandardInputGroup | TrialInputGroup;

const inputGroups: InputGroup[] = [
  {
    kind: "fields",
    title: "開始前",
    fields: [
      { key: "beforeGames", label: "G数" },
      { key: "beforeBig", label: "BIG" },
      { key: "beforeReg", label: "REG" }
    ]
  },
  {
    kind: "fields",
    title: "現在",
    fields: [
      { key: "currentGames", label: "G数" },
      { key: "currentBig", label: "BIG" },
      { key: "currentReg", label: "REG" }
    ]
  },
  {
    kind: "fields",
    title: "通常時小役",
    fields: [{ key: "bell", label: "ベル", widthClass: "number-input-bell-wide" }]
  },
  {
    kind: "trial",
    title: "BIG前半パート",
    note: "消化G数を分母に使います",
    trialField: {
      key: "bigFrontGames",
      label: "消化G数",
      unit: "G",
      widthClass: "number-input-big-role"
    },
    fields: [
      { key: "bigFrontSuika", label: "スイカ", widthClass: "number-input-big-role" },
      { key: "bigFrontHazure", label: "ハズレ", widthClass: "number-input-big-role" }
    ]
  },
  {
    kind: "trial",
    title: "BT中ビタ押し時サイドランプ",
    note: "試行回数を分母に使います",
    trialField: {
      key: "btSideTrials",
      label: "試行回数",
      unit: "回",
      widthClass: "number-input-piece-tight"
    },
    fields: [
      { key: "btSideBlue", label: "青", widthClass: "number-input-lamp" },
      { key: "btSideYellow", label: "黄", widthClass: "number-input-lamp" },
      { key: "btSideGreen", label: "緑", widthClass: "number-input-lamp" },
      { key: "btSideRed", label: "赤", widthClass: "number-input-lamp" },
      { key: "btSideRainbow", label: "虹", widthClass: "number-input-lamp" }
    ],
    fieldsRowClass: "input-row-lamp"
  },
  {
    kind: "trial",
    title: "BIG後ハイビスカスランプ",
    note: "試行回数を分母に使います",
    trialField: {
      key: "bigAfterTrials",
      label: "試行回数",
      unit: "回",
      widthClass: "number-input-piece-tight"
    },
    fields: [
      { key: "bigAfterBlue", label: "青", widthClass: "number-input-lamp" },
      { key: "bigAfterYellow", label: "黄", widthClass: "number-input-lamp" },
      { key: "bigAfterGreen", label: "緑", widthClass: "number-input-lamp" },
      { key: "bigAfterPurple", label: "紫", widthClass: "number-input-lamp" },
      { key: "bigAfterRainbow", label: "虹", widthClass: "number-input-lamp" }
    ],
    fieldsRowClass: "input-row-lamp"
  },
  {
    kind: "trial",
    title: "REG後ハイビスカスランプ",
    note: "試行回数を分母に使います",
    trialField: {
      key: "regAfterTrials",
      label: "試行回数",
      unit: "回",
      widthClass: "number-input-piece-tight"
    },
    fields: [
      { key: "regAfterWhite", label: "白", widthClass: "number-input-lamp" },
      { key: "regAfterBlue", label: "青", widthClass: "number-input-lamp" },
      { key: "regAfterYellow", label: "黄", widthClass: "number-input-lamp" },
      { key: "regAfterGreen", label: "緑", widthClass: "number-input-lamp" },
      { key: "regAfterPurple", label: "紫", widthClass: "number-input-lamp" }
    ],
    fieldsRowClass: "input-row-lamp"
  },
  {
    kind: "trial",
    title: "レトロサウンド発生率",
    note: "試行回数を分母に使います",
    trialField: {
      key: "retroSoundTrials",
      label: "試行回数",
      unit: "回",
      widthClass: "number-input-piece-tight"
    },
    fields: [{ key: "retroSoundHits", label: "発生", widthClass: "number-input-piece-tight" }]
  },
  {
    kind: "trial",
    title: "REG中小役",
    note: "REG中の消化G数を分母に使います",
    trialField: {
      key: "regGames",
      label: "消化G数",
      unit: "G",
      widthClass: "number-input-big-role"
    },
    fields: [{ key: "regSuika", label: "スイカ", widthClass: "number-input-big-role" }]
  },
  {
    kind: "fields",
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
      group.kind === "fields"
        ? group.fields.map((field) => [field.key, ""] as const)
        : [
            [group.trialField.key, ""] as const,
            ...group.fields.map((field) => [field.key, ""] as const)
          ]
    )
  ),
  medalRent: "46",
  exchangeRate: "5.0"
};

const STORAGE_KEY = "suisoku-newkinghanahanav-inputs";

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
    title: "BIG前半パート",
    columns: [
      { label: "スイカ", key: "bigFrontSuika" },
      { label: "ハズレ", key: "bigFrontHazure" }
    ]
  },
  {
    title: "BT中ビタ押し時サイドランプ",
    columns: [
      { label: "青", key: "btSideBlue" },
      { label: "黄", key: "btSideYellow" },
      { label: "緑", key: "btSideGreen" },
      { label: "赤", key: "btSideRed" },
      { label: "虹", key: "btSideRainbow" }
    ]
  },
  {
    title: "BIG後ハイビスカスランプ",
    columns: [
      { label: "青", key: "bigAfterBlue" },
      { label: "黄", key: "bigAfterYellow" },
      { label: "緑", key: "bigAfterGreen" },
      { label: "紫", key: "bigAfterPurple" },
      { label: "虹", key: "bigAfterRainbow" }
    ]
  },
  {
    title: "レトロサウンド発生率",
    columns: [{ label: "発生", key: "retroSound" }]
  },
  {
    title: "REG中小役",
    columns: [{ label: "スイカ", key: "regSuika" }]
  }
] as const;

const regAfterHintRows = [
  { color: "白", hint: "デフォルト" },
  { color: "青", hint: "設定2以上確定" },
  { color: "黄", hint: "設定3以上確定" },
  { color: "緑", hint: "設定4以上確定" },
  { color: "紫", hint: "設定V以上確定" }
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
    title: "BIG前半パート",
    headerSuffix: "G",
    items: [
      { title: "スイカ", key: "bigFrontSuika" as const },
      { title: "ハズレ", key: "bigFrontHazure" as const }
    ]
  },
  {
    title: "BT中ビタ押し時サイドランプ",
    headerSuffix: "回",
    items: [
      { title: "青", key: "btSideBlue" as const },
      { title: "黄", key: "btSideYellow" as const },
      { title: "緑", key: "btSideGreen" as const },
      { title: "赤", key: "btSideRed" as const },
      { title: "虹", key: "btSideRainbow" as const }
    ]
  },
  {
    title: "BIG後ハイビスカスランプ",
    headerSuffix: "回",
    items: [
      { title: "青", key: "bigAfterBlue" as const },
      { title: "黄", key: "bigAfterYellow" as const },
      { title: "緑", key: "bigAfterGreen" as const },
      { title: "紫", key: "bigAfterPurple" as const },
      { title: "虹", key: "bigAfterRainbow" as const }
    ]
  },
  {
    title: "レトロサウンド",
    headerSuffix: "回",
    items: [{ title: "発生", key: "retroSound" as const }]
  },
  {
    title: "REG中小役",
    headerSuffix: "G",
    items: [{ title: "スイカ", key: "regSuika" as const }]
  }
] as const;

type RateKey =
  | "bb"
  | "rb"
  | "sum"
  | "bell"
  | "bigFrontSuika"
  | "bigFrontHazure"
  | "btSideBlue"
  | "btSideYellow"
  | "btSideGreen"
  | "btSideRed"
  | "btSideRainbow"
  | "bigAfterBlue"
  | "bigAfterYellow"
  | "bigAfterGreen"
  | "bigAfterPurple"
  | "bigAfterRainbow"
  | "retroSound"
  | "regSuika";

type ProbabilityDefinition = {
  key: RateKey;
  count: number;
  base: number;
  summaryStyle?: "frequency" | "percent";
};

type RegAfterHintSummary = {
  trialText: string;
  countText: string;
  strongestText: string;
  minimumSettingRank: number;
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

const settingRates = settings.map((setting, index) => ({
  label: setting.setting,
  rank: index + 1,
  bb: parseRate(setting.bb),
  rb: parseRate(setting.rb),
  sum: parseRate(setting.bb) + parseRate(setting.rb),
  bell: parseRate(setting.bell),
  bigFrontSuika: parseRate(setting.bigFrontSuika),
  bigFrontHazure: parseRate(setting.bigFrontHazure),
  btSideBlue: parseRate(setting.btSideBlue),
  btSideYellow: parseRate(setting.btSideYellow),
  btSideGreen: parseRate(setting.btSideGreen),
  btSideRed: parseRate(setting.btSideRed),
  btSideRainbow: parseRate(setting.btSideRainbow),
  bigAfterBlue: parseRate(setting.bigAfterBlue),
  bigAfterYellow: parseRate(setting.bigAfterYellow),
  bigAfterGreen: parseRate(setting.bigAfterGreen),
  bigAfterPurple: parseRate(setting.bigAfterPurple),
  bigAfterRainbow: parseRate(setting.bigAfterRainbow),
  retroSound: parseRate(setting.retroSound),
  regSuika: parseRate(setting.regSuika)
}));

const settingsDisplay = settings.map((setting) => ({
  setting: setting.setting,
  bb: formatRateFromProbability(parseRate(setting.bb)),
  rb: formatRateFromProbability(parseRate(setting.rb)),
  bonusTotal: formatRateFromProbability(parseRate(setting.bb) + parseRate(setting.rb)),
  bell: formatRateFromProbability(parseRate(setting.bell)),
  bigFrontSuika: formatRateFromProbability(parseRate(setting.bigFrontSuika)),
  bigFrontHazure: formatRateFromProbability(parseRate(setting.bigFrontHazure)),
  btSideBlue: formatOccurrenceRate(parseRate(setting.btSideBlue)),
  btSideYellow: formatOccurrenceRate(parseRate(setting.btSideYellow)),
  btSideGreen: formatOccurrenceRate(parseRate(setting.btSideGreen)),
  btSideRed: formatOccurrenceRate(parseRate(setting.btSideRed)),
  btSideRainbow: formatOccurrenceRate(parseRate(setting.btSideRainbow)),
  bigAfterBlue: formatOccurrenceRate(parseRate(setting.bigAfterBlue)),
  bigAfterYellow: formatOccurrenceRate(parseRate(setting.bigAfterYellow)),
  bigAfterGreen: formatOccurrenceRate(parseRate(setting.bigAfterGreen)),
  bigAfterPurple: formatOccurrenceRate(parseRate(setting.bigAfterPurple)),
  bigAfterRainbow: formatOccurrenceRate(parseRate(setting.bigAfterRainbow)),
  retroSound: formatOccurrenceRate(parseRate(setting.retroSound)),
  regSuika: formatRateFromProbability(parseRate(setting.regSuika)),
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

function getRegAfterHintSummary(
  regAfterTrials: number,
  regAfterWhite: number,
  regAfterBlue: number,
  regAfterYellow: number,
  regAfterGreen: number,
  regAfterPurple: number
): RegAfterHintSummary {
  const totalCount =
    regAfterWhite + regAfterBlue + regAfterYellow + regAfterGreen + regAfterPurple;

  let strongestText = "未入力";
  let minimumSettingRank = 1;

  if (regAfterPurple > 0) {
    strongestText = "紫あり: 設定V以上確定";
    minimumSettingRank = 5;
  } else if (regAfterGreen > 0) {
    strongestText = "緑あり: 設定4以上確定";
    minimumSettingRank = 4;
  } else if (regAfterYellow > 0) {
    strongestText = "黄あり: 設定3以上確定";
    minimumSettingRank = 3;
  } else if (regAfterBlue > 0) {
    strongestText = "青あり: 設定2以上確定";
    minimumSettingRank = 2;
  } else if (regAfterWhite > 0) {
    strongestText = "白のみ: デフォルト";
  } else if (regAfterTrials > 0 || totalCount > 0) {
    strongestText = "確定示唆なし";
  }

  return {
    trialText: `${regAfterTrials}回`,
    countText: `白${regAfterWhite} / 青${regAfterBlue} / 黄${regAfterYellow} / 緑${regAfterGreen} / 紫${regAfterPurple}`,
    strongestText,
    minimumSettingRank
  };
}

export default function NewKingHanaHanaVPage() {
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
        totalPayoutText: string;
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
  const [regAfterHintSummary, setRegAfterHintSummary] = useState<RegAfterHintSummary | null>(null);
  const [hasLoadedSavedValues, setHasLoadedSavedValues] = useState(false);

  const resetResults = () => {
    setSettingExpectationTable(null);
    setOverallSettingRows(null);
    setProbabilityGroups(null);
    setRegAfterHintSummary(null);
  };

  const saveSlots = useSaveSlots({
    storageKey: STORAGE_KEY,
    inputValues,
    initialValues,
    isReady: hasLoadedSavedValues,
    onLoad: (nextValues) => {
      setInputValues(nextValues);
      resetResults();
    }
  });

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

  const handleClear = () => {
    saveSlots.onClearCurrentData();
  };

  const handleBellIncrement = () => {
    setInputValues((current) => ({
      ...current,
      bell: String(toNumber(String(current.bell ?? "")) + 1)
    }));
  };

  const handleBellDecrement = () => {
    setInputValues((current) => ({
      ...current,
      bell: String(Math.max(0, toNumber(String(current.bell ?? "")) - 1))
    }));
  };

  const handleEstimate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const bellRaw = inputValues.bell;
    const hasBellInput = bellRaw.trim() !== "";
    const beforeGames = toNumber(inputValues.beforeGames);
    const beforeBig = toNumber(inputValues.beforeBig);
    const beforeReg = toNumber(inputValues.beforeReg);
    const currentGames = toNumber(inputValues.currentGames);
    const currentBig = toNumber(inputValues.currentBig);
    const currentReg = toNumber(inputValues.currentReg);
    const bell = toNumber(bellRaw);
    const bigFrontGames = toNumber(inputValues.bigFrontGames);
    const bigFrontSuika = toNumber(inputValues.bigFrontSuika);
    const bigFrontHazure = toNumber(inputValues.bigFrontHazure);
    const btSideTrials = toNumber(inputValues.btSideTrials);
    const btSideBlue = toNumber(inputValues.btSideBlue);
    const btSideYellow = toNumber(inputValues.btSideYellow);
    const btSideGreen = toNumber(inputValues.btSideGreen);
    const btSideRed = toNumber(inputValues.btSideRed);
    const btSideRainbow = toNumber(inputValues.btSideRainbow);
    const bigAfterTrials = toNumber(inputValues.bigAfterTrials);
    const bigAfterBlue = toNumber(inputValues.bigAfterBlue);
    const bigAfterYellow = toNumber(inputValues.bigAfterYellow);
    const bigAfterGreen = toNumber(inputValues.bigAfterGreen);
    const bigAfterPurple = toNumber(inputValues.bigAfterPurple);
    const bigAfterRainbow = toNumber(inputValues.bigAfterRainbow);
    const regAfterTrials = toNumber(inputValues.regAfterTrials);
    const regAfterWhite = toNumber(inputValues.regAfterWhite);
    const regAfterBlue = toNumber(inputValues.regAfterBlue);
    const regAfterYellow = toNumber(inputValues.regAfterYellow);
    const regAfterGreen = toNumber(inputValues.regAfterGreen);
    const regAfterPurple = toNumber(inputValues.regAfterPurple);
    const retroSoundTrials = toNumber(inputValues.retroSoundTrials);
    const retroSoundHits = toNumber(inputValues.retroSoundHits);
    const regGames = toNumber(inputValues.regGames);
    const regSuika = toNumber(inputValues.regSuika);
    const medalRent = toNumber(inputValues.medalRent);
    const exchangeRate = toNumber(inputValues.exchangeRate);
    const cashInvestment = Math.max(0, toNumber(inputValues.cashInvestment));
    const yenPerMedal = exchangeRate > 0 ? 100 / exchangeRate : 0;
    const cashGapLoss =
      medalRent > 0 && exchangeRate > 0
        ? cashInvestment * (1 - (medalRent * yenPerMedal) / 1000)
        : 0;

    const practiceGames = currentGames - beforeGames;
    const totalBonus = currentBig + currentReg;
    const regAfterHint = getRegAfterHintSummary(
      regAfterTrials,
      regAfterWhite,
      regAfterBlue,
      regAfterYellow,
      regAfterGreen,
      regAfterPurple
    );
    const guaranteeMinimumRank = regAfterHint.minimumSettingRank;

    setRegAfterHintSummary(regAfterHint);

    const settingExpectationValues = settings.map((setting, index) => {
      const payoutRate = parsePayoutRate(setting.payout);

      return {
        label: setting.setting,
        rank: index + 1,
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
        key: "bigFrontSuika",
        count: bigFrontSuika,
        base: bigFrontGames
      },
      {
        key: "bigFrontHazure",
        count: bigFrontHazure,
        base: bigFrontGames
      },
      {
        key: "btSideBlue",
        count: btSideBlue,
        base: btSideTrials,
        summaryStyle: "percent"
      },
      {
        key: "btSideYellow",
        count: btSideYellow,
        base: btSideTrials,
        summaryStyle: "percent"
      },
      {
        key: "btSideGreen",
        count: btSideGreen,
        base: btSideTrials,
        summaryStyle: "percent"
      },
      {
        key: "btSideRed",
        count: btSideRed,
        base: btSideTrials,
        summaryStyle: "percent"
      },
      {
        key: "btSideRainbow",
        count: btSideRainbow,
        base: btSideTrials,
        summaryStyle: "percent"
      },
      {
        key: "bigAfterBlue",
        count: bigAfterBlue,
        base: bigAfterTrials,
        summaryStyle: "percent"
      },
      {
        key: "bigAfterYellow",
        count: bigAfterYellow,
        base: bigAfterTrials,
        summaryStyle: "percent"
      },
      {
        key: "bigAfterGreen",
        count: bigAfterGreen,
        base: bigAfterTrials,
        summaryStyle: "percent"
      },
      {
        key: "bigAfterPurple",
        count: bigAfterPurple,
        base: bigAfterTrials,
        summaryStyle: "percent"
      },
      {
        key: "bigAfterRainbow",
        count: bigAfterRainbow,
        base: bigAfterTrials,
        summaryStyle: "percent"
      },
      {
        key: "retroSound",
        count: retroSoundHits,
        base: retroSoundTrials,
        summaryStyle: "percent"
      },
      {
        key: "regSuika",
        count: regSuika,
        base: regGames
      }
    ];

    const probabilityDefinitionMap = Object.fromEntries(
      probabilityDefinitions.map((definition) => [definition.key, definition])
    ) as Record<RateKey, (typeof probabilityDefinitions)[number]>;

    const validProbabilityDefinitions = probabilityDefinitions.filter(
      (definition) =>
        definition.key !== "sum" &&
        (definition.key !== "bell" || hasBellInput) &&
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

          if (item.key === "bell" && !hasBellInput) {
            return {
              label: item.title,
              summaryText: "未入力",
              values: settings.map((setting) => ({
                label: setting.setting,
                value: "-"
              }))
            };
          }

          const weights = settingRates.map((setting) => ({
            label: setting.label,
            weight:
              setting.rank >= guaranteeMinimumRank
                ? calculateBinomialProbability(
                    definition.count,
                    definition.base,
                    setting[item.key]
                  )
                : 0
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
        totalPayoutText: "-",
        totalText: "-"
      });
      return;
    }

    const totalLogRows = settingRates.map((setting) => ({
      label: setting.label,
      logValue:
        setting.rank >= guaranteeMinimumRank
          ? validProbabilityDefinitions.reduce(
              (sum, definition) =>
                sum +
                calculateLogBinomialProbability(
                  definition.count,
                  definition.base,
                  setting[definition.key]
                ),
              0
            )
          : Number.NEGATIVE_INFINITY
    }));

    const finiteLogRows = totalLogRows.filter((row) => Number.isFinite(row.logValue));
    const maxLogValue =
      finiteLogRows.length > 0
        ? Math.max(...finiteLogRows.map((row) => row.logValue))
        : Number.NEGATIVE_INFINITY;
    const scaledRows = totalLogRows.map((row) => ({
      label: row.label,
      weight:
        Number.isFinite(row.logValue) && Number.isFinite(maxLogValue)
          ? Math.exp(row.logValue - maxLogValue)
          : 0
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
    const totalExpectedPayoutRate =
      totalWeight > 0
        ? settingExpectationValues.reduce((sum, row, index) => {
            const probability = scaledRows[index].weight / totalWeight;
            return sum + row.payoutRate * probability;
          }, 0)
        : null;
    const hourlyExpectedYen =
      practiceGames > 0 ? (totalExpectedYen * 700) / practiceGames : null;

    setSettingExpectationTable({
      headerText: `${practiceGames}G`,
      payoutHeaderText: "公表値",
      hourlyText: hourlyExpectedYen !== null ? formatHourlyYen(hourlyExpectedYen) : "-",
      rows: expectationRows,
      totalPayoutText: totalExpectedPayoutRate !== null ? formatPayout(totalExpectedPayoutRate) : "-",
      totalText: formatYen(totalExpectedYen)
    });
  };

  return (
    <main className="page-shell">
      <div className="card card-wide">
        <h1 className="title">ニューキングハナハナV</h1>
        <form className="input-form" onSubmit={handleEstimate}>
          {inputGroups.map((group, index) => (
            <section className="input-group" key={`${group.title}-${index}`}>
              <div className="group-title-row">
                <p className="group-title">【{group.title}】</p>
                {group.note ? <p className="group-note">{group.note}</p> : null}
              </div>
              {group.kind === "fields" ? (
                <>
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
                  {group.fields.some((field) => field.key === "bell") ? (
                    <div className="budo-counter-wrap">
                      <JugglerBudoCounterButton
                        count={inputValues.bell}
                        onIncrement={handleBellIncrement}
                        onDecrement={handleBellDecrement}
                        mainLabel="ベル"
                      />
                    </div>
                  ) : null}
                </>
              ) : (
                <>
                  <div className="input-row input-row-1">
                    <div className="input-field-wrap">
                      <label className="input-field">
                        <span className="input-label">{group.trialField.label}</span>
                        <span className="input-control">
                          <input
                            className={`number-input${
                              group.trialField.widthClass ? ` ${group.trialField.widthClass}` : ""
                            }`}
                            type="number"
                            inputMode="numeric"
                            value={inputValues[group.trialField.key]}
                            onChange={(event) =>
                              setInputValues((current) => ({
                                ...current,
                                [group.trialField.key]: event.target.value
                              }))
                            }
                          />
                          {group.trialField.unit ? (
                            <span className="input-unit">{group.trialField.unit}</span>
                          ) : null}
                        </span>
                      </label>
                    </div>
                  </div>
                  <div
                    className={`input-row input-row-${Math.min(group.fields.length, 3)}${
                      group.fieldsRowClass ? ` ${group.fieldsRowClass}` : ""
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
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>
          ))}
          <SaveSlotControls {...saveSlots} />
          <div className="action-row">
            <button className="clear-button" type="button" onClick={handleClear}>
              クリア
            </button>
            <button className="clear-button" type="button" onClick={saveSlots.onClearAllData}>
              全てクリア
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
              {regAfterHintSummary ? (
                <div className="result-subgroup">
                  <h3 className="result-section-title">REG後ハイビスカスランプ</h3>
                  <div className="result-list">
                    <div className="result-item">
                      <p className="result-label">試行回数</p>
                      <p className="result-value">{regAfterHintSummary.trialText}</p>
                    </div>
                    <div className="result-item">
                      <p className="result-label">色別回数</p>
                      <p className="result-value">{regAfterHintSummary.countText}</p>
                    </div>
                    <div className="result-item">
                      <p className="result-label">最も強い示唆</p>
                      <p className="result-value">{regAfterHintSummary.strongestText}</p>
                    </div>
                  </div>
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
                        <td>{settingExpectationTable.totalPayoutText}</td>
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
          <section className="spec-group">
            <h2 className="spec-title">【REG後ハイビスカスランプ】</h2>
            <div className="table-wrap">
              <table className="data-table data-table-compact">
                <thead>
                  <tr>
                    <th>色</th>
                    <th>設定示唆</th>
                  </tr>
                </thead>
                <tbody>
                  {regAfterHintRows.map((row) => (
                    <tr key={row.color}>
                      <th scope="row">{row.color}</th>
                      <td>{row.hint}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
