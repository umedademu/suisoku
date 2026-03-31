"use client";

import { useState } from "react";

const settings = [
  {
    setting: "設定1",
    bb: "1/312.1",
    rb: "1/385.5",
    furin: "1/15.6",
    ice: "1/52.8",
    nanameBell: "1/10.6",
    bHazure: "1/16384",
    cHazure: "1/7.0",
    gHazure: "1/13.3",
    payout: "98.5%"
  },
  {
    setting: "設定2",
    bb: "1/303.4",
    rb: "1/368.2",
    furin: "1/15.3",
    ice: "1/52.8",
    nanameBell: "1/8.2",
    bHazure: "1/16384",
    cHazure: "1/6.6",
    gHazure: "1/11.8",
    payout: "100.4%"
  },
  {
    setting: "設定5",
    bb: "1/292.6",
    rb: "1/348.6",
    furin: "1/14.9",
    ice: "1/48.0",
    nanameBell: "1/10.6",
    bHazure: "1/482",
    cHazure: "1/6.1",
    gHazure: "1/10.4",
    payout: "103.6%"
  },
  {
    setting: "設定6",
    bb: "1/277.7",
    rb: "1/324.4",
    furin: "1/14.6",
    ice: "1/48.0",
    nanameBell: "1/8.2",
    bHazure: "1/482",
    cHazure: "1/5.8",
    gHazure: "1/9.4",
    payout: "106.7%"
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
    title: "小役",
    fields: [
      { key: "furin", label: "風鈴" },
      { key: "heikoIce", label: "平行氷" },
      { key: "nanameIce", label: "斜め氷" }
    ]
  },
  {
    title: "BIG中",
    fields: [
      { key: "bigInGames", label: "消化G数" },
      { key: "bigInNanameFurin", label: "斜め風鈴" },
      { key: "bigInHazure", label: "ハズレ" }
    ]
  },
  {
    title: "ハナビチャレンジ中",
    fields: [
      { key: "challengeGames", label: "消化G数" },
      { key: "challengeHazure", label: "ハズレ" }
    ]
  },
  {
    title: "ハナビゲーム中",
    fields: [
      { key: "gameGames", label: "消化G数" },
      { key: "gameHazure", label: "ハズレ" }
    ]
  }
];

const initialValues = Object.fromEntries(
  inputGroups.flatMap((group) => group.fields.map((field) => [field.key, ""]))
);

const specGroups = [
  {
    title: "基本スペック",
    columns: [
      { label: "BIG", key: "bb" },
      { label: "REG", key: "rb" },
      { label: "機械割", key: "payout" }
    ]
  },
  {
    title: "通常時小役",
    columns: [
      { label: "風鈴", key: "furin" },
      { label: "平行氷", key: "ice" },
      { label: "2役合算", key: "pairTotal" }
    ]
  },
  {
    title: "BIG中",
    columns: [
      { label: "斜め風鈴", key: "nanameBell" },
      { label: "ハズレ", key: "bHazure" }
    ]
  },
  {
    title: "花火チャレンジ中",
    columns: [{ label: "ハズレ", key: "cHazure" }]
  },
  {
    title: "花火ゲーム中",
    columns: [{ label: "ハズレ", key: "gHazure" }]
  }
] as const;

const probabilityDisplayGroups = [
  {
    title: "基本スペック",
    items: [
      { title: "BIG", key: "bb" as const },
      { title: "REG", key: "rb" as const },
      { title: "合算", key: "sum" as const }
    ]
  },
  {
    title: "通常時小役",
    items: [
      { title: "通常時風鈴", key: "furin" as const },
      { title: "通常時平行氷", key: "ice" as const },
      { title: "2役合算", key: "pairTotal" as const }
    ]
  },
  {
    title: "BIG中",
    items: [
      { title: "BIG中斜め風鈴", key: "nanameBell" as const },
      { title: "BIG中ハズレ", key: "bHazure" as const }
    ]
  },
  {
    title: "花火チャレンジ中",
    items: [{ title: "花火チャレンジ中ハズレ", key: "cHazure" as const }]
  },
  {
    title: "花火ゲーム中",
    items: [{ title: "花火ゲーム中ハズレ", key: "gHazure" as const }]
  }
] as const;

type RateKey =
  | "bb"
  | "rb"
  | "sum"
  | "furin"
  | "ice"
  | "pairTotal"
  | "nanameBell"
  | "bHazure"
  | "cHazure"
  | "gHazure";

function parseRate(value: string) {
  const trimmed = value.replace("1/", "");
  const denominator = Number(trimmed);

  if (!Number.isFinite(denominator) || denominator <= 0) {
    return 0;
  }

  return 1 / denominator;
}

const settingRates = settings.map((setting) => ({
  label: setting.setting,
  bb: parseRate(setting.bb),
  rb: parseRate(setting.rb),
  sum: parseRate(setting.bb) + parseRate(setting.rb),
  furin: parseRate(setting.furin),
  ice: parseRate(setting.ice),
  pairTotal: parseRate(setting.furin) + parseRate(setting.ice),
  nanameBell: parseRate(setting.nanameBell),
  bHazure: parseRate(setting.bHazure),
  cHazure: parseRate(setting.cHazure),
  gHazure: parseRate(setting.gHazure)
}));

const settingsDisplay = settings.map((setting) => ({
  ...setting,
  pairTotal: formatRateFromProbability(parseRate(setting.furin) + parseRate(setting.ice))
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
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
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

function formatCountAndProbability(count: number, base: number) {
  return `${count}回（${formatProbability(count, base)}）`;
}

function formatCountBaseAndProbability(count: number, base: number) {
  if (base <= 0) {
    return `${count}回 / ${base}G（-）`;
  }

  return `${count}回 / ${base}G（${formatProbability(count, base)}）`;
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

export default function HanabiPage() {
  const [inputValues, setInputValues] = useState<Record<string, string>>(initialValues);
  const [resultRows, setResultRows] = useState<Array<{ label: string; value: string }> | null>(
    null
  );
  const [overallSettingRows, setOverallSettingRows] = useState<
    Array<{ label: string; value: string }> | null
  >(null);
  const [probabilityGroups, setProbabilityGroups] = useState<
    Array<{
      title: string;
      columns: Array<{
        label: string;
        summary: string;
        values: Array<{ label: string; value: string }>;
      }>;
    }> | null
  >(null);

  const handleEstimate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const beforeGames = toNumber(inputValues.beforeGames);
    const beforeBig = toNumber(inputValues.beforeBig);
    const beforeReg = toNumber(inputValues.beforeReg);
    const currentGames = toNumber(inputValues.currentGames);
    const currentBig = toNumber(inputValues.currentBig);
    const currentReg = toNumber(inputValues.currentReg);
    const furin = toNumber(inputValues.furin);
    const heikoIce = toNumber(inputValues.heikoIce);
    const nanameIce = toNumber(inputValues.nanameIce);
    const bigInGames = toNumber(inputValues.bigInGames);
    const bigInNanameFurin = toNumber(inputValues.bigInNanameFurin);
    const bigInHazure = toNumber(inputValues.bigInHazure);
    const challengeGames = toNumber(inputValues.challengeGames);
    const challengeHazure = toNumber(inputValues.challengeHazure);
    const gameGames = toNumber(inputValues.gameGames);
    const gameHazure = toNumber(inputValues.gameHazure);

    const practiceGames = currentGames - beforeGames;
    const practiceBig = currentBig - beforeBig;
    const practiceReg = currentReg - beforeReg;
    const totalBonus = practiceBig + practiceReg;
    setResultRows([
      {
        label: "実践G数",
        value: `${practiceGames}G`
      }
    ]);

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
        key: "furin",
        title: "通常時風鈴",
        count: furin,
        base: practiceGames
      },
      {
        key: "ice",
        title: "通常時平行氷",
        count: heikoIce,
        base: practiceGames
      },
      {
        key: "pairTotal",
        title: "2役合算",
        count: furin + heikoIce,
        base: practiceGames
      },
      {
        key: "nanameBell",
        title: "BIG中斜め風鈴",
        count: bigInNanameFurin,
        base: bigInGames
      },
      {
        key: "bHazure",
        title: "BIG中ハズレ",
        count: bigInHazure,
        base: bigInGames
      },
      {
        key: "cHazure",
        title: "花火チャレンジ中ハズレ",
        count: challengeHazure,
        base: challengeGames
      },
      {
        key: "gHazure",
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
        definition.key !== "pairTotal" &&
        definition.base > 0 &&
        definition.count >= 0 &&
        definition.count <= definition.base
    );

    setProbabilityGroups(
      probabilityDisplayGroups.map((group) => ({
        title: group.title,
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
            summary:
              definition.base > 0
                ? `${definition.count}回 / ${formatProbability(definition.count, definition.base)}`
                : `${definition.count}回 / -`,
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
  };

  return (
    <main className="page-shell">
      <div className="card card-wide">
        <h1 className="title">ハナビ</h1>
        <form className="input-form" onSubmit={handleEstimate}>
          {inputGroups.map((group, index) => (
            <section className="input-group" key={`${group.title ?? "group"}-${index}`}>
              {group.title ? <p className="group-title">【{group.title}】</p> : null}
              <div
                className={`input-row input-row-${Math.min(group.fields.length, 3)}`}
              >
                {group.fields.map((field) => (
                  <label className="input-field" key={field.key}>
                    <span className="input-label">{field.label}</span>
                    <input
                      className="number-input"
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
                  </label>
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
          {resultRows ? (
            <>
              {overallSettingRows ? (
                <div className="result-subgroup">
                  <h3 className="result-subtitle">総合推測</h3>
                  <div className="result-list">
                    {overallSettingRows.map((row) => (
                      <div className="result-item" key={`overall-${row.label}`}>
                        <p className="result-label">{row.label}</p>
                        <p className="result-value">{row.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="result-list">
                {resultRows.map((row) => (
                  <div className="result-item" key={row.label}>
                    <p className="result-label">{row.label}</p>
                    <p className="result-value">{row.value}</p>
                  </div>
                ))}
              </div>
              {probabilityGroups ? (
                <div className="result-subgroup">
                  <h3 className="result-subtitle">各項目ごとの設定別割合</h3>
                  {probabilityGroups.map((group) => (
                    <section className="result-metric-group" key={group.title}>
                      <h4 className="result-metric-title">{group.title}</h4>
                      <div className="table-wrap table-wrap-tight">
                        <table className="data-table data-table-compact">
                          <thead>
                            <tr>
                              <th>設定</th>
                              {group.columns.map((column) => (
                                <th key={`${group.title}-${column.label}`}>
                                  <div className="table-head-main">{column.label}</div>
                                  <div className="table-head-sub">{column.summary}</div>
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
                          <td key={`${row.setting}-${column.key}`}>
                            {row[column.key]}
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
