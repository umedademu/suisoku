"use client";

import { useState } from "react";

const settings = [
  {
    setting: "設定1",
    bb: "1/277.7",
    rb: "1/356.2",
    furinA: "1/15.3",
    furinB: "1/15.3",
    iceA: "1/52.9",
    cherryA2: "1/21.0",
    cherryB: "1/282.5",
    bigFurinB: "1/11.0",
    bigBarake: "1/16384.0",
    regOneRole: "1/8.0",
    regHazure: "1/16384.0",
    challengeHazure: "1/6.0",
    gameHazure: "1/13.4",
    payout: "98.1%",
    payoutFull: "102.0%"
  },
  {
    setting: "設定2",
    bb: "1/268.6",
    rb: "1/331.0",
    furinA: "1/14.9",
    furinB: "1/15.6",
    iceA: "1/53.5",
    cherryA2: "1/19.3",
    cherryB: "1/281.3",
    bigFurinB: "1/9.0",
    bigBarake: "1/16384.0",
    regOneRole: "1/8.0",
    regHazure: "1/16384.0",
    challengeHazure: "1/5.8",
    gameHazure: "1/12.4",
    payout: "99.9%",
    payoutFull: "104.0%"
  },
  {
    setting: "設定5",
    bb: "1/256.0",
    rb: "1/306.2",
    furinA: "1/14.5",
    furinB: "1/15.3",
    iceA: "1/49.6",
    cherryA2: "1/20.6",
    cherryB: "1/276.5",
    bigFurinB: "1/11.0",
    bigBarake: "1/16384.0",
    regOneRole: "1/7.0",
    regHazure: "1/376.6",
    challengeHazure: "1/5.3",
    gameHazure: "1/10.1",
    payout: "102.3%",
    payoutFull: "106.5%"
  },
  {
    setting: "設定6",
    bb: "1/248.2",
    rb: "1/280.1",
    furinA: "1/14.1",
    furinB: "1/15.1",
    iceA: "1/50.8",
    cherryA2: "1/19.9",
    cherryB: "1/274.2",
    bigFurinB: "1/9.0",
    bigBarake: "1/655.4",
    regOneRole: "1/7.0",
    regHazure: "1/376.6",
    challengeHazure: "1/5.1",
    gameHazure: "1/9.5",
    payout: "104.6%",
    payoutFull: "109.0%"
  }
];

const inputGroups = [
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
      { key: "furinA", label: "風鈴A" },
      { key: "furinB", label: "風鈴B" },
      { key: "iceA", label: "氷A" },
      { key: "cherryA2", label: "チェリーA2" },
      { key: "cherryB", label: "チェリーB" }
    ]
  },
  {
    title: "BIG中",
    fields: [
      { key: "bigGames", label: "消化G数" },
      { key: "bigFurinB", label: "風鈴B" },
      { key: "bigBarake", label: "バラケ目" }
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
    title: "花火チャレ",
    fields: [
      { key: "challengeGames", label: "消化G数" },
      { key: "challengeHazure", label: "ハズレ" }
    ]
  },
  {
    title: "花火ゲーム",
    fields: [
      { key: "gameGames", label: "消化G数" },
      { key: "gameHazure", label: "ハズレ" }
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

const initialValues = {
  ...Object.fromEntries(inputGroups.flatMap((group) => group.fields.map((field) => [field.key, ""]))),
  medalRent: "46",
  exchangeRate: "5.0",
  strategyRate: "75"
};

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
      { label: "風鈴A", key: "furinA" },
      { label: "風鈴B", key: "furinB" },
      { label: "風鈴合算", key: "furinTotal" },
      { label: "氷A", key: "iceA" },
      { label: "チェリーA2", key: "cherryA2" },
      { label: "チェリーB", key: "cherryB" }
    ]
  },
  {
    title: "BIG中",
    columns: [
      { label: "風鈴B", key: "bigFurinB" },
      { label: "バラケ目", key: "bigBarake" }
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
    title: "花火チャレ",
    columns: [{ label: "ハズレ", key: "challengeHazure" }]
  },
  {
    title: "花火ゲーム",
    columns: [{ label: "ハズレ", key: "gameHazure" }]
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
      { title: "風鈴A", key: "furinA" as const },
      { title: "風鈴B", key: "furinB" as const },
      { title: "風鈴合算", key: "furinTotal" as const },
      { title: "氷A", key: "iceA" as const },
      { title: "チェリーA2", key: "cherryA2" as const },
      { title: "チェリーB", key: "cherryB" as const }
    ]
  },
  {
    title: "BIG中",
    items: [
      { title: "風鈴B", key: "bigFurinB" as const },
      { title: "バラケ目", key: "bigBarake" as const }
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
    title: "花火チャレ中",
    items: [{ title: "ハズレ", key: "challengeHazure" as const }]
  },
  {
    title: "花火ゲーム中",
    items: [{ title: "ハズレ", key: "gameHazure" as const }]
  }
] as const;

type RateKey =
  | "bb"
  | "rb"
  | "sum"
  | "furinA"
  | "furinB"
  | "furinTotal"
  | "iceA"
  | "cherryA2"
  | "cherryB"
  | "bigFurinB"
  | "bigBarake"
  | "regOneRole"
  | "regHazure"
  | "challengeHazure"
  | "gameHazure";

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
  furinA: parseRate(setting.furinA),
  furinB: parseRate(setting.furinB),
  furinTotal: parseRate(setting.furinA) + parseRate(setting.furinB),
  iceA: parseRate(setting.iceA),
  cherryA2: parseRate(setting.cherryA2),
  cherryB: parseRate(setting.cherryB),
  bigFurinB: parseRate(setting.bigFurinB),
  bigBarake: parseRate(setting.bigBarake),
  regOneRole: parseRate(setting.regOneRole),
  regHazure: parseRate(setting.regHazure),
  challengeHazure: parseRate(setting.challengeHazure),
  gameHazure: parseRate(setting.gameHazure)
}));

const settingsDisplay = settings.map((setting) => ({
  setting: setting.setting,
  bb: formatRateFromProbability(parseRate(setting.bb)),
  rb: formatRateFromProbability(parseRate(setting.rb)),
  furinA: formatRateFromProbability(parseRate(setting.furinA)),
  furinB: formatRateFromProbability(parseRate(setting.furinB)),
  furinTotal: formatRateFromProbability(parseRate(setting.furinA) + parseRate(setting.furinB)),
  iceA: formatRateFromProbability(parseRate(setting.iceA)),
  cherryA2: formatRateFromProbability(parseRate(setting.cherryA2)),
  cherryB: formatRateFromProbability(parseRate(setting.cherryB)),
  bigFurinB: formatRateFromProbability(parseRate(setting.bigFurinB)),
  bigBarake: formatRateFromProbability(parseRate(setting.bigBarake)),
  regOneRole: formatRateFromProbability(parseRate(setting.regOneRole)),
  regHazure: formatRateFromProbability(parseRate(setting.regHazure)),
  challengeHazure: formatRateFromProbability(parseRate(setting.challengeHazure)),
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

export default function ShinHanabiPage() {
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

  const handleEstimate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const beforeGames = toNumber(inputValues.beforeGames);
    const beforeBig = toNumber(inputValues.beforeBig);
    const beforeReg = toNumber(inputValues.beforeReg);
    const currentGames = toNumber(inputValues.currentGames);
    const currentBig = toNumber(inputValues.currentBig);
    const currentReg = toNumber(inputValues.currentReg);
    const furinA = toNumber(inputValues.furinA);
    const furinB = toNumber(inputValues.furinB);
    const iceA = toNumber(inputValues.iceA);
    const cherryA2 = toNumber(inputValues.cherryA2);
    const cherryB = toNumber(inputValues.cherryB);
    const bigGames = toNumber(inputValues.bigGames);
    const bigFurinB = toNumber(inputValues.bigFurinB);
    const bigBarake = toNumber(inputValues.bigBarake);
    const regGames = toNumber(inputValues.regGames);
    const regOneRole = toNumber(inputValues.regOneRole);
    const regHazure = toNumber(inputValues.regHazure);
    const challengeGames = toNumber(inputValues.challengeGames);
    const challengeHazure = toNumber(inputValues.challengeHazure);
    const gameGames = toNumber(inputValues.gameGames);
    const gameHazure = toNumber(inputValues.gameHazure);
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
    const practiceBig = currentBig - beforeBig;
    const practiceReg = currentReg - beforeReg;
    const totalBonus = practiceBig + practiceReg;
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
        count: practiceBig,
        base: practiceGames
      },
      {
        key: "rb",
        title: "REG",
        count: practiceReg,
        base: practiceGames
      },
      {
        key: "sum",
        title: "合算",
        count: totalBonus,
        base: practiceGames
      },
      {
        key: "furinA",
        title: "通常時風鈴A",
        count: furinA,
        base: practiceGames
      },
      {
        key: "furinB",
        title: "通常時風鈴B",
        count: furinB,
        base: practiceGames
      },
      {
        key: "furinTotal",
        title: "通常時風鈴合算",
        count: furinA + furinB,
        base: practiceGames
      },
      {
        key: "iceA",
        title: "通常時氷A",
        count: iceA,
        base: practiceGames
      },
      {
        key: "cherryA2",
        title: "通常時チェリーA2",
        count: cherryA2,
        base: practiceGames
      },
      {
        key: "cherryB",
        title: "通常時チェリーB",
        count: cherryB,
        base: practiceGames
      },
      {
        key: "bigFurinB",
        title: "BIG中風鈴B",
        count: bigFurinB,
        base: bigGames
      },
      {
        key: "bigBarake",
        title: "BIG中バラケ目",
        count: bigBarake,
        base: bigGames
      },
      {
        key: "regOneRole",
        title: "REG中1枚役",
        count: regOneRole,
        base: regGames
      },
      {
        key: "regHazure",
        title: "REG中ハズレ",
        count: regHazure,
        base: regGames
      },
      {
        key: "challengeHazure",
        title: "花火チャレ中ハズレ",
        count: challengeHazure,
        base: challengeGames
      },
      {
        key: "gameHazure",
        title: "花火ゲーム中ハズレ",
        count: gameHazure,
        base: gameGames
      }
    ];

    const probabilityDefinitionMap = Object.fromEntries(
      probabilityDefinitions.map((definition) => [definition.key, definition])
    ) as Record<RateKey, (typeof probabilityDefinitions)[number]>;

    const validProbabilityDefinitions = probabilityDefinitions.filter(
      (definition) =>
        definition.key !== "sum" &&
        definition.key !== "furinTotal" &&
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

  return (
    <main className="page-shell">
      <div className="card card-wide">
        <h1 className="title">新ハナビ</h1>
        <form className="input-form" onSubmit={handleEstimate}>
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
              <div className={`input-row input-row-${Math.min(group.fields.length, 3)}`}>
                {group.fields.map((field) => (
                  <div className="input-field-wrap" key={field.key}>
                    <label className="input-field">
                      <span className="input-label">{field.label}</span>
                      <span className="input-control">
                        <input
                          className={`number-input${"compact" in field && field.compact ? " number-input-compact" : ""}${"widthClass" in field && field.widthClass ? ` ${field.widthClass}` : ""}`}
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
                        {"unit" in field && field.unit ? (
                          <span className="input-unit">{field.unit}</span>
                        ) : null}
                        {liveFieldTexts[field.key] ? (
                          <span className="input-live-text">{liveFieldTexts[field.key]}</span>
                        ) : null}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </section>
          ))}
          <div className="action-row">
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
