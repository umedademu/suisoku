import Link from "next/link";

export default function Home() {
  return (
    <main className="page-shell">
      <div className="card">
        <h1 className="title">推測ツールv0.58</h1>
        <div className="link-list">
          <Link className="link-button" href="/hanabi">
            ハナビBH
          </Link>
          <Link className="link-button" href="/happyjuggler">
            ハッピージャグラーVⅢ
          </Link>
          <Link className="link-button" href="/lhanabi">
            スマスロ Lハナビ
          </Link>
          <Link className="link-button" href="/shinhanabi">
            新ハナビ
          </Link>
          <Link className="link-button" href="/thunderv">
            スマスロ サンダーV
          </Link>
          <Link className="link-button" href="/versusrevis">
            バーサス リヴァイズ
          </Link>
          <Link className="link-button" href="/hanahanahouou">
            ハナハナホウオウ ～天翔～
          </Link>
          <Link className="link-button" href="/gogojuggler3">
            ゴーゴージャグラー3
          </Link>
          <Link className="link-button" href="/sfunkyjuggler2">
            Sファンキージャグラー2
          </Link>
          <Link className="link-button" href="/smisterjuggler">
            Sミスタージャグラー
          </Link>
          <Link className="link-button" href="/jugglergirlsss">
            ジャグラーガールズSS
          </Link>
          <Link className="link-button" href="/ultramiraclejuggler">
            ウルトラミラクルジャグラー
          </Link>
          <Link className="link-button" href="/myjuggler5">
            マイジャグラーV
          </Link>
          <Link className="link-button" href="/neoimjugglerex">
            ネオアイムジャグラーEX
          </Link>
        </div>
      </div>
    </main>
  );
}
