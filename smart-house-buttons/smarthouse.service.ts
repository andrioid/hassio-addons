import ModbusRTU from "modbus-serial";
import { createInitialTable, type SmartHouseTable } from "./table";

import { NODE_ID, TRIGGER_TOPIC_PREFIX } from "./constants";
import {
  compareTables,
  debounce,
  mapDigitalRegistersToKeys,
} from "./functions";

const POLL_TIME = 250;
const SH_HOST = process.env.SH_HOST as string; // This is validated elsewhere

type ListenerFn = (key: string, newValue: boolean) => void;

export class SmarthouseService {
  table: SmartHouseTable = createInitialTable();
  client = new ModbusRTU();
  listeners: Array<ListenerFn> = [];

  constructor() {}

  async connect() {
    const client = this.client;
    await client.connectTCP(SH_HOST, { port: 502 });
    console.log("[SmartHouse] Connected");
    client.setID(1);
    client.setTimeout(5000);
    client.on("error", (err) => {
      console.error(err);
    });

    setInterval(async () => {
      await this.pollButton((key, val) => {
        this.listeners.forEach(async (listener) => {
          listener(key, val);
        });
      });
      //await pollLight();
    }, POLL_TIME);
  }

  subscribe(listenerFn: ListenerFn) {
    // We're only interested in one event per button click
    const lfn = debounce(listenerFn);
    this.listeners.push(lfn);
  }
  unsubscribe() {}

  async pollButton(onChange?: ListenerFn) {
    //const buttonPresses = await client.readDiscreteInputs(1586, 1);
    const inputs = await this.client.readHoldingRegisters(16, 8);
    //console.log("inputs", inputs.data);
    const table = mapDigitalRegistersToKeys(inputs.data);
    compareTables(this.table, table, onChange);
    this.table = table;

    //console.table(table);
  }
}
