"use client";

import { useEffect, useRef } from "react";

const ESTIMATE_RESULTS_ID = "estimate-results";

export function MachinePageHeader({
  title,
  onClear,
  onClearAll
}: {
  title: string;
  onClear: () => void;
  onClearAll: () => void;
}) {
  const handleShowResults = () => {
    document.getElementById(ESTIMATE_RESULTS_ID)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  return (
    <>
      <div className="machine-heading-row">
        <a className="top-page-link" href="/">
          TOP
        </a>
        <h1 className="title machine-title">{title}</h1>
      </div>
      <div aria-label="ページ操作" className="machine-header-actions" role="group">
        <button className="clear-button" type="button" onClick={onClear}>
          クリア
        </button>
        <button
          className="clear-button machine-clear-all-button"
          type="button"
          onClick={onClearAll}
        >
          全てクリア
        </button>
        <button
          aria-controls={ESTIMATE_RESULTS_ID}
          className="estimate-button"
          type="button"
          onClick={handleShowResults}
        >
          推測結果
        </button>
      </div>
    </>
  );
}

export function AutoEstimate({
  inputValues,
  isReady,
  calculationKey = "",
  delay = 200
}: {
  inputValues: Record<string, string>;
  isReady: boolean;
  calculationKey?: string;
  delay?: number;
}) {
  const markerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const timer = window.setTimeout(() => {
      markerRef.current?.closest("form")?.requestSubmit();
    }, delay);

    return () => window.clearTimeout(timer);
  }, [calculationKey, delay, inputValues, isReady]);

  return <span aria-hidden="true" hidden ref={markerRef} />;
}
