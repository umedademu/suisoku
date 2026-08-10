"use client";

import { useEffect, useState } from "react";
import { SaveSlotControls, useSaveSlots } from "../save-slots";

const settings = [
  { label: "設定1", lowerBellDenominator: 121.1, payout: 97.5 },
  { label: "設定2", lowerBellDenominator: 114.4, payout: 98.5 },
  { label: "設定3", lowerBellDenominator: 112.8, payout: 100.8 },
  { label: "設定4", lowerBellDenominator: 106.2, payout: 106.0 },
  { label: "設定5", lowerBellDenominator: 104.2, payout: 111.0 },
  { label: "設定6", lowerBellDenominator: 99.1, payout: 114.9 }
] as const;

type InputField = {
  key: string;
  label: string;
  unit?: string;
  widthClass?: string;
};

type InputGroup = {
  title: string;
  fields: InputField[];
};

type EstimateResult = {
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
};

const inputGroups: InputGroup[] = [
  {
    title: "開始前",
    fields: [{ key: "beforeGames", label: "G数" }]
  },
  {
    title: "現在",
    fields: [{ key: "currentGames", label: "G数" }]
  },
  {
    title: "小役",
    fields: [{ key: "lowerBells", label: "下段ベル" }]
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

const initialValues: Record<string, string> = {
  beforeGames: "",
  currentGames: "",
  lowerBells: "",
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

export default function Kabaneri2Page() {
  const [inputValues, setInputValues] = useState<Record<string, string>>(initialValues);
  const [estimateResult, setEstimateResult] = useState<EstimateResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasLoadedSavedValues, setHasLoadedSavedValues] = useState(false);

  const resetResults = () => {
    setEstimateResult(null);
    setErrorMessage("");
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

  const handleInputChange = (key: string, value: string) => {
    setInputValues((current) => ({
      ...current,
      [key]: value
    }));
    resetResults();
  };

  const handleEstimate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetResults();

    const beforeGames = toNumber(inputValues.beforeGames ?? "");
    const currentGames = toNumber(inputValues.currentGames ?? "");
    const practiceLowerBells = toNumber(inputValues.lowerBells ?? "");
    const allCounts = [beforeGames, currentGames, practiceLowerBells];

    if (
      (inputValues.currentGames ?? "").trim() === "" ||
      (inputValues.lowerBells ?? "").trim() === ""
    ) {
      setErrorMessage("現在のG数と下段ベルを入力してください。");
      return;
    }

    if (allCounts.some((value) => value < 0 || !Number.isInteger(value))) {
      setErrorMessage("G数と下段ベルは0以上の整数で入力してください。");
      return;
    }

    const practiceGames = currentGames - beforeGames;

    if (practiceGames <= 0) {
      setErrorMessage("現在のG数は開始前のG数より大きい値を入力してください。");
      return;
    }

    if (practiceLowerBells > practiceGames) {
      setErrorMessage("下段ベルの実践回数は実践G数以下にしてください。");
      return;
    }

    const logRows = settings.map((setting) => ({
      label: setting.label,
      logValue: calculateLogBinomialProbability(
        practiceLowerBells,
        practiceGames,
        1 / setting.lowerBellDenominator
      )
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

      return practiceGames * 3 * yenPerMedal * (payoutRate - 1) - cashGapLoss;
    });
    const totalExpectedYen = settingExpectations.reduce(
      (sum, expectedYen, index) => sum + expectedYen * probabilities[index],
      0
    );
    const totalExpectedPayout = settings.reduce(
      (sum, setting, index) => sum + setting.payout * probabilities[index],
      0
    );

    setEstimateResult({
      practiceGames,
      practiceLowerBells,
      measuredRateText: formatMeasuredRate(practiceLowerBells, practiceGames),
      settingRows: settings.map((setting, index) => ({
        label: setting.label,
        value: formatPercent(probabilities[index])
      })),
      expectationRows: settings.map((setting, index) => ({
        label: setting.label,
        payoutText: `${setting.payout.toFixed(1)}%`,
        expectationText: formatYen(settingExpectations[index]),
        probabilityText: formatPercent(probabilities[index]),
        weightedText: formatYen(settingExpectations[index] * probabilities[index])
      })),
      totalPayoutText: `${totalExpectedPayout.toFixed(2)}%`,
      totalExpectationText: formatYen(totalExpectedYen),
      hourlyText: formatHourlyYen((totalExpectedYen * 700) / practiceGames)
    });
  };

  return (
    <main className="page-shell">
      <div className="card card-wide">
        <a className="top-page-link" href="/">
          トップページに戻る
        </a>
        <h1 className="title">カバネリ2</h1>
        <form className="input-form" onSubmit={handleEstimate}>
          {inputGroups.map((group) => (
            <section className="input-group" key={group.title}>
              <div className="group-title-row">
                <p className="group-title">【{group.title}】</p>
              </div>
              <div className={`input-row input-row-${Math.min(group.fields.length, 3)}`}>
                {group.fields.map((field) => (
                  <div className="input-field-wrap" key={field.key}>
                    <label className="input-field">
                      <span className="input-label">{field.label}</span>
                      <span className="input-control">
                        <input
                          className={`number-input${field.widthClass ? ` ${field.widthClass}` : ""}`}
                          type="number"
                          inputMode={field.key === "exchangeRate" ? "decimal" : "numeric"}
                          min="0"
                          step={field.key === "exchangeRate" ? "0.1" : "1"}
                          value={inputValues[field.key] ?? ""}
                          onChange={(event) => handleInputChange(field.key, event.currentTarget.value)}
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
            </section>
          ))}
          <SaveSlotControls {...saveSlots} />
          <div className="action-row">
            <button className="clear-button" type="button" onClick={saveSlots.onClearCurrentData}>
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
                    {estimateResult.practiceGames}G / 下段ベル{estimateResult.practiceLowerBells}回（
                    {estimateResult.measuredRateText}）
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
                          <div className="table-head-sub">{estimateResult.practiceGames}G</div>
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
            </>
          ) : (
            <p className="result-placeholder">推測ボタンを押すとここに結果が出ます。</p>
          )}
        </section>

        <section className="spec-group-wrap">
          <section className="spec-group">
            <h2 className="spec-title">【設定別数値】</h2>
            <div className="table-wrap">
              <table className="data-table data-table-compact">
                <thead>
                  <tr>
                    <th>設定</th>
                    <th>下段ベル</th>
                    <th>機械割</th>
                  </tr>
                </thead>
                <tbody>
                  {settings.map((setting) => (
                    <tr key={`spec-${setting.label}`}>
                      <th scope="row">{setting.label}</th>
                      <td>1/{setting.lowerBellDenominator.toFixed(1)}</td>
                      <td>{setting.payout.toFixed(1)}%</td>
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
