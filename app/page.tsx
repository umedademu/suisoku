import Link from "next/link";
import { APP_TITLE } from "../lib/app-info";

const machineLinks = [
  { href: "/neoimjugglerex", label: "ネオアイムジャグラーEX" },
  { href: "/myjuggler5", label: "マイジャグラーV" },
  { href: "/gogojuggler3", label: "ゴーゴージャグラー3" },
  { href: "/sfunkyjuggler2", label: "Sファンキージャグラー2" },
  { href: "/smisterjuggler", label: "Sミスタージャグラー" },
  { href: "/jugglergirlsss", label: "ジャグラーガールズSS" },
  { href: "/ultramiraclejuggler", label: "ウルトラミラクルジャグラー" },
  { href: "/lhanabi", label: "スマスロ Lハナビ" },
  { href: "/shinhanabi", label: "新ハナビ" },
  { href: "/hanabi", label: "ハナビBH" },
  { href: "/thunderv", label: "スマスロ サンダーV" },
  { href: "/versusrevis", label: "バーサス リヴァイズ" },
  { href: "/hanahanahouou", label: "ハナハナホウオウ ～天翔～" },
  { href: "/newkinghanahanav", label: "ニューキングハナハナV" },
  { href: "/happyjuggler", label: "ハッピージャグラーVⅢ" }
] as const;

export default function Home() {
  return (
    <main className="page-shell">
      <div className="card">
        <h1 className="title">{APP_TITLE}</h1>
        <div className="link-list">
          {machineLinks.map((machine) => (
            <Link className="link-button" href={machine.href} key={machine.href}>
              {machine.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
