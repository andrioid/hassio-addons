import mqtt from "mqtt";
import { LISTEN_TOPIC } from "./constants";

export class HAService {
  client?: mqtt.MqttClient;
  constructor() {}

  async connect() {
    this.client = await mqtt.connectAsync(
      `mqtt://${process.env.MQTT_HOST}:1883`,
      {
        username: process.env.MQTT_USER,
        password: process.env.MQTT_PASSWORD,
      }
    );
    console.log("[MQTT] Connected");

    /*
    mqClient.on("connect", () => {
      mqClient.subscribe(LISTEN_TOPIC, (err) => {
        if (err) throw err;
        // TODO: Send configuration w. trigger topics
      });
    });

    mqClient.on("message", (topic, message) => {
      // message is Buffer
      console.log(message.toString());
      mqClient.end();
    });
    */
  }
}
