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
    fields: ["G数", "BIG", "REG"]
  },
  {
    title: "現在",
    fields: ["G数", "BIG", "REG"]
  },
  {
    title: "小役",
    fields: ["風鈴", "平行氷", "斜め氷"]
  },
  {
    title: "BIG中",
    fields: ["消化G数", "斜め風鈴", "ハズレ"]
  },
  {
    title: "ハナビチャレンジ中",
    fields: ["消化G数", "ハズレ"]
  },
  {
    title: "ハナビゲーム中",
    fields: ["消化G数", "ハズレ"]
  }
];

export default function HanabiPage() {
  return (
    <main className="page-shell">
      <div className="card card-wide">
        <h1 className="title">ハナビ</h1>
        <form className="input-form">
          {inputGroups.map((group, index) => (
            <section className="input-group" key={`${group.title ?? "group"}-${index}`}>
              {group.title ? <p className="group-title">【{group.title}】</p> : null}
              <div
                className={`input-row input-row-${Math.min(group.fields.length, 3)}`}
              >
                {group.fields.map((field) => (
                  <label className="input-field" key={`${group.title ?? "base"}-${field}`}>
                    <span className="input-label">{field}</span>
                    <input
                      className="number-input"
                      type="number"
                      inputMode="numeric"
                    />
                  </label>
                ))}
              </div>
            </section>
          ))}
        </form>
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
