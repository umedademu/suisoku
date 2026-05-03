import Link from "next/link";
import { APP_TITLE } from "../lib/app-info";

const machineLinks = [
  { href: "/neoimjugglerex", label: "ネオアイムジャグラーEX", isJuggler: true },
  { href: "/myjuggler5", label: "マイジャグラーV", isJuggler: true },
  { href: "/gogojuggler3", label: "ゴーゴージャグラー3", isJuggler: true },
  { href: "/sfunkyjuggler2", label: "Sファンキージャグラー2", isJuggler: true },
  { href: "/smisterjuggler", label: "Sミスタージャグラー", isJuggler: true },
  { href: "/jugglergirlsss", label: "ジャグラーガールズSS", isJuggler: true },
  { href: "/ultramiraclejuggler", label: "ウルトラミラクルジャグラー", isJuggler: true },
  { href: "/happyjuggler", label: "ハッピージャグラーVⅢ", isJuggler: true },
  { href: "/lhanabi", label: "スマスロ Lハナビ", isJuggler: false },
  { href: "/shinhanabi", label: "新ハナビ", isJuggler: false },
  { href: "/hanabi", label: "ハナビBH", isJuggler: false },
  { href: "/thunderv", label: "スマスロ サンダーV", isJuggler: false },
  { href: "/versusrevis", label: "バーサス リヴァイズ", isJuggler: false },
  { href: "/hanahanahouou", label: "ハナハナホウオウ ～天翔～", isJuggler: false },
  { href: "/newkinghanahanav", label: "ニューキングハナハナV", isJuggler: false }
] as const;

export default function Home() {
  const jugglerLinks = machineLinks.filter((machine) => machine.isJuggler);
  const otherLinks = machineLinks.filter((machine) => !machine.isJuggler);

  return (
    <main className="page-shell">
      <div className="card card-home">
        <h1 className="title">{APP_TITLE}</h1>
        <div className="machine-grid">
          <section className="machine-column">
            <h2 className="machine-column-title">ジャグラー系</h2>
            <div className="link-list link-list-column">
              {jugglerLinks.map((machine) => (
                <Link className="link-button" href={machine.href} key={machine.href}>
                  {machine.label}
                </Link>
              ))}
            </div>
          </section>
          <section className="machine-column">
            <h2 className="machine-column-title">その他</h2>
            <div className="link-list link-list-column">
              {otherLinks.map((machine) => (
                <Link className="link-button" href={machine.href} key={machine.href}>
                  {machine.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
