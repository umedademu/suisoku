"use client";

import { useEffect, useRef, useState } from "react";

const SAVE_SLOT_NUMBERS = [1, 2, 3, 4, 5];
const NON_ADDITIVE_INPUT_KEYS = new Set(["medalRent", "exchangeRate", "strategyRate", "payoutMode"]);

type SaveSlotPayload = {
  inputValues?: unknown;
  inputMode?: unknown;
  savedAt?: unknown;
};

type UseSaveSlotsOptions<TValues extends Record<string, unknown>, TMode extends string> = {
  storageKey: string;
  inputValues: TValues;
  initialValues: TValues;
  isReady?: boolean;
  inputMode?: TMode;
  initialInputMode?: TMode;
  isValidInputValue?: (key: string, value: unknown) => boolean;
  isValidMode?: (value: unknown) => value is TMode;
  onLoad: (nextValues: TValues) => void;
  onLoadMode?: (nextMode: TMode) => void;
};

type SaveSlotControlsProps = {
  selectedSlots: number[];
  savedSlots: number[];
  message: string;
  onSelectSlot: (slot: number) => void;
};

type NormalizedSaveSlot<TValues extends Record<string, unknown>> = {
  slot: number;
  values: TValues;
  payload: SaveSlotPayload | null;
  hasSavedValues: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getSaveSlotStorageKey(storageKey: string, slot: number) {
  return `${storageKey}-slot-${slot}`;
}

function getSavedSlotNumbers(storageKey: string) {
  return SAVE_SLOT_NUMBERS.filter((slot) => window.localStorage.getItem(getSaveSlotStorageKey(storageKey, slot)));
}

function getFallbackSaveSlot(savedSlots: number[]) {
  return savedSlots[0] ?? SAVE_SLOT_NUMBERS[0];
}

function areInputValuesEqual<TValues extends Record<string, unknown>>(firstValues: TValues, secondValues: TValues) {
  const keys = new Set([...Object.keys(firstValues), ...Object.keys(secondValues)]);

  return Array.from(keys).every((key) => firstValues[key] === secondValues[key]);
}

function formatMergedNumber(value: number) {
  const rounded = Math.round(value * 1000000) / 1000000;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

function toFiniteNumber(value: unknown) {
  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

function isMergedRateKey(key: string) {
  return key.endsWith("Rate") && !NON_ADDITIVE_INPUT_KEYS.has(key);
}

function readSaveSlotPayload(storageKey: string, slot: number): SaveSlotPayload | null {
  const raw = window.localStorage.getItem(getSaveSlotStorageKey(storageKey, slot));

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeSaveSlotPayload<TValues extends Record<string, unknown>, TMode extends string>(
  storageKey: string,
  slot: number,
  inputValues: TValues,
  inputMode?: TMode
) {
  window.localStorage.setItem(
    getSaveSlotStorageKey(storageKey, slot),
    JSON.stringify({
      inputValues,
      ...(inputMode !== undefined ? { inputMode } : {}),
      savedAt: new Date().toISOString()
    })
  );
}

function normalizeInputValues<TValues extends Record<string, unknown>>(
  initialValues: TValues,
  savedValues: unknown,
  isValidInputValue: (key: string, value: unknown) => boolean
) {
  const nextValues = { ...initialValues };

  if (!isRecord(savedValues)) {
    return nextValues;
  }

  const writableValues = nextValues as Record<string, unknown>;

  Object.entries(savedValues).forEach(([key, value]) => {
    if (Object.prototype.hasOwnProperty.call(nextValues, key) && isValidInputValue(key, value)) {
      writableValues[key] = value;
    }
  });

  return nextValues;
}

function readNormalizedSaveSlot<TValues extends Record<string, unknown>>(
  storageKey: string,
  slot: number,
  initialValues: TValues,
  isValidInputValue: (key: string, value: unknown) => boolean
): NormalizedSaveSlot<TValues> {
  const payload = readSaveSlotPayload(storageKey, slot);
  const hasSavedValues = Boolean(payload && isRecord(payload.inputValues));

  return {
    slot,
    payload,
    hasSavedValues,
    values: hasSavedValues
      ? normalizeInputValues(initialValues, payload?.inputValues, isValidInputValue)
      : { ...initialValues }
  };
}

function mergeInputValues<TValues extends Record<string, unknown>>(
  initialValues: TValues,
  slots: Array<NormalizedSaveSlot<TValues>>
) {
  const nextValues = { ...initialValues };
  const writableValues = nextValues as Record<string, unknown>;

  Object.keys(initialValues).forEach((key) => {
    if (NON_ADDITIVE_INPUT_KEYS.has(key)) {
      const firstSavedValue = slots
        .filter((slot) => slot.hasSavedValues)
        .map((slot) => slot.values[key])
        .find((value) => typeof value === "string" && value.trim() !== "");

      if (firstSavedValue !== undefined) {
        writableValues[key] = firstSavedValue;
      }

      return;
    }

    if (isMergedRateKey(key)) {
      const countKey = key.slice(0, -"Rate".length);
      const totalCount = slots.reduce((sum, slot) => sum + (toFiniteNumber(slot.values[countKey]) ?? 0), 0);
      const totalBase = slots.reduce((sum, slot) => {
        const count = toFiniteNumber(slot.values[countKey]);
        const rate = toFiniteNumber(slot.values[key]);
        return count !== null && rate !== null ? sum + count * rate : sum;
      }, 0);

      writableValues[key] = totalCount > 0 && totalBase > 0 ? formatMergedNumber(totalBase / totalCount) : "";
      return;
    }

    const total = slots.reduce((sum, slot) => sum + (toFiniteNumber(slot.values[key]) ?? 0), 0);
    const hasNumberValue = slots.some((slot) => toFiniteNumber(slot.values[key]) !== null);

    if (hasNumberValue) {
      writableValues[key] = formatMergedNumber(total);
    }
  });

  return nextValues;
}

export function useSaveSlots<TValues extends Record<string, unknown>, TMode extends string = string>({
  storageKey,
  inputValues,
  initialValues,
  isReady = true,
  inputMode,
  initialInputMode,
  isValidInputValue = (_key, value) => typeof value === "string",
  isValidMode,
  onLoad,
  onLoadMode
}: UseSaveSlotsOptions<TValues, TMode>) {
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [savedSlots, setSavedSlots] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  const skipNextAutoSaveRef = useRef(false);

  useEffect(() => {
    setSavedSlots(getSavedSlotNumbers(storageKey));
  }, [storageKey]);

  useEffect(() => {
    if (!isReady || activeSlot === null || selectedSlots.length !== 1 || selectedSlots[0] !== activeSlot) {
      return;
    }

    if (skipNextAutoSaveRef.current) {
      skipNextAutoSaveRef.current = false;
      return;
    }

    try {
      writeSaveSlotPayload(storageKey, activeSlot, inputValues, inputMode);
      setSavedSlots((current) =>
        current.includes(activeSlot) ? current : [...current, activeSlot].sort((first, second) => first - second)
      );
    } catch {
      setMessage("自動保存できませんでした。");
    }
  }, [activeSlot, inputMode, inputValues, isReady, selectedSlots, storageKey]);

  const refreshSavedSlots = () => {
    setSavedSlots(getSavedSlotNumbers(storageKey));
  };

  const applyInputMode = (slots: Array<NormalizedSaveSlot<TValues>>) => {
    if (!onLoadMode) {
      return;
    }

    const nextMode = slots
      .map((slot) => slot.payload?.inputMode)
      .find((value): value is TMode => Boolean(isValidMode?.(value)));

    if (nextMode) {
      onLoadMode(nextMode);
      return;
    }

    if (initialInputMode !== undefined) {
      onLoadMode(initialInputMode);
    }
  };

  const loadSlots = (slots: number[]) => {
    skipNextAutoSaveRef.current = true;

    if (slots.length === 0) {
      onLoad({ ...initialValues });
      applyInputMode([]);
      setMessage("");
      return;
    }

    const normalizedSlots = slots.map((slot) =>
      readNormalizedSaveSlot(storageKey, slot, initialValues, isValidInputValue)
    );

    if (normalizedSlots.length === 1) {
      onLoad(normalizedSlots[0].values);
      applyInputMode(normalizedSlots);
      setMessage(
        normalizedSlots[0].hasSavedValues
          ? `保存${normalizedSlots[0].slot}を読み込みました。`
          : `保存${normalizedSlots[0].slot}を表示しました。`
      );
      return;
    }

    onLoad(mergeInputValues(initialValues, normalizedSlots));
    applyInputMode(normalizedSlots);
    setMessage(`${normalizedSlots.map((slot) => `保存${slot.slot}`).join("、")}を合算しました。`);
  };

  useEffect(() => {
    if (!isReady || selectedSlots.length > 0) {
      return;
    }

    const nextSavedSlots = getSavedSlotNumbers(storageKey);
    const nextSlot = getFallbackSaveSlot(nextSavedSlots);

    setSavedSlots(nextSavedSlots);
    setSelectedSlots([nextSlot]);
    setActiveSlot(nextSlot);

    if (nextSavedSlots.includes(nextSlot)) {
      loadSlots([nextSlot]);
      return;
    }

    skipNextAutoSaveRef.current = true;
    setMessage(`保存${nextSlot}を表示しました。`);

    const hasChangedInputValues = !areInputValuesEqual(inputValues, initialValues);
    const hasChangedInputMode =
      inputMode !== undefined && initialInputMode !== undefined && inputMode !== initialInputMode;

    if (!hasChangedInputValues && !hasChangedInputMode) {
      return;
    }

    try {
      writeSaveSlotPayload(storageKey, nextSlot, inputValues, inputMode);
      setSavedSlots([nextSlot]);
      setMessage(`保存${nextSlot}を選択しました。`);
    } catch {
      setMessage("自動保存できませんでした。");
    }
  }, [initialInputMode, initialValues, inputMode, inputValues, isReady, selectedSlots.length, storageKey]);

  const handleSelectSlot = (slot: number) => {
    if (selectedSlots.length === 1 && selectedSlots[0] === slot) {
      setActiveSlot(slot);
      return;
    }

    const nextSlots = selectedSlots.includes(slot)
      ? selectedSlots.filter((selectedSlot) => selectedSlot !== slot)
      : [...selectedSlots, slot].sort((first, second) => first - second);
    const nextActiveSlot = nextSlots.includes(slot) ? slot : nextSlots.length === 1 ? nextSlots[0] : null;

    setActiveSlot(nextActiveSlot);
    setSelectedSlots(nextSlots);
    loadSlots(nextSlots);
  };

  const handleClearCurrentData = () => {
    skipNextAutoSaveRef.current = true;

    try {
      if (activeSlot !== null && selectedSlots.length === 1 && selectedSlots[0] === activeSlot) {
        window.localStorage.removeItem(getSaveSlotStorageKey(storageKey, activeSlot));
        refreshSavedSlots();
        onLoad({ ...initialValues });
        applyInputMode([]);
        setMessage(`保存${activeSlot}をクリアしました。`);
        return;
      }

      const fallbackSlot = activeSlot ?? selectedSlots[0] ?? getFallbackSaveSlot(savedSlots);
      const fallbackPayload = readSaveSlotPayload(storageKey, fallbackSlot);

      setSelectedSlots([fallbackSlot]);
      setActiveSlot(fallbackSlot);

      if (fallbackPayload && isRecord(fallbackPayload.inputValues)) {
        loadSlots([fallbackSlot]);
      } else {
        onLoad({ ...initialValues });
        applyInputMode([]);
        setMessage(`保存${fallbackSlot}を表示しました。`);
      }
    } catch {
      setMessage("クリアできませんでした。");
    }
  };

  const handleClearAllData = () => {
    skipNextAutoSaveRef.current = true;

    try {
      SAVE_SLOT_NUMBERS.forEach((slot) => {
        window.localStorage.removeItem(getSaveSlotStorageKey(storageKey, slot));
      });
      setSelectedSlots([SAVE_SLOT_NUMBERS[0]]);
      setActiveSlot(SAVE_SLOT_NUMBERS[0]);
      refreshSavedSlots();
      onLoad({ ...initialValues });
      applyInputMode([]);
      setMessage("全てクリアし、保存1を表示しました。");
    } catch {
      setMessage("全てクリアできませんでした。");
    }
  };

  return {
    selectedSlots,
    savedSlots,
    message,
    onSelectSlot: handleSelectSlot,
    onClearCurrentData: handleClearCurrentData,
    onClearAllData: handleClearAllData
  };
}

export function SaveSlotControls({
  selectedSlots,
  savedSlots,
  message,
  onSelectSlot
}: SaveSlotControlsProps) {
  const savedSlotSet = new Set(savedSlots);

  return (
    <section className="save-slot-group" aria-label="保存データ">
      <p className="save-slot-title">保存データ</p>
      <div className="save-slot-list">
        {SAVE_SLOT_NUMBERS.map((slot) => {
          const isSelected = selectedSlots.includes(slot);
          const isSaved = savedSlotSet.has(slot);

          return (
            <button
              aria-pressed={isSelected}
              className={`save-slot-button${isSelected ? " is-active" : ""}${isSaved ? " is-saved" : ""}`}
              key={slot}
              type="button"
              onClick={() => onSelectSlot(slot)}
            >
              保存{slot}
            </button>
          );
        })}
      </div>
      {message ? (
        <p className="save-slot-message" role="status">
          {message}
        </p>
      ) : null}
    </section>
  );
}
