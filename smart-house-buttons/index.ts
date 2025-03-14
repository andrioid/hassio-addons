import { NODE_ID, TRIGGER_TOPIC_PREFIX } from "./constants";
import { assertEnv } from "./functions";
import { HAService } from "./ha.service";
import { SmarthouseService } from "./smarthouse.service";

async function run() {
  console.log("Andri's awful Smarthouse Hack");
  assertEnv();
  const sh = new SmarthouseService();
  await sh.connect();
  const ha = new HAService();
  await ha.connect();

  if (!ha.client) {
    throw new Error("MQTT client not available");
  }
  const mq = ha.client;

  // Configure our devices
  for (let key in sh.table) {
    const topic = `homeassistant/device_automation/${NODE_ID}/${key}/config`;
    const id = `${NODE_ID}/${key}`;
    const payload = {
      automation_type: "trigger",
      type: "button_short_press",
      topic: `${TRIGGER_TOPIC_PREFIX}/${id}/action`,
      subtype: "button_1",

      device: {
        name: `Smarthouse ${key}`,
        identifiers: id,
      },
    };
    mq.publish(topic, JSON.stringify(payload));
  }

  sh.onButtonPress((key) => {
    const id = `${NODE_ID}/${key}`;
    const topic = `${TRIGGER_TOPIC_PREFIX}/${id}/action`;
    mq.publish(topic, "button_click");
  });
}
run();
