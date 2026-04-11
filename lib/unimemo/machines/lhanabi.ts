import { UnimemoMachineConfig } from "../types";

export const lhanabiUnimemoConfig: UnimemoMachineConfig = {
  id: "lhanabi",
  successMessage: "ユニメモ画像から入力しました。",
  defaults: {
    beforeGames: "0",
    beforeBig: "0",
    beforeReg: "0"
  },
  fields: [
    { key: "currentGames", kind: "integer", description: "総プレイ数。例: 7710" },
    { key: "currentBig", kind: "integer", description: "総BB回数。例: 31" },
    { key: "currentReg", kind: "integer", description: "総RB回数。例: 26" },
    { key: "furinA", kind: "integer", description: "通常時小役の風鈴A回数。例: 647" },
    { key: "furinB", kind: "integer", description: "通常時小役の風鈴B回数。例: 235" },
    { key: "cherryA2", kind: "integer", description: "通常時小役のチェリーA2回数。例: 397" },
    { key: "challengeHazure", kind: "integer", description: "RT中小役の花火チャレンジはずれ回数。例: 113" },
    { key: "challengeHazureRate", kind: "rate", description: "花火チャレンジはずれ確率の分母。1/3.8なら3.8" },
    { key: "gameHazure", kind: "integer", description: "RT中小役の花火GAMEはずれ回数。例: 103" },
    { key: "gameHazureRate", kind: "rate", description: "花火GAMEはずれ確率の分母。1/5.0なら5.0" },
    { key: "bigFurinB", kind: "integer", description: "BB中小役の風鈴B回数。例: 100" },
    { key: "bigFurinBRate", kind: "rate", description: "BB中小役の風鈴B確率の分母。1/6.2なら6.2" },
    { key: "bigBarake", kind: "integer", description: "BB中小役のハズレ目またはバラケ目回数。例: 1" },
    { key: "regOneRole", kind: "integer", description: "RB中小役の1枚役回数。例: 35" },
    { key: "regOneRoleRate", kind: "rate", description: "RB中小役の1枚役確率の分母。1/6.9なら6.9" },
    { key: "regBarake", kind: "integer", description: "RB中小役のハズレ目またはバラケ目回数。見当たらない場合はnull" }
  ],
  prompt: `
スマスロ Lハナビのユニメモ遊技履歴画像から、推測入力に必要な数値だけを読み取ってください。

読み取り対象:
- 本情報: 総プレイ数、総BB回数、総RB回数
- 通常時小役: 風鈴A回数、風鈴B回数、チェリーA2回数
- RT中小役: 花火チャレンジはずれ回数と確率、花火GAMEはずれ回数と確率
- BB中小役: 風鈴B回数と確率、ハズレ目またはバラケ目回数
- RB中小役: 1枚役回数と確率、ハズレ目またはバラケ目回数

確率は「1/3.8」のように表示されている場合、分母だけを数値にしてください。
「チェリー合算」「風鈴合算」「氷」「BGM」「リーチ目スコア」「最大獲得枚数」は使わないでください。
見当たらない項目や「1/-」の確率はnullにしてください。
`
};
