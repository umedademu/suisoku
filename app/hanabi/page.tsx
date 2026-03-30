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

export default function HanabiPage() {
  const [inputValues, setInputValues] = useState<Record<string, string>>(initialValues);
  const [resultRows, setResultRows] = useState<Array<{ label: string; value: string }> | null>(
    null
  );

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
    const bigInNanameFurin = toNumber(inputValues.bigInNanameFurin);
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
    const bigBaseGames = practiceBig * 24;

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
        value: formatCountBaseAndProbability(bigInNanameFurin, bigBaseGames)
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
            <div className="result-list">
              {resultRows.map((row) => (
                <div className="result-item" key={row.label}>
                  <p className="result-label">{row.label}</p>
                  <p className="result-value">{row.value}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="result-placeholder">推測ボタンを押すとここに結果が出ます。</p>
          )}
        </section>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ハナビ設定差</th>
                <th>BB</th>
                <th>RB</th>
                <th>風鈴</th>
                <th>氷</th>
                <th>斜ベル</th>
                <th>B外れ</th>
                <th>C外れ</th>
                <th>G外れ</th>
                <th>機械割</th>
              </tr>
            </thead>
            <tbody>
              {settings.map((row) => (
                <tr key={row.setting}>
                  <th scope="row">{row.setting}</th>
                  <td>{row.bb}</td>
                  <td>{row.rb}</td>
                  <td>{row.furin}</td>
                  <td>{row.ice}</td>
                  <td>{row.nanameBell}</td>
                  <td>{row.bHazure}</td>
                  <td>{row.cHazure}</td>
                  <td>{row.gHazure}</td>
                  <td>{row.payout}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
