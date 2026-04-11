"use client";

import { useEffect, useState } from "react";

const SAVE_SLOT_NUMBERS = [1, 2, 3, 4, 5];

type SaveSlotPayload = {
  inputValues?: unknown;
  inputMode?: unknown;
  savedAt?: unknown;
};

type UseSaveSlotsOptions<TValues extends Record<string, unknown>, TMode extends string> = {
  storageKey: string;
  inputValues: TValues;
  initialValues: TValues;
  inputMode?: TMode;
  initialInputMode?: TMode;
  isValidInputValue?: (key: string, value: unknown) => boolean;
  isValidMode?: (value: unknown) => value is TMode;
  onLoad: (nextValues: TValues) => void;
  onLoadMode?: (nextMode: TMode) => void;
};

type SaveSlotControlsProps = {
  selectedSlot: number;
  savedSlots: number[];
  message: string;
  onSelectSlot: (slot: number) => void;
  onSaveSlot: () => void;
  onDeleteSlot: () => void;
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

export function useSaveSlots<TValues extends Record<string, unknown>, TMode extends string = string>({
  storageKey,
  inputValues,
  initialValues,
  inputMode,
  initialInputMode,
  isValidInputValue = (_key, value) => typeof value === "string",
  isValidMode,
  onLoad,
  onLoadMode
}: UseSaveSlotsOptions<TValues, TMode>) {
  const [selectedSlot, setSelectedSlot] = useState(1);
  const [savedSlots, setSavedSlots] = useState<number[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setSavedSlots(getSavedSlotNumbers(storageKey));
  }, [storageKey]);

  const refreshSavedSlots = () => {
    setSavedSlots(getSavedSlotNumbers(storageKey));
  };

  const handleSaveSlot = () => {
    try {
      window.localStorage.setItem(
        getSaveSlotStorageKey(storageKey, selectedSlot),
        JSON.stringify({
          inputValues,
          ...(inputMode !== undefined ? { inputMode } : {}),
          savedAt: new Date().toISOString()
        })
      );
      refreshSavedSlots();
      setMessage(`保存${selectedSlot}に保存しました。`);
    } catch {
      setMessage("保存できませんでした。");
    }
  };

  const loadSlot = (slot: number) => {
    const payload = readSaveSlotPayload(storageKey, slot);

    if (!payload || !isRecord(payload.inputValues)) {
      onLoad({ ...initialValues });

      if (onLoadMode && initialInputMode !== undefined) {
        onLoadMode(initialInputMode);
      }

      setMessage(`保存${slot}を表示しました。`);
      return;
    }

    onLoad(normalizeInputValues(initialValues, payload.inputValues, isValidInputValue));

    if (onLoadMode && isValidMode && isValidMode(payload.inputMode)) {
      onLoadMode(payload.inputMode);
    }

    setMessage(`保存${slot}を読み込みました。`);
  };

  const handleSelectSlot = (slot: number) => {
    setSelectedSlot(slot);
    loadSlot(slot);
  };

  const handleDeleteSlot = () => {
    try {
      window.localStorage.removeItem(getSaveSlotStorageKey(storageKey, selectedSlot));
      refreshSavedSlots();
      setMessage(`保存${selectedSlot}を削除しました。`);
    } catch {
      setMessage("削除できませんでした。");
    }
  };

  return {
    selectedSlot,
    savedSlots,
    message,
    onSelectSlot: handleSelectSlot,
    onSaveSlot: handleSaveSlot,
    onDeleteSlot: handleDeleteSlot
  };
}

export function SaveSlotControls({
  selectedSlot,
  savedSlots,
  message,
  onSelectSlot,
  onSaveSlot,
  onDeleteSlot
}: SaveSlotControlsProps) {
  const savedSlotSet = new Set(savedSlots);

  return (
    <section className="save-slot-group" aria-label="保存データ">
      <p className="save-slot-title">保存データ</p>
      <div className="save-slot-list">
        {SAVE_SLOT_NUMBERS.map((slot) => {
          const isSelected = slot === selectedSlot;
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
      <div className="save-slot-action-row">
        <button className="clear-button save-slot-action-button" type="button" onClick={onSaveSlot}>
          保存
        </button>
        <button className="clear-button save-slot-action-button" type="button" onClick={onDeleteSlot}>
          削除
        </button>
      </div>
      {message ? (
        <p className="save-slot-message" role="status">
          {message}
        </p>
      ) : null}
    </section>
  );
}
