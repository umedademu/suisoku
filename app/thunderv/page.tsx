"use client";

import { useEffect, useState } from "react";
import { SaveSlotControls, useSaveSlots } from "../save-slots";
import { UnimemoImageUpload } from "../unimemo-image-upload";

type InputMode = "unimemo" | "normal";

type InputField = {
  key: string;
  label: string;
  unit?: string;
  compact?: boolean;
  widthClass?: string;
  prefix?: string;
  keyboard?: "numeric" | "decimal";
};

type InputGroup = {
  title: string;
  note?: string;
  fields: InputField[];
};

const settings = [
  {
    setting: "設定1",
    bb: "1/277.7",
    rb: "1/434.0",
    bellA: "1/16.3",
    bellB: "1/52.9",
    cherryB: "1/13.2",
    suikaA: "1/108.3",
    suikaB: "1/322.8",
    bonusBellB: "1/7.0",
    bonusBellC: "1/36.0",
    bonusReach: "1/10922.7",
    payout: "98.5%",
    payoutFull: "100.5%"
  },
  {
    setting: "設定2",
    bb: "1/275.4",
    rb: "1/394.8",
    bellA: "1/15.8",
    bellB: "1/62.1",
    cherryB: "1/12.1",
    suikaA: "1/109.6",
    suikaB: "1/329.3",
    bonusBellB: "1/5.8",
    bonusBellC: "1/36.0",
    bonusReach: "1/10922.7",
    payout: "100.0%",
    payoutFull: "102.0%"
  },
  {
    setting: "設定5",
    bb: "1/270.8",
    rb: "1/344.9",
    bellA: "1/15.3",
    bellB: "1/53.9",
    cherryB: "1/12.5",
    suikaA: "1/99.6",
    suikaB: "1/296.5",
    bonusBellB: "1/7.0",
    bonusBellC: "1/24.3",
    bonusReach: "1/436.9",
    payout: "102.9%",
    payoutFull: "105.0%"
  },
  {
    setting: "設定6",
    bb: "1/264.3",
    rb: "1/313.6",
    bellA: "1/14.8",
    bellB: "1/47.1",
    cherryB: "1/12.2",
    suikaA: "1/101.9",
    suikaB: "1/303.4",
    bonusBellB: "1/5.8",
    bonusBellC: "1/24.3",
    bonusReach: "1/436.9",
    payout: "106.0%",
    payoutFull: "108.1%"
  }
];

const modeOptions: Array<{ value: InputMode; label: string }> = [
  { value: "unimemo", label: "ユニメモ" },
  { value: "normal", label: "通常" }
];

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
    fields: [
      { key: "bellA", label: "ベルA" },
      { key: "bellB", label: "ベルB" },
      { key: "cherryB", label: "チェリーB" },
      { key: "suikaA", label: "スイカA" },
      { key: "suikaB", label: "スイカB" }
    ]
  },
  {
    title: "ボーナス中",
    fields: [
      { key: "bonusGames", label: "消化G数" },
      { key: "bonusBellB", label: "ベルB" },
      { key: "bonusBellC", label: "ベルC" },
      { key: "bonusReach", label: "リーチ目" }
    ]
  },
  {
    title: "攻略率",
    note: "期待値の計算に使用",
    fields: [
      {
        key: "strategyRate",
        label: "攻略率",
        unit: "%",
        compact: true
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

const unimemoInputGroups: Record<string, InputGroup> = {
  ボーナス中: {
    title: "ボーナス中",
    fields: [
      { key: "bonusBellB", label: "ベルB回数", unit: "回" },
      {
        key: "bonusBellBRate",
        label: "確率",
        prefix: "1/",
        widthClass: "number-input-rate",
        keyboard: "decimal"
      },
      { key: "bonusBellC", label: "ベルC回数", unit: "回" },
      { key: "bonusReach", label: "リーチ目回数", unit: "回" }
    ]
  }
};

const initialValues = {
  ...Object.fromEntries(inputGroups.flatMap((group) => group.fields.map((field) => [field.key, ""]))),
  bonusBellBRate: "",
  medalRent: "46",
  exchangeRate: "5.0",
  strategyRate: "75"
};

const STORAGE_KEY = "suisoku-thunderv-inputs";
const MODE_STORAGE_KEY = "suisoku-thunderv-mode";

const specGroups = [
  {
    title: "基本スペック",
    columns: [
      { label: "BIG", key: "bb" },
      { label: "REG", key: "rb" },
      { label: "機械割", key: "payout" },
      { label: "機械割(完全攻略)", key: "payoutFull" }
    ]
  },
  {
    title: "通常時小役",
    columns: [
      { label: "ベルA", key: "bellA" },
      { label: "ベルB", key: "bellB" },
      { label: "ベル合算", key: "bellTotal" },
      { label: "チェリーB", key: "cherryB" },
      { label: "スイカA", key: "suikaA" },
      { label: "スイカB", key: "suikaB" },
      { label: "スイカ合算", key: "suikaTotal" }
    ]
  },
  {
    title: "ボーナス中",
    columns: [
      { label: "ベルB", key: "bonusBellB" },
      { label: "ベルC", key: "bonusBellC" },
      { label: "リーチ目", key: "bonusReach" }
    ]
  }
] as const;

const probabilityDisplayGroups = [
  {
    title: "ボーナス",
    items: [
      { title: "BIG", key: "bb" as const },
      { title: "REG", key: "rb" as const },
      { title: "合算", key: "sum" as const }
    ]
  },
  {
    title: "通常時小役",
    items: [
      { title: "ベルA", key: "bellA" as const },
      { title: "ベルB", key: "bellB" as const },
      { title: "ベル合算", key: "bellTotal" as const },
      { title: "チェリーB", key: "cherryB" as const },
      { title: "スイカA", key: "suikaA" as const },
      { title: "スイカB", key: "suikaB" as const },
      { title: "スイカ合算", key: "suikaTotal" as const }
    ]
  },
  {
    title: "ボーナス中",
    items: [
      { title: "ベルB", key: "bonusBellB" as const },
      { title: "ベルC", key: "bonusBellC" as const },
      { title: "リーチ目", key: "bonusReach" as const }
    ]
  }
] as const;

type RateKey =
  | "bb"
  | "rb"
  | "sum"
  | "bellA"
  | "bellB"
  | "bellTotal"
  | "cherryB"
  | "suikaA"
  | "suikaB"
  | "suikaTotal"
  | "bonusBellB"
  | "bonusBellC"
  | "bonusReach";

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
  bellA: parseRate(setting.bellA),
  bellB: parseRate(setting.bellB),
  bellTotal: parseRate(setting.bellA) + parseRate(setting.bellB),
  cherryB: parseRate(setting.cherryB),
  suikaA: parseRate(setting.suikaA),
  suikaB: parseRate(setting.suikaB),
  suikaTotal: parseRate(setting.suikaA) + parseRate(setting.suikaB),
  bonusBellB: parseRate(setting.bonusBellB),
  bonusBellC: parseRate(setting.bonusBellC),
  bonusReach: parseRate(setting.bonusReach)
}));

const settingsDisplay = settings.map((setting) => ({
  setting: setting.setting,
  bb: formatRateFromProbability(parseRate(setting.bb)),
  rb: formatRateFromProbability(parseRate(setting.rb)),
  bellA: formatRateFromProbability(parseRate(setting.bellA)),
  bellB: formatRateFromProbability(parseRate(setting.bellB)),
  bellTotal: formatRateFromProbability(parseRate(setting.bellA) + parseRate(setting.bellB)),
  cherryB: formatRateFromProbability(parseRate(setting.cherryB)),
  suikaA: formatRateFromProbability(parseRate(setting.suikaA)),
  suikaB: formatRateFromProbability(parseRate(setting.suikaB)),
  suikaTotal: formatRateFromProbability(parseRate(setting.suikaA) + parseRate(setting.suikaB)),
  bonusBellB: formatRateFromProbability(parseRate(setting.bonusBellB)),
  bonusBellC: formatRateFromProbability(parseRate(setting.bonusBellC)),
  bonusReach: formatRateFromProbability(parseRate(setting.bonusReach)),
  payout: setting.payout,
  payoutFull: setting.payoutFull
}));

function toNumber(value: string) {
  if (!value) {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function calculateUnimemoBase(count: number, denominator: number) {
  if (count <= 0 || denominator <= 0) {
    return 0;
  }

  return Math.max(count, Math.round(count * denominator));
}

function formatDenominator(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return rounded.toFixed(1);
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

function clampPercentage(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
}

function formatInputPercentage(value: number) {
  return Number.isInteger(value) ? `攻略率${value}%` : `攻略率${value.toFixed(1)}%`;
}

function formatPayout(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function calculateEffectivePayout(normalPayout: string, fullPayout: string, strategyRate: number) {
  const normalizedRate = clampPercentage(strategyRate) / 100;
  const normal = parsePayoutRate(normalPayout);
  const full = parsePayoutRate(fullPayout);

  return normal + (full - normal) * normalizedRate;
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
    probability <= 0 ||
    probability >= 1
  ) {
    return Number.NEGATIVE_INFINITY;
  }

  if (totalCount === 0) {
    return successCount === 0 ? 0 : Number.NEGATIVE_INFINITY;
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

export default function ThunderVPage() {
  const [inputValues, setInputValues] = useState<Record<string, string>>(initialValues);
  const [inputMode, setInputMode] = useState<InputMode>("unimemo");
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

  const resetResults = () => {
    setSettingExpectationTable(null);
    setOverallSettingRows(null);
    setProbabilityGroups(null);
  };

  const saveSlots = useSaveSlots({
    storageKey: STORAGE_KEY,
    inputValues,
    initialValues,
    inputMode,
    initialInputMode: "unimemo",
    isValidMode: (value): value is InputMode => value === "unimemo" || value === "normal",
    onLoad: (nextValues) => {
      setInputValues(nextValues);
      resetResults();
    },
    onLoadMode: setInputMode
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

      const savedMode = window.localStorage.getItem(MODE_STORAGE_KEY);

      if (savedMode === "unimemo" || savedMode === "normal") {
        setInputMode(savedMode);
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
    window.localStorage.setItem(MODE_STORAGE_KEY, inputMode);
  }, [hasLoadedSavedValues, inputMode, inputValues]);

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
    setInputValues({ ...initialValues });
    setSettingExpectationTable(null);
    setOverallSettingRows(null);
    setProbabilityGroups(null);
  };

  const handleModeChange = (nextMode: InputMode) => {
    setInputMode(nextMode);
    setSettingExpectationTable(null);
    setOverallSettingRows(null);
    setProbabilityGroups(null);
  };

  const handleEstimate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const beforeGames = toNumber(inputValues.beforeGames);
    const currentGames = toNumber(inputValues.currentGames);
    const currentBig = toNumber(inputValues.currentBig);
    const currentReg = toNumber(inputValues.currentReg);
    const bellA = toNumber(inputValues.bellA);
    const bellB = toNumber(inputValues.bellB);
    const cherryB = toNumber(inputValues.cherryB);
    const suikaA = toNumber(inputValues.suikaA);
    const suikaB = toNumber(inputValues.suikaB);
    const bonusGames = toNumber(inputValues.bonusGames);
    const bonusBellB = toNumber(inputValues.bonusBellB);
    const bonusBellBRate = toNumber(inputValues.bonusBellBRate);
    const bonusBellC = toNumber(inputValues.bonusBellC);
    const bonusReach = toNumber(inputValues.bonusReach);
    const medalRent = toNumber(inputValues.medalRent);
    const exchangeRate = toNumber(inputValues.exchangeRate);
    const cashInvestment = Math.max(0, toNumber(inputValues.cashInvestment));
    const strategyRate = clampPercentage(toNumber(inputValues.strategyRate));
    const yenPerMedal = exchangeRate > 0 ? 100 / exchangeRate : 0;
    const cashGapLoss =
      medalRent > 0 && exchangeRate > 0
        ? cashInvestment * (1 - (medalRent * yenPerMedal) / 1000)
        : 0;

    const practiceGames = currentGames - beforeGames;
    const totalBonus = currentBig + currentReg;
    const bonusBase =
      inputMode === "unimemo" ? calculateUnimemoBase(bonusBellB, bonusBellBRate) : bonusGames;
    const settingExpectationValues = settings.map((setting) => {
      const payoutRate = calculateEffectivePayout(setting.payout, setting.payoutFull, strategyRate);

      return {
        label: setting.setting,
        payoutRate,
        expectedYen: practiceGames * 3 * yenPerMedal * (payoutRate - 1) - cashGapLoss
      };
    });

    const probabilityDefinitions: Array<{
      key: RateKey;
      title: string;
      count: number;
      base: number;
    }> = [
      {
        key: "bb",
        title: "BIG",
        count: currentBig,
        base: currentGames
      },
      {
        key: "rb",
        title: "REG",
        count: currentReg,
        base: currentGames
      },
      {
        key: "sum",
        title: "合算",
        count: totalBonus,
        base: currentGames
      },
      {
        key: "bellA",
        title: "通常時ベルA",
        count: bellA,
        base: practiceGames
      },
      {
        key: "bellB",
        title: "通常時ベルB",
        count: bellB,
        base: practiceGames
      },
      {
        key: "bellTotal",
        title: "通常時ベル合算",
        count: bellA + bellB,
        base: practiceGames
      },
      {
        key: "cherryB",
        title: "通常時チェリーB",
        count: cherryB,
        base: practiceGames
      },
      {
        key: "suikaA",
        title: "通常時スイカA",
        count: suikaA,
        base: practiceGames
      },
      {
        key: "suikaB",
        title: "通常時スイカB",
        count: suikaB,
        base: practiceGames
      },
      {
        key: "suikaTotal",
        title: "通常時スイカ合算",
        count: suikaA + suikaB,
        base: practiceGames
      },
      {
        key: "bonusBellB",
        title: "ボーナス中ベルB",
        count: bonusBellB,
        base: bonusBase
      },
      {
        key: "bonusBellC",
        title: "ボーナス中ベルC",
        count: bonusBellC,
        base: bonusBase
      },
      {
        key: "bonusReach",
        title: "ボーナス中リーチ目",
        count: bonusReach,
        base: bonusBase
      }
    ];

    const probabilityDefinitionMap = Object.fromEntries(
      probabilityDefinitions.map((definition) => [definition.key, definition])
    ) as Record<RateKey, (typeof probabilityDefinitions)[number]>;

    const validProbabilityDefinitions = probabilityDefinitions.filter(
      (definition) =>
        definition.key !== "sum" &&
        definition.key !== "bellTotal" &&
        definition.key !== "suikaTotal" &&
        definition.base > 0 &&
        definition.count >= 0 &&
        definition.count <= definition.base
    );

    setProbabilityGroups(
      probabilityDisplayGroups.map((group) => ({
        title: group.title,
        headerText: `${probabilityDefinitionMap[group.items[0].key].base}G`,
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
            summaryText: `${definition.count} (${formatProbability(definition.count, definition.base)})`,
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
        payoutHeaderText: formatInputPercentage(strategyRate),
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
      payoutHeaderText: formatInputPercentage(strategyRate),
      hourlyText: hourlyExpectedYen !== null ? formatHourlyYen(hourlyExpectedYen) : "-",
      rows: expectationRows,
      totalText: formatYen(totalExpectedYen)
    });
  };

  const renderFields = (fields: InputField[]) => (
    <div className={`input-row input-row-${Math.min(fields.length, 3)}`}>
      {fields.map((field) => (
        <div className="input-field-wrap" key={field.key}>
          <label className="input-field">
            <span className="input-label">{field.label}</span>
            <span className="input-control">
              {field.prefix ? <span className="input-prefix">{field.prefix}</span> : null}
              <input
                className={`number-input${field.compact ? " number-input-compact" : ""}${field.widthClass ? ` ${field.widthClass}` : ""}`}
                type="number"
                inputMode={field.keyboard ?? "numeric"}
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
  );

  return (
    <main className="page-shell">
      <div className="card card-wide">
        <h1 className="title">スマスロ サンダーV</h1>
        <section className="mode-switch">
          <p className="mode-switch-label">入力モード</p>
          <div className="mode-switch-options">
            {modeOptions.map((option) => (
              <label className="mode-switch-option" key={option.value}>
                <input
                  checked={inputMode === option.value}
                  className="mode-switch-radio"
                  name="thunderv-input-mode"
                  type="radio"
                  value={option.value}
                  onChange={() => handleModeChange(option.value)}
                />
                <span className="mode-switch-text">{option.label}</span>
              </label>
            ))}
          </div>
        </section>
        <form className="input-form" onSubmit={handleEstimate}>
          <UnimemoImageUpload
            machine="thunderv"
            onApply={(values) => {
              setInputMode("unimemo");
              setInputValues((current) => ({ ...current, ...values }));
              resetResults();
            }}
          />
          {inputGroups.map((group, index) => (
            <section className="input-group" key={`${group.title ?? "group"}-${index}`}>
              {group.title ? (
                <div className="group-title-row">
                  <p className="group-title">【{group.title}】</p>
                  {"note" in group && group.note ? (
                    <p className="group-note">{group.note}</p>
                  ) : null}
                </div>
              ) : null}
              {renderFields(
                inputMode === "unimemo" && group.title in unimemoInputGroups
                  ? unimemoInputGroups[group.title].fields
                  : group.fields
              )}
            </section>
          ))}
          <SaveSlotControls {...saveSlots} />
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
