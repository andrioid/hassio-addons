import ModbusRTU from "modbus-serial";
import { createInitialTable, type SmartHouseTable } from "./table";

import { compareTables, mapDigitalRegistersToKeys } from "./functions";

const POLL_TIME = 250;
const SH_HOST = process.env.SH_HOST as string; // This is validated elsewhere

type ListenerFn = (key: string, ms: number) => void;

export class SmarthouseService {
  table: SmartHouseTable = createInitialTable();
  client = new ModbusRTU();
  buttonState: Map<
    string,
    {
      pressed: Date | null;
      released: Date | null;
      pressedMs: number | null;
      direction: "up" | "down" | null;
    }
  >;
  listeners: Array<ListenerFn>;

  constructor() {
    this.buttonState = new Map();
    this.listeners = [];
  }

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
      await this.pollButtons();
      //await pollLight();
    }, POLL_TIME);
  }

  // When the value is true, we need to store pending presses
  // When the value is false, we measure how long it was pressed and create an event

  // Subscription callback by the parent
  onButtonPress(fn: ListenerFn) {
    this.listeners.push(fn);
  }

  private async pollButtons() {
    const inputs = await this.client.readHoldingRegisters(16, 8);
    const table = mapDigitalRegistersToKeys(inputs.data);
    compareTables(this.table, table, this.handleButtonChange.bind(this));
    this.table = table;
  }

  private handleButtonChange(key: string, isButtonPressed: boolean) {
    let button = this.buttonState.get(key);
    if (!button) {
      // If the button is not in the state, we need to create it
      button = {
        pressed: null,
        released: null,
        pressedMs: null,
        direction: null,
      };
      this.buttonState.set(key, button);
    }

    if (isButtonPressed) {
      // Button pressed
      button.pressed = new Date();
      button.direction = button.direction === "up" ? "down" : "up";
      button.pressedMs = 0;
      button.released = null;
    } else {
      // Button released
      button.released = new Date();
      button.pressedMs =
        button.released.getTime() - (button.pressed?.getTime() ?? 0);
      button.pressed = null;
      button.direction = null;
      if (button.pressedMs > 0) {
        console.log(
          `[${key}] Pressed for ${button.pressedMs}ms`,
          key,
          button.pressedMs
        );
        for (const listener of this.listeners) {
          listener(key, button.pressedMs);
        }
      }
    }
    this.buttonState.set(key, button);
  }
}
