import { UnimemoMachineConfig } from "../types";

export const versusrevisUnimemoConfig: UnimemoMachineConfig = {
  id: "versusrevis",
  successMessage: "ユニメモ画像から入力しました。",
  defaults: {
    beforeGames: "0",
    beforeBig: "0",
    beforeReg: "0"
  },
  fields: [
    { key: "currentGames", kind: "integer", description: "総プレイ数。例: 310" },
    { key: "currentBig", kind: "integer", description: "総BB回数。XBBや赤7BBを含めたBB合計。例: 0" },
    { key: "currentReg", kind: "integer", description: "RB回数。例: 1" },
    { key: "bellA", kind: "integer", description: "小役のベルA回数。例: 25" },
    { key: "bellB", kind: "integer", description: "小役のベルB回数。例: 11" },
    { key: "suikaA", kind: "integer", description: "小役のスイカA回数。例: 8" },
    { key: "cherryB", kind: "integer", description: "小役のチェリーB回数。例: 7" },
    { key: "chanceHazure", kind: "integer", description: "RT詳細のVSチャンス中はずれ回数。例: 0" },
    { key: "chanceHazureRate", kind: "rate", description: "VSチャンス中はずれ確率の分母。1/5.0なら5.0" },
    { key: "gameHazure", kind: "integer", description: "RT詳細のVSGAME中はずれ回数。例: 0" },
    { key: "gameHazureRate", kind: "rate", description: "VSGAME中はずれ確率の分母。1/10.0なら10.0" },
    { key: "bigBell", kind: "integer", description: "BB中詳細のベル回数。例: 0" },
    { key: "bigBellRate", kind: "rate", description: "BB中詳細のベル確率の分母。1/1.1なら1.1" },
    { key: "bigCherryBell", kind: "integer", description: "BB中詳細のチェリー+ベル揃い回数。例: 0" },
    { key: "bigCherry", kind: "integer", description: "BB中詳細のチェリー+ベルはずれ回数、または角チェリー回数。例: 0" },
    { key: "bigMidCherry", kind: "integer", description: "BB中詳細の中段チェリー回数。見当たらない場合はnull" },
    { key: "regOneRole", kind: "integer", description: "RB中詳細(小役)の1枚役回数。例: 4" },
    { key: "regOneRoleRate", kind: "rate", description: "RB中詳細(小役)の1枚役確率の分母。1/3.0なら3.0" },
    { key: "regHazure", kind: "integer", description: "RB中詳細(小役)のハズレ回数。Xベルは使わない。見当たらない場合はnull" }
  ],
  prompt: `
バーサス リヴァイズのユニメモ遊技履歴画像から、推測入力に必要な数値だけを読み取ってください。

読み取り対象:
- 基本情報: 総プレイ数、総BB回数、RB回数
- 小役: ベルA回数、ベルB回数、スイカA回数、チェリーB回数
- RT詳細: VSチャンス中はずれ回数と確率、VSGAME中はずれ回数と確率
- BB中詳細: ベル回数と確率、チェリー+ベル揃い回数、チェリー+ベルはずれ回数、中段チェリー回数
- RB中詳細(小役): 1枚役回数と確率、ハズレ回数

総ボーナスではなく、BBは総BB、REGはRBを使ってください。
ベル合算、スイカ合算、チェリー合算、チェリーAは使わないでください。
RB中詳細のXベルはregHazureに入れず、ハズレが見当たらない場合はnullにしてください。
確率は「1/3.0」のように表示されている場合、分母だけを数値にしてください。
「リーチ目スコア」「連チャンBGM」「リーチ目コレクション」「最大獲得枚数」は使わないでください。
見当たらない項目や「1/-」の確率はnullにしてください。
`
};
