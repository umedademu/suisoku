import { UnimemoMachineConfig } from "../types";

export const thundervUnimemoConfig: UnimemoMachineConfig = {
  id: "thunderv",
  successMessage: "ユニメモ画像から入力しました。",
  defaults: {
    beforeGames: "0",
    beforeBig: "0",
    beforeReg: "0"
  },
  layoutGuide: `
- 基本情報: 総プレイ数 -> 総ボーナス回数 -> 最大獲得枚数
- 小役: ベルA -> ベルB -> スイカ -> チェリーA -> チェリーB
- ボーナス関連: 総ボーナス回数 -> 総BB回数 -> VB回数 -> 赤7B回数 -> RB回数 -> 最大連荘回数 -> 特殊7BB回数 -> 最大特殊7BB連荘回数
- BB中小役: BB中ベルB回数 -> BB中ベルC回数
- リーチ目スコア: 獲得スコア
- リーチ目コレクション: 新規
`,
  fields: [
    { key: "currentGames", kind: "integer", description: "総プレイ数。例: 84" },
    { key: "currentBig", kind: "integer", description: "総BB回数。赤7BBなどを含めたBB合計。例: 2" },
    { key: "currentReg", kind: "integer", description: "RB回数。例: 0" },
    { key: "bellA", kind: "integer", description: "小役のベルA回数。例: 2" },
    { key: "bellB", kind: "integer", description: "小役のベルB回数。例: 4" },
    { key: "cherryB", kind: "integer", description: "小役のチェリーB回数。例: 5" },
    { key: "suikaA", kind: "integer", description: "小役のスイカA回数。スイカAとスイカBに分かれていない画像ならnull" },
    { key: "suikaB", kind: "integer", description: "小役のスイカB回数。スイカAとスイカBに分かれていない画像ならnull" },
    { key: "bonusBellB", kind: "integer", description: "BB中またはボーナス中のベルB回数。例: 3" },
    { key: "bonusBellBRate", kind: "rate", description: "BB中またはボーナス中のベルB確率の分母。1/10.0なら10.0" },
    { key: "bonusBellC", kind: "integer", description: "BB中またはボーナス中のベルC回数。例: 0" },
    { key: "bonusReach", kind: "integer", description: "ボーナス中のリーチ目回数。リーチ目スコアは使わない。見当たらない場合はnull" }
  ],
  prompt: `
スマスロ サンダーVのユニメモ遊技履歴画像から、推測入力に必要な数値だけを読み取ってください。

読み取り対象:
- 基本情報: 総プレイ数、総BB回数、RB回数
- 小役: ベルA回数、ベルB回数、チェリーB回数、スイカA回数、スイカB回数
- BB中小役またはボーナス中小役: ベルB回数と確率、ベルC回数、リーチ目回数

総ボーナス回数ではなく、BBは総BB回数、REGはRB回数を使ってください。
スイカがA/Bに分かれておらず「スイカ」とだけ表示されている場合、スイカAとスイカBはnullにしてください。
確率は「1/10.0」のように表示されている場合、分母だけを数値にしてください。
「リーチ目スコア」「獲得スコア」「最大獲得枚数」「最大連荘回数」は使わないでください。
見当たらない項目や「1/-」の確率はnullにしてください。
`
};
