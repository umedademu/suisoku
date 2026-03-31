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
      { label: "平行氷", key: "ice" }
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
  furin: parseRate(setting.furin),
  ice: parseRate(setting.ice),
  nanameBell: parseRate(setting.nanameBell),
  bHazure: parseRate(setting.bHazure),
  cHazure: parseRate(setting.cHazure),
  gHazure: parseRate(setting.gHazure)
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

function formatCountAndProbability(count: number, base: number) {
  return `${count}回（${formatProbability(count, base)}）`;
}

function formatCountBaseAndProbability(count: number, base: number) {
  if (base <= 0) {
    return `${count}回 / ${base}G（-）`;
  }

  return `${count}回 / ${base}G（${formatProbability(count, base)}）`;
}

function calculateBinomialProbability(successCount: number, totalCount: number, probability: number) {
  if (
    totalCount < 0 ||
    successCount < 0 ||
    successCount > totalCount ||
    probability <= 0 ||
    probability >= 1
  ) {
    return 0;
  }

  if (totalCount === 0) {
    return successCount === 0 ? 1 : 0;
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
  const [probabilityGroups, setProbabilityGroups] = useState<
    Array<{ title: string; rows: Array<{ label: string; value: string }> }> | null
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
    const totalIce = heikoIce + nanameIce;
    const twoRoleTotal = furin + totalIce;

    setResultRows([
      {
        label: "実践G数",
        value: `${practiceGames}G`
      },
      {
        label: "BIG",
        value: formatCountAndProbability(practiceBig, practiceGames)
      },
      {
        label: "REG",
        value: formatCountAndProbability(practiceReg, practiceGames)
      },
      {
        label: "合算",
        value: formatCountAndProbability(totalBonus, practiceGames)
      },
      {
        label: "風鈴",
        value: formatCountAndProbability(furin, practiceGames)
      },
      {
        label: "氷",
        value: formatCountAndProbability(totalIce, practiceGames)
      },
      {
        label: "2役合算",
        value: formatCountAndProbability(twoRoleTotal, practiceGames)
      },
      {
        label: "BIG中斜め風鈴",
        value: formatCountBaseAndProbability(bigInNanameFurin, bigInGames)
      },
      {
        label: "BIG中ハズレ",
        value: formatCountBaseAndProbability(bigInHazure, bigInGames)
      },
      {
        label: "ハナビチャレンジ中ハズレ",
        value: formatCountBaseAndProbability(challengeHazure, challengeGames)
      },
      {
        label: "ハナビゲーム中ハズレ",
        value: formatCountBaseAndProbability(gameHazure, gameGames)
      }
    ]);

    const probabilityDefinitions = [
      {
        title: "BIG",
        count: practiceBig,
        base: practiceGames,
        key: "bb" as const
      },
      {
        title: "REG",
        count: practiceReg,
        base: practiceGames,
        key: "rb" as const
      },
      {
        title: "通常時風鈴",
        count: furin,
        base: practiceGames,
        key: "furin" as const
      },
      {
        title: "通常時平行氷",
        count: heikoIce,
        base: practiceGames,
        key: "ice" as const
      },
      {
        title: "BIG中斜め風鈴",
        count: bigInNanameFurin,
        base: bigInGames,
        key: "nanameBell" as const
      },
      {
        title: "BIG中ハズレ",
        count: bigInHazure,
        base: bigInGames,
        key: "bHazure" as const
      },
      {
        title: "花火チャレンジ中ハズレ",
        count: challengeHazure,
        base: challengeGames,
        key: "cHazure" as const
      },
      {
        title: "花火ゲーム中ハズレ",
        count: gameHazure,
        base: gameGames,
        key: "gHazure" as const
      }
    ];

    setProbabilityGroups(
      probabilityDefinitions.map((definition) => ({
        title: definition.title,
        rows: settingRates.map((setting) => ({
          label: setting.label,
          value: formatPercent(
            calculateBinomialProbability(
              definition.count,
              definition.base,
              setting[definition.key]
            )
          )
        }))
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
                  <h3 className="result-subtitle">設定別のその確率になる確率</h3>
                  {probabilityGroups.map((group) => (
                    <section className="result-metric-group" key={group.title}>
                      <h4 className="result-metric-title">{group.title}</h4>
                      <div className="result-list">
                        {group.rows.map((row) => (
                          <div className="result-item" key={`${group.title}-${row.label}`}>
                            <p className="result-label">{row.label}</p>
                            <p className="result-value">{row.value}</p>
                          </div>
                        ))}
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
                    {settings.map((row) => (
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
