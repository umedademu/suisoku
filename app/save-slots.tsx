"use client";

import { useEffect, useRef, useState } from "react";

const SAVE_SLOT_NUMBERS = [1, 2, 3, 4, 5];

type SaveSlotPayload = {
  inputValues?: unknown;
  inputMode?: unknown;
  savedAt?: unknown;
};

type SaveSlotNameMap = Record<number, string>;

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
  slotNames: SaveSlotNameMap;
  message: string;
  onSelectSlot: (slot: number) => void;
  onChangeSlotName: (slot: number, name: string) => void;
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

function getSaveSlotNamesStorageKey(storageKey: string) {
  return `${storageKey}-slot-names`;
}

function getDefaultSaveSlotName(slot: number) {
  return `保存${slot}`;
}

function getSaveSlotDisplayName(slotNames: SaveSlotNameMap, slot: number) {
  return slotNames[slot]?.trim() || getDefaultSaveSlotName(slot);
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

function readSaveSlotNames(storageKey: string): SaveSlotNameMap {
  const raw = window.localStorage.getItem(getSaveSlotNamesStorageKey(storageKey));

  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw);

    if (!isRecord(parsed)) {
      return {};
    }

    return SAVE_SLOT_NUMBERS.reduce<SaveSlotNameMap>((slotNames, slot) => {
      const name = parsed[String(slot)];

      if (typeof name === "string" && name.trim() !== "") {
        slotNames[slot] = name;
      }

      return slotNames;
    }, {});
  } catch {
    return {};
  }
}

function writeSaveSlotNames(storageKey: string, slotNames: SaveSlotNameMap) {
  const writableSlotNames = SAVE_SLOT_NUMBERS.reduce<Record<string, string>>((nextSlotNames, slot) => {
    const name = slotNames[slot];

    if (typeof name === "string" && name.trim() !== "") {
      nextSlotNames[String(slot)] = name;
    }

    return nextSlotNames;
  }, {});

  if (Object.keys(writableSlotNames).length === 0) {
    window.localStorage.removeItem(getSaveSlotNamesStorageKey(storageKey));
    return;
  }

  window.localStorage.setItem(getSaveSlotNamesStorageKey(storageKey), JSON.stringify(writableSlotNames));
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

// 保存データは常に1つだけ選択し、選択中の保存データの内容だけを入力欄へ表示して推測する
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
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [savedSlots, setSavedSlots] = useState<number[]>([]);
  const [slotNames, setSlotNames] = useState<SaveSlotNameMap>({});
  const [message, setMessage] = useState("");
  const skipNextAutoSaveRef = useRef(false);
  const slotNamesRef = useRef<SaveSlotNameMap>({});

  useEffect(() => {
    const nextSlotNames = readSaveSlotNames(storageKey);

    setSavedSlots(getSavedSlotNumbers(storageKey));
    setSlotNames(nextSlotNames);
    slotNamesRef.current = nextSlotNames;
  }, [storageKey]);

  useEffect(() => {
    if (!isReady || activeSlot === null) {
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
  }, [activeSlot, inputMode, inputValues, isReady, storageKey]);

  const refreshSavedSlots = () => {
    setSavedSlots(getSavedSlotNumbers(storageKey));
  };

  const handleChangeSlotName = (slot: number, name: string) => {
    const nextSlotNames = { ...slotNamesRef.current };

    if (name.trim() === "") {
      delete nextSlotNames[slot];
    } else {
      nextSlotNames[slot] = name;
    }

    writeSaveSlotNames(storageKey, nextSlotNames);
    slotNamesRef.current = nextSlotNames;
    setSlotNames(nextSlotNames);
  };

  const applyInputMode = (payload: SaveSlotPayload | null) => {
    if (!onLoadMode) {
      return;
    }

    const savedMode = payload?.inputMode;

    if (isValidMode?.(savedMode)) {
      onLoadMode(savedMode);
      return;
    }

    if (initialInputMode !== undefined) {
      onLoadMode(initialInputMode);
    }
  };

  const loadSlot = (slot: number) => {
    skipNextAutoSaveRef.current = true;

    const normalizedSlot = readNormalizedSaveSlot(storageKey, slot, initialValues, isValidInputValue);

    onLoad(normalizedSlot.values);
    applyInputMode(normalizedSlot.payload);
    setMessage(
      normalizedSlot.hasSavedValues ? `保存${slot}を読み込みました。` : `保存${slot}を表示しました。`
    );
  };

  useEffect(() => {
    if (!isReady || activeSlot !== null) {
      return;
    }

    const nextSavedSlots = getSavedSlotNumbers(storageKey);
    const nextSlot = getFallbackSaveSlot(nextSavedSlots);

    setSavedSlots(nextSavedSlots);
    setActiveSlot(nextSlot);

    if (nextSavedSlots.includes(nextSlot)) {
      loadSlot(nextSlot);
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
  }, [activeSlot, initialInputMode, initialValues, inputMode, inputValues, isReady, storageKey]);

  // 別の保存データを押すと選択を切り替え、選択中の保存データをもう一度押しても何もしない
  const handleSelectSlot = (slot: number) => {
    if (activeSlot === slot) {
      return;
    }

    setActiveSlot(slot);
    loadSlot(slot);
  };

  const handleClearCurrentData = () => {
    skipNextAutoSaveRef.current = true;

    const targetSlot = activeSlot ?? getFallbackSaveSlot(savedSlots);

    try {
      window.localStorage.removeItem(getSaveSlotStorageKey(storageKey, targetSlot));
      handleChangeSlotName(targetSlot, "");
      setActiveSlot(targetSlot);
      refreshSavedSlots();
      onLoad({ ...initialValues });
      applyInputMode(null);
      setMessage(`保存${targetSlot}をクリアしました。`);
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
      window.localStorage.removeItem(getSaveSlotNamesStorageKey(storageKey));
      setActiveSlot(SAVE_SLOT_NUMBERS[0]);
      slotNamesRef.current = {};
      setSlotNames({});
      refreshSavedSlots();
      onLoad({ ...initialValues });
      applyInputMode(null);
      setMessage("全てクリアし、保存1を表示しました。");
    } catch {
      setMessage("全てクリアできませんでした。");
    }
  };

  return {
    selectedSlots: activeSlot === null ? [] : [activeSlot],
    savedSlots,
    slotNames,
    message,
    onSelectSlot: handleSelectSlot,
    onChangeSlotName: handleChangeSlotName,
    onClearCurrentData: handleClearCurrentData,
    onClearAllData: handleClearAllData
  };
}

export function SaveSlotControls({
  selectedSlots,
  savedSlots,
  slotNames,
  message,
  onSelectSlot,
  onChangeSlotName
}: SaveSlotControlsProps) {
  const savedSlotSet = new Set(savedSlots);

  return (
    <section className="save-slot-group" aria-label="保存データ">
      <p className="save-slot-title">保存データ</p>
      <div className="save-slot-list">
        {SAVE_SLOT_NUMBERS.map((slot) => {
          const isSelected = selectedSlots.includes(slot);
          const isSaved = savedSlotSet.has(slot);
          const defaultName = getDefaultSaveSlotName(slot);
          const displayName = getSaveSlotDisplayName(slotNames, slot);

          return (
            <div className="save-slot-item" key={slot}>
              <button
                aria-pressed={isSelected}
                className={`save-slot-button${isSelected ? " is-active" : ""}${isSaved ? " is-saved" : ""}`}
                title={displayName}
                type="button"
                onClick={() => onSelectSlot(slot)}
              >
                {displayName}
              </button>
              <input
                aria-label={`${defaultName}の名前`}
                className="save-slot-name-input"
                maxLength={30}
                placeholder={defaultName}
                type="text"
                value={slotNames[slot] ?? ""}
                onChange={(event) => onChangeSlotName(slot, event.currentTarget.value)}
              />
            </div>
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
