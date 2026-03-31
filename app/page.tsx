import Link from "next/link";

export default function Home() {
  return (
    <main className="page-shell">
      <div className="card">
        <h1 className="title">推測ツールv0.31</h1>
        <div className="link-list">
          <Link className="link-button" href="/hanabi">
            ハナビBH
          </Link>
          <Link className="link-button" href="/lhanabi">
            スマスロ Lハナビ
          </Link>
        </div>
      </div>
    </main>
  );
}
