import Link from "next/link";

export default function Home() {
  return (
    <main className="page-shell">
      <div className="card">
        <h1 className="title">推測ツールv0.10</h1>
        <Link className="link-button" href="/hanabi">
          ハナビ
        </Link>
      </div>
    </main>
  );
}
