"use client";

import type { Dispatch, SetStateAction } from "react";

export const estimatedBudoInitialValues = {
  grapeDiff: "",
  grapePracticeGames: "",
  grapeGameMode: "fromStart"
};

type GrapeGameMode = "fromStart" | "practice" | "total";

type BonusRate = {
  bb: number;
  rb: number;
};

type ExtraNormalSmallPayout = {
  denominator: number;
  payout: number;
};

type EstimatedBudoSpec = {
  bigPayout: number;
  regPayout: number;
  postAnnouncementBonusRatio: number;
  cherryDenominatorsBySetting: ReadonlyArray<readonly [number, number]>;
  cherryPayout?: number;
  cherryAcquisitionRate?: number;
  extraNormalSmallPayouts?: ExtraNormalSmallPayout[];
  highSettingThreshold?: number;
  highSettingExtraAcquisitionRate?: number;
  lowSettingExtraAcquisitionRate?: number;
};

type EstimatedBudoSource = {
  games: number;
  bb: number;
  rb: number;
};

type EstimatedBudoResult =
  | {
      status: "empty" | "invalid";
      message: string;
    }
  | {
      status: "ok";
      count: number;
      roundedCount: number;
      denominator: number;
      source: EstimatedBudoSource;
    };

type JugglerEstimatedBudoProps<T extends Record<string, unknown>> = {
  spec: EstimatedBudoSpec;
  inputValues: T;
  setInputValues: Dispatch<SetStateAction<T>>;
  settingRates: BonusRate[];
  beforeGames: number;
  beforeBig: number;
  beforeReg: number;
  currentGames: number;
  currentBig: number;
  currentReg: number;
};

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

const grapeEstimateBaseSpec = {
  replayDenominator: 7.3,
  replayPayout: 3,
  grapePayout: 8,
  oneBetGrapeDenominator: 10.3,
  oneBetReplayDenominator: 7.3,
  oneBetGrapePayout: 8,
  oneBetReplayPayout: 1
};

export const jugglerEstimatedBudoSpecs = {
  gogoJuggler3: {
    bigPayout: 240,
    regPayout: 96,
    postAnnouncementBonusRatio: 1,
    cherryDenominatorsBySetting: [
      [1, 33.4],
      [2, 33.3],
      [3, 33.2],
      [4, 33.1],
      [5, 32.9],
      [6, 32.8]
    ]
  },
  funkyJuggler2: {
    bigPayout: 240,
    regPayout: 96,
    postAnnouncementBonusRatio: 0.75,
    cherryDenominatorsBySetting: [
      [1, 35.83],
      [2, 35.46],
      [3, 36.27],
      [4, 35.68],
      [5, 35.64],
      [6, 36.02]
    ]
  },
  jugglerGirls: {
    bigPayout: 240,
    regPayout: 96,
    postAnnouncementBonusRatio: 0.75,
    cherryDenominatorsBySetting: [
      [1, 33.56],
      [2, 33.47],
      [3, 33.32],
      [4, 33.15],
      [5, 33.1],
      [6, 32.97]
    ]
  },
  myJuggler5: {
    bigPayout: 240,
    regPayout: 96,
    postAnnouncementBonusRatio: 0.75,
    cherryDenominatorsBySetting: [
      [1, 38.43],
      [2, 38.29],
      [3, 37.04],
      [4, 35.89],
      [5, 35.82],
      [6, 35.79]
    ]
  },
  sMisterJuggler: {
    bigPayout: 240,
    regPayout: 96,
    postAnnouncementBonusRatio: 0.75,
    cherryPayout: 4,
    cherryAcquisitionRate: 0.97,
    extraNormalSmallPayouts: [
      { denominator: 655.36, payout: 14 },
      { denominator: 655.36, payout: 10 }
    ],
    highSettingThreshold: 3.5,
    highSettingExtraAcquisitionRate: 0.75,
    lowSettingExtraAcquisitionRate: 0.0458817500129305,
    cherryDenominatorsBySetting: [
      [1, 37.24],
      [2, 37.24],
      [3, 37.24],
      [4, 37.24],
      [5, 37.24],
      [6, 37.24]
    ]
  }
} as const satisfies Record<string, EstimatedBudoSpec>;

function toNumber(value: unknown) {
  if (value === null || value === undefined || value === "") {
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

function calculateLogBinomialProbability(successCount: number, totalCount: number, probability: number) {
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

  return (
    logCombination +
    successCount * Math.log(probability) +
    (totalCount - successCount) * Math.log(1 - probability)
  );
}

function calculateBonusAverageSetting(games: number, bb: number, rb: number, settingRates: BonusRate[]) {
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

function interpolateProbability(
  settingAverage: number,
  denominatorRows: ReadonlyArray<readonly [number, number]>
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

function calculateResetOneBetDisplayGames(postAnnouncementBonusCount: number) {
  const continueProbability =
    1 / grapeEstimateBaseSpec.oneBetGrapeDenominator +
    1 / grapeEstimateBaseSpec.oneBetReplayDenominator;
  const expectedDisplayGamesPerBonus =
    Math.pow(continueProbability, 2) / (1 - Math.pow(continueProbability, 3));

  return postAnnouncementBonusCount * expectedDisplayGamesPerBonus;
}

function calculateExtraNormalSmallPayout(
  spec: EstimatedBudoSpec,
  normalGames: number,
  averageSetting: number
) {
  if (!spec.extraNormalSmallPayouts?.length) {
    return 0;
  }

  const threshold = spec.highSettingThreshold;
  const highRate = spec.highSettingExtraAcquisitionRate;
  const lowRate = spec.lowSettingExtraAcquisitionRate;
  const acquisitionRate =
    threshold !== undefined && highRate !== undefined && lowRate !== undefined
      ? averageSetting >= threshold
        ? highRate
        : lowRate
      : 1;

  return (
    normalGames *
    acquisitionRate *
    spec.extraNormalSmallPayouts.reduce((sum, row) => sum + row.payout / row.denominator, 0)
  );
}

function calculateEstimatedBudo(
  differenceValue: number,
  source: EstimatedBudoSource,
  spec: EstimatedBudoSpec,
  settingRates: BonusRate[]
): EstimatedBudoResult {
  if (source.games <= 0 || source.bb < 0 || source.rb < 0) {
    return {
      status: "invalid",
      message: "G数とボーナス回数を確認してください。"
    };
  }

  const bonusCount = source.bb + source.rb;
  const averageSetting = calculateBonusAverageSetting(source.games, source.bb, source.rb, settingRates);
  const cherryProbability = interpolateProbability(averageSetting, spec.cherryDenominatorsBySetting);
  const postAnnouncementBonusCount = bonusCount * spec.postAnnouncementBonusRatio;
  const oneBetEndProbability =
    1 -
    1 / grapeEstimateBaseSpec.oneBetGrapeDenominator -
    1 / grapeEstimateBaseSpec.oneBetReplayDenominator;
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
    differenceValue - postAnnouncementBonusCount / grapeEstimateBaseSpec.oneBetReplayDenominator;
  const totalInvestment = normalGames * 3 + oneBetGames;
  const bonusPayout = source.bb * spec.bigPayout + source.rb * spec.regPayout;
  const totalSmallPayout = correctedDifference + totalInvestment - bonusPayout;
  const replayPayout =
    (normalGames * grapeEstimateBaseSpec.replayPayout) / grapeEstimateBaseSpec.replayDenominator;
  const cherryPayout =
    normalGames *
    (spec.cherryPayout ?? 2) *
    cherryProbability *
    (spec.cherryAcquisitionRate ?? 1);
  const extraNormalSmallPayout = calculateExtraNormalSmallPayout(spec, normalGames, averageSetting);
  const oneBetGrapePayout =
    (oneBetGames * grapeEstimateBaseSpec.oneBetGrapePayout) /
    grapeEstimateBaseSpec.oneBetGrapeDenominator;
  const oneBetReplayPayout =
    (oneBetGames * grapeEstimateBaseSpec.oneBetReplayPayout) /
    grapeEstimateBaseSpec.oneBetReplayDenominator;
  const grapePayout =
    totalSmallPayout -
    replayPayout -
    cherryPayout -
    extraNormalSmallPayout -
    oneBetGrapePayout -
    oneBetReplayPayout;
  const count = grapePayout / grapeEstimateBaseSpec.grapePayout;

  if (!Number.isFinite(count) || count <= 0) {
    return {
      status: "invalid",
      message: "推定ブドウが0以下になりました。差枚数やG数を確認してください。"
    };
  }

  const denominator = normalGames / count;

  if (!Number.isFinite(denominator) || denominator <= 0) {
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
    source
  };
}

export function JugglerEstimatedBudo<T extends Record<string, unknown>>({
  spec,
  inputValues,
  setInputValues,
  settingRates,
  beforeGames,
  beforeBig,
  beforeReg,
  currentGames,
  currentBig,
  currentReg
}: JugglerEstimatedBudoProps<T>) {
  const grapeGameMode =
    inputValues.grapeGameMode === "fromStart" ||
    inputValues.grapeGameMode === "practice" ||
    inputValues.grapeGameMode === "total"
      ? inputValues.grapeGameMode
      : estimatedBudoInitialValues.grapeGameMode;
  const practiceBonus = {
    bb: currentBig - beforeBig,
    rb: currentReg - beforeReg
  };
  const source: EstimatedBudoSource =
    grapeGameMode === "total"
      ? {
          games: currentGames,
          bb: currentBig,
          rb: currentReg
        }
      : grapeGameMode === "practice"
        ? {
            games: toNumber(inputValues.grapePracticeGames),
            bb: practiceBonus.bb,
            rb: practiceBonus.rb
          }
        : {
            games: currentGames - beforeGames,
            bb: practiceBonus.bb,
            rb: practiceBonus.rb
          };
  const grapeDiffRaw = String(inputValues.grapeDiff ?? "");
  const estimatedBudo: EstimatedBudoResult =
    grapeDiffRaw.trim() === ""
      ? {
          status: "empty",
          message: "差枚数を入力すると推定ブドウを表示します。"
        }
      : calculateEstimatedBudo(toNumber(grapeDiffRaw), source, spec, settingRates);

  const updateValue = (key: string, value: string) => {
    setInputValues((current) => ({ ...current, [key]: value }) as T);
  };

  const handleApplyEstimatedBudo = () => {
    if (estimatedBudo.status !== "ok") {
      return;
    }

    updateValue("budo", String(estimatedBudo.roundedCount));
  };

  return (
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
                onChange={(event) => updateValue("grapeDiff", event.target.value)}
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
              onChange={() => updateValue("grapeGameMode", option.value)}
            />
            <span className="choice-text">{option.label}</span>
          </label>
        ))}
      </div>
      {grapeGameMode === "practice" ? (
        <div className="input-row input-row-1">
          <div className="input-field-wrap">
            <label className="input-field">
              <span className="input-label">{grapeGameModeLabels.practice}</span>
              <span className="input-control">
                <input
                  className="number-input"
                  type="number"
                  inputMode="numeric"
                  value={String(inputValues.grapePracticeGames ?? "")}
                  onChange={(event) => updateValue("grapePracticeGames", event.target.value)}
                />
                <span className="input-unit">G</span>
              </span>
            </label>
          </div>
        </div>
      ) : null}
      <div
        className={`estimated-budo-result${
          estimatedBudo.status === "ok" ? " estimated-budo-result-ok" : ""
        }`}
      >
        {estimatedBudo.status === "ok" ? (
          <>
            <div className="estimated-budo-grid">
              <div className="estimated-budo-item">
                <span className="estimated-budo-label">使用G数</span>
                <span className="estimated-budo-value">
                  {Math.round(estimatedBudo.source.games).toLocaleString("ja-JP")}G
                </span>
              </div>
              <div className="estimated-budo-item">
                <span className="estimated-budo-label">使用BB/RB</span>
                <span className="estimated-budo-value">
                  {estimatedBudo.source.bb}/{estimatedBudo.source.rb}
                </span>
              </div>
              <div className="estimated-budo-item">
                <span className="estimated-budo-label">推定ブドウ数</span>
                <span className="estimated-budo-value">
                  {estimatedBudo.count.toLocaleString("ja-JP", {
                    maximumFractionDigits: 1
                  })}
                  個
                </span>
              </div>
              <div className="estimated-budo-item">
                <span className="estimated-budo-label">推定確率</span>
                <span className="estimated-budo-value">
                  1/{formatDenominator(estimatedBudo.denominator)}
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
          <p className="estimated-budo-message">{estimatedBudo.message}</p>
        )}
      </div>
    </section>
  );
}
