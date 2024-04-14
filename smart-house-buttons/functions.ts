import { type SmartHouseTable } from "./table";

const letters: Array<Array<string>> = [
  ["A", "B"],
  ["C", "D"],
  ["E", "F"],
  ["G", "H"],
  ["I", "J"],
  ["K", "L"],
  ["M", "N"],
  ["O", "P"],
];
/*
async function pollLight() {
  // Dupline channel output
  ///const res = await client.readHoldingRegisters(7, 1); // stue midt spot
  // its bitmasks, and each register holds an entire set of 8 outputs
  const outputs = await client.readHoldingRegisters(0, 8); // stue midt spot
  const table = mapDigitalRegistersToKeys(outputs.data);
  console.table(table);
}
*/
export function mapDigitalRegistersToKeys(regs: Array<number>) {
  const table: SmartHouseTable = {};
  for (let i = 0; i < 8; i++) {
    const reg = regs[i];
    for (let j = 0; j < 16; j++) {
      const isOn = reg & Math.pow(2, j);
      const slotName = getSlotName(i, j);
      table[slotName] = !!isOn;
    }
  }
  return table;
}

export function compareTables(
  oldTable: SmartHouseTable,
  newTable: SmartHouseTable,
  onChange?: (key: string, newValue: boolean) => void
) {
  Object.keys(newTable).map((key) => {
    //console.log("comparing", key, oldTable[key], newTable[key]);
    if (oldTable[key] !== newTable[key]) {
      const newValue = newTable[key];
      if (newValue === undefined) return;
      console.log("Change", key, oldTable[key], newValue);

      onChange?.(key, newValue);
    }
  });
}

export function getSlotName(i: number, j: number) {
  // 65 - 90 is uppercase alphabet
  if (!letters[i]) {
    throw new Error("Attempting to access an invalid letter row", {
      cause: i,
    });
  }
  let char = letters[i][0];
  let slot = j + 1;
  if (j >= 8) {
    slot = j - 7;
    char = letters[i][1];
  }
  return `${char}${slot}`;
}

export function debounce<T extends Function>(cb: T, wait = 300) {
  let h: Timer;
  let callable = (...args: any) => {
    clearTimeout(h);
    h = setTimeout(() => cb(...args), wait);
  };
  return <T>(<any>callable);
}

/** Make sure all the ENV parameters are set */
export function assertEnv() {
  const env = process.env;
  const { MQTT_HOST, MQTT_PASSWORD, MQTT_USER, SH_HOST } = env;
  if (!MQTT_HOST || !MQTT_PASSWORD || !MQTT_USER || !SH_HOST) {
    console.log("MQTT_HOST, MQTT_PASSWORD, MQTT_USER and SH_HOST must be set");
    console.log(process.env);
    process.exit(1);
  }
}
