"use client";

import { useEffect, useState } from "react";
import { SaveSlotControls, useSaveSlots } from "../save-slots";
import { UnimemoImageUpload } from "../unimemo-image-upload";

type InputMode = "unimemo" | "normal";

const settings = [
  {
    setting: "設定1",
    bb: "1/292.6",
    rb: "1/374.5",
    bellA: "1/10.9",
    bellB: "1/20.9",
    suikaA: "1/74.5",
    cherryB: "1/56.2",
    bigBell: "1/1.10",
    bigCherryBell: "1/11.1",
    bigCherry: "1/256.0",
    bigMidCherry: "1/16384.0",
    regOneRole: "1/8.0",
    regHazure: "0",
    redNormal1OrLess: "0.0%",
    redNormal2: "0.0%",
    redNormal3: "0.0%",
    redNormal4: "0.0%",
    redNormal5OrMore: "0.0%",
    redRtShort1OrLess: "0.0%",
    redRtShort2: "0.0%",
    redRtShort3: "0.0%",
    redRtShort4: "0.0%",
    redRtShort5OrMore: "0.0%",
    redRtLong1OrLess: "0.0%",
    redRtLong2: "0.0%",
    redRtLong3: "0.0%",
    redRtLong4: "0.0%",
    redRtLong5OrMore: "0.0%",
    chanceHazure: "1/5.0",
    gameHazure: "1/10.1",
    payout: "99.3%",
    payoutFull: "102.0%"
  },
  {
    setting: "設定2",
    bb: "1/284.9",
    rb: "1/341.3",
    bellA: "1/10.7",
    bellB: "1/21.2",
    suikaA: "1/70.6",
    cherryB: "1/57.7",
    bigBell: "1/1.14",
    bigCherryBell: "1/8.9",
    bigCherry: "1/128.0",
    bigMidCherry: "1/16384.0",
    regOneRole: "1/8.0",
    regHazure: "0",
    redNormal1OrLess: "0.8%",
    redNormal2: "3.1%",
    redNormal3: "6.3%",
    redNormal4: "12.5%",
    redNormal5OrMore: "25.0%",
    redRtShort1OrLess: "3.1%",
    redRtShort2: "6.3%",
    redRtShort3: "12.5%",
    redRtShort4: "25.0%",
    redRtShort5OrMore: "50.0%",
    redRtLong1OrLess: "6.3%",
    redRtLong2: "12.5%",
    redRtLong3: "18.8%",
    redRtLong4: "25.0%",
    redRtLong5OrMore: "50.0%",
    chanceHazure: "1/4.9",
    gameHazure: "1/9.4",
    payout: "101.1%",
    payoutFull: "104.0%"
  },
  {
    setting: "設定5",
    bb: "1/275.4",
    rb: "1/319.7",
    bellA: "1/10.5",
    bellB: "1/20.3",
    suikaA: "1/72.5",
    cherryB: "1/53.1",
    bigBell: "1/1.10",
    bigCherryBell: "1/11.1",
    bigCherry: "1/256.0",
    bigMidCherry: "1/16384.0",
    regOneRole: "1/7.0",
    regHazure: "1/376.6",
    redNormal1OrLess: "0.8%",
    redNormal2: "3.1%",
    redNormal3: "6.3%",
    redNormal4: "12.5%",
    redNormal5OrMore: "25.0%",
    redRtShort1OrLess: "3.1%",
    redRtShort2: "6.3%",
    redRtShort3: "12.5%",
    redRtShort4: "25.0%",
    redRtShort5OrMore: "50.0%",
    redRtLong1OrLess: "6.3%",
    redRtLong2: "12.5%",
    redRtLong3: "18.8%",
    redRtLong4: "25.0%",
    redRtLong5OrMore: "50.0%",
    chanceHazure: "1/4.6",
    gameHazure: "1/8.7",
    payout: "103.5%",
    payoutFull: "106.5%"
  },
  {
    setting: "設定6",
    bb: "1/264.3",
    rb: "1/292.6",
    bellA: "1/10.2",
    bellB: "1/20.6",
    suikaA: "1/68.8",
    cherryB: "1/54.4",
    bigBell: "1/1.14",
    bigCherryBell: "1/8.9",
    bigCherry: "1/128.0",
    bigMidCherry: "1/897.8",
    regOneRole: "1/7.0",
    regHazure: "1/376.6",
    redNormal1OrLess: "0.8%",
    redNormal2: "3.1%",
    redNormal3: "6.3%",
    redNormal4: "12.5%",
    redNormal5OrMore: "25.0%",
    redRtShort1OrLess: "3.1%",
    redRtShort2: "6.3%",
    redRtShort3: "12.5%",
    redRtShort4: "25.0%",
    redRtShort5OrMore: "50.0%",
    redRtLong1OrLess: "6.3%",
    redRtLong2: "12.5%",
    redRtLong3: "18.8%",
    redRtLong4: "25.0%",
    redRtLong5OrMore: "50.0%",
    chanceHazure: "1/4.5",
    gameHazure: "1/8.1",
    payout: "105.8%",
    payoutFull: "109.0%"
  }
];

type InputField = {
  key: string;
  label: string;
  unit?: string;
  compact?: boolean;
  widthClass?: string;
  prefix?: string;
  keyboard?: "numeric" | "decimal";
};

type StandardInputGroup = {
  title: string;
  note?: string;
  fields: InputField[];
};

type PieceInputRow = {
  label: string;
  trialKey: string;
  occurrenceKey: string;
};

type PieceInputGroup = {
  title: string;
  rows: PieceInputRow[];
};

const modeOptions: Array<{ value: InputMode; label: string }> = [
  { value: "unimemo", label: "ユニメモ" },
  { value: "normal", label: "通常" }
];

const inputGroups: Array<StandardInputGroup | PieceInputGroup> = [
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
      { key: "suikaA", label: "スイカA" },
      { key: "cherryB", label: "チェリーB" }
    ]
  },
  {
    title: "VS CHANCE中",
    fields: [
      { key: "chanceGames", label: "消化G数" },
      { key: "chanceHazure", label: "ハズレ" }
    ]
  },
  {
    title: "VS GAME中",
    fields: [
      { key: "gameGames", label: "消化G数" },
      { key: "gameHazure", label: "ハズレ" }
    ]
  },
  {
    title: "BIG中",
    fields: [
      { key: "bigGames", label: "消化G数" },
      { key: "bigBell", label: "ベル" },
      { key: "bigCherryBell", label: "角チェリー+ベル" },
      { key: "bigCherry", label: "角チェリー" },
      { key: "bigMidCherry", label: "中段チェリー" }
    ]
  },
  {
    title: "REG中",
    fields: [
      { key: "regGames", label: "消化G数" },
      { key: "regOneRole", label: "1枚役" },
      { key: "regHazure", label: "ハズレ" }
    ]
  },
  {
    title: "RB終了時の赤帯(通常時)",
    rows: [
      {
        label: "1回以下",
        trialKey: "redNormal1OrLessTrials",
        occurrenceKey: "redNormal1OrLessHits"
      },
      {
        label: "2回",
        trialKey: "redNormal2Trials",
        occurrenceKey: "redNormal2Hits"
      },
      {
        label: "3回",
        trialKey: "redNormal3Trials",
        occurrenceKey: "redNormal3Hits"
      },
      {
        label: "4回",
        trialKey: "redNormal4Trials",
        occurrenceKey: "redNormal4Hits"
      },
      {
        label: "5回以上",
        trialKey: "redNormal5OrMoreTrials",
        occurrenceKey: "redNormal5OrMoreHits"
      }
    ]
  },
  {
    title: "RB終了時の赤帯(RT2連まで)",
    rows: [
      {
        label: "1回以下",
        trialKey: "redRtShort1OrLessTrials",
        occurrenceKey: "redRtShort1OrLessHits"
      },
      {
        label: "2回",
        trialKey: "redRtShort2Trials",
        occurrenceKey: "redRtShort2Hits"
      },
      {
        label: "3回",
        trialKey: "redRtShort3Trials",
        occurrenceKey: "redRtShort3Hits"
      },
      {
        label: "4回",
        trialKey: "redRtShort4Trials",
        occurrenceKey: "redRtShort4Hits"
      },
      {
        label: "5回以上",
        trialKey: "redRtShort5OrMoreTrials",
        occurrenceKey: "redRtShort5OrMoreHits"
      }
    ]
  },
  {
    title: "RB終了時の赤帯(RT3連以上)",
    rows: [
      {
        label: "1回以下",
        trialKey: "redRtLong1OrLessTrials",
        occurrenceKey: "redRtLong1OrLessHits"
      },
      {
        label: "2回",
        trialKey: "redRtLong2Trials",
        occurrenceKey: "redRtLong2Hits"
      },
      {
        label: "3回",
        trialKey: "redRtLong3Trials",
        occurrenceKey: "redRtLong3Hits"
      },
      {
        label: "4回",
        trialKey: "redRtLong4Trials",
        occurrenceKey: "redRtLong4Hits"
      },
      {
        label: "5回以上",
        trialKey: "redRtLong5OrMoreTrials",
        occurrenceKey: "redRtLong5OrMoreHits"
      }
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

const unimemoInputGroups: Record<string, StandardInputGroup> = {
  "VS CHANCE中": {
    title: "VS CHANCE中",
    fields: [
      { key: "chanceHazure", label: "回数", unit: "回" },
      {
        key: "chanceHazureRate",
        label: "確率",
        prefix: "1/",
        widthClass: "number-input-rate",
        keyboard: "decimal"
      }
    ]
  },
  "VS GAME中": {
    title: "VS GAME中",
    fields: [
      { key: "gameHazure", label: "回数", unit: "回" },
      {
        key: "gameHazureRate",
        label: "確率",
        prefix: "1/",
        widthClass: "number-input-rate",
        keyboard: "decimal"
      }
    ]
  },
  BIG中: {
    title: "BIG中",
    fields: [
      { key: "bigBell", label: "ベル回数", unit: "回" },
      {
        key: "bigBellRate",
        label: "確率",
        prefix: "1/",
        widthClass: "number-input-rate",
        keyboard: "decimal"
      },
      { key: "bigCherryBell", label: "角チェ+ベル回数", unit: "回" },
      { key: "bigCherry", label: "角チェ回数", unit: "回" },
      { key: "bigMidCherry", label: "中段チェ回数", unit: "回" }
    ]
  },
  REG中: {
    title: "REG中",
    fields: [
      { key: "regOneRole", label: "1枚役回数", unit: "回" },
      {
        key: "regOneRoleRate",
        label: "確率",
        prefix: "1/",
        widthClass: "number-input-rate",
        keyboard: "decimal"
      },
      { key: "regHazure", label: "ハズレ回数", unit: "回" }
    ]
  }
};

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
  chanceHazureRate: "",
  gameHazureRate: "",
  bigBellRate: "",
  regOneRoleRate: "",
  medalRent: "46",
  exchangeRate: "5.0",
  strategyRate: "75"
};

const STORAGE_KEY = "suisoku-versusrevis-inputs";
const MODE_STORAGE_KEY = "suisoku-versusrevis-mode";

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
      { label: "スイカA", key: "suikaA" },
      { label: "チェリーB", key: "cherryB" }
    ]
  },
  {
    title: "VS CHANCE中",
    columns: [{ label: "ハズレ", key: "chanceHazure" }]
  },
  {
    title: "VS GAME中",
    columns: [{ label: "ハズレ", key: "gameHazure" }]
  },
  {
    title: "BIG中",
    columns: [
      { label: "ベル", key: "bigBell" },
      { label: "角チェリー+ベル", key: "bigCherryBell" },
      { label: "角チェリー", key: "bigCherry" },
      { label: "中段チェリー", key: "bigMidCherry" }
    ]
  },
  {
    title: "REG中",
    columns: [
      { label: "1枚役", key: "regOneRole" },
      { label: "ハズレ", key: "regHazure" }
    ]
  },
  {
    title: "RB終了時の赤帯(通常時)",
    columns: [
      { label: "1回以下", key: "redNormal1OrLess" },
      { label: "2回", key: "redNormal2" },
      { label: "3回", key: "redNormal3" },
      { label: "4回", key: "redNormal4" },
      { label: "5回以上", key: "redNormal5OrMore" }
    ]
  },
  {
    title: "RB終了時の赤帯(RT2連まで)",
    columns: [
      { label: "1回以下", key: "redRtShort1OrLess" },
      { label: "2回", key: "redRtShort2" },
      { label: "3回", key: "redRtShort3" },
      { label: "4回", key: "redRtShort4" },
      { label: "5回以上", key: "redRtShort5OrMore" }
    ]
  },
  {
    title: "RB終了時の赤帯(RT3連以上)",
    columns: [
      { label: "1回以下", key: "redRtLong1OrLess" },
      { label: "2回", key: "redRtLong2" },
      { label: "3回", key: "redRtLong3" },
      { label: "4回", key: "redRtLong4" },
      { label: "5回以上", key: "redRtLong5OrMore" }
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
      { title: "スイカA", key: "suikaA" as const },
      { title: "チェリーB", key: "cherryB" as const }
    ]
  },
  {
    title: "VS CHANCE中",
    items: [{ title: "ハズレ", key: "chanceHazure" as const }]
  },
  {
    title: "VS GAME中",
    items: [{ title: "ハズレ", key: "gameHazure" as const }]
  },
  {
    title: "BIG中",
    items: [
      { title: "ベル", key: "bigBell" as const },
      { title: "角チェリー+ベル", key: "bigCherryBell" as const },
      { title: "角チェリー", key: "bigCherry" as const },
      { title: "中段チェリー", key: "bigMidCherry" as const }
    ]
  },
  {
    title: "REG中",
    items: [
      { title: "1枚役", key: "regOneRole" as const },
      { title: "ハズレ", key: "regHazure" as const }
    ]
  },
  {
    title: "RB終了時の赤帯(通常時)",
    headerText: "カテゴリ別",
    items: [
      { title: "1回以下", key: "redNormal1OrLess" as const },
      { title: "2回", key: "redNormal2" as const },
      { title: "3回", key: "redNormal3" as const },
      { title: "4回", key: "redNormal4" as const },
      { title: "5回以上", key: "redNormal5OrMore" as const }
    ]
  },
  {
    title: "RB終了時の赤帯(RT2連まで)",
    headerText: "カテゴリ別",
    items: [
      { title: "1回以下", key: "redRtShort1OrLess" as const },
      { title: "2回", key: "redRtShort2" as const },
      { title: "3回", key: "redRtShort3" as const },
      { title: "4回", key: "redRtShort4" as const },
      { title: "5回以上", key: "redRtShort5OrMore" as const }
    ]
  },
  {
    title: "RB終了時の赤帯(RT3連以上)",
    headerText: "カテゴリ別",
    items: [
      { title: "1回以下", key: "redRtLong1OrLess" as const },
      { title: "2回", key: "redRtLong2" as const },
      { title: "3回", key: "redRtLong3" as const },
      { title: "4回", key: "redRtLong4" as const },
      { title: "5回以上", key: "redRtLong5OrMore" as const }
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
  | "suikaA"
  | "cherryB"
  | "bigBell"
  | "bigCherryBell"
  | "bigCherry"
  | "bigMidCherry"
  | "regOneRole"
  | "regHazure"
  | "redNormal1OrLess"
  | "redNormal2"
  | "redNormal3"
  | "redNormal4"
  | "redNormal5OrMore"
  | "redRtShort1OrLess"
  | "redRtShort2"
  | "redRtShort3"
  | "redRtShort4"
  | "redRtShort5OrMore"
  | "redRtLong1OrLess"
  | "redRtLong2"
  | "redRtLong3"
  | "redRtLong4"
  | "redRtLong5OrMore"
  | "chanceHazure"
  | "gameHazure";

type ProbabilityDefinition = {
  key: RateKey;
  title: string;
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
  bellA: parseRate(setting.bellA),
  bellB: parseRate(setting.bellB),
  bellTotal: parseRate(setting.bellA) + parseRate(setting.bellB),
  suikaA: parseRate(setting.suikaA),
  cherryB: parseRate(setting.cherryB),
  bigBell: parseRate(setting.bigBell),
  bigCherryBell: parseRate(setting.bigCherryBell),
  bigCherry: parseRate(setting.bigCherry),
  bigMidCherry: parseRate(setting.bigMidCherry),
  regOneRole: parseRate(setting.regOneRole),
  regHazure: parseRate(setting.regHazure),
  redNormal1OrLess: parsePayoutRate(setting.redNormal1OrLess),
  redNormal2: parsePayoutRate(setting.redNormal2),
  redNormal3: parsePayoutRate(setting.redNormal3),
  redNormal4: parsePayoutRate(setting.redNormal4),
  redNormal5OrMore: parsePayoutRate(setting.redNormal5OrMore),
  redRtShort1OrLess: parsePayoutRate(setting.redRtShort1OrLess),
  redRtShort2: parsePayoutRate(setting.redRtShort2),
  redRtShort3: parsePayoutRate(setting.redRtShort3),
  redRtShort4: parsePayoutRate(setting.redRtShort4),
  redRtShort5OrMore: parsePayoutRate(setting.redRtShort5OrMore),
  redRtLong1OrLess: parsePayoutRate(setting.redRtLong1OrLess),
  redRtLong2: parsePayoutRate(setting.redRtLong2),
  redRtLong3: parsePayoutRate(setting.redRtLong3),
  redRtLong4: parsePayoutRate(setting.redRtLong4),
  redRtLong5OrMore: parsePayoutRate(setting.redRtLong5OrMore),
  chanceHazure: parseRate(setting.chanceHazure),
  gameHazure: parseRate(setting.gameHazure)
}));

const settingsDisplay = settings.map((setting) => ({
  setting: setting.setting,
  bb: formatRateFromProbability(parseRate(setting.bb)),
  rb: formatRateFromProbability(parseRate(setting.rb)),
  bellA: formatRateFromProbability(parseRate(setting.bellA)),
  bellB: formatRateFromProbability(parseRate(setting.bellB)),
  bellTotal: formatRateFromProbability(parseRate(setting.bellA) + parseRate(setting.bellB)),
  suikaA: formatRateFromProbability(parseRate(setting.suikaA)),
  cherryB: formatRateFromProbability(parseRate(setting.cherryB)),
  bigBell: formatRateFromProbability(parseRate(setting.bigBell)),
  bigCherryBell: formatRateFromProbability(parseRate(setting.bigCherryBell)),
  bigCherry: formatRateFromProbability(parseRate(setting.bigCherry)),
  bigMidCherry: formatRateFromProbability(parseRate(setting.bigMidCherry)),
  regOneRole: formatRateFromProbability(parseRate(setting.regOneRole)),
  regHazure: formatRateFromProbability(parseRate(setting.regHazure)),
  redNormal1OrLess: formatOccurrenceRate(parsePayoutRate(setting.redNormal1OrLess)),
  redNormal2: formatOccurrenceRate(parsePayoutRate(setting.redNormal2)),
  redNormal3: formatOccurrenceRate(parsePayoutRate(setting.redNormal3)),
  redNormal4: formatOccurrenceRate(parsePayoutRate(setting.redNormal4)),
  redNormal5OrMore: formatOccurrenceRate(parsePayoutRate(setting.redNormal5OrMore)),
  redRtShort1OrLess: formatOccurrenceRate(parsePayoutRate(setting.redRtShort1OrLess)),
  redRtShort2: formatOccurrenceRate(parsePayoutRate(setting.redRtShort2)),
  redRtShort3: formatOccurrenceRate(parsePayoutRate(setting.redRtShort3)),
  redRtShort4: formatOccurrenceRate(parsePayoutRate(setting.redRtShort4)),
  redRtShort5OrMore: formatOccurrenceRate(parsePayoutRate(setting.redRtShort5OrMore)),
  redRtLong1OrLess: formatOccurrenceRate(parsePayoutRate(setting.redRtLong1OrLess)),
  redRtLong2: formatOccurrenceRate(parsePayoutRate(setting.redRtLong2)),
  redRtLong3: formatOccurrenceRate(parsePayoutRate(setting.redRtLong3)),
  redRtLong4: formatOccurrenceRate(parsePayoutRate(setting.redRtLong4)),
  redRtLong5OrMore: formatOccurrenceRate(parsePayoutRate(setting.redRtLong5OrMore)),
  chanceHazure: formatRateFromProbability(parseRate(setting.chanceHazure)),
  gameHazure: formatRateFromProbability(parseRate(setting.gameHazure)),
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
  if (value < 10) {
    const rounded = Math.round(value * 100) / 100;
    return rounded.toFixed(2);
  }

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

function formatOccurrenceRate(probability: number) {
  if (probability <= 0) {
    return "-";
  }

  return `${(probability * 100).toFixed(1)}%`;
}

function formatOccurrencePercent(count: number, base: number) {
  if (count < 0 || base <= 0 || count > base) {
    return "-";
  }

  return `${((count / base) * 100).toFixed(1)}%`;
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

export default function VersusRevisPage() {
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
    isReady: hasLoadedSavedValues,
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
    saveSlots.onClearCurrentData();
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
    const suikaA = toNumber(inputValues.suikaA);
    const cherryB = toNumber(inputValues.cherryB);
    const bigGames = toNumber(inputValues.bigGames);
    const bigBell = toNumber(inputValues.bigBell);
    const bigBellRate = toNumber(inputValues.bigBellRate);
    const bigCherryBell = toNumber(inputValues.bigCherryBell);
    const bigCherry = toNumber(inputValues.bigCherry);
    const bigMidCherry = toNumber(inputValues.bigMidCherry);
    const regGames = toNumber(inputValues.regGames);
    const regOneRole = toNumber(inputValues.regOneRole);
    const regOneRoleRate = toNumber(inputValues.regOneRoleRate);
    const regHazure = toNumber(inputValues.regHazure);
    const redNormal1OrLessTrials = toNumber(inputValues.redNormal1OrLessTrials);
    const redNormal1OrLessHits = toNumber(inputValues.redNormal1OrLessHits);
    const redNormal2Trials = toNumber(inputValues.redNormal2Trials);
    const redNormal2Hits = toNumber(inputValues.redNormal2Hits);
    const redNormal3Trials = toNumber(inputValues.redNormal3Trials);
    const redNormal3Hits = toNumber(inputValues.redNormal3Hits);
    const redNormal4Trials = toNumber(inputValues.redNormal4Trials);
    const redNormal4Hits = toNumber(inputValues.redNormal4Hits);
    const redNormal5OrMoreTrials = toNumber(inputValues.redNormal5OrMoreTrials);
    const redNormal5OrMoreHits = toNumber(inputValues.redNormal5OrMoreHits);
    const redRtShort1OrLessTrials = toNumber(inputValues.redRtShort1OrLessTrials);
    const redRtShort1OrLessHits = toNumber(inputValues.redRtShort1OrLessHits);
    const redRtShort2Trials = toNumber(inputValues.redRtShort2Trials);
    const redRtShort2Hits = toNumber(inputValues.redRtShort2Hits);
    const redRtShort3Trials = toNumber(inputValues.redRtShort3Trials);
    const redRtShort3Hits = toNumber(inputValues.redRtShort3Hits);
    const redRtShort4Trials = toNumber(inputValues.redRtShort4Trials);
    const redRtShort4Hits = toNumber(inputValues.redRtShort4Hits);
    const redRtShort5OrMoreTrials = toNumber(inputValues.redRtShort5OrMoreTrials);
    const redRtShort5OrMoreHits = toNumber(inputValues.redRtShort5OrMoreHits);
    const redRtLong1OrLessTrials = toNumber(inputValues.redRtLong1OrLessTrials);
    const redRtLong1OrLessHits = toNumber(inputValues.redRtLong1OrLessHits);
    const redRtLong2Trials = toNumber(inputValues.redRtLong2Trials);
    const redRtLong2Hits = toNumber(inputValues.redRtLong2Hits);
    const redRtLong3Trials = toNumber(inputValues.redRtLong3Trials);
    const redRtLong3Hits = toNumber(inputValues.redRtLong3Hits);
    const redRtLong4Trials = toNumber(inputValues.redRtLong4Trials);
    const redRtLong4Hits = toNumber(inputValues.redRtLong4Hits);
    const redRtLong5OrMoreTrials = toNumber(inputValues.redRtLong5OrMoreTrials);
    const redRtLong5OrMoreHits = toNumber(inputValues.redRtLong5OrMoreHits);
    const chanceGames = toNumber(inputValues.chanceGames);
    const chanceHazure = toNumber(inputValues.chanceHazure);
    const chanceHazureRate = toNumber(inputValues.chanceHazureRate);
    const gameGames = toNumber(inputValues.gameGames);
    const gameHazure = toNumber(inputValues.gameHazure);
    const gameHazureRate = toNumber(inputValues.gameHazureRate);
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
    const bigBase =
      inputMode === "unimemo" ? calculateUnimemoBase(bigBell, bigBellRate) : bigGames;
    const regBase =
      inputMode === "unimemo" ? calculateUnimemoBase(regOneRole, regOneRoleRate) : regGames;
    const chanceBase =
      inputMode === "unimemo"
        ? calculateUnimemoBase(chanceHazure, chanceHazureRate)
        : chanceGames;
    const gameBase =
      inputMode === "unimemo" ? calculateUnimemoBase(gameHazure, gameHazureRate) : gameGames;
    const settingExpectationValues = settings.map((setting) => {
      const payoutRate = calculateEffectivePayout(setting.payout, setting.payoutFull, strategyRate);

      return {
        label: setting.setting,
        payoutRate,
        expectedYen: practiceGames * 3 * yenPerMedal * (payoutRate - 1) - cashGapLoss
      };
    });

    const probabilityDefinitions: ProbabilityDefinition[] = [
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
        key: "suikaA",
        title: "通常時スイカA",
        count: suikaA,
        base: practiceGames
      },
      {
        key: "cherryB",
        title: "通常時チェリーB",
        count: cherryB,
        base: practiceGames
      },
      {
        key: "bigBell",
        title: "BIG中ベル",
        count: bigBell,
        base: bigBase
      },
      {
        key: "bigCherryBell",
        title: "BIG中角チェリー+ベル",
        count: bigCherryBell,
        base: bigBase
      },
      {
        key: "bigCherry",
        title: "BIG中角チェリー",
        count: bigCherry,
        base: bigBase
      },
      {
        key: "bigMidCherry",
        title: "BIG中中段チェリー",
        count: bigMidCherry,
        base: bigBase
      },
      {
        key: "regOneRole",
        title: "REG中1枚役",
        count: regOneRole,
        base: regBase
      },
      {
        key: "regHazure",
        title: "REG中ハズレ",
        count: regHazure,
        base: regBase
      },
      {
        key: "redNormal1OrLess",
        title: "RB赤帯通常時1回以下",
        count: redNormal1OrLessHits,
        base: redNormal1OrLessTrials,
        summaryStyle: "percent"
      },
      {
        key: "redNormal2",
        title: "RB赤帯通常時2回",
        count: redNormal2Hits,
        base: redNormal2Trials,
        summaryStyle: "percent"
      },
      {
        key: "redNormal3",
        title: "RB赤帯通常時3回",
        count: redNormal3Hits,
        base: redNormal3Trials,
        summaryStyle: "percent"
      },
      {
        key: "redNormal4",
        title: "RB赤帯通常時4回",
        count: redNormal4Hits,
        base: redNormal4Trials,
        summaryStyle: "percent"
      },
      {
        key: "redNormal5OrMore",
        title: "RB赤帯通常時5回以上",
        count: redNormal5OrMoreHits,
        base: redNormal5OrMoreTrials,
        summaryStyle: "percent"
      },
      {
        key: "redRtShort1OrLess",
        title: "RB赤帯RT2連まで1回以下",
        count: redRtShort1OrLessHits,
        base: redRtShort1OrLessTrials,
        summaryStyle: "percent"
      },
      {
        key: "redRtShort2",
        title: "RB赤帯RT2連まで2回",
        count: redRtShort2Hits,
        base: redRtShort2Trials,
        summaryStyle: "percent"
      },
      {
        key: "redRtShort3",
        title: "RB赤帯RT2連まで3回",
        count: redRtShort3Hits,
        base: redRtShort3Trials,
        summaryStyle: "percent"
      },
      {
        key: "redRtShort4",
        title: "RB赤帯RT2連まで4回",
        count: redRtShort4Hits,
        base: redRtShort4Trials,
        summaryStyle: "percent"
      },
      {
        key: "redRtShort5OrMore",
        title: "RB赤帯RT2連まで5回以上",
        count: redRtShort5OrMoreHits,
        base: redRtShort5OrMoreTrials,
        summaryStyle: "percent"
      },
      {
        key: "redRtLong1OrLess",
        title: "RB赤帯RT3連以上1回以下",
        count: redRtLong1OrLessHits,
        base: redRtLong1OrLessTrials,
        summaryStyle: "percent"
      },
      {
        key: "redRtLong2",
        title: "RB赤帯RT3連以上2回",
        count: redRtLong2Hits,
        base: redRtLong2Trials,
        summaryStyle: "percent"
      },
      {
        key: "redRtLong3",
        title: "RB赤帯RT3連以上3回",
        count: redRtLong3Hits,
        base: redRtLong3Trials,
        summaryStyle: "percent"
      },
      {
        key: "redRtLong4",
        title: "RB赤帯RT3連以上4回",
        count: redRtLong4Hits,
        base: redRtLong4Trials,
        summaryStyle: "percent"
      },
      {
        key: "redRtLong5OrMore",
        title: "RB赤帯RT3連以上5回以上",
        count: redRtLong5OrMoreHits,
        base: redRtLong5OrMoreTrials,
        summaryStyle: "percent"
      },
      {
        key: "chanceHazure",
        title: "VS CHANCE中ハズレ",
        count: chanceHazure,
        base: chanceBase
      },
      {
        key: "gameHazure",
        title: "VS GAME中ハズレ",
        count: gameHazure,
        base: gameBase
      }
    ];

    const probabilityDefinitionMap = Object.fromEntries(
      probabilityDefinitions.map((definition) => [definition.key, definition])
    ) as Record<RateKey, (typeof probabilityDefinitions)[number]>;

    const validProbabilityDefinitions = probabilityDefinitions.filter(
      (definition) =>
        definition.key !== "sum" &&
        definition.key !== "bellTotal" &&
        definition.base > 0 &&
        definition.count >= 0 &&
        definition.count <= definition.base
    );

    setProbabilityGroups(
      probabilityDisplayGroups.map((group) => ({
        title: group.title,
        headerText:
          "headerText" in group ? group.headerText : `${probabilityDefinitionMap[group.items[0].key].base}G`,
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
        <h1 className="title">バーサス リヴァイズ</h1>
        <section className="mode-switch">
          <p className="mode-switch-label">入力モード</p>
          <div className="mode-switch-options">
            {modeOptions.map((option) => (
              <label className="mode-switch-option" key={option.value}>
                <input
                  checked={inputMode === option.value}
                  className="mode-switch-radio"
                  name="versusrevis-input-mode"
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
            machine="versusrevis"
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
              {"fields" in group ? (
                renderFields(
                  inputMode === "unimemo" && group.title in unimemoInputGroups
                    ? unimemoInputGroups[group.title].fields
                    : group.fields
                )
              ) : (
                <div className="piece-input-group">
                  {group.rows.map((row) => (
                    <div className="piece-input-row" key={row.label}>
                      <p className="piece-input-label">{row.label}</p>
                      <label className="input-field">
                        <span className="input-label">試行</span>
                        <span className="input-control">
                          <input
                            className="number-input number-input-piece"
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
                            className="number-input number-input-piece"
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
