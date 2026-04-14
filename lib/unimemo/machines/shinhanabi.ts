import { UnimemoMachineConfig } from "../types";

export const shinhanabiUnimemoConfig: UnimemoMachineConfig = {
  id: "shinhanabi",
  successMessage: "ユニメモ画像から入力しました。",
  defaults: {
    beforeGames: "0",
    beforeBig: "0",
    beforeReg: "0"
  },
  layoutGuide: `
- 基本情報: 総プレイ数 -> 総ボーナス -> 総BB -> ドンBB -> 赤七BB -> RB
- 小役: 風鈴合算 -> 風鈴A -> 風鈴B -> 氷合算 -> 氷A -> 氷B -> チェリー合算 -> チェリーA1 -> チェリーA2 -> チェリーB
- RT詳細: 花火チャレンジ中はずれ -> 花火GAME中はずれ
- BB中詳細: 風鈴中段揃い -> 風鈴斜め揃い -> バラケ目
- RB中詳細（小役）: 1枚役
- RB中詳細（その他）: ハズレ -> 最大成功 -> 最大神技 -> 最大獲得枚数
- 連チャンBGM: 大花火 -> ドンちゃん2
- その他: 最大RT連チャン -> 100G以内最大連チャン -> 100G以内最大獲得枚数
- リーチ目コレクション: 新規
`,
  fields: [
    { key: "currentGames", kind: "integer", description: "総プレイ数。例: 171" },
    { key: "currentBig", kind: "integer", description: "総BB回数。ドンBBや赤七BBを含めたBB合計。例: 0" },
    { key: "currentReg", kind: "integer", description: "RB回数。例: 0" },
    { key: "furinA", kind: "integer", description: "小役の風鈴A回数。例: 11" },
    { key: "furinB", kind: "integer", description: "小役の風鈴B回数。例: 7" },
    { key: "iceA", kind: "integer", description: "小役の氷A回数。例: 3" },
    { key: "cherryA2", kind: "integer", description: "小役のチェリーA2回数。例: 8" },
    { key: "cherryB", kind: "integer", description: "小役のチェリーB回数。例: 1" },
    { key: "challengeHazure", kind: "integer", description: "RT詳細の花火チャレンジ中はずれ回数。例: 0" },
    { key: "challengeHazureRate", kind: "rate", description: "花火チャレンジ中はずれ確率の分母。1/6.0なら6.0" },
    { key: "gameHazure", kind: "integer", description: "RT詳細の花火GAME中はずれ回数。例: 0" },
    { key: "gameHazureRate", kind: "rate", description: "花火GAME中はずれ確率の分母。1/13.4なら13.4" },
    { key: "bigFurinB", kind: "integer", description: "BB中詳細の風鈴斜め揃い回数、または風鈴B回数。例: 0" },
    { key: "bigFurinBRate", kind: "rate", description: "BB中詳細の風鈴斜め揃い確率、または風鈴B確率の分母。1/11.0なら11.0" },
    { key: "bigBarake", kind: "integer", description: "BB中詳細のバラケ目回数。見当たらない場合はnull" },
    { key: "regOneRole", kind: "integer", description: "RB中詳細(小役)の1枚役回数。例: 0" },
    { key: "regOneRoleRate", kind: "rate", description: "RB中詳細(小役)の1枚役確率の分母。1/8.0なら8.0" },
    { key: "regHazure", kind: "integer", description: "RB中詳細(その他)のハズレ回数。見当たらない場合はnull" }
  ],
  prompt: `
新ハナビのユニメモ遊技履歴画像から、推測入力に必要な数値だけを読み取ってください。

読み取り対象:
- 基本情報: 総プレイ数、総BB回数、RB回数
- 小役: 風鈴A回数、風鈴B回数、氷A回数、チェリーA2回数、チェリーB回数
- RT詳細: 花火チャレンジ中はずれ回数と確率、花火GAME中はずれ回数と確率
- BB中詳細: 風鈴斜め揃い回数と確率、バラケ目回数
- RB中詳細(小役): 1枚役回数と確率
- RB中詳細(その他): ハズレ回数

総ボーナスではなく、BBは総BB、REGはRBを使ってください。
風鈴合算、氷合算、氷B、チェリー合算、チェリーA1は使わないでください。
BB中詳細で「風鈴斜め揃い」がある場合はbigFurinBに入れてください。「風鈴中段揃い」はbigFurinBに入れないでください。
確率は「1/9.5」のように表示されている場合、分母だけを数値にしてください。
「連チャンBGM」「リーチ目コレクション」「最大成功」「最大神技」「最大獲得枚数」は使わないでください。
見当たらない項目や「1/-」の確率はnullにしてください。
`
};
