import { getSlotName } from "./functions";

export type SmartHouseTable = Record<string, boolean>;

export function createInitialTable() {
  let table: SmartHouseTable = {};
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 16; j++) {
      table[getSlotName(i, j)] = false;
    }
  }
  return table;
}
