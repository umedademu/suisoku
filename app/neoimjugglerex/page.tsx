"use client";

import { useEffect, useState } from "react";
import { JugglerBudoCounterButton } from "../juggler-budo-counter-button";
import { SaveSlotControls, useSaveSlots } from "../save-slots";
import { AutoEstimate, MachinePageHeader } from "../machine-page-controls";

const settings = [
  {
    setting: "設定1",
    bb: "1/273.1",
    rb: "1/439.8",
    budo: "1/6.06",
    singleReg: "1/630.15",
    payoutPublic: "97.0%",
    payoutCherry: "97.57%",
    payoutFull: "98.70%"
  },
  {
    setting: "設定2",
    bb: "1/269.7",
    rb: "1/399.6",
    budo: "1/6.04",
    singleReg: "1/574.88",
    payoutPublic: "98.0%",
    payoutCherry: "98.86%",
    payoutFull: "99.82%"
  },
  {
    setting: "設定3",
    bb: "1/269.7",
    rb: "1/331.0",
    budo: "1/6.04",
    singleReg: "1/474.90",
    payoutPublic: "99.5%",
    payoutCherry: "100.51%",
    payoutFull: "101.48%"
  },
  {
    setting: "設定4",
    bb: "1/259.0",
    rb: "1/315.1",
    budo: "1/6.04",
    singleReg: "1/448.88",
    payoutPublic: "101.1%",
    payoutCherry: "102.27%",
    payoutFull: "103.27%"
  },
  {
    setting: "設定5",
    bb: "1/259.0",
    rb: "1/255.0",
    budo: "1/6.02",
    singleReg: "1/364.09",
    payoutPublic: "104.3%",
    payoutCherry: "104.83%",
    payoutFull: "105.66%"
  },
  {
    setting: "設定6",
    bb: "1/255.0",
    rb: "1/255.0",
    budo: "1/5.80",
    singleReg: "1/364.09",
    payoutPublic: "105.5%",
    payoutCherry: "107.03%",
    payoutFull: "108.01%"
  }
];

type InputField = {
  key: string;
  label: string;
  unit?: string;
  compact?: boolean;
  widthClass?: string;
};

type StandardInputGroup = {
  title: string;
  note?: string;
  fields: InputField[];
};

type ChoiceOption = {
  value: PayoutMode;
  label: string;
};

type ChoiceInputGroup = {
  title: string;
  note?: string;
  choiceKey: "payoutMode";
  options: ChoiceOption[];
};

type InputGroup = StandardInputGroup | ChoiceInputGroup;

type PayoutMode = "public" | "cherry" | "full";
type GrapeGameMode = "fromStart" | "practice" | "total";
type InputValue = string | PayoutMode | GrapeGameMode;

const payoutModeLabels: Record<PayoutMode, string> = {
  public: "公表値",
  cherry: "チェリー狙い",
  full: "フル攻略"
};

const defaultPayoutMode: PayoutMode = "cherry";
const defaultGrapeGameMode: GrapeGameMode = "fromStart";

const grapeGameModeLabels: Record<GrapeGameMode, string> = {
  fromStart: "開始前G数",
  practice: "実践G数",
  total: "総G数"
};

const grapeGameModeOptions: Array<{ value: GrapeGameMode; label: string }> = [
  { value: "fromStart", label: "開始前G数" },
  { value: "practice", label: "実践G数" },
  { value: "total", label: "総G数" }
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
    title: "小役",
    fields: [
      { key: "budo", label: "ブドウ" },
      { key: "singleReg", label: "単独REG" }
    ]
  },
  {
    title: "打ち方",
    note: "期待値の計算に使用",
    choiceKey: "payoutMode",
    options: [
      { value: "public", label: "公表値" },
      { value: "cherry", label: "チェリー狙い" },
      { value: "full", label: "フル攻略" }
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
      "fields" in group ? group.fields.map((field) => [field.key, ""] as const) : []
    )
  ),
  medalRent: "46",
  exchangeRate: "5.0",
  grapeDiff: "",
  grapePracticeGames: "",
  grapeGameMode: defaultGrapeGameMode,
  payoutMode: defaultPayoutMode
};

const STORAGE_KEY = "suisoku-neoimjugglerex-inputs";

const specGroups = [
  {
    title: "基本スペック",
    columns: [
      { label: "BIG", key: "bb" },
      { label: "REG", key: "rb" },
      { label: "ボーナス合算", key: "bonusTotal" },
      { label: "機械割", key: "payoutCherry" }
    ]
  },
  {
    title: "打ち方ごとの機械割",
    columns: [
      { label: "公表値", key: "payoutPublic" },
      { label: "チェリー狙い", key: "payoutCherry" },
      { label: "フル攻略", key: "payoutFull" }
    ]
  },
  {
    title: "通常時小役・単独REG",
    columns: [
      { label: "ブドウ", key: "budo" },
      { label: "単独REG", key: "singleReg" }
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
    title: "通常時小役・単独REG",
    items: [
      { title: "ブドウ", key: "budo" as const },
      { title: "単独REG", key: "singleReg" as const }
    ]
  }
] as const;

type RateKey = "bb" | "rb" | "sum" | "budo" | "singleReg";

type ProbabilityDefinition = {
  key: RateKey;
  count: number;
  base: number;
  enabled?: boolean;
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
  budo: parseRate(setting.budo),
  singleReg: parseRate(setting.singleReg)
}));

const settingsDisplay = settings.map((setting) => ({
  setting: setting.setting,
  bb: formatRateFromProbability(parseRate(setting.bb)),
  rb: formatRateFromProbability(parseRate(setting.rb)),
  bonusTotal: formatRateFromProbability(parseRate(setting.bb) + parseRate(setting.rb)),
  budo: formatRateFromProbability(parseRate(setting.budo)),
  singleReg: formatRateFromProbability(parseRate(setting.singleReg)),
  payoutPublic: setting.payoutPublic,
  payoutCherry: setting.payoutCherry,
  payoutFull: setting.payoutFull
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
  return `${(value * 100).toFixed(2)}%`;
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

function getSelectedPayout(setting: (typeof settings)[number], payoutMode: PayoutMode) {
  if (payoutMode === "cherry") {
    return parsePayoutRate(setting.payoutCherry);
  }

  if (payoutMode === "full") {
    return parsePayoutRate(setting.payoutFull);
  }

  return parsePayoutRate(setting.payoutPublic);
}

const grapeEstimateSpec = {
  bigPayout: 252,
  regPayout: 96,
  replayDenominator: 7.3,
  replayPayout: 3,
  grapePayout: 8,
  cherryPayout: 2,
  oneBetGrapeDenominator: 10.3,
  oneBetReplayDenominator: 7.3,
  oneBetGrapePayout: 8,
  oneBetReplayPayout: 1,
  postAnnouncementBonusRatio: 0.75,
  cherryDenominatorsBySetting: [
    [1, 34.048637],
    [2, 33.552947],
    [3, 33.61935],
    [4, 33.659477],
    [5, 33.000429],
    [6, 32.856162]
  ] as const
};

type GrapeEstimateSource = {
  games: number;
  bb: number;
  rb: number;
  label: string;
};

type GrapeEstimateResult =
  | {
      status: "empty" | "invalid";
      message: string;
    }
  | {
      status: "ok";
      count: number;
      roundedCount: number;
      denominator: number;
      probability: number;
      normalGames: number;
      source: GrapeEstimateSource;
      cherryDenominator: number;
      averageSetting: number;
    };

function interpolateProbability(
  settingAverage: number,
  denominatorRows: typeof grapeEstimateSpec.cherryDenominatorsBySetting
) {
  const rows = denominatorRows.map(([setting, denominator]) => ({
    setting,
    probability: 1 / denominator
  }));
  const first = rows[0];
  const last = rows[rows.length - 1];

  if (settingAverage <= first.setting) {
    return first.probability;
  }

  if (settingAverage >= last.setting) {
    return last.probability;
  }

  for (let index = 0; index < rows.length - 1; index += 1) {
    const left = rows[index];
    const right = rows[index + 1];

    if (settingAverage < left.setting || settingAverage > right.setting) {
      continue;
    }

    const progress = (settingAverage - left.setting) / (right.setting - left.setting);
    return left.probability + (right.probability - left.probability) * progress;
  }

  return first.probability;
}

function calculateBonusAverageSetting(games: number, bb: number, rb: number) {
  if (games <= 0 || bb < 0 || rb < 0 || bb + rb <= 0) {
    return 3.5;
  }

  const logRows = settingRates.map((setting, index) => ({
    settingNumber: index + 1,
    logValue:
      calculateLogBinomialProbability(bb, games, setting.bb) +
      calculateLogBinomialProbability(rb, games, setting.rb)
  }));
  const maxLogValue = Math.max(...logRows.map((row) => row.logValue));

  if (!Number.isFinite(maxLogValue)) {
    return 3.5;
  }

  const weightedRows = logRows.map((row) => ({
    settingNumber: row.settingNumber,
    weight: Math.exp(row.logValue - maxLogValue)
  }));
  const totalWeight = weightedRows.reduce((sum, row) => sum + row.weight, 0);

  if (totalWeight <= 0) {
    return 3.5;
  }

  return (
    weightedRows.reduce((sum, row) => sum + row.settingNumber * row.weight, 0) / totalWeight
  );
}

function calculateResetOneBetDisplayGames(postAnnouncementBonusCount: number) {
  const continueProbability =
    1 / grapeEstimateSpec.oneBetGrapeDenominator +
    1 / grapeEstimateSpec.oneBetReplayDenominator;
  const expectedDisplayGamesPerBonus =
    Math.pow(continueProbability, 2) / (1 - Math.pow(continueProbability, 3));

  return postAnnouncementBonusCount * expectedDisplayGamesPerBonus;
}

function calculateEstimatedGrape(
  differenceValue: number,
  source: GrapeEstimateSource
): GrapeEstimateResult {
  if (source.games <= 0 || source.bb < 0 || source.rb < 0) {
    return {
      status: "invalid",
      message: "G数とボーナス回数を確認してください。"
    };
  }

  const bonusCount = source.bb + source.rb;
  const averageSetting = calculateBonusAverageSetting(source.games, source.bb, source.rb);
  const cherryProbability = interpolateProbability(
    averageSetting,
    grapeEstimateSpec.cherryDenominatorsBySetting
  );
  const postAnnouncementBonusCount =
    bonusCount * grapeEstimateSpec.postAnnouncementBonusRatio;
  const oneBetEndProbability =
    1 -
    1 / grapeEstimateSpec.oneBetGrapeDenominator -
    1 / grapeEstimateSpec.oneBetReplayDenominator;
  const oneBetGames =
    oneBetEndProbability > 0 ? postAnnouncementBonusCount / oneBetEndProbability : 0;
  const oneBetDisplayGames = calculateResetOneBetDisplayGames(postAnnouncementBonusCount);
  const normalGames = source.games - oneBetDisplayGames;

  if (!Number.isFinite(normalGames) || normalGames <= 0) {
    return {
      status: "invalid",
      message: "通常時G数を計算できません。"
    };
  }

  const correctedDifference =
    differenceValue - postAnnouncementBonusCount / grapeEstimateSpec.oneBetReplayDenominator;
  const totalInvestment = normalGames * 3 + oneBetGames;
  const bonusPayout =
    source.bb * grapeEstimateSpec.bigPayout + source.rb * grapeEstimateSpec.regPayout;
  const totalSmallPayout = correctedDifference + totalInvestment - bonusPayout;
  const replayPayout =
    (normalGames * grapeEstimateSpec.replayPayout) / grapeEstimateSpec.replayDenominator;
  const cherryPayout =
    normalGames * grapeEstimateSpec.cherryPayout * cherryProbability;
  const oneBetGrapePayout =
    (oneBetGames * grapeEstimateSpec.oneBetGrapePayout) /
    grapeEstimateSpec.oneBetGrapeDenominator;
  const oneBetReplayPayout =
    (oneBetGames * grapeEstimateSpec.oneBetReplayPayout) /
    grapeEstimateSpec.oneBetReplayDenominator;
  const grapePayout =
    totalSmallPayout - replayPayout - cherryPayout - oneBetGrapePayout - oneBetReplayPayout;
  const count = grapePayout / grapeEstimateSpec.grapePayout;

  if (!Number.isFinite(count) || count <= 0) {
    return {
      status: "invalid",
      message: "推定ブドウが0以下になりました。差枚数やG数を確認してください。"
    };
  }

  const denominator = normalGames / count;
  const probability = count / normalGames;

  if (
    !Number.isFinite(denominator) ||
    !Number.isFinite(probability) ||
    denominator <= 0 ||
    probability <= 0
  ) {
    return {
      status: "invalid",
      message: "推定ブドウを計算できません。"
    };
  }

  return {
    status: "ok",
    count,
    roundedCount: Math.max(0, Math.round(count)),
    denominator,
    probability,
    normalGames,
    source,
    cherryDenominator: 1 / cherryProbability,
    averageSetting
  };
}

export default function NeoImJugglerExPage() {
  const [inputValues, setInputValues] = useState<Record<string, InputValue>>(initialValues);
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
        const nextValues: Record<string, InputValue> = { ...initialValues };

        Object.entries(parsed).forEach(([key, value]) => {
          if (key === "payoutMode") {
            if (value === "public" || value === "cherry" || value === "full") {
              nextValues[key] = value;
            }

            return;
          }

          if (key === "grapeGameMode") {
            if (value === "fromStart" || value === "practice" || value === "total") {
              nextValues[key] = value;
            }

            return;
          }

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

  const medalRentValue = toNumber(String(inputValues.medalRent ?? ""));
  const exchangeRateValue = toNumber(String(inputValues.exchangeRate ?? ""));
  const cashInvestmentValue = Math.max(0, toNumber(String(inputValues.cashInvestment ?? "")));
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
  const liveBeforeGames = toNumber(String(inputValues.beforeGames ?? ""));
  const liveBeforeBig = toNumber(String(inputValues.beforeBig ?? ""));
  const liveBeforeReg = toNumber(String(inputValues.beforeReg ?? ""));
  const liveCurrentGames = toNumber(String(inputValues.currentGames ?? ""));
  const liveCurrentBig = toNumber(String(inputValues.currentBig ?? ""));
  const liveCurrentReg = toNumber(String(inputValues.currentReg ?? ""));
  const grapeGameMode =
    inputValues.grapeGameMode === "fromStart" ||
    inputValues.grapeGameMode === "practice" ||
    inputValues.grapeGameMode === "total"
      ? inputValues.grapeGameMode
      : defaultGrapeGameMode;
  const grapeEstimatePracticeBonus = {
    bb: liveCurrentBig - liveBeforeBig,
    rb: liveCurrentReg - liveBeforeReg
  };
  const grapeEstimateSource: GrapeEstimateSource =
    grapeGameMode === "total"
      ? {
          games: liveCurrentGames,
          bb: liveCurrentBig,
          rb: liveCurrentReg,
          label: grapeGameModeLabels.total
        }
      : grapeGameMode === "practice"
        ? {
            games: toNumber(String(inputValues.grapePracticeGames ?? "")),
            bb: grapeEstimatePracticeBonus.bb,
            rb: grapeEstimatePracticeBonus.rb,
            label: grapeGameModeLabels.practice
          }
        : {
            games: liveCurrentGames - liveBeforeGames,
            bb: grapeEstimatePracticeBonus.bb,
            rb: grapeEstimatePracticeBonus.rb,
            label: grapeGameModeLabels.fromStart
          };
  const grapeDiffRaw = String(inputValues.grapeDiff ?? "");
  const hasGrapeDiffInput = grapeDiffRaw.trim() !== "";
  const estimatedGrape: GrapeEstimateResult = hasGrapeDiffInput
    ? calculateEstimatedGrape(toNumber(grapeDiffRaw), grapeEstimateSource)
    : {
        status: "empty",
        message: "差枚数を入力すると推定ブドウを表示します。"
      };

  const handleClear = () => {
    saveSlots.onClearCurrentData();
  };

  const handleBudoIncrement = () => {
    setInputValues((current) => ({
      ...current,
      budo: String(toNumber(String(current.budo ?? "")) + 1)
    }));
  };

  const handleBudoDecrement = () => {
    setInputValues((current) => ({
      ...current,
      budo: String(Math.max(0, toNumber(String(current.budo ?? "")) - 1))
    }));
  };

  const handleApplyEstimatedBudo = () => {
    if (estimatedGrape.status !== "ok") {
      return;
    }

    setInputValues((current) => ({
      ...current,
      budo: String(estimatedGrape.roundedCount)
    }));
  };

  const handleSingleRegIncrement = () => {
    setInputValues((current) => ({
      ...current,
      singleReg: String(toNumber(String(current.singleReg ?? "")) + 1)
    }));
  };

  const handleSingleRegDecrement = () => {
    setInputValues((current) => ({
      ...current,
      singleReg: String(Math.max(0, toNumber(String(current.singleReg ?? "")) - 1))
    }));
  };

  const handleEstimate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const budoRaw = String(inputValues.budo ?? "");
    const hasBudoInput = budoRaw.trim() !== "";
    const singleRegRaw = String(inputValues.singleReg ?? "");
    const hasSingleRegInput = singleRegRaw.trim() !== "";
    const beforeGames = toNumber(String(inputValues.beforeGames ?? ""));
    const beforeBig = toNumber(String(inputValues.beforeBig ?? ""));
    const beforeReg = toNumber(String(inputValues.beforeReg ?? ""));
    const currentGames = toNumber(String(inputValues.currentGames ?? ""));
    const currentBig = toNumber(String(inputValues.currentBig ?? ""));
    const currentReg = toNumber(String(inputValues.currentReg ?? ""));
    const budo = toNumber(budoRaw);
    const singleReg = toNumber(singleRegRaw);
    const medalRent = toNumber(String(inputValues.medalRent ?? ""));
    const exchangeRate = toNumber(String(inputValues.exchangeRate ?? ""));
    const cashInvestment = Math.max(0, toNumber(String(inputValues.cashInvestment ?? "")));
    const payoutMode = (inputValues.payoutMode as PayoutMode) ?? defaultPayoutMode;
    const yenPerMedal = exchangeRate > 0 ? 100 / exchangeRate : 0;
    const cashGapLoss =
      medalRent > 0 && exchangeRate > 0
        ? cashInvestment * (1 - (medalRent * yenPerMedal) / 1000)
        : 0;

    const practiceGames = currentGames - beforeGames;
    const totalBonus = currentBig + currentReg;
    const settingExpectationValues = settings.map((setting) => {
      const payoutRate = getSelectedPayout(setting, payoutMode);

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
        key: "budo",
        count: budo,
        base: practiceGames,
        enabled: hasBudoInput
      },
      {
        key: "singleReg",
        count: singleReg,
        base: practiceGames,
        enabled: hasSingleRegInput
      }
    ];

    const probabilityDefinitionMap = Object.fromEntries(
      probabilityDefinitions.map((definition) => [definition.key, definition])
    ) as Record<RateKey, (typeof probabilityDefinitions)[number]>;

    const validProbabilityDefinitions = probabilityDefinitions.filter(
      (definition) =>
        definition.key !== "sum" &&
        definition.enabled !== false &&
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

          if (definition.enabled === false) {
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
        payoutHeaderText: payoutModeLabels[payoutMode],
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
      payoutHeaderText: payoutModeLabels[payoutMode],
      hourlyText: hourlyExpectedYen !== null ? formatHourlyYen(hourlyExpectedYen) : "-",
      rows: expectationRows,
      totalPayoutText: totalExpectedPayoutRate !== null ? formatPayout(totalExpectedPayoutRate) : "-",
      totalText: formatYen(totalExpectedYen)
    });
  };

  return (
    <main className="page-shell">
      <div className="card card-wide">
        <MachinePageHeader
          title="ネオアイムジャグラーEX"
          onClear={handleClear}
          onClearAll={saveSlots.onClearAllData}
        />
        <form className="input-form" onSubmit={handleEstimate}>
          <AutoEstimate inputValues={inputValues} isReady={hasLoadedSavedValues} />
          {inputGroups.map((group, index) => (
            <section className="input-group" key={`${group.title}-${index}`}>
              <div className="group-title-row">
                <p className="group-title">【{group.title}】</p>
                {group.note ? <p className="group-note">{group.note}</p> : null}
              </div>
              {"fields" in group ? (
                <>
                  <div className={`input-row input-row-${Math.min(group.fields.length, 3)}`}>
                    {group.fields.map((field) => (
                      <div className="input-field-wrap" key={field.key}>
                        <label className="input-field">
                          <span className="input-label">{field.label}</span>
                          <span className="input-control">
                            <input
                              className={`number-input${field.compact ? " number-input-compact" : ""}${field.widthClass ? ` ${field.widthClass}` : ""}`}
                              type="number"
                              inputMode="numeric"
                              value={String(inputValues[field.key] ?? "")}
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
                  {group.fields.some((field) => field.key === "budo") ? (
                    <div className="budo-counter-wrap">
                      <JugglerBudoCounterButton
                        count={inputValues.budo}
                        onIncrement={handleBudoIncrement}
                        onDecrement={handleBudoDecrement}
                        onSingleRegIncrement={handleSingleRegIncrement}
                        onSingleRegDecrement={handleSingleRegDecrement}
                      />
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="choice-group">
                  {group.options.map((option) => (
                    <label className="choice-option" key={option.value}>
                      <input
                        className="choice-radio"
                        type="radio"
                        name={group.choiceKey}
                        value={option.value}
                        checked={inputValues[group.choiceKey] === option.value}
                        onChange={() =>
                          setInputValues((current) => ({
                            ...current,
                            [group.choiceKey]: option.value
                          }))
                        }
                      />
                      <span className="choice-text">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </section>
          ))}
          <section className="input-group estimated-budo-group">
            <div className="group-title-row">
              <p className="group-title">【ブドウ逆算】</p>
              <p className="group-note">推定値</p>
            </div>
            <div className="input-row input-row-1">
              <div className="input-field-wrap">
                <label className="input-field">
                  <span className="input-label">差枚数</span>
                  <span className="input-control">
                    <input
                      className="number-input"
                      type="number"
                      inputMode="numeric"
                      value={String(inputValues.grapeDiff ?? "")}
                      onChange={(event) =>
                        setInputValues((current) => ({
                          ...current,
                          grapeDiff: event.target.value
                        }))
                      }
                    />
                    <span className="input-unit">枚</span>
                  </span>
                </label>
              </div>
            </div>
            <div className="choice-group">
              {grapeGameModeOptions.map((option) => (
                <label className="choice-option" key={option.value}>
                  <input
                    className="choice-radio"
                    type="radio"
                    name="grapeGameMode"
                    value={option.value}
                    checked={grapeGameMode === option.value}
                    onChange={() =>
                      setInputValues((current) => ({
                        ...current,
                        grapeGameMode: option.value
                      }))
                    }
                  />
                  <span className="choice-text">{option.label}</span>
                </label>
              ))}
            </div>
            {grapeGameMode === "practice" ? (
              <div className="input-row input-row-1">
                <div className="input-field-wrap">
                  <label className="input-field">
                    <span className="input-label">実践G数</span>
                    <span className="input-control">
                      <input
                        className="number-input"
                        type="number"
                        inputMode="numeric"
                        value={String(inputValues.grapePracticeGames ?? "")}
                        onChange={(event) =>
                          setInputValues((current) => ({
                            ...current,
                            grapePracticeGames: event.target.value
                          }))
                        }
                      />
                      <span className="input-unit">G</span>
                    </span>
                  </label>
                </div>
              </div>
            ) : null}
            <div
              className={`estimated-budo-result${
                estimatedGrape.status === "ok" ? " estimated-budo-result-ok" : ""
              }`}
            >
              {estimatedGrape.status === "ok" ? (
                <>
                  <div className="estimated-budo-grid">
                    <div className="estimated-budo-item">
                      <span className="estimated-budo-label">使用G数</span>
                      <span className="estimated-budo-value">
                        {Math.round(estimatedGrape.source.games).toLocaleString("ja-JP")}G
                      </span>
                    </div>
                    <div className="estimated-budo-item">
                      <span className="estimated-budo-label">使用BB/RB</span>
                      <span className="estimated-budo-value">
                        {estimatedGrape.source.bb}/{estimatedGrape.source.rb}
                      </span>
                    </div>
                    <div className="estimated-budo-item">
                      <span className="estimated-budo-label">推定ブドウ数</span>
                      <span className="estimated-budo-value">
                        {estimatedGrape.count.toLocaleString("ja-JP", {
                          maximumFractionDigits: 1
                        })}
                        個
                      </span>
                    </div>
                    <div className="estimated-budo-item">
                      <span className="estimated-budo-label">推定確率</span>
                      <span className="estimated-budo-value">
                        1/{formatDenominator(estimatedGrape.denominator)}
                      </span>
                    </div>
                  </div>
                  <button
                    className="estimated-budo-apply-button"
                    type="button"
                    onClick={handleApplyEstimatedBudo}
                  >
                    ブドウ欄へ反映
                  </button>
                </>
              ) : (
                <p className="estimated-budo-message">{estimatedGrape.message}</p>
              )}
            </div>
          </section>
          <SaveSlotControls {...saveSlots} />
        </form>
        <section className="result-group" id="estimate-results">
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
            <p className="result-placeholder">推測に使うデータを入力すると結果が自動更新されます。</p>
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
                        <th key={`${group.title}-${column.key}`}>
                          {group.title === "基本スペック" && column.key === "payoutCherry" ? (
                            <>
                              <div className="table-head-main">{column.label}</div>
                              <div className="table-head-sub">{payoutModeLabels[defaultPayoutMode]}</div>
                            </>
                          ) : (
                            column.label
                          )}
                        </th>
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
