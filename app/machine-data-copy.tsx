"use client";

import { useEffect, useRef, useState } from "react";

// 画面に表示中の入力内容と推測結果を読み取り、議論や記録に使えるテキストへまとめる。
// 機種ごとの独自部品は次の目印で読み取り方を指定する。
//   data-copy-label / data-copy-value : 「ラベル: 値」の1行として出力（ボタン内の回数など）。値が空なら出力しない
//   data-copy-block                   : 折りたたみ中の行も含めた全文を、非表示のままそのまま出力
//   data-copy-skip                    : コピー対象から外す
const ESTIMATE_RESULTS_ID = "estimate-results";

function cleanText(value: string | null | undefined) {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function isVisible(element: Element) {
  if (element instanceof HTMLElement && element.hidden) {
    return false;
  }

  const style = window.getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden";
}

// 表のセルは表示どおりの区切りを残すため innerText を使い、削除ボタンなどは除く
function getCellText(cell: Element) {
  const parts = Array.from(cell.childNodes).map((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent ?? "";
    }

    if (
      !(node instanceof HTMLElement) ||
      node instanceof HTMLButtonElement ||
      node.matches("[data-copy-skip]")
    ) {
      return "";
    }

    return node.innerText;
  });

  return cleanText(parts.join(" ")) || "-";
}

function getTableLines(table: HTMLTableElement) {
  return Array.from(table.rows).map((row) =>
    Array.from(row.cells).map(getCellText).join(" | ")
  );
}

function getFieldLabel(field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) {
  const ariaLabel = cleanText(field.getAttribute("aria-label"));

  if (ariaLabel) {
    return ariaLabel;
  }

  let label = cleanText(field.closest(".input-field")?.querySelector(".input-label")?.textContent);

  if (!label) {
    const wrappingLabel = field.closest("label");

    if (wrappingLabel) {
      const clone = wrappingLabel.cloneNode(true) as Element;
      clone
        .querySelectorAll("input, textarea, select, .input-unit, .input-live-text")
        .forEach((node) => node.remove());
      label = cleanText(clone.textContent);
    }
  }

  const pieceLabel = cleanText(
    field.closest(".piece-input-row")?.querySelector(".piece-input-label")?.textContent
  );

  if (pieceLabel && !label.includes(pieceLabel)) {
    label = `${pieceLabel} ${label}`;
  }

  return label || "入力";
}

function collectInputLines(root: Element) {
  const lines: string[] = [];
  let pendingTitle: string | null = null;

  // 見出しは中身が1行以上あるときだけ出力し、空の入力欄の見出しを残さない
  const emit = (line: string) => {
    if (pendingTitle !== null) {
      if (lines.length > 0) {
        lines.push("");
      }

      lines.push(pendingTitle);
      pendingTitle = null;
    }

    lines.push(line);
  };

  const walk = (element: Element) => {
    if (element.matches("[data-copy-skip]")) {
      return;
    }

    const copyBlock = element.getAttribute("data-copy-block");

    if (copyBlock !== null) {
      if (copyBlock.trim()) {
        emit(copyBlock);
      }

      return;
    }

    if (!isVisible(element)) {
      return;
    }

    const copyLabel = element.getAttribute("data-copy-label");

    if (copyLabel !== null) {
      // 値が空の目印は「まだ入力がない」扱いとし、0回の行などを出力しない
      const copyValue = element.getAttribute("data-copy-value") ?? "";

      if (copyValue) {
        emit(`${copyLabel}: ${copyValue}`);
      }

      return;
    }

    if (element.matches(".group-title")) {
      pendingTitle = `【${cleanText(element.textContent).replace(/^【\s*|\s*】$/g, "")}】`;
      return;
    }

    if (element instanceof HTMLInputElement) {
      if (element.type === "radio") {
        if (element.checked) {
          const groupLabel =
            cleanText(element.closest(".mode-switch")?.querySelector(".mode-switch-label")?.textContent) ||
            "選択";
          emit(`${groupLabel}: ${cleanText(element.closest("label")?.textContent ?? element.value)}`);
        }

        return;
      }

      if (element.type === "checkbox") {
        emit(`${getFieldLabel(element)}: ${element.checked ? "ON" : "OFF"}`);
        return;
      }

      if (cleanText(element.value) !== "" && ["number", "text", "tel"].includes(element.type)) {
        const unit = cleanText(element.parentElement?.querySelector(".input-unit")?.textContent);
        emit(`${getFieldLabel(element)}: ${element.value}${unit}`);
      }

      return;
    }

    if (element instanceof HTMLTextAreaElement) {
      const value = element.value.trim();

      if (value) {
        emit(`${getFieldLabel(element)}:\n${value}`);
      }

      return;
    }

    if (element instanceof HTMLSelectElement) {
      emit(`${getFieldLabel(element)}: ${cleanText(element.selectedOptions[0]?.textContent)}`);
      return;
    }

    if (element instanceof HTMLTableElement) {
      getTableLines(element).forEach(emit);
      return;
    }

    // ボタンや集計表示は入力そのものではないため、目印がない限り出力しない
    if (
      element instanceof HTMLButtonElement ||
      element instanceof HTMLOutputElement ||
      element.getAttribute("role") === "status"
    ) {
      return;
    }

    Array.from(element.children).forEach(walk);
  };

  walk(root);
  return lines;
}

function hasBlockChild(element: Element) {
  return Array.from(element.children).some((child) => {
    const display = window.getComputedStyle(child).display;
    return !display.startsWith("inline") && display !== "contents" && display !== "none";
  });
}

function collectResultLines(element: Element, lines: string[]) {
  if (element.matches("[data-copy-skip], .result-title") || !isVisible(element)) {
    return;
  }

  if (element instanceof HTMLTableElement) {
    lines.push(...getTableLines(element));
    return;
  }

  if (!hasBlockChild(element)) {
    const text = cleanText((element as HTMLElement).innerText);

    if (text) {
      lines.push(text);
    }

    return;
  }

  // 「設定1」「8.81%」のように小さな要素が横に並ぶ行は1行にまとめる
  const isShortRow =
    element.children.length <= 4 &&
    !element.querySelector("table") &&
    Array.from(element.children).every((child) => !hasBlockChild(child));

  if (isShortRow) {
    const text = Array.from(element.children)
      .filter(isVisible)
      .map((child) => cleanText((child as HTMLElement).innerText))
      .filter(Boolean)
      .join(" ");

    if (text) {
      lines.push(text);
    }

    return;
  }

  element.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = cleanText(node.textContent);

      if (text) {
        lines.push(text);
      }
    } else if (node instanceof Element) {
      collectResultLines(node, lines);
    }
  });
}

function formatCopiedAt(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");

  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

function buildMachineDataText(results: Element) {
  const card = results.closest(".card") ?? document.body;
  const title = cleanText(card.querySelector(".machine-title")?.textContent);
  const activeSlot = cleanText(card.querySelector(".save-slot-button.is-active")?.textContent);
  const inputLines: string[] = [];

  // 入力欄は推測結果より前にある要素だけを対象にし、見出し・保存データ・操作ボタンは除く
  for (const child of Array.from(card.children)) {
    if (child === results) {
      break;
    }

    if (child.matches(".machine-heading-row, .machine-header-actions, .save-slot-group")) {
      continue;
    }

    inputLines.push(...collectInputLines(child));
  }

  const resultLines: string[] = [];
  collectResultLines(results, resultLines);

  return [
    `【${title || "推測ツール"}】`,
    `コピー日時: ${formatCopiedAt(new Date())}`,
    ...(activeSlot ? [`保存データ: ${activeSlot}`] : []),
    "",
    "■ 入力内容",
    ...(inputLines.length > 0 ? inputLines : ["（入力なし）"]),
    "",
    "■ 推測結果",
    ...(resultLines.length > 0 ? resultLines : ["（推測結果なし）"])
  ].join("\n");
}

async function writeClipboardText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // クリップボードAPIが使えない環境では、一時的な入力欄を使う従来の方法で再試行する
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();

    try {
      return document.execCommand("copy");
    } catch {
      return false;
    } finally {
      textarea.remove();
    }
  }
}

export function MachineDataCopyButton() {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    },
    []
  );

  const showMessage = (nextMessage: string, nextIsError: boolean) => {
    setMessage(nextMessage);
    setIsError(nextIsError);

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => setMessage(""), 3000);
  };

  const handleCopy = async () => {
    const results = document.getElementById(ESTIMATE_RESULTS_ID);

    if (!results) {
      showMessage("コピーする内容が見つかりませんでした。", true);
      return;
    }

    const copied = await writeClipboardText(buildMachineDataText(results));

    showMessage(
      copied ? "入力内容と推測結果をコピーしました。" : "コピーできませんでした。",
      !copied
    );
  };

  return (
    <div className="data-copy-row" data-copy-skip="">
      <button className="data-copy-button" type="button" onClick={handleCopy}>
        データをテキストでコピー
      </button>
      {message ? (
        <p className={`data-copy-message${isError ? " is-error" : ""}`} role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
