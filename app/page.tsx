import Link from "next/link";

export default function Home() {
  return (
    <main className="page-shell">
      <div className="card">
        <h1 className="title">推測ツールv0.36</h1>
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
        </div>
      </div>
    </main>
  );
}
