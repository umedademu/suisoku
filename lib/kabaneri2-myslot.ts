export function parseMyslotTotalGames(value: string) {
  const normalizedValue = value.normalize("NFKC").replace(/\r\n?/g, "\n");
  const match = normalizedValue.match(
    /(?:^|\n)[^\S\n]*総ゲーム数[^\S\n]*([\d,]+)[^\S\n]*G(?=[^\S\n]*(?:\n|$))/
  );

  if (!match) {
    return null;
  }

  const totalGames = Number(match[1].replace(/,/g, ""));

  return Number.isSafeInteger(totalGames) && totalGames >= 0 ? totalGames : null;
}
