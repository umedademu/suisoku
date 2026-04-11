"use client";

import { useState } from "react";

type UnimemoImageResponse = {
  values?: unknown;
  message?: unknown;
  error?: unknown;
};

type UnimemoImageUploadProps = {
  machine: string;
  onApply: (values: Record<string, string>) => void;
};

function isStringRecord(value: unknown): value is Record<string, string> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every((item) => typeof item === "string")
  );
}

export function UnimemoImageUpload({ machine, onApply }: UnimemoImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsLoading(true);
    setMessage("画像を読み取っています。");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`/api/unimemo/${machine}`, {
        method: "POST",
        body: formData
      });
      const payload = (await response.json()) as UnimemoImageResponse;

      if (!response.ok) {
        throw new Error(
          typeof payload.error === "string" ? payload.error : "画像から入力できませんでした。"
        );
      }

      if (!isStringRecord(payload.values)) {
        throw new Error("画像から入力できる数値を読み取れませんでした。");
      }

      onApply(payload.values);
      setMessage(
        typeof payload.message === "string" ? payload.message : "ユニメモ画像から入力しました。"
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "画像から入力できませんでした。");
    } finally {
      setIsLoading(false);
      event.target.value = "";
    }
  };

  return (
    <section className="unimemo-image-group">
      <p className="unimemo-image-title">ユニメモ画像</p>
      <label className={`unimemo-image-upload${isLoading ? " is-loading" : ""}`}>
        <span>{isLoading ? "読み取り中" : "画像を選択"}</span>
        <input
          accept="image/png,image/jpeg,image/webp"
          className="unimemo-image-input"
          disabled={isLoading}
          type="file"
          onChange={handleChange}
        />
      </label>
      {message ? (
        <p className="unimemo-image-message" role="status">
          {message}
        </p>
      ) : null}
    </section>
  );
}
