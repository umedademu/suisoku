"use client";

import { useEffect, useState } from "react";
import { SaveSlotControls, useSaveSlots } from "../save-slots";
import { AutoEstimate, MachinePageHeader } from "../machine-page-controls";

const settings = [
  {
    label: "設定1",
    lowerBellDenominator: 121.1,
    cycle3Rate: 0.184,
    cycle4Rate: 0.336,
    mumeiCzPointReachRate: 84.7,
    ikomaCzPointReachRate: 84.7,
    voiceFemaleRate: 0.45,
    characterFemaleRate: 0.4,
    tsuranukiCylinderRate: 0.3,
    kageyukiVoiceRate: 0.12,
    characterLightRate: 0.1,
    bonusInitialDenominator: 254.2,
    stDenominator: 422.5,
    payout: 97.5
  },
  {
    label: "設定2",
    lowerBellDenominator: 114.4,
    cycle3Rate: 0.238,
    cycle4Rate: 0.352,
    mumeiCzPointReachRate: 84.7,
    ikomaCzPointReachRate: 84.7,
    voiceFemaleRate: 0.55,
    characterFemaleRate: 0.6,
    tsuranukiCylinderRate: 0.3,
    kageyukiVoiceRate: 0.12,
    characterLightRate: 0.12,
    bonusInitialDenominator: 242.3,
    stDenominator: 405.9,
    payout: 98.5
  },
  {
    label: "設定3",
    lowerBellDenominator: 112.8,
    cycle3Rate: 0.211,
    cycle4Rate: 0.363,
    mumeiCzPointReachRate: 84.7,
    ikomaCzPointReachRate: 84.7,
    voiceFemaleRate: 0.45,
    characterFemaleRate: 0.4,
    tsuranukiCylinderRate: 0.3,
    kageyukiVoiceRate: 0.12,
    characterLightRate: 0.14,
    bonusInitialDenominator: 239.6,
    stDenominator: 398.7,
    payout: 100.8
  },
  {
    label: "設定4",
    lowerBellDenominator: 106.2,
    cycle3Rate: 0.285,
    cycle4Rate: 0.402,
    mumeiCzPointReachRate: 71.8,
    ikomaCzPointReachRate: 71.8,
    voiceFemaleRate: 0.55,
    characterFemaleRate: 0.6,
    tsuranukiCylinderRate: 0.2,
    kageyukiVoiceRate: 0.19,
    characterLightRate: 0.16,
    bonusInitialDenominator: 214.0,
    stDenominator: 357.2,
    payout: 106.0
  },
  {
    label: "設定5",
    lowerBellDenominator: 104.2,
    cycle3Rate: 0.324,
    cycle4Rate: 0.434,
    mumeiCzPointReachRate: 62.6,
    ikomaCzPointReachRate: 62.6,
    voiceFemaleRate: 0.45,
    characterFemaleRate: 0.4,
    tsuranukiCylinderRate: 0.3,
    kageyukiVoiceRate: 0.19,
    characterLightRate: 0.18,
    bonusInitialDenominator: 203.2,
    stDenominator: 332.6,
    payout: 111.0
  },
  {
    label: "設定6",
    lowerBellDenominator: 99.1,
    cycle3Rate: 0.371,
    cycle4Rate: 0.469,
    mumeiCzPointReachRate: 62.6,
    ikomaCzPointReachRate: 62.6,
    voiceFemaleRate: 0.55,
    characterFemaleRate: 0.6,
    tsuranukiCylinderRate: 0.3,
    kageyukiVoiceRate: 0.19,
    characterLightRate: 0.2,
    bonusInitialDenominator: 195.1,
    stDenominator: 318.5,
    payout: 114.9
  }
] as const;

type KabaneriSetting = (typeof settings)[number];

type SpecColumn = {
  label: string;
  format: (setting: KabaneriSetting) => string;
};

const specGroups: Array<{ title: string; columns: SpecColumn[] }> = [
  {
    title: "機械割",
    columns: [
      {
        label: "ボーナス初当たり",
        format: (setting) => `1/${setting.bonusInitialDenominator.toFixed(1)}`
      },
      {
        label: "ST確率",
        format: (setting) => `1/${setting.stDenominator.toFixed(1)}`
      },
      {
        label: "機械割",
        format: (setting) => `${setting.payout.toFixed(1)}%`
      }
    ]
  },
  {
    title: "pt到達率",
    columns: [
      {
        label: "無名CZ",
        format: (setting) => `${setting.mumeiCzPointReachRate.toFixed(1)}%`
      },
      {
        label: "生駒CZ",
        format: (setting) => `${setting.ikomaCzPointReachRate.toFixed(1)}%`
      }
    ]
  },
  {
    title: "発光率",
    columns: [
      {
        label: "無名",
        format: (setting) => `${(setting.characterLightRate * 100).toFixed(1)}%`
      },
      {
        label: "生駒",
        format: (setting) => `${(setting.characterLightRate * 100).toFixed(1)}%`
      }
    ]
  },
  {
    title: "周期別当選率",
    columns: [
      {
        label: "3周期目",
        format: (setting) => `${(setting.cycle3Rate * 100).toFixed(1)}%`
      },
      {
        label: "4周期目",
        format: (setting) => `${(setting.cycle4Rate * 100).toFixed(1)}%`
      }
    ]
  },
  {
    title: "下段ベル",
    columns: [
      {
        label: "出現率",
        format: (setting) => `1/${setting.lowerBellDenominator.toFixed(1)}`
      }
    ]
  },
  {
    title: "サンド目停止ボイス",
    columns: [
      {
        label: "女性",
        format: (setting) => `${(setting.voiceFemaleRate * 100).toFixed(1)}%`
      },
      {
        label: "男性",
        format: (setting) => `${((1 - setting.voiceFemaleRate) * 100).toFixed(1)}%`
      }
    ]
  },
  {
    title: "キャラ紹介",
    columns: [
      {
        label: "女性",
        format: (setting) => `${(setting.characterFemaleRate * 100).toFixed(1)}%`
      },
      {
        label: "男性",
        format: (setting) => `${((1 - setting.characterFemaleRate) * 100).toFixed(1)}%`
      }
    ]
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
  fields: InputField[];
  hideTitle?: boolean;
  rowClass?: string;
};

type CycleInputRow = {
  label: string;
  trialKey: string;
  hitKey: string;
};

type CycleInputGroup = {
  title: string;
  note: string;
  rows: CycleInputRow[];
};

const CHARACTER_STANDARD_POINTS = {
  無名: 108,
  生駒: 106
} as const;

type KabaneriCharacter = keyof typeof CHARACTER_STANDARD_POINTS;

type CharacterPointCountKey =
  | "mumeiNoLightCount"
  | "mumeiUnknownLightCount"
  | "mumeiWithLightCount"
  | "mumeiHighProbabilityCount"
  | "ikomaNoLightCount"
  | "ikomaUnknownLightCount"
  | "ikomaWithLightCount"
  | "ikomaHighProbabilityCount";

type CharacterPointButton = {
  key: string;
  label: string;
  points: 1 | 15;
  tone: string;
  countKey: CharacterPointCountKey;
};

type CharacterSpecialPointCountKey =
  | "mumeiKabaneSpecialCount"
  | "kabaneIkomaSpecialCount"
  | "mumeiIkomaMumeiSpecialCount"
  | "mumeiIkomaSpecialCount"
  | "allStarMumeiSpecialCount"
  | "allStarIkomaSpecialCount";

const ALL_STAR_RESET_COUNT_KEYS = [
  "mumeiNoLightCount",
  "mumeiUnknownLightCount",
  "mumeiWithLightCount",
  "mumeiHighProbabilityCount",
  "ikomaNoLightCount",
  "ikomaUnknownLightCount",
  "ikomaWithLightCount",
  "ikomaHighProbabilityCount",
  "mumeiKabaneSpecialCount",
  "kabaneIkomaSpecialCount",
  "mumeiIkomaMumeiSpecialCount",
  "mumeiIkomaSpecialCount",
  "allStarMumeiSpecialCount",
  "allStarIkomaSpecialCount"
] as const satisfies readonly (CharacterPointCountKey | CharacterSpecialPointCountKey)[];

type AllStarResetCountKey = (typeof ALL_STAR_RESET_COUNT_KEYS)[number];

type CharacterSpecialPointButton = {
  key: string;
  label: "無名&カバネ" | "カバネ&生駒" | "無名&生駒" | "オールスター目";
  points: 15 | 30;
  tone: "red-blue" | "blue-green" | "red-green" | "all-star";
  mumeiPointIncrement: 0 | 15 | 30;
  ikomaPointIncrement: 0 | 15 | 30;
  mumeiCountKey?: CharacterSpecialPointCountKey;
  ikomaCountKey?: CharacterSpecialPointCountKey;
};

const CHARACTER_SPECIAL_POINT_BUTTONS: Record<
  "mumeiKabane" | "kabaneIkoma" | "mumeiIkoma" | "allStar",
  CharacterSpecialPointButton
> = {
  mumeiKabane: {
    key: "mumei-kabane",
    label: "無名&カバネ",
    points: 15,
    tone: "red-blue",
    mumeiPointIncrement: 15,
    ikomaPointIncrement: 0,
    mumeiCountKey: "mumeiKabaneSpecialCount"
  },
  kabaneIkoma: {
    key: "kabane-ikoma",
    label: "カバネ&生駒",
    points: 15,
    tone: "blue-green",
    mumeiPointIncrement: 0,
    ikomaPointIncrement: 15,
    ikomaCountKey: "kabaneIkomaSpecialCount"
  },
  mumeiIkoma: {
    key: "mumei-ikoma",
    label: "無名&生駒",
    points: 15,
    tone: "red-green",
    mumeiPointIncrement: 15,
    ikomaPointIncrement: 15,
    mumeiCountKey: "mumeiIkomaMumeiSpecialCount",
    ikomaCountKey: "mumeiIkomaSpecialCount"
  },
  allStar: {
    key: "all-star",
    label: "オールスター目",
    points: 30,
    tone: "all-star",
    mumeiPointIncrement: 30,
    ikomaPointIncrement: 30,
    mumeiCountKey: "allStarMumeiSpecialCount",
    ikomaCountKey: "allStarIkomaSpecialCount"
  }
};

type CharacterPointGroup = {
  title: string;
  character: KabaneriCharacter;
  pointKey: "mumeiPoints" | "ikomaPoints";
  standardPoints: 108 | 106;
  noLightCountKey: "mumeiNoLightCount" | "ikomaNoLightCount";
  withLightCountKey: "mumeiWithLightCount" | "ikomaWithLightCount";
  theme: "red" | "green";
  pointButtons: CharacterPointButton[];
};

type CharacterHistoryGroup = {
  title: string;
  history: true;
};

type MySlotInputGroup = {
  title: string;
  note: string;
  myslot: true;
};

type LightRateEstimationGroup = {
  title: string;
  hideTitle: true;
  lightRateEstimation: true;
};

type CharacterCzHistoryEntry = {
  kind: "character";
  character: KabaneriCharacter;
  points: number;
  noLightCount: number;
  withLightCount: number;
  recordedAt: number;
};

type AllStarHistoryEntry = {
  kind: "all-star";
  mumeiPoints: number;
  ikomaPoints: number;
  counts: Record<AllStarResetCountKey, number>;
  recordedAt: number;
};

type CharacterPointHistoryEntry = CharacterCzHistoryEntry | AllStarHistoryEntry;

type InputGroup =
  | StandardInputGroup
  | CycleInputGroup
  | CharacterPointGroup
  | CharacterHistoryGroup
  | MySlotInputGroup
  | LightRateEstimationGroup;

type DetailColumn = {
  label: string;
  summaryText: string;
  values: string[];
};

type DetailGroup = {
  title: string;
  columns: DetailColumn[];
};

type EstimateResult = {
  hasPracticeGames: boolean;
  hasLowerBellInput: boolean;
  practiceGames: number;
  practiceLowerBells: number;
  measuredRateText: string;
  settingRows: Array<{
    label: string;
    value: string;
  }>;
  expectationRows: Array<{
    label: string;
    payoutText: string;
    expectationText: string;
    probabilityText: string;
    weightedText: string;
  }>;
  totalPayoutText: string;
  totalExpectationText: string;
  hourlyText: string;
  detailGroups: DetailGroup[];
};

const inputGroups: InputGroup[] = [
  {
    title: "無名pt",
    character: "無名",
    pointKey: "mumeiPoints",
    standardPoints: 108,
    noLightCountKey: "mumeiNoLightCount",
    withLightCountKey: "mumeiWithLightCount",
    theme: "red",
    pointButtons: [
      {
        key: "no-light",
        label: "発光なし",
        points: 1,
        tone: "crimson",
        countKey: "mumeiNoLightCount"
      },
      {
        key: "with-light",
        label: "発光あり",
        points: 15,
        tone: "rose",
        countKey: "mumeiWithLightCount"
      },
      {
        key: "unknown-light",
        label: "発光不明",
        points: 1,
        tone: "wine",
        countKey: "mumeiUnknownLightCount"
      },
      {
        key: "high-probability",
        label: "高確率",
        points: 15,
        tone: "coral",
        countKey: "mumeiHighProbabilityCount"
      }
    ]
  },
  {
    title: "生駒pt",
    character: "生駒",
    pointKey: "ikomaPoints",
    standardPoints: 106,
    noLightCountKey: "ikomaNoLightCount",
    withLightCountKey: "ikomaWithLightCount",
    theme: "green",
    pointButtons: [
      {
        key: "no-light",
        label: "発光なし",
        points: 1,
        tone: "deep",
        countKey: "ikomaNoLightCount"
      },
      {
        key: "with-light",
        label: "発光あり",
        points: 15,
        tone: "soft",
        countKey: "ikomaWithLightCount"
      },
      {
        key: "unknown-light",
        label: "発光不明",
        points: 1,
        tone: "forest",
        countKey: "ikomaUnknownLightCount"
      },
      {
        key: "high-probability",
        label: "高確率",
        points: 15,
        tone: "leaf",
        countKey: "ikomaHighProbabilityCount"
      }
    ]
  },
  {
    title: "発光率推測",
    hideTitle: true,
    lightRateEstimation: true
  },
  {
    title: "小役",
    hideTitle: true,
    rowClass: "kabaneri-games-row",
    fields: [
      {
        key: "beforeGames",
        label: "開始G数",
        widthClass: "number-input-compact"
      },
      {
        key: "currentGames",
        label: "現在G数",
        widthClass: "number-input-compact"
      },
      {
        key: "lowerBells",
        label: "下段ベル",
        widthClass: "number-input-compact"
      }
    ]
  },
  {
    title: "周期当選",
    note: "試行回数と当選回数を入力",
    rows: [
      {
        label: "3周期目",
        trialKey: "cycle3Trials",
        hitKey: "cycle3Hits"
      },
      {
        label: "4周期目",
        trialKey: "cycle4Trials",
        hitKey: "cycle4Hits"
      }
    ]
  },
  {
    title: "マイスロ入力欄",
    note: "キャラ紹介とボイスを自動集計",
    myslot: true
  },
  {
    title: "CZ当選履歴",
    history: true
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

const characterPointGroups = inputGroups.filter(
  (group): group is CharacterPointGroup => "pointButtons" in group
);

const initialValues: Record<string, string> = {
  beforeGames: "",
  currentGames: "",
  lowerBells: "",
  cycle3Trials: "",
  cycle3Hits: "",
  cycle4Trials: "",
  cycle4Hits: "",
  mumeiPoints: "0",
  mumeiNoLightCount: "0",
  mumeiUnknownLightCount: "0",
  mumeiWithLightCount: "0",
  mumeiHighProbabilityCount: "0",
  ikomaPoints: "0",
  ikomaNoLightCount: "0",
  ikomaUnknownLightCount: "0",
  ikomaWithLightCount: "0",
  ikomaHighProbabilityCount: "0",
  mumeiKabaneSpecialCount: "0",
  kabaneIkomaSpecialCount: "0",
  mumeiIkomaMumeiSpecialCount: "0",
  mumeiIkomaSpecialCount: "0",
  allStarMumeiSpecialCount: "0",
  allStarIkomaSpecialCount: "0",
  useCharacterPointRate: "1",
  useCharacterLightRate: "1",
  useItemLottery: "1",
  useTrophy: "1",
  characterPointHistory: "[]",
  myslotText: "",
  medalRent: "46",
  exchangeRate: "5.0",
  cashInvestment: ""
};

const STORAGE_KEY = "suisoku-kabaneri2-inputs";

function toNumber(value: string) {
  if (value.trim() === "") {
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

function formatMeasuredRate(count: number, games: number) {
  if (count <= 0 || games <= 0) {
    return "-";
  }

  return `1/${formatDenominator(games / count)}`;
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

  const smallerSide = Math.min(successCount, totalCount - successCount);
  let logCombination = 0;

  for (let count = 1; count <= smallerSide; count += 1) {
    logCombination += Math.log(totalCount - smallerSide + count) - Math.log(count);
  }

  return (
    logCombination +
    successCount * Math.log(probability) +
    (totalCount - successCount) * Math.log(1 - probability)
  );
}

function calculateSettingProbabilities(
  successCount: number,
  totalCount: number,
  getProbability: (setting: (typeof settings)[number]) => number
) {
  const logValues = settings.map((setting) =>
    calculateLogBinomialProbability(successCount, totalCount, getProbability(setting))
  );
  const maxLogValue = Math.max(...logValues);
  const weights = logValues.map((logValue) => Math.exp(logValue - maxLogValue));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  return weights.map((weight) => (totalWeight > 0 ? weight / totalWeight : 0));
}

function calculateLogRateSampleProbability(
  observedRate: number,
  sampleCount: number,
  probability: number
) {
  if (
    sampleCount < 0 ||
    observedRate < 0 ||
    observedRate > 1 ||
    probability <= 0 ||
    probability >= 1
  ) {
    return Number.NEGATIVE_INFINITY;
  }

  const successWeight = observedRate * sampleCount;

  return (
    successWeight * Math.log(probability) +
    (sampleCount - successWeight) * Math.log(1 - probability)
  );
}

function calculateRateSampleSettingProbabilities(
  observedRate: number,
  sampleCount: number,
  getProbability: (setting: (typeof settings)[number]) => number
) {
  const logValues = settings.map((setting) =>
    calculateLogRateSampleProbability(observedRate, sampleCount, getProbability(setting))
  );
  const maxLogValue = Math.max(...logValues);
  const weights = logValues.map((logValue) => Math.exp(logValue - maxLogValue));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  return weights.map((weight) => (totalWeight > 0 ? weight / totalWeight : 0));
}

function getCharacterPointReachProbability(
  setting: (typeof settings)[number],
  character: KabaneriCharacter
) {
  return (
    (character === "無名"
      ? setting.mumeiCzPointReachRate
      : setting.ikomaCzPointReachRate) / 100
  );
}

function formatCycleSummary(hits: number, trials: number) {
  return `${hits}/${trials} (${((hits / trials) * 100).toFixed(1)}%)`;
}

function formatGenderSummary(femaleCount: number, totalCount: number) {
  return `女性${femaleCount}回 / 男女計${totalCount}回 (${(
    (femaleCount / totalCount) *
    100
  ).toFixed(1)}%)`;
}

function toNonNegativeInteger(value: unknown) {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? Math.max(0, Math.trunc(numberValue)) : 0;
}

function parseCharacterPointHistory(value: string) {
  try {
    const parsed = JSON.parse(value) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .flatMap<CharacterPointHistoryEntry>((item) => {
        if (typeof item !== "object" || item === null || Array.isArray(item)) {
          return [];
        }

        const entry = item as Record<string, unknown>;
        const recordedAt = Number(entry.recordedAt);

        if (entry.kind === "all-star") {
          const rawCounts =
            typeof entry.counts === "object" &&
            entry.counts !== null &&
            !Array.isArray(entry.counts)
              ? (entry.counts as Record<string, unknown>)
              : {};
          const counts = Object.fromEntries(
            ALL_STAR_RESET_COUNT_KEYS.map((key) => [key, toNonNegativeInteger(rawCounts[key])])
          ) as Record<AllStarResetCountKey, number>;

          return [
            {
              kind: "all-star",
              mumeiPoints: toNonNegativeInteger(entry.mumeiPoints),
              ikomaPoints: toNonNegativeInteger(entry.ikomaPoints),
              counts,
              recordedAt: Number.isFinite(recordedAt) ? recordedAt : 0
            }
          ];
        }

        if (entry.character !== "無名" && entry.character !== "生駒") {
          return [];
        }

        return [
          {
            kind: "character",
            character: entry.character,
            points: toNonNegativeInteger(entry.points),
            noLightCount: toNonNegativeInteger(entry.noLightCount),
            withLightCount: toNonNegativeInteger(entry.withLightCount),
            recordedAt: Number.isFinite(recordedAt) ? recordedAt : 0
          }
        ];
      })
      .sort((first, second) => second.recordedAt - first.recordedAt);
  } catch {
    return [];
  }
}

function formatCharacterPointPercentage(percentage: number) {
  const roundedPercentage = Math.round(percentage * 10) / 10;

  return `${Number.isInteger(roundedPercentage) ? roundedPercentage.toFixed(0) : roundedPercentage.toFixed(1)}%`;
}

function calculateCharacterPointProgress(points: number, standardPoints: number) {
  const percentage = Math.min(120, (points / standardPoints) * 100);

  return {
    points,
    percentage,
    percentageText: formatCharacterPointPercentage(percentage)
  };
}

function calculateCharacterLightRate(noLightCount: number, withLightCount: number) {
  const denominator = noLightCount + withLightCount;

  return {
    numerator: withLightCount,
    denominator,
    percentageText:
      denominator > 0 ? `${((withLightCount / denominator) * 100).toFixed(1)}%` : "算出前"
  };
}

const MYSLOT_CHARACTER_CATEGORIES = [
  { key: "femaleCharacter", label: "女性キャラ", rangeLabel: "No.1〜3" },
  { key: "maleCharacter", label: "男性キャラ", rangeLabel: "No.4〜6" },
  { key: "biba", label: "美馬", rangeLabel: "No.7" }
] as const;

type MyslotCharacterCategoryKey = (typeof MYSLOT_CHARACTER_CATEGORIES)[number]["key"];

const MYSLOT_TROPHY_CATEGORIES = [
  { key: "bronze", label: "銅", minimumSetting: 2 },
  { key: "silver", label: "銀", minimumSetting: 3 },
  { key: "gold", label: "金", minimumSetting: 4 },
  { key: "kirin", label: "キリン", minimumSetting: 5 },
  { key: "rainbow", label: "虹", minimumSetting: 6 }
] as const;

type MyslotTrophyCategoryKey = (typeof MYSLOT_TROPHY_CATEGORIES)[number]["key"];

const MYSLOT_VOICE_CATEGORIES = [
  { key: "female", label: "女性ボイス", rangeLabel: "No.1・2・4〜8" },
  { key: "male", label: "男性ボイス", rangeLabel: "No.9〜16" },
  { key: "no17", label: "景行(弱)", rangeLabel: "No.17" },
  { key: "no18", label: "景行(中)", rangeLabel: "No.18" },
  { key: "no19", label: "景行(強)", rangeLabel: "No.19" },
  { key: "no3", label: "無名特殊(1否定)", rangeLabel: "No.3" },
  { key: "no20", label: "ボイス無し(56確)", rangeLabel: "No.20" }
] as const;

type MyslotVoiceCategoryKey = (typeof MYSLOT_VOICE_CATEGORIES)[number]["key"];

type MyslotNumberedEntry = {
  number: number;
  count: number;
};

function extractMyslotSections(value: string, sectionMarker: string, endMarkers: string[]) {
  const normalizedValue = value.normalize("NFKC").replace(/\r\n?/g, "\n");
  const sections: string[] = [];
  let currentSectionLines: string[] | null = null;

  for (const line of normalizedValue.split("\n")) {
    const markerIndex = line.indexOf(sectionMarker);

    if (markerIndex >= 0) {
      if (currentSectionLines !== null) {
        sections.push(currentSectionLines.join("\n"));
      }

      currentSectionLines = [];
      const remainder = line.slice(markerIndex + sectionMarker.length).trim();

      if (remainder !== "") {
        currentSectionLines.push(remainder);
      }

      continue;
    }

    if (currentSectionLines === null) {
      continue;
    }

    if (endMarkers.some((endMarker) => line.includes(endMarker))) {
      sections.push(currentSectionLines.join("\n"));
      currentSectionLines = null;
      continue;
    }

    currentSectionLines.push(line);
  }

  if (currentSectionLines !== null) {
    sections.push(currentSectionLines.join("\n"));
  }

  return sections;
}

function parseMyslotNumberedEntries(sections: string[]) {
  const entries: MyslotNumberedEntry[] = [];

  sections.forEach((section) => {
    const numberedItems = section.matchAll(
      /No\.?\s*(\d{1,2})(?!\d)([\s\S]*?)(?=No\.?\s*\d{1,2}(?!\d)|$)/gi
    );

    for (const item of numberedItems) {
      const countMatches = Array.from(item[2].matchAll(/([\d,]+)\s*回/g));
      const countMatch = countMatches[countMatches.length - 1];

      if (!countMatch) {
        continue;
      }

      const number = Number(item[1]);
      const count = Number(countMatch[1].replace(/,/g, ""));

      if (!Number.isFinite(number) || !Number.isFinite(count)) {
        continue;
      }

      entries.push({
        number: Math.max(0, Math.trunc(number)),
        count: Math.max(0, Math.trunc(count))
      });
    }
  });

  return entries;
}

function getMyslotCharacterCategoryKey(
  characterNumber: number
): MyslotCharacterCategoryKey | null {
  if (characterNumber >= 1 && characterNumber <= 3) {
    return "femaleCharacter";
  }

  if (characterNumber >= 4 && characterNumber <= 6) {
    return "maleCharacter";
  }

  if (characterNumber === 7) {
    return "biba";
  }

  return null;
}

function getMyslotVoiceCategoryKey(voiceNumber: number): MyslotVoiceCategoryKey | null {
  if (voiceNumber === 3) {
    return "no3";
  }

  if (voiceNumber >= 1 && voiceNumber <= 8) {
    return "female";
  }

  if (voiceNumber >= 9 && voiceNumber <= 16) {
    return "male";
  }

  if (voiceNumber === 17) {
    return "no17";
  }

  if (voiceNumber === 18) {
    return "no18";
  }

  if (voiceNumber === 19) {
    return "no19";
  }

  if (voiceNumber === 20) {
    return "no20";
  }

  return null;
}

function parseMyslotTrophySummary(value: string) {
  const normalizedValue = value.normalize("NFKC").replace(/\r\n?/g, "\n");
  const counts: Record<MyslotTrophyCategoryKey, number> = {
    bronze: 0,
    silver: 0,
    gold: 0,
    kirin: 0,
    rainbow: 0
  };
  const trophyEntries = normalizedValue.matchAll(
    /サミートロフィー\s*\(\s*(銅|銀|金|キリン|虹)\s*\)\s*([\d,]+)\s*獲得/g
  );
  let recognizedRowCount = 0;

  for (const entry of trophyEntries) {
    const category = MYSLOT_TROPHY_CATEGORIES.find((item) => item.label === entry[1]);
    const count = Number(entry[2].replace(/,/g, ""));

    if (!category || !Number.isFinite(count)) {
      continue;
    }

    counts[category.key] += Math.max(0, Math.trunc(count));
    recognizedRowCount += 1;
  }

  const categories = MYSLOT_TROPHY_CATEGORIES.map((category) => ({
    ...category,
    count: counts[category.key]
  }));
  const totalCount = categories.reduce((sum, category) => sum + category.count, 0);
  const minimumSetting = categories.reduce(
    (currentMinimum, category) =>
      category.count > 0 ? Math.max(currentMinimum, category.minimumSetting) : currentMinimum,
    0
  );

  return {
    foundSection: normalizedValue.includes("サミートロフィー"),
    recognizedRowCount,
    totalCount,
    minimumSetting,
    categories
  };
}

function parseMyslotItemLotterySummary(value: string) {
  const sections = extractMyslotSections(value, "アイテムくじ", [
    "KABANERI OF THE IRON FORTRESS 終了画面",
    "サンド目停止時ボイス",
    "<実戦データ",
    "ココマデ"
  ]);
  const entries = parseMyslotNumberedEntries(sections);
  const totalCount = entries.reduce((sum, entry) => sum + entry.count, 0);
  const getCount = (number: number) =>
    entries.reduce(
      (sum, entry) => (entry.number === number ? sum + entry.count : sum),
      0
    );
  const tsuranukiCylinderCount = getCount(1);

  return {
    foundSection: sections.length > 0,
    recognizedRowCount: entries.length,
    totalCount,
    tsuranukiCylinderCount,
    kurusuSwordCount: getCount(4),
    mumeiKendamaCount: getCount(5),
    smallLuckCount: getCount(8),
    mediumLuckCount: getCount(9),
    bigLuckCount: getCount(10),
    percentageText:
      totalCount > 0 ? `${((tsuranukiCylinderCount / totalCount) * 100).toFixed(1)}%` : "0.0%"
  };
}

function parseMyslotCharacterSummary(value: string) {
  const sections = extractMyslotSections(value, "キャラ紹介", [
    "アイテムくじ",
    "KABANERI OF THE IRON FORTRESS 終了画面",
    "サンド目停止時ボイス",
    "<実戦データ",
    "ココマデ"
  ]);
  const entries = parseMyslotNumberedEntries(sections);
  const counts: Record<MyslotCharacterCategoryKey, number> = {
    femaleCharacter: 0,
    maleCharacter: 0,
    biba: 0
  };
  let recognizedRowCount = 0;

  entries.forEach((entry) => {
    const categoryKey = getMyslotCharacterCategoryKey(entry.number);

    if (categoryKey === null) {
      return;
    }

    counts[categoryKey] += entry.count;
    recognizedRowCount += 1;
  });

  const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);

  return {
    foundSection: sections.length > 0,
    recognizedRowCount,
    totalCount,
    categories: MYSLOT_CHARACTER_CATEGORIES.map((category) => {
      const count = counts[category.key];

      return {
        ...category,
        count,
        percentageText: totalCount > 0 ? `${((count / totalCount) * 100).toFixed(1)}%` : "0.0%"
      };
    })
  };
}

function parseMyslotVoiceSummary(value: string) {
  const sections = extractMyslotSections(value, "サンド目停止時ボイス", [
    "<実戦データ",
    "ココマデ"
  ]);
  const entries = parseMyslotNumberedEntries(sections);

  const counts: Record<MyslotVoiceCategoryKey, number> = {
    female: 0,
    no3: 0,
    male: 0,
    no17: 0,
    no18: 0,
    no19: 0,
    no20: 0
  };
  let recognizedRowCount = 0;

  entries.forEach((entry) => {
    const categoryKey = getMyslotVoiceCategoryKey(entry.number);

    if (categoryKey === null) {
      return;
    }

    counts[categoryKey] += entry.count;
    recognizedRowCount += 1;
  });

  const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);

  return {
    foundSection: sections.length > 0,
    recognizedRowCount,
    totalCount,
    categories: MYSLOT_VOICE_CATEGORIES.map((category) => {
      const count = counts[category.key];

      return {
        ...category,
        count,
        percentageText: totalCount > 0 ? `${((count / totalCount) * 100).toFixed(1)}%` : "0.0%"
      };
    })
  };
}

function MyslotSummaryBlock({
  summaryKey,
  title,
  totalCount,
  categories
}: {
  summaryKey: "character" | "voice";
  title: string;
  totalCount: number;
  categories: Array<{
    key: string;
    label: string;
    rangeLabel: string;
    count: number;
    percentageText: string;
  }>;
}) {
  return (
    <div className="myslot-summary-block" data-myslot-summary={summaryKey}>
      <div className="myslot-voice-summary-heading">
        <p className="myslot-voice-summary-title">{title}</p>
        <p className="myslot-voice-total">全体 {totalCount}回</p>
      </div>
      <div className="myslot-voice-summary-grid">
        {categories.map((category) => (
          <div
            aria-label={`${title} ${category.label}${category.rangeLabel ? ` ${category.rangeLabel}` : ""} ${category.count}回 全体の${category.percentageText}`}
            className="myslot-voice-summary-item"
            key={category.key}
            role="status"
          >
            <span className="myslot-voice-summary-label">{category.label}</span>
            <span className="myslot-voice-summary-value-row">
              <strong className="myslot-voice-summary-value">
                {category.percentageText}
              </strong>
              <span className="myslot-voice-summary-percentage">
                ({category.count}回)
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EstimationToggle({
  label,
  ariaLabel = label,
  checked,
  compact = false,
  onChange
}: {
  label: string;
  ariaLabel?: string;
  checked: boolean;
  compact?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={`light-rate-estimation-toggle${compact ? " light-rate-estimation-toggle-compact" : ""}`}
    >
      <input
        aria-label={ariaLabel}
        checked={checked}
        className="light-rate-estimation-input"
        role="switch"
        type="checkbox"
        onChange={(event) => onChange(event.currentTarget.checked)}
      />
      <span aria-hidden="true" className="light-rate-estimation-track" />
      <span className="light-rate-estimation-label">{label}</span>
      <strong className="light-rate-estimation-state">{checked ? "ON" : "OFF"}</strong>
    </label>
  );
}

function MyslotTrophySummaryBlock({
  categories,
  useForEstimation,
  onUseForEstimationChange
}: {
  categories: Array<{
    key: string;
    label: string;
    count: number;
  }>;
  useForEstimation: boolean;
  onUseForEstimationChange: (checked: boolean) => void;
}) {
  return (
    <div className="myslot-summary-block" data-myslot-summary="trophy">
      <div className="myslot-voice-summary-heading">
        <p className="myslot-voice-summary-title">サミートロフィー</p>
        <EstimationToggle
          ariaLabel="サミートロフィーを推測に使用"
          checked={useForEstimation}
          compact
          label="推測に使用"
          onChange={onUseForEstimationChange}
        />
      </div>
      <div className="myslot-voice-summary-grid">
        {categories.map((category) => (
          <div
            aria-label={`サミートロフィー ${category.label} ${category.count}`}
            className="myslot-voice-summary-item"
            key={category.key}
            role="status"
          >
            <span className="myslot-voice-summary-label">{category.label}</span>
            <strong className="myslot-voice-summary-value">{category.count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function MyslotItemLotterySummaryBlock({
  summary,
  useForEstimation,
  onUseForEstimationChange
}: {
  summary: {
    totalCount: number;
    tsuranukiCylinderCount: number;
    kurusuSwordCount: number;
    mumeiKendamaCount: number;
    smallLuckCount: number;
    mediumLuckCount: number;
    bigLuckCount: number;
    percentageText: string;
  };
  useForEstimation: boolean;
  onUseForEstimationChange: (checked: boolean) => void;
}) {
  const hintItems = [
    { key: "kurusu-sword", label: "来栖の刀", count: summary.kurusuSwordCount },
    { key: "mumei-kendama", label: "無名のけん玉", count: summary.mumeiKendamaCount },
    { key: "small-luck", label: "小吉", count: summary.smallLuckCount },
    { key: "medium-luck", label: "中吉", count: summary.mediumLuckCount },
    { key: "big-luck", label: "大吉", count: summary.bigLuckCount }
  ];

  return (
    <div className="myslot-summary-block" data-myslot-summary="item-lottery">
      <div className="myslot-voice-summary-heading">
        <p className="myslot-voice-summary-title">アイテムくじ</p>
        <div className="myslot-summary-heading-actions">
          <p className="myslot-voice-total">全体 {summary.totalCount}回</p>
          <EstimationToggle
            ariaLabel="アイテムくじを推測に使用"
            checked={useForEstimation}
            compact
            label="推測に使用"
            onChange={onUseForEstimationChange}
          />
        </div>
      </div>
      <div className="myslot-voice-summary-grid">
        <div
          aria-label={`アイテムくじ ツラヌキ筒 ${summary.tsuranukiCylinderCount}回 全体の${summary.percentageText}`}
          className="myslot-voice-summary-item"
          role="status"
        >
          <span className="myslot-voice-summary-label">ツラヌキ筒</span>
          <span className="myslot-voice-summary-value-row">
            <strong className="myslot-voice-summary-value">
              {summary.tsuranukiCylinderCount}回
            </strong>
            <span className="myslot-voice-summary-percentage">
              ({summary.percentageText})
            </span>
          </span>
        </div>
        {hintItems.map((item) => (
          <div
            aria-label={`アイテムくじ ${item.label} ${item.count}回`}
            className="myslot-voice-summary-item"
            key={item.key}
            role="status"
          >
            <span className="myslot-voice-summary-label">{item.label}</span>
            <strong className="myslot-voice-summary-value">{item.count}回</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function MyslotInput({
  value,
  onChange,
  useItemLottery,
  useTrophy,
  onUseItemLotteryChange,
  onUseTrophyChange
}: {
  value: string;
  onChange: (value: string) => void;
  useItemLottery: boolean;
  useTrophy: boolean;
  onUseItemLotteryChange: (checked: boolean) => void;
  onUseTrophyChange: (checked: boolean) => void;
}) {
  const trophySummary = parseMyslotTrophySummary(value);
  const characterSummary = parseMyslotCharacterSummary(value);
  const itemLotterySummary = parseMyslotItemLotterySummary(value);
  const voiceSummary = parseMyslotVoiceSummary(value);
  const isEmpty = value.trim() === "";
  const [clipboardMessage, setClipboardMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);
  const summaryStatuses = [
    { label: "サンド目停止時ボイス", summary: voiceSummary },
    { label: "キャラ紹介", summary: characterSummary },
    { label: "アイテムくじ", summary: itemLotterySummary },
    { label: "サミートロフィー", summary: trophySummary }
  ];

  const handleClipboardPaste = async () => {
    if (!navigator.clipboard?.readText) {
      setClipboardMessage({
        text: "このブラウザでは直接貼り付けできません。入力欄を長押しして貼り付けてください。",
        isError: true
      });
      return;
    }

    try {
      const clipboardText = await navigator.clipboard.readText();

      if (clipboardText.trim() === "") {
        setClipboardMessage({
          text: "クリップボードに文字がありません。現在の入力内容は変更していません。",
          isError: true
        });
        return;
      }

      onChange(clipboardText);
      setClipboardMessage({
        text: "クリップボードの内容でマイスロ入力欄を書き換えました。",
        isError: false
      });
    } catch {
      setClipboardMessage({
        text: "クリップボードを読み取れませんでした。貼り付けを許可するか、入力欄を長押しして貼り付けてください。",
        isError: true
      });
    }
  };

  return (
    <div className="myslot-voice-panel">
      <textarea
        aria-label="マイスロ入力欄"
        className="myslot-textarea"
        placeholder="マイスロの表示内容を貼り付けてください"
        spellCheck={false}
        value={value}
        onChange={(event) => {
          setClipboardMessage(null);
          onChange(event.currentTarget.value);
        }}
      />
      <div className="myslot-input-actions">
        <button
          aria-label="クリップボードからマイスロ内容を貼り付け"
          className="myslot-input-paste-button"
          type="button"
          onClick={handleClipboardPaste}
        >
          マイスロ貼り付け
        </button>
      </div>
      {clipboardMessage ? (
        <p
          aria-live="polite"
          className={`myslot-voice-message${clipboardMessage.isError ? " is-error" : ""}`}
          role={clipboardMessage.isError ? "alert" : "status"}
        >
          {clipboardMessage.text}
        </p>
      ) : null}
      <MyslotSummaryBlock
        summaryKey="voice"
        title="サンド目停止時ボイス"
        totalCount={voiceSummary.totalCount}
        categories={voiceSummary.categories}
      />
      <MyslotSummaryBlock
        summaryKey="character"
        title="キャラ紹介"
        totalCount={characterSummary.totalCount}
        categories={characterSummary.categories}
      />
      <MyslotItemLotterySummaryBlock
        onUseForEstimationChange={onUseItemLotteryChange}
        summary={itemLotterySummary}
        useForEstimation={useItemLottery}
      />
      <MyslotTrophySummaryBlock
        categories={trophySummary.categories}
        onUseForEstimationChange={onUseTrophyChange}
        useForEstimation={useTrophy}
      />
      {isEmpty ? (
        <p aria-live="polite" className="myslot-voice-message" role="status">
          マイスロの表示内容を貼り付けると自動で集計します。
        </p>
      ) : (
        summaryStatuses.map(({ label, summary }) => {
          const hasError = !summary.foundSection || summary.recognizedRowCount === 0;

          if (!hasError) {
            return null;
          }

          const statusText = !summary.foundSection
            ? `「${label}」が見つかりません。貼り付け範囲を確認してください。`
            : `${label}の回数が見つかりませんでした。`;

          return (
            <p
              aria-live="polite"
              className="myslot-voice-message is-error"
              key={label}
              role="status"
            >
              {statusText}
            </p>
          );
        })
      )}
    </div>
  );
}

function mergeKabaneriInputValues(
  slotValues: Array<Record<string, string>>,
  defaultMergedValues: Record<string, string>
) {
  const mergedHistory = slotValues
    .flatMap((values) => parseCharacterPointHistory(values.characterPointHistory ?? "[]"))
    .sort((first, second) => second.recordedAt - first.recordedAt);
  const mergedMyslotText = slotValues
    .map((values) => values.myslotText?.trim() ?? "")
    .filter((value) => value !== "")
    .join("\n\n");

  return {
    ...defaultMergedValues,
    useCharacterPointRate: slotValues.some(
      (values) => values.useCharacterPointRate === "1"
    )
      ? "1"
      : "0",
    useCharacterLightRate: slotValues.some(
      (values) => values.useCharacterLightRate === "1"
    )
      ? "1"
      : "0",
    useItemLottery: slotValues.some((values) => values.useItemLottery === "1")
      ? "1"
      : "0",
    useTrophy: slotValues.some((values) => values.useTrophy === "1") ? "1" : "0",
    characterPointHistory: JSON.stringify(mergedHistory),
    myslotText: mergedMyslotText
  };
}

function CharacterCzHistory({
  history,
  onDelete
}: {
  history: CharacterPointHistoryEntry[];
  onDelete: (index: number) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const alwaysVisibleCount = 5;
  const hiddenHistoryCount = Math.max(0, history.length - alwaysVisibleCount);
  const visibleHistory = isExpanded ? history : history.slice(0, alwaysVisibleCount);

  useEffect(() => {
    if (hiddenHistoryCount === 0 && isExpanded) {
      setIsExpanded(false);
    }
  }, [hiddenHistoryCount, isExpanded]);

  if (history.length === 0) {
    return <p className="character-cz-history-empty">当選履歴はまだありません。</p>;
  }

  return (
    <div className="character-cz-history-container">
      <div className="table-wrap character-cz-history-wrap">
        <table className="data-table data-table-compact character-cz-history-table">
          <thead>
            <tr>
              <th scope="col">回</th>
              <th scope="col">当選CZ</th>
              <th scope="col">獲得pt</th>
              <th scope="col">発光</th>
              <th scope="col">削除</th>
            </tr>
          </thead>
          <tbody>
            {visibleHistory.map((entry, index) => {
              const isAllStar = entry.kind === "all-star";
              const pointProgress = isAllStar
                ? null
                : calculateCharacterPointProgress(
                    entry.points,
                    CHARACTER_STANDARD_POINTS[entry.character]
                  );
              const lightRate = isAllStar
                ? null
                : calculateCharacterLightRate(entry.noLightCount, entry.withLightCount);
              const allStarMumeiLightRate = isAllStar
                ? calculateCharacterLightRate(
                    entry.counts.mumeiNoLightCount,
                    entry.counts.mumeiWithLightCount
                  )
                : null;
              const allStarIkomaLightRate = isAllStar
                ? calculateCharacterLightRate(
                    entry.counts.ikomaNoLightCount,
                    entry.counts.ikomaWithLightCount
                  )
                : null;
              const historyNumber = history.length - index;
              const historyLabel = isAllStar ? "オールスター" : `${entry.character}CZ`;

              return (
                <tr key={`${entry.recordedAt}-${entry.kind}-${index}`}>
                <th scope="row">{historyNumber}</th>
                <td>{historyLabel}</td>
                <td>
                  <span className="character-cz-history-value">
                    {isAllStar ? (
                      <>
                        <strong className="character-cz-history-main">対象外</strong>
                        <span className="character-cz-history-sub">（到達率）</span>
                      </>
                    ) : (
                      <>
                        <strong className="character-cz-history-main">{entry.points}pt</strong>
                        <span className="character-cz-history-sub">
                          ({pointProgress?.percentageText})
                        </span>
                      </>
                    )}
                  </span>
                </td>
                <td>
                  {isAllStar ? (
                    <span className="character-cz-history-value character-cz-history-value-all-star">
                      <span>
                        無名{allStarMumeiLightRate?.numerator}/
                        {allStarMumeiLightRate?.denominator}(
                        {allStarMumeiLightRate?.percentageText})
                      </span>
                      <span>
                        生駒{allStarIkomaLightRate?.numerator}/
                        {allStarIkomaLightRate?.denominator}(
                        {allStarIkomaLightRate?.percentageText})
                      </span>
                    </span>
                  ) : (
                    <span className="character-cz-history-value">
                      <strong className="character-cz-history-main">
                        {lightRate?.numerator}/{lightRate?.denominator}
                      </strong>
                      <span className="character-cz-history-sub">
                        ({lightRate?.percentageText})
                      </span>
                    </span>
                  )}
                </td>
                <td>
                  <button
                    aria-label={`${historyNumber}回目 ${historyLabel}の履歴を削除`}
                    className="character-cz-history-delete-button"
                    type="button"
                    onClick={() => onDelete(index)}
                  >
                    削除
                  </button>
                </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {hiddenHistoryCount > 0 ? (
        <button
          aria-expanded={isExpanded}
          className="character-cz-history-toggle-button"
          type="button"
          onClick={() => setIsExpanded((current) => !current)}
        >
          {isExpanded
            ? "過去の履歴を折りたたむ"
            : `過去の履歴を表示（残り${hiddenHistoryCount}件）`}
        </button>
      ) : null}
    </div>
  );
}

function CharacterSpecialPointControl({
  button,
  mumeiCount,
  ikomaCount,
  shared = false,
  onIncrement,
  onDecrement
}: {
  button: CharacterSpecialPointButton;
  mumeiCount: number;
  ikomaCount: number;
  shared?: boolean;
  onIncrement: (button: CharacterSpecialPointButton) => void;
  onDecrement: (button: CharacterSpecialPointButton) => void;
}) {
  const isAllStar = button.key === "all-star";
  const targetText = isAllStar
    ? "特殊CZ当選"
    : button.mumeiPointIncrement > 0 && button.ikomaPointIncrement > 0
      ? `無名と生駒に${button.points}ptずつ加算`
      : button.mumeiPointIncrement > 0
        ? `無名に${button.points}pt加算`
        : `生駒に${button.points}pt加算`;

  return (
    <div
      className={`character-special-point-control${shared ? " character-shared-point-control" : ""}`}
    >
      <button
        aria-label={`${button.label} 1回取り消し`}
        className="character-special-point-minus-button"
        disabled={mumeiCount <= 0 && ikomaCount <= 0}
        type="button"
        onClick={() => onDecrement(button)}
      >
        −
      </button>
      <button
        aria-label={`${button.label} ${targetText}`}
        className={`character-special-point-button character-special-point-button-${button.tone}`}
        type="button"
        onClick={() => onIncrement(button)}
      >
        <span className="character-special-point-button-name">{button.label}</span>
        <span className="character-special-point-button-points">
          {isAllStar ? "CZ当選" : `+${button.points}pt`}
        </span>
      </button>
    </div>
  );
}

function CharacterPointColumn({
  group,
  pointProgress,
  totalPointProgress,
  lightRate,
  getButtonCount,
  onIncrement,
  onDecrement
}: {
  group: CharacterPointGroup;
  pointProgress: ReturnType<typeof calculateCharacterPointProgress>;
  totalPointProgress: {
    percentageText: string;
    historyCount: number;
  };
  lightRate: ReturnType<typeof calculateCharacterLightRate>;
  getButtonCount: (countKey: CharacterPointCountKey) => number;
  onIncrement: (button: CharacterPointButton) => void;
  onDecrement: (button: CharacterPointButton) => void;
}) {
  const lightRatePercentageText =
    lightRate.denominator > 0 ? lightRate.percentageText : "0%";

  return (
    <div className="character-point-column">
      <div className="group-title-row">
        <p className="group-title">【{group.title}】</p>
      </div>
      <div className={`character-point-panel character-point-panel-${group.theme}`}>
        <div className="character-point-summary">
          <div
            aria-label={`${group.character}の現在のpt ${pointProgress.points}pt 到達率${pointProgress.percentageText}`}
            aria-live="polite"
            className="character-point-summary-item"
            role="status"
          >
            <span className="character-point-summary-label">現在のpt</span>
            <span className="character-point-summary-value-row">
              <strong className="character-point-summary-value">{pointProgress.points}</strong>
              <span className="character-point-summary-unit">pt</span>
              <span className="character-point-summary-detail">
                （{pointProgress.percentageText}）
              </span>
            </span>
          </div>
          <div
            aria-label={`${group.character}の平均到達率 ${totalPointProgress.percentageText} 履歴${totalPointProgress.historyCount}件`}
            aria-live="polite"
            className="character-point-summary-item character-point-summary-item-average"
            role="status"
          >
            <span className="character-point-summary-label">平均到達率</span>
            <span className="character-point-summary-value-row">
              <strong className="character-point-summary-value">
                {totalPointProgress.percentageText}
              </strong>
              <span className="character-point-summary-detail">
                （履歴:{totalPointProgress.historyCount}）
              </span>
            </span>
          </div>
          <div
            aria-label={`${group.character}の発光率 ${lightRatePercentageText} ${lightRate.numerator}/${lightRate.denominator}`}
            aria-live="polite"
            className="character-point-summary-item"
            role="status"
          >
            <span className="character-point-summary-label">発光率</span>
            <span className="character-point-summary-value-row">
              <strong className="character-point-summary-value">
                {lightRatePercentageText}
              </strong>
              <span className="character-point-summary-detail">
                （{lightRate.numerator}/{lightRate.denominator}）
              </span>
            </span>
          </div>
        </div>
        <div className="character-point-button-grid">
          {group.pointButtons.map((button) => {
            const buttonCount = getButtonCount(button.countKey);

            return (
              <div className="character-point-control" key={button.key}>
                <button
                  aria-label={`${group.character} ${button.label} 1回取り消し`}
                  className="character-point-minus-button"
                  disabled={buttonCount <= 0}
                  type="button"
                  onClick={() => onDecrement(button)}
                >
                  −
                </button>
                <button
                  aria-label={`${group.character} ${button.label} ${button.points}pt加算`}
                  className={`character-point-button character-point-button-${button.tone}`}
                  type="button"
                  onClick={() => onIncrement(button)}
                >
                  <span className="character-point-button-name">{button.label}</span>
                  <span className="character-point-button-points">+{button.points}pt</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Kabaneri2Page() {
  const [inputValues, setInputValues] = useState<Record<string, string>>(initialValues);
  const [estimateResult, setEstimateResult] = useState<EstimateResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasLoadedSavedValues, setHasLoadedSavedValues] = useState(false);
  const characterPointHistory = parseCharacterPointHistory(
    inputValues.characterPointHistory ?? "[]"
  );
  const useCharacterPointRate = inputValues.useCharacterPointRate === "1";
  const useCharacterLightRate = inputValues.useCharacterLightRate === "1";
  const useItemLottery = inputValues.useItemLottery === "1";
  const useTrophy = inputValues.useTrophy === "1";

  const resetResults = () => {
    setEstimateResult(null);
    setErrorMessage("");
  };

  const saveSlots = useSaveSlots({
    storageKey: STORAGE_KEY,
    inputValues,
    initialValues,
    isReady: hasLoadedSavedValues,
    mergeValues: mergeKabaneriInputValues,
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
        const nextValues = { ...initialValues };

        Object.entries(parsed).forEach(([key, value]) => {
          if (typeof value === "string" && key in nextValues) {
            nextValues[key] = value;
          }
        });

        setInputValues(nextValues);
      }
    } catch {
      // 端末内保存を読み込めない場合は初期値を使う
    }

    setHasLoadedSavedValues(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedSavedValues) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(inputValues));
  }, [hasLoadedSavedValues, inputValues]);

  const medalRentValue = toNumber(inputValues.medalRent ?? "");
  const exchangeRateValue = toNumber(inputValues.exchangeRate ?? "");
  const cashInvestmentValue = Math.max(0, toNumber(inputValues.cashInvestment ?? ""));
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
  const getCharacterPoints = (pointKey: CharacterPointGroup["pointKey"]) =>
    Math.max(0, Math.trunc(toNumber(inputValues[pointKey] ?? "0")));
  const getCharacterButtonCount = (countKey: CharacterPointCountKey) =>
    Math.max(0, Math.trunc(toNumber(inputValues[countKey] ?? "0")));
  const getCharacterSpecialButtonCount = (countKey?: CharacterSpecialPointCountKey) =>
    countKey
      ? Math.max(0, Math.trunc(toNumber(inputValues[countKey] ?? "0")))
      : 0;
  const getCharacterPointProgress = (group: CharacterPointGroup) => {
    const points = getCharacterPoints(group.pointKey);

    return calculateCharacterPointProgress(points, group.standardPoints);
  };
  const getCharacterTotalPointProgress = (group: CharacterPointGroup) => {
    const historyEntries = characterPointHistory.filter(
      (entry): entry is CharacterCzHistoryEntry =>
        entry.kind === "character" && entry.character === group.character
    );
    const historyCount = historyEntries.length;
    const percentage =
      historyCount > 0
        ? historyEntries.reduce(
            (sum, entry) =>
              sum +
              calculateCharacterPointProgress(entry.points, group.standardPoints)
                .percentage,
            0
          ) / historyCount
        : 0;

    return {
      percentage,
      percentageText: formatCharacterPointPercentage(percentage),
      historyCount
    };
  };
  const getCharacterLightRate = (group: CharacterPointGroup) => {
    const currentNoLightCount = Math.max(
      0,
      Math.trunc(toNumber(inputValues[group.noLightCountKey] ?? "0"))
    );
    const currentWithLightCount = Math.max(
      0,
      Math.trunc(toNumber(inputValues[group.withLightCountKey] ?? "0"))
    );
    const historyCounts = characterPointHistory.reduce(
      (totals, entry) => {
        if (entry.kind === "all-star") {
          if (group.character === "無名") {
            totals.noLightCount += entry.counts.mumeiNoLightCount;
            totals.withLightCount += entry.counts.mumeiWithLightCount;
          } else {
            totals.noLightCount += entry.counts.ikomaNoLightCount;
            totals.withLightCount += entry.counts.ikomaWithLightCount;
          }
        } else if (entry.character === group.character) {
          totals.noLightCount += entry.noLightCount;
          totals.withLightCount += entry.withLightCount;
        }

        return totals;
      },
      { noLightCount: 0, withLightCount: 0 }
    );

    return calculateCharacterLightRate(
      historyCounts.noLightCount + currentNoLightCount,
      historyCounts.withLightCount + currentWithLightCount
    );
  };

  const handleInputChange = (key: string, value: string) => {
    setInputValues((current) => ({
      ...current,
      [key]: value
    }));
    resetResults();
  };

  const handleCountInputStep = (key: string, step: -1 | 1) => {
    const currentValue = Math.max(0, Math.floor(toNumber(inputValues[key] ?? "")));

    if (step === -1 && currentValue === 0) {
      return;
    }

    handleInputChange(key, String(currentValue + step));
  };

  const handleCharacterPointIncrement = (
    group: CharacterPointGroup,
    button: CharacterPointButton
  ) => {
    setInputValues((current) => {
      return {
        ...current,
        [group.pointKey]: String(
          Math.max(0, Math.trunc(toNumber(current[group.pointKey] ?? "0"))) + button.points
        ),
        [button.countKey]: String(
          Math.max(0, Math.trunc(toNumber(current[button.countKey] ?? "0"))) + 1
        )
      };
    });
  };

  const handleCharacterPointDecrement = (
    group: CharacterPointGroup,
    button: CharacterPointButton
  ) => {
    setInputValues((current) => {
      const buttonCount = Math.max(
        0,
        Math.trunc(toNumber(current[button.countKey] ?? "0"))
      );

      if (buttonCount <= 0) {
        return current;
      }

      return {
        ...current,
        [group.pointKey]: String(
          Math.max(
            0,
            Math.trunc(toNumber(current[group.pointKey] ?? "0")) - button.points
          )
        ),
        [button.countKey]: String(buttonCount - 1)
      };
    });
  };

  const handleSpecialPointIncrement = (button: CharacterSpecialPointButton) => {
    if (button.key === "all-star") {
      setInputValues((current) => {
        const counts = Object.fromEntries(
          ALL_STAR_RESET_COUNT_KEYS.map((key) => [
            key,
            Math.max(0, Math.trunc(toNumber(current[key] ?? "0")))
          ])
        ) as Record<AllStarResetCountKey, number>;
        const historyEntry: AllStarHistoryEntry = {
          kind: "all-star",
          mumeiPoints: Math.max(0, Math.trunc(toNumber(current.mumeiPoints ?? "0"))),
          ikomaPoints: Math.max(0, Math.trunc(toNumber(current.ikomaPoints ?? "0"))),
          counts,
          recordedAt: Date.now()
        };
        const currentHistory = parseCharacterPointHistory(
          current.characterPointHistory ?? "[]"
        );
        const nextValues: Record<string, string> = {
          ...current,
          mumeiPoints: "0",
          ikomaPoints: "0",
          characterPointHistory: JSON.stringify([historyEntry, ...currentHistory])
        };

        ALL_STAR_RESET_COUNT_KEYS.forEach((key) => {
          nextValues[key] = "0";
        });

        return nextValues;
      });
      resetResults();
      return;
    }

    setInputValues((current) => {
      const nextValues: Record<string, string> = {
        ...current,
        mumeiPoints: String(
          Math.max(0, Math.trunc(toNumber(current.mumeiPoints ?? "0"))) +
            button.mumeiPointIncrement
        ),
        ikomaPoints: String(
          Math.max(0, Math.trunc(toNumber(current.ikomaPoints ?? "0"))) +
            button.ikomaPointIncrement
        )
      };

      if (button.mumeiCountKey) {
        nextValues[button.mumeiCountKey] = String(
          Math.max(0, Math.trunc(toNumber(current[button.mumeiCountKey] ?? "0"))) + 1
        );
      }

      if (button.ikomaCountKey) {
        nextValues[button.ikomaCountKey] = String(
          Math.max(0, Math.trunc(toNumber(current[button.ikomaCountKey] ?? "0"))) + 1
        );
      }

      return nextValues;
    });
  };

  const handleSpecialPointDecrement = (button: CharacterSpecialPointButton) => {
    setInputValues((current) => {
      if (button.key === "all-star") {
        const currentHistory = parseCharacterPointHistory(
          current.characterPointHistory ?? "[]"
        );
        const latestHistory = currentHistory[0];

        if (latestHistory?.kind === "all-star") {
          const nextValues: Record<string, string> = {
            ...current,
            mumeiPoints: String(
              Math.max(0, Math.trunc(toNumber(current.mumeiPoints ?? "0"))) +
                latestHistory.mumeiPoints
            ),
            ikomaPoints: String(
              Math.max(0, Math.trunc(toNumber(current.ikomaPoints ?? "0"))) +
                latestHistory.ikomaPoints
            ),
            characterPointHistory: JSON.stringify(currentHistory.slice(1))
          };

          ALL_STAR_RESET_COUNT_KEYS.forEach((key) => {
            nextValues[key] = String(
              Math.max(0, Math.trunc(toNumber(current[key] ?? "0"))) +
                latestHistory.counts[key]
            );
          });

          return nextValues;
        }
      }

      const mumeiCount = button.mumeiCountKey
        ? Math.max(0, Math.trunc(toNumber(current[button.mumeiCountKey] ?? "0")))
        : 0;
      const ikomaCount = button.ikomaCountKey
        ? Math.max(0, Math.trunc(toNumber(current[button.ikomaCountKey] ?? "0")))
        : 0;

      if (mumeiCount <= 0 && ikomaCount <= 0) {
        return current;
      }

      const nextValues: Record<string, string> = {
        ...current,
        mumeiPoints: String(
          Math.max(
            0,
            Math.trunc(toNumber(current.mumeiPoints ?? "0")) -
              (mumeiCount > 0 ? button.mumeiPointIncrement : 0)
          )
        ),
        ikomaPoints: String(
          Math.max(
            0,
            Math.trunc(toNumber(current.ikomaPoints ?? "0")) -
              (ikomaCount > 0 ? button.ikomaPointIncrement : 0)
          )
        )
      };

      if (button.mumeiCountKey && mumeiCount > 0) {
        nextValues[button.mumeiCountKey] = String(mumeiCount - 1);
      }

      if (button.ikomaCountKey && ikomaCount > 0) {
        nextValues[button.ikomaCountKey] = String(ikomaCount - 1);
      }

      return nextValues;
    });
    resetResults();
  };

  const handleCharacterCzWin = (group: CharacterPointGroup) => {
    setInputValues((current) => {
      const historyEntry: CharacterPointHistoryEntry = {
        kind: "character",
        character: group.character,
        points: Math.max(0, Math.trunc(toNumber(current[group.pointKey] ?? "0"))),
        noLightCount: Math.max(
          0,
          Math.trunc(toNumber(current[group.noLightCountKey] ?? "0"))
        ),
        withLightCount: Math.max(
          0,
          Math.trunc(toNumber(current[group.withLightCountKey] ?? "0"))
        ),
        recordedAt: Date.now()
      };
      const currentHistory = parseCharacterPointHistory(
        current.characterPointHistory ?? "[]"
      );

      const nextValues = {
        ...current,
        [group.pointKey]: "0",
        characterPointHistory: JSON.stringify([historyEntry, ...currentHistory])
      };

      group.pointButtons.forEach((button) => {
        nextValues[button.countKey] = "0";
      });

      if (group.character === "無名") {
        nextValues.mumeiKabaneSpecialCount = "0";
        nextValues.mumeiIkomaMumeiSpecialCount = "0";
        nextValues.allStarMumeiSpecialCount = "0";
      } else {
        nextValues.kabaneIkomaSpecialCount = "0";
        nextValues.mumeiIkomaSpecialCount = "0";
        nextValues.allStarIkomaSpecialCount = "0";
      }

      return nextValues;
    });
    resetResults();
  };

  const handleCharacterHistoryDelete = (index: number) => {
    setInputValues((current) => {
      const currentHistory = parseCharacterPointHistory(
        current.characterPointHistory ?? "[]"
      );

      return {
        ...current,
        characterPointHistory: JSON.stringify(
          currentHistory.filter((_entry, historyIndex) => historyIndex !== index)
        )
      };
    });
    resetResults();
  };

  const handleEstimate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetResults();

    const beforeGamesRaw = inputValues.beforeGames ?? "";
    const currentGamesRaw = inputValues.currentGames ?? "";
    const lowerBellsRaw = inputValues.lowerBells ?? "";
    const beforeGames = toNumber(beforeGamesRaw);
    const currentGames = toNumber(currentGamesRaw);
    const practiceLowerBells = toNumber(lowerBellsRaw);
    const hasPracticeGames = currentGamesRaw.trim() !== "";
    const hasLowerBellCountInput = lowerBellsRaw.trim() !== "";
    const cycle3TrialsRaw = inputValues.cycle3Trials ?? "";
    const cycle3HitsRaw = inputValues.cycle3Hits ?? "";
    const cycle4TrialsRaw = inputValues.cycle4Trials ?? "";
    const cycle4HitsRaw = inputValues.cycle4Hits ?? "";
    const cycle3Trials = toNumber(cycle3TrialsRaw);
    const cycle3Hits = toNumber(cycle3HitsRaw);
    const cycle4Trials = toNumber(cycle4TrialsRaw);
    const cycle4Hits = toNumber(cycle4HitsRaw);
    const hasCycle3Input = cycle3TrialsRaw.trim() !== "" || cycle3HitsRaw.trim() !== "";
    const hasCycle4Input = cycle4TrialsRaw.trim() !== "" || cycle4HitsRaw.trim() !== "";
    const myslotCharacterSummary = parseMyslotCharacterSummary(inputValues.myslotText ?? "");
    const myslotVoiceSummary = parseMyslotVoiceSummary(inputValues.myslotText ?? "");
    const myslotTrophySummary = parseMyslotTrophySummary(inputValues.myslotText ?? "");
    const myslotItemLotterySummary = parseMyslotItemLotterySummary(
      inputValues.myslotText ?? ""
    );
    const trophyMinimumSetting = myslotTrophySummary.minimumSetting;
    const hasTrophyInput = trophyMinimumSetting > 0;
    const tsuranukiCylinderCount = myslotItemLotterySummary.tsuranukiCylinderCount;
    const kurusuSwordCount = myslotItemLotterySummary.kurusuSwordCount;
    const mumeiKendamaCount = myslotItemLotterySummary.mumeiKendamaCount;
    const smallLuckCount = myslotItemLotterySummary.smallLuckCount;
    const mediumLuckCount = myslotItemLotterySummary.mediumLuckCount;
    const bigLuckCount = myslotItemLotterySummary.bigLuckCount;
    const itemLotteryTotal = myslotItemLotterySummary.totalCount;
    const hasItemLotteryInput = itemLotteryTotal > 0;
    const hasItemLotteryConfirmationInput =
      kurusuSwordCount > 0 ||
      mumeiKendamaCount > 0 ||
      smallLuckCount > 0 ||
      mediumLuckCount > 0 ||
      bigLuckCount > 0;
    const isItemLotterySettingAllowed = (settingNumber: number) => {
      if (kurusuSwordCount > 0 && settingNumber === 2) return false;
      if (mumeiKendamaCount > 0 && settingNumber === 1) return false;
      if (smallLuckCount > 0 && settingNumber < 2) return false;
      if (mediumLuckCount > 0 && settingNumber < 4) return false;
      if (bigLuckCount > 0 && settingNumber < 6) return false;
      return true;
    };
    const femaleCharacterCount =
      myslotCharacterSummary.categories.find((category) => category.key === "femaleCharacter")
        ?.count ?? 0;
    const maleCharacterCount =
      myslotCharacterSummary.categories.find((category) => category.key === "maleCharacter")
        ?.count ?? 0;
    const characterGenderTotal = femaleCharacterCount + maleCharacterCount;
    const hasCharacterGenderInput = characterGenderTotal > 0;
    const bibaCount =
      myslotCharacterSummary.categories.find((category) => category.key === "biba")?.count ?? 0;
    const hasCharacterConfirmationInput = bibaCount > 0;
    const femaleVoiceCount =
      myslotVoiceSummary.categories.find((category) => category.key === "female")?.count ?? 0;
    const maleVoiceCount =
      myslotVoiceSummary.categories.find((category) => category.key === "male")?.count ?? 0;
    const voiceGenderTotal = femaleVoiceCount + maleVoiceCount;
    const hasVoiceGenderInput = voiceGenderTotal > 0;
    const no3VoiceCount =
      myslotVoiceSummary.categories.find((category) => category.key === "no3")?.count ?? 0;
    const no20VoiceCount =
      myslotVoiceSummary.categories.find((category) => category.key === "no20")?.count ?? 0;
    const voiceConfirmationMinimumSetting = no20VoiceCount > 0 ? 5 : no3VoiceCount > 0 ? 2 : 0;
    const hasVoiceConfirmationInput = voiceConfirmationMinimumSetting > 0;
    const kageyukiVoiceCount = myslotVoiceSummary.categories.reduce(
      (sum, category) =>
        category.key === "no17" || category.key === "no18" || category.key === "no19"
          ? sum + category.count
          : sum,
      0
    );
    const allVoiceCount = myslotVoiceSummary.totalCount;
    const hasKageyukiVoiceInput = allVoiceCount > 0;
    const kageyukiVoicePercentageText = hasKageyukiVoiceInput
      ? `${((kageyukiVoiceCount / allVoiceCount) * 100).toFixed(1)}%`
      : "0.0%";
    const characterPointObservations = characterPointGroups.map((group) => {
      const totalPointProgress = getCharacterTotalPointProgress(group);

      return {
        character: group.character,
        ...totalPointProgress,
        likelihoodRate: Math.min(totalPointProgress.percentage, 100) / 100,
        likelihoodSampleCount: totalPointProgress.historyCount,
        hasInput: totalPointProgress.historyCount > 0
      };
    });
    const hasCharacterPointInput = characterPointObservations.some(
      (observation) => observation.hasInput
    );
    const characterLightObservations = characterPointGroups.map((group) => {
      const lightRate = getCharacterLightRate(group);

      return {
        character: group.character,
        ...lightRate,
        hasInput: lightRate.denominator > 0
      };
    });
    const hasCharacterLightInput = characterLightObservations.some(
      (observation) => observation.hasInput
    );
    const allCounts = [
      beforeGames,
      currentGames,
      practiceLowerBells,
      cycle3Trials,
      cycle3Hits,
      cycle4Trials,
      cycle4Hits
    ];

    if (allCounts.some((value) => value < 0 || !Number.isInteger(value))) {
      setErrorMessage("G数、下段ベル、周期の試行・当選は0以上の整数で入力してください。");
      return;
    }

    const practiceGames = hasPracticeGames ? currentGames - beforeGames : 0;
    const hasLowerBellInput = hasPracticeGames && hasLowerBellCountInput;

    if (hasPracticeGames && practiceGames <= 0) {
      setErrorMessage("現在のG数は開始前のG数より大きい値を入力してください。");
      return;
    }

    if (hasLowerBellInput && practiceLowerBells > practiceGames) {
      setErrorMessage("下段ベルの実践回数は実践G数以下にしてください。");
      return;
    }

    if (hasCycle3Input && cycle3Trials <= 0) {
      setErrorMessage("3周期目の試行には1以上を入力してください。");
      return;
    }

    if (hasCycle4Input && cycle4Trials <= 0) {
      setErrorMessage("4周期目の試行には1以上を入力してください。");
      return;
    }

    if (cycle3Hits > cycle3Trials) {
      setErrorMessage("3周期目の当選は試行以下にしてください。");
      return;
    }

    if (cycle4Hits > cycle4Trials) {
      setErrorMessage("4周期目の当選は試行以下にしてください。");
      return;
    }

    if (
      !hasLowerBellInput &&
      !hasCycle3Input &&
      !hasCycle4Input &&
      !(useTrophy && hasTrophyInput) &&
      !(useItemLottery && hasItemLotteryInput) &&
      !hasVoiceConfirmationInput &&
      !hasKageyukiVoiceInput &&
      !hasVoiceGenderInput &&
      !hasCharacterConfirmationInput &&
      !hasCharacterGenderInput &&
      !(useCharacterLightRate && hasCharacterLightInput) &&
      !(useCharacterPointRate && hasCharacterPointInput)
    ) {
      const hasDisabledSelectableInput =
        (!useTrophy && hasTrophyInput) ||
        (!useItemLottery && hasItemLotteryInput) ||
        (!useCharacterLightRate && hasCharacterLightInput) ||
        (!useCharacterPointRate && hasCharacterPointInput);

      setErrorMessage(
        hasDisabledSelectableInput
          ? "入力済みの項目を推測に使う場合は、対応する「推測に使用」をONにしてください。"
          : "推測に使うpt・発光カウント、CZ当選履歴、マイスロ、周期当選、またはG数と下段ベルを入力してください。"
      );
      return;
    }

    const logRows = settings.map((setting, settingIndex) => ({
      label: setting.label,
      logValue:
        (useTrophy && hasTrophyInput && settingIndex + 1 < trophyMinimumSetting
          ? Number.NEGATIVE_INFINITY
          : 0) +
        (hasVoiceConfirmationInput && settingIndex + 1 < voiceConfirmationMinimumSetting
          ? Number.NEGATIVE_INFINITY
          : 0) +
        (hasCharacterConfirmationInput && settingIndex + 1 < 4
          ? Number.NEGATIVE_INFINITY
          : 0) +
        (useItemLottery &&
          hasItemLotteryConfirmationInput &&
          !isItemLotterySettingAllowed(settingIndex + 1)
          ? Number.NEGATIVE_INFINITY
          : 0) +
        (hasLowerBellInput
          ? calculateLogBinomialProbability(
              practiceLowerBells,
              practiceGames,
              1 / setting.lowerBellDenominator
            )
          : 0) +
        (hasCycle3Input
          ? calculateLogBinomialProbability(cycle3Hits, cycle3Trials, setting.cycle3Rate)
          : 0) +
        (hasCycle4Input
          ? calculateLogBinomialProbability(cycle4Hits, cycle4Trials, setting.cycle4Rate)
          : 0) +
        (useItemLottery && hasItemLotteryInput
          ? calculateLogBinomialProbability(
              tsuranukiCylinderCount,
              itemLotteryTotal,
              setting.tsuranukiCylinderRate
            )
          : 0) +
        (hasKageyukiVoiceInput
          ? calculateLogBinomialProbability(
              kageyukiVoiceCount,
              allVoiceCount,
              setting.kageyukiVoiceRate
            )
          : 0) +
        (hasVoiceGenderInput
          ? calculateLogBinomialProbability(
              femaleVoiceCount,
              voiceGenderTotal,
              setting.voiceFemaleRate
            )
          : 0) +
        (hasCharacterGenderInput
          ? calculateLogBinomialProbability(
              femaleCharacterCount,
              characterGenderTotal,
              setting.characterFemaleRate
            )
          : 0) +
        (useCharacterPointRate
          ? characterPointObservations.reduce(
              (logValue, observation) =>
                logValue +
                (observation.hasInput
                  ? calculateLogRateSampleProbability(
                      observation.likelihoodRate,
                      observation.likelihoodSampleCount,
                      getCharacterPointReachProbability(setting, observation.character)
                    )
                  : 0),
              0
            )
          : 0) +
        (useCharacterLightRate
          ? characterLightObservations.reduce(
              (logValue, observation) =>
                logValue +
                (observation.hasInput
                  ? calculateLogBinomialProbability(
                      observation.numerator,
                      observation.denominator,
                      setting.characterLightRate
                    )
                  : 0),
              0
            )
          : 0)
    }));
    const maxLogValue = Math.max(...logRows.map((row) => row.logValue));
    const scaledRows = logRows.map((row) => ({
      label: row.label,
      weight: Math.exp(row.logValue - maxLogValue)
    }));
    const totalWeight = scaledRows.reduce((sum, row) => sum + row.weight, 0);
    const probabilities = scaledRows.map((row) =>
      totalWeight > 0 ? row.weight / totalWeight : 0
    );

    const medalRent = toNumber(inputValues.medalRent ?? "");
    const exchangeRate = toNumber(inputValues.exchangeRate ?? "");
    const cashInvestment = Math.max(0, toNumber(inputValues.cashInvestment ?? ""));
    const yenPerMedal = exchangeRate > 0 ? 100 / exchangeRate : 0;
    const cashGapLoss =
      medalRent > 0 && exchangeRate > 0
        ? cashInvestment * (1 - (medalRent * yenPerMedal) / 1000)
        : 0;
    const settingExpectations = settings.map((setting) => {
      const payoutRate = setting.payout / 100;

      return hasPracticeGames
        ? practiceGames * 3 * yenPerMedal * (payoutRate - 1) - cashGapLoss
        : 0;
    });
    const totalExpectedYen = settingExpectations.reduce(
      (sum, expectedYen, index) => sum + expectedYen * probabilities[index],
      0
    );
    const totalExpectedPayout = settings.reduce(
      (sum, setting, index) => sum + setting.payout * probabilities[index],
      0
    );
    const expectedHourlyYen = hasPracticeGames
      ? (totalExpectedYen * 700) / practiceGames
      : 700 * 3 * yenPerMedal * (totalExpectedPayout / 100 - 1);
    const lowerBellProbabilities = hasLowerBellInput
      ? calculateSettingProbabilities(
          practiceLowerBells,
          practiceGames,
          (setting) => 1 / setting.lowerBellDenominator
        )
      : null;
    const cycle3Probabilities = hasCycle3Input
      ? calculateSettingProbabilities(cycle3Hits, cycle3Trials, (setting) => setting.cycle3Rate)
      : null;
    const cycle4Probabilities = hasCycle4Input
      ? calculateSettingProbabilities(cycle4Hits, cycle4Trials, (setting) => setting.cycle4Rate)
      : null;
    const voiceGenderProbabilities = hasVoiceGenderInput
      ? calculateSettingProbabilities(
          femaleVoiceCount,
          voiceGenderTotal,
          (setting) => setting.voiceFemaleRate
        )
      : null;
    const characterGenderProbabilities = hasCharacterGenderInput
      ? calculateSettingProbabilities(
          femaleCharacterCount,
          characterGenderTotal,
          (setting) => setting.characterFemaleRate
        )
      : null;
    const itemLotteryProbabilities = hasItemLotteryInput
      ? calculateSettingProbabilities(
          tsuranukiCylinderCount,
          itemLotteryTotal,
          (setting) => setting.tsuranukiCylinderRate
        )
      : null;
    const itemLotteryAllowedSettingCount = settings.filter((_setting, settingIndex) =>
      isItemLotterySettingAllowed(settingIndex + 1)
    ).length;
    const itemLotteryConfirmationProbabilities = hasItemLotteryConfirmationInput
      ? settings.map((_setting, settingIndex) =>
          isItemLotterySettingAllowed(settingIndex + 1)
            ? 1 / itemLotteryAllowedSettingCount
            : 0
        )
      : null;
    const itemLotteryConfirmationSummaryText = [
      kurusuSwordCount > 0 ? `来栖の刀 ${kurusuSwordCount}回 (設定2否定)` : "",
      mumeiKendamaCount > 0 ? `無名のけん玉 ${mumeiKendamaCount}回 (設定1否定)` : "",
      smallLuckCount > 0 ? `小吉 ${smallLuckCount}回 (設定2以上確定)` : "",
      mediumLuckCount > 0 ? `中吉 ${mediumLuckCount}回 (設定4以上確定)` : "",
      bigLuckCount > 0 ? `大吉 ${bigLuckCount}回 (設定6確定)` : ""
    ]
      .filter((value) => value !== "")
      .join("・");
    const voiceConfirmationProbabilities = hasVoiceConfirmationInput
      ? settings.map((_setting, settingIndex) =>
          settingIndex + 1 >= voiceConfirmationMinimumSetting
            ? 1 / (7 - voiceConfirmationMinimumSetting)
            : 0
        )
      : null;
    const kageyukiVoiceProbabilities = hasKageyukiVoiceInput
      ? calculateSettingProbabilities(
          kageyukiVoiceCount,
          allVoiceCount,
          (setting) => setting.kageyukiVoiceRate
        )
      : null;
    const voiceConfirmationSummaryText = [
      no3VoiceCount > 0 ? `No.3 ${no3VoiceCount}回` : "",
      no20VoiceCount > 0 ? `ボイス無し ${no20VoiceCount}回` : ""
    ]
      .filter((value) => value !== "")
      .join("・");
    const characterConfirmationProbabilities = hasCharacterConfirmationInput
      ? settings.map((_setting, settingIndex) => (settingIndex + 1 >= 4 ? 1 / 3 : 0))
      : null;
    const trophyProbabilities = hasTrophyInput
      ? settings.map((_setting, settingIndex) =>
          settingIndex + 1 >= trophyMinimumSetting ? 1 / (7 - trophyMinimumSetting) : 0
        )
      : null;
    const trophySummaryText = myslotTrophySummary.categories
      .filter((category) => category.count > 0)
      .map((category) => `${category.label}${category.count}`)
      .join("・");
    const characterPointDetailColumns = characterPointObservations.map<DetailColumn>(
      (observation) => ({
        label: observation.character,
        summaryText: observation.hasInput
          ? `履歴${observation.historyCount}件の平均 (${observation.percentageText})`
          : "未集計",
        values: observation.hasInput
          ? calculateRateSampleSettingProbabilities(
              observation.likelihoodRate,
              observation.likelihoodSampleCount,
              (setting) =>
                getCharacterPointReachProbability(setting, observation.character)
            ).map(formatPercent)
          : settings.map(() => "-")
      })
    );
    const characterLightDetailColumns = characterLightObservations.map<DetailColumn>(
      (observation) => ({
        label: observation.character,
        summaryText: observation.hasInput
          ? `${observation.numerator}/${observation.denominator} (${observation.percentageText})`
          : "未集計",
        values: observation.hasInput
          ? calculateSettingProbabilities(
              observation.numerator,
              observation.denominator,
              (setting) => setting.characterLightRate
            ).map(formatPercent)
          : settings.map(() => "-")
      })
    );

    setEstimateResult({
      hasPracticeGames,
      hasLowerBellInput,
      practiceGames,
      practiceLowerBells,
      measuredRateText: hasLowerBellInput
        ? formatMeasuredRate(practiceLowerBells, practiceGames)
        : "未入力",
      settingRows: settings.map((setting, index) => ({
        label: setting.label,
        value: formatPercent(probabilities[index])
      })),
      expectationRows: settings.map((setting, index) => ({
        label: setting.label,
        payoutText: `${setting.payout.toFixed(1)}%`,
        expectationText: hasPracticeGames ? formatYen(settingExpectations[index]) : "-",
        probabilityText: formatPercent(probabilities[index]),
        weightedText: hasPracticeGames
          ? formatYen(settingExpectations[index] * probabilities[index])
          : "-"
      })),
      totalPayoutText: `${totalExpectedPayout.toFixed(2)}%`,
      totalExpectationText: hasPracticeGames ? formatYen(totalExpectedYen) : "-",
      hourlyText: formatHourlyYen(expectedHourlyYen),
      detailGroups: [
        {
          title: "小役",
          columns: [
            {
              label: "下段ベル",
              summaryText: hasLowerBellInput
                ? `${practiceLowerBells}回 (${formatMeasuredRate(
                    practiceLowerBells,
                    practiceGames
                  )})`
                : "未入力",
              values: lowerBellProbabilities
                ? lowerBellProbabilities.map(formatPercent)
                : settings.map(() => "-")
            }
          ]
        },
        {
          title: "周期当選",
          columns: [
            {
              label: "3周期目",
              summaryText: hasCycle3Input
                ? formatCycleSummary(cycle3Hits, cycle3Trials)
                : "未入力",
              values: cycle3Probabilities
                ? cycle3Probabilities.map(formatPercent)
                : settings.map(() => "-")
            },
            {
              label: "4周期目",
              summaryText: hasCycle4Input
                ? formatCycleSummary(cycle4Hits, cycle4Trials)
                : "未入力",
              values: cycle4Probabilities
                ? cycle4Probabilities.map(formatPercent)
                : settings.map(() => "-")
            }
          ]
        },
        {
          title: "サミートロフィー",
          columns: [
            {
              label: "確定示唆",
              summaryText: hasTrophyInput
                ? `${trophySummaryText} (${trophyMinimumSetting === 6 ? "設定6確定" : `設定${trophyMinimumSetting}以上確定`})`
                : "未集計",
              values: trophyProbabilities
                ? trophyProbabilities.map(formatPercent)
                : settings.map(() => "-")
            }
          ]
        },
        {
          title: "アイテムくじ",
          columns: [
            {
              label: "ツラヌキ筒",
              summaryText: hasItemLotteryInput
                ? `${tsuranukiCylinderCount}/${itemLotteryTotal} (${myslotItemLotterySummary.percentageText})`
                : "未入力",
              values: itemLotteryProbabilities
                ? itemLotteryProbabilities.map(formatPercent)
                : settings.map(() => "-")
            },
            {
              label: "確定示唆",
              summaryText: hasItemLotteryConfirmationInput
                ? itemLotteryConfirmationSummaryText
                : "未集計",
              values: itemLotteryConfirmationProbabilities
                ? itemLotteryConfirmationProbabilities.map(formatPercent)
                : settings.map(() => "-")
            }
          ]
        },
        {
          title: "サンド目停止ボイス",
          columns: [
            {
              label: "確定示唆",
              summaryText: hasVoiceConfirmationInput
                ? `${voiceConfirmationSummaryText} (設定${voiceConfirmationMinimumSetting}以上確定)`
                : "未集計",
              values: voiceConfirmationProbabilities
                ? voiceConfirmationProbabilities.map(formatPercent)
                : settings.map(() => "-")
            },
            {
              label: "景行ボイス",
              summaryText: hasKageyukiVoiceInput
                ? `${kageyukiVoiceCount}/${allVoiceCount} (${kageyukiVoicePercentageText})`
                : "未入力",
              values: kageyukiVoiceProbabilities
                ? kageyukiVoiceProbabilities.map(formatPercent)
                : settings.map(() => "-")
            },
            {
              label: "男女比",
              summaryText: hasVoiceGenderInput
                ? formatGenderSummary(femaleVoiceCount, voiceGenderTotal)
                : "未入力",
              values: voiceGenderProbabilities
                ? voiceGenderProbabilities.map(formatPercent)
                : settings.map(() => "-")
            }
          ]
        },
        {
          title: "キャラ紹介",
          columns: [
            {
              label: "男女比",
              summaryText: hasCharacterGenderInput
                ? formatGenderSummary(femaleCharacterCount, characterGenderTotal)
                : "未入力",
              values: characterGenderProbabilities
                ? characterGenderProbabilities.map(formatPercent)
                : settings.map(() => "-")
            },
            {
              label: "確定示唆",
              summaryText: hasCharacterConfirmationInput
                ? `美馬 ${bibaCount}回 (設定4以上確定)`
                : "未集計",
              values: characterConfirmationProbabilities
                ? characterConfirmationProbabilities.map(formatPercent)
                : settings.map(() => "-")
            }
          ]
        },
        {
          title: "平均到達率",
          columns: characterPointDetailColumns
        },
        {
          title: "発光率",
          columns: characterLightDetailColumns
        }
      ]
    });
  };

  return (
    <main className="page-shell">
      <div className="card card-wide">
        <MachinePageHeader
          title="Lカバネリ 海門決戦"
          onClear={saveSlots.onClearCurrentData}
          onClearAll={saveSlots.onClearAllData}
        />
        <form className="input-form" onSubmit={handleEstimate}>
          <AutoEstimate inputValues={inputValues} isReady={hasLoadedSavedValues} />
          <div className="kabaneri-input-layout">
            <section className="input-group character-points-group">
              <div className="character-point-columns-grid">
                {characterPointGroups.map((group) => {
                  const lightRate = getCharacterLightRate(group);
                  const pointProgress = getCharacterPointProgress(group);
                  const totalPointProgress = getCharacterTotalPointProgress(group);

                  return (
                    <CharacterPointColumn
                      getButtonCount={getCharacterButtonCount}
                      group={group}
                      key={group.character}
                      lightRate={lightRate}
                      onDecrement={(button) =>
                        handleCharacterPointDecrement(group, button)
                      }
                      onIncrement={(button) =>
                        handleCharacterPointIncrement(group, button)
                      }
                      pointProgress={pointProgress}
                      totalPointProgress={totalPointProgress}
                    />
                  );
                })}
                {[CHARACTER_SPECIAL_POINT_BUTTONS.mumeiIkoma].map((button) => (
                  <CharacterSpecialPointControl
                    button={button}
                    ikomaCount={getCharacterSpecialButtonCount(button.ikomaCountKey)}
                    key={button.key}
                    mumeiCount={getCharacterSpecialButtonCount(button.mumeiCountKey)}
                    onDecrement={handleSpecialPointDecrement}
                    onIncrement={handleSpecialPointIncrement}
                    shared
                  />
                ))}
                <div className="character-special-point-row">
                  {characterPointGroups.map((group) => {
                    const specialButton =
                      group.character === "無名"
                        ? CHARACTER_SPECIAL_POINT_BUTTONS.mumeiKabane
                        : CHARACTER_SPECIAL_POINT_BUTTONS.kabaneIkoma;

                    return (
                      <CharacterSpecialPointControl
                        button={specialButton}
                        ikomaCount={getCharacterSpecialButtonCount(
                          specialButton.ikomaCountKey
                        )}
                        key={specialButton.key}
                        mumeiCount={getCharacterSpecialButtonCount(
                          specialButton.mumeiCountKey
                        )}
                        onDecrement={handleSpecialPointDecrement}
                        onIncrement={handleSpecialPointIncrement}
                      />
                    );
                  })}
                </div>
                {[CHARACTER_SPECIAL_POINT_BUTTONS.allStar].map((button) => {
                  const allStarUndoCount =
                    characterPointHistory[0]?.kind === "all-star"
                      ? 1
                      : 0;

                  return (
                    <CharacterSpecialPointControl
                      button={button}
                      ikomaCount={Math.max(
                        allStarUndoCount,
                        getCharacterSpecialButtonCount(button.ikomaCountKey)
                      )}
                      key={button.key}
                      mumeiCount={Math.max(
                        allStarUndoCount,
                        getCharacterSpecialButtonCount(button.mumeiCountKey)
                      )}
                      onDecrement={handleSpecialPointDecrement}
                      onIncrement={handleSpecialPointIncrement}
                      shared
                    />
                  );
                })}
                <div className="character-cz-win-row">
                  {characterPointGroups.map((group) => (
                    <button
                      className={`character-cz-win-button character-cz-win-button-${group.theme}`}
                      key={group.character}
                      type="button"
                      onClick={() => handleCharacterCzWin(group)}
                    >
                      {group.character}CZ当選
                    </button>
                  ))}
                </div>
              </div>
              <div className="character-point-estimation-toggle">
                <EstimationToggle
                  checked={useCharacterPointRate}
                  label="平均到達率を推測に使用"
                  onChange={(checked) =>
                    handleInputChange("useCharacterPointRate", checked ? "1" : "0")
                  }
                />
              </div>
            </section>
            {inputGroups.filter((group) => !("pointButtons" in group)).map((group) => (
              <section
                className={`input-group${"pointButtons" in group ? " character-point-column" : ""}`}
                key={group.title}
              >
              {"hideTitle" in group && group.hideTitle ? null : (
                <div className="group-title-row">
                  <p className="group-title">【{group.title}】</p>
                  {"note" in group ? <p className="group-note">{group.note}</p> : null}
                </div>
              )}
              {"myslot" in group ? (
                <MyslotInput
                  value={inputValues.myslotText ?? ""}
                  onChange={(value) => handleInputChange("myslotText", value)}
                  onUseItemLotteryChange={(checked) =>
                    handleInputChange("useItemLottery", checked ? "1" : "0")
                  }
                  onUseTrophyChange={(checked) =>
                    handleInputChange("useTrophy", checked ? "1" : "0")
                  }
                  useItemLottery={useItemLottery}
                  useTrophy={useTrophy}
                />
              ) : "lightRateEstimation" in group ? (
                <EstimationToggle
                  checked={useCharacterLightRate}
                  label="発光率を推測に使用"
                  onChange={(checked) =>
                    handleInputChange("useCharacterLightRate", checked ? "1" : "0")
                  }
                />
              ) : "history" in group ? (
                <CharacterCzHistory
                  history={characterPointHistory}
                  onDelete={handleCharacterHistoryDelete}
                />
              ) : "fields" in group ? (
                <div
                  className={`input-row input-row-${Math.min(group.fields.length, 3)}${group.rowClass ? ` ${group.rowClass}` : ""}`}
                >
                  {group.fields.map((field) => (
                    <div className="input-field-wrap" key={field.key}>
                      <div className="input-field">
                        <label className="input-label" htmlFor={`kabaneri2-${field.key}`}>
                          {field.label}
                        </label>
                        <span className="input-control">
                          {field.key === "lowerBells" ? (
                            <button
                              aria-label="下段ベルを1減らす"
                              className="cycle-step-button"
                              type="button"
                              onClick={() => handleCountInputStep(field.key, -1)}
                            >
                              −
                            </button>
                          ) : null}
                          <input
                            id={`kabaneri2-${field.key}`}
                            className={`number-input${field.widthClass ? ` ${field.widthClass}` : ""}`}
                            type="number"
                            inputMode={field.key === "exchangeRate" ? "decimal" : "numeric"}
                            min="0"
                            step={field.key === "exchangeRate" ? "0.1" : "1"}
                            value={inputValues[field.key] ?? ""}
                            onChange={(event) =>
                              handleInputChange(field.key, event.currentTarget.value)
                            }
                          />
                          {field.key === "lowerBells" ? (
                            <button
                              aria-label="下段ベルを1増やす"
                              className="cycle-step-button"
                              type="button"
                              onClick={() => handleCountInputStep(field.key, 1)}
                            >
                              ＋
                            </button>
                          ) : null}
                          {field.unit ? <span className="input-unit">{field.unit}</span> : null}
                          {liveFieldTexts[field.key] ? (
                            <span className="input-live-text">{liveFieldTexts[field.key]}</span>
                          ) : null}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : "rows" in group ? (
                <div className="piece-input-group">
                  {group.rows.map((row) => (
                    <div
                      className="piece-input-row piece-input-row-tight cycle-input-row-with-buttons"
                      key={row.label}
                    >
                      <p className="piece-input-label">{row.label}</p>
                      <div className="input-field">
                        <span className="input-label">試行</span>
                        <span className="input-control">
                          <button
                            aria-label={`${row.label}の試行を1減らす`}
                            className="cycle-step-button"
                            type="button"
                            onClick={() => handleCountInputStep(row.trialKey, -1)}
                          >
                            −
                          </button>
                          <input
                            aria-label={`${row.label}の試行`}
                            className="number-input number-input-piece number-input-piece-tight"
                            type="number"
                            inputMode="numeric"
                            min="0"
                            step="1"
                            value={inputValues[row.trialKey] ?? ""}
                            onChange={(event) =>
                              handleInputChange(row.trialKey, event.currentTarget.value)
                            }
                          />
                          <button
                            aria-label={`${row.label}の試行を1増やす`}
                            className="cycle-step-button"
                            type="button"
                            onClick={() => handleCountInputStep(row.trialKey, 1)}
                          >
                            ＋
                          </button>
                          <span className="input-unit">回</span>
                        </span>
                      </div>
                      <div className="input-field">
                        <span className="input-label">当選</span>
                        <span className="input-control">
                          <button
                            aria-label={`${row.label}の当選を1減らす`}
                            className="cycle-step-button"
                            type="button"
                            onClick={() => handleCountInputStep(row.hitKey, -1)}
                          >
                            −
                          </button>
                          <input
                            aria-label={`${row.label}の当選`}
                            className="number-input number-input-piece number-input-piece-tight"
                            type="number"
                            inputMode="numeric"
                            min="0"
                            step="1"
                            value={inputValues[row.hitKey] ?? ""}
                            onChange={(event) =>
                              handleInputChange(row.hitKey, event.currentTarget.value)
                            }
                          />
                          <button
                            aria-label={`${row.label}の当選を1増やす`}
                            className="cycle-step-button"
                            type="button"
                            onClick={() => handleCountInputStep(row.hitKey, 1)}
                          >
                            ＋
                          </button>
                          <span className="input-unit">回</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
              </section>
            ))}
          </div>
          <SaveSlotControls {...saveSlots} />
        </form>

        <section className="result-group" id="estimate-results">
          <h2 className="result-title">推測結果</h2>
          {errorMessage ? (
            <p className="result-placeholder" role="alert">
              {errorMessage}
            </p>
          ) : estimateResult ? (
            <>
              <div className="result-list">
                <div className="result-item">
                  <p className="result-label">実践値</p>
                  <p className="result-value">
                    {estimateResult.hasPracticeGames
                      ? `${estimateResult.practiceGames}G`
                      : "G数未入力"}
                    {" / "}
                    {estimateResult.hasLowerBellInput
                      ? `下段ベル${estimateResult.practiceLowerBells}回（${estimateResult.measuredRateText}）`
                      : "下段ベル未入力"}
                  </p>
                </div>
                {estimateResult.settingRows.map((row) => (
                  <div className="result-item" key={`setting-${row.label}`}>
                    <p className="result-label">{row.label}</p>
                    <p className="result-value">{row.value}</p>
                  </div>
                ))}
              </div>
              <div className="result-subgroup">
                <div className="table-wrap table-wrap-tight">
                  <table className="data-table data-table-compact">
                    <thead>
                      <tr>
                        <th>
                          <div className="table-head-main">実践期待値</div>
                          <div className="table-head-sub">
                            {estimateResult.hasPracticeGames
                              ? `${estimateResult.practiceGames}G`
                              : "G数未入力"}
                          </div>
                        </th>
                        <th>機械割</th>
                        <th>設定別期待値</th>
                        <th>推測割合</th>
                        <th>推測期待値</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estimateResult.expectationRows.map((row) => (
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
                        <td>{estimateResult.totalPayoutText}</td>
                        <td>-</td>
                        <td>-</td>
                        <td>{estimateResult.totalExpectationText}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="result-list">
                  <div className="result-item result-item-inline">
                    <p className="result-label">期待時給</p>
                    <p className="result-value">{estimateResult.hourlyText}</p>
                  </div>
                </div>
              </div>
              <div className="result-subgroup">
                <h3 className="result-section-title">各項目ごとの推測値</h3>
                {estimateResult.detailGroups.map((group) => (
                  <section className="result-metric-group" key={group.title}>
                    <div className="table-wrap table-wrap-tight">
                      <table className="data-table data-table-compact">
                        <thead>
                          <tr>
                            <th>
                              <div className="table-head-main">{group.title}</div>
                              <div className="table-head-sub">設定</div>
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
                          {settings.map((setting, settingIndex) => (
                            <tr key={`${group.title}-${setting.label}`}>
                              <th scope="row">{setting.label}</th>
                              {group.columns.map((column) => (
                                <td key={`${group.title}-${setting.label}-${column.label}`}>
                                  {column.values[settingIndex]}
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
                        <th key={`${group.title}-${column.label}`}>{column.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {settings.map((setting) => (
                      <tr key={`${group.title}-${setting.label}`}>
                        <th scope="row">{setting.label}</th>
                        {group.columns.map((column) => (
                          <td key={`${setting.label}-${column.label}`}>
                            {column.format(setting)}
                          </td>
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
