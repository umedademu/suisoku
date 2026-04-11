export type UnimemoFieldKind = "integer" | "rate";

export type UnimemoFieldConfig = {
  key: string;
  kind: UnimemoFieldKind;
  description: string;
};

export type UnimemoMachineConfig = {
  id: string;
  prompt: string;
  fields: UnimemoFieldConfig[];
  defaults?: Record<string, string>;
  successMessage: string;
};
