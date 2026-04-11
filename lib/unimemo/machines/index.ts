import { lhanabiUnimemoConfig } from "./lhanabi";
import { shinhanabiUnimemoConfig } from "./shinhanabi";
import { thundervUnimemoConfig } from "./thunderv";
import { versusrevisUnimemoConfig } from "./versusrevis";

const machineConfigs = {
  lhanabi: lhanabiUnimemoConfig,
  shinhanabi: shinhanabiUnimemoConfig,
  thunderv: thundervUnimemoConfig,
  versusrevis: versusrevisUnimemoConfig
};

export function getUnimemoMachineConfig(machine: string) {
  return machineConfigs[machine as keyof typeof machineConfigs] ?? null;
}
